import * as TWEEN from '@tweenjs/tween.js';
import * as THREE from 'three';
import { selectedObjects, addSelectedObjects } from './objects';

let moveCamArray = [false, true, true, true, true, true];

export function moveCamera(camera, cam_tween_group, domTop, moveCamFwd) {
    console.log(domTop);
    const h = document.documentElement.scrollHeight * 0.5
    console.log("height", h)
    if (moveCamArray[5] && domTop <= -h) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ x: 10, z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        // setTimeout(function() {}, 50);
        moveCamArray = [true, true, true, true, true, false];
    } 
    else if (moveCamArray[4] && domTop <= -4/5 * h) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ x: 5, z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamArray = [true, true, true, true, false, true];
        // setTimeout(function() {}, 50);
    } 
    else if (moveCamArray[3] && domTop <= -3/5 * h) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ x: 0, z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamArray = [true, true, true, false, true, true];
        // setTimeout(function() {}, 50);
    } 
    else if (moveCamArray[2] && domTop <= -2/5 * h) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ x: -5, z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamArray = [true, true, false, true, true, true];
        // setTimeout(function() {}, 50);
    } 
    else if (moveCamArray[1] && domTop <= -1/5 * h) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ x: -10, z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamArray = [true, false, true, true, true, true];
        // setTimeout(function() {}, 50);
    } 
    else if (moveCamArray[0] && domTop > -1/5 * h) {
        cam_tween_group.add (
            new TWEEN.Tween(camera.position)
                .to({ x: 0, z: 15 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                    camera.position.x = coords.x;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamArray = [false, true, true, true, true, true];
        // setTimeout(function() {}, 50);
    }

    return moveCamFwd;
}

export function moveCameraToObject(scene, camera, cam_tween_group) {

    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // let OBJECT;

    const onMouseClick = (event) => {
        event.preventDefault();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        console.log("Outside");
        if (intersects.length > 0) {
            console.log("Inside");
            cam_tween_group.add ( 
                new TWEEN.Tween(camera.position)
                    .to( { x: intersects[0].object.position.x, z: 5 }, 1000)
                    .onUpdate((coords) => {
                        camera.position.x = coords.x;
                        camera.position.z = coords.z;
                    })
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start()
            );

            // addSelectedObjects(intersects[0]);

            
        } else {
            cam_tween_group.add ( 
                new TWEEN.Tween(camera.position)
                    .to( { x: 0, y: 0, z: 15 }, 1000)
                    .onUpdate((coords) => {
                        camera.position.set(coords.x, coords.y, coords.z);
                    })
                    .easing(TWEEN.Easing.Quadratic.InOut)
                    .start()
            );
        }
    };

    window.addEventListener('click', onMouseClick);
    
}

// Function to create rotating box animation
export function rotateBox(box, box_tween_group) {

    const createRotationTween = (startAngle, endAngle) => {
        return new TWEEN.Tween({ x: startAngle.x, y: startAngle.y, z: startAngle.z })
            .to({ x: endAngle.x, y: endAngle.y, z: endAngle.z }, 1000)
            .onUpdate((coords) => {
                box.rotation.set(coords.x, coords.y, coords.z);
            })
            .delay(1000)
            .easing(TWEEN.Easing.Quadratic.InOut);
    };

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

}
// Function to create rotating box animation with random delay
export function rotateBoxRandomDelay(box, box_tween_group) {

    const createRotationTween = (startAngle, endAngle) => {
        return new TWEEN.Tween({ x: startAngle.x, y: startAngle.y, z: startAngle.z })
            .to({ x: endAngle.x, y: endAngle.y, z: endAngle.z }, 1000)
            .onUpdate((coords) => {
                box.rotation.set(coords.x, coords.y, coords.z);
            })
            .delay(1000 * Math.random())
            .easing(TWEEN.Easing.Quadratic.InOut);
    };

    // Create 4 tweens for each rotation
    const tween1 = createRotationTween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(Math.PI / 2, 0, 0));
    const tween2 = createRotationTween(new THREE.Vector3(Math.PI / 2, 0, 0), new THREE.Vector3(Math.PI, 0, 0));
    const tween3 = createRotationTween(new THREE.Vector3(Math.PI, 0, 0), new THREE.Vector3(3 * Math.PI / 2, 0, 0));
    const tween4 = createRotationTween(new THREE.Vector3(3 * Math.PI / 2, 0, 0), new THREE.Vector3(2 * Math.PI, 0, 0));
    const tween5 = createRotationTween(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, Math.PI / 2, 0));
    const tween6 = createRotationTween(new THREE.Vector3(0, Math.PI / 2, 0), new THREE.Vector3(0, Math.PI, 0));
    const tween7 = createRotationTween(new THREE.Vector3(0, Math.PI, 0), new THREE.Vector3(0, 3 * Math.PI / 2, 0));
    const tween8 = createRotationTween(new THREE.Vector3(0, 3 * Math.PI / 2, 0), new THREE.Vector3(0, 2 * Math.PI, 0));

    // Get random index, slice off end of tweens array starting from index, then append those elements to front
    // This will make each boxes starting rotation random
    let tweens = new Array(tween1, tween2, tween3, tween4, tween5, tween6, tween7, tween8);
    const randIdx = Math.floor(Math.random() * tweens.length);
    const endSlice = tweens.splice(randIdx);
    tweens = endSlice.concat(tweens)

    for (let i = 0; i < tweens.length - 1; i++) {
        tweens[i].chain(tweens[i + 1]);
    }
    tweens[tweens.length - 1].chain(tweens[0]);


    // Chain them together
    // tween1.chain(tween2);
    // tween2.chain(tween3);
    // tween3.chain(tween4);
    // tween4.chain(tween5);
    // tween5.chain(tween6);
    // tween6.chain(tween7);
    // tween7.chain(tween8);
    // tween8.chain(tween1);

    tweens[0].start();
    
    box_tween_group.add(...tweens);

}

// Function to create random rotating box animation
// export function rotateBoxRandom(box, box_tween_group) {

//     const createRotationTween = (startAngle, endAngle) => {
//         return new TWEEN.Tween({ x: startAngle.x, y: startAngle.y, z: startAngle.z })
//             .to({ x: endAngle.x, y: endAngle.y, z: endAngle.z }, 1000)
//             .onUpdate((coords) => {
//                 box.rotation.set(coords.x, coords.y, coords.z);
//             })
//             .delay(1000 * Math.random())
//             .easing(TWEEN.Easing.Quadratic.InOut);
//     };


//     // Rotation directions
//     const rotationDirections = [
//         { axis: 'x', direction: 1 },  // Rotate around X (up/down)
//         { axis: 'x', direction: -1 }, // Rotate around X (down/up)
//         { axis: 'y', direction: 1 },  // Rotate around Y (left)
//         { axis: 'y', direction: -1 }  // Rotate around Y (right)
//     ];

//     // Function to get a random rotation direction
//     const getRandomRotationDirection = () => {
//         return rotationDirections[Math.floor(Math.random() * rotationDirections.length)];
//     };

//     // Generate a random rotation sequence
//     const generateRandomRotationSequence = (startAngle) => {
//         const sequence = [];
//         const numRotations = 4; // Number of rotations in the sequence

//         let currentAngle = startAngle.clone();
//         for (let i = 0; i < numRotations; i++) {
//             const { axis, direction } = getRandomRotationDirection();
            
//             // Create a copy of current angle
//             const nextAngle = currentAngle.clone();
            
//             // Modify the appropriate axis
//             if (axis === 'x') {
//                 nextAngle.x += direction * Math.PI / 2;
//             } else {
//                 nextAngle.y += direction * Math.PI / 2;
//             }

//             sequence.push(createRotationTween(currentAngle, nextAngle));
//             currentAngle = nextAngle;
//         }

//         return sequence;
//     };

//     // Start with zero rotation
//     const startAngle = new THREE.Vector3(0, 0, 0);
    
//     // Generate a random rotation sequence
//     const tweens = generateRandomRotationSequence(startAngle);

//     // Chain the tweens together
//     for (let i = 0; i < tweens.length - 1; i++) {
//         tweens[i].chain(tweens[i + 1]);
//     }
    
//     // Make the last tween loop back to the first
//     tweens[tweens.length - 1].chain(tweens[0]);

//     // Start the first tween
//     tweens[0].start();

//     // Add all tweens to the tween group
//     box_tween_group.add(...tweens);
// }