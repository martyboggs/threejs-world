---
layout: post
title: Three.js Game Tutorial&#58; CLIMBER
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
**WASD to move<br>**
**Mouse to look around<br>**
**E to jump or release rope**
<div id="info"></div>
To show how to put together ThreeJS design concepts into **a complete project**, I created a little game called Climber. Click in the box to activate the Pointer Lock API. Now the mouse cursor is hidden and the **mouse movement** controls the angle of the camera. Use the **WASD** keys to move the camera's position around.

Wow! Now you're navigating a 3D world!

Games take forever to make. There are so many things to keep in balance: aesthetics, complexity, engagement, expected gameplay elements, strategy. As you add these things to your game, they make adding more elements all the more complicated.

## Lean Workflow

To prevent myself from starting this project and getting lost before reaching the end, I used principles from the Lean workflow system. To do this, I kept the game as simple as possible focusing only on the most necessary elements. Once I had a beginning, middle and end, I ITERATED new versions of the game adding the harder stuff like physics and sound with each new iteration. First, I added player movement and controls.

## Pointer Lock API

Don't you hate it when you're playing a web game and you accidently click outside the borders and your character gets stuck? I thought so. The Pointer Lock API (available to modern browsers) fixes this problem by only allowing clicks and mouse movement within the borders of your game.

## Controls

If you dig through the threeJS examples on their site, you will find lots of references to little plugins to use in your projects. I found one by mrdoob called <a href="https://threejs.org/examples/js/controls/PointerLockControls.js" target="_blank" rel="nofollow">PointerLockControls.js</a> that worked nicely with my game. It's a little confusing because the PointerLockControls.js script doesn't include the Pointer Lock API. You'll have to include it yourself in a click event for example.

```javascript
var controls = new THREE.PointerLockControls(camera);
var player = controls.getObject();
scene.add(player);
```

That covers mouse control. Now, I need keyboard controls. For keyboard, I used a plugin by Jerome Etienne <a href="https://github.com/jeromeetienne/threex.keyboardstate" target="_blank" rel="nofollow">THREEx.KeyboardState.js</a>

```javascript
var keyboard = new THREEx.KeyboardState();
```

## Data Structures

At IndieCade last year, I heard a talk by <a href="http://www.galaxykate.com/" target="_blank" rel="nofollow">Galaxy Kate</a> about procedural programming and procedurally generated games. She emphasized using data structures instead of "if statements." The `platforms` array is a good example of this.

```javascript
// set up objects
var platforms = [
	{x: 5.5,  y: 0,   z: 1,    rope: 0,   width: 5,  depth: 10}, // just above ground level
	{x: 8.5,  y: 10,  z: -8.5, rope: 0,   width: 4,  depth: 3}, // isolated
	{x: 5,    y: 19,  z: 8,    rope: 15,  width: 4,  depth: 4},
	// ...
];
```

## Materials

To give the coins in my game a shiny metal look, I used a MeshPhongMaterial with an environment map or envmap. An environment map is 6 images that represent the environment to create the illusion that the material is reflecting its surroundings.

```javascript
var coinMaterial = new THREE.MeshPhongMaterial({color: 'gold', specular: 'white', shininess: 100, envMap: coinBg, reflectivity: 0.2, combine: THREE.MixOperation});
```

## Collisions

Collisions can be costly in terms of performance. To keep things simple, I considered the camera to be a single point and platforms and ropes to be boxes.

## Physics

To make the ropes swing around, I used <a href="https://github.com/lo-th/Oimo.js/" target="_blank" rel="nofollow">Oimo.js</a>, a physics library ported from ActionScript by loth. I used the webworker example which allows the expensive physics calculations to be done in a new thread. At first the rope segments were flying all over the place. It took some practice to get the mesh objects their associated physics bodies aligned.

<img src="{{site.url}}/images/spaghetti.jpg">

## Post Processing

I played a little with AlteredQualia's postprocessing <a href="http://threejs.org/examples/js/postprocessing/EffectComposer.js" target="_blank" rel="nofollow">EffectComposer</a>. The RGBShiftShader splits the colors a little when you land, creating a glitch effect.

<script src="http://threejs.org/examples/js/shaders/CopyShader.js"></script>
<script src="http://threejs.org/examples/js/shaders/DotScreenShader.js"></script>
<script src="http://threejs.org/examples/js/shaders/RGBShiftShader.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/EffectComposer.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/RenderPass.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/MaskPass.js"></script>
<script src="http://threejs.org/examples/js/postprocessing/ShaderPass.js"></script>
<script src="{{site.url}}/js/lib/PointerLockControls.js"></script>
