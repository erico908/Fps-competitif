import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

export class Player {
  constructor(camera, scene) {
    this.camera = camera;
    this.scene = scene;
    this.clock = new THREE.Clock();

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.moveForward = this.moveBackward = this.moveLeft = this.moveRight = false;
    this.canJump = false;

    this.controls = new PointerLockControls(camera, document.body);
    document.body.addEventListener("click", () => this.controls.lock());
    scene.add(this.controls.getObject());

    this.raycaster = new THREE.Raycaster();
    this.life = 100;
    this.ammo = 30;

    this.setupKeys();
  }

  setupKeys() {
    const onKeyDown = (e) => {
      switch (e.code) {
        case "ArrowUp": case "KeyW": this.moveForward = true; break;
        case "ArrowLeft": case "KeyA": this.moveLeft = true; break;
        case "ArrowDown": case "KeyS": this.moveBackward = true; break;
        case "ArrowRight": case "KeyD": this.moveRight = true; break;
        case "Space": if (this.canJump) { this.velocity.y += 10; this.canJump = false; } break;
      }
    };

    const onKeyUp = (e) => {
      switch (e.code) {
        case "ArrowUp": case "KeyW": this.moveForward = false; break;
        case "ArrowLeft": case "KeyA": this.moveLeft = false; break;
        case "ArrowDown": case "KeyS": this.moveBackward = false; break;
        case "ArrowRight": case "KeyD": this.moveRight = false; break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    document.addEventListener("mousedown", (e) => {
      if (e.button === 0) this.shoot();
    });
  }

  shoot() {
    if (this.ammo <= 0) return;

    this.ammo--;

    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      intersects[0].object.material.color.set(0x00ff00); // feedback simple
    }
  }

  update(delta) {
    if (!this.controls.isLocked) return;

    this.velocity.x -= this.velocity.x * 10.0 * delta;
    this.velocity.z -= this.velocity.z * 10.0 * delta;
    this.velocity.y -= 9.8 * 5.0 * delta; // gravité

    this.direction.z = Number(this.moveForward) - Number(this.moveBackward);
    this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward) this.velocity.z -= this.direction.z * 400.0 * delta;
    if (this.moveLeft || this.moveRight) this.velocity.x -= this.direction.x * 400.0 * delta;

    this.controls.moveRight(-this.velocity.x * delta);
    this.controls.moveForward(-this.velocity.z * delta);
    this.controls.getObject().position.y += this.velocity.y * delta;

    if (this.controls.getObject().position.y < 2) {
      this.velocity.y = 0;
      this.controls.getObject().position.y = 2;
      this.canJump = true;
    }
  }
}
