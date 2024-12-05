import {
  SphereGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3
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
  let mapImagePath = `${baseURL}/public/world.topo.200410.3x5400x2700.jpg`;
  // let mapImagePath = '../public/cloud_combined_2048.jpg';
  // let mapImagePath = '../public/world.topo.200410.3x5400x2700.jpg';

  // create a texture loader.
  const textureLoader = new TextureLoader();

  // load a texture
  const texture = textureLoader.load(
    mapImagePath,
  );

  // TO DO: Add clouds texture layer

  // create a "standard" material using
  // the texture we just loaded as a color map
  const material = new MeshStandardMaterial({
    map: texture,
  });

  return material;
}

function createEarth() {
  // Earth's radius converted from meters
  let earthRadius = toWorldUnits(6371000);

  // create a geometry
  const geometry = new SphereGeometry(earthRadius, 32, 32);
  // const geometry = new BoxGeometry();

  const material = createEarthMaterial();

  // create a Mesh containing the geometry and material
  const earth = new Mesh(geometry, material);

  earth.rotation.set(-0.5, -0.1, 0.8);

  // this method will be called once per frame
  //TO DO: constant rotation rate using delta. 
  // earth.tick = (delta, cameraPos) => {
  earth.tick = () => {
    // increase the sphere's rotation each frame
    earth.rotation.z += 0.01;
    earth.rotation.x += 0.01;
    earth.rotation.y += 0.01;
  };

  return earth;
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