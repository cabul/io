var pixi = require('pixi');

var filter = new pixi.PixelateFilter();
filter.size.x = 20;
filter.size.y = 20;

var container = new pixi.DisplayObjectContainer();
container.filters = [ filter ];

var sprite = pixi.Sprite.fromImage('img/snowman.png');
sprite.anchor.x = 0;
sprite.anchor.y = 0;
sprite.position.x = 0;
sprite.position.y = 0;
container.addChild(sprite);

exports.addTo = function(stage){

  stage.addChild(container);

};

exports.setSize = function(x){
  filter.size.x = x;
  filter.size.y = x;
}