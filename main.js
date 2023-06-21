import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// import gsap from "./node_modules/gsap/gsap-core.js";
import { gsap } from "./node_modules/gsap/all.js";
import { EffectComposer } from "/node_modules/three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "/node_modules/three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js";

var deg = 0;
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

//setting camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 50;

const canvas = document.getElementById("canv");

//Renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
// renderer.autoClear = false;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.setClearColor(0x000000, 0.0);
document.body.appendChild(renderer.domElement);

//Bloom Pass
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,
  0.4,
  0.85
);
bloomPass.threshold = 0;
bloomPass.strength = 1; //intensity of glow
bloomPass.radius = 0;
const bloomComposer = new EffectComposer(renderer);
bloomComposer.setSize(window.innerWidth, window.innerHeight);
bloomComposer.renderToScreen = true;
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

//galaxy geometry
const starGeometry = new THREE.SphereGeometry(80, 64, 64);

//galxy material
const starMaterial = new THREE.MeshBasicMaterial({
  map: new THREE.TextureLoader().load("./public/texture/galaxy1.png"),
  side: THREE.BackSide,
  transparent: true,
});

//galaxy maesh
const starMesh = new THREE.Mesh(starGeometry, starMaterial);
starMesh.layers.set(1)
scene.add(starMesh)

//sun object
const color = new THREE.Color("#FDB813");
const geometry = new THREE.IcosahedronGeometry(2, 15);
const material = new THREE.MeshBasicMaterial({
  color: color,
});
const sphere = new THREE.Mesh(geometry, material);
sphere.position.set(-50, 20, -60);
sphere.layers.set(1);
scene.add(sphere);

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

//Lights
const light = new THREE.PointLight(0xffa500, 0.5, 100);
const light2 = new THREE.PointLight(0xffffff, 0.02, 100);

light.position.set(0, 0, 0);
light2.position.set(0, 0, 20);
light.layers.set(1);
light2.layers.set(1);
scene.add(light);
scene.add(light2);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

//sun geometry
const sgeometry = new THREE.SphereGeometry(3, 64, 64);
const smaterial = new THREE.MeshStandardMaterial({
  color: 0x89cff0,
  emissive: 0xffa500,
  emissiveIntensity: 1,
});

//earth geometry
const pgeometry = new THREE.SphereGeometry(1, 64, 64);
const pmaterial = new THREE.MeshStandardMaterial({ color: 0x89cff0 });
const sun = new THREE.Mesh(sgeometry, smaterial);
const earth = new THREE.Mesh(pgeometry, pmaterial);

earth.layers.set(1);
scene.add(earth);
// scene.add(sun);

//Animate
function animate() {
  requestAnimationFrame(animate);
  deg += 0.004;
  earth.position.x = 15 * Math.cos(deg);
  earth.position.z = 15 * Math.sin(deg);

  starMesh.rotation.y += 0.0002
  renderer.render(scene, camera);
  camera.layers.set(1);
  bloomComposer.render();
  camera.layers.set(0);
}

//Update sizes
window.addEventListener("resize", () => {
  //update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect = sizes.width / sizes.height;

  renderer.setSize(sizes.width, sizes.height);
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
});

//Check if browser suppports the WebGL
if (WebGL.isWebGLAvailable()) {
  // Initiate function or other initializations here
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("container").appendChild(warning);
}

const t1 = gsap.timeline({ defaults: { duration: 1 } });
t1.fromTo("nav", { y: "-100%" }, { delay: 0, duration: 1, y: "0%" });
t1.fromTo(sun.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 });
t1.fromTo(".title", { opacity: 0 }, { opacity: 1});
// t1.fromTo(earth.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1, duration:0 });
