// Create new project by running npm init vite
// Give project a name and select vanilla.js
// Install three.js with npm install three
// Then host app locally with npm run dev

import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { moveCamera, scrollCameraVertical, moveCameraToObject, rotateBoxRandomDelay, rotateBoxManual, rotateBoxOnScroll, fixBoxRotation } from './animations.js';
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
// createStars(scene);

// Add a background using a texture
const spaceTexture = texLoader.load('space.jpg');
// scene.background = spaceTexture;
scene.background = new THREE.Color(0xB0B0B0)

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
// const box_tween_group = new TWEEN.Group();

// const box = createBox(texLoader);
// scene.add(box);

// // Start rotating box animation
// rotateBox(box, box_tween_group);
const boxes = []

for (let i = -2; i <= 2; i++) {
    const newBox = createBox();
    newBox.position.set(5 * i, 0, 0);
    boxes.push(newBox);
    
    scene.add(newBox);
    // boxes[i] = rotateBoxRandomDelay(newBox);
}

// let newBox = createBox();
// newBox.position.set(0, 5, 0);

// scene.add(newBox);

// const rotateBoxOnScrollEvent = () => {
//     rotateBoxOnScroll(boxes[0]);
// }

// document.body.onscroll = rotateBoxOnScrollEvent;

let currAnimationIdx = 0;
let scrollProgress = 0;

window.addEventListener("scroll", () => {
    
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const step = maxScroll / (animations.length);

    currAnimationIdx = Math.floor(scrollTop / step); // Determine the nearest cube
    currAnimationIdx = Math.max(0, Math.min(currAnimationIdx, animations.length - 1));

    console.log(currAnimationIdx);
    scrollProgress = Math.sin((scrollTop - currAnimationIdx * step) / step * (Math.PI / 2));

    console.log("Scroll progress", scrollProgress)
    console.log("Scroll top", scrollTop);
    console.log("Step", step)


});

const cameraPositions = [
    new THREE.Vector3(0, 0, 15),
    new THREE.Vector3(-10, 0, 5),
    new THREE.Vector3(-5, 0, 5), 
    new THREE.Vector3(0, 0, 5),
    new THREE.Vector3(5, 0, 5),
    new THREE.Vector3(10, 0, 5)  
  ];

let selectedBox = -1;

const epsilon = 0.005;
const repositionCamera = (start, end) => {
    // console.log("Repositioning camera to ", end.toArray());
    // if (camera.position.distanceTo(end) > epsilon) {
    selectedBox = -1;
    camera.position.lerpVectors(start, end, scrollProgress);
    // } 
}

const lerp = (a, b, alpha) => {
    return a + alpha * (b - a);
}

let startRotX = 0;
const spinBox = (idx) => {
    if (idx !== selectedBox) {
        selectedBox = idx;
        startRotX = boxes[idx].rotation.x
    }
    
    boxes[idx].rotation.x = lerp(0, 2 * Math.PI, scrollProgress); 
}

const animations = [
    () => { repositionCamera(cameraPositions[0], cameraPositions[1]); },
    // () => { repositionCamera(cameraPositions[1]); },
    () => { spinBox(0); },
    () => { repositionCamera(cameraPositions[1], cameraPositions[2]); }, 
    () => { spinBox(1); },
    () => { repositionCamera(cameraPositions[2], cameraPositions[3]); },
    () => { spinBox(2); },
    () => { repositionCamera(cameraPositions[3], cameraPositions[4]); },
    () => { spinBox(3); },
    () => { repositionCamera(cameraPositions[4], cameraPositions[5]); },
    () => { spinBox(4); }  
  ];

const animate = (t) => {
    // Set up tween to keep track of time 't'
    requestAnimationFrame( animate )
    cam_tween_group.update(t);

    // for (const tween_group of Object.values(boxes)) {
    //     tween_group.update(t);
    // }
    if (moveCameraOnScroll)
        animations[currAnimationIdx]();

    for (let i = 0; i < boxes.length; i++) {
        if (i === selectedBox)
            continue;
        
        // fixBoxRotation(boxes[i]);
        boxes[i].rotation.x = lerp(boxes[i].rotation.x, 0, 0.005)
    }

    composer.render();
}

animate();
