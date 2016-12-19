---
layout: post
image: rocket.png
title: Getting Started With Three.js
category: Tutorials
tags: [guide, beginner]
---

Using three.js is a great way to incorporate 3D graphics into your browser whether it's on a<!--more--> website, webapp, game or art project. It makes working with WebGL easy. This guide will get you started with the basics and explain what you can do with a little experience.

## Template
Set up your HTML template with a canvas element and the Three.js library. The css will stretch the canvas to fill the screen and we'll set the camera to accommodate this later.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>Three.js World App</title>
		<style>
			body { margin: 0; }
			canvas { width: 100%; height: 100% }
		</style>
	</head>
	<body>
		<canvas class="getting-started"></canvas>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/{{site.three_version}}/three.js"></script>
		<script>
			// Our Javascript will go here.
		</script>
	</body>
</html>
```

## Setting the Scene
Now that the canvas element is in place and the libarary is loaded, we can create our scene, camera and renderer objects. These are the three required objects we'll need before we can see anything on the canvas.

Add the following JavaScript between the script tags below the threejs library tags:

```javascript
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
	75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({
	canvas: document.getElementsByClassName('getting-started')[0],
	alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

function render() {
	cube.rotation.x += 0.1;
	cube.rotation.y += 0.1;

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();
```

```javascript
var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({color: 'blue'});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

compare to maya, 3ds max, unity

Modeling

Materials


Browser Compatibility

You can finally make that 3D spinning logo you always wanted!
