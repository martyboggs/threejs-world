WebFont.load({
	google: {
		families: ['Raleway:200,400', 'Bree Serif']
	}
});

var mboggs = {
	window: {
		width: 0,
		height: 0,
		maxWidth: 949, // 1120 853
		maxHeight: 534, // 630  480
	},
	toRad: Math.PI / 180,
};

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var canvas = $('.model');
var renderer = new THREE.WebGLRenderer({canvas: canvas.get(0)});


// window
mboggs.window.aspectRatio = mboggs.window.maxWidth / mboggs.window.maxHeight;
camera.position.z = 5;
setInterval(function () {
	mboggs.window.width = canvas.parent().width();
	mboggs.window.height = canvas.parent().height();
	if (mboggs.window.windowWidth >= mboggs.window.maxWidth) {
		mboggs.window.width = mboggs.window.maxWidth;
	} else {
		mboggs.window.height = mboggs.window.width / mboggs.window.aspectRatio;
	}
	if (mboggs.window.height >= mboggs.window.maxHeight) {
		mboggs.window.height = mboggs.window.maxHeight;
	} else {
		mboggs.window.width = mboggs.window.height * mboggs.window.aspectRatio;
	}
	renderer.setSize(mboggs.window.width, mboggs.window.height);
	camera.aspect = mboggs.window.width / mboggs.window.height;
	camera.updateProjectionMatrix();
}, 1000);


var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function render() {
	requestAnimationFrame( render );

	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	renderer.render( scene, camera );
}
render();
