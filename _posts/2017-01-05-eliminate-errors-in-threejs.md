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

Intel HD Graphics 4000
THREE.WebGLProgram: gl.getProgramInfoLog()
THREE.WebGLRenderer: WEBGL_depth_texture extension not supported.
THREE.WebGLRenderer: OES_texture_float extension not supported.
THREE.WebGLRenderer: OES_texture_half_float extension not supported.
THREE.WebGLRenderer: OES_texture_half_float_linear extension not supported.
THREE.WebGLRenderer: OES_standard_derivatives extension not supported.
THREE.WebGLRenderer: ANGLE_instanced_arrays extension not supported.
THREE.WebGLRenderer: OES_element_index_uint extension not supported.

THREE.WebGLRenderer: image is not power of two (480x480)

[.Offscreen-For-WebGL-0000002DA672FB50]RENDER WARNING: there is no texture bound to the unit 2

THREE.WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead.

THREE.WebGLRenderer: WEBGL_compressed_texture_pvrtc extension not supported.

THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()

THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()

RENDER WARNING: texture bound to texture unit 0 is not renderable. It maybe non-power-of-2 and have incompatible texture filtering.

WebGL: too many errors, no more errors will be reported to the console for this context.



BABYLON.SmartCollection is not a constructor

<!--more--> [Free 3D Models page](/all/models).

Ok, now that you have your JSON file we can get it into the browser. To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along.

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
