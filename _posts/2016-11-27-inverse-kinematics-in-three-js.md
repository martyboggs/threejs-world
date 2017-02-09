---
layout: post
title: Inverse Kinematics in three.js
description: Inverse kinematics (or IK) aren't supported by three.js at this time. There are some libraries that can perform calculations in two dimensions, but because these calculations can be expensive, I recommend another way.
example: ex4
author: Marty Boggs
category: Tutorials
tags:
-  advanced
-  animation
---

Inverse kinematics aren't supported by three.js at this time. There are some libraries that
<!--more-->
can perform calculations in two dimensions, but because these calculations can be expensive, I recommend another way.

Use Blender since it supports inverse kinematics in three dimensions, and create animations before exporting to three.js. By doing IK in Blender, you are effectively **baking the inverse kinematics** into the animations to be used later. You won't have the flexibility of dynamic IK, but your animations will be easier to make and look more natural.

<img src="{{site.url}}/images/ik1.jpg" alt="inverse kinematics in three.js">

Until someone builds an IK library for the 3 dimensions in the browser, I'm afraid we'll just have to wait. One good thing about using baked animations though is being able to use three.js's **animation mixer** class which allows you to fade between animations like a DJ fades between tracks.

<a href="https://threejs.org/examples/?q=morph#webgl_animation_skinning_morph" rel="nofollow" target="_blank">Here's an example of a model with IK animations and the mixer class. <i class="fa fa-external-link"></i></a>

<img src="{{site.url}}/images/ik2.jpg" alt="inverse kinematics in three.js">

Update: Here's a promising library from github user glumb. <a href="https://github.com/glumb/kinematics" target="_blank" rel="nofollow">https://github.com/glumb/kinematics <i class="fa fa-external-link"></i></a>