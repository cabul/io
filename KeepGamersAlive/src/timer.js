var pixi = require('pixi');
var DOC = pixi.DisplayObjectContainer;
var TWEEN = require('tween');
var Tween = TWEEN.Tween;
var curve = TWEEN.Easing.Linear.None;

var max = 48;
var msph = 2200;

var Timer = function(options){
  DOC.apply(this);
  this.time = max;
  this.max = options.max || max;
  this.msph = options.msph || msph;
  var color = options.color || 0x000000;
  this.seconds = new pixi.Text('48:00',{font: 'bold 64px VT323',fill: color});
  this.addChild(this.seconds);
  this.extra = 0;
};

Timer.prototype = Object.create(DOC.prototype);

Timer.prototype.fastForward = function(dt){
  this.extra += dt;
};

Timer.prototype.update = function(time){
  var h = Math.floor(time) + '';
  var m = Math.floor((time-h)*60) + '';
  if( h.length === 1 ) {
    h = '0'+h;
  }
  if( m.length === 1 ){
    m = '0'+m;
  }
  this.time = time;
  this.seconds.setText( h+':'+m );
  if(this.onupdate){
    this.onupdate(time);
  }
};
Timer.prototype.reset = function(){
  this.time = this.max;
  return this;
};
Timer.prototype.onComplete = function(fun){
  this.oncomplete = fun;
  return this;
};
Timer.prototype.onUpdate = function(fun){
  this.onupdate = fun;
  return this;
}

Timer.prototype.start = function(){
  var duration = this.time * this.msph;
  var _this = this;
  this.tween = new Tween(this)
  .to({time: 0},duration)
  .easing(curve).onUpdate(function(){
    if( _this.extra ) {
      this.time += _this.extra;
      _this.extra = 0;
    }
    _this.update(this.time);
  }).onComplete(function(){
    if(_this.oncomplete){
      _this.oncomplete();
    }
  }).start();
  return this;
};

Timer.prototype.stop = function(){
  if(this.tween){
    this.tween.stop();
  }
  return this;
}

module.exports = Timer;