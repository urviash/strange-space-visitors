import { PerspectiveCamera } from 'three';
import { toWorldUnits, scaleAltitude } from '../utils/scaler.js';

// Karman line height 6471000m from the center of the Earth, converted into World units
let initialDist = toWorldUnits(scaleAltitude(6471000*3));
console.log(initialDist)

function createCamera() {
  const camera = new PerspectiveCamera(
    60, // fov = Field Of View
    1, // aspect ratio (dummy value)
    0.1, // near clipping plane
    100, // far clipping plane
  );

  // move the camera back so we can view the scene
  camera.position.set(0, 0, initialDist);

  return camera;
}

export { createCamera };