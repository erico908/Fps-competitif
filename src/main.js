import * as THREE from "three";
import { setupScene } from "./scene.js";
import { Player } from "./player.js";
import { setupHUD, updateHUD } from "./hud.js";

let scene, camera, renderer, player;

init();
animate();

function init() {
  ({ scene, camera, renderer } = setupScene());
  player = new Player(camera, scene);

  setupHUD();
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = player.clock.getDelta();
  player.update(delta);

  updateHUD(player);
  renderer.render(scene, camera);
}
