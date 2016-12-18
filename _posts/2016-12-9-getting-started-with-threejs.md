---
layout: post
image: rocket.png
title: Getting Started with Three.js
category: Tutorials
tags: [guide, beginner]
---

## Intro
Using three.js is a great way to incorporate 3D graphics into your browser whether it's on a website, webapp, game or art project. It makes working with WebGL easy. This guide will get you started with the basics and explain what you can do with a little experience.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>My first Three.js app</title>
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
		<script src="js/three.js"></script>
		<script>
			// Our Javascript will go here.
		</script>
	</body>
</html>
```

```javascript
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
```

compare to maya, 3ds max, unity

Modeling

Materials


Browser Compatibility

You can finally make that 3D spinning logo you always wanted!
