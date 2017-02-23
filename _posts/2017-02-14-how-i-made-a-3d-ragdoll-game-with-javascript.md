---
layout: post
title: How I Made a 3D Ragdoll Game with JavaScript
description: birds
example: ex11
author: Marty Boggs
category: Tutorials
tags:
-  advanced
-  physics
-  featured
-  sound
-  lighting
-  shadows
---
<div id="info"></div>
Like most people, I love animated violence. It feels good to break things or knock them over. Maybe it's to assert our dominance. Maybe it's to destroy the weak making way for the strong. I don't know, but here's how I programmed a bird.

## Building It

Keeping in mind the challenges I dealt with for Climber, I had the idea to build a fun, physics based game that would work on mobile and possibly in VR. First, I build the bird with primitive objects: a sphere for the head, cylinders for the eyes, cones for the beak and boxes for the body and wings. This saved me from having to work with Blender or other modeling tool. I noticed three.js has extrude and bevel methods, so I could create more complex shapes in the future.

To make sure eyes stay in the head and wings stay attached to the body I used an elaborate system of nested anchoring `Object3D()`s to group parts together. These groups made it easy to rotate around their centers rather than the world center, but they may have created some overhead as well.

## Tween.js wings

To create the animation for the wings getting folded in, I used Tween.js. The animations begin when the bird starts to land and get deleted if the bird falls or begins to take off.

## Taming the Bird

I didn't realize how complicated the physics of birds flying is until I tried orienting my bird correctly. With little movements of their wings against the force of the wind resistance, birds can control their speed and direction with ease. Since my bird lives in a vacuum, however, I can't use these forces and have to fake it.

Just controlling the bird's roll (z-axis rotation) was a challenge. I added a constant impulse to an anchor point on its belly. It works, but gives the bird a wobbly movement.

```javascript
// make bird upright
birdUpright.position.copy(bird.position);
birdUpright.rotation.copy(bird.rotation);
birdUpright.translateOnAxis(tmpVec.set(0, 1, 0), -10);
bodies[0].applyImpulse(birdUpright.position, {x: 0, y: -100, z: 0});
```

I liked the way the camera follows the bird using the `lookat()` function. This means that the controls need to change with the direction of the camera. I opted for a polar coordinate system for movement where `up` will move the bird away from the camera and `down` will move it toward the camera. To get the proper camera "yaw" I changed its rotation order to `YXZ`.

```javascript
camera.rotation.order = 'YXZ';
```

I knew I wanted mobile buttons, so I added some simple ones to the screen with click events-- it didn't work. I needed `touchstart` and `touchend` events. So I wrote a little library to help with adding on-screen buttons with touch support and Fullscreen API integration. Check it out here: [flexbox-mobile-buttons.js](https://github.com/martyboggs/flexbox-mobile-buttons).


Physics

worker
oimo
new version
collisions with world.checkContact()
compound objects
keeping upright translateOnAxis
performance

positional audio

loth's pooling audio
