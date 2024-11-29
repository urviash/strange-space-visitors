import {
    Mesh,
    PlaneGeometry,
    CanvasTexture,
    MeshBasicMaterial,
    LineBasicMaterial,
    Line,
    Vector3,
    BufferGeometry,
    Group
} from 'three';

import { toWorldUnits } from '../utils/scaler.js';
import { baseURL } from '../utils/pathResolver.js';

function createLine() {
    // Create the line
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    // TO DO: Single source of truth for earthRadius var
    const points = [new Vector3(0, 0, 0), new Vector3(0, 0, toWorldUnits(6371000) * -1.5)];
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(lineGeometry, lineMaterial);

    return line;
}

function createObjMesh() {
    const canvas = document.createElement('canvas');
    // Texture resolution
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');

    // Draw image
    const img = new Image();
    img.onload = () => {
        // Top 3/4 for the image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height * 0.75);

        // Draw text
        ctx.fillStyle = '#ffffff';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Bottom 1/4 for text
        ctx.fillText('HELLO WORLD!', canvas.width / 2, canvas.height * 0.875);

        // Update texture
        texture.needsUpdate = true;
    };
    img.src = `${baseURL}/public/obj-images/Img4.jpg`;

    const texture = new CanvasTexture(canvas);
    const geometry = new PlaneGeometry(10, 10);
    const material = new MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new Mesh(geometry, material);

    // Set the mesh position
    mesh.position.set(0, 0, toWorldUnits(6371000) * -1.5);
    mesh.frustumCulled = true;

    return mesh;
}

function createObjectGroup() {
    const group = new Group();

    const objMesh = createObjMesh();
    const line = createLine();
    
    group.add(objMesh, line);

    group.tick = (cameraPos) => {
        objMesh.lookAt(cameraPos);
    };

    return group;
}

export { createObjectGroup }