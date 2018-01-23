'use strict';

var app = {

  displacementFilter: null,

  init: function init(_ref) {
    var pixiImage = _ref.pixiImage;

    this.scrollContent = document.querySelector('.scroll-content');
    this.initPixi({ pixiImage: pixiImage });
    // this.watchScrolling();
    // this.initScrollMagic();
  },
  createDisplacementFilter: function createDisplacementFilter(filters, img) {
    this.displacementFilter = new filters.DisplacementFilter(img);
    this.displacementFilter.scale.x = 250;
    this.displacementFilter.scale.y = 140;
  },
  initPixi: function initPixi(_ref2) {
    var pixiImage = _ref2.pixiImage;


    var img = pixiImage;

    //Aliases
    var Sprite = PIXI.Sprite,
        filters = PIXI.filters;

    /**
     * PIXI.Application
     * https://github.com/pixijs/pixi.js/blob/dev/src/core/Application.js
     * Width and height are properties of Application.renderer.screen, not stage (below)
     * Making an app calls autoDetectRenderer and checks for WebGL or canvas.
     */
    var app = new PIXI.Application({
      // backgroundColor: 0xff0033,
      width: 1200,
      height: 1200,
      transparent: false,
      antialias: false
    });

    /**
     * App.view is the canvas area. It is a shortcut to PIXI.Application.renderer.view
     *
     */
    document.getElementById('display').appendChild(app.view);

    /**
     * Application.stage = new Container(); // from PIXI.Application
     * https://github.com/pixijs/pixi.js/blob/dev/src/core/display/Container.js
     * stage.width will be width of widest sprite added.
     */
    var stage = app.stage;

    /**
     * https://github.com/englercj/resource-loader
     */
    PIXI.loader.add('sprite', img).add('filter', 'images/clouds-600.jpg').load(setup);

    var gameloop = this.gameloop;

    var self = this;

    function setup(loader, resources) {
      // Cache stage details
      var centerStageX = app.renderer.screen.width / 2;
      var centerStageY = app.renderer.screen.height / 2;

      // Images
      var mainSprite = new Sprite(resources.sprite.texture);
      mainSprite.anchor.set(.5);
      mainSprite.position.set(centerStageX, centerStageY);
      var filterImg = new Sprite(resources.filter.texture);
      filterImg.anchor.set(.5);
      filterImg.position.set(centerStageX, centerStageY);

      var spriteRightBound = centerStageX + mainSprite.width / 2;

      // Filters
      // const disFilter = new filters.DisplacementFilter(filterImg);
      self.createDisplacementFilter(filters, filterImg);
      filterImg.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
      var blur = new filters.BlurFilter(160);
      stage.filters = [self.displacementFilter];

      // Add Images
      stage.addChild(mainSprite);
      stage.addChild(filterImg);

      // this.disFilter = disFilter;
      this.filterImg = filterImg;
      app.ticker.add(function (delta) {
        return gameloop(delta);
      });
      var blurDelta = -.5;
      self.initScrollMagic();
    }
  },
  gameloop: function gameloop(delta) {
    this.filterImg.rotation -= .002;

    // if (blur.blur > 200 || blur.blur <= 50) blurDelta *= -1;
    // blur.blur += blurDelta;
    // filterImg.x += xDelta;
    // if(filterImg.x > 800 || filterImg.x < 400){
    //   xDelta *= -1;
    // }
    // filterImg.y -= 1;
  },
  watchScrolling: function watchScrolling() {
    var self = this;
    var myEfficientFn = debounce(function (e) {
      self.getScrollTop();
    }, 100);

    window.addEventListener('scroll', myEfficientFn);

    function debounce(func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
            args = arguments;
        var later = function later() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };
  },
  initScrollMagic: function initScrollMagic() {

    var original = document.getElementById('head1');
    var startY = this.getYPosition(original);
    var clone = document.getElementById('head2');
    var dur = .75 * window.innerHeight;
    var controller = new ScrollMagic.Controller();

    var endTitle = new ScrollMagic.Scene({
      triggerElement: '#head2'
    }).addTo(controller); // assign the scene to the controller

    var top = document.querySelector('.headline--top');
    var bottom = document.querySelector('.headline--bottom');

    endTitle.on("update", function (event) {
      // when clone moves past location or original, scroll to top
      // console.log(clone.getBoundingClientRect().top);
      var cloneY = clone.getBoundingClientRect().top;
      if (cloneY <= startY) {
        TweenMax.set('#head1-wrapper', { rotation: 0 });
        TweenMax.set(top, { x: 0 });
        TweenMax.set(bottom, { x: 0 });
        window.scroll(startY - cloneY, 0);
      }
    });

    var headingWrapper = new ScrollMagic.Scene({
      duration: dur
    }).setTween('#head1-wrapper', 1, { rotation: 20 }).on('update', function (evt) {
      console.log(controller.info("scrollDirection"));
    }).addTo(controller);

    var startTitleTop = new ScrollMagic.Scene({
      duration: dur
    }).setTween(top, 1, { x: 200 }).addTo(controller);

    var startTitleBottom = new ScrollMagic.Scene({
      duration: dur
    }).setTween(bottom, 1, { x: -200 }).addTo(controller);

    var canvasObj = {
      filterScaleX: 140,
      filterScaleY: 50
    };

    var scaleObj = this.displacementFilter.scale;
    var blurTween = TweenMax.to(scaleObj, .85, { x: 25, y: 25, ease: Power1.easeOutIn });

    var copyScene = new ScrollMagic.Scene({
      offset: 500
    }).setTween(blurTween).addTo(controller);

    var firstParagraph = document.querySelector('.para');
    var matrixTween = TweenMax.to(firstParagraph, 1, { transform: 'translate(-3%, 0%) matrix(1,0,0,1,0,0)' });
    var copy = document.querySelector('.copy');
    var paragraphScene = new ScrollMagic.Scene({
      duration: 2000,
      triggerElement: copy
    }).setTween(matrixTween).addTo(controller);
  },
  getYPosition: function getYPosition(el) {
    var yPos = 0;
    while (el) {
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
      el = el.offsetParent;
    }

    return yPos;
  }
};

app.init({ pixiImage: 'images/hamp-600.jpg' });