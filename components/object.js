import {
    SphereGeometry,
    Group,
    Mesh,
    MeshStandardMaterial,
    TextureLoader,
    MeshBasicMaterial,
    LineBasicMaterial,
    Line,
    Vector3,
    BufferGeometry
} from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

import { toWorldUnits } from '../utils/scaler.js';

function createLine() {
    // Create the line
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    // TO DO: Single source of truth for earthRadius var
    const points = [new Vector3(0, 0, 0), new Vector3(0, 0, toWorldUnits(6371000) * -1.5)];
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(lineGeometry, lineMaterial);

    return {line: line, endpoint: points[1]};
}

function createObject(text, position) {
    const element = document.createElement('div');
    element.className = 'orbit-label';
    element.textContent = text;
    element.style.marginTop = '-1em'; // Adjust for better centering

    const label = new CSS2DObject(element);

    const linePoint = createLine();
    label.position.set(linePoint.endpoint.x, linePoint.endpoint.y, linePoint.endpoint.z);

    label.tick = (delta) => {
        // Update label visibility and occlusion
        updateLabels(camera, labels, sphereCenter, sphereRadius);
    }

    return {obj: label, line: linePoint.line};
}

export { createObject }