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

//SKY - variables used with Sky Shader
var sky, sun;

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

function init() {
	clock = new THREE.Clock();
	scene = new THREE.Scene();

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);
	camera.position.set(-5, 5, -5);
	camera.lookAt(new THREE.Vector3(0, 0, 0));
	scene.add(camera);

	const controls = new OrbitControls(camera, renderer.domElement);
	controls.update();

	var helper = new THREE.GridHelper(10, 5, 0xffffff, 0xffffff);
	scene.add(helper);

	var ambientLight = new THREE.AmbientLight(0xcccccc, 2);
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
	directionalLight.position.set(-1, 1, 1);
	scene.add(directionalLight);

	window.addEventListener("resize", onWindowResize, false);

	LoadCubes();
	initSky();
	render();
}

function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
