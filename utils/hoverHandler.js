import { Raycaster, Vector2 } from 'three';

const raycaster = new Raycaster();
const mouse = new Vector2();
let hoveredObject = null; // To keep track of the hovered object

function onMouseMove(event, element) {
    const canvasBounds = element.getBoundingClientRect();
    mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
    mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;
}

function checkHover(camera, scene) {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length) {
        const object = intersects[0].object.parent; // Get the parent group
        if (hoveredObject !== object && object.userData?.overlay) {
            // If a new object is hovered
            if (hoveredObject) {
                // Reset the previously hovered object
                hoveredObject.userData.overlay.visible = false;
                hoveredObject.userData.description.visible = false;
            }

            hoveredObject = object;
            hoveredObject.userData.overlay.visible = true;
            hoveredObject.userData.description.visible = true;
        }
    } else if (hoveredObject) {
        // No object is hovered
        hoveredObject.userData.overlay.visible = false;
        hoveredObject.userData.description.visible = false;
        hoveredObject = null;
    }
}

export { checkHover, onMouseMove }