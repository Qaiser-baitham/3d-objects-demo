// ── Scene Setup ──────────────────────────────────────────────────────────────
const canvas   = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

const scene  = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a1a);
scene.fog        = new THREE.Fog(0x0a0a1a, 20, 60);

const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 4, 10);

// ── Orbit Controls ────────────────────────────────────────────────────────────
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance   = 2;
controls.maxDistance   = 40;

// ── Lights ────────────────────────────────────────────────────────────────────
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
scene.add(dirLight);

const pointLight1 = new THREE.PointLight(0x8b5cf6, 2, 20);
pointLight1.position.set(-5, 5, -5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 20);
pointLight2.position.set(5, 3, 5);
scene.add(pointLight2);

// ── Grid Floor ────────────────────────────────────────────────────────────────
const gridHelper = new THREE.GridHelper(30, 30, 0x444466, 0x222244);
scene.add(gridHelper);

// ── Material Helper ───────────────────────────────────────────────────────────
const COLORS = [0x6366f1, 0x8b5cf6, 0x06b6d4, 0xf59e0b, 0x10b981, 0xef4444, 0xec4899];
let colorIndex = 0;

function nextMaterial() {
  const mat = new THREE.MeshStandardMaterial({
    color: COLORS[colorIndex % COLORS.length],
    roughness: 0.3,
    metalness: 0.6,
  });
  colorIndex++;
  return mat;
}

function randomPos() {
  return new THREE.Vector3(
    (Math.random() - 0.5) * 8,
    0.5 + Math.random() * 2,
    (Math.random() - 0.5) * 8
  );
}

// ── Object Factories ──────────────────────────────────────────────────────────
const objects = [];

function addCube() {
  const geo  = new THREE.BoxGeometry(1.2, 1.2, 1.2);
  const mesh = new THREE.Mesh(geo, nextMaterial());
  mesh.position.copy(randomPos());
  mesh.castShadow = true;
  scene.add(mesh);
  objects.push(mesh);
}

function addSphere() {
  const geo  = new THREE.SphereGeometry(0.8, 32, 32);
  const mesh = new THREE.Mesh(geo, nextMaterial());
  mesh.position.copy(randomPop());
  mesh.castShadow = true;
  scene.add(mesh);
  objects.push(mesh);
}

function addCone() {
  const geo  = new THREE.ConeGeometry(0.7, 1.6, 32);
  const mesh = new THREE.Mesh(geo, nextMaterial());
  mesh.position.copy(randomPop());
  mesh.castShadow = true;
  scene.add(mesh);
  objects.push(mesh);
}

function addTorus() {
  const geo  = new THREE.TorusGeometry(0.7, 0.28, 16, 60);
  const mesh = new THREE.Mesh(geo, nextMaterial());
  mesh.position.copy(randomPop());
  mesh.castShadow = true;
  scene.add(mesh);
  objects.push(mesh);
}

function clearScene() {
  objects.forEach(obj => {
    scene.remove(obj);
    obj.geometry.dispose();
    obj.material.dispose();
  });
  objects.length = 0;
  colorIndex = 0;
}

// ── Animate ───────────────────────────────────────────────────────────────────
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  // Slowly rotate each object
  objects.forEach((obj, i) => {
    obj.rotation.x = t * 0.4 + i;
    obj.rotation.y = t * 0.6 + i;
  });

  // Pulsing point lights
  pointLight1.intensity = 1.5 + Math.sin(t * 1.2) * 0.5;
  pointLight2.intensity = 1.5 + Math.cos(t * 0.9) * 0.5;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

// ── Start with a few default objects ─────────────────────────────────────────
addCube();
addSphere();
addCone();
addTorus();
