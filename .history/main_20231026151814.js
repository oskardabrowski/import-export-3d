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

	// mtlLoader.load("./textures.mtl", function (materials) {
	// 	materials.preload();
	// 	var objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
	// 	objLoader.load("./textures.obj", function (object) {
	// 		const obj = object;
	// 		scene.add(obj);
	// 	});
	// });
	mtlLoader.load("./GeomOBJ.mtl", function (materials) {
		materials.preload();
		var objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("./GeomOBJ.obj", function (object) {
			const obj = object;
			scene.add(obj);
		});
	});
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

	var helper = new THREE.GridHelper(10, 6, 0xffffff, 0xffffff);
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
