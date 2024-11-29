import { Color, Scene } from 'three';

function createScene() {
  const scene = new Scene();

  scene.background = new Color('#1D2021');

  return scene;
}

export { createScene };