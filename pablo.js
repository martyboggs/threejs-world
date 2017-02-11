// {
//   "name": "requirebin-sketch",
//   "version": "1.0.0",
//   "dependencies": {
//     "quickhull3d": "2.0.0",
//     "t3-boilerplate": "0.2.7",
//     "three-subdivision-modifier": "1.0.5"
//   }
// }

// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r73/three.min.js"></script>
// <div id="canvas"></div>
// <script type="x-shader/x-fragment" id="fragmentShader"
// src="https://raw.githubusercontent.com/prevuelta/zen/master/src/shaders/test.frag"><script>
// <script type="x-shader/x-vertex" id="vertexShader"
// src="https://raw.githubusercontent.com/prevuelta/zen/master/src/shaders/test.vert"><script>


// Pablo Revuelta

var qh = require('quickhull3d')
var t3 = require('t3-boilerplate')
var SubdivisionModifier = require('three-subdivision-modifier')

t3.run({
	selector: '#canvas',
	helpersConfig: {
		ground: false,
		gridX: false,
		gridY: false,
		gridZ: false,
		axes: false
	},
	init: function() {
		function randomFloat (min, max) {
			return Math.random() * (max - min) + min;
		}
		function randomInt (min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		size = size || 2;
		var pointCount = Util.randomInt(4, 30);
		var points = [];
		var min = -size, max = size;
		for (var i = 0; i <= pointCount; i++) {
			points.push([
				Util.randomFloat(min, max),
				Util.randomFloat(min, max),
				Util.randomFloat(min, max)
			]);
		}

		var outline = qh(points);


		var geometry = new THREE.BufferGeometry();
		var vertices = new Float32Array(
			points.reduce((a,b) => a.concat(b))
		);
		var indices = new Uint16Array(
			outline.reduce((a,b) => a.concat(b))
		);
		geometry.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
		geometry.setIndex(new THREE.BufferAttribute(indices, 1));

		var modifier = new SubdivisionModifier(2);
		modifier.modify( geometry );

		var material = new THREE.ShaderMaterial( {
			uniforms: {
				time: { value: 1.0 },
				resolution: { value: new THREE.Vector2() }
			},
    		vertexShader: document.getElementById('vertexShader'),
    		fragmentShader:  document.getElementById('fragmentShader')
		});

		var mesh = new THREE.Mesh( geometry, material );

		// Bounding box
		var helper = new THREE.BoundingBoxHelper(mesh, new THREE.Color(0xFF0000));
		mesh.add(helper)
		helper.update();
		// Wireframe
		var wireframe = new THREE.WireframeGeometry( geometry );
		var line = new THREE.LineSegments( wireframe );
		line.material.depthTest = false;
		line.material.opacity = 0.25;
		line.material.transparent = true;
		mesh.add( line );

		this.activeScene.add(mesh);
	},
	update: function(delta) {}
});