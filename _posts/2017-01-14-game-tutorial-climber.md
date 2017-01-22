---
layout: post
title: Game Tutorial&#58; CLIMBER
description:
example: ex10
author: Marty Boggs
tags:
-  game
-  animation
-  physics
-  lighting
-  collisions
-  euler
-  featured
---
<br>
<br>
<div id="info"></div>
To show how to put together ThreeJS design concepts into **a complete project**, I created a little game called Climber. Click in the box to activate the Pointer Lock API. Now the mouse cursor is hidden and the **mouse movement** controls the angle of the camera. Use the **WASD** buttons to move the camera's position around.

Wow! Now you're navigating a 3D world!

## Pointer Lock API

Don't you hate it when you're playing a web game and you accidently click outside the borders and your character gets stuck? I thought so. The Pointer Lock API (available to modern browsers) fixes this problem by only allowing clicks and mouse movement within the borders of your game.

## Fullscreen API

## Controls

If you dig through the threeJS examples on their site, you will find lots of references to little plugins to use in your projects. I found one called <a href="https://threejs.org/examples/js/controls/PointerLockControls.js" target="_blank" rel="nofollow">PointerLockControls.js</a> that worked nicely with my game. It doesn't use the Pointer Lock API described above, but the controls are usually associated with it. A better name may have been "First Person Controls."

## Data Structures

At IndieCade last year, I heard a talk by <a href="http://www.galaxykate.com/" target="_blank" rel="nofollow">Galaxy Kate</a> about procedural programming and procedurally generated games. She emphasized using data structures instead of "if statements." The `platforms` array is a good example of this.

## Materials

To give the coins in my game a shiny metal look, I used a MeshPhongMaterial with an environment map or envmap. An environment map is 6 images that represent the environment to create the illusion that the material is reflecting its surroundings.

## Collisions

Collisions can be costly in terms of performance. To keep things simple, I considered the camera to be a single point and platforms and ropes to be boxes.

## Physics

oimo Webworker
spaghetti <img src="{{site.url}}/images/spaghetti.jpg">

## Post Processing

<script src="http://threejs.org/examples/js/shaders/CopyShader.js"></script>
<script src="http://threejs.org/examples/js/shaders/DotScreenShader.js"></script>
<script src="http://threejs.org/examples/js/shaders/RGBShiftShader.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/EffectComposer.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/RenderPass.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/MaskPass.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/ShaderPass.js"></script>
<!-- 			// // platforms have static bounding boxes.. need to be generated once?
			// firstBB = new THREE.Box3().setFromObject(firstObject);
			// secondBB = new THREE.Box3().setFromObject(secondObject);
			// var collision = firstBB.isIntersectionBox(secondBB);
	// gravity
	// -9.8m/s/s /60/60
	// -0.00272m/f/f
	// -0.00272u/f/f
	// max = -54m/s
	// max = -0.9 u/f
	// jump (TODO: make jump change based on hold length)
	// TODO: stepping off ledge, disable jumping
	// TODO: remove diagonal bug
-->
Made a game...
WASD to move
WA to climb
E to jump

* collisions
* Euler angles
* lighting
* physics
