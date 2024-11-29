import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);

    controls.enablePan = false;
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // controls.minDistance = 5;
    // controls.maxDistance = 20;

    // controls.minAzimuthAngle = - Infinity; // default
    // controls.maxAzimuthAngle = Infinity; // default

    // controls.minPolarAngle = 0; // default
    // controls.maxPolarAngle = Math.PI; // default

    controls.tick = (cameraPos) => controls.update();

    return controls;
}

export { createControls };