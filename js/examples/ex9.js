(function () {
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(
		75, 2, 0.1, 1000
	);

	var renderer = new THREE.WebGLRenderer({
		alpha: true
	});
	renderer.setSize(660, 330);
	document.getElementById('canvases').appendChild(renderer.domElement);

	var ambientLight = new THREE.AmbientLight(0xffffff, 1);
	var pointLight = new THREE.PointLight(0xffffff, 1, 10, 2);
	pointLight.position.set(0, 1.4, 3.4);
	scene.add(pointLight, ambientLight);

	var mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 'darkblue'}));
	mesh.position.x = -1;
	scene.add(mesh);
	new TWEEN.Tween(mesh.position).to({x: [1, -1]}, 7000).repeat(Infinity).easing(TWEEN.Easing.Sinusoidal.InOut).start();

	camera.position.set(0, 0, 2);

	function render() {
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		TWEEN.update();
	}
	render();
}());
