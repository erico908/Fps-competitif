import * as THREE from "three";

export function setupScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x20232a);

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.y = 2;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Lumières
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(5, 10, 5);
  scene.add(dir);

  // Sol
  const floorGeo = new THREE.PlaneGeometry(100, 100);
  const floorMat = new THREE.MeshPhongMaterial({ color: 0x555555 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Obstacles
  for (let i = 0; i < 5; i++) {
    const boxGeo = new THREE.BoxGeometry(2, 2, 2);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x883333 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(Math.random() * 30 - 15, 1, Math.random() * 30 - 15);
    scene.add(box);
  }

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { scene, camera, renderer };
}
