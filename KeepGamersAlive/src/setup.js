var pixi = require('pixi');
var tween = require('tween');
var Progress = require('./progress');
var Stats = require('./stats');

var stage = new pixi.Stage(0x66ff44);
var renderer,quit;

module.exports = {

assets: [
'img/background.png',
'img/left_arm.png',
'img/right_arm.png',
'img/icons/sleep.png',
'img/icons/creativity.png',
'img/icons/eat.png',
'img/icons/drink.png',
'img/icons/shower.png',
'img/snowman.png'
],

oninit: function(context) {
  renderer = context.renderer;
  quit = context.quit;

  require('./snow').addTo(stage);
  require('./background').addTo(stage);
  require('./arms').addTo(stage);
  require('./game').addTo(stage);

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

},
onframe: function(time,dt){

  renderer.render(stage);
  tween.update();
  Stats.update(dt);
  // Progress.update();

},
onquit: function(){
  console.log('Exit game');
}

};
