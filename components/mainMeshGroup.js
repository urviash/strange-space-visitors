import {
  SphereGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  TextureLoader,
  RepeatWrapping,
  DoubleSide
} from 'three';
import { scaleAltitude, toWorldUnits } from '../utils/scaler.js';
import { createObjectGroup } from './object.js';
import { baseURL } from '../utils/pathResolver.js';

function getPosition(alt, index, total) {
  const scaledAlt = scaleAltitude(alt);

  // Evenly distribute angles
  const theta = (2 * Math.PI * index) / total; // Longitude angle
  const phi = Math.acos(1 - 2 * (index + 0.5) / total); // Latitude angle using Golden Angle

  // Spherical to Cartesian
  const pos = {
    x: scaledAlt * Math.sin(phi) * Math.cos(theta),
    y: scaledAlt * Math.sin(phi) * Math.sin(theta),
    z: scaledAlt * Math.cos(phi)
  }

  return pos;
}

function createEarthMaterial() {
  const mapImagePath = `${baseURL}/public/world.topo.200410.3x5400x2700.jpg`;
  const cloudImagePath = `${baseURL}/public/clouds-alpha.png`;

  // Create a texture loader
  const textureLoader = new TextureLoader();

  // Load the Earth's surface texture
  const texture = textureLoader.load(mapImagePath);

  // Load the clouds texture
  const cloudTexture = textureLoader.load(cloudImagePath);
  cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping;
  // cloudTexture.encoding = sRGBEncoding;

  const earthMaterial = new MeshStandardMaterial({
    map: texture,
  });

  // semi-transparent material for clouds
  const cloudMaterial = new MeshBasicMaterial({
    map: cloudTexture,
    side: DoubleSide,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,  // avoid occlusion with the Earth surface
  });

  return { earthMaterial, cloudMaterial };
}

function createEarth() {
  const radius = toWorldUnits(6371000);

  const geometry = new SphereGeometry(radius, 64, 64);

  const { earthMaterial, cloudMaterial } = createEarthMaterial();
  
  const earthMesh = new Mesh(geometry, earthMaterial);
  // slightly larger sphere for the clouds
  const cloudGeometry = new SphereGeometry(radius * 1.01, 64, 64);
  const cloudMesh = new Mesh(cloudGeometry, cloudMaterial);
  cloudMesh.name = "cloudMesh";
  
  cloudMesh.tick = () => {
    cloudMesh.rotation.x -= 0.0005;    
    cloudMesh.rotation.y += 0.0005;    
    cloudMesh.rotation.z += 0.0005;    
  }

  earthMesh.add(cloudMesh);

  return earthMesh;
}

function createMainMeshGroup(data) {
  const group = new Group();

  const earth = createEarth();
  group.add(earth);

  const objectCount = data.length || 0;
  data.forEach((item, index) => {
    const pos = getPosition(item.max_alt, index, objectCount);
    const objGroup = createObjectGroup(item, pos);
    group.add(objGroup);
  })
  
  group.tick = () => {
    objGroup.tick();
  };

  return group;
}

export { createMainMeshGroup };