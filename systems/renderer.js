import { WebGLRenderer } from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

function createRenderer() {
  // IF SLOW: Remove antialiasing
  const renderer = new WebGLRenderer({ antialias: true });

  // turn on the physically correct lighting model
  renderer.physicallyCorrectLights = true;

  return renderer;
}

function createCSSRenderer() {
  const cssRenderer = new CSS2DRenderer();
  cssRenderer.setSize(window.innerWidth, window.innerHeight);
  cssRenderer.domElement.style.position = 'absolute';
  cssRenderer.domElement.style.top = '0';
  
  return cssRenderer;
}

export { createRenderer, createCSSRenderer };