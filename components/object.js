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
    const linePoint = createLine();

    return {obj: null, line: linePoint.line};
}

export { createObject }