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
	var group2 = new THREE.Object3D();

	var mesh1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), new THREE.MeshLambertMaterial({color: '#d2a43f'}));
	mesh1.position.set(-1, 0, 0);

	var mesh2; // skull

	var mesh3 = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 16), new THREE.MeshLambertMaterial({color: '#476490'}));
	mesh3.position.set(1, 0, 0);

	group2.add(mesh1, mesh3);

	new THREE.JSONLoader().load('../js/models/skull/skull.json', function (geometry, materials) {
		mesh2 = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: '#b4b4b4'}));
		mesh2.position.set(0, -0.33, 0);
		mesh2.rotation.y = -0.3;
		mesh2.scale.set(0.1, 0.1, 0.1);
		group1.add(mesh2, group2);
		scene.add(group1);
		startAnimation();
	});

	function startAnimation() {
		new TWEEN.Tween(mesh1.position).to({x: [-0.5, -2]}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(3000).start();
		new TWEEN.Tween(mesh2.position).to({x: [0.5, -1]}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(3250).start();
		new TWEEN.Tween(mesh3.position).to({x: [1.5, 0]}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(3500).start();
		new TWEEN.Tween(mesh3.position).to({}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(4000).onComplete(function () {
			new TWEEN.Tween(group1.rotation).to({z: '+6.282'}, 2000).easing(TWEEN.Easing.Sinusoidal.Out).onComplete(function () {
				new TWEEN.Tween(group1.position).to({y: '-0.5'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
					new TWEEN.Tween(group1.rotation).to({y: '+6.282'}, 2000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
						new TWEEN.Tween(mesh3.position).to({x: '+1'}, 250).easing(TWEEN.Easing.Quintic.InOut).start();
						new TWEEN.Tween(mesh2.position).to({x: '+1'}, 250).delay(250).easing(TWEEN.Easing.Quintic.InOut).start();
						new TWEEN.Tween(mesh1.position).to({x: '+1'}, 250).delay(500).easing(TWEEN.Easing.Quintic.InOut).start();
						new TWEEN.Tween(group1.position).to({y: '+0.5'}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
							new TWEEN.Tween(group1.position).to({z: [1, 0]}, 1000).easing(TWEEN.Easing.Sinusoidal.Out).start();
							startAnimation();
						}).start();
					}).start();
				}).start();
			}).start();
		}).start();
	}
	// todo:
	/*
in a sine curve with amplitude growing
spinning along y. outside fly out
skull back along z

skull has constant hovering motion
left
right
left and square is following
right and square and sphere following
left and skull chases others
skull lunges at camera


	*/

	camera.position.set(0, 0, 2);

	var startedAnimation = false;

	function render() {
console.log(group1.position);
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		TWEEN.update();
	}
	render();
}());
