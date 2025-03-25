import * as THREE from 'three';
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";

export function createMousePointer(scene, camera, composer, outlinePass) {
    const pointer = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    const onMouseMove = (event) => {
        event.preventDefault();
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            outlinePass.selectedObjects = [intersects[0].object];
            // console.log(intersects[0].object.name);
        } else {
            outlinePass.selectedObjects = [];
        }

        composer.render();
    };

    window.addEventListener('mousemove', onMouseMove);
}

export function selectObject(scene, camera) {
    
    if (moveCamFwd && domTop <= -50) {
        cam_tween_group.add ( 
            new TWEEN.Tween(camera.position)
                .to({ z: 5 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamFwd = false;
    } else if (!moveCamFwd && domTop > -50) {
        cam_tween_group.add (
            new TWEEN.Tween(camera.position)
                .to({ z: 15 }, 1000)
                .onUpdate((coords) => {
                    camera.position.z = coords.z;
                })
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start()
        );
        moveCamFwd = true;
    }

    return moveCamFwd;
}

export function highlightObjectPostProcessor(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const outline = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
    outline.edgeThickness = 20.0;
    outline.edgeStrength = 0.5;
    outline.edgeGlow = 50.0;
    outline.visibleEdgeColor.set(0xff0000);
    composer.addPass(outline);

    const fxaaShader = new ShaderPass(FXAAShader);
    fxaaShader.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(fxaaShader);

    return { composer, outline, fxaaShader };
}