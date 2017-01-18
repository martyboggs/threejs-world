---
layout: post
title: Euler Angles and Rotating Objects on Local and Global Axes
description:
example: ex11
author: Marty Boggs
category: Tutorials
published: false
guest: true
tags:
-  shadows
-  featured
---
Here are my suggested "rules" for how you deal with eularAngles in this situation:

Never read eulerAngles. Consider them write-only.

Keep your own Vector3 that represents the current rotation.

Never assign to an individual eulerAngles component (like eulerAngles.y). Always assign a Vector3 to eulerAngles.
