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
    LinearFilter,
    BufferAttribute
} from 'three';

import { baseURL } from '../utils/pathResolver.js';

// Function to wrap text
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Draw each line
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
    }
}

function createLine(pos) {
    const points = [new Vector3(0, 0, 0), new Vector3(pos.x, pos.y, pos.z)];
    const lineGeometry = new BufferGeometry().setFromPoints(points);

    // Define colors for each vertex
    const colors = new Float32Array([
        0x30 / 255, 0x3C / 255, 0x40 / 255, // RGB for #303C40 (start color)
        0x00 / 255, 0x00 / 255, 0x00 / 255, // RGB for black (end color)
    ]);

    lineGeometry.setAttribute('color', new BufferAttribute(colors, 3));

    // Use a material that supports vertex colors
    const lineMaterial = new LineBasicMaterial({
        vertexColors: true, // Enable vertex colors
    });

    const line = new Line(lineGeometry, lineMaterial);

    return line;
}

function createObjMesh(data, pos) {
    const canvas = document.createElement('canvas');
    // Texture resolution
    canvas.width = 256;
    canvas.height = 360; // Increase height to accommodate the Polaroid style

    const ctx = canvas.getContext('2d');

    // Define styling
    const fontFace = 'Orbitron'; // Example digital/space font
    const fontSize = 18; // Font size for the text
    const lineHeight = fontSize * 1.2; // Line height for text wrapping

    // Define polaroid frame dimensions
    const frameColor = '#ffffff';
    const borderThickness = 10; // Thickness of the border
    const bottomMarginHeight = 60; // Extra space at the bottom for text

    const imgHeight = canvas.height - bottomMarginHeight - 2 * borderThickness;

    // Load image
    const img = new Image();
    img.onload = () => {
        // Draw the polaroid frame (white border)
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image inside the frame
        const imageX = borderThickness;
        const imageY = borderThickness;
        const imageWidth = canvas.width - 2 * borderThickness;
        ctx.drawImage(img, imageX, imageY, imageWidth, imgHeight);

        // Draw the text in the bottom margin
        ctx.fillStyle = '#000000'; // Black text for better contrast
        ctx.font = `bold ${fontSize}px ${fontFace}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const maxTextWidth = canvas.width - 20; // Add padding for text
        const textX = canvas.width / 2;
        const textY = canvas.height - bottomMarginHeight / 1.5;

        const labelText = `${data.name} (${data.year})`;
        wrapText(ctx, labelText, textX, textY, maxTextWidth, lineHeight);

        // Update the texture
        texture.needsUpdate = true;
    };
    img.src = `${baseURL}${data.img_path}`;

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    const geometry = new PlaneGeometry(0.6, 0.75); // Adjust to match the new aspect ratio
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