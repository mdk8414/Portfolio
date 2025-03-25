import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#bg') });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(15);

    const pointLight = new THREE.PointLight();
    pointLight.decay = 0;
    pointLight.position.set(5, 5, 5);

    const ambientLight = new THREE.AmbientLight();

    scene.add(pointLight, ambientLight);

    return { scene, camera, renderer };
}

export function handleWindowResize(camera, renderer, composer, fxaaShader) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);

    fxaaShader.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
}