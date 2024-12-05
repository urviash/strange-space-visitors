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
    BufferAttribute,
    Quaternion
} from 'three';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

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

function createLineWith3DLabel(pos, max_alt, fontURL) {
    const points = [new Vector3(0, 0, 0), new Vector3(pos.x, pos.y, pos.z)];
    const lineGeometry = new BufferGeometry().setFromPoints(points);

    const colors = new Float32Array([
        0x30 / 255, 0x3C / 255, 0x40 / 255, // RGB for #303C40 (start color)
        0x00 / 255, 0x00 / 255, 0x00 / 255, // RGB for black (end color)
    ]);

    lineGeometry.setAttribute('color', new BufferAttribute(colors, 3));

    const lineMaterial = new LineBasicMaterial({
        vertexColors: true,
    });

    const line = new Line(lineGeometry, lineMaterial);

    const group = new Group();
    group.add(line);

    // Load the font and create the 3D text
    const loader = new FontLoader();
    loader.load(fontURL, (font) => {
        const textGeometry = new TextGeometry(`${(max_alt / 1000).toFixed(0)} km`, {
            font: font,
            size: 0.05,
            height: 0.01, // Thickness of the text
            curveSegments: 24, // Quality of the text curves
            bevelEnabled: false,
        });

        const textMaterial = new MeshBasicMaterial({ color: 0x06cbff });
        const textMesh = new Mesh(textGeometry, textMaterial);

        // Calculate direction vector and rotation
        const direction = new Vector3().subVectors(pos, new Vector3(0, 0, 0)).normalize();

        // Position the text at 60% along the line
        const textPosition = new Vector3(
            pos.x * 0.6,
            pos.y * 0.6,
            pos.z * 0.6
        );
        textMesh.position.copy(textPosition);

        // Align text with the line direction
        const axis = new Vector3(1, 0, 0); // Default "up" vector
        const quaternion = new Quaternion().setFromUnitVectors(axis, direction);
        textMesh.quaternion.copy(quaternion);

        group.add(textMesh);
    });

    return group;
}

function createObjMesh(data, pos) {
    const canvas = document.createElement('canvas');
    // Texture resolution
    canvas.width = 360;
    canvas.height = 394;

    const ctx = canvas.getContext('2d');

    // Define styling
    const fontFace = 'Orbitron';
    const fontSize = 18;
    const lineHeight = fontSize * 1.2;

    // Define polaroid frame dimensions
    const frameColor = '#ffffff';
    const borderThickness = 10;
    const bottomMarginHeight = 60;

    const imgHeight = canvas.height - bottomMarginHeight - 5 * borderThickness;

    // Load image
    const img = new Image();
    img.onload = () => {
        // polaroid frame (white border)
        ctx.fillStyle = frameColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // image inside frame
        const imageX = borderThickness;
        const imageY = borderThickness;
        const imageWidth = canvas.width - 2 * borderThickness;
        ctx.drawImage(img, imageX, imageY, imageWidth, imgHeight);

        // text in bottom margin
        ctx.fillStyle = '#000000';
        ctx.font = `bold ${fontSize}px ${fontFace}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // text wrap logic
        const maxTextWidth = canvas.width - 20;
        const textX = canvas.width / 2;
        const textY = canvas.height - bottomMarginHeight;

        const labelText = `${data.name} (${data.year})`;
        wrapText(ctx, labelText, textX, textY, maxTextWidth, lineHeight);

        texture.needsUpdate = true;
    };
    img.src = `${baseURL}${data.img_path}`;

    const texture = new CanvasTexture(canvas);
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;

    const geometry = new PlaneGeometry(1, canvas.height/canvas.width);
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

    const fontURL = `${baseURL}/public/fonts/Orbitron_Regular.json`;
    const line = createLineWith3DLabel(pos, data.max_alt, fontURL);
    
    group.add(objMesh, line);

    group.tick = (cameraPos) => {
        objMesh.lookAt(cameraPos);
    };

    return group;
}

export { createObjectGroup }