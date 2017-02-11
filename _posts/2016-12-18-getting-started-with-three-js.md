---
layout: post
title: Getting Started with three.js
description: Using three.js is a great way to incorporate 3D graphics into your browser whether it's on a website, webapp, game or art project. It makes working with WebGL easy. In this guide, we'll create a scene with a spinning rectangular shape.
example: ex1
category: Tutorials
author: Marty Boggs
tags:
-  beginner
---

Using three.js is a great way to incorporate 3D graphics into your browser whether it's on a<!--more--> website, webapp, game or art project. It makes working with WebGL easy. In this guide, we'll create a scene with a spinning rectangular shape.

## Getting Started

Set up your HTML template. I've added a target div with an id called "canvases" which is where I'll add the canvas element in the next step. The canvas is an inline element and can be styled with css.

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>Three.js World</title>
	</head>
	<body>
		<div id="canvases"></div>
		<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/{{site.three_version}}/three.js"></script>
		<script>
			// Our JavaScript will go here.
		</script>
	</body>
</html>
```

### Set the Scene
Now that the canvas element is in place and the libarary is loaded, we can create our scene, camera and renderer objects. These are the three required objects we'll need before we can see anything on the canvas.

### Create a Camera
Create a camera object to point at your scene. In three.js there's a perspective camera and an orthographic camera. We'll use perspective since it's more common and models the way we see the world with our eyes. The orthographic camera renders objects the same size regardless of their distance to the camera. This creates an effect like in the game The Sims.

There are options to control how curved the view is and the limits of the field of view. It's important to choose reasonable field of view limits or your computer will have too much data to process in each frame.

### Create a Renderer
Create a WebGLRenderer instance. The WebGLRenderer is well-supported by all modern browsers. There are some advanced effects that might not be supported by your graphics card.

### Add some lights
Create some lights so we can see the mesh we'll add in the next step. To read more about lights in three.js, check out this article: <a href="{{site.url}}/tutorials/casting-shadows-and-casting-light-in-three-js">Casting Shadows and Casting Light in Three.js</a>.

### The Code
Add the following JavaScript between the script tags below the three.js script tags:

```javascript
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(
	75, 660 / 330, 0.1, 1000
);
camera.position.z = 2;

var renderer = new THREE.WebGLRenderer({
	alpha: true
});
renderer.setSize(660, 330);
document.getElementById('canvases').appendChild(renderer.domElement);

var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 2, 2);
scene.add(directionalLight);
```

### Add a Box
Now, let's add a box to the scene. To create a box mesh, we need a geometry component which describes the size and shape of the mesh and a material to describe how the mesh will interact with light.

In the example, I've made the x component of the box's geometry a bit longer to make things interesting. For the material, I chose a LambertMaterial to make the box a little reflective. We use the `add` function to add the mesh to the scene just like how we added the light objects.

```javascript
var geometry = new THREE.BoxGeometry(2.5, 1, 1);
var material = new THREE.MeshLambertMaterial({color: '#285cd0'});
var box = new THREE.Mesh(geometry, material);
scene.add(box);
```

To render each frame of the scene create a function that calls `requestAnimationFrame`. This will run the animation as fast as your processor can go, up to 60fps. I've added a box rotation as well to start the shape rotating. Wow!

```javascript
function render() {
	box.rotation.y += 0.01;
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();
```