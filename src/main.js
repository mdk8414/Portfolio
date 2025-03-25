// Create new project by running npm init vite
// Give project a name and select vanilla.js
// Install three.js with npm install three
// Then host app locally with npm run dev

import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { moveCamera, moveCameraToObject, rotateBoxRandomDelay } from './animations.js';
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
scene.background = spaceTexture;

const { composer, outline, fxaaShader } = highlightObjectPostProcessor(renderer, scene, camera);

createMousePointer(scene, camera, composer, outline);

window.addEventListener('resize', () => handleWindowResize(camera, renderer, composer, fxaaShader));

// Set up camera tweening
const cam_tween_group = new TWEEN.Group();

// let moveCamFwd = true

const moveCameraAnimation = () => {
    const domTop = document.body.getBoundingClientRect().top;
    moveCamFwd = moveCamera(camera, cam_tween_group, domTop, moveCamFwd);
}

// document.body.onscroll = moveCameraAnimation;

moveCameraToObject(scene, camera, cam_tween_group);

// Set up box tweening
const box_tween_group = new TWEEN.Group();

// const box = createBox(texLoader);
// scene.add(box);

// // Start rotating box animation
// rotateBox(box, box_tween_group);

for (let i = -2; i <= 2; i++) {
    const newBox = createBox(texLoader);
    newBox.position.set(5 * i, 0, 0);
    scene.add(newBox);

    rotateBoxRandomDelay(newBox, box_tween_group);
}

const animate = (t) => {
    // Set up tween to keep track of time 't'
    requestAnimationFrame( animate )
    cam_tween_group.update(t);
    box_tween_group.update(t);

    const domTop = document.body.getBoundingClientRect().top;

    // if (domTop > 0) {
    //     box.rotation.x += 0.005;
    //     box.rotation.y += 0.003;
    //     box.rotation.z += 0.007;
    // }

    // renderer.render(scene, camera);
    composer.render();
}

animate();
