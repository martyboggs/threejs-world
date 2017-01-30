(function () {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(75, 2, 0.001, 1000);
	var renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setSize(660, 330);
	renderer.shadowMap.enabled = true;
	document.getElementById('canvases').appendChild(renderer.domElement);
	var light1 = new THREE.DirectionalLight(0xffffff, 0.00001, 0, Math.PI);
	light1.castShadow = true;
	light1.shadow.camera.left = -20;
	light1.shadow.camera.right = 20;
	light1.shadow.camera.top = 200;
	light1.shadow.camera.near = 1;
	light1.shadow.camera.far = 1000;
	light1.shadow.mapSize.width = 4048;
	light1.shadow.mapSize.height = 4048;
	light1.position.set(-74, 103, 80);
	scene.add(light1);
	var light3 = new THREE.PointLight(0xffffff, 1, 0, Math.PI);
	light3.position.set(-38, 300, 82);
	scene.add(light3);
	var light2 = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(light2);
	scene.fog = new THREE.FogExp2('#a0bdff', 0.018);
	renderer.setClearColor(scene.fog.color);

	// Create worker
	var worker = new Worker('js/examples/ex10-worker.js');
	worker.postMessage = worker.webkitPostMessage || worker.postMessage;
	var sendTime; // Time when we sent last message
	worker.onmessage = function (e) {

		oimoInfo = e.data.perf;

		// Get fresh data from the worker
		minfo = e.data.minfo;

		// Update rendering meshes
		var n = 0, mesh;

		for (var i = 0; i < meshes.length; i += 1) {
			mesh = meshes[i];
			n = i*8;
			mesh.position.set(minfo[n+0], minfo[n+1], minfo[n+2]);
			mesh.quaternion.set(minfo[n+3], minfo[n+4], minfo[n+5], minfo[n+6]);
		}

		// If the worker was faster than the time step (dt seconds), we want to delay the next timestep
		var delay = dt * 1000 - (Date.now() - sendTime);
		if (delay < 0) { delay = 0; }
		setTimeout(sendDataToWorker, delay);
	}

	function sendDataToWorker(){
		sendTime = Date.now();
		worker.postMessage({minfo : minfo}, [minfo.buffer]);
	}

	var pauseScreen = document.createElement('div');
	pauseScreen.className = pauseScreen.id = 'overlay';
	pauseScreen.innerHTML = '<h1>Three.js World</h1><h3>CLIMBER</h3><hr>click to play';
	document.getElementById('canvases').insertBefore(pauseScreen, renderer.domElement);

	var gameUI = document.createElement('div');
	gameUI.className = gameUI.id = 'ui';
	gameUI.innerHTML = '<div>Score:&nbsp; <span id="score">0</span></div><div>Deaths:&nbsp; <span id="deaths">0</span></div>';
	document.getElementById('canvases').insertBefore(gameUI, renderer.domElement);
	// hide cursor, lock pointer
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
			// document.addEventListener('mousemove', moveCallback, false);
			controls.enabled = true;
			document.getElementById('overlay').style.display = 'none';
		} else {
			// document.removeEventListener('mousemove', moveCallback, false);
			controls.enabled = false;
			document.getElementById('overlay').style.display = 'flex';
		}
	}

	var coinBg = new THREE.CubeTextureLoader().setPath('images/').load([
		'pineapple2.jpg', // left
		'pineapple2.jpg', // left
		'pineapple2.jpg', // left
		'pineapple2.jpg', // left
		'pineapple2.jpg', // left
		'pineapple2.jpg', // left
	]);


	var controls = new THREE.PointerLockControls(camera);
	var player = controls.getObject();
	scene.add(player);

	player.position.set(4.5, 6, 1);

	// camera.rotation.order = 'ZYX';

	var sounds = {
		jump: new Howl({src: ['sounds/jump.wav']}),
		coin: new Howl({src: ['sounds/coin.wav']}),
		hit: new Howl({src: ['sounds/hit.wav']}),
		climb: new Howl({src: ['sounds/climb.wav'], loop: true, sounding: false}),
	};
	sounds.hit.sounding = 0;
	var q = new THREE.Quaternion(); // create once and reuse
	var lastPos = Object.assign({}, player.position);
	var platformMaterial = new THREE.MeshLambertMaterial({color: 'violet'});
	var ropeMaterial = new THREE.MeshLambertMaterial({color: 'yellow'});
	var coinMaterial = new THREE.MeshPhongMaterial({color: 'gold', specular: 'white', shininess: 100, envMap: coinBg, reflectivity: 0.2, combine: THREE.MixOperation});
	var coins = [];
	var keyboard = new THREEx.KeyboardState();
	var vel = {x: 0, y: 0, z: 0};
	var onGround = true;
	var jumpAllowed = false;
	var holdingRope = false;
	var distanceFell = 0;
	var collided = false;
	var won = false;
	var score = 0;
	var deaths = 0;
	var dead = false;
	var deadTimer = 120;
	var hitHead = false;
	var meshes = [];
	var ropes = [];
	var ropeSegment = false;
	var letGoTimer = 0;
	var rgbAmount = 0;

	var composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	// var effect = new THREE.ShaderPass( THREE.DotScreenShader );
	// effect.uniforms[ 'scale' ].value = 1;
	// composer.addPass( effect );

	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
	effect.uniforms[ 'amount' ].value = 0.15;
	effect.renderToScreen = true;
	composer.addPass( effect );

	// set up objects
	var platforms = [
		{x: 5.5,  y: 0,   z: 1,    rope: 0,   width: 5,  depth: 10}, // just above ground level
		{x: 8.5,  y: 10,  z: -8.5, rope: 0,   width: 4,  depth: 3}, // isolated
		{x: 5,    y: 19,  z: 8,    rope: 15,  width: 4,  depth: 4},
		{x: -6,   y: 25,  z: 8,    rope: 0,   width: 8,  depth: 2}, // no rope
		{x: 4,    y: 38,  z: 5,    rope: 25,  width: 10, depth: 4}, // WIDE
		{x: 6,    y: 60,  z: 8,    rope: 15,  width: 4,  depth: 4},
		{x: 9,    y: 50,  z: 8,    rope: 15,  width: 2,  depth: 4},
		{x: 9,    y: 51,  z: 3,    rope: 0,   width: 2,  depth: 2}, // staircase
		{x: 6,    y: 52,  z: 0,    rope: 0,   width: 2,  depth: 2}, // staircase
		{x: 3,    y: 53,  z: -2,   rope: 0,   width: 2,  depth: 2}, // staircase
		{x: 0,    y: 54,  z: -2,   rope: 0,   width: 2,  depth: 2}, // staircase
		{x: -3,   y: 55,  z: 0,    rope: 0,   width: 2,  depth: 2}, // staircase
		{x: -3,   y: 55,  z: 0,    rope: 0,   width: 2,  depth: 2}, // staircase
		{x: -9,   y: 50,  z: 5,    rope: 20,  width: 2,  depth: 10}, // isolated
		{x: -4,   y: 70,  z: -4,   rope: 15,  width: 12, depth: 11}, // rope = deadend, big platform
		{x: -8,   y: 75,  z: 9,    rope: 20,  width: 2,  depth: 2}, //
		{x: -9,   y: 72,  z: 6,    rope: 10,  width: 2,  depth: 2}, //
		{x: 5,    y: 74,  z: -6,   rope: 0,   width: 2,  depth: 2}, // climbing
		{x: 9,    y: 77,  z: -2.5, rope: 0,   width: 2,  depth: 15}, // climbing
		{x: 7,    y: 80,  z: 8,    rope: 0,   width: 4,  depth: 4}, // climbing
		{x: -6,   y: 80,  z: -2,   rope: 0,   width: 4,  depth: 4}, // jumping
		{x: 4,    y: 84,  z: -8,   rope: 0,   width: 4,  depth: 4}, // jumping
		{x: -8,   y: 87,  z: -7.5, rope: 0,   width: 4,  depth: 3}, // jumping
		{x: 3,    y: 90,  z: -4,   rope: 0,   width: 4,  depth: 4}, // jumping
		{x: -8,   y: 93,  z: 2.5,  rope: 0,   width: 4,  depth: 3}, // jumping
		{x: 3,    y: 96,  z: -6,   rope: 0,   width: 4,  depth: 4}, // jumping
		{x: -8,   y: 99,  z: -5.5, rope: 0,   width: 4,  depth: 3}, // jumping
		{x: 0.5,  y: 219, z: 0,    rope: 115, width: 2,  depth: 4}
	];

/*
All your hard work...
amounted to nothing
*/

	var sceneBgTexture = new THREE.TextureLoader().load('images/pineapple2.jpg');
	sceneBgTexture.wrapS = sceneBgTexture.wrapT = THREE.RepeatWrapping;
	sceneBgTexture.repeat.set(4, 30);
	var sceneBgMaterial = new THREE.MeshBasicMaterial({map: sceneBgTexture, side: THREE.BackSide});

	var sceneBgTexture2 = new THREE.TextureLoader().load('images/ground.jpg');
	sceneBgTexture2.wrapS = sceneBgTexture2.wrapT = THREE.RepeatWrapping;
	sceneBgTexture2.repeat.set(1000, 1000);
	var sceneBgMaterial2 = new THREE.MeshBasicMaterial({map: sceneBgTexture2, side: THREE.BackSide});

	var sceneBg = new THREE.Mesh(new THREE.BoxGeometry(50, 400, 50), new THREE.MultiMaterial([
		sceneBgMaterial,
		sceneBgMaterial,
		sceneBgMaterial2,
		sceneBgMaterial2,
		sceneBgMaterial,
		sceneBgMaterial,
	]));
	sceneBg.position.set(0, 100, 0);
	scene.add(sceneBg);

	var endingTexture = new THREE.TextureLoader().load('images/ending.png');
	var ending = new THREE.Mesh(new THREE.BoxGeometry(52, 5000, 52), new THREE.MeshBasicMaterial({map: endingTexture, side: THREE.BackSide, transparent: true}));
	endingTexture.wrapS = endingTexture.wrapT = THREE.RepeatWrapping;
	endingTexture.repeat.set(7, 70);
	ending.position.set(0, -2602, 0);
	scene.add(ending);

	var endingTexture2 = new THREE.TextureLoader().load('images/ending.png');
	endingTexture2.wrapS = endingTexture2.wrapT = THREE.RepeatWrapping;
	endingTexture2.repeat.set(7, 48);
	var ending2 = new THREE.Mesh(new THREE.BoxGeometry(82, 5000, 82), new THREE.MeshBasicMaterial({map: endingTexture2, side: THREE.BackSide}));
	ending2.position.set(0, -2602, 0);
	scene.add(ending2);

	function CustomSinCurve(scale) {
		this.scale = (scale === undefined) ? 1 : scale;
	}
	CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
	CustomSinCurve.prototype.constructor = CustomSinCurve;
	CustomSinCurve.prototype.getPoint = function ( t ) {
		var tx = 4.2 * Math.sin( 16 * Math.PI * t );
		var ty = 50 * t - 50;
		var tz = 4.2 * Math.cos( 16 * Math.PI * t );
		return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
	};

	var path = new CustomSinCurve( 10 );
	var geometry = new THREE.TubeGeometry( path, 90, 2, 8, false );
	var material = new THREE.MeshLambertMaterial({
		color: 'yellow'
	});
	var outside = new THREE.Mesh(geometry, material);
	scene.add(outside);
	// outside.visible = false;

// meshes[0] is bottom
// meshes[1] is top
// meshes[27] is at the bottom, but belongs at the very top, wtf


	for (var i = 0; i < platforms.length; i += 1) {
		var platform = new THREE.Mesh(new THREE.BoxGeometry(platforms[i].width, 1, platforms[i].depth), platformMaterial);
		platform.position.set(platforms[i].x, platforms[i].y, platforms[i].z);
		platform.receiveShadow = true;
		platform.castShadow = true;
		platform.name = 'p' + i;
		scene.add(platform);
		meshes.push(platform);

		if (platforms[i].rope) {
			for (var j = 0; j < platforms[i].rope / 5; j += 1) {
				var rope = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 5), ropeMaterial);
				rope.position.set(platforms[i].x, platforms[i].y - 0.5 - 2.5 - 5 * j, platforms[i].z);
				rope.name = 'p' + i + 'r' + j;
				rope.parentHeight = platforms[i].y;
				rope.ropeLength = platforms[i].rope;
				scene.add(rope);
				meshes.push(rope);
				ropes.push(rope);
			}
		}
		// coins
		for (var j = 0; j < 3; j += 1) {
			var coin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.05, 20), coinMaterial);
			coin.geometry.computeVertexNormals();
			if (platforms[i].width > platforms[i].depth) {
				var coinD = platforms[i].width / 3;
				coin.position.set(platforms[i].x - coinD + j * coinD, platforms[i].y + 0.5 + 0.5, platforms[i].z);
			} else {
				var coinD = platforms[i].depth / 3;
				coin.position.set(platforms[i].x, platforms[i].y + 0.5 + 0.5, platforms[i].z - coinD + j * coinD);
			}
			coin.scale.x = 0.5;
			coin.rotation.x = Math.PI / 2;
			coin.rotation.z = Math.PI / 4 * j;
			coin.castShadow = true;
			scene.add(coin);
			coins.push(coin);
		}
	}

	// start oimo loop
	// parameters
	var dt = 1/60;
	var ToRad = Math.PI / 180;
	var info = document.getElementById("info");
	var fps = 0, time, time_prev = 0, fpsint = 0;
	var minfo = new Float32Array(meshes.length * 8);
	var oimoInfo = 0;
	worker.postMessage({
		platforms: platforms,
		dt: dt,
		oimoUrl: document.location.href.replace(/\/[^/]*$/,"/") + "js/lib/oimo.js",
		minfo: minfo
	}, [minfo.buffer]);

	function render() {

		collided = false;
		var camAngle = Math.round(player.rotation.z) === 0 ? player.rotation.y : -player.rotation.y + Math.PI;
		if (document.pointerLockElement === renderer.domElement) {
			if ((!keyboard.pressed('w') && !keyboard.pressed('up')) || !holdingRope || hitHead) {
				if (sounds.climb.id) sounds.climb.stop(sounds.climb.id);
				sounds.climb.sounding = false;
			}
			if (keyboard.pressed('w') || keyboard.pressed('up')) {
				if (holdingRope) {
					if (!hitHead) {
						if (player.position.y < ropeSegment.parentHeight - 0.6) {
							player.position.y += 0.1;
							if (!sounds.climb.sounding) {
								sounds.climb.id = sounds.climb.play();
								sounds.climb.sounding = true;
							}
						} else {
							hitHead = true;
							collision = true;
						}
					}
				} else {
					player.position.z -= 0.1 * Math.cos(camAngle);
					player.position.x -= 0.1 * Math.sin(camAngle);
				}
			} else if (keyboard.pressed('s') || keyboard.pressed('down')) {
				hitHead = false;
				if (holdingRope) {
					if (player.position.y > ropeSegment.parentHeight - 0.6 - ropeSegment.ropeLength) {
						player.position.y -= 0.1;
					} else {
						holdingRope = false;
						letGoTimer = 30;
					}
				} else {
					player.position.z += 0.1 * Math.cos(camAngle);
					player.position.x += 0.1 * Math.sin(camAngle);
				}
			}
			if (keyboard.pressed('a') || keyboard.pressed('left')) {
				player.position.z += 0.1 * Math.sin(camAngle);
				player.position.x -= 0.1 * Math.cos(camAngle);
			} else if (keyboard.pressed('d') || keyboard.pressed('right')) {
				player.position.z -= 0.1 * Math.sin(camAngle);
				player.position.x += 0.1 * Math.cos(camAngle);
			}
			// jump
			if (keyboard.pressed('e') && onGround && jumpAllowed) {
				jumpAllowed = false;
				sounds.jump.play();
				vel.y = 0.15;
				onGround = false;
				sounds.hit.sounding = 0;
			}
		}
		// make player fall
		if (!holdingRope) {
			player.position.y += vel.y;
		}
		// floor
		if (!won && player.position.y < -99.5) {
			collided = true;
			player.position.y = -99.5;
			onGround = true;
			dead = true;
		}
		if (onGround && !keyboard.pressed('e')) {
			jumpAllowed = true;
		}

		// calculate velocity from gravity (until terminal velocity)
		if (vel.y > -0.9 && !holdingRope) {
			vel.y -= 0.00272;
		}
		// spin coins
		for (var i = 0; i < coins.length; i += 1) {
			coins[i].rotation.z += 0.04;
		}
		// win
		if (player.position.y > 216 && !won) {
			won = true;
			worker = null;
			holdingRope = false;
			outside.visible = true;
		}
		if (dead) {
			deadTimer -= 1;
		}
		if (deadTimer === 0) {
			dead = false;
			deadTimer = 120;
			player.position.set(4.5, 6, 1);
			deathsAdd(1);
		}

		if (won) {
			ending2.rotation.y += 0.01;
			outside.rotation.y += 0.1;
			if (player.position.y < -200) {
				outside.position.y = player.position.y + 200;
			}
		}

		// after manipulation, run checks (before render)

		if (!won) {
			// platform collisions
			for (var i = 0; i < platforms.length; i += 1) {
				if (
					player.position.x > platforms[i].x - ((platforms[i].width) / 2) &&
					player.position.x < platforms[i].x + ((platforms[i].width) / 2) &&
					player.position.y - 0.5 > platforms[i].y - 0.5 &&
					player.position.y - 0.5 < platforms[i].y + 0.5 &&
					player.position.z > platforms[i].z - ((platforms[i].depth) / 2) &&
					player.position.z < platforms[i].z + ((platforms[i].depth) / 2)
				) {
					var minDistance = {
						x: Math.min(Math.abs(player.position.x - (platforms[i].x - ((platforms[i].width) / 2))), Math.abs(player.position.x - (platforms[i].x + ((platforms[i].width) / 2)))),
						y: Math.min(Math.abs((player.position.y - 0.5) - (platforms[i].y - 0.5)), Math.abs((player.position.y - 0.5) - (platforms[i].y + 0.5))),
						z: Math.min(Math.abs(player.position.z - (platforms[i].z - ((platforms[i].width) / 2))), Math.abs(player.position.z - (platforms[i].z + ((platforms[i].width) / 2))))
					};
					if (minDistance.x <= minDistance.y && minDistance.x <= minDistance.z) {
						player.position.x = freeAxis('x', platforms[i]);
					} else if (minDistance.y <= minDistance.x && minDistance.y <= minDistance.z) {
						player.position.y = freeAxis('y', platforms[i]);
						collided = true;
					} else if (minDistance.z <= minDistance.x && minDistance.z <= minDistance.y) {
						player.position.z = freeAxis('z', platforms[i]);
					}
					break;
				}
			}
			// rope collisions
			for (var i = 0; i < ropes.length; i += 1) {
				if (
					player.position.x > ropes[i].position.x - 0.5 &&
					player.position.x < ropes[i].position.x + 0.5 &&
					player.position.y > ropes[i].position.y - 2.6 &&
					player.position.y < ropes[i].position.y + 2.6 &&
					player.position.z > ropes[i].position.z - 0.5 &&
					player.position.z < ropes[i].position.z + 0.5
				) {
					if (holdingRope) {
						ropeSegment = ropes[i];
					}
					if (letGoTimer === 0) {
						ropeSegment = ropes[i];
						holdingRope = true;
						onGround = false;
						vel.y = 0;
					}
					break;
				}
			}

			if (letGoTimer > 0) {
				letGoTimer -= 1;
			}

			if (holdingRope) {
				player.position.x = ropeSegment.position.x + 0.3 * Math.sin(camAngle);
				player.position.z = ropeSegment.position.z + 0.3 * Math.cos(camAngle);

				if (keyboard.pressed('e')) {
					holdingRope = false;
					letGoTimer = 30;
				}
			}

			if (!holdingRope) {
				hitHead = false;
			}

			// coin collisions
			for (var i = 0; i < coins.length; i += 1) {
				if (
					player.position.x > coins[i].position.x - 0.4 &&
					player.position.x < coins[i].position.x + 0.4 &&
					player.position.y > coins[i].position.y - 0.4 &&
					player.position.y < coins[i].position.y + 0.4 &&
					player.position.z > coins[i].position.z - 0.4 &&
					player.position.z < coins[i].position.z + 0.4
				) {
					scene.remove(coins[i]);
					coins.splice(i, 1);
					sounds.coin.play();
					scoreAdd(1);
					break;
				}
			}
		}
		// walls
		if (player.position.x > 10) {
			player.position.x = 10;
		} else if (player.position.x < -10) {
			player.position.x = -10;
		}
		if (player.position.z > 10) {
			player.position.z = 10;
		} else if (player.position.z < -10) {
			player.position.z = -10;
		}

		if (collided) {
			if (sounds.hit.sounding === 0) {
				sounds.hit.play();
				rgbAmount = 0.02;
				sounds.hit.sounding = 1;
			} if (sounds.hit.sounding === 2) {
				sounds.hit.sounding = 1;
			}
		} else {
			if (sounds.hit.sounding === 1) {
				sounds.hit.sounding = 2;
			} else if (sounds.hit.sounding === 2) {
				sounds.hit.sounding = 0;
			}
		}
		lastPos = Object.assign({}, player.position);
		requestAnimationFrame(render);

// holding down e after jump bug
// position on rope x z
// climbing above platform

		if (rgbAmount > 0) {
			effect.uniforms[ 'amount' ].value = rgbAmount; //.15
			composer.render();
			rgbAmount -= 0.005;
		} else {
			renderer.render(scene, camera);
			rgbAmount = 0;
		}

		displayInfo();
	}
	render();

	function freeAxis(axis, platform) {
		var offset = 0;
		var tune = 0.01;
		if (axis === 'y') {
			radius = 0.5;
			offset = 0.5;
			tune = 0.5;
			vel.y = 0;
		} else if (axis === 'x') {
			radius = platform.width / 2;
		} else if (axis === 'z') {
			radius = platform.depth / 2;
		}
		if (Math.abs((player.position[axis] - offset) - (platform[axis] - radius)) <
			Math.abs((player.position[axis] - offset) - (platform[axis] + radius))) {
				if (axis === 'y') {
					hitHead = true;
				}
				return platform[axis] - radius - tune;
		} else {
				if (axis === 'y') {
					onGround = true;
				}
				return platform[axis] + radius + tune;
		}
	}

	function scoreAdd(num) {
		score += num;
		document.getElementById('score').innerHTML = score;
	}
	function deathsAdd(num) {
		deaths += num;
		document.getElementById('deaths').innerHTML = deaths;
	}
	function displayInfo(){
		time = Date.now();
		if (time - 1000 > time_prev) {
			time_prev = time; fpsint = fps; fps = 0;
		} fps++;

		var info =[
			"Oimo.js DEV.1.1.1a<br><br>",
			"Physics: " + oimoInfo +" fps<br>",
			"Render: " + fpsint +" fps<br>"
		].join("\n");
		document.getElementById("info").innerHTML = info;
	}
	function orientCylinder(cylinder, pointX, pointY) {
		var direction = new THREE.Vector3().subVectors( pointY, pointX );
		var arrow = new THREE.ArrowHelper( direction, pointX );
		cylinder.scale.y = direction.length() / 5;
		cylinder.rotation = arrow.rotation.clone();
		cylinder.position = new THREE.Vector3().addVectors( pointX, direction.multiplyScalar(0.5) );
	}

}());
