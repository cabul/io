var pixi = require('pixi');
var DOC = pixi.DisplayObjectContainer;

var all = [];

var Progress = function(obj,key){
  DOC.apply(this);
  this.obj = obj;
  this.key = key;
  this.from = obj[key];
  this.to = 1;
  this.border = 4;
  this.length = 100;
  this.dim = 20;
  this.colors = {
    main: 0x0000ff,
    fill: 0xffffff,
    border: 0x000000
  };
  this.orientation = 'h';
  this.bar = new pixi.Graphics();
  this.addChild(this.bar);
  return this;
};

Progress.prototype = Object.create(DOC.prototype);

Progress.prototype.setLimit = function(value){
  this.to = value;
  return this;
};
Progress.prototype.setBorder = function(value){
  this.border = value;
  return this;
};
Progress.prototype.setColors = function(value){
  var colors = this.colors;
  this.colors = {
    main: value.main || colors.main,
    fill: value.fill || colors.fill,
    border: value.border || colors.border
  };
  return this;
};
Progress.prototype.setSize = function(length,dim){
  this.length = length || this.length;
  this.dim = dim || this.dim;
  return this;
};
Progress.prototype.setOrientation = function(value){
  this.orientation = value;
  return this;
};

Progress.prototype.update = function(){
  this.bar.beginFill(this.colors.fill);
  this.bar.drawRect(0,0,this.length,this.dim);
  this.bar.endFill();
  this.bar.beginFill(this.colors.main);
  var progress = Math.min( 1, (this.obj[this.key]-this.from)/(this.to-this.from) );
  this.bar.drawRect(0,0,this.length*progress,this.dim);
  this.bar.endFill();
  return this;
};

Progress.prototype.build = function(){

  var index = all.indexOf(this);
  if( index !== -1 ) {
    all.splice(index,1);
  }

  if( this.orientation === 'v' ) {
    this.bar.rotation = -0.5 * Math.PI;
  }

  this.bar.lineStyle(this.border,this.colors.border);

  this.update();

  all.push(this);
  return this;
};

Progress.update = function(){
  all.forEach(function(prog){
    prog.update();
  });
};

module.exports = Progress;
