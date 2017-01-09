---
layout: post
title: Character Rigging in three.js
example: ex4
author: Marty Boggs
category: Tutorials
tags:
-  advanced
-  rigging
-  featured
---
Meet Hugbot. A robot designed for expressing affection. It can be yours for 9000 dollars US or by
<!--more-->
downloading it from the [Free 3D Models](/models/hugbot) area and following this tutorial.

To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along.

We'll import Hugbot with a `JSONLoader`. The Hugbot model was made in Blender with armatures or bones which form a skeleton. The skeleton can then be manipulated to move the model's vertices around.

To make this process work with your own rigged models, make sure you export with "bones" and "skinning" along with the rest of your model. You might want to check out my <a href="/tutorials/export-a-model-from-blender">post about exporting from Blender</a>.

Also, use the `SkinnedMesh` class which will add a skeleton array to the mesh and read the "mesh skin weighting." This information tells the renderer how much to stretch the mesh for each bone in question.

```javascript
var mesh = new THREE.Object3D();
var jsonLoader = new THREE.JSONLoader();
jsonLoader.load('/js/models/hugbot/hugbot.json',
	function (geometry, materials) {
		// SkinnedMesh instead of Mesh
		mesh = new THREE.SkinnedMesh(geometry,
		new THREE.MeshLambertMaterial({
			color: '#75b6fb',
			transparent: true,
			opacity: 0.9,
			skinning: true // DON'T FORGET THIS!!!
		}));
		mesh.rotation.y = -Math.PI / 2;
		scene.add(mesh);
	}
);

camera.position.set(0, 3, 7);
```

It's better to create animations in Blender first so you can take advantage of inverse kinematics and three.js's animation mixer, but for simple animations, moving individual bones is fine.

Since I want to create an oscillating movement, I'll use sine and cosine functions to save me from using lots of logic and to create a nice easing effect.

Here's an illustration of the concept:

<img src="/images/sine.gif">

Now put the following code in your `render` function to make your Hugbot come to life!

```javascript
mesh.rotation.y += 0.01;
if (mesh.skeleton) {
	// right foot
	mesh.skeleton.bones[0].rotation.x = -0.2 * Math.sin(2 * osc) - 0.1;
	mesh.skeleton.bones[0].rotation.y = -0.2 * Math.cos(2 * osc) - 0.1;
	// left foot
	mesh.skeleton.bones[1].rotation.x = -0.2 * Math.cos(2 * osc) - 0.1;
	mesh.skeleton.bones[1].rotation.y = -0.2 * Math.sin(2 * osc) - 0.1;
	// body
	mesh.skeleton.bones[2].rotation.x = 0.1 * Math.sin(2 * osc);
	mesh.skeleton.bones[2].rotation.z = 0.2 * Math.sin(osc) + 0.1;
	// left upper arm
	mesh.skeleton.bones[3].rotation.x = 0.5 * Math.sin(osc) + 0.5;
	mesh.skeleton.bones[3].rotation.y = -Math.sin(osc) - 0.8;
	// right upper arm
	mesh.skeleton.bones[5].rotation.x = -0.5 * Math.sin(osc) - 0.5;
	mesh.skeleton.bones[5].rotation.y = Math.sin(osc) + 0.8;
	// left lower arm
	mesh.skeleton.bones[4].rotation.x = 0.2 * Math.sin(osc) + 0.2;
	// right lower arm
	mesh.skeleton.bones[6].rotation.x = -0.2 * Math.sin(osc) - 0.2;
}
osc += 0.05;
```
