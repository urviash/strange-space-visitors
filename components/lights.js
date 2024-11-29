import { DirectionalLight, AmbientLight, HemisphereLight } from 'three';

function createLights() {
    const ambientLight = new AmbientLight('white', 0.2);

    const mainLight = new DirectionalLight('white', 4);
    mainLight.position.set(10, 10, 10);

    return { ambientLight, mainLight };
}

export { createLights };