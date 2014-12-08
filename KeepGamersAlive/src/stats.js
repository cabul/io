var pixi = require('pixi');
var Progress = require('./progress');
var DOC = pixi.DisplayObjectContainer;

var all = {};

var list = [];

var Stats = function(name,color,speed,factor){
  DOC.apply(this);
  this.value = 0;
  this.speed = speed;
  this.factor = factor || 1;
  var bar = new Progress(this,'value')
    .setLimit(100)
    .setSize(150,20)
    .setOrientation('v')
    .setBorder(1)
    .setColors({main:color})
    .build();

  var icon = pixi.Sprite.fromImage('img/icons/'+name+'.png');
  bar.position.x = 5;
  bar.position.y = -10;
  this.addChild(bar);
  this.addChild(icon);
  all[name] = this;
  list.push(this);
}

Stats.prototype = Object.create(DOC.prototype);

Stats.prototype.addValue = function(value){
  this.value = Math.min(Math.max(this.value+value,0),100);
}

Stats.prototype.influence = function(){
  return (this.value)/1000 * this.factor;
};

Stats.get = function(name){
  return all[name];
}

Stats.enable = false;

Stats.update = function(dt){
  if(Stats.enable){
    list.forEach(function(stat){
      stat.value = Math.max(stat.value - dt/1000 * stat.speed, 0);
    });
  }
}

module.exports = Stats;