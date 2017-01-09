---
---
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(
	75, 2, 0.1, 1000
);
camera.position.z = 2;
var renderer = new THREE.WebGLRenderer({
	alpha: true
});
renderer.setSize(660, 330);
document.getElementById('canvases').appendChild(renderer.domElement);
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 2);
scene.add(directionalLight);

// Our JavaScript will go here.

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();