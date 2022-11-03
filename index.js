import * as THREE from 'three';
import {OrbitControls} from './three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from './three/examples/jsm/loaders/GLTFLoader.js';
const canvas = document.querySelector('.webgl'); //Selecting the canvas from the html
const scene = new THREE.Scene(); //Creating a scene

//Create a GLTF Loader so we can load the GLB file in
const loader = new GLTFLoader();
let avatar;
loader.load("./assets/avatar.glb", function(glb)
{
    console.log(glb);
    avatar = glb.scene;
    scene.add(avatar);
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

//Shifting the avatar into a better position

//Creating a camera with a 75 FOV, matching the aspect ration of the screen, Near of 0.1 and far of 100 (render cutoffs)
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 100);
camera.position.set(0,2,3); //Moving camera away from the origin


//Creating the ambient and point lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
light.position.set(2,2,5);
scene.add(light);
scene.add(ambientLight);

//Creating a background for the scene
const textureLoader = new THREE.TextureLoader();
/*

const bgTexture = textureLoader.load('images/space.jpg');
scene.background = bgTexture;
*/

//Renderer Setup
const renderer = new THREE.WebGLRenderer(
{
    canvas: canvas
});

//Create "stars" as white spheres and add to canvas at random position
//Every Sphere can use the same geometry
const geometry = new THREE.SphereGeometry(0.1, 32, 16); //Create spheres with a radius of 0.1, 32 width segments and 16 height segments                                        //Note that more width/height segments increase the total amount of triangles in the geometry
for(let i = 0; i<1000; i++) //For loop to create 100 stars
{   
    //Every sphere needs a different material for rainbow stars
    const material = new THREE.MeshBasicMaterial(); //If they were all the same color, they could just use the same material
    material.color = new THREE.Color(Math.random(), Math.random(), Math.random()); //Generate random RGB Values and set it as the color of the material
    const star = new THREE.Mesh(geometry, material); //Create the star
    //Setting star positions
    //Note: Stars can currently appear in front of the camera
    star.position.x = Math.random()*100-50; //Generate random X Position between -50 and 50
    star.position.y = Math.random()*100-50; //Generate random Y position between -50 and 50
    star.position.z = Math.random()*100-50; //Generate random Z position between -50 and 50
    scene.add(star); //Add the star to the scene
}

//Creating a Spherical Skybox rather than using a static background
const skyGeometry = new THREE.SphereGeometry( 30, 50, 50 );
const skyTexture = textureLoader.load('images/StarMap.png');
const skyMat = new THREE.MeshBasicMaterial( { map: skyTexture} );
skyMat.side = THREE.DoubleSide;
const skyBox = new THREE.Mesh( skyGeometry, skyMat );
scene.add( skyBox );
//Image Credit: NASA/Goddard Space Flight Center Scientific Visualization Studio. Gaia DR2: ESA/Gaia/DPAC. Constellation figures based on those developed for the IAU by Alan MacRobert of Sky and Telescope magazine (Roger Sinnott and Rick Fienberg).

//ThreeJS Boilerplate
renderer.alpha = true; 
renderer.setClearColor(0x000000, 0); 
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.render(scene, camera); 

//Add Orbital Controls to the camera -- Is there a better control option?
const controls = new OrbitControls(camera, renderer.domElement);

//Boilerplate Animate Code
function animate()
{
    requestAnimationFrame(animate);
    controls.update() //Allows the Orbital Controls to work
    renderer.render(scene,camera); //Allows the scene to continue rendering instead of just showing the initial frame
}
animate(); //Animate!

