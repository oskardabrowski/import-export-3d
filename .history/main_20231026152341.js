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

	var mtlLoader = new MTLLoader();

	mtlLoader.load("./textures.mtl", function (materials) {
		materials.preload();
		var objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load("./textures.obj", function (object) {
			const obj = object;
			scene.add(obj);
		});
	});

	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
