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

	var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(0, 2, 14);
	scene.add(directionalLight);

	var loader = new THREE.TextureLoader();

	// head
	var texture = loader.load('/images/bb8head.png');
	var head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshPhongMaterial({map: texture}));
	head.position.y = 1;
	scene.add(head);

	// create the antenna
	var geometry = new THREE.CylinderGeometry(0.01, 0.01, 2);
	var material = new THREE.MeshBasicMaterial({color: 'gray'});
	var antennae1 = new THREE.Mesh(geometry, material);
	var geometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
	var material = new THREE.MeshBasicMaterial({color: 'gray'});
	var antennae2 = new THREE.Mesh(geometry, material);
	antennae1.position.set(0, 1.3, 0);
	antennae2.position.set(0.1, 1.3, 0);
	scene.add(antennae1, antennae2);

	//single tile
	var geometry = new THREE.BoxGeometry(1, 1, 1, 8, 8, 8);
	// morph box into a sphere
	for ( var i = 0; i < geometry.vertices.length; i ++ ) {
		geometry.vertices[i].normalize();
	}
	// redefine vertex normals consistent with a sphere; reset UVs
	for (var i = 0; i < geometry.faces.length; i += 1) {
		var face = geometry.faces[i];
		face.vertexNormals[0].copy(geometry.vertices[face.a]).normalize();
		face.vertexNormals[1].copy(geometry.vertices[face.b]).normalize();
		face.vertexNormals[2].copy(geometry.vertices[face.c]).normalize();
	}
	var texture = loader.load('/images/bb8one.png');
	var body = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({map: texture}));
	scene.add(body);

	camera.position.set(0, 1.3, 3);
	camera.rotation.set(-0.25, 0, 0);

	function render() {
		body.rotation.y += 0.01;
		body.rotation.x += 0.06;
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}
	render();
}());
