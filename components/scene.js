import { Scene } from 'three';
import { bgColor } from '../utils/colorPalette.js';

function createScene() {
  const scene = new Scene();

  scene.background = bgColor;

  return scene;
}

export { createScene };