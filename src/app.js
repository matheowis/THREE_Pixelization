// import * as THREE from 'three';
import { WebGLRenderer, Scene, PerspectiveCamera, Vector3, BoxGeometry,BoxBufferGeometry, MeshBasicMaterial, Mesh, Raycaster,DoubleSide } from 'three';
import { OrbitControls } from './controls/OrbitControls';
import {RaycastMesh} from "./RaycastMesh"
const renderer = new WebGLRenderer();
const scene = new Scene();
const camera = new PerspectiveCamera(70, 16 / 9, 0.1, 2000);
renderer.setSize(1280, 720);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera);

camera.position.set(0, 50, 200);
controls.update();

const point = new Vector3(2, 2, 2) // Your point
const direction = new Vector3(1, 1, 1);
const geometry = new BoxGeometry(100, 100, 100);

geometry.rotateX(Math.PI/4);
geometry.rotateZ(Math.PI/4);
geometry.computeBoundingBox();
console.log(geometry.boundingBox);
const material = new MeshBasicMaterial({ color: 0xffff00, side: DoubleSide });
const mesh = new RaycastMesh(geometry, material);
const raycaster = new Raycaster();
console.log(mesh.isPointInsideMe6(new Vector3(0,0,0)));
mesh.faceSegmentation();
raycaster.set(point, direction)
const intersects = raycaster.intersectObject(mesh);

if (intersects.length && direction.dot(intersects[0].face.normal) > 0) {
  console.log(`Point is in object`);
} else {
  console.log(`Point is out of object`);
}

console.log(mesh);
scene.add(mesh);

render();
function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}