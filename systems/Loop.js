import { Clock } from "three";

class Loop {
  constructor(camera, scene, renderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    // list of animated objects
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  tick() {
    for (const object of this.updatables) {
      // will run sixty times per second so keep the amount of work done here to a minimum.
      object.tick(this.camera.position);
    }
  }
}

export { Loop };