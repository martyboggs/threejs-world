(function () {
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(
		75, window.innerWidth / window.innerHeight, 0.1, 1000
	);
	camera.position.z = 2;

	var renderer = new THREE.WebGLRenderer({
		canvas: document.getElementsByClassName('ex1-1')[0],
		alpha: true
	});
	renderer.setSize(660, 330);

	var ambientLight = new THREE.AmbientLight('#444')
	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 20, 14);
	scene.add(ambientLight, directionalLight);

	var geometry = new THREE.BoxGeometry(2, 1, 1);
	var material = new THREE.MeshLambertMaterial({color: 'blue'});
	var cube = new THREE.Mesh(geometry, material);
	scene.add(cube);

	function render() {
		cube.rotation.y += 0.01;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
