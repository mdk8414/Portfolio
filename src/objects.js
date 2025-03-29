import * as THREE from 'three';

export function createStars(scene, count = 200) {
    const geometry = new THREE.SphereGeometry(0.25);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < count; i++) {
        const star = new THREE.Mesh(geometry, material);
        const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
        star.position.set(x, y, z);
        scene.add(star);
    }
}

export const selectedObjects = []

export function addSelectedObjects(object){
    if (selectedObjects.length > 0) {
        selectedObjects.pop();
    }
    selectedObjects.push(object);
}

export function createBox() {
    const texLoader = new THREE.TextureLoader();
    // const materialArray = [
    //     new THREE.MeshStandardMaterial({ color: 'green' }),
    //     new THREE.MeshStandardMaterial({ color: 'red' }),
    //     new THREE.MeshStandardMaterial({ color: 'blue' }),
    //     new THREE.MeshStandardMaterial({ color: 'yellow' }),
    //     new THREE.MeshStandardMaterial({ color: 'orange' }),
    //     new THREE.MeshStandardMaterial({ color: 'purple' }),
    // ];
    const materialArray = [
        new THREE.MeshStandardMaterial({ map: texLoader.load("grass.jpg") }),
        new THREE.MeshStandardMaterial({ map: texLoader.load("space2.avif") }),
        new THREE.MeshStandardMaterial({ map: texLoader.load("space.jpg") }),
        new THREE.MeshStandardMaterial({ map: texLoader.load("space2.avif") }),
        new THREE.MeshStandardMaterial({ map: texLoader.load("space.jpg") }),
        new THREE.MeshStandardMaterial({ map: texLoader.load("moon.jpg") }),
    ];

    const box = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3),
        materialArray
    );

    return box;
}

export function createMoon(texLoader) {
    const moonTexture = texLoader.load('moon.jpg');
    const normalTexture = texLoader.load('normal.jpg');

    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3, 32, 32),
        new THREE.MeshStandardMaterial({ 
            map: moonTexture,
            normalMap: normalTexture
        })
    );

    return moon;
}