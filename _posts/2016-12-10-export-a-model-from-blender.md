---
layout: post
title: Export a Model from Blender
image: rocket.png
example: ex3
author: Marty Boggs
category: Tutorials
tags:
-  featured
---
This is a futuristic paperweight I designed in Blender, a 3D modeling tool. I did some modeling in<!--more--> college, but it didn't help with this kind of modeling :/ This model is available to download on the [Free 3D Models page](/all/models).

To export your own models from Blender to .json files, you'll need to install <a rel="nofollow" target="_blank" href="https://github.com/mrdoob/three.js/tree/master/utils/exporters/blender">the three.js blender exporter tool</a>. Instructions can be found at the link and involve copying a folder to your Blender install and activating the addon in the program. Once you install the exporter, the export to three.js option will be available.

There are a few things you should know about exporting models using this exporter.

<h2><span class="fa-stack fa-lg stack">
	<i class="fa fa-circle fa-stack-1x"></i>
	<span class="fa-inverse stack-05x">1</span>
</span> Select the model before exporting</h2>

Make sure you're in object-mode then right-click on your object. You can only export one object, so selecting one tells Blender what you want to export.

<h2><span class="fa-stack fa-lg stack">
	<i class="fa fa-circle fa-stack-1x"></i>
	<span class="fa-inverse stack-05x">2</span>
</span> Choose Features to Export</h2>

After going to file->export->Three.js(.json) a window opens with many options. For my Blender model, I chose to only export the geometry, but UV maps, bones, skinning and animation are also available for export. Make sure the checkboxes are selected for the features you want to export.

## Slap It on the Canvas

Ok, now that you have your .json file we can get it into the browser. To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template</a> that I use in a lot of posts. Open the template to follow along.

```javascript
var mesh = new THREE.Object3D();
var jsonLoader = new THREE.JSONLoader();
jsonLoader.load('/js/models/paperweight.json',
	function (geometry, materials) {
		mesh = new THREE.Mesh(geometry,
			new THREE.MeshLambertMaterial({color: '#9e6039'}));
		scene.add(mesh);
	}
);

camera.position.set(0, 1.8, 4);
```

You can add this to the render function to give the model some rotation.

```javascript
mesh.rotation.y += 0.01;
```
