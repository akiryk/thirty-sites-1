const scrollScripts = {

  init() {
    t``
    // this.watchScrolling();
    this.initScrollMagic();
  },

  initScrollMagic() {

    this.intro = document.getElementById('head1');
    this.startY = utils.getYPosition(this.intro);
    this.clone = document.getElementById('head2');
    this.controller = new ScrollMagic.Controller();

    const controller = this.controller,
          intro = this.intro,
          startY = this.startY,
          clone = this.clone;

    this.top = document.querySelector('.headline--top');
    this.bottom = document.querySelector('.headline--bottom');
    const top = this.top;
    const bottom = this.bottom;

    const duration = .85 * window.innerHeight;

    this.handleEndTitle();

    const headingWrapper = new ScrollMagic.Scene({
      duration: duration,
    })
      .setTween('#head1-wrapper', 1, {rotation: 20})
      .on('update', function(evt){
      })
      .addTo(controller);

    const startTitleTop = new ScrollMagic.Scene({
      duration: duration,
    })
      .setTween(top, 1, {x: 200 })
      .addTo(controller);

    const startTitleBottom = new ScrollMagic.Scene({
      duration: duration,
    })
      .setTween(bottom, 1, {x: -200 })
      .addTo(controller);

    const scaleObj = bgAnimation.displacementFilter.scale;
    const blurTween = TweenMax.to(scaleObj, .85, {x: 25, y: 25, ease: Power1.easeOutIn});

    const copyScene = new ScrollMagic.Scene({
      offset: 300,
    })
      .setTween(blurTween)
      .addTo(controller);

    const firstParagraph = document.querySelector('.para');
    const matrixTween = TweenMax.to(firstParagraph, 1, {transform: 'translate(-3%, 0%) matrix(1,0,0,1,0,0)'});
    const copy = document.querySelector('.copy');
    const paragraphScene = new ScrollMagic.Scene({
      duration: 2000,
      triggerElement: copy,
    })
      .setTween(matrixTween)
      .addTo(controller);

  },

  handleEndTitle() {
    const controller = this.controller;
    const clone = this.clone;
    const startY = this.startY;
    const top = this.top;
    const bottom = this.bottom;

    const endTitle = new ScrollMagic.Scene({
      triggerElement: '#head2',
    })
      .addTo(controller); // assign the scene to the controller

    endTitle.on("update", function (event) {
      // when clone moves past location or original, scroll to top
      const cloneY = clone.getBoundingClientRect().top;
      if (cloneY <= startY){
        TweenMax.set('#head1-wrapper', {rotation: 0});
        TweenMax.set(top, {x: 0});
        TweenMax.set(bottom, {x: 0});
        window.scroll(startY - cloneY,0);
      }
    });

  },
}

const bgAnimation = {

  app: null,

  displacementFilter: null,

  stage: null,

  init({pixiImage}) {

    this.image = pixiImage;

    this.app = new PIXI.Application({
      width: 1200,
      height: 1200,
      transparent: false,
      antialias: false,
    });

    document.getElementById('display').appendChild(this.app.view);

    this.stage = this.app.stage;
    this.loadPixiImage();
  },

  createDisplacementFilter(img){
    this.displacementFilter = new PIXI.filters.DisplacementFilter(img);
    this.displacementFilter.scale.x = 250;
    this.displacementFilter.scale.y = 140;
  },

  loadPixiImage() {
    PIXI.loader
      .add('sprite', this.image)
      .add('filter', 'images/clouds-600.jpg')
      .load(this.setup.bind(this));
  },

  setup(loader, resources){
    const app = this.app;
    const stage = this.stage;

    // Cache stage details
    const centerStageX = app.renderer.screen.width/2;
    const centerStageY = app.renderer.screen.height/2;

    // Images
    const sprite = new PIXI.Sprite(resources.sprite.texture);
    sprite.anchor.set(.5);
    sprite.position.set(centerStageX, centerStageY);
    const filterImg = new PIXI.Sprite(resources.filter.texture);
    filterImg.anchor.set(.5);
    filterImg.position.set(centerStageX, centerStageY);

    const spriteRightBound = centerStageX + sprite.width/2;

    // Filters
    // const disFilter = new filters.DisplacementFilter(filterImg);
    this.createDisplacementFilter(filterImg);
    filterImg.texture.baseTexture.wrapMode=PIXI.WRAP_MODES.REPEAT;

    stage.filters = [this.displacementFilter];

    // Add Images
    stage.addChild(sprite);
    stage.addChild(filterImg);

    app.ticker.add(delta => gameloop(delta));

    function gameloop(delta){
      filterImg.rotation -= .002;
    }

    // Start ScrollMagic
    scrollScripts.init();
  },

}

const utils = {

  /**
   * @description Get the y position of an element
   * @param {element}
   * @return {number} yPos
   */
  getYPosition(el) {
    let yPos = 0;
    while(el) {
      yPos += (el.offsetTop - el.scrollTop + el.clientTop);
      el = el.offsetParent;
    }
    return yPos;
  },

}

bgAnimation.init({pixiImage: 'images/hamp-600.jpg'});
