---
layout: post
title: Eliminate Errors in three.js
example: ex6
author: Marty Boggs
published: false
category: Errors
tags:
-  featured
-  advanced
---

Error creating WebGL context.
Uncaught TypeError: Cannot read property 'getExtension' of null

Error in three.js :- Materials[json.type] is not a constructor

gl.getProgramInfoLog() (66,6): warning X3557: loop only executes for 1 iteration(s), forcing loop to unroll.

Document has no method createElementNS

canvas is blank

BABYLON.SmartCollection is not a constructor

<!--more--> [Free 3D Models page](/all/models).

Ok, now that you have your .json file we can get it into the browser. To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template</a> that I use in a lot of posts. Open the template to follow along.

```javascript
var mesh = new THREE.Object3D();
var jsonLoader = new THREE.JSONLoader();
jsonLoader.load('/js/models/bowling-pin.json',
	function (geometry, materials) {
		mesh = new THREE.Mesh(geometry,
			new THREE.MultiMaterial(materials));
		scene.add(mesh);
	}
);

camera.position.set(0, 1.8, 4);
```

You can add this to the render function to give the model some rotation.

```javascript
mesh.rotation.y += 0.01;
```
