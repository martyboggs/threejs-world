function initScene() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		75, window.innerWidth / window.innerHeight, 0.1, 1000
	);
	camera.position.set(40, 20, 40);
	camera.rotation.y = Math.PI / 4;
	camera.rotation.order = 'YXZ';

	var n = navigator.userAgent;
	var antialias = true;
	if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) { isMobile = true;  antialias = false; }
	// precision: 'mediump'
	renderer = new THREE.WebGLRenderer({antialias: antialias});
	renderer.setClearColor('white', 1);
	document.getElementById('canvases').appendChild(renderer.domElement);
	renderer.domElement.focus();
	onWindowResize();

	outsideLight = new THREE.DirectionalLight(0xffffff, 0.7);
	outsideLight.position.set(115, 600, 100);

	labLight = new THREE.DirectionalLight(0xffffff, 1.4);
	labLight.position.set(0, 90, 175);

	var labLightTarget = new THREE.Object3D();
	labLightTarget.position.set(0, 0, 175);
	scene.add(labLightTarget);
	labLight.target = labLightTarget;

	if (!isMobile) {
		outsideLight.castShadow = true;
		var d = 400;
		outsideLight.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 0, 700);
		outsideLight.shadow.bias = 0.0001;
		outsideLight.shadow.mapSize.width = outsideLight.shadow.mapSize.height = 1024;

		labLight.castShadow = true;
		labLight.shadow.camera = new THREE.OrthographicCamera(-250, 250, 80, -80, 0, 700);
		labLight.shadow.bias = 0.0001;
		labLight.shadow.mapSize.width = labLight.shadow.mapSize.height = 1024;

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;
		var datGui = new dat.GUI();

		// datGui.add(outsideLight.position, 'x', -200, 200);
		// datGui.add(outsideLight.position, 'y', 400, 800);
		// datGui.add(outsideLight.position, 'z', -200, 200);
		// scene.add(new THREE.CameraHelper(outsideLight.shadow.camera));
	}
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);
	scene.add(outsideLight);
	scene.add(labLight);

	// audio
	var listener = new THREE.AudioListener();
	camera.add(listener);
	var audioLoader = new THREE.AudioLoader();
	flapSound = new THREE.PositionalAudio(listener);
	audioLoader.load('../../sounds/flap.wav', function (buffer) {
		flapSound.setBuffer(buffer);
		flapSound.setRefDistance(20);
		flapSound.loop = true;
		flapSound.play();
		flapSound.stop();
	});

	window.addEventListener('resize', onWindowResize, false);

	// axisHelper = new THREE.AxisHelper(10);
	// scene.add(axisHelper);
	var gridHelper = new THREE.GridHelper(500, 50);
	gridHelper.position.z = 250 + 106;
	scene.add(gridHelper);
}


var reactors = [];
var reactorSize = [10, 4, 5];
var reactorGeom = new THREE.BoxGeometry(reactorSize[0], reactorSize[1], reactorSize[2]);
var rodSize = [20, 0.2, 0.2];
var bundleSize = [20, 0.6, 0.6];
var rodGeom = new THREE.BoxGeometry(rodSize[0], rodSize[1], rodSize[2]);
var bundleGeom = new THREE.BoxGeometry(bundleSize[0], bundleSize[1], bundleSize[2]);
var rodMat = new THREE.MeshBasicMaterial({color: 'magenta'});
var fireInterval = 255;
var outsideLight;
var labLight;

function Reactor(pos) {
	reactors.push(this);
	this.number = reactors.length + 1;
	this.rods = [];
	this.mesh = new THREE.Mesh(reactorGeom, tan);
	this.mesh.rotation.order = 'YXZ';
	this.mesh.position.set(pos[0], pos[1], pos[2]);
	scene.add(this.mesh);
	this.body = world.add({
		type: 'box',
		size: reactorSize,
		pos: pos,
		move: false,
		name: 'reactor'
	});
	this.body.connectMesh(this.mesh);
}
Reactor.prototype = {
	drive: function () {
		tmpVec.set(1, 0, 0);
		tmpVec.applyEuler(this.mesh.rotation);
		tmpVec.setLength(200);

		// if (this.body.linearVelocity.lengthSq() < 200)
		// 	this.body.applyImpulse(this.mesh.position, tmpVec);

	},
	fire: function() {
		var bundle = Math.random() < 0.2;
		var rod = new THREE.Mesh(bundle ? bundleGeom : rodGeom, rodMat);
		rod.position.copy(this.mesh.position);
		rod.position.y = this.mesh.position.y - reactorSize[1] / 2;
		rod.position.z = this.mesh.position.z + randInt(0, -5);
		rod.rotation.y = randInt(-1, 1) / 4;
		rod.rotation.z = Math.PI / 8;
		rod.userData.birthday = frame;
		rod.userData.parent = this.rods;
		rod.name = bundle ? 'bundle' : 'rod';
		scene.add(rod);
		var body = world.add({
			type: 'box',
			size: bundle ? bundleSize : rodSize,
			pos: [rod.position.x, rod.position.y, rod.position.z],
			rot: [rod.rotation.x / toRad, rod.rotation.y / toRad, rod.rotation.z / toRad],
			move: true,
			name: rod.name
		});
		this.rods.push(body);
		body.connectMesh(rod);

		// // tmpVec needs to be reset to 1,0,0 ?
		// tmpVec.set(1, 0, 0);
		// tmpVec.applyEuler(rod.rotation);
		// tmpVec.setLength(200);
		// body.applyImpulse(body.getPosition(), tmpVec);
	},
	step: function () {
		// this.drive();
		if (frame % fireInterval === 0) {
			this.fire();
		}
	}
};

function initBird() {
	bodyWidth = 6;
	var wing1Width = 13;
	var wing2Width = 5;
	var thickness = 1;

	birdBody = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth, 6, 12), blue2);
	birdBody.castShadow = true;
	birdBody.receiveShadow = true;
	birdBody.position.set(0, 0, -1);

	// can reuse geom for identical shapes
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

	birdUpright = new THREE.Object3D();
	nest = new THREE.Object3D();
	// birdUpright.position.y = -10;
	// scene.add(birdUpright);

	bird = new THREE.Object3D().add(wingR, wingL, birdBody, head, nest);
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

function initChair() {
	chairShape = {
		types: ['box', 'box', 'box', 'box', 'box', 'box', 'box', 'box'],
		sizes: [5,1,5, 1,6,1, 1,6,1, 1,6,1, 1,6,1, 1,6,1, 1,6,1, 6,3,1],
		positions: [0,0,0,  2.5,-3,2.5,  -2.5,-3,2.5,  2.5,-3,-2.5,  -2.5,-3,-2.5,  2.5,3,-2.5,  -2.5,3,-2.5,  0,3,-2.5 ],
		geometry: new THREE.BufferGeometry()
	};

	var g = new THREE.Geometry();
	var mesh, n, m;
	for (var i = 0; i < chairShape.types.length; i += 1) {
		n = i * 3;
		m = new THREE.Matrix4().makeTranslation(
			chairShape.positions[n + 0],
			chairShape.positions[n + 1],
			chairShape.positions[n + 2]);
		m.scale(new THREE.Vector3(
			chairShape.sizes[n + 0],
			chairShape.sizes[n + 1],
			chairShape.sizes[n + 2]));
		g.merge(geoBox, m);
	}
	chairShape.geometry.fromGeometry(g);
}

function initPhysics() {
	world = new OIMO.World({
		timestep: 1/60,
		iterations: 8,
		broadphase: 2,
		worldscale: 1,
		random: true,
		info: true // display statistique
	});
	world.gravity = new OIMO.Vec3(0, -98, 0);

	// bird body (make compound?)
	var body = world.add({
		type: 'box',
		size: [6, 6, 12],
		pos: [0, 20, 100],
		move: true,
		name: 'bird'
	});
	bird.position.y = 20;
	bodies.push(body);
	body.connectMesh(bird);

	var ground = {size: [500, 50, 150], pos: [0, -25, 175]};
	placeGround(ground);
	var ground = {size: [500, 50, 350], pos: [0, -25, -75], color: new THREE.MeshLambertMaterial({color: '#2f221b'})};
	placeGround(ground);
	// dirt.rotation.x = -Math.PI / 2;
	// dirt.position.set(0, 0.8, -75);
	// scene.add(dirt);

	var tables = [
		{pos: [150, 16, 190]},
		{pos: [170, 16, 196]},
		{pos: [-136, 16, 196]},

		{pos: [-156, 16, 176]},
		{pos: [216, 16, 186]},
	];
	placeCompounds(tables, tableShape, 'table');

	var chairs = [
		{pos: [-120, 16, 190]},
	];
	placeCompounds(chairs, chairShape, 'chair');

	var boundaries = [
		{pos: [-250, 250, 0], size: [1, 500, 500], color: gray},
		{pos: [250, 250, 0], size: [1, 500, 500], color: gray},
		{pos: [0, 250, 250], size: [500, 500, 1], color: gray},
		{pos: [0, 250, -250], size: [500, 500, 1], color: gray},
		//y
		//30
		//40 window
		//30

		//z 100 (40) 220 (40) 100 = 500
		{pos: [0, 30 + 40 + 15, 100], size: [500, 30, 10], color: 'wall'},
		{pos: [0, 15, 100], size: [500, 30, 10], color: 'wall'},
		{pos: [250 - 50, 50, 100], size: [100, 40, 10], color: 'wall'},
		{pos: [-250 + 50, 50, 100], size: [100, 40, 10], color: 'wall'},
		{pos: [0, 50, 100], size: [220, 40, 10], color: 'wall'}, // between windows
		{pos: [0, 100 + 5, 175], size: [510, 10, 160], color: white}, // ceiling
		{pos: [-60, 30 / 2, 105], size: [60, 30, 10], color: white}, // interior

		{pos: [20, 60, -35], size: [50, 5, 5], rot: [0, 0, 45], color: tan}, // tree branch right
		{pos: [-20, 60, -35], size: [50, 5, 5], rot: [0, 0, 135], color: tan}, // tree branch left
		{pos: [0, 30, -35], size: [10, 60, 10], color: tan}, // tree trunk

		{pos: [stockpilePos[0] + 10, 5, stockpilePos[1]], size: [2, 10, 22], color: black}, // stockpile
		{pos: [stockpilePos[0] - 10, 5, stockpilePos[1]], size: [2, 10, 22], color: black}, // stockpile
		{pos: [stockpilePos[0], 5, stockpilePos[1] + 10], size: [22, 10, 2], color: black}, // stockpile
		{pos: [stockpilePos[0], 5, stockpilePos[1] - 10], size: [22, 10, 2], color: black}, // stockpile

	];
	placeBoundaries(boundaries);
}

function Store(target) {
	if (!target) console.warn('no target element provided');
	var store = document.createElement('div');
	store.className = store.id = 'store';
	store.innerHTML = '<button class="close" value="close">X</button>';
	var products = {
		beak1: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 4, seconds: 5,
			priceKey: 'rods', priceValue: 200, level: 1},
		beak2: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 5, seconds: 160,
			priceKey: 'rods', priceValue: 2000, level: 9},
		beak3: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 6, seconds: 360,
			priceKey: 'rods', priceValue: 10000, level: 12},
		beak4: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 7, seconds: 900,
			priceKey: 'rods', priceValue: 100000, level: 20},
		beak5: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 8, seconds: 160,
			priceKey: 'rods', priceValue: 5000, level: 25},
		rate1: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 200, level: 8},
		rate2: {description: 'Increase rods per minute by ', key: 'rate', value: 4,
			priceKey: 'rods', priceValue: 500, level: 10},
		rate3: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 1000, level: 12},
		rate4: {description: 'Increase rods per minute by ', key: 'rate', value: 4,
			priceKey: 'rods', priceValue: 5000, level: 14},
		rate5: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 10000, level: 16},
		rate6: {description: 'Increase rods per minute by ', key: 'rate', value: 4,
			priceKey: 'rods', priceValue: 20000, level: 18},
		rate7: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 30000, level: 20},
	};
	for (var key in products) {
		// purchased already, or level not met
		var locked = products[key].level > gui.level;
		var purchased = gui.purchased[key];
		var disabled = locked || purchased ? 'disabled="disabled"' : '';
		var text = locked ? 'Unlocked at level ' + products[key].level : products[key].priceValue + ' ' + products[key].priceKey;
		store.innerHTML += '<button id="' + key + 'button" class="item" value="' + key + '" ' +
		disabled + '>' + products[key].description + products[key].value +
		'<br><span class="price">' + (purchased ? 'sold out' : text) + '</span></button>';
	}
	target.appendChild(store);

	document.addEventListener('click', storeHandler);

	var self = this;
	function storeHandler(e) {
		if (e.target.className.indexOf('item') !== -1) {
			var key = e.target.value;
			if (confirm('Buy ' + key + ' upgrade for ' + products[key].priceValue + ' ' + products[key].priceKey + '?')) {
				if (products[key].priceValue > gui[products[key].priceKey]) {
					alert('Not enough rods');
					return;
				}
				// buy item
				gui.purchased[key] = Object.assign({}, products[key]);
				if (products[key].priceKey === 'rods') gui.lastRods -= products[key].priceValue;
				if (gui.purchased[key].seconds) {
					gui.purchased[key].boughtTime = new Date().getTime();
				} else {
					gui.add(products[key].priceKey, -products[key].priceValue);
					gui.add(products[key].key, products[key].value);
					var item = document.getElementById(key + 'button');
					if (item) item.disabled = 'disabled';
				}
			}
			sound.play('rod');
		} else if (e.target.className.indexOf('close') !== -1) {
			document.removeEventListener('click', storeHandler);
			target.removeChild(document.getElementById('store'));
		}
	}
}

function Messages(target) {
	this.messages = [];
	this.container = document.createElement('div');
	this.container.className = this.container.id = 'messages';
	this.container.innerHTML = '';
	target.appendChild(this.container);
}
Messages.prototype = {
	add: function (message, icon) {
		sound.play('blip');
		var m = document.createElement('div');
		m.className = 'message';
		m.innerHTML =
			'<p class="message-text">' + message + '</p>' +
			'<img src="/images/' + icon + '.jpg">';
		this.container.appendChild(m);
		var message = {el: m, birthday: frame ? frame : 0};
		this.messages.push(message);
		return m;
	},
	addChallenge: function (message, icon, rewardUnit, reward) {
		var m = document.createElement('div');
		m.className = 'message';
		m.innerHTML =
			'<p class="message-text">' + message + '</p>' +
			'<span id="challenge-bar" class="bar"></span>' +
			'<img src="/images/' + icon + '.jpg">';
		this.container.appendChild(m);
		challenge = {
			status: 'started',
			el: m,
			goal: gui.level * 2,
			collected: 0,
			rewardUnit: rewardUnit,
			reward: reward
		};
		return m;
	},
	addButton: function (message, icon, callback) {
		var m = document.createElement('div');
		m.className = 'message';
		m.innerHTML =
			'<img id="challenge-button" class="challenge-button" src="/images/' + icon + '.jpg">';
		this.container.appendChild(m);
		challenge.status = 'init';
		document.getElementById('challenge-button').addEventListener('click', function (e) {
			if (confirm(message)) {
				callback();
			} else {
				challenge = {status: 'none'};
			}
			sound.play('blip');
			messages.container.removeChild(document.getElementById('challenge-button').parentNode);
		});
		return m;
	},
	addCountdown: function (key) {
		var m = document.createElement('div');
		m.className = 'message';
		m.innerHTML =
			'<p class="message-text">' + key + '</p>' +
			'<span id="' + key + '" class="countdown"></span>' +
			'<img src="/images/' + gui.purchased[key].key + '.jpg">';
		this.container.appendChild(m);
		return m;
	},
	step: function () {
		for (var i = 0; i < this.messages.length; i += 1) {
			if (this.messages[i].birthday) {
				if (frame - this.messages[i].birthday === 180) {
					this.shrink(this.messages[i], i);
				} else if (frame - this.messages[i].birthday === 360) {
					this.container.removeChild(this.messages[i].el);
					this.messages.splice(i, 1);
					i -= 1;
				}
			}
		}
	},
	shrink: function (message, i) {
		message.className += ' shrink';
	}
};

function Pipe() {
	var pipe = new THREE.Mesh(new THREE.CylinderGeometry(6, 6, 60), new THREE.MeshLambertMaterial({color: 'gray'}));
	pipe.rotation.set(-Math.PI / 1.9, 0, 0);
	pipe.position.set(-60, 9, 70);
	var river = new THREE.Mesh(new THREE.PlaneGeometry(500, 30), new THREE.MeshLambertMaterial({color: 'darkblue'}));
	river.rotation.x = -Math.PI / 2;
	river.position.set(0, 1, 32);
	scene.add(pipe, river);
	this.contents = [];
}
Pipe.prototype = {
	step: function () {
		// pipe pollution
		if (frame % 30 === 0 && Math.sin(frame / 200) > 0.96) {
			var rod = new THREE.Mesh(rodGeom, rodMat);
			rod.name = 'rod';
			rod.position.set(-60, 8, 40);
			this.contents.push(rod);
			fromPipe.push(rod);
			scene.add(rod);
			var tween = new TWEEN.Tween(rod.position).to({x: [-60, -26, 8, 42, 76, 110, 144, 178, 212, 250], y: [1, 1, 5, 1, 5, 1, 5, 1, 5, 1], z: [30, randInt(26, 40), randInt(26, 40)]}, 10000).start().onComplete(function () {
				scene.remove(pipe.contents[0]);
				fromPipe.splice(fromPipe.indexOf(pipe.contents[0]), 1);
				pipe.contents.splice(0, 1);
			});
			rod.userData.tween = tween;
		}
	}
};


function EasyGui(parent) {
	this.rods = 0;
	this.holding = 0;
	this.eggs = 0;
	this.xp = 0;
	this.level = 1;
	this.babies = 0;
	this.rodLimit = 2;
	this.rate = 0;
	this.readRate = 0;
	this.purchased = {};
	this.nextEgg = new Date().getTime() + 24 * 60 * 60 * 1000;
	// some items can be purchased, but take time before getting acquired
	// some items can be purchased many times
	// babies can be upgraded to take less time, increase rate more
	// babies need to be refreshed... but there's lots of babies...
	this.saveQueued = false;
	var saved = localStorage.getItem('mr feathers');
	if (saved) {
		saved = JSON.parse(saved);
		Object.assign(this, saved);
	}
	this.lastRods = this.rods;
	var guiEl = document.createElement('div');
	guiEl.className = 'gui';
	guiEl.innerHTML = '<div class="top-row">' +
		'<div>Three.js World</div>' +
		'<div class="holdingBox"><span id="holding">' + this.holding +
		'</span>/<span id="rodLimit">' + this.rodLimit + '</span></div>' +
		'<div class="rodsBox"><span id="rods">' + Math.round(this.rods) + '</span> rods</div>' +
		'<div class="eggsBox"><span id="eggs">' + this.eggs + '</span> eggs</div>' +
		'<div class="xpBox"><span id="level" class="level">' + this.level +
		'</span> <div class="xp"><span id="xp-bar" class="bar"></span><span id="xp">' + Math.round(this.xp) + '</span></div></div>' +
	'</div>' +
	'<div class="bottom-row">' +
		'<div class="rate"><span id="rate">0</span> rods/min.</div>' +
	'</div>';
	parent.appendChild(guiEl);
	this.setBar('xp-bar', this.xp, Math.pow(this.level, 3));
}
EasyGui.prototype = {
	add: function (name, points) {
		if (name === 'rodLimit') {
			this.rodLimit = points;
			this.addXp(Math.pow(points, 2));
		} else if (name === 'eggs') {
			this.eggs += points;
			this.addXp(20);
		} else {
			this[name] += points;
			if (points > 0) {
				if (challenge.status === 'started' && name === 'rods') {
					challenge.collected += points;
					gui.setBar('challenge-bar', challenge.collected, challenge.goal);
					// completed challenge
					if (challenge.collected >= challenge.goal) {
						gui[challenge.rewardUnit] += challenge.reward;
						messages.add('Challenge complete! Received ' + challenge.reward + ' ' + challenge.rewardUnit, challenge.rewardUnit);
						messages.container.removeChild(challenge.el);
						challenge = {status: 'none'};
						lastChallengeCompleted = frame;
						nextChallenge = randInt(3600, 8000);
					}
				}
				this.addXp(points);
			}
		}
		document.getElementById(name).innerHTML = Math.round(this[name]);
	},
	addXp: function (points) {
		this.xp += points;
		document.getElementById('xp').innerHTML = Math.round(this.xp);
		var goal = Math.pow(this.level, 3);
		if (this.xp >= goal) {
			this.level += 1;
			document.getElementById('level').innerHTML = this.level;
			this.xp -= goal;
			messages.add('You made it to level ' + this.level + '!', 'challenge');
		}
		this.setBar('xp-bar', this.xp, goal);
		this.saveQueued = true;
	},
	setBar: function (id, xp, goal) {
		var bar = document.getElementById(id);
		bar.style.width = 66 - (66 * xp / goal) + 'px';
		bar.style.borderLeftWidth = 66 * xp / goal + 'px';
	},
	step: function () {
		if ((frame - lastChallengeCompleted) % nextChallenge === 0) { // challenges, random times
			if (challenge.status === 'none') {
				sound.play('powerup');
				messages.addButton('Diablo Power Station is putting us out of business! Steal more of their fuel rods and we\'ll give you a reward!', 'challenge', function () {
					if (Math.random() < 0.95) {
						messages.addChallenge('Challenge', 'challenge', 'rods', gui.level * 10);
					} else {
						messages.addChallenge('Challenge', 'challenge', 'eggs', 1);
					}
				});
			}
		}
		if (frame % (60 * 59 * 3) && frameS > this.nextEgg) { // at start and every ~3min
			this.nextEgg = frameS + 24 * 60 * 60 * 1000;
			gui.add('eggs', 1);
			messages.add('You have a new egg!', 'eggs');
		}
		if (frame % 360 === 0) { // every 6 seconds, interpolate average rods/min
			this.readRate = Math.round((this.rods - this.lastRods) * 10);
			document.getElementById('rate').innerHTML = this.readRate;
			this.lastRods = this.rods;
		}
		if (frame % 60 === 0) {
			if (this.saveQueued) {
				this.saveQueued = false;
				this.save();
			}
			frameS = new Date().getTime();
			for (var key in this.purchased) {
				if (this.purchased[key].seconds && !this.purchased[key].rewarded) {
					if (frameS < this.purchased[key].boughtTime + this.purchased[key].seconds * 1000) {
						var countdown = document.getElementById(key);
						if (!countdown) {
							messages.addCountdown(key);
						} else {
							countdown.innerHTML = Math.round((this.purchased[key].boughtTime + this.purchased[key].seconds * 1000 - frameS) / 1000);
						}
					} else {
						var countdown = document.getElementById(key);
						if (countdown) {
							messages.container.removeChild(document.getElementById(key).parentNode);
						}
						this.purchased[key].rewarded = true;
						gui.add(this.purchased[key].priceKey, -this.purchased[key].priceValue);
						gui.add(this.purchased[key].key, this.purchased[key].value);
						var item = document.getElementById(key + 'button');
						if (item) item.disabled = 'disabled';
					}
				}
			}
			if (this.rate > 0) {
				gui.add('rods', this.rate / 60);
			}
		}
	},
	save: function () {
		localStorage.setItem('mr feathers', JSON.stringify({
			rods: this.rods,
			eggs: this.eggs,
			xp: this.xp,
			level: this.level,
			babies: this.babies,
			rodLimit: this.rodLimit,
			rate: this.rate,
			readRate: this.readRate,
			purchased: this.purchased,
			nextEgg: this.nextEgg
		}));
	}
};

function render() {
	// document.getElementById('info').innerHTML = world.getInfo();

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
		if (!flapSound.isPlaying) flapSound.play();
		if (wingsAway) {
			openWings();
		}

		if (wingAction !== 'flapping') {
			wingAction = 'flapping';
			wingsAway = false;
		}
	} else {
		if (flapSound.isPlaying) flapSound.stop();
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

	if (keyboard.pressed('w') || keyboard.pressed('up') || fmb.clicking.UP) {
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(-500 * Math.sin(birdY), 0, -500 * Math.cos(birdY)));
	} else if (keyboard.pressed('s') || keyboard.pressed('down') || fmb.clicking.DOWN) {
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(500 * Math.sin(birdY), 0, 500 * Math.cos(birdY)));
	}

	if (keyboard.pressed('a') || keyboard.pressed('left') || fmb.clicking.LEFT) {
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(-500 * Math.cos(-birdY), 0, -500 * Math.sin(-birdY)));
	} else if (keyboard.pressed('d') || keyboard.pressed('right') || fmb.clicking.RIGHT) {
		bodies[0].applyImpulse(bodies[0].getPosition(), new OIMO.Vec3(500 * Math.cos(-birdY), 0, 500 * Math.sin(-birdY)));
	}

	if (keyboard.pressed('r')) {
		bodies[0].resetPosition(0, 40, 0);
	}

	if (keyboard.pressed('k') || fmb.clicking.K) {
		if (gui.holding) {	// drop rods
			kTapped = true;
			gui.holding = 0;
			document.getElementById('holding').innerHTML = 0;
			for (var i = 0; i < nest.children.length; i += 1) {
				var mesh = nest.children[i];
				THREE.SceneUtils.detach(nest.children[i], nest, scene);
				var body = world.add({
					type: 'box',
					size: mesh.name === 'bundle' ? bundleSize : rodSize,
					pos: [mesh.position.x, mesh.position.y, mesh.position.z],
					rot: [mesh.rotation.x / toRad, mesh.rotation.y / toRad, mesh.rotation.z / toRad],
					move: true,
					name: mesh.name
				});
				body.linearVelocity.copy(bodies[0].linearVelocity);
				body.angularVelocity.copy(bodies[0].angularVelocity);
				body.connectMesh(mesh);
				mesh.userData.dropping = true;
				dropping.push(body); // track till they drop
				i -= 1;
			}
		} else if (!kTapped) {	// tapping
			kTapped = true;
			sound.play('rod');
			gui.add('rods', 1);

			var rod = new THREE.Mesh(rodGeom, rodMat);
			rod.position.copy(bird.position);
			rod.rotation.copy(bird.rotation);
			scene.add(rod);
			tappedRods.push(rod);
			new TWEEN.Tween(rod.position).to({x: stockpilePos[0], y: [50, 0], z: stockpilePos[1]}, 1000).start().onComplete(function () {
				scene.remove(tappedRods[0]);
				tappedRods.splice(0, 1);
			});
		}
	} else {
		kTapped = false;
	}

	// make bird upright
	birdUpright.position.copy(bird.position);
	birdUpright.rotation.copy(bird.rotation);
	tmpVec = tmpVec.set(0, 1, 0);
	birdUpright.translateOnAxis(tmpVec, -10);

	bodies[0].applyImpulse(birdUpright.position, {x: 0, y: -100, z: 0});





	// position camera
	if (bird.position.z > 100 && camera.position.z === 40) {
		new TWEEN.Tween(camera.position).to({z: 200}, 1000).easing(TWEEN.Easing.Sinusoidal.Out).start();
	} else if (bird.position.z < 100 && camera.position.z === 200) {
		new TWEEN.Tween(camera.position).to({z: 40}, 1000).easing(TWEEN.Easing.Sinusoidal.Out).start();
	}
	if (bird.position.y > 250 && camera.position.y === 20) {
		new TWEEN.Tween(camera.position).to({y: 500}, 1000).easing(TWEEN.Easing.Sinusoidal.Out).start();
	} else if (bird.position.y < 250 && camera.position.y === 500) {
		new TWEEN.Tween(camera.position).to({y: 20}, 1000).easing(TWEEN.Easing.Sinusoidal.Out).start();
	}

	// toggle lights
	if (camera.position.z > 100 && camera.position.y < 250) {
		outsideLight.visible = false;
		labLight.visible = true;
	} else {
		outsideLight.visible = true;
		labLight.visible = false;
	}

	camera.lookAt(bird.position);





	// // collisions
	bodyRemoved = false;

	var birdCollide = world.checkContact('bird', 'ground');
	if (birdCollide && bodies[0].linearVelocity.lengthSq() > 5) {
		sound.play('drag');
	} else {
		if (sound.isPlaying('drag')) {
			sound.stop('drag');
		}
	}

	if (hardCollision('table')) {
		sound.play('crash');
	// } else if (softCollision('table')) {
	// 	sound.play('crash');
	}

	loop1:
	for (var i = 0; i < reactors.length; i += 1) {
		reactors[i].step();
		for (var j = 0; j < reactors[i].rods.length; j += 1) {
			if (frame - reactors[i].rods[j].mesh.userData.birthday > 360) {
				bodyRemoved = true;
				scene.remove(reactors[i].rods[j].mesh);
				world.removeRigidBody(reactors[i].rods[j]);
				reactors[i].rods.splice(j, 1);
				break loop1;
			}
		}
	}

	if (frame % 4 === 0) {
		if (nest.children.length < gui.rodLimit) {
			// bird and rod collision (check every 4 frames)
			rod = getFirstContact('bundle', 'bird') || getFirstContact('rod', 'bird');
			// pick up rod from reactor, or something dropped from beak
			if (rod && !rod.mesh.userData.dropping) {
				gui.add('holding', 1);
				rod.mesh.userData.parent.splice(rod.mesh.userData.parent.indexOf(rod), 1);
				world.removeRigidBody(rod);
				bodyRemoved = true;
				THREE.SceneUtils.attach(rod.mesh, scene, nest);
			} else {
				// collision with river rods
				for (var i = 0; i < fromPipe.length; i += 1) {
					if (fromPipe[i].position.distanceTo(bird.position) < 10) {
						if (fromPipe[i].userData.tween) { // rod.. pollution
							fromPipe[i].userData.tween.onComplete();
							fromPipe[i].userData.tween.stop();
							gui.add('holding', 1);
							THREE.SceneUtils.attach(fromPipe[i], scene, nest);
						}
						fromPipe.splice(fromPipe.indexOf(fromPipe[i]), 1);
						break;
					}
				}
			}
		}

		for (var i = 0; i < dropping.length; i += 1) {
			if (dropping[i].linearVelocity.lengthSq() < 5) {
				// stockpile rods
				var mesh = dropping[i].mesh;
				if (mesh.position.x > stockpilePos[0] - 20 && mesh.position.x < stockpilePos[0] + 20 &&
				mesh.position.z > stockpilePos[1] - 20 && mesh.position.z < stockpilePos[1] + 20) {
					if (mesh.name === 'bundle') {
						var points = 50;
					} else {
						var points = 1;
					}
					messages.add('Stockpiled ' + points + ' rods!', 'rods');
					gui.add('rods', points);
					bodyRemoved = true;
					world.removeRigidBody(dropping[i]);
				} else {
					fromBeak.push(dropping[i]);
					dropping[i].mesh.userData.parent = fromBeak;
				}
				delete dropping[i].mesh.userData.dropping;
				dropping.splice(dropping.indexOf(dropping[i]), 1);
				i -= 1;
			}
		}
	}

	// set lastVel after calls to hardCollision() or shotbird
	var body = world.rigidBodies;
	while (body !== null) {
		body.lastVel = body.linearVelocity.lengthSq();
		body = body.next;
	}

	// fix memory leak
	if (bodyRemoved) {
		while (world.contacts !== null)
			world.removeContact(world.contacts);
	}

	frame += 1;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	TWEEN.update();
	world.step();
	messages.step();
	pipe.step();
	gui.step();
}

var axisHelper;
var scene, camera, renderer;
var bird, birdBody, wingL, wingR, wingtipL, wingtipR, head, birdUpright, nest;
var bodyWidth;
var world, bodies = [], editor;
var wingTimer = 0;
var toRad = Math.PI / 180;
var up = false;
var wingAction = 'hover';
var lastAction = wingAction;
var wingImpulse = false;
var frame = 0;
var frameS = new Date().getTime();
var wingAnimations = [];
var wingsAway = false;
var blue1 = new THREE.MeshLambertMaterial({color: '#0E1A40'});
var blue2 = new THREE.MeshLambertMaterial({color: '#222F5B'});
var gray = new THREE.MeshLambertMaterial({color: '#5D5D5D'});
var tan = new THREE.MeshLambertMaterial({color: '#946B2D'});
var black = new THREE.MeshLambertMaterial({color: 'black'});
var white = new THREE.MeshLambertMaterial({color: 'white'});
var yellow = new THREE.MeshLambertMaterial({color: 'yellow'});
var textureLoader = new THREE.TextureLoader();
var birdY;
var tableShape;
var chairShape;
var geoBox = new THREE.BoxGeometry(1, 1, 1);
var buffGeoBox = new THREE.BufferGeometry();
buffGeoBox.fromGeometry(new THREE.BoxGeometry(1, 1, 1));
var realWindow = window.parent || window;
var keyboard = new THREEx.KeyboardState(realWindow);
var isMobile;
var flapSound;
var fullscreen = false;
var tmpVec = new THREE.Vector3();
var tmpVec2 = new THREE.Vector3();
var tmpMatrix = new THREE.Matrix4();
var tmpQuat = new THREE.Quaternion();
var tmpEuler = new THREE.Euler();
var reactors = [];
var bodyRemoved = false;
var stockpilePos = [-20, 0]; // x,z
var challenge = {status: 'none'};
var nextChallenge = randInt(3600, 8000);
var lastChallengeCompleted = 0;
var kTapped = false;
var tappedRods = [];
var nest;
var fromBeak = [];
var fromPipe = [];
var dropping = [];

// tmpQuat.setFromEuler(rod.position);
// tmpVec.applyQuaternion(tmpQuat);

initScene();
var gui = new EasyGui(document.getElementById('canvases'));
var fmb = new FlexboxMobileButtons({parent: document.getElementById('canvases'), onclick: function (value) {
	if (value === 'store') {
		new Store(document.getElementById('canvases'));
	}
}});
fmb.row().button('UP')
.row().button('LEFT').button('DOWN').button('RIGHT')
.row().button('J', 'flap').button('K', 'drop')
.fullscreen(renderer.domElement).button('store')
.init();
var messages = new Messages(document.getElementById('canvases'));
var pipe = new Pipe();
initBird();
initTable();
initChair();
initPhysics();
new Reactor([0, 40, 250 - 2.5]);
new Reactor([80, 40, 250 - 2.5]);
// new Reactor();
// new Reactor();
// new Reactor();
// new Reactor();
sound.init({
	drag: {type: 'loop'},
	flap: {type: 'loop'},
	crash: {type: 'overlap'},
	powerup: {type: 'once'},
	rod: {type: 'overlap'},
	blip: {type: 'once'}
});
render();


/*
	goals:
	fun game,
	vr
	how to fly without clicking?? not important. If no bluetooth, user can use mobile buttons
	music, sound effects
	lab
	multiplier room. navigate to one room for snapshot, new birds show up in other side
	procedurally generated
	create nests out of fuel rods/bundles
	lab periodically dumps rods into dumpster, river
	lay eggs of bigger and bigger size... glowing eggs contain multiple birds
	powerups make bird cloning possible
	automation: babies created automatically with cloning
	player collects rods to create nests
	bundle rods
	nests go in tree, eggs go in nests, babies
	bigger nests hold more eggs
	babies increase rods/min linearly
	if tree full, can stockpile rods
	automation -- rods/min increases
	can buy eggs with real money
	eggs pop out periodically
	fly into shop for items. there it tells you how many babies

	rods are coins
	eggs are virtual cards
	babies are employees
	xp pts
	can't trade rods to get eggs (doesn't make sense anyway)
	can't buy nests with rods... need to be built by collecting
	can sell eggs to get rods

	pipe for waste and spent rods to leak out

	wanted poster. disguises to bypass security. sacrifice your babies as decoys to get ransom

	factors: (for limited factors, just make achieving the limit nearly impossible)
		number of trees (1 tree - 5 trees) buy with rods or eggs
		number of babies (0 - 10 million) buy with rods or eggs
		babies per egg (1 - 5)
		powerups:
			direct: increase rod rate (0 - whatever) rods/min
			number rods can collect at once... nest size (100 - 1000)
			egg hatch rate (from 10 hours to 1 hour) glowing egg (20hrs - 2 hrs)
			powerups found in lab: garbage dump (dumpster closer to trees)
			odds of getting glowing egg
	problems:
		rods become worthless.. solution --> multiplier
		placing rods in nest
		progress of nest?
		sitting in nest?
		changing surroundings

		need to calculate rate / min.

*/

function onWindowResize() {
	var w = parseInt(getComputedStyle(renderer.domElement).width);
	var h = window.innerHeight;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	renderer.setSize(w, h);
	renderer.domElement.style.width = '100%';
}

function placeCompounds(items, shape, name) {
	var geometry, body, mesh;
	for (var i = 0; i < items.length; i += 1) {
		body = world.add({
			type: shape.types,
			size: shape.sizes,
			pos: items[i].pos,
			posShape: shape.positions,
			move: true,
			world: world,
			name: name,
			config: [0.2, 0.4, 0.1]
		});
		mesh = new THREE.Mesh(shape.geometry, randomMat());
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		// mesh.add(hitSound);
		scene.add(mesh);
		body.connectMesh(mesh);
	}
}
// animals attached to the end of balloons
// balloon impulse up,
// animal locomotion
function randomMat() {
	rand = Math.random();
	if (rand > 0.7) return black;
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
			rot: boundary.rot ? boundary.rot : [0, 0, 0],
			density: 1,
			move: false,
			config: [0.2, 0.4, 0.1]
		});
		geometry = new THREE.BoxGeometry(boundary.size[0], boundary.size[1], boundary.size[2]);
		var mat = boundary.color;
		if (boundary.color === 'wall') {
			var wallTexture = textureLoader.load('../../images/wall.jpg');
			wallTexture.wrapS = THREE.RepeatWrapping;
			wallTexture.wrapT = THREE.RepeatWrapping;
			mat = new THREE.MeshLambertMaterial({map: wallTexture});
			mesh = new THREE.Mesh(geometry, mat);
			mesh.geometry.computeBoundingBox();
			var max = mesh.geometry.boundingBox.max;
			var min = mesh.geometry.boundingBox.min;
			var height = max.y - min.y;
			var width = max.x - min.x;
			wallTexture.repeat.set(width / 75, height / 52);
			wallTexture.needsUpdate = true;
		} else {
			mesh = new THREE.Mesh(geometry, mat);
		}
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		scene.add(mesh);
		body.connectMesh(mesh);
	}
}

function placeGround(ground) {
	ground.name = 'ground';
	ground.config = [0.2, 0.4, 0.1]; // reuse object
	var body = world.add(ground);
	bodies.push(body);
	var mesh = new THREE.Mesh(buffGeoBox, ground.color ? ground.color : gray);
	mesh.scale.set(ground.size[0], ground.size[1], ground.size[2]);
	mesh.position.set(ground.pos[0], ground.pos[1], ground.pos[2]);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	scene.add(mesh);
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

function hardCollision(name) {
	var n1, n2;
	var contact = world.contacts;

	while (contact !== null) {
		if ((contact.body1.name === name || contact.body2.name === name)
		&& (Math.abs(contact.body1.linearVelocity.lengthSq() - contact.body1.lastVel) > 400
		||  Math.abs(contact.body2.linearVelocity.lengthSq() - contact.body2.lastVel) > 400)) {
			return true;
		} else {
			contact = contact.next;
		}
	}
	return false;
}

function softCollision(name) {
	var n1, n2;
	var contact = world.contacts;

	while (contact !== null) {
		if ((contact.body1.name === name || contact.body2.name === name)
		&& (Math.abs(contact.body1.linearVelocity.lengthSq() - contact.body1.lastVel) > 100
		||  Math.abs(contact.body2.linearVelocity.lengthSq() - contact.body2.lastVel) > 100)) {
			return true;
		} else {
			contact = contact.next;
		}
	}
	return false;
}

function getFirstContact(name1, name2) {
	var contact = world.contacts;
	while (contact !== null) {
		if ((contact.body1.name === name1 && contact.body2.name === name2)
		|| (contact.body1.name === name2 && contact.body2.name === name1)) {
			var rod = contact.body1.name === name1 ? contact.body1 : contact.body2;
			// if (Math.abs(rod.linearVelocity.lengthSq() - rod.lastVel) > 200) {
				return rod;
			// }
			// contact = contact.next;
			// continue;
		}
		contact = contact.next;
	}
	return false;
}

function distanceTo() {

}