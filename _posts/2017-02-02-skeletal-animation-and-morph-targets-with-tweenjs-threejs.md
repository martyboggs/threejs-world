---
layout: post
title: Skeletal Animation and Morph Targets with Tween.js and Three.js
description: Tween.js really is a great tool to use with three.js. It keeps an array of the tweens that are running and discards them when they are complete.
example: ex9
author: Marty Boggs
category: Tutorials
tags:
-  animation
-  advanced
---

If you're reading this article, you're probably interested in animating a mesh by using either morph targets or skeletal animations. These kinds of animations move the vertices of a model. I'll also go over how to use Tween.js which is useful for animating a single object such as a model in a scene.

>What's basically being discussed is **morph targets** vs **skeletal animation**.<br><br>
>Key-framing is a completely different concept, which can be used with almost every form of animation, including both of the above (both of the above can also be used without key-framing)...<br><br>
>In a general sense, morph-targets require more memory, whereas skeletal requires more computation power.<br><br>
>Skeletal animation can be extended to use the "Skinning" technique - which is where each vertex can be attached to more than one bone to get more natural movements around joint areas.
>Skinning only became really popular once vertex shaders came on the scene and gave us that level of computation power.<br><br>
>Most things can be animated via either, but fairly rigid objects (like skeletons) work well with skinning, while fairly soft objects (like faces) work well with morph-targets.
>Modern games often use both techniques at the same time (e.g. morphing a character's face, while also using a skeleton for their body).<br><br>
**-Hodgman**<br>
**Moderator for gamedev.net**

## Morph Targets

Morph target animations are more simple than skeletal animations. They basically just describe positions of vertices for each keyframe and let the rendering software tween between them.

## Skeletal Animation

Skeletal animation is great for exactly what you would think: objects with skeletons. That includes people walking, cats meowing, robots working, snakes a-slithering, octopi a-swimming, tails a-wagging and anything else with a skeleton-like structure.

If a model has a skeleton, we call it a "rigged" model. A powerful feature of many modeling programs called inverse kinematics can be used with rigged models that calculates realistic movement of a chain of bones. You can read about <a href="{{site.url}}/tutorials/inverse-kinematics-in-three-js">inverse kinematics</a> for more on that.

## Tween.js

Tween.js really is a great tool to use with three.js. It keeps an array of the tweens that are running and discards them when they are complete.

Very complex animations are possible thanks to the implementation. Tween any property: position, rotation scale, objects, cameras, lights... Choose from many easing functions including your favorite wacky ones. I'm looking at you, bounce!

<a href="https://tweenjs.github.io/tween.js/examples/03_graphs.html" target="_blank" rel="nofollow">More easing functions</a>

**Making a Tween**

```javascript
//              tween property    destination  duration(ms)
new TWEEN.Tween(mesh.position).to(   {x: 5},   1000   )
	.delay(100)
	.repeat(Infinity)
	.easing(TWEEN.Easing.Sinusoidal.In)
	.start();
```

Real men use sinusoidal easing. You can quote me on that.

Don't forget to add TWEEN.update() to your render() function.

```javascript
// put TWEEN.update() in your render function... like so

function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
	TWEEN.update();
}
render();
```

As you can see it's very easy to **chain your options** and create a tween in a single line of code!

**Delay** your tween or **repeat** it. There are also callbacks: **onUpdate** and **onComplete** at your disposal.

**Relative tweens** can be performed by making the destination a string with + or -. '+10' will move the object 10 pixels from its current position and stop. Repeats will start from this position and move ANOTHER 10 pixels. **Gravy!**

To do more than one tween, use the onComplete to start a new tween or use an **array in the destination object**. How Tween.js moves between these tweens can be customized too.

One limitation of Tween.js is that sequences of animation can send your code to callback hell. See the pyramid shape the code starts to make? If this is a problem, you should try using Greensock's <a href="https://greensock.com/tweenmax" target="_blank" rel="nofollow">TweenMax <i class="fa fa-external-link"></i></a> instead.

```javascript
new TWEEN.Tween(mesh1.position).to({x: [-0.5, -2]}, 1000).easing(TWEEN.Easing.Quadratic.InOut).delay(3000).start();
new TWEEN.Tween(mesh2.position).to({x: [0.5, -1]}, 1000).easing(TWEEN.Easing.Quadratic.InOut).delay(3250).start();
new TWEEN.Tween(mesh3.position).to({x: [1.5, 0]}, 1000).easing(TWEEN.Easing.Quadratic.InOut).delay(3500).start();
new TWEEN.Tween(mesh3.position).to({}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(3500).onComplete(function () {
	new TWEEN.Tween(mesh3.position).to({x: [-0, 1]}, 1000).easing(TWEEN.Easing.Elastic.Out).delay(250).start();
	new TWEEN.Tween(mesh2.position).to({x: [-1, 0]}, 1000).easing(TWEEN.Easing.Elastic.InOut).delay(500).start();
	new TWEEN.Tween(mesh1.position).to({x: [-2, -1]}, 1000).easing(TWEEN.Easing.Elastic.InOut).delay(750).start();
	new TWEEN.Tween(group1.position).to({}, 1000).easing(TWEEN.Easing.Quintic.InOut).delay(750).onComplete(function () {
		new TWEEN.Tween(mesh3.position).to({y: '-1'}, 1000).easing(TWEEN.Easing.Bounce.Out).start();
		new TWEEN.Tween(mesh2.position).to({y: '-1'}, 1000).easing(TWEEN.Easing.Bounce.Out).start();
		new TWEEN.Tween(mesh1.position).to({y: '-1'}, 1000).easing(TWEEN.Easing.Bounce.Out).start();
		new TWEEN.Tween(group1.position).to({}, 1000).easing(TWEEN.Easing.Quintic.InOut).onComplete(function () {
			new TWEEN.Tween(mesh3.position).to({y: '+1'}, 2000).easing(TWEEN.Easing.Sinusoidal.Out).start();
			new TWEEN.Tween(mesh2.position).to({y: '+1'}, 2000).easing(TWEEN.Easing.Sinusoidal.Out).start();
			new TWEEN.Tween(mesh1.position).to({y: '+1'}, 2000).easing(TWEEN.Easing.Sinusoidal.Out).start();
			new TWEEN.Tween(group1.rotation).to({z: '-6.282'}, 2500).easing(TWEEN.Easing.Sinusoidal.InOut).start();
			new TWEEN.Tween(group1.rotation).to({x: '-6.282'}, 1200).easing(TWEEN.Easing.Linear.None).onComplete(function () {
				new TWEEN.Tween(group1.position).to({z: '1.5'}, 700).easing(TWEEN.Easing.Quadratic.Out).onComplete(function () {
					new TWEEN.Tween(group1.position).to({z: '-1.5'}, 700).easing(TWEEN.Easing.Quadratic.In).start();
				}).start();
			}).start();
		}).start();
	}).start();
}).start();
```
