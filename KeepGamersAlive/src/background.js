var pixi = require('pixi');

var bg = pixi.Sprite.fromImage('img/background.png');

bg.anchor.x = 0;
bg.anchor.y = 0;
bg.position.x = 0;
bg.position.y = 0;

exports.addTo = function(stage){
  stage.addChild(bg);
};
