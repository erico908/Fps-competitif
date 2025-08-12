let scene, camera, renderer, controls;
let objects = [];

const MAP_SIZE = 200;
const NUM_BOXES = 20;
const playerHeight = 2;

let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let move = { forward: false, backward: false, left: false, right: false };
let canJump = false;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new THREE.PointerLockControls(camera, document.body);
  controls.getObject().position.y = playerHeight;

  // Sol
  const floorGeometry = new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE);
  const floorMaterial = new THREE.MeshStandardMaterial({color:0x555555});
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI/2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Lumière
  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  generateMap();

  // Écoute clavier
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  let prevTime = performance.now();

  function animate() {
    requestAnimationFrame(animate);

    if(controls.isLocked){
      const time = performance.now();
      const delta = (time - prevTime)/1000;

      velocity.x -= velocity.x * 10.0 * delta;
      velocity.z -= velocity.z * 10.0 * delta;
      velocity.y -= 9.8 * 5.0 * delta; // gravité

      direction.z = Number(move.forward) - Number(move.backward);
      direction.x = Number(move.right) - Number(move.left);
      direction.normalize();

      if(move.forward || move.backward) velocity.z -= direction.z * 50.0 * delta;
      if(move.left || move.right) velocity.x -= direction.x * 50.0 * delta;

      controls.moveRight(-velocity.x * delta);
      controls.moveForward(-velocity.z * delta);

      controls.getObject().position.y += velocity.y * delta;

      if(controls.getObject().position.y < playerHeight){
        velocity.y = 0;
        controls.getObject().position.y = playerHeight;
        canJump = true;
      }

      prevTime = time;
    }

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function onKeyDown(event){
  switch(event.code){
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'Space':
      if(canJump){
        velocity.y += 5;
        canJump = false;
      }
      break;
  }
}

function onKeyUp(event){
  switch(event.code){
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
  }
}

function generateMap(){
  objects.forEach(obj => scene.remove(obj));
  objects = [];

  const boxGeometry = new THREE.BoxGeometry(5, 5, 5);
  const boxMaterial = new THREE.MeshStandardMaterial({color:0xff0000});

  for(let i=0; i<NUM_BOXES; i++){
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(
      (Math.random() - 0.5)*MAP_SIZE,
      2.5,
      (Math.random() - 0.5)*MAP_SIZE
    );
    box.castShadow = true;
    scene.add(box);
    objects.push(box);
  }
}

document.getElementById('startBtn').addEventListener('click', () => {
  controls.lock();
  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('regenBtn').style.display = 'block';
});

document.getElementById('regenBtn').addEventListener('click', () => {
  generateMap();
});

init();
