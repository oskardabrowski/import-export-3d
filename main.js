import * as THREE from "./three.min.js";
import { MTLLoader } from "./MTLLoader.js";
import { OBJLoader } from "./ObjLoader.js";
import { OrbitControls } from "./OrbitControls.js";
import { GLTFExporter } from "./GLTFExporter.js";

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

  // const mtlLoader = new MTLLoader();
  // mtlLoader.load("./budynek.mtl", function (materials) {
	// 	materials.preload();
	// 	const objLoader = new OBJLoader();
	// 	objLoader.setMaterials(materials);
  //     objLoader.load("./budynek2.obj", function (object) {
	// 	  	const obj = object;
	// 	  	scene.add(obj);
	// 	  });
	// });

	render();
}

function render() {
	renderer.render(scene, camera);
	requestAnimationFrame(render);
}

init();

function exportmodel() {

  const exporter = new GLTFExporter();

  exporter.parse(scene, function(gltf) {	
    console.log(gltf);
		const output = JSON.stringify( gltf, null, 2 );
		saveString( output, 'scene.gltf' );
  }, {});
}

function saveString(text, filename) {

  save(new Blob([text], {
    type: 'text/plain'
  }), filename);
}

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link);

function save(blob, filename) {
  console.log(blob)

  console.log(URL.createObjectURL(blob));

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();

}

document.querySelector("#EksporterBtn").addEventListener("click", () => {
  exportmodel();
});

document.querySelector("#ImporterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#ImportedFiles");
  const filesArr = Array.from(input.files);
  if(filesArr.length <= 2) {
    const mtlFile = filesArr.find((el) => el.name.toLowerCase().includes('.mtl'));
    const objFile = filesArr.find((el) => el.name.toLowerCase().includes('.obj'));

    const mtlLoader = new MTLLoader();

	  if(mtlFile != null) {

      const reader = new FileReader();
      reader.addEventListener("load", async (event) => {
        mtlLoader.load(event.target.result, function (materials) {
	      	materials.preload();
	      	const objLoader = new OBJLoader();
	      	objLoader.setMaterials(materials);

          const objReader = new FileReader();
          objReader.addEventListener("load", async (event) => {
            objLoader.load(event.target.result, function (object) {
	      	  	const obj = object;
	      	  	scene.add(obj);
	      	  });
          })
          objReader.readAsDataURL(objFile);

	      	
	      });
      });
      reader.readAsDataURL(mtlFile);
    } else {
      const objLoader = new OBJLoader();
      const objReader = new FileReader();
      objReader.addEventListener("load", async (event) => {
        objLoader.load(event.target.result, function (object) {
	      	const obj = object;
	      	scene.add(obj);
	      });
      })
      objReader.readAsDataURL(objFile);
    }
  }
});