---
layout: post
title: Casting Shadows and Casting Light in three.js
description: Casting shadows is a little tricky in WebGL because the rendering can become expensive. To cast shadows, you need to choose `DirectionalLight` or `SpotLight` and enable the renderer, light and objects.
example: ex11
author: Marty Boggs
category: Tutorials
guest: true
tags:
-  shadows
-  featured
---
Casting shadows is a little tricky in WebGL because the rendering can become expensive. To cast shadows, you need to choose `DirectionalLight` or `SpotLight` and enable the renderer, light and objects. <!--more-->
Here's a great article on lights, cameras and casting shadows from CJ Gammon:

>Lights can really make the difference between a seemingly flat scene and a visual masterpiece. Think of any photo-realistic painting or photograph and then imagine it with poor lighting and the impact is just not the same. Cameras change the way we view our scenes altogether, think of the different types of lenses photographers use and how they can influence the perspective and depth of a photo. Lights do not work on all materials. Lights do work with MeshLambertMaterial, MeshPhongMaterial and MeshStandardMaterial.

via <a href="http://blog.cjgammon.com/threejs-lights-cameras" target="_blank" rel="nofollow">Three.js Lights and Cameras</a>
