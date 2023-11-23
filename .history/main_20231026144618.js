import * as THREE from "./three.min.js";
import { MTLLoader } from "./MTLLoader.js";
import { OBJLoader } from "./ObjLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import { Sky } from "./Sky.js";

// Basic Threejs variables
var scene;
var camera;
var renderer;
var clock;

// Boolean - True if every 3D object is loaded and ready to use
var is_Loaded = false;

// Game objs
var plant_cube = undefined; // ThreeJS Mesh	- CUBE WITH PLANTS
var tree_cube = undefined; // ThreeJS Mesh	- CUBE WITH A TREE
var basic_cube = undefined; // ThreeJS Mesh	- SIMPLE CUBE

var fence_cube = undefined; // ThreeJS Mesh
var fence_seamless_cube = undefined; // ThreeJS Mesh
var fence_angle_cube = undefined; // ThreeJS Mesh

// Performance stats
var stats;

//SKY - variables used with Sky Shader
var sky, sun;

/*
 * 	##################
 *
 *	 	FUNCTION LOADCUBES()
 *		This function is used to load all .OBJ 3D models into Threejs mesh global variables.
 *		Called in init() function
 *
 *		These 3D objects are .obj + .mtl files - static and non animated 3D objects
 *
 *	##################
 */
function LoadCubes(cubeVar) {
	var mtlLoader = new MTLLoader();

	// mtlLoader.load("../Blocks/plant_block" + ".mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("../Blocks/plant_block" + ".obj", function (object) {
	// 		plant_cube = object;
	// 	});
	// });

	// mtlLoader.load("../Blocks/tree_block" + ".mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("../Blocks/tree_block" + ".obj", function (object) {
	// 		tree_cube = object;
	// 	});
	// });

	// mtlLoader.load("../Blocks/basic_block" + ".mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("../Blocks/basic_block" + ".obj", function (object) {
	// 		basic_cube = object;
	// 	});
	// });

	// mtlLoader.load("../Blocks/fence_block" + ".mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("../Blocks/fence_block" + ".obj", function (object) {
	// 		fence_cube = object;
	// 	});
	// });

	// mtlLoader.load(
	// 	"../Blocks/fence_seamless_block" + ".mtl",
	// 	function (materials) {
	// 		materials.preload();
	// 		var objLoader = new OBJLoader();
	// 		objLoader.setMaterials(materials);
	// 		objLoader.load(
	// 			"../Blocks/fence_seamless_block" + ".obj",
	// 			function (object) {
	// 				fence_seamless_cube = object;
	// 			}
	// 		);
	// 	}
	// );

	// mtlLoader.load("../Blocks/fence_angle_block" + ".mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("../Blocks/fence_angle_block" + ".obj", function (object) {
	// 		fence_angle_cube = object;
	// 	});
	// });
}

/*
 * 	##################
 *
 *	 	FUNCTION INITSKY()
 *		This function is taken from official ThreeJS Sky shader example.
 *		This function in creating the beautiful sky color gradient shader + sun
 *
 *	##################
 */
function initSky() {
	// Add Sky
	sky = new Sky();
	sky.scale.setScalar(450000);
	scene.add(sky);

	sun = new THREE.Vector3();

	// SKY OPTIONS
	const effectController = {
		turbidity: 10,
		rayleigh: 3,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.7,
		elevation: 2,
		azimuth: 45,
		exposure: renderer.toneMappingExposure,
	};

	const uniforms = sky.material.uniforms;
	uniforms["turbidity"].value = effectController.turbidity;
	uniforms["rayleigh"].value = effectController.rayleigh;
	uniforms["mieCoefficient"].value = effectController.mieCoefficient;
	uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

	const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
	const theta = THREE.MathUtils.degToRad(effectController.azimuth);

	sun.setFromSphericalCoords(1, phi, theta);

	uniforms["sunPosition"].value.copy(sun);

	renderer.toneMappingExposure = effectController.exposure;
	renderer.render(scene, camera);
}

/*
 * 	##################
 *
 *	 	FUNCTION INIT()
 *		This function is the entry point of our javascript application.
 *		This function in creating all the basic settings like scene, camera, renderer.
 *		This function is calling all the loading functions, and defining the main game render loop.
 *
 *	##################
 */
function init() {
	clock = new THREE.Clock();
	scene = new THREE.Scene();

	// ---------------- RENDERER ----------------

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// ---------------- CAMERA ----------------

	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	camera.position.set(-5, 5, -5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	// ---------------- CONTROLS ----------------

	// OrbitControls is used for the basic camera controls.
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	// ---------------- WHITE GRID HELPER ----------------

	var helper = new THREE.GridHelper(10, 2, 0xffffff, 0xffffff);
	scene.add(helper);

	// ---------------- LIGHTS ----------------

	var ambientLight = new THREE.AmbientLight(0xcccccc, 2);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
	directionalLight.position.set(-1, 1, 1);
	scene.add(directionalLight);

	// ---------------- EVENTS ----------------

	window.addEventListener("resize", onWindowResize, false);

	// ---------------- CALLING LOADING AND INIT FUNCTIONS ----------------

	LoadCubes();
	initSky();

	// ---------------- PERFORMANCE STATS PLUGIN ----------------

	stats = new Stats();
	stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom);

	// ---------------- STARTING THE GAME MAIN LOOP ----------------
}

/*
 * 	##################
 *
 *	 	FUNCTION CheckLoaded()
 *		This function is only used to check if all 3D models are loaded.
 *		We are simply checking if some global variables are valid.
 *
 *		Return true if everything is loaded and ready to use
 *		Return false if at least something is not loaded and not ready to use yet
 *
 *	##################
 */
function CheckLoaded() {
	if (fence_cube == undefined) {
		return false;
	}

	if (fence_angle_cube == undefined) {
		return false;
	}

	if (fence_seamless_cube == undefined) {
		return false;
	}

	if (tree_cube == undefined) {
		return false;
	}

	if (plant_cube == undefined) {
		return false;
	}

	if (basic_cube == undefined) {
		return false;
	}

	return true;
}

/*
 * 	##################
 *
 *	 	FUNCTION RENDER()
 *		This function is the main loop of our ThreeJS application.
 *		This function is used for all the works needed to be done every game tick.
 *
 *		1) stats update ( fps ect)
 *		2) check every tick if everything is loaded - when True, init the map (executed only ONCE thanks to "is_Loaded boolean")
 *		3) if everything is already loaded, execute all game tick tasks
 *		4) render the 3D world
 *		5) calling itself - that's how the "render loop" works as an endless loop
 *
 *	##################
 */

/*
 * 	##################
 *
 *	 	FUNCTION INITMAP()
 *		InitMap contains all the tasks to execute only once - when the 3D models are loaded
 *
 *		1) Build the map with 3D elements
 *
 *	##################
 */
function InitMap() {
	// ---------------- MAP BLOCKS ----------------

	var tmpblock1 = basic_cube.clone();
	scene.add(tmpblock1);

	var tmpblock2 = basic_cube.clone();
	tmpblock2.position.x = 2;
	scene.add(tmpblock2);

	var tmpblock3 = plant_cube.clone();
	tmpblock3.position.x = -2;
	scene.add(tmpblock3);

	var tmpblock4 = basic_cube.clone();
	tmpblock4.position.z = -2;
	tmpblock4.position.x = -2;
	scene.add(tmpblock4);

	var tmpblock5 = tree_cube.clone();
	tmpblock5.position.z = -2;
	tmpblock5.position.x = 2;
	scene.add(tmpblock5);

	var tmpblock6 = plant_cube.clone();
	tmpblock6.position.z = -2;
	scene.add(tmpblock6);

	var tmpblock7 = plant_cube.clone();
	tmpblock7.position.z = 2;
	scene.add(tmpblock7);

	var tmpblock8 = basic_cube.clone();
	tmpblock8.position.z = 2;
	tmpblock8.position.x = 2;
	scene.add(tmpblock8);

	var tmpblock9 = basic_cube.clone();
	tmpblock9.position.z = 2;
	tmpblock9.position.x = -2;
	scene.add(tmpblock9);

	var tmpblock10 = fence_angle_cube.clone();
	tmpblock10.position.z = 4;
	tmpblock10.position.x = -4;
	tmpblock10.rotation.y = Math.PI;
	scene.add(tmpblock10);

	var tmpblock11 = fence_cube.clone();
	tmpblock11.position.z = 4;
	tmpblock11.position.x = -2;
	scene.add(tmpblock11);

	var tmpblock12 = fence_cube.clone();
	tmpblock12.position.z = 2;
	tmpblock12.position.x = -4;
	tmpblock12.rotation.y = Math.PI / 2;
	scene.add(tmpblock12);

	var tmpblock13 = plant_cube.clone();
	tmpblock13.position.z = 0;
	tmpblock13.position.x = -4;
	tmpblock13.rotation.y = Math.PI / 2;
	scene.add(tmpblock13);

	var tmpblock14 = basic_cube.clone();
	tmpblock14.position.z = -2;
	tmpblock14.position.x = -4;
	tmpblock14.rotation.y = Math.PI / 2;
	scene.add(tmpblock14);

	var tmpblock15 = basic_cube.clone();
	tmpblock15.position.z = 4;
	scene.add(tmpblock15);

	var tmpblock16 = tree_cube.clone();
	tmpblock16.position.z = 4;
	tmpblock16.position.x = 2;
	scene.add(tmpblock16);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
