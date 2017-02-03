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

	var group1 = new THREE.Object3D();
	var mesh1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial({color: 'darkblue'}));
	group1.add(mesh1);

	var mesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 1), new THREE.MeshLambertMaterial({color: 'lightgreen'}));
	mesh2.position.set(1, 0, 0);
	group1.add(mesh2);

	var mesh3 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({color: 'red'}));
	mesh3.position.set(-1, 0, 0);
	group1.add(mesh3);
	scene.add(group1);

	function startAnimation() {
		new TWEEN.Tween(group1.position).to({x: 1}, 1000).easing(TWEEN.Easing.Elastic.Out).delay(3000).onComplete(function () {
			new TWEEN.Tween(mesh1.rotation).to({y: '+3.141'}, 500).easing(TWEEN.Easing.Quintic.InOut).start();
			new TWEEN.Tween(mesh2.rotation).to({x: '+3.141'}, 500).delay(250).easing(TWEEN.Easing.Quintic.InOut).start();
			new TWEEN.Tween(mesh3.rotation).to({z: '+3.141'}, 500).delay(500).easing(TWEEN.Easing.Quintic.InOut).start();
			new TWEEN.Tween(group1.position).to({x: '-2'}, 1000).easing(TWEEN.Easing.Bounce.Out).onComplete(function () {
				new TWEEN.Tween(group1.rotation).to({z: '3.141'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
					new TWEEN.Tween(mesh1.rotation).to({z: '3.141'}, 1000).easing(TWEEN.Easing.Quintic.InOut).start();
					new TWEEN.Tween(group1.position).to({x: '+2'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
						new TWEEN.Tween(group1.rotation).to({y: '+6.282'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
							new TWEEN.Tween(group1.position).to({x: '-2'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
								new TWEEN.Tween(group1.position).to({x: '+2'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
									new TWEEN.Tween(group1.rotation).to({z: '-3.141'}, 1000).easing(TWEEN.Easing.Bounce.Out).start();
								}).start();
							}).start();
						}).start();
					}).start();
				}).start();
			}).start();
		}).start();
	}

	camera.position.set(0, 0, 2);

	var totalFrames = 11 * 60;
	var frames = 0;

	function render() {
		if (frames === 0) {
			frames = totalFrames;
			startAnimation();
		} else {
			frames -= 1;
		}

		requestAnimationFrame(render);
		renderer.render(scene, camera);
		TWEEN.update();
	}
	render();
}());
