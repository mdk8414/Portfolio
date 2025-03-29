// Create new project by running npm init vite
// Give project a name and select vanilla.js
// Install three.js with npm install three
// Then host app locally with npm run dev

import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { moveCamera, scrollCameraVertical, moveCameraToObject, rotateBoxRandomDelay, rotateBoxManual, rotateBoxOnScroll, fixBoxRotation, rotateBox } from './animations.js';
import { createMousePointer, highlightObjectPostProcessor } from './mouse.js';
import { createBox, createStars } from './objects.js';
import { createScene, handleWindowResize } from './scene.js';
import './style.css';

// To start, always need SCENE, CAMERA, and RENDERER

// Scene == container to hold objects, cameras, and lights
const { scene, camera, renderer } = createScene();

// Instantiate texture texLoader
const texLoader = new THREE.TextureLoader();

// Create objects
createStars(scene);

// Add a background using a texture
const spaceTexture = texLoader.load('space.jpg');
scene.background = spaceTexture;
// scene.background = new THREE.Color(0xB0B0B0)

const grassTexture = texLoader.load('grass.jpg');
// scene.background = grassTexture;

const martiTexture = texLoader.load('comp_martina.png');
// scene.background = martiTexture;

const { composer, outline, fxaaShader } = highlightObjectPostProcessor(renderer, scene, camera);

createMousePointer(scene, camera, composer, outline);

window.addEventListener('resize', () => handleWindowResize(camera, renderer, composer, fxaaShader));

// Set up camera tweening
const cam_tween_group = new TWEEN.Group();

// let moveCamFwd = true

// const moveCameraAnimation = () => {
    
//     moveCamera(camera, cam_tween_group);
//     // scrollCameraVertical(camera);
// }

// document.body.onscroll = moveCameraAnimation;

let moveCameraOnScroll = true;

const onMouseClick = (event) => {
    // moveCameraToObject(scene, camera, cam_tween_group);
    // window.scrollY = 0;
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

        
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // objIdx = boxes.lastIndexOf(intersects[0].object)
        // console.log(objIdx);
        // currAnimationIdx = 2;
        moveCameraOnScroll = false;
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to( { x: intersects[0].object.position.x, y: intersects[0].object.position.y, z: intersects[0].object.position.z + 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.x = coords.x;
                    camera.position.y = coords.y;
                    camera.position.z = coords.z;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );

        // addSelectedObjects(intersects[0]);
        
    } else {
        // currAnimationIdx = 0;
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to( { x: 0, y: 0, z: 15 }, 1000)
                .onUpdate((coords) => {
                    camera.position.set(coords.x, coords.y, coords.z);
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCameraOnScroll = true;
    }
    
}

window.addEventListener('click', onMouseClick);

// Set up box tweening
const box_tween_group = new TWEEN.Group();

// const box = createBox(texLoader);
// scene.add(box);

// // Start rotating box animation
// rotateBox(box, box_tween_group);
const boxes = []
const cameraPositions = [
    new THREE.Vector3(0, 0, 15),
  ];

const initBoxesRow = (n) => {
    for (let i = -n; i <= n; i++) {
        const newBox = createBox();
    
        newBox.position.set(5 * i, 0, 0);
        boxes.push(newBox);
        cameraPositions.push(new THREE.Vector3(5 * i, 0, 5));
        scene.add(newBox);
        // boxes[i] = rotateBoxRandomDelay(newBox);
    }
}

initBoxesRow(2);
// let newBox = createBox();
// newBox.position.set(0, 5, 0);

// scene.add(newBox);

// const rotateBoxOnScrollEvent = () => {
//     rotateBoxOnScroll(boxes[0]);
// }

// document.body.onscroll = rotateBoxOnScrollEvent;

function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function easeInOutElastic(x, a)  {
    if (a === 0) return 0;

    const c5 = (2 * Math.PI) / a;
    
    return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
    //   ? -(Math.pow(2, x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
    //   : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
        ? -(Math.sin((x * 2 - 1.1) * c5)) / 2
        : (Math.sin((x * 2 - 1.1) * c5)) / 2 + 1;
}

function easeOutBounce(x) {
    const n1 = 8;
    const d1 = 3;
    
    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

function easeInOutBounce(x) {
    return x < 0.5
      ? (1 - easeOutBounce(1 - 2 * x)) / 2
      : (1 + easeOutBounce(2 * x - 1)) / 2;
}

function easeInOutBack(x) {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    
    return x < 0.5
        ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
        : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

let currAnimationIdx = 0;
let scrollProgress = 0;

window.addEventListener("scroll", () => {
    
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const step = maxScroll / (animations.length);

    // clamp(scrollTop, 0, maxScroll-step);

    currAnimationIdx = Math.floor(scrollTop / step); // Determine the nearest cube
    currAnimationIdx = clamp(currAnimationIdx, 0, animations.length);

    // console.log(currAnimationIdx);
    // Linear
    // scrollProgress = (scrollTop - currAnimationIdx * step) / step;
    // Also Linear
    scrollProgress = (scrollTop % step) / step;
    // Quadratic Ease in (smoothed)
    // scrollProgress = Math.sin((scrollTop - currAnimationIdx * step) / step * (Math.PI / 2));
    // Elastic Ease in / out
    // scrollProgress = clamp(easeInOutElastic(scrollProgress, 4.5), 0, 1);

    // console.log("Scroll progress", scrollProgress)
    // console.log("Scroll top", scrollTop);
    // console.log("Step", step)

    // console.log(currAnimationIdx)


});

let selectedBox = -1;

const epsilon = 0.0005;
const repositionCamera = (start, end) => {
    selectedBox = -1;
    camera.position.lerpVectors(start, end, easeInOutCubic(scrollProgress));
}

const lerp = (a, b, alpha) => {
    return a + alpha * (b - a);
}

// const createRotationTween = (obj, startAngle, endAngle) => {
//     return new TWEEN.Tween({ x: startAngle.x, y: startAngle.y, z: startAngle.z })
//         .to({ x: endAngle.x, y: endAngle.y, z: endAngle.z }, 500)
//         .onUpdate((coords) => {
//             obj.rotation.set(coords.x, coords.y, coords.z);
//         })
//         .easing(TWEEN.Easing.Quadratic.InOut)
//         .start();
// };

const boxAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

// let previousScrollProgress = 0;
const spinBox = (idx, startRotX, endRotX) => {
    if (idx !== selectedBox) {
        // startRotX = boxes[idx].rotation.x;
        // endRotX = startRotX + Math.PI / 2;
        selectedBox = idx;
        
    }

    // let targetRotX = lerp(startRotX, endRotX, -((Math.cos(Math.PI * scrollProgress) + 1) / 2) % (2 * Math.PI)); 
    // let targetRotX = lerp(startRotX, endRotX, Math.pow(scrollProgress, 3)); 
    let targetRotX = lerp(startRotX, endRotX, easeInOutBack(scrollProgress)); 
    // let ease = easeInOutElastic(scrollProgress, 4);
    // let targetRotX = lerp(startRotX, endRotX, easeInOutCubic(scrollProgress)); 
    boxes[idx].rotation.x = targetRotX; 
    
}

let animations = [
    // () => { repositionCamera(cameraPositions[0], cameraPositions[1]); }
];

for (let i = 0; i < boxes.length; i++) {
    animations.push(
        () => { repositionCamera(cameraPositions[i], cameraPositions[i+1]); },
        () => { spinBox(i, boxAngles[0], boxAngles[1]); },
        () => { spinBox(i, boxAngles[1], boxAngles[2]); },
        () => { spinBox(i, boxAngles[2], boxAngles[3]); }
    );
    // console.log(animations);
}


// const animations = [
//     () => { repositionCamera(cameraPositions[0], cameraPositions[1]); },
//     // () => { repositionCamera(cameraPositions[1]); },
//     () => { spinBox(0, boxAngles[0], boxAngles[1]); },
//     () => { spinBox(0, boxAngles[1], boxAngles[2]); },
//     () => { spinBox(0, boxAngles[2], boxAngles[3]); },
//     () => { repositionCamera(cameraPositions[1], cameraPositions[2]); }, 
//     () => { spinBox(1, boxAngles[0], boxAngles[1]); },
//     () => { spinBox(1, boxAngles[1], boxAngles[2]); },
//     () => { spinBox(1, boxAngles[2], boxAngles[3]); },
//     () => { repositionCamera(cameraPositions[2], cameraPositions[3]); },
//     () => { spinBox(2, boxAngles[0], boxAngles[1]); },
//     () => { spinBox(2, boxAngles[1], boxAngles[2]); },
//     () => { spinBox(2, boxAngles[2], boxAngles[3]); },
//     () => { repositionCamera(cameraPositions[3], cameraPositions[4]); },
//     () => { spinBox(3, boxAngles[0], boxAngles[1]); },
//     () => { spinBox(3, boxAngles[1], boxAngles[2]); },
//     () => { spinBox(3, boxAngles[2], boxAngles[3]); },
//     () => { repositionCamera(cameraPositions[4], cameraPositions[5]); },
//     () => { spinBox(4, boxAngles[0], boxAngles[1]); },  
//     () => { spinBox(4, boxAngles[1], boxAngles[2]); },  
//     () => { spinBox(4, boxAngles[2], boxAngles[3]); }  
//   ];

function rotateBoxToNearestFace(box) {
    const targetRotX = boxAngles[Math.round(box.rotation.x / (Math.PI / 2)) % boxAngles.length];
    box.rotation.x = lerp(box.rotation.x, targetRotX, 0.005);  
}

const animate = (t) => {
    // Set up tween to keep track of time 't'
    requestAnimationFrame( animate )
    cam_tween_group.update(t);
    // box_tween_group.update(t);

    // for (const tween_group of Object.values(boxes)) {
    //     tween_group.update(t);
    // }
    if (moveCameraOnScroll && currAnimationIdx < animations.length) {
        animations[currAnimationIdx]();
    }

    // Set box rotation to nearest face
    for (let i = 0; i < boxes.length; i++) {
        if (i !== selectedBox) {
            rotateBoxToNearestFace(boxes[i]);
        }      
    }

    composer.render();
}

animate();
