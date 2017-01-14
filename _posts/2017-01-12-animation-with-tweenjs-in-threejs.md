---
layout: post
title: Animation with Tween.js in three.js
description: Tween.js really is a great tool to use with three.js. It keeps an array of the tweens that are running and discards them when they are complete.
example: ex9
author: Marty Boggs
category: Tutorials
tags:
-  beginner
-  animation
---

Saw this article on medium and I remembered I need to write about animation.

<a href="https://medium.com/@lachlantweedie/animation-in-three-js-using-tween-js-with-examples" target="_blank" rel="nofollow">via Animation in Three.js using Tween.js with examples <i class="fa fa-external-link"></i></a>

>Why Tween.js?
>Tween.js animates within the Three.js render loop. This improves overall performance of your WebGL application and helps keep a high frame rate.
>It’s also good practice to never create new variables outside your init function (or however you initialise your project). Try to create all your target positions/rotations/scales at the start and reference them later on.
>Another thing aim for is to not modify your variables outside the render loop. For example, if the user triggers an event to rotate a mesh 90 degrees, set a variable which the mesh will update to within the render loop. An alternative solution could be to use the below animation function with a duration of 0 seconds.
>To use the examples below you’ll need to include and setup Tween.js in your project which you can find here: https://github.com/tweenjs/tween.js/

Tween.js really is a great tool to use with three.js. It keeps an array of the tweens that are running and discards them when they are complete.

Very complex animations are possible thanks to the implementation. Tween any property: position, rotation scale, objects, cameras, lights... Choose from many easing functions including your favorite wacky ones. I'm looking at you, bounce!

## Make a Tween

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

**Relative tweens** can be performed by making the destination a string with units. '+10' will move 10 pixels from its current position and stop. Repeats will start from this position and move ANOTHER 10 pixels. **Gravy!**

To do more than one tween, use the onComplete to start a new tween or use an **array in the destination object**. How Tween.js moves between these tweens can be customized too.

Now get out there and move something, show me whatcha made! Cheese! I mean, Cheers!

