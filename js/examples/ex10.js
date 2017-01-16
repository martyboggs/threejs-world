(function () {
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera(75, 2, 0.001, 1000);

	var renderer = new THREE.WebGLRenderer({
		alpha: true,
	});
	renderer.setSize(660, 330);
	renderer.shadowMap.enabled = true;
	// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	document.getElementById('canvases').appendChild(renderer.domElement);

	var light1 = new THREE.DirectionalLight(0xffffff, 0.00001, 0, Math.PI);
	light1.castShadow = true;
	light1.shadow.camera.left = -20;
	light1.shadow.camera.right = 20;
	light1.shadow.camera.top = 200;
	light1.shadow.camera.near = 1;
	light1.shadow.camera.far = 1000;
	light1.shadow.mapSize.width = 2048;
	light1.shadow.mapSize.height = 2048;
	light1.position.set(-74, 103, 80);
	scene.add(light1);
	// var helper = new THREE.CameraHelper(light1.shadow.camera);
	// scene.add(helper);

	var light3 = new THREE.PointLight(0xffffff, 1, 0, Math.PI);
	light3.castShadow = true;
	light3.position.set(-38, 300, 82);
	scene.add(light3);

	var light2 = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(light2);

	scene.fog = new THREE.FogExp2(0xffffff, 0.001);
	renderer.setClearColor(scene.fog.color);

	var pauseScreen = document.createElement('div');
	pauseScreen.className = pauseScreen.id = 'overlay';
	pauseScreen.innerHTML = '<h1>Three.js World</h1><h3>CLIMBER</h3><hr>click to play';
	document.getElementById('canvases').insertBefore(pauseScreen, renderer.domElement);

	var gameUI = document.createElement('div');
	gameUI.className = gameUI.id = 'ui';
	gameUI.innerHTML = 'Score: <span id="score">0</span>';
	document.getElementById('canvases').insertBefore(gameUI, renderer.domElement);

	var floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.MeshLambertMaterial({color: '#7b507b'}));
	floor.position.y = -3;
	floor.rotation.x = -Math.PI / 2;
	floor.receiveShadow = true;
	scene.add(floor);

	var lastPos = Object.assign({}, camera.position);

	scene.background = new THREE.CubeTextureLoader().setPath('/images/background/').load([
		'posx.jpg', // left
		'negx.jpg', // right
		'posy.jpg', // up
		'negy.jpg', // down
		'posz.jpg', // back
		'negz.jpg', // forward
	]);

	// camera.position.set(0, 0, 2);
	camera.rotation.order = 'ZYX';
	// camera.rotation.x = Math.PI / 4; //45
	var q = new THREE.Quaternion(); // create once and reuse


	// hide cursor
	renderer.domElement.onclick = function () {
		renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock;
		renderer.domElement.requestPointerLock();
	};
	document.addEventListener('pointerlockchange', changeCallback, false);
	document.addEventListener('mozpointerlockchange', changeCallback, false);
	document.addEventListener('webkitpointerlockchange', changeCallback, false);

	function changeCallback(e) {
		if (document.pointerLockElement === renderer.domElement ||
		document.mozPointerLockElement === renderer.domElement ||
		document.webkitPointerLockElement === renderer.domElement) {
			document.addEventListener('mousemove', moveCallback, false);
			document.getElementById('overlay').style.display = 'none';
		} else {
			document.removeEventListener('mousemove', moveCallback, false);
			document.getElementById('overlay').style.display = 'flex';
			// reset view?
		}
	}

	camera.position.y = 10;

	// setup objects
	// if width is even, x is integer else .5
	// if depth is even, z is integer else .5
	// y always integer
	var platforms = [
		{x: 5.5,  y: 0,  z: 1,    rope: 0,  width: 5,  depth: 10}, // just above ground level
		{x: 8.5,  y: 10, z: -8.5, rope: 5,  width: 4,  depth: 3}, // isolated
		{x: 5,    y: 19, z: 8,    rope: 15, width: 4,  depth: 4},
		{x: -6,   y: 25, z: 8,    rope: 0,  width: 8,  depth: 2}, // no rope
		{x: 4,    y: 38, z: 5,    rope: 25, width: 10, depth: 4}, // WIDE
		{x: -9,   y: 50, z: 5,    rope: 20, width: 2,  depth: 10}, // isolated
		{x: 9,    y: 50, z: 8,    rope: 15, width: 2,  depth: 4},
		{x: 9,    y: 51, z: 5,    rope: 0,  width: 2,  depth: 2}, // staircase
		{x: 7,    y: 52, z: 4,    rope: 0,  width: 2,  depth: 2}, // staircase
		{x: 5,    y: 53, z: 4,    rope: 0,  width: 2,  depth: 2}, // staircase
		{x: 3,    y: 54, z: 4,    rope: 0,  width: 2,  depth: 2}, // staircase
		{x: 1,    y: 55, z: 4,    rope: 0,  width: 2,  depth: 2}, // staircase



		{x: 6, y: 60, z: 8, rope: 15, width: 4, depth: 4},
		{x: 0.5, y: 109, z: 0, rope: 15, width: 2, depth: 4}
	];
	var platformMaterial = new THREE.MeshLambertMaterial({color: 'violet'});
	var ropeMaterial = new THREE.MeshLambertMaterial({color: 'yellow'});
	var coinMaterial = new THREE.MeshPhongMaterial({color: 'gold', specular: 'white', shininess: 100, envMap: scene.background, reflectivity: 0.2});
	var coins = [];
	for (var i = 0; i < platforms.length; i += 1) {
		var platform = new THREE.Mesh(new THREE.BoxGeometry(platforms[i].width, 1, platforms[i].depth), platformMaterial);
		platform.position.set(platforms[i].x, platforms[i].y, platforms[i].z);
		platform.receiveShadow = true;
		platform.castShadow = true;
		scene.add(platform);
		if (platforms[i].rope) {
			var rope = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, platforms[i].rope), ropeMaterial);
			rope.position.set(platforms[i].x, platforms[i].y - platforms[i].rope / 2 - 0.5, platforms[i].z);
			scene.add(rope);
		}
		for (var j = 0; j < 3; j += 1) {
			var coin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 20), coinMaterial);
			coin.geometry.computeVertexNormals();
			coin.position.set(platforms[i].x - 1 + j, platforms[i].y + 0.5 + 0.5, platforms[i].z - 1 + j);
			coin.scale.x = 0.5;
			coin.rotation.x = Math.PI / 2;
			coin.rotation.z = Math.PI / 4 * j;
			coin.castShadow = true;
			scene.add(coin);
			coins.push(coin);
		}
	}

	// mouse
	function moveCallback(e) {
		// pitch
		camera.rotation.x -= 0.01 * e.movementY;

		// yaw
		q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), -0.01 * e.movementX);
		camera.quaternion.premultiply(q);
	}

	var keyboard = new THREEx.KeyboardState();
	var velY = 0;
	var onGround = true;
	var holdingRope = false;
	var score = 0;

	// gravity
	// -9.8m/s/s /60/60
	// -0.00272m/f/f
	// -0.00272u/f/f
	// max = -54m/s
	// max = -0.9 u/f
	function render() {
		// grid is 0.1 on y
		//keyboard
		var camAngle = Math.round(camera.rotation.z) === 0 ? camera.rotation.y : -camera.rotation.y + Math.PI;
		if (keyboard.pressed('w')) {
			if (holdingRope) {
				camera.position.y += 0.1;
			} else {
				camera.position.z -= 0.1 * Math.cos(camAngle);
				camera.position.x -= 0.1 * Math.sin(camAngle);
			}
		} else if (keyboard.pressed('s')) {
			if (holdingRope) {
				camera.position.y -= 0.1;
			} else {
				camera.position.z += 0.1 * Math.cos(camAngle);
				camera.position.x += 0.1 * Math.sin(camAngle);
			}
		}
		if (keyboard.pressed('a')) {
			camera.position.z += 0.1 * Math.sin(camAngle);
			camera.position.x -= 0.1 * Math.cos(camAngle);
		} else if (keyboard.pressed('d')) {
			camera.position.z -= 0.1 * Math.sin(camAngle);
			camera.position.x += 0.1 * Math.cos(camAngle);
		}
		if (keyboard.pressed('j')) {
			camera.rotation.y += 0.07;
		} else if (keyboard.pressed('k')) {
			camera.rotation.y -= 0.07;
		}

		// jump (TODO: make jump change based on hold length)
		if (keyboard.pressed('e') && onGround) {
			velY = 0.15;
			onGround = false;
		}

		// jump or fall
		if (!holdingRope) {
			camera.position.y += velY;
		}

		// floor
		if (camera.position.y < -2) {
			camera.position.y = -2;
			onGround = true;
		}

		if (velY > -0.9 && !holdingRope) {
			velY -= 0.00272;
		}

		for (var i = 0; i < coins.length; i += 1) {
			coins[i].rotation.z += 0.04;
		}

		// after manipulation, run checks (before render)

		// platform collisions
		for (var i = 0; i < platforms.length; i += 1) {
			if (
				camera.position.x > platforms[i].x - ((platforms[i].width) / 2) &&
				camera.position.x < platforms[i].x + ((platforms[i].width) / 2) &&
				camera.position.y - 0.5 > platforms[i].y - 0.5 &&
				camera.position.y - 0.5 < platforms[i].y + 0.5 &&
				camera.position.z > platforms[i].z - ((platforms[i].depth) / 2) &&
				camera.position.z < platforms[i].z + ((platforms[i].depth) / 2)
			) {
				var minDistance = {
					x: Math.min(Math.abs(camera.position.x - (platforms[i].x - ((platforms[i].width) / 2))), Math.abs(camera.position.x - (platforms[i].x + ((platforms[i].width) / 2)))),
					y: Math.min(Math.abs((camera.position.y - 0.5) - (platforms[i].y - 0.5)), Math.abs((camera.position.y - 0.5) - (platforms[i].y + 0.5))),
					z: Math.min(Math.abs(camera.position.z - (platforms[i].z - ((platforms[i].width) / 2))), Math.abs(camera.position.z - (platforms[i].z + ((platforms[i].width) / 2))))
				};
				if (minDistance.x <= minDistance.y && minDistance.x <= minDistance.z) {
					camera.position.x = freeAxis('x', platforms[i]);
				} else if (minDistance.y <= minDistance.x && minDistance.y <= minDistance.z) {
					camera.position.y = freeAxis('y', platforms[i]);
				} else if (minDistance.z <= minDistance.x && minDistance.z <= minDistance.y) {
					camera.position.z = freeAxis('z', platforms[i]);
				}
				break;
			}
		}

		// ropes collisions
		holdingRope = false;
		for (var i = 0; i < platforms.length; i += 1) {
			if (
				camera.position.x > platforms[i].x - 0.4 &&
				camera.position.x < platforms[i].x + 0.4 &&
				camera.position.y - 0.5 > platforms[i].y - 0.5 - platforms[i].rope && // bottom
				camera.position.y - 0.5 < platforms[i].y - 0.5 && // top
				camera.position.z > platforms[i].z - 0.4 &&
				camera.position.z < platforms[i].z + 0.4
			) {
				holdingRope = true;
				velY = 0;
				break;
			}
		}

		// // platforms have static bounding boxes.. need to be generated once?
		// firstBB = new THREE.Box3().setFromObject(firstObject);
		// secondBB = new THREE.Box3().setFromObject(secondObject);
		// var collision = firstBB.isIntersectionBox(secondBB);

		// coin collisions
		for (var i = 0; i < coins.length; i += 1) {
			if (
				camera.position.x > coins[i].position.x - 0.4 &&
				camera.position.x < coins[i].position.x + 0.4 &&
				camera.position.y > coins[i].position.y - 0.4 &&
				camera.position.y < coins[i].position.y + 0.4 &&
				camera.position.z > coins[i].position.z - 0.4 &&
				camera.position.z < coins[i].position.z + 0.4
			) {
				scene.remove(coins[i]);
				coins.splice(i, 1);
				scoreAdd(1);
			}
		}

		// TODO: stepping off ledge, disable jumping

		// walls
		if (camera.position.x > 10) {
			camera.position.x = 10;
		} else if (camera.position.x < -10) {
			camera.position.x = -10;
		}
		if (camera.position.z > 10) {
			camera.position.z = 10;
		} else if (camera.position.z < -10) {
			camera.position.z = -10;
		}

		lastPos = Object.assign({}, camera.position);

		// TODO: remove diagonal bug

		requestAnimationFrame(render);
		renderer.render(scene, camera);
		TWEEN.update();
		// console.log(velY);
	}
	render();

	function freeAxis(axis, platform) {
		var offset = 0;
		var tune = 0.01;
		if (axis === 'y') {
			radius = 0.5;
			offset = 0.5;
			tune = 0.5;
			onGround = true;
			velY = 0;
		} else if (axis === 'x') {
			radius = platform.width / 2;
		} else if (axis === 'z') {
			radius = platform.depth / 2;
		}
		if (Math.abs((camera.position[axis] - offset) - (platform[axis] - radius)) <
			Math.abs((camera.position[axis] - offset) - (platform[axis] + radius))) {
				return platform[axis] - radius - tune;
		} else {
				return platform[axis] + radius + tune;
		}
	}

	function scoreAdd(num) {
		score += num;
		document.getElementById('score').innerHTML = score;
	}
}());
