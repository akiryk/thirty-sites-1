'use strict';

var scrollScripts = {
  init: function init() {
    this.scrollContent = document.querySelector('.scroll-content');
    // this.watchScrolling();
    this.initScrollMagic();
  },
  initScrollMagic: function initScrollMagic() {

    this.intro = document.getElementById('head1');
    this.startY = utils.getYPosition(this.intro);
    this.clone = document.getElementById('head2');
    this.controller = new ScrollMagic.Controller();

    var controller = this.controller,
        intro = this.intro,
        startY = this.startY,
        clone = this.clone;

    this.top = document.querySelector('.headline--top');
    this.bottom = document.querySelector('.headline--bottom');
    var top = this.top;
    var bottom = this.bottom;

    var duration = .85 * window.innerHeight;

    this.handleEndTitle();

    var headingWrapper = new ScrollMagic.Scene({
      duration: duration
    }).setTween('#head1-wrapper', 1, { rotation: 20 }).on('update', function (evt) {}).addTo(controller);

    var startTitleTop = new ScrollMagic.Scene({
      duration: duration
    }).setTween(top, 1, { x: 200 }).addTo(controller);

    var startTitleBottom = new ScrollMagic.Scene({
      duration: duration
    }).setTween(bottom, 1, { x: -200 }).addTo(controller);

    var scaleObj = bgAnimation.displacementFilter.scale;
    var blurTween = TweenMax.to(scaleObj, .85, { x: 25, y: 25, ease: Power1.easeOutIn });

    var copyScene = new ScrollMagic.Scene({
      offset: 300
    }).setTween(blurTween).addTo(controller);

    var firstParagraph = document.querySelector('.para');
    var matrixTween = TweenMax.to(firstParagraph, 1, { transform: 'translate(-3%, 0%) matrix(1,0,0,1,0,0)' });
    var copy = document.querySelector('.copy');
    var paragraphScene = new ScrollMagic.Scene({
      duration: 2000,
      triggerElement: copy
    }).setTween(matrixTween).addTo(controller);
  },
  handleEndTitle: function handleEndTitle() {
    var controller = this.controller;
    var clone = this.clone;
    var startY = this.startY;
    var top = this.top;
    var bottom = this.bottom;

    var endTitle = new ScrollMagic.Scene({
      triggerElement: '#head2'
    }).addTo(controller); // assign the scene to the controller

    endTitle.on("update", function (event) {
      // when clone moves past location or original, scroll to top
      var cloneY = clone.getBoundingClientRect().top;
      if (cloneY <= startY) {
        TweenMax.set('#head1-wrapper', { rotation: 0 });
        TweenMax.set(top, { x: 0 });
        TweenMax.set(bottom, { x: 0 });
        window.scroll(startY - cloneY, 0);
      }
    });
  }
};

var bgAnimation = {

  app: null,

  displacementFilter: null,

  stage: null,

  init: function init(_ref) {
    var pixiImage = _ref.pixiImage;


    this.image = pixiImage;

    this.app = new PIXI.Application({
      width: 1200,
      height: 1200,
      transparent: false,
      antialias: false
    });

    document.getElementById('display').appendChild(this.app.view);

    this.stage = this.app.stage;
    this.loadPixiImage();
  },
  createDisplacementFilter: function createDisplacementFilter(img) {
    this.displacementFilter = new PIXI.filters.DisplacementFilter(img);
    this.displacementFilter.scale.x = 250;
    this.displacementFilter.scale.y = 140;
  },
  loadPixiImage: function loadPixiImage() {
    PIXI.loader.add('sprite', this.image).add('filter', 'images/clouds-600.jpg').load(this.setup.bind(this));
  },
  setup: function setup(loader, resources) {
    var app = this.app;
    var stage = this.stage;

    // Cache stage details
    var centerStageX = app.renderer.screen.width / 2;
    var centerStageY = app.renderer.screen.height / 2;

    // Images
    var mainSprite = new PIXI.Sprite(resources.sprite.texture);
    mainSprite.anchor.set(.5);
    mainSprite.position.set(centerStageX, centerStageY);
    var filterImg = new PIXI.Sprite(resources.filter.texture);
    filterImg.anchor.set(.5);
    filterImg.position.set(centerStageX, centerStageY);

    var spriteRightBound = centerStageX + mainSprite.width / 2;

    // Filters
    // const disFilter = new filters.DisplacementFilter(filterImg);
    this.createDisplacementFilter(filterImg);
    filterImg.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;

    stage.filters = [this.displacementFilter];

    // Add Images
    stage.addChild(mainSprite);
    stage.addChild(filterImg);

    app.ticker.add(function (delta) {
      return gameloop(delta);
    });

    function gameloop(delta) {
      filterImg.rotation -= .002;
    }

    // Start ScrollMagic
    scrollScripts.init();
  }
};

var utils = {

  /**
   * @description Get the y position of an element
   * @param {element}
   * @return {number} yPos
   */
  getYPosition: function getYPosition(el) {
    var yPos = 0;
    while (el) {
      yPos += el.offsetTop - el.scrollTop + el.clientTop;
      el = el.offsetParent;
    }
    return yPos;
  }
};

bgAnimation.init({ pixiImage: 'images/hamp-600.jpg' });
//# sourceMappingURL=main.js.map
