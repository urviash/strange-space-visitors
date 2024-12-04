import { World } from './src/World/World.js';

async function loadData() {
    try {
      const response = await fetch('./data/data.json');

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error loading JSON:', error);
    }
}

async function main() {
    const data = await loadData();

    // Get a reference to the container element
    const container = document.querySelector('#scene-container');
  
    // Create an instance of the World app
    const world = new World(container, data);
  
    // produce a single frame (render on demand)
    // world.render();

    // start the loop (produce a stream of frames)
    world.start();
}

document.addEventListener("DOMContentLoaded", async () => main());