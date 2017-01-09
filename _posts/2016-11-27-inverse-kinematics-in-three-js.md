---
layout: post
title: Inverse Kinematics in three.js
example: ex4
author: Marty Boggs
category: Tutorials
tags:
-  advanced
-  featured
---

Inverse kinematics aren't supported by three.js at this time. There are some libraries that
<!--more-->
can perform calculations in two dimensions, but because these calculations can be expensive, I recommend another way.

Use Blender since it supports inverse kinematics in three dimensions, and create animations before exporting to three.js. This will eliminate the need to perform expensive inverse kinematics calculations in the browser, plus, three.js's animation mixer class will allow you to fade between animations like a DJ fades between tracks. This is a better workflow.

<!-- To get started, we'll use this <a href="/threejs-world-blank-template.html" download="threejs-world-{{page.example}}.html">basic template <i class="fa fa-download"></i></a> that I use in a lot of posts. Open the template to follow along. -->
