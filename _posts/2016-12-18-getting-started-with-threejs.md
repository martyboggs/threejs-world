---
title: Getting Started With Three.js
layout: post
image: rocket.png
example: ex1-1
category: Tutorials
tags:
- guide
- beginner
---

Using three.js is a great way to incorporate 3D graphics into your browser whether it's on a<!--more--> website, webapp, game or art project. It makes working with WebGL easy. In this guide, we'll create a scene with a cube.


## Template
Set up your HTML template with a canvas element and the three.js library. The css will stretch the canvas to fill the screen and we'll set the camera to accommodate this later.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>Three.js World App</title>
		<style>
			canvas.{{canvas.page}} {width: 660px; height: 330px;}
		</style>
	</head>
	<body>
		<canvas class="{{canvas.page}}"></canvas>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/{{site.three_version}}/three.js"></script>
		<script>
			// Our JavaScript will go here.
		</script>
	</body>
</html>
```

## Setting the Scene
Now that the canvas element is in place and the libarary is loaded, we can create our scene, camera and renderer objects. These are the three required objects we'll need before we can see anything on the canvas.

We'll also add a light object to the scene so we can see the mesh we'll add in the next step.

Add the following JavaScript between the script tags below the three.js script tags:

```javascript
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
	75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

var renderer = new THREE.WebGLRenderer({
	canvas: document.getElementsByClassName('ex1-1')[0],
	alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);

var ambientLight = new THREE.AmbientLight('#444')
var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 20, 14);
scene.add(ambientLight, directionalLight);

function render() {
	// Render logic goes here.

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();
```

## Add a Cube
Now, let's add a cube to the scene. To create a cube mesh, we need a geometry component which describes the size and shape of the mesh and a material to describe how the mesh will interact with light.

Below, I've chosen box geometry with length, width and height set to 1 unit and a LambertMaterial to make the cube a little reflective. We use the `add` function to add the mesh to the scene just like how we added the light objects.

```javascript
var geometry = new THREE.BoxGeometry(2, 1, 1);
var material = new THREE.MeshLambertMaterial({color: 'blue'});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```


Modeling

Browser Compatibility