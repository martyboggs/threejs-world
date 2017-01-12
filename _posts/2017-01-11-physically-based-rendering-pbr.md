---
layout: post
title: Physically Based Rendering in three.js
description: Let's import this sweet bowling pin into three.js! I created it in Blender where I assigned two materials to the faces of the model-- a magenta material for the stripes and a white material for the rest.
example: ex8
author: Marty Boggs
category: Tutorials
published: false
tags:
-  featured
-  materials
---

Let's import this sweet [bowling pin](/models/bowling-pin) into three.js! I created it
<!--more-->
in Blender where I assigned two materials to the faces of the model: a magenta material for the stripes and a white material for the rest.

In Blender, I chose Lambert materials and assigned diffuse colors. All this information is included in the JSON file as long as `Shading->Face Materials` is checked before you export.

## Import Your JSON File
Ok, now that you have your JSON file we can get it into the browser. To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along.

```javascript
var geometry = new THREE.SphereGeometry(5, 64, 64);
var material = new THREE.MeshStandardMaterial({color: 'rgb(61, 89, 251)', roughness: 0.5});

var envMap = new THREE.TextureLoader().load('/images/shiny-env-map.png');
envMap.mapping = THREE.SphericalReflectionMapping;
material.envMap = envMap;
var roughnessMap = new THREE.TextureLoader().load('/images/shiny-roughness-map.png');
roughnessMap.magFilter = THREE.NearestFilter;
material.roughnessMap = roughnessMap;
roughnessMap.magFilter = THREE.NearestFilter;
material.roughnessMap = roughnessMap;
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
```

```javascript
// do this to prevent tesellation
mesh.traverse(function (child) {
	if (child instanceof THREE.Mesh) {
		child.geometry.computeVertexNormals();
	}
});
```

