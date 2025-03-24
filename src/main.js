// Create new project by running npm init vite
// Give project a name and select vanilla.js
// Install three.js with npm install three
// Then host app locally with npm run dev

import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import './style.css';

// To start, always need SCENE, CAMERA, and RENDERER

// Scene == container to hold objects, cameras, and lights
const scene = new THREE.Scene();

// Most common camera is perspective camera, mimics what human eye sees
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renderer needs to know which DOM element to use, in this case
// canvas with id of background
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
});

// Can use renderer to set pixel ratio to device pixel ratio
renderer.setPixelRatio(window.devicePixelRatio);

// Make full screen canvas by setting renderer size to window size
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera starts in middle of scene
// Move camera along z axis for better perspective
camera.position.setZ(15);

// Add point light to the scene
// Default is white (0xffffff)
const pointLight = new THREE.PointLight();
pointLight.decay = 0
pointLight.position.set(5,5,5);

// Add ambient light to the scene
// Default is white (0xffffff)
const ambientLight = new THREE.AmbientLight();

// Add both light sources to the scene
scene.add(pointLight, ambientLight);

// Listens to dom events on mouse and updates camera position accordingly
// const controls = new OrbitControls(camera, renderer.domElement);

// Populate scene with randomly generated 'stars'
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    // Randomly position stars through scene by
    // randomly generate x y and z position values for each star
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    // Set position of star
    star.position.set(x, y, z);
    scene.add(star)
}

// Fill scene with 200 stars
for (let i = 0; i < 200; i++) {
    addStar()
}

// Instantiate texture texLoader
const texLoader = new THREE.TextureLoader();

// Add a background using a texture
const spaceTexture = texLoader.load('space.jpg');
scene.background = spaceTexture;

// Create new texture
// const myTexture = texLoader.load('space2.avif')


let materialArray = [
    new THREE.MeshBasicMaterial( { map: texLoader.load("space.jpg") } ),
    new THREE.MeshBasicMaterial( { map: texLoader.load("space2.avif") } ),
    new THREE.MeshBasicMaterial( { map: texLoader.load("space.jpg") } ),
    new THREE.MeshBasicMaterial( { map: texLoader.load("space2.avif") } ),
    new THREE.MeshBasicMaterial( { map: texLoader.load("space.jpg") } ),
    new THREE.MeshBasicMaterial( { map: texLoader.load("moon.jpg") } ),
];

// Create a box and map with new texture
const box = new THREE.Mesh(
    new THREE.BoxGeometry(3,3,3),
    materialArray
);

scene.add(box);


const moonTexture = texLoader.load('moon.jpg');
const normalTexture = texLoader.load('normal.jpg')

const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ 
        map: moonTexture,
        normalMap: normalTexture
    })
)

// Set up camera tweening
const cam_tween_group = new TWEEN.Group();

let prevDomTop = 0;
let moveCamFwd = true

const moveCamera = () => {
    const domTop = document.body.getBoundingClientRect().top;
    
    if (moveCamFwd && domTop <= -50) {
        new TWEEN.Tween(camera.position, cam_tween_group)
            .to({ z: 5 }, 1000)
            .onUpdate((coords) => {
                camera.position.z = coords.z;
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        moveCamFwd = false
    } else if (!moveCamFwd && domTop > -50) {
        new TWEEN.Tween(camera.position, cam_tween_group)
            .to({ z: 15 }, 1000)
            .onUpdate((coords) => {
                camera.position.z = coords.z;
            })
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
        moveCamFwd = true
    }

    prevDomTop = domTop.valueOf()

}

document.body.onscroll = moveCamera

// Function to create tween for rotating box
const createRotationTween = (startAngle, endAngle) => {
    return new TWEEN.Tween( { x: startAngle.x, y: startAngle.y, z: startAngle.z } )
        .to( { x: endAngle.x, y: endAngle.y, z: endAngle.z  }, 1000) // 1s for smooth movement
        .onUpdate((coords) => {
            box.rotation.set(coords.x, coords.y, coords.z);
        })
        .delay(1000)
        .easing(TWEEN.Easing.Quadratic.InOut); // Smooth easing
};


// Set up box tweening
const box_tween_group = new TWEEN.Group();

// Create 4 tweens for each rotation
const tween1 = createRotationTween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.PI / 2, 0, 0));
const tween2 = createRotationTween(new THREE.Vector3(Math.PI / 2, 0, 0), new THREE.Vector3(Math.PI, 0, 0));
const tween3 = createRotationTween(new THREE.Vector3(Math.PI, 0, 0), new THREE.Vector3(3 * Math.PI / 2, 0, 0));
const tween4 = createRotationTween(new THREE.Vector3(3 * Math.PI / 2, 0, 0), new THREE.Vector3(2 * Math.PI, 0, 0));
const tween5 = createRotationTween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));
const tween6 = createRotationTween(new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0, Math.PI, 0));
const tween7 = createRotationTween(new THREE.Vector3(0, Math.PI, 0), new THREE.Vector3(0, 3 * Math.PI / 2, 0));
const tween8 = createRotationTween(new THREE.Vector3(0, 3 * Math.PI / 2, 0), new THREE.Vector3(0, 2 * Math.PI, 0));

// Chain them together
tween1.chain(tween2);
tween2.chain(tween3);
tween3.chain(tween4);
tween4.chain(tween5);
tween5.chain(tween6);
tween6.chain(tween7);
tween7.chain(tween8);
tween8.chain(tween1);

tween1.start();
box_tween_group.add(
    tween1, 
    tween2, 
    tween3, 
    tween4,
    tween5,
    tween6,
    tween7,
    tween8
);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const outline = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
outline.edgeThickness = 20.0;
outline.edgeStrength = 0.5;
outline.edgeGlow = 50.0;
outline.visibleEdgeColor.set(0xff0000)

composer.addPass(outline)

// texLoader.load("three/examples/textures/tri_pattern.jpg", function(texture) {
//     if (texture) {
//         outline.patternTexture = texture;
//         texture.wrapS = THREE.RepeatWrapping;
//         texture.wrapT = THREE.RepeatWrapping;

//     }
    
// });

const fxaaShader = new ShaderPass(FXAAShader);
fxaaShader.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(fxaaShader);


const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

const onMouseMove = (event) => {
    event.preventDefault();
    // Calculation pointer position in normalized device coordinates
    // (-1 to +1) for both components
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children)

    // Loop through all objects intersected by mouse 
    // for (let i = 0; i < intersects.length; i++) {
    //     console.log(intersects[0]);
    //     intersects[0].object.material.color.set(0xff0000);
    // }

    // Select first object intersected by mouse
    if (intersects.length > 0) {
        // console.log(intersects[0]);
        // intersects[0].object.material.color.set(0xff0000);
        outline.selectedObjects = [ intersects[0].object ];
        console.log(intersects[0].object.name);
        
    } else {
        outline.selectedObjects = [ ];
    }

    composer.render();
}

window.addEventListener('mousemove', onMouseMove)


function windowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    fxaaShader.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    
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
