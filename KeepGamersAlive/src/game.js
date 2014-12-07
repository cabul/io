var gui = require('./debug');
var tween = require('tween');
var pixi = require('pixi');
var Keydoc = require('./keydoc');
var Animation = require('./animation');

var stage = new pixi.Stage(0x66ff44);
var renderer,quit;

module.exports = {

assets: [
'img/background.png',
'img/left_arm.png',
'img/right_arm.png'
],

oninit: function(context) {
  renderer = context.renderer;
  quit = context.quit;

  var background = pixi.Sprite.fromImage('img/background.png');

  background.anchor.x = 0;
  background.anchor.y = 0;
  background.position.x = 0;
  background.position.y = 0;

  // var pixelateFilter = new pixi.PixelateFilter();
  // var pixelateFolder = gui.addFolder('Pixelate');
  // pixelateFolder.add(pixelateFilter.size,'x',1,32).name('PixelSizeX');
  // pixelateFolder.add(pixelateFilter.size,'y',1,32).name('PixelSizeY');
  //
  // var container = new pixi.DisplayObjectContainer();
  // container.filters = [ pixelateFilter ];
  //
  // container.addChild(background);
  // stage.addChild(container);

  stage.addChild(background);

  var leftArm = pixi.Sprite.fromImage('img/left_arm.png');
  leftArm.anchor.x = 0.5;
  leftArm.anchor.y = 1;

  var rightArm = pixi.Sprite.fromImage('img/right_arm.png');
  rightArm.anchor.x = 0.5;
  rightArm.anchor.y = 1;

  var rotation = {
    left: 0,
    right: 0
  };

  var leftSheet = Animation.loadAll(leftArm,require('./animations/leftarm'));
  var rightSheet = Animation.loadAll(rightArm,require('./animations/rightarm'));

  var leftAnim = Animation.link([
    leftSheet.typing.clone().repeat(4),
    leftSheet.rest
  ]).jumpTo(0).play({loop: true});

  var rightAnim = Animation.link([
    rightSheet.typing.clone().repeat(2),
    rightSheet.mouse,
    rightSheet.typing])
    .jumpTo(0).play({loop:true});


  var doAnimate = { left: true, right: true };

  var armFolder = gui.addFolder('Left Arm');
  var option;
  armFolder.add(leftArm.position,'x',-200,1000).name('Position X');
  armFolder.add(leftArm.position,'y',-200,1000).name('Position Y');
  option = armFolder.add(rotation,'right',0,360).name('Rotation');
  option.onChange(function(value){
    leftArm.rotation = value * Math.PI / 180;
  });
  option = armFolder.add(doAnimate,'left').name('Animate');
  option.onChange(function(value){
    if( value ) {
      leftAnim.play({transition: 200});
    } else {
      leftAnim.pause();
    }
  });

  armFolder = gui.addFolder('Right Arm');
  armFolder.add(rightArm.position,'x',-200,1000).name('Position X');
  armFolder.add(rightArm.position,'y',-200,1000).name('Position Y');
  armFolder.add(rotation,'right',0,360).name('Rotation');
  option = armFolder.add(rotation,'left',0,360).name('Rotation');
  option.onChange(function(value){
    rightArm.rotation = value * Math.PI / 180;
  });
  option = armFolder.add(doAnimate,'right').name('Animate');
  option.onChange(function(value){
    if( value ) {
      rightAnim.play({transition: 200});
    } else {
      rightAnim.pause();
    }
  });

  stage.addChild( leftArm );
  stage.addChild( rightArm );

  Keydoc.addEventListener('escape',function(){
    quit();
  });

  var Console = require('./console');

  var term = new Console();
  term.position.x = 150;
  term.position.y = 530;
  stage.addChild(term);

},
onframe: function(time,dt){

  renderer.render(stage);
  tween.update();

},
onquit: function(){
  console.log('Exit game');
}

};
