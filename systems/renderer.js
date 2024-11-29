import { WebGLRenderer } from 'three';

function createRenderer() {
  // IF SLOW: Remove antialiasing
  const renderer = new WebGLRenderer({ antialias: true });

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  return renderer;
}

export { createRenderer };