var TWEEN = require('tween');
var Tween = TWEEN.Tween;
var curve = TWEEN.Easing.Sinusoidal.InOut;
var dtor = Math.PI / 180;
var rtod = 180 / Math.PI;

var Animation = function(sprite,frames){

  this.frames = frames || [];
  this.sprite = sprite;
  this.update = function(){
    sprite.position.x = this.posx;
    sprite.position.y = this.posy;
    sprite.rotation = this.rot;
  };
  this.cursor = 0;
  this.loop = false;

};

var format = function( frame ){
  return {
    posx: frame.position.x || 0,
    posy: frame.position.y || 0,
    rot: (frame.rotation||0) * dtor
  };
};

Animation.prototype = {

  constructor: Animation,
  build: function(options){
    options = options || {};
    this.loop = options.loop || this.loop;
    this.cursor = options.cursor || this.cursor;
    var frames = this.frames;
    var len = frames.length;
    var doLoop = this.loop;
    var offset = this.cursor;
    var i = offset;
    var onframe = this.onframe;

    var last, first, tween, frame;

    var max = i + len;

    var _this = this;

    var complete = function(f){
      var form = format(frames[f]);
      return function(){
        this.posx = form.posx;
        this.posy = form.posy;
        this.rot = form.rot;
        if(_this.onframe) {
          onframe.call(frames,f);
        }
        _this.cursor = (f+1) % len;
      };
    };


    while( i < max) {
      frame = frames[i%len];
      tween = new Tween(format(frame));
      var oncomplete = complete(i%len);
      var onstop = stop(i%len);
      i = i + 1;
      var next = frames[i%len];
      tween.to(format(next),next.duration||1000)
      .delay(next.delay||0)
      .easing(curve)
      .onUpdate(this.update).onComplete(oncomplete);
      if( !!last ) {
        last.chain(tween);
      }
      if( !first ) {
        first = tween;
      }
      last = tween;
    }

    if( doLoop ) {
      last.chain(first);
    }

    this.tween = first;

    return this;
  },
  play: function(options){
    options = options || {};
    this.build(options);
    var first = this.tween;
    var time = options.transition;
    if( time ) {
      dt = dt || 0;
      var frame = this.frames[ this.cursor % this.frames.length ];
      var status = this.spriteStatus();
      var _this = this;
      this.tween = new Tween(format(status))
      .to(format(frame),time)
      .delay(options.delay||0)
      .easing(curve)
      .onUpdate(this.update)
      .onComplete(function(){
        _this.tween = first;
        first.start();
      }).onStop(function(){
        _this.tween = first;
      }).start();
    } else {
      first.start();
    }
    return this;
  },
  pause: function(){
    this.tween.stop();
    this.tween.stopChainedTweens();
    this.cursor = (this.cursor+1)%this.frames.length;
    return this;
  },
  spriteStatus: function(){
    return {
      position: this.sprite.position,
      rotation: this.sprite.rotation * rtod
    };
  },
  onFrame: function(cb){
    this.onframe = cb;
    return this;
  },
  jumpTo: function(i){
    i = i || 0;
    var frame = this.frames[i];
    this.cursor = (i+1) % this.frames.length;
    var sprite = this.sprite;
    sprite.position.x = frame.position.x;
    sprite.position.y = frame.position.y;
    sprite.rotation = frame.rotation * dtor;
    return this;
  },
  repeat: function(times){
    var frames = [].concat(this.frames);
    for(var i = 0; i < times; i += 1 ){
      this.frames = this.frames.concat(frames);
    }
    return this;
  },
  chain: function(other){
    this.frames = this.frames.concat(other.frames);
    return this;
  },
  clone: function(){
    return new Animation(this.sprite,[].concat(this.frames));
  }
};

Animation.loadAll = function(sprite,sheet){
  var anims = {};
  Object.keys(sheet).forEach(function(name){
    anims[name] = new Animation(sprite,sheet[name]);
  });
  return anims;
};

Animation.link = function(list){
  var link = new Animation(list[0].sprite);
  list.forEach(function(anim){
    link.frames = link.frames.concat(anim.frames);
  });
  return link;
};

module.exports = Animation;
