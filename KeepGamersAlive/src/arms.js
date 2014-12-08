var pixi = require('pixi');
var Animation = require('./animation');

var leftArm = pixi.Sprite.fromImage('img/left_arm.png');
leftArm.anchor.x = 0.5;
leftArm.anchor.y = 1;

var rightArm = pixi.Sprite.fromImage('img/right_arm.png');
rightArm.anchor.x = 0.5;
rightArm.anchor.y = 1;

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

exports.addTo = function(stage){

  stage.addChild(leftArm);
  stage.addChild(rightArm);

};