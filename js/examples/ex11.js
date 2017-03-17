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
	renderer = new THREE.WebGLRenderer({antialias: antialias, precision: 'mediump'});
	renderer.setClearColor('white', 1);
	document.getElementById('canvases').appendChild(renderer.domElement);
	onWindowResize();

	var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
	directionalLight.position.set(115, 600, 100);
	if (!isMobile) {
		directionalLight.castShadow = true;
		var d = 200;
		directionalLight.shadow.camera = new THREE.OrthographicCamera(-d, d, d, -d, 0, 700);
		directionalLight.shadow.bias = 0.0001;
		directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024;
		scene.add(directionalLight);
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFShadowMap;//THREE.BasicShadowMap;
		// scene.add(new THREE.CameraHelper(directionalLight.shadow.camera));
		// var datgui = new dat.GUI();
		// datgui.add(directionalLight.position, 'x', 0, 500);
		// datgui.add(directionalLight.position, 'y', 0, 600);
		// datgui.add(directionalLight.position, 'z', 0, 500);
	}
	scene.add(directionalLight);
	var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);

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
	scene.add(gridHelper);
}


var reactors = [];
var reactorSize = [10, 4, 5];
var reactorGeom = new THREE.BoxGeometry(reactorSize[0], reactorSize[1], reactorSize[2]);
var rodSize = [20, 0.2, 0.2];
var rodGeom = new THREE.BoxGeometry(rodSize[0], rodSize[1], rodSize[2]);
var rodMat = new THREE.MeshBasicMaterial({color: 'magenta'});

function Reactor() {
	reactors.push(this);
	this.number = reactors.length + 1;
	this.rods = [];
	this.fireInterval = randInt(5, 15);
	this.mesh = new THREE.Mesh(reactorGeom, tan);
	this.mesh.rotation.order = 'YXZ';
	var pos = [0, 2, 230];
	this.mesh.position.set(pos[0], pos[1], pos[2]);
	scene.add(this.mesh);
	this.body = world.add({
		type: 'box',
		size: reactorSize,
		pos: pos,
		move: true,
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
		var rod = new THREE.Mesh(rodGeom, rodMat);
		rod.position.copy(this.mesh.position);
		rod.position.y = this.mesh.position.y + 10;
		rod.rotation.y = this.mesh.rotation.y;
		rod.rotation.z = Math.PI / 8;
		rod.userData.birthday = frame;
		rod.userData.parent = reactors.length - 1;
		scene.add(rod);
		var body = world.add({
			type: 'box',
			size: rodSize,
			pos: [rod.position.x, rod.position.y, rod.position.z],
			rot: [rod.rotation.x / toRad, rod.rotation.y / toRad, rod.rotation.z / toRad],
			move: true,
			name: 'rod'
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
		if (frame % this.fireInterval === 0) {
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
		pos: [0, 20, 0],
		move: true,
		name: 'bird'
	});
	bird.position.y = 20;
	bodies.push(body);
	body.connectMesh(bird);

	var ground = {size: [500, 50, 500], pos: [0, -25, 0]};
	placeGround(ground);

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
		{pos: [0, 30 + 40 + 15, 100], size: [500, 30, 10], color: white},
		{pos: [0, 15, 100], size: [500, 30, 10], color: white},
		{pos: [250 - 50, 50, 100], size: [100, 40, 10], color: white},
		{pos: [-250 + 50, 50, 100], size: [100, 40, 10], color: white},
		{pos: [0, 50, 100], size: [220, 40, 10], color: white}, // between windows
		{pos: [0, 100 + 5, 175], size: [510, 10, 160], color: white}, // ceiling
		{pos: [0, 30 / 2, 250 - 10 / 2], size: [120, 30, 10], color: white}, // interior

		{pos: [20, 60, -50], size: [50, 5, 5], rot: [0, 25, 45], color: tan}, // tree branch right
		{pos: [-20, 60, -50], size: [50, 5, 5], rot: [0, 25, 135], color: tan}, // tree branch left
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
			priceKey: 'rods', priceValue: 40, level: 1},
		beak2: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 6, seconds: 60,
			priceKey: 'rods', priceValue: 200, level: 9},
		beak3: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 8, seconds: 160,
			priceKey: 'rods', priceValue: 400, level: 12},
		beak4: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 10, seconds: 300,
			priceKey: 'rods', priceValue: 2000, level: 20},
		beak5: {description: 'Increase the number of rods you can carry to ',
			key: 'rodLimit', value: 12, seconds: 160,
			priceKey: 'rods', priceValue: 5000, level: 25},
		rate1: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 200, level: 8},
		rate2: {description: 'Increase rods per minute by ', key: 'rate', value: 4,
			priceKey: 'rods', priceValue: 500, level: 19},
		rate3: {description: 'Increase rods per minute by ', key: 'rate', value: 2,
			priceKey: 'rods', priceValue: 1000, level: 21},
		rate4: {description: 'Increase rods per minute by ', key: 'rate', value: 4,
			priceKey: 'rods', priceValue: 5000, level: 24}
	};
	for (var key in products) {
		// purchased already, or level not met
		var locked = products[key].level > gui.level;
		var purchased = gui.purchased[key];
		var disabled = locked || purchased ? 'disabled="disabled"' : '';
		var text = locked ? 'Unlocked at level ' + products[key].level : products[key].priceValue + ' ' + products[key].priceKey;
		store.innerHTML += '<button class="item" value="' + key + '" ' +
		disabled + '>' + products[key].description + products[key].value +
		'<br><span class="price">' + text + '</span></button>';
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
					gui.purchased[key].timer = new Date().getTime();
				} else {
					gui.add(products[key].priceKey, -products[key].priceValue);
					gui.add(products[key].key, products[key].value);
				}
			}
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
	this.container.innerHTML = ``;
	target.appendChild(this.container);
}
Messages.prototype = {
	add: function (message, icon) {
		var m = document.createElement('div');
		m.className = 'message';
		m.innerHTML =
			message +
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
			message +
			'<span id="challenge-bar" class="bar"></span>' +
			'<img src="/images/' + icon + '.jpg">';
		this.container.appendChild(m);
		challenge = {
			el: m,
			goal: gui.level * 2,
			collected: 0,
			rewardUnit: rewardUnit,
			reward: reward
		};
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
	guiEl.innerHTML = `
	<div class="top-row">
		<div>Three.js World</div>
		<div class="holdingBox"><span id="holding">` + this.holding +
		`</span>/<span id="rodLimit">` + this.rodLimit + `</span></div>
		<div class="rodsBox"><span id="rods">` + Math.round(this.rods) +`</span> rods</div>
		<div class="eggsBox"><span id="eggs">` + this.eggs + `</span> eggs</div>
		<div class="xpBox"><span id="level" class="level">` + this.level +
		`</span> <div class="xp"><span id="xp-bar" class="bar"></span><span id="xp">` + Math.round(this.xp) + `</span></div></div>
	</div>
	<div class="bottom-row">
		<div class="rate"><span id="rate">0</span> rods/min.</div>
	</div>
	`;
	parent.appendChild(guiEl);
	this.setBar('xp-bar', this.xp, Math.pow(this.level, 3));
}
EasyGui.prototype = {
	add: function (name, points) {
		if (name === 'rodLimit') {
			this[name] = points;
			this.addXp(Math.pow(points, 2));
		} else if (name === 'eggs') {
			this[name] += points;
			this.addXp(20);
		} else {
			this[name] += points;
			if (points > 0) {
				if (challenge && name === 'rods') {
					challenge.collected += points;
					gui.setBar('challenge-bar', challenge.collected, challenge.goal);
					// completed challenge
					if (challenge.collected >= challenge.goal) {
						gui[challenge.rewardUnit] += challenge.reward;
						messages.add('Challenge complete! Received ' + challenge.reward + ' ' + challenge.rewardUnit, 'success');
						messages.container.removeChild(challenge.el);
						challenge = null;
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
			messages.add('You made it to level ' + this.level + '!', 'level');
		}
		this.setBar('xp-bar', this.xp, goal);
		this.saveQueued = true;
	},
	setBar: function (id, xp, goal) {
		var bar = document.getElementById(id);
		bar.style.width = 26 - (26 * xp / goal) + 'px';
		bar.style.borderLeftWidth = 26 * xp / goal + 'px';
	},
	step: function () {
		// sacrifice your baby to cash in on ransom reward
		if ((frame - lastChallengeCompleted) % nextChallenge === 0) { // challenges, random times
			if (!challenge && confirm('Diablo Power Station is putting us out of business! Steal more of their fuel rods and we\'ll give you a reward!')) {
				if (Math.random() < 0.95) {
					messages.addChallenge('Challenge', 'building', 'rods', gui.level * 10);
				} else {
					messages.addChallenge('Challenge', 'building', 'eggs', 1);
				}
				// check value
			}
		}
		if (frame % (60 * 59 * 3) && frameS > this.nextEgg) { // at start and every ~3min
			this.nextEgg = frameS + 24 * 60 * 60 * 1000;
			gui.add('eggs', 1);
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
			var frameS = new Date().getTime();
			for (var productKey in this.purchased) {
				if (this.purchased[productKey].timer) {
					if (frameS < this.purchased[productKey].timer + this.purchased[productKey].seconds * 1000) {
						console.log(frameS - this.purchased[productKey].timer);
					} else {
						this.purchased[productKey].timer = null;
						gui.add(this.purchased[productKey].priceKey, -this.purchased[productKey].priceValue);
						gui.add(this.purchased[productKey].key, this.purchased[productKey].value);
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

	// stockpile drop
	if ((keyboard.pressed('k') || fmb.clicking.K) && gui.holding) {
		gui.holding = 0;
		document.getElementById('holding').innerHTML = 0;
		if (bird.position.x > stockpilePos[0] - 20 && bird.position.x < stockpilePos[0] + 20 &&
		bird.position.z > stockpilePos[1] - 20 && bird.position.z < stockpilePos[1] + 20) {
			gui.add('rods', nest.children.length);
		}
		THREE.SceneUtils.detach(nest, bird, scene);
		var body = world.add({
			type: 'box',
			size: [8, 4, 10],
			pos: [nest.position.x, nest.position.y, nest.position.z],
			rot: [nest.rotation.x / toRad, nest.rotation.y / toRad, nest.rotation.z / toRad],
			move: true,
			name: 'nest'
		});
		body.connectMesh(nest);
		nest = new THREE.Object3D();
		bird.add(nest);
	}

	// make bird upright
	birdUpright.position.copy(bird.position);
	birdUpright.rotation.copy(bird.rotation);
	tmpVec = tmpVec.set(0, 1, 0);
	birdUpright.translateOnAxis(tmpVec, -10);

	bodies[0].applyImpulse(birdUpright.position, {x: 0, y: -100, z: 0});






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

	// bird and rod collision (check every other frame)
	if (frame % 2 === 0) {
		rod = null;
		if (rod = getFirstContact('rod', 'bird')) {
			if (nest.children.length < gui.rodLimit) {
				bodyRemoved = true;
				gui.add('holding', 1);
				var parent = reactors[rod.mesh.userData.parent];
				parent.rods.splice(parent.rods.indexOf(rod), 1);
				world.removeRigidBody(rod);
				THREE.SceneUtils.attach(rod.mesh, scene, nest);
			}
		}

		if (nestContact = getFirstContact('nest', 'ground')) {
			bodyRemoved = true;
			world.removeRigidBody(nestContact);
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
var chairShape;
var geoBox = new THREE.BoxGeometry(1, 1, 1);
var buffGeoBox = new THREE.BufferGeometry();
buffGeoBox.fromGeometry(new THREE.BoxGeometry(1, 1, 1));
var keyboard = new THREEx.KeyboardState();
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
var challenge = null;
var nextChallenge = randInt(3600, 8000);
var lastChallengeCompleted = 0;

// tmpQuat.setFromEuler(rod.position);
// tmpVec.applyQuaternion(tmpQuat);

initScene();
var gui = new EasyGui(document.getElementById('canvases'));
var messages = new Messages(document.getElementById('canvases'));
var fmb = new FlexboxMobileButtons({parent: document.getElementById('canvases'), onclick: function (value) {
	if (value === 'store') {
		new Store(document.getElementById('canvases'));
	}
}});
fmb.row().button('UP')
.row().button('LEFT').button('DOWN').button('RIGHT')
.row().button('J').button('K')
.fullscreen(renderer.domElement).button('store')
.init();
initBird();
initTable();
initChair();
initPhysics();
new Reactor();
// new Reactor();
// new Reactor();
// new Reactor();
// new Reactor();
sound.init({
	drag: {type: 'loop'},
	flap: {type: 'loop'},
	crash: {type: 'overlap'}
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
	f
	camera moves in middle, between house and lab (slerp with bounce)
	procedurally generated shelves and other items
	create nests out of fuel rods/bundles
	lab periodically dumps rods into dumpster
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

	gui: rods eggs xp

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
		mesh = new THREE.Mesh(geometry, boundary.color);
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
	var mesh = new THREE.Mesh(buffGeoBox, gray);
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
