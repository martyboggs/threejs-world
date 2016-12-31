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
			mesh = new THREE.SkinnedMesh(geometry,
			new THREE.MeshLambertMaterial({
				color: '#75b6fb',
				transparent: true,
				opacity: 0.9,
				skinning: true
			}));
			mesh.rotation.y = -Math.PI / 2;
			scene.add(mesh);
		}
	);

	camera.position.set(0, 3, 7);
	var osc = 0;
	function render() {
		mesh.rotation.y += 0.01;
		if (mesh.skeleton) {
			// right foot
			mesh.skeleton.bones[0].rotation.x = -0.2 * Math.sin(2 * osc) - 0.1;
			mesh.skeleton.bones[0].rotation.y = -0.2 * Math.cos(2 * osc) - 0.1;
			// left foot
			mesh.skeleton.bones[1].rotation.x = -0.2 * Math.cos(2 * osc) - 0.1;
			mesh.skeleton.bones[1].rotation.y = -0.2 * Math.sin(2 * osc) - 0.1;
			// body
			mesh.skeleton.bones[2].rotation.x = 0.1 * Math.sin(2 * osc);
			mesh.skeleton.bones[2].rotation.z = 0.2 * Math.sin(osc) + 0.1;
			// left upper arm
			mesh.skeleton.bones[3].rotation.x = 0.5 * Math.sin(osc) + 0.5;
			mesh.skeleton.bones[3].rotation.y = -Math.sin(osc) - 0.8;
			// right upper arm
			mesh.skeleton.bones[5].rotation.x = -0.5 * Math.sin(osc) - 0.5;
			mesh.skeleton.bones[5].rotation.y = Math.sin(osc) + 0.8;
			// left lower arm
			mesh.skeleton.bones[4].rotation.x = 0.2 * Math.sin(osc) + 0.2;
			// right lower arm
			mesh.skeleton.bones[6].rotation.x = -0.2 * Math.sin(osc) - 0.2;
		}
		osc += 0.05;

		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
