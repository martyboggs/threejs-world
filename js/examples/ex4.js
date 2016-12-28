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
	jsonLoader.load('/js/models/hugbot/hugbot.json',
		function (geometry, materials) {
			for (var i = 0; i < materials; i += 1) {
				materials[i].skinning = true;
			}
			mesh = new THREE.SkinnedMesh(geometry,
			new THREE.MeshLambertMaterial({
				color: '#9e6039',
				transparent: true,
				opacity: 0.9
			}));
			// new THREE.MultiMaterial(materials)
			scene.add(mesh);

			console.log(mesh);
		}
	);

	camera.position.set(0, 3, 7);

	function render() {
		// mesh.rotation.y += 0.01;

		if (mesh.skeleton) {
			for (var i = 0; i < mesh.skeleton.bones.length; i += 1) {
				mesh.skeleton.bones[i].rotation.x += 0.01;
				mesh.skeleton.bones[i].rotation.y += 0.01;
				mesh.skeleton.bones[i].rotation.z += 0.01;
			}
		}

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
