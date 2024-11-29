import { Clock } from "three";

class Loop {
  constructor(camera, scene, renderer, cssRenderer) {
    this.camera = camera;
    this.scene = scene;
    this.renderer = renderer;
    this.cssRenderer = cssRenderer;
    // list of animated objects
    this.updatables = [];
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();
      // render a frame
      this.renderer.render(this.scene, this.camera);
      this.cssRenderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
    this.cssRenderer.setAnimationLoop(null);
  }

  tick() {
    for (const object of this.updatables) {
      // will run sixty times per second so keep the amount of work done here to a minimum.
      object.tick();
    }
  }
}

export { Loop };