(function () {
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(
		75, 2, 0.1, 1000
	);

	var renderer = new THREE.WebGLRenderer({
		alpha: true,
		gammaInput: true,
		gammaOutput: true
	});
	renderer.setSize(660, 330);
	document.getElementById('canvases').appendChild(renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0xffffff);
	var pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
	pointLight.position.set(0, 1.4, 3.4);
	scene.add(pointLight, ambientLight);
var gui = new dat.GUI();
console.log(pointLight);
gui.add(pointLight, 'intensity', 0, 1000);
gui.add(ambientLight, 'intensity', 0, 1000);
gui.add(pointLight.position, 'x', -35, 35);
gui.add(pointLight.position, 'y', -35, 35);
gui.add(pointLight.position, 'z', -35, 35);
	var geometry = new THREE.SphereGeometry(5, 64, 64);
	var material = new THREE.MeshStandardMaterial({color: 'green', roughness: 0.5});

	var envMap = new THREE.TextureLoader().load('/images/shiny-env-map.png');
	envMap.mapping = THREE.SphericalReflectionMapping;
	material.envMap = envMap;
	// var roughnessMap = new THREE.TextureLoader().load('/images/shiny-roughness-map.png');
	// roughnessMap.magFilter = THREE.NearestFilter;
	// material.roughnessMap = roughnessMap;
	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	camera.position.set(0, -2, 13);

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
