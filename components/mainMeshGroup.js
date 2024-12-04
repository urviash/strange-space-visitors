import {
  SphereGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
  Vector3
} from 'three';
import { toWorldUnits } from '../utils/scaler.js';
import { createObjectGroup } from './object.js';
import { baseURL } from '../utils/pathResolver.js';

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
  earth.tick = (cameraPos) => {
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

  // Example of adding elements
  // const data = {
  //   name: 'Garlic Bread',
  //   year: '2018',
  //   img_path: '/public/obj-images/Img4.jpg'
  // }
  const objGroup = createObjectGroup(data[1]);
  group.add(objGroup);
  
  group.tick = () => {
    objGroup.tick();
  };

  return group;
}

export { createMainMeshGroup };