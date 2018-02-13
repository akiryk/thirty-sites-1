"use strict";({pixiApp:null,displacementFilter:null,pixiImage:"images/skater-1024.jpg",displacementImage:"images/clouds-1024.jpg",init:function(){this.createPixiApp(),this.loadPixiImage()},createPixiApp:function(){this.pixiApp=new PIXI.Application({width:1200,height:1200,backgroundColor:0,transparent:!1,antialias:!1}),document.getElementById("pixiContainer").appendChild(this.pixiApp.view)},loadPixiImage:function(){PIXI.loader.add("mainPic",this.pixiImage).add("clouds",this.displacementImage).load(this.setup.bind(this))},setup:function(e,t){document.body.classList.add("ready"),console.log("no, right");var i=this.pixiApp,n=this.pixiApp.stage,o=i.renderer.screen.width/2,r=i.renderer.screen.height/2,a=new PIXI.Sprite(t.mainPic.texture),l=new PIXI.Sprite(t.clouds.texture);a.anchor.set(.5),l.anchor.set(.5),a.position.set(o,r),l.position.set(o,r),this.addDisplacementFilter(l),n.addChild(a),n.addChild(l),this.startPixiLoop(l),this.initScrollMagic()},startPixiLoop:function(e){this.pixiApp.ticker.add(function(t){e.rotation-=.002})},addDisplacementFilter:function(e){this.displacementFilter=new PIXI.filters.DisplacementFilter(e),this.displacementFilter.scale.x=250,this.displacementFilter.scale.y=140,this.pixiApp.stage.filters=[this.displacementFilter]},initScrollMagic:function(){this.makeController(),this.makeHeaderScenes(),this.makeEndScene(),this.makeParagraphScenes(),this.makeDisplacementAnimationScene()},makeController:function(){this.controller=new ScrollMagic.Controller},makeEndScene:function(){var e=this.controller,t=document.getElementById("introHeadClone").querySelector(".end-headline--top"),i=document.getElementById("introHeadClone").querySelector(".end-headline--bottom"),n=document.querySelector(".intro--clone"),o=TweenLite.from(t,1,{x:-300}),r=TweenLite.from(i,1,{x:60}),a=.6*window.innerHeight;TweenLite.set("#introHeadClone",{rotation:-20}),new ScrollMagic.Scene({duration:a,triggerElement:n,triggerHook:.4}).setTween("#introHeadClone",1,{rotation:0}).on("end",function(e){n.classList.toggle("active")}).addTo(e),new ScrollMagic.Scene({duration:a,triggerElement:n,triggerHook:.4}).setTween(o).addTo(e),new ScrollMagic.Scene({duration:a,triggerElement:n,triggerHook:.4}).setTween(r).addTo(e)},makeHeaderScenes:function(){var e=document.getElementById("introHead"),t=document.querySelector(".headline--top"),i=document.querySelector(".headline--bottom"),n=.85*window.innerHeight,o=this.controller;new ScrollMagic.Scene({duration:n}).setTween(e,1,{rotation:20}).addTo(o),new ScrollMagic.Scene({duration:n}).setTween(t,1,{x:200}).addTo(o),new ScrollMagic.Scene({duration:n}).setTween(i,1,{x:-200}).addTo(o)},makeParagraphScenes:function(){var e=Array.from(document.querySelectorAll(".para")),t=this.controller;e.forEach(function(e){var i=TweenLite.to(e,1,{transform:"matrix(.98, -.075, .075, .98, 0, 0)"});new ScrollMagic.Scene({duration:"150%",triggerHook:"onEnter",triggerElement:e}).setTween(i).addTo(t)})},makeDisplacementAnimationScene:function(){var e=this.displacementFilter.scale,t=TweenMax.to(e,.85,{x:0,y:0}),i=this.controller,n=document.getElementById("introHeadClone");new ScrollMagic.Scene({offset:300,duration:"100%"}).setTween(t).addTo(i),new ScrollMagic.Scene({triggerElement:n,triggerHook:"onEnter",duration:"100%"}).setTween(TweenLite.to(e,1,{x:250,y:140})).addTo(i)}}).init();
//# sourceMappingURL=bundle.js.map
