import { World } from './src/World/World.js';

// To be used to dynamically resolve paths for project assets.
let baseURL = window.location.origin + window.location.pathname.split('/').slice(0, -1).join('/');

function main() {
    // Get a reference to the container element
    const container = document.querySelector('#scene-container');
  
    // Create an instance of the World app
    const world = new World(container);
  
    // produce a single frame (render on demand)
    // world.render();

    // start the loop (produce a stream of frames)
    world.start();
}

// call main to start the app
main();

export { baseURL }