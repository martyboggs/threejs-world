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

	var mesh = new THREE.Object3D();
	var jsonLoader = new THREE.JSONLoader();
	jsonLoader.load('/js/models/paperweight/paperweight.json',
		function (geometry, materials) {
			mesh = new THREE.Mesh(geometry,
				new THREE.MeshLambertMaterial({
					color: '#9e6039',
					transparent: true,
					opacity: 0.9
				}));
			scene.add(mesh);
		}
	);

	camera.position.set(0, 1.8, 4);

	function render() {
		mesh.rotation.y += 0.01;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
