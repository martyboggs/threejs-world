---
layout: post
title: Build a Star Wars Droid in three.js
description: I just saw Rogue One, so this next example features a Star Wars like droid. BB-8 may be your only hope.
example: ex2
author: Marty Boggs
category: Tutorials
tags:
-  featured
---

I just saw Rogue One, so this next example features a Star Wars like droid. BB-8 may be your only hope...
<!--more-->

This tutorial will show you how to put spheres in your project and how to create UV maps that wrap over them. To get started, we'll use this <a href="{{site.url}}/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along.

To get images onto the canvas, they need to be loaded in using a TextureLoader which can be instantiated once and then reused.

```javascript
var loader = new THREE.TextureLoader();
```

Let's start with the droid's head. The type of image needed for spherical UV mapping is called an **equirectangular projection**. Our droid's head is simple enough that I could draw it myself. To ensure that your textures aren't stretched out, make sure to use an image twice as wide as it is tall.

<img src="{{site.url}}/images/bb8head.png">

The example for TextureLoader in the documentation is asynchronous which will make your code more complicated than it needs to be. The TextureLoader immediately returns a blank texture which gets filled as soon as the image loads. This means that **you don't need to use asynchronous code to load textures**. You can get the texture with one line of code, as I've done below.

```javascript
var texture = loader.load('/images/bb8head.png');
```

We'll create a sphere with a 0.5 unit diameter.

```javascript
// head
var head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshPhongMaterial({map: texture}));
head.position.y = 1;
scene.add(head);
```

For our droid's body, an equirectangular projection image won't work. Drawing the orange circles on the sides would be easy enough, but the top and bottom circles wouldn't look right as these areas get distorted by the mapping.

A better method is to use a **cube map** and then morph it into a sphere. A cube map combines six flat images, one for each side of a cube. We'll reuse the same image for all six sides.

For the BoxGeometry function call, we'll need to split the cube into 8 x 8 x 8 sections so we're able to morph it. That's what the three other arguments do.

<img src="{{site.url}}/images/bb8one.png">

```javascript
var geometry = new THREE.BoxGeometry(1, 1, 1, 8, 8, 8);
// morph box into a sphere
for (var i = 0; i < geometry.vertices.length; i += 1) {
	geometry.vertices[i].normalize();
}
// fix the vertex normals, so shading looks right for a sphere
for (var i = 0; i < geometry.faces.length; i += 1) {
	var face = geometry.faces[i];
	face.vertexNormals[0].copy(geometry.vertices[face.a]).normalize();
	face.vertexNormals[1].copy(geometry.vertices[face.b]).normalize();
	face.vertexNormals[2].copy(geometry.vertices[face.c]).normalize();
}
var texture = loader.load('/images/bb8one.png');

var body = new THREE.Mesh(geometry,
	new THREE.MeshPhongMaterial({map: texture}));
scene.add(body);
```

Now, I know what you're thinking... you wanna play Pokemon Go, but just hold on because we're almost done. Next, we'll add the antenna. The CylinderGeometry constructor takes as arguments: radius at the top, radius at the bottom, length. There are some others, but the defaults are fine for our purposes.

```javascript
// create the antenna
var geometry = new THREE.CylinderGeometry(0.01, 0.01, 2);
var material = new THREE.MeshBasicMaterial({color: 'gray'});
var antennae1 = new THREE.Mesh(geometry, material);
var geometry = new THREE.CylinderGeometry(0.02, 0.02, 1);
var material = new THREE.MeshBasicMaterial({color: 'gray'});
var antennae2 = new THREE.Mesh(geometry, material);
antennae1.position.set(0, 1.3, 0);
antennae2.position.set(0.1, 1.3, 0);
scene.add(antennae1, antennae2);
```

Finally, we'll position the camera to get a better view of our droid:

```javascript
camera.position.set(0, 1.3, 3);
camera.rotation.set(-0.25, 0, 0);
```

You can add this to the render function to make our droid roll:

```javascript
body.rotation.y += 0.01;
body.rotation.x += 0.06;
```

To take this example to the next level, you could figure out how to group the antenna with the head and make the head rotate along its body.
