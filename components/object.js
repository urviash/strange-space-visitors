import {
    Mesh,
    PlaneGeometry,
    CanvasTexture,
    MeshBasicMaterial,
    LineBasicMaterial,
    Line,
    Vector3,
    BufferGeometry,
    Group,
    LinearFilter
} from 'three';

import { baseURL } from '../utils/pathResolver.js';

function createLine(pos) {
    // Create the line
    const lineMaterial = new LineBasicMaterial({ color: 0xff0000 });
    // TO DO: Single source of truth for earthRadius var
    const points = [new Vector3(0, 0, 0), new Vector3(pos.x, pos.y, pos.z)];
    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(lineGeometry, lineMaterial);

    return line;
}

function createObjMesh(data, pos) {
    const canvas = document.createElement('canvas');
    // Texture resolution
    canvas.width = 256;
    canvas.height = 256;

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
        ctx.fillText(`${data.name} (${data.year})`, canvas.width / 2, canvas.height * 0.875);

        // Update texture
        texture.needsUpdate = true;
    };
    img.src = `${baseURL}${data.img_path}`;

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    const geometry = new PlaneGeometry(0.5, 0.5);
    const material = new MeshBasicMaterial({ map: texture, transparent: true });
    const mesh = new Mesh(geometry, material);

    // Set the mesh position
    mesh.position.set(pos.x, pos.y, pos.z);
    mesh.frustumCulled = true;

    return mesh;
}

function createObjectGroup(data, pos) {
    const group = new Group();

    const objMesh = createObjMesh(data, pos);
    const line = createLine(pos);
    
    group.add(objMesh, line);

    group.tick = (cameraPos) => {
        objMesh.lookAt(cameraPos);
    };

    return group;
}

export { createObjectGroup }