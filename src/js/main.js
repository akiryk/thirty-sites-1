// TODO: use promises or some other better way to handle how initScrollMagic
// is called. Right now, it's done in the Pixi setup method.
(function() {

  // Constants
  const FILTERX     = 250,
        FILTERY     = 140,
        APPWIDTH    = 1200,
        APPHEIGHT   = 1200,
        APPBGCOLOR  = 0x000000;

  const removeLoader = () => {
    document.body.classList.add('ready');
    console.log('no, right')
  }

  const App = {
    pixiApp: null,
    displacementFilter: null,
    pixiImage: 'images/skater-1024.jpg',
    displacementImage: 'images/clouds-1024.jpg',

    init() {
      this.createPixiApp();
      this.loadPixiImage();
    },

    createPixiApp() {
      this.pixiApp = new PIXI.Application({
        width: APPWIDTH,
        height: APPHEIGHT,
        backgroundColor : APPBGCOLOR,
        transparent: false,
        antialias: false,
      });
      document.getElementById('pixiContainer').appendChild(this.pixiApp.view);
    },

    /**
     * Load images for Pixi animations
     * Keep a reference to this.pixiImage for later manipulations
     */
    loadPixiImage() {
      PIXI.loader
        .add('mainPic', this.pixiImage)
        .add('clouds', this.displacementImage)
        .load(this.setup.bind(this));
    },

    /**
     * Setup is a callback function from PIXI's load method and
     * it fires once images are ready to handle.
     */
    setup(loader, resources){
      // Fade out the loader animation
      removeLoader();

      // Cache some references
      const app = this.pixiApp;
      const stage = this.pixiApp.stage;

      // Cache stage details
      const centerStageX = app.renderer.screen.width/2;
      const centerStageY = app.renderer.screen.height/2;

      // Make sprites from images
      const mainPic = new PIXI.Sprite(resources.mainPic.texture);
      const clouds = new PIXI.Sprite(resources.clouds.texture);

      // Center sprite origins
      mainPic.anchor.set(.5);
      clouds.anchor.set(.5);
      mainPic.position.set(centerStageX, centerStageY);
      clouds.position.set(centerStageX, centerStageY);

      // Make Filters
      this.addDisplacementFilter(clouds);

      // Add Images
      stage.addChild(mainPic);
      stage.addChild(clouds);

      this.startPixiLoop(clouds);
      this.initScrollMagic();
    },

    startPixiLoop(sprite) {
      // Displacement map animation loop
      this.pixiApp.ticker.add(delta => gameloop(delta));

      function gameloop(delta){
        sprite.rotation -= .002;
      }
    },

    addDisplacementFilter(img) {
      this.displacementFilter = new PIXI.filters.DisplacementFilter(img);
      this.displacementFilter.scale.x = FILTERX;
      this.displacementFilter.scale.y = FILTERY;
      this.pixiApp.stage.filters = [this.displacementFilter];
    },

    initScrollMagic() {
      this.makeController();
      this.makeHeaderScenes();
      this.makeEndScene();
      this.makeParagraphScenes();
      this.makeDisplacementAnimationScene();
    },

    makeController() {
      this.controller = new ScrollMagic.Controller();
    },

    makeEndScene() {
      const controller = this.controller;
      const top = document.getElementById('introHeadClone').querySelector('.end-headline--top');
      const bottom = document.getElementById('introHeadClone').querySelector('.end-headline--bottom');
      const outro = document.querySelector('.intro--clone');
      const topTween = TweenLite.from(top, 1, {x: -300});
      const bottomTween = TweenLite.from(bottom, 1, {x: 60});
      const duration = .6 * window.innerHeight;

      TweenLite.set('#introHeadClone', {rotation: -20});

      new ScrollMagic.Scene({
        duration: duration,
        triggerElement: outro,
        triggerHook: .4,
      })
        .setTween('#introHeadClone', 1, {rotation: 0})
        .on('end', (e) => {
          outro.classList.toggle('active');
        })
        .addTo(controller);

      new ScrollMagic.Scene({
        duration: duration,
        triggerElement: outro,
        triggerHook: .4,
      })
        .setTween(topTween)
        .addTo(controller);

     new ScrollMagic.Scene({
        duration: duration,
        triggerElement: outro,
        triggerHook: .4,
      })
        .setTween(bottomTween)
        .addTo(controller);
    },

    makeHeaderScenes() {
      const intro = document.getElementById('introHead');
      const top = document.querySelector('.headline--top');
      const bottom = document.querySelector('.headline--bottom');
      const duration = .85 * window.innerHeight;
      const controller = this.controller;

      new ScrollMagic.Scene({ duration: duration })
        .setTween(intro, 1, {rotation: 20})
        .addTo(controller);

      new ScrollMagic.Scene({ duration: duration })
        .setTween(top, 1, {x: 200 })
        .addTo(controller);

      new ScrollMagic.Scene({ duration: duration })
        .setTween(bottom, 1, {x: -200 })
        .addTo(controller);
    },

    makeParagraphScenes() {
      const paras = Array.from(document.querySelectorAll('.para'));
      const controller = this.controller;

      paras.forEach(para => {
        const tween = TweenLite.to(para, 1, {transform: 'matrix(.98, -.075, .075, .98, 0, 0)'});
        const scene = new ScrollMagic.Scene({
          duration: '150%',
          triggerHook: 'onEnter',
          triggerElement: para,
        })
          .setTween(tween)
          .addTo(controller);
      })
    },

    makeDisplacementAnimationScene() {
      const scaleObj = this.displacementFilter.scale;
      const distortionTween = TweenMax.to(scaleObj, .85, {x: 0, y: 0});
      const controller = this.controller;
      const clone = document.getElementById('introHeadClone');

      new ScrollMagic.Scene({
        offset: 300,
        duration: '100%',
      })
        .setTween(distortionTween)
        .addTo(controller);

      new ScrollMagic.Scene({
        triggerElement: clone,
        triggerHook: 'onEnter',
        duration: '100%',
      })
        .setTween(TweenLite.to(scaleObj, 1, {x: FILTERX, y: FILTERY}))
        .addTo(controller);
    },

  }

  App.init();

})();
