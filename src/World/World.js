import { createCamera } from '../../components/camera.js';
import { createMainMeshGroup } from '../../components/mainMeshGroup.js';
import { createScene } from '../../components/scene.js';
import { createLights } from '../../components/lights.js';

import { createRenderer } from '../../systems/renderer.js';
import { Resizer } from '../../systems/Resizer.js';
import { Loop } from '../../systems/Loop.js';
import { createControls } from '../../systems/controls.js';

// These variables are module-scoped: we cannot access them
// from outside the module
let camera;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    scene = createScene();
    renderer = createRenderer();
    loop = new Loop(camera, scene, renderer);

    // Adding the canvas to #scene-container.
    container.append(renderer.domElement);

    const controls = createControls(camera, renderer.domElement);

    const meshGroup = createMainMeshGroup(camera.position);
    const { ambientLight, mainLight } = createLights();

    // Continuous mesh rotation
    loop.updatables.push(...meshGroup.children?.filter(child => child.isGroup));
    loop.updatables.push(controls);

    scene.add(ambientLight, mainLight, meshGroup);

    const resizer = new Resizer(container, camera, renderer);
    // Don't need if we have the animation loop.
    // resizer.onResize = () => {
    //   this.render();
    // };
  }

  render() {
    // draw a single frame
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }
  
  stop() {
    loop.stop();
  }
}

export { World };