function initScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75, window.innerWidth / window.innerHeight, 0.1, 1000
	);
	camera.position.set(40, 20, 40);
	camera.rotation.y = Math.PI / 4;
	camera.rotation.order = 'YZX';

	var n = navigator.userAgent;
	var antialias = true;
	if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) { isMobile = true;  antialias = false; }
	renderer = new THREE.WebGLRenderer({antialias: antialias, precision: 'mediump'});
	renderer.setClearColor('white', 1);
	document.getElementById('canvases').appendChild(renderer.domElement);
	onWindowResize();

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.position.set(2, 2, 2);
	scene.add(directionalLight);
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight);

	if (!isMobile) {
		directionalLight.castShadow = true;
		var d = 300;
		directionalLight.shadow.camera = new THREE.OrthographicCamera( -d, d, d, -d,  500, 1600 );
		directionalLight.shadow.bias = 0.0001;
		directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
		scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
		scene.add(directionalLight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;
	}

	//Create an AudioListener and add it to the camera
	var listener = new THREE.AudioListener();
	camera.add(listener);

	//Create the PositionalAudio object (passing in the listener)
	flapSound = new THREE.PositionalAudio(listener);

	//Load a sound and set it as the PositionalAudio object's buffer
	var audioLoader = new THREE.AudioLoader();
	audioLoader.load('/sounds/flap.wav', function (buffer) {
		flapSound.setBuffer(buffer);
		flapSound.setRefDistance(20);
		flapSound.play();
	});

	window.addEventListener('resize', onWindowResize, false);

	// axisHelper = new THREE.AxisHelper(40);
	// scene.add(axisHelper);
	var gridHelper = new THREE.GridHelper(500, 50);
	scene.add(gridHelper);
}

function FlexMobileButtons(args) {
	this.args = args || {};
	if (!('mobileOnly' in this.args)) this.args.mobileOnly = false;
	if (!this.args.onclick) this.args.onclick = onclick;
	if (!this.args.offclick) this.args.offclick = offclick;
	if (this.args.mobileOnly)
		this.isMobile = checkMobile();
	if (!this.args.element)
		this.args.element = document.getElementById('fmb-container');
	if (!this.args.element) {
		this.args.element = document.createElement('div');
		this.args.element.className = this.args.element.id = 'fmb-container';
		if (renderer) {
			var r = renderer.domElement;
			r.parentNode.insertBefore(this.args.element, r.nextSibling);
		} else {
			document.body.append(this.args.element);
		}
	}

	this.containers = [];
	this.container = this.args.element;
	this.clicking = {};
	var self = this;

	this.args.element.addEventListener('mousedown', buttonOnClick);
	// document.addEventListener('mouseup', buttonOffClick);
	// document.addEventListener('mouseout', buttonOffClick);
	this.args.element.addEventListener('touchstart', buttonOnClick);
	document.addEventListener('touchend', buttonOffClick);

	function checkMobile() {
		return n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i);
	}

	function isButton(target) {
		return target.className.indexOf('fmb-button') !== -1;
	}

	function onclick(value) {
		self.clicking[value] = true;
	}
	function offclick(value) {
		self.clicking[value] = false;
	}

	function buttonOnClick(e) {
		e.preventDefault();
		if (e.type === 'touchstart') {
			for (var i = 0; i < e.touches.length; i += 1) {
				if (isButton(e.touches[i].target)) {
					self.args.onclick(e.touches[i].target.value);
					document.getElementById('info').innerHTML += ' touch ' + i;
				}
			}
		} else {
			document.addEventListener('mouseup', buttonOffClick);
			document.addEventListener('mouseout', buttonOffClick);
			if (isButton(e.target)) {
				self.args.onclick(e.target.value);
			}
		}

	}

	function buttonOffClick(e) {
		if (e.type === 'touchend') {
			for (var i = 0; i < e.changedTouches.length; i += 1) {
				if (isButton(e.changedTouches[i].target)) {
					self.args.offclick(e.changedTouches[i].target.value);
					document.getElementById('info').innerHTML += ' touchoff ' + i;
				}
			}
			e.touches
		} else {
			document.removeEventListener('mouseup', buttonOffClick);
			document.removeEventListener('mouseout', buttonOffClick);
			self.args.offclick(e.target.value);
		}
	}
}
FlexMobileButtons.prototype.button = function (value, type) {
	this.clicking[value] = false;
	var input = document.createElement('input');
	input.type = 'submit';
	input.className = 'fmb-button';
	if (type === 'wide') input.className += ' fmb-wide';
	input.value = value;
	this.container.appendChild(input);
	return this;
};
FlexMobileButtons.prototype.row = function () {
	this.container = document.createElement('div');
	this.container.className = 'fmb-row';
	this.containers.push(this.container);
	return this;
};
FlexMobileButtons.prototype.init = function () {
	if (this.args.mobileOnly && !this.isMobile) return;
	for (var i = 0; i < this.containers.length; i += 1) {
		this.args.element.appendChild(this.containers[i]);
	}
	return this;
};

function initBird() {
	bodyWidth = 6;
	var wing1Width = 13;
	var wing2Width = 5;
	var thickness = 1;

	birdBody = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth, 6, 12), blue2);
	birdBody.position.set(0, 0, -1);

	var wingR1 = new THREE.Mesh(new THREE.BoxGeometry(wing1Width, thickness, 10), blue2);
	wingR1.position.set(-wing1Width / 2, 0.4, -1);
	var wingR2 = new THREE.Mesh(new THREE.BoxGeometry(wing2Width, thickness, 5), blue2);
	wingR2.position.set(-wing2Width / 2, 0.4, 0.5);
	wingtipR = new THREE.Object3D().add(wingR2);
	wingtipR.position.x = -wing1Width;
	wingR = new THREE.Object3D().add(wingR1, wingtipR);
	wingR.position.set(-bodyWidth / 2, 1, 0);

	var wingL1 = new THREE.Mesh(new THREE.BoxGeometry(wing1Width, thickness, 10), blue2);
	wingL1.position.set(wing1Width / 2, 0.4, -1);
	var wingL2 = new THREE.Mesh(new THREE.BoxGeometry(wing2Width, thickness, 5), blue2);
	wingL2.position.set(wing2Width / 2, 0.4, 0.5);
	wingtipL = new THREE.Object3D().add(wingL2);
	wingtipL.position.x = wing1Width;
	wingL = new THREE.Object3D().add(wingL1, wingtipL);
	wingL.position.set(bodyWidth / 2, 1, 0);
	head = new THREE.Object3D();
	var headSphere = new THREE.Mesh(new THREE.SphereGeometry(2.8, 6, 6), blue2);
	headSphere.rotation.y = Math.PI / 6;
	var eye1 = new THREE.Object3D();
	eye1.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1), white));
	var iris = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1), black);
	iris.position.y = -0.2;
	eye1.add(iris);
	eye1.position.set(2, 0.2, 0.2);
	eye1.rotation.set(0, 0, Math.PI / 2);
	var eye2 = eye1.clone();
	eye2.position.x = -2;
	eye2.rotation.y = Math.PI;
	var beak1 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 3), yellow)
	beak1.position.set(0, 0.2, 3);
	beak1.rotation.set(-Math.PI / 2, 0, Math.PI);
	var beak2 = beak1.clone();
	beak2.position.y = -0.6;
	beak2.rotation.y = Math.PI;
	head.add(headSphere, eye1, eye2, beak1, beak2);
	head.position.set(0, 1, 7.8);
	bird = new THREE.Object3D().add(wingR, wingL, birdBody, head);
	scene.add(bird);
	bird.add(flapSound);
}

function initTable() {
	tableShape = {
		types: ['box', 'box', 'box', 'box', 'box'],
		sizes: [20,1,20, 1,16,1, 1,16,1, 1,16,1, 1,16,1],
		positions: [0,0,0, -9,-8,-9, -9,-8,9, 9,-8,-9, 9,-8,9],
		geometry: new THREE.BufferGeometry()
	};
	// tableShape = {
	// 	types: [ 'box', 'box', 'box', 'box', 'box', 'box', 'box', 'box' ],
	// 	sizes: [ 30,5,30,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  4,30,4,  23,10,3 ],
	// 	positions: [ 0,0,0,  12,-16,12,  -12,-16,12,  12,-16,-12,  -12,-16,-12,  12,16,-12,  -12,16,-12,  0,25,-12 ],
	// 	geometry: new THREE.BufferGeometry()
	// };

	var g = new THREE.Geometry();
	var mesh, n, m;
	for (var i = 0; i < tableShape.types.length; i += 1) {
		n = i * 3;
		m = new THREE.Matrix4().makeTranslation(
			tableShape.positions[n + 0],
			tableShape.positions[n + 1],
			tableShape.positions[n + 2]);
		m.scale(new THREE.Vector3(
			tableShape.sizes[n + 0],
			tableShape.sizes[n + 1],
			tableShape.sizes[n + 2]));
		g.merge(geoBox, m);
	}
	tableShape.geometry.fromGeometry(g);
}

function initPhysics() {
	world = new OIMO.World({
		timestep: 1/60,
		iterations: 8,
		broadphase: 2, // 1: brute force, 2: sweep & prune, 3: volume tree
		worldscale: 1,
		random: true,
		info: true // display statistique
	});
	world.gravity = new OIMO.Vec3(0, -98, 0);

	// bird body (make compound?)
	var body = world.add({
		type: 'box',
		size: [6, 6, 12], pos: [0, 20, 0],
		move: true
	});
	bird.position.y = 20;
	bodies.push(body);
	body.connectMesh(bird);

	var ground = {size: [500, 50, 500], pos: [0, -25, 0]};
	placeGround(ground);

	var tables = [
		{pos: [15, 16, -50]},
		{pos: [36, 16, -36]},
		{pos: [-36, 16, 36]},

		{pos: [-36, 16, -36]},
		{pos: [-36, 32, -36]},
		{pos: [-36, 48, -36]},
		{pos: [-36, 64, -36]},

		{pos: [-36, 16, 0]},
		{pos: [-36, 32, 0]},
		{pos: [-36, 48, 0]},
		{pos: [-36, 64, 0]},
	];
	placeTables(tables);

	var boundaries = [
		{pos: [-250, 250, 0], size: [1, 500, 500], color: gray},
		{pos: [250, 250, 0], size: [1, 500, 500], color: gray},
		{pos: [0, 250, 250], size: [500, 500, 1], color: gray},
		{pos: [0, 250, -250], size: [500, 500, 1], color: gray}
	];
	placeBoundaries(boundaries);
}


function render() {
	// document.getElementById('info').innerHTML = world.getInfo();
	// document.getElementById('info').innerHTML = '';

	wingAction = 'hover';
	// wingsAway = false
	// bird lands, wingsAway switched on
	//

	if (bird.position.y < 9) { // needs to be foot collisiond
		wingAction = 'walking';
	} else {
		if (wingsAway) {
			openWings();
		}
	}

	if (keyboard.pressed('j') || fmb.clicking.J) {
		if (wingsAway) {
			openWings();
		}

		if (wingAction !== 'flapping') {
			wingAction = 'flapping';
			wingsAway = false;
		}
	}

	switch (wingAction) {
		case 'hover':
			if (up && wingL.rotation.z < 1) {
				wingL.rotation.z += 0.1;
				wingR.rotation.z -= 0.1;
				wingtipL.rotation.z -= 0.1;
				wingtipR.rotation.z += 0.1;
				if (!wingImpulse) {
					bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(0, 5000, 0));
					wingImpulse = true;
				}
				wingTimer += 0.1;
			} else {
				up = false;
				wingImpulse = false;
			}

			if (!up && wingL.rotation.z > -1.2) {
				wingL.rotation.z -= 0.5;
				wingR.rotation.z += 0.5;
				wingtipL.rotation.z += 0.5;
				wingtipR.rotation.z -= 0.5;
				wingTimer -= 0.1;
			} else {
				up = true;
			}
		break;
		case 'flapping':
			if (up && wingL.rotation.z < 1) {
				wingL.rotation.z += 0.5;
				wingR.rotation.z -= 0.5;
				wingtipL.rotation.z -= 0.5;
				wingtipR.rotation.z += 0.5;
				bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(0, 2200, 0));
				wingTimer += 0.1;
			} else {
				up = false;
			}

			if (!up && wingL.rotation.z > -1.2) {
				wingL.rotation.z -= 0.5;
				wingR.rotation.z += 0.5;
				wingtipL.rotation.z += 0.5;
				wingtipR.rotation.z -= 0.5;
				wingTimer -= 0.1;
			} else {
				up = true;
			}
		break;
		case 'gliding':
		break;
		case 'walking':
			if (!wingsAway) {
				putWingsAway();
			}
		break;
	}

	birdY = camera.rotation.y;

	if (keyboard.pressed('w') || fmb.clicking.UP) {
		// bird.rotation.x = 0.5;
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(-500 * Math.sin(birdY), 0, -500 * Math.cos(birdY)));
	} else if (keyboard.pressed('s') || fmb.clicking.DOWN) {
		// bird.rotation.x = -0.5;
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(500 * Math.sin(birdY), 0, 500 * Math.cos(birdY)));
	}

	if (keyboard.pressed('a') || fmb.clicking.LEFT) {
		// bird.rotation.z = -0.5;
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(-500 * Math.cos(-birdY), 0, -500 * Math.sin(-birdY)));
	} else if (keyboard.pressed('d') || fmb.clicking.RIGHT) {
		// bird.rotation.z = 0.5;
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(500 * Math.cos(-birdY), 0, 500 * Math.sin(-birdY)));
	}

	if (keyboard.pressed('r')) {
		bodies[0].resetPosition(0, 40, 0);
	}

	camera.lookAt(bird.position);

	frame += 1;

	requestAnimationFrame(render);
	renderer.render(scene, camera);
	TWEEN.update();
}

var matrix = new THREE.Matrix4();
var axisHelper;
var scene, camera, renderer;
var bird, birdBody, wingL, wingR, wingtipL, wingtipR, head;
var bodyWidth;
var world, bodies = [], editor;
var wingTimer = 0;
var up = false;
var wingAction = 'hover';
var lastAction = wingAction;
var wingImpulse = false;
var frame = 0;
var wingAnimations = [];
var wingsAway = false;
var blue1 = new THREE.MeshLambertMaterial({color: '#0E1A40'});
var blue2 = new THREE.MeshLambertMaterial({color: '#222F5B'});
var gray = new THREE.MeshLambertMaterial({color: '#5D5D5D'});
var tan = new THREE.MeshLambertMaterial({color: '#946B2D'});
var black = new THREE.MeshLambertMaterial({color: 'black'});
var white = new THREE.MeshLambertMaterial({color: 'white'});
var yellow = new THREE.MeshLambertMaterial({color: 'yellow'});
var birdY;
var tableShape;
var geoBox = new THREE.BoxGeometry(1, 1, 1);
var buffGeoBox = new THREE.BufferGeometry();
buffGeoBox.fromGeometry(new THREE.BoxGeometry(1, 1, 1));
var keyboard = new THREEx.KeyboardState();
var isMobile;
var flapSound;

initScene();
var fmb = new FlexMobileButtons();
fmb.row().button('UP')
	.row().button('LEFT').button('DOWN').button('RIGHT')
	.row().button('J', 'wide').init();
initBird();
initTable();
initPhysics();
render();
world.play();

/*
	goals:
	for comp and mobile and vr (tapping? optional)
	make no tapping still engaging (vr cursor)
	fun game, tapping, knock over things
	simple physics (1 day) otherwise collisions need to be done by hand
	music, sound effects
	ice cave explains sliding, objects melting into ground
	procedurally generated shelves and other items

	Another commonly implemented spring constraint is to enforce a upright orientation of a body, for example, you could apply a spring torque proportional to the difference between the current orientation and an upright orientation, coupled with a damper proportional to angular velocity. Such a constraint is called a ‘stay upright constraint’ and its often used for sci-fi hover racing games.

	// // config info
	// if( o.config[0] !== undefined ) sc.density = o.config[0];
	// if( o.config[1] !== undefined ) sc.friction = o.config[1];
	// if( o.config[2] !== undefined ) sc.restitution = o.config[2];
	// if( o.config[3] !== undefined ) sc.belongsTo = o.config[3];
	// if( o.config[4] !== undefined ) sc.collidesWith = o.config[4];
*/


function onWindowResize() {
	var w = parseInt(getComputedStyle(renderer.domElement).width);
	var h = window.innerHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
}

function placeTables(tables) {
	var geometry, body, mesh;
	for (var i = 0; i < tables.length; i += 1) {
		body = world.add({
			type: tableShape.types,
			size: tableShape.sizes,
			pos: tables[i].pos,
			posShape: tableShape.positions,
			move: true,
			world: world,
			name: 'box' + i,
			config: [0.2, 0.4, 0.1]
		});
		mesh = new THREE.Mesh(tableShape.geometry, randomMat());
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
		body.connectMesh(mesh);
	}
}

function randomMat() {
	rand = Math.random();
	if (rand > 0.7) return black;
	else if (rand > 0.3) return tan;
	else return blue1;
}

function placeBoundaries(boundaries) {
	var boundary, geometry, body, mesh;
	for (var i = 0; i < boundaries.length; i += 1) {
		boundary = boundaries[i];
		body = world.add({
			type: 'box',
			size: boundary.size,
			pos: boundary.pos,
			density: 1,
			move: false,
			config: [0.2, 0.4,0.1]
		});
		geometry = new THREE.BoxGeometry(boundary.size[0], boundary.size[1], boundary.size[2]);
		mesh = new THREE.Mesh(geometry, boundary.color);
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
		body.connectMesh(mesh);
	}
}

function placeGround(ground) {
	var mesh = new THREE.Mesh(buffGeoBox, gray);
	mesh.scale.set(ground.size[0], ground.size[1], ground.size[2]);
	mesh.position.set(ground.pos[0], ground.pos[1], ground.pos[2]);
	// if (ground.rotation)
	// 	mesh.rotation.set(ground.rotation[0]*ToRad, ground.rotation[1]*ToRad, ground.rotation[2]*ToRad);
	scene.add(mesh);
	ground.config = [0.2, 0.4, 0.1]; // reuse object
	var body = world.add(ground);
	body.connectMesh(mesh);
}

function openWings() {
	wingsAway = false;
	for (var i = 0; i < wingAnimations.length; i += 1) {
		TWEEN.remove(wingAnimations[i]);
	}
	head.position.set(0, 1, 7.8);
	wingL.rotation.set(0, 0, 0);
	wingR.rotation.set(0, 0, 0);
	wingL.position.set(bodyWidth / 2, 0, 0);
	wingR.position.set(-bodyWidth / 2, 0, 0);
	wingtipL.rotation.set(0, 0, 0);
	wingtipR.rotation.set(0, 0, 0);
}

function putWingsAway() {
	wingsAway = true;
	wingAnimations = [
		new TWEEN.Tween(head.position).to({y: 2, z: 8}, 500).start(),
		new TWEEN.Tween(wingL.rotation).to({x: 5 * Math.PI / 8, z: -Math.PI / 2}, 200).start(),
		new TWEEN.Tween(wingL.position).to({z: 5, y: -3}, 200).start(),
		new TWEEN.Tween(wingtipL.rotation).to({z: Math.PI}, 200).start(),
		new TWEEN.Tween(wingR.rotation).to({x: 5 * Math.PI / 8, z: Math.PI / 2}, 500).start(),
		new TWEEN.Tween(wingR.position).to({z: 5, y: -3}, 200).start(),
		new TWEEN.Tween(wingtipR.rotation).to({z: Math.PI}, 200).start()
	];
}

function randInt(low, high) {
	return low + Math.floor(Math.random() * (high - low + 1));
}

function rand(low, high) {
	return low + Math.random() * (high - low);
}
