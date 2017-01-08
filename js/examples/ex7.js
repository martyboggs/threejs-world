if (!window.MediaStreamTrack || !window.MediaStreamTrack.getSources) throw new Error('MediaStreamTrack not found. Make sure there\'s a valid ssl certificate');

var detectMarkersStats = new Stats();
detectMarkersStats.setMode( 1 );
document.body.appendChild( detectMarkersStats.domElement );
detectMarkersStats.domElement.style.position = 'absolute'
detectMarkersStats.domElement.style.bottom = '0px'
detectMarkersStats.domElement.style.right = '0px'

var renderStats = new Stats();
renderStats.setMode( 0 );
document.body.appendChild( renderStats.domElement );
renderStats.domElement.style.position = 'absolute'
renderStats.domElement.style.bottom = '0px'
renderStats.domElement.style.left = '0px'

var renderer	= new THREE.WebGLRenderer({
	antialias	: true,
	alpha		: true,
});
renderer.setSize(660, 330);
document.getElementById('canvases').appendChild(renderer.domElement);
// array of functions for the rendering loop
var onRenderFcts = [];
// init scene and camera
var scene = new THREE.Scene()
var camera	= new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.z = 2;
//////////////////////////////////////////////////////////////////////////////////
//		create a markerObject3D
//////////////////////////////////////////////////////////////////////////////////
var markerObject3D = new THREE.Object3D()
scene.add(markerObject3D)
//////////////////////////////////////////////////////////////////////////////////
//		add an object in the markerObject3D
//////////////////////////////////////////////////////////////////////////////////
// add some debug display
;(function(){
	// var geometry = new THREE.PlaneGeometry(1,1,10,10)
	// var material = new THREE.MeshBasicMaterial( {
	// 	wireframe : true
	// })
	// var mesh = new THREE.Mesh(geometry, material);
		new THREE.JSONLoader().load('./js/models/spider.json', function (geometry, materials) {
			var mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshLambertMaterial({color: 'green', skinning: true}));
			mesh.scale.set(0.3, 0.3, 0.3);
			mesh.rotation.set(90 * Math.PI / 180, 0, 0);
			// mesh.position.set(-130, 15, 130);
			// move body
			// new TWEEN.Tween(mesh.rotation).to({x: [0.05, 0, -0.1, 0], z: [-0.07, 0, 0.07, 0]}, 7000).repeat(Infinity).start();
			// new TWEEN.Tween(mesh.skeleton.bones[0].rotation).to({z: [-0.2, 0]}, 7000).repeat(Infinity).start();
			// new TWEEN.Tween(mesh.skeleton.bones[3].rotation).to({x: [-0.4, 0]}, 9000).repeat(Infinity).start();
			// new TWEEN.Tween(mesh.skeleton.bones[6].rotation).to({z: [0.2, 0]}, 7000).repeat(Infinity).start();
			// new TWEEN.Tween(mesh.skeleton.bones[9].rotation).to({x: [0.4, 0]}, 7000).repeat(Infinity).start();
			// var legs = [
			// 	{movement: {z: [0, -0.2, 0]}, speed: 3000},
			// 	{movement: {x: [-0.2, 0, 0.1, 0]}, speed: 5000},
			// 	{movement: {z: [0.3, 0]}, speed: 6000},
			// 	{movement: {x: [0.2, -0.1, 0.3, 0]}, speed: 4000}
			// ];
			// var legs = [
			// 	{movement: {z: [0, -0.2, 0]}, speed: 3000},
			// 	{movement: {x: [-0.2, 0, 0.1, 0]}, speed: 5000},
			// 	{movement: {z: [0.3, 0]}, speed: 6000},
			// 	{movement: {x: [0.2, -0.1, 0.3, 0]}, speed: 4000}
			// ];
			// j = 0;
			// for (var i = 0; i < mesh.skeleton.bones.length; i += 1) {
			// 	if (i % 3 === 2) { // tips
			// 		console.log(i);
			// 		new TWEEN.Tween(mesh.skeleton.bones[i].rotation).to(legs[j].movement, legs[j].speed).easing(TWEEN.Easing.Sinusoidal.InOut).repeat(Infinity).start();
			// 		j += 1;
			// 	} else if (i % 3 === 1) { // elbows
			// 		new TWEEN.Tween(mesh.skeleton.bones[i].rotation).to(legs[j].movement, legs[j].speed).easing(TWEEN.Easing.Sinusoidal.InOut).repeat(Infinity).start();
			// 	}
			// }
			markerObject3D.add( mesh );
			// var mesh = new THREE.AxisHelper
			// markerObject3D.add( mesh );
		});

})()
// add a awesome logo to the scene
;(function(){
	var material = new THREE.SpriteMaterial({
		map: THREE.ImageUtils.loadTexture( 'images/awesome.png' ),
	});
	var geometry = new THREE.BoxGeometry(1,1,1)
	var object3d = new THREE.Sprite(material );
	object3d.scale.set( 2, 2, 1 );
	markerObject3D.add(object3d)
})()
//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////
// handle window resize
window.addEventListener('resize', function(){
	renderer.setSize( window.innerWidth, window.innerHeight )
	camera.aspect	= window.innerWidth / window.innerHeight
	camera.updateProjectionMatrix()
}, false)

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL(0.6, 0.75, 0.5);
hemiLight.groundColor.setHSL(0.095, 0.5, 0.5);
hemiLight.position.set(0, 500, 0);
scene.add(hemiLight);


// render the scene
onRenderFcts.push(function(){
	renderStats.begin();
	renderer.render( scene, camera );
	renderStats.end();
});
// run the rendering loop
var previousTime = performance.now()
requestAnimationFrame(function animate(now){
	requestAnimationFrame( animate );
	onRenderFcts.forEach(function(onRenderFct){
		onRenderFct(now, now - previousTime)
	});
	previousTime = now;
})
//////////////////////////////////////////////////////////////////////////////////
//		Do the Augmented Reality part
//////////////////////////////////////////////////////////////////////////////////
// init the marker recognition
var jsArucoMarker	= new THREEx.JsArucoMarker();
// if no specific image source is specified, take the webcam by default
if (location.hash === '') location.hash = '#webcam';
// init the image source grabbing
if( location.hash === '#video' ){
	var videoGrabbing = new THREEx.VideoGrabbing()
	jsArucoMarker.videoScaleDown = 2
}else if( location.hash === '#webcam' ){
	var videoGrabbing = new THREEx.WebcamGrabbing()
	jsArucoMarker.videoScaleDown = 2
}else if( location.hash === '#image' ){
	var videoGrabbing = new THREEx.ImageGrabbing()
	jsArucoMarker.videoScaleDown = 10
}else console.assert(false)
// attach the videoGrabbing.domElement to the body
	document.body.appendChild(videoGrabbing.domElement)
//////////////////////////////////////////////////////////////////////////////////
//		Process video source to find markers
//////////////////////////////////////////////////////////////////////////////////
// set the markerObject3D as visible
markerObject3D.visible	= false
// process the image source with the marker recognition
onRenderFcts.push(function(){
	var domElement	= videoGrabbing.domElement
	detectMarkersStats.begin();
	var markers	= jsArucoMarker.detectMarkers(domElement)
	detectMarkersStats.end();
	markerObject3D.visible = false
	// see if this.markerId has been found
	markers.forEach(function(marker){
		// if( marker.id !== 265 )	return
		jsArucoMarker.markerToObject3D(marker, markerObject3D)
		markerObject3D.visible = true
	});
});
