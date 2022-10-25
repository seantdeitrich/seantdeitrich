import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('.webgl'); //Selecting the canvas from the html
const scene = new THREE.Scene(); //Creating a scene

//Create a GLTF Loader so we can load the GLB file in
const loader = new GLTFLoader();
loader.load("./assets/avatar.glb", function(glb)
{
    console.log(glb);
    const root = glb.scene;
    scene.add(root);
},
function(xhr) //Displays % Loaded as the model is loading
{
    console.log((xhr.loaded / xhr.total*100) + "% Loaded")
},
function(error) //Error case 
{
    console.log("Error Loading GLB Model: Try Again");
});

//Grabbing the size of the viewport
const sizes = 
{
    width: window.innerWidth,
    height: window.innerHeight
};

//Creating a camera with a 75 FOV, matching the aspect ration of the screen, Near of 0.1 and far of 100 (render cutoffs)
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,1.2,2); //Moving camera away from the origin



//Creating the ambient lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
light.position.set(2,2,5);
scene.add(light);
scene.add(ambientLight);

//Renderer Setup
const renderer = new THREE.WebGLRenderer(
{
    canvas: canvas
});


renderer.alpha = true; //Allow transparency 
renderer.setClearColor(0x000000, 0); //Allow transparency
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.gammaOutput = true;
renderer.render(scene, camera);

const controls = new OrbitControls(camera, renderer.domElement);

//Boilerplate Animate Code
function animate()
{

    requestAnimationFrame(animate);

    controls.update()

    renderer.render(scene,camera);
}
animate();

