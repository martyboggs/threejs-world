---
layout: post
title: AR in three.js with Aruco Markers
example: ex7
author: Marty Boggs
category: Tutorials
published: false
tags:
-  featured
-  advanced
---

See example here: <a href="https://martyboggs.github.io/aruco-marker-example" target="_blank"></a>

chrome requires https for html5 video

I find Oimo more accurate than cannon, but each has its downsides. For example, Oimo only supports cubes and spheres whereas cannon supports other types of meshes as well.

Ok - Oimo seem to have a problem with taking the mass into account when applying a force


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
