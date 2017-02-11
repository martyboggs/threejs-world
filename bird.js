// http://requirebin.com/
var t3 = require('t3-boilerplate')
t3.run({
	selector: '#canvas',
		helpersConfig: {
		ground: false,
		gridX: true,
		gridY: true,
		gridZ: false,
		axes: true
	},
	init: function() {
		this.group1 = new THREE.Object3D();

		var bodyWidth = 60;
		var wing1Width = 130;
		var wing2Width = 50;
		var thickness = 10;
		var blue2 = new THREE.MeshLambertMaterial({color: '#222F5B'});

		this.body = new THREE.Mesh(new THREE.BoxGeometry(bodyWidth, 60, 120), blue2);
		this.body.position.set(0, 0, -5);

		this.wingR1 = new THREE.Mesh(new THREE.BoxGeometry(wing1Width, thickness, 100), blue2);
		this.wingR1.position.set(-wing1Width / 2, 4, -10);
		this.wingR2 = new THREE.Mesh(new THREE.BoxGeometry(wing2Width, thickness, 50), blue2);
		this.wingR2.position.set(-wing2Width / 2, 4, 5);
		this.wingtipR = new THREE.Object3D().add(this.wingR2);
		this.wingtipR.position.x = -wing1Width;
		this.wingR = new THREE.Object3D().add(this.wingR1, this.wingtipR);
		this.wingR.position.set(-bodyWidth / 2, 10, 0);

		this.wingL1 = new THREE.Mesh(new THREE.BoxGeometry(wing1Width, thickness, 100), blue2);
		this.wingL1.position.set(wing1Width / 2, 4, -10);
		this.wingL2 = new THREE.Mesh(new THREE.BoxGeometry(wing2Width, thickness, 50), blue2);
		this.wingL2.position.set(wing2Width / 2, 4, 5);
		this.wingtipL = new THREE.Object3D().add(this.wingL2);
		this.wingtipL.position.x = wing1Width;
		this.wingL = new THREE.Object3D().add(this.wingL1, this.wingtipL);
		this.wingL.position.set(bodyWidth / 2, 10, 0);

		this.bird = new THREE.Object3D().add(this.wingR, this.wingL, this.body);
		this.activeScene.add(this.bird);

		this.wingTimer = 0;
		this.up = false;
		this.hover = 0; // temp
		this.wingAction = 'flapping';
		// might need to round this.wingTimer

		/*
		goals:
		for comp and mobile and vr (tapping? optional)
		make no tapping still engaging (vr cursor)
		simple physics (1 day) otherwise collisions need to be done by hand
		tap flaps else
		*/
	},
	update: function(delta) {
		switch (this.wingAction) {
		case 'hover':
			if (this.up && this.wingTimer < 0.5) {
				this.wingL.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.15);
				this.wingR.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.15);
				this.wingtipL.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.08);
				this.wingtipR.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.08);
				this.wingTimer += 0.1;
			} else {
				this.up = false;
			}

			if (!this.up && this.wingTimer > -0.7) {
				this.wingL.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.2);
				this.wingR.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.2);
				this.wingtipL.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.08);
				this.wingtipR.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.08);
				this.wingTimer -= 0.1;
			} else {
				this.up = true;
			}
		break;
		case 'flapping':
			if (this.up && this.wingTimer < 0.5) {
				this.wingL.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.3);
				this.wingR.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.3);
				this.wingtipL.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.16);
				this.wingtipR.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.16);
				this.wingTimer += 0.1;
			} else {
				this.up = false;
			}

			if (!this.up && this.wingTimer > -0.7) {
				this.wingL.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.3);
				this.wingR.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.3);
				this.wingtipL.rotateOnAxis(new THREE.Vector3(0, 0, 1), 0.16);
				this.wingtipR.rotateOnAxis(new THREE.Vector3(0, 0, 1), -0.16);
				this.wingTimer -= 0.1;
			} else {
				this.up = true;
			}
		break;
		case 'gliding':
		break;
		case 'walking':
		break;
		}


		// rotate bird
		this.bird.rotateOnAxis(new THREE.Vector3(0, 1, 0), -0.01);

		// position bird (temp?)
		this.bird.position.x = 208 * Math.sin(this.hover);
		this.bird.position.y = 108 * Math.sin(this.hover / 2) + 100;

		this.hover += 0.01;
	}
});