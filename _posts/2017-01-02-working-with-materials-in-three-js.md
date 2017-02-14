---
layout: post
title: Working with Materials in three.js
description: Let's import this sweet bowling pin into three.js! I created it in Blender where I assigned two materials to the faces of the model-- a magenta material for the stripes and a white material for the rest.
example: ex6
author: Marty Boggs
category: Tutorials
tags:
-  materials
---

Let's import this sweet [bowling pin](/models/bowling-pin) into three.js! I created it <!--more-->in Blender where I assigned two materials to the faces of the model: a magenta material for the stripes and a white material for the rest.

In Blender, I chose Lambert materials and assigned diffuse colors. All this information is included in the JSON file as long as `Shading->Face Materials` is checked before you export.

## Import Your JSON File
Ok, now that you have your JSON file we can get it into the browser. To get started, we'll use this <a href="{{site.url}}/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along.

```javascript
var mesh = new THREE.Object3D();
var jsonLoader = new THREE.JSONLoader();
jsonLoader.load('/js/models/bowling-pin/bowling-pin.json',
	function (geometry, materials) {
		mesh = new THREE.Mesh(geometry,
			new THREE.MultiMaterial(materials));
		scene.add(mesh);
	}
);

camera.position.set(0, 1.8, 4);
```

The key here is to use the THREE.MultiMaterial class which takes one or more materials and figures out how to display them.

>**Note:** In later versions of three.js, THREE.MultiMaterial class should be used instead of THREE.MeshFaceMaterial. You might see this in your console: "THREE.MeshFaceMaterial has been renamed to THREE.MultiMaterial"

## Be a Material Girl
Beside face materials, three.js can import many other material types:

* blending (add, subtract, multiply, etc.)
* channels
* toon
* soft body
* wave (sine, compound)
* anisotropy
* custom shaders
* map channels
* [cube maps](/tutorials/build-a-star-wars-droid-in-three-js)
* fresnel, lambert, phong
* Physically based rendering (PBR) MeshStandardMaterial
* Mapping
  * UV map
  * alpha map
  * bump map
  * normal map
  * displacement map
  * rough map
  * metal map
  * env map (environment mapping, reflection mapping, refraction mapping)
  * light map
  * ao map (ambient occlusion map)
  * emissive map
  * parallax map
