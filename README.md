# Site 1 of 30

This site emulates [xtian.design](http://xtian.design/) for the purpose of learning how it achieves certain effects.

For [testing](https://akiryk.github.io/thirty-sites-1/index.html)

## PIXI

### PIXI.Application tips
https://github.com/pixijs/pixi.js/blob/dev/src/core/Application.js
Width and height are properties of Application.renderer.screen, not stage (below)
Making an app calls autoDetectRenderer and checks for WebGL or canvas.
App.view is the canvas area. It is a shortcut to PIXI.Application.renderer.view
 * Application.stage = new Container(); // from PIXI.Application
 * https://github.com/pixijs/pixi.js/blob/dev/src/core/display/Container.js
 * stage.width will be width of widest sprite added.

The PIXI loader comes from https://github.com/englercj/resource-loader