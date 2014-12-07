(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],2:[function(require,module,exports){
module.exports = {
  typing: [
  {
    position: {
      x: 240,
      y: 670
    },
    rotation: 12,
    duration: 300
  },
  {
    position: {
      x: 260,
      y: 650
    },
    rotation: 6,
    duration: 300
  }
  ],
  rest: [
  {
    position: {
      x: 250,
      y: 670
    },
    rotation: 17,
    duration: 700
  },
  {
    position: {
      x: 250,
      y: 670
    },
    rotation: 17,
    duration: 1000
  },

  ]
};

},{}],3:[function(require,module,exports){
module.exports = {

  typing: [
  {
    position: {
      x: 488,
      y: 673
    },
    rotation: 350,
    duration: 200
  },
  {
    position: {
      x: 468,
      y: 668
    },
    rotation: 355,
    duration: 300,
    delay: 150
  },
  {
    position: {
      x: 500,
      y: 660
    },
    rotation: 343,
    duration: 350
  },
  ],

  mouse: [
  {
    position: {
      x: 554,
      y: 673
    },
    rotation: 368,
    duration: 400
  },
  {
    position: {
      x: 556,
      y: 670
    },
    rotation: 368,
    duration: 500
  }
  ]

};

},{}],4:[function(require,module,exports){
(function (global){
var gui = require('./debug');
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;

var Alias = {
  left      : 37,
  up        : 38,
  right     : 39,
  down      : 40,
  space     : 32,
  tab       : 9,
  pageup    : 33,
  pagedown  : 34,
  escape    : 27,
  backspace : 8,
  meta      : 91,
  alt       : 18,
  ctrl      : 17,
  shift     : 16,
  enter     : 13,
  f1        : 112,
  f2        : 113,
  f3        : 114,
  f4        : 115,
  f5        : 116,
  f6        : 117,
  f7        : 118,
  f8        : 119,
  f9        : 120,
  f10       : 121,
  f11       : 122,
  f12       : 123
};

var isValidKey = function(k){
  return ( k>=48 && k<=57 ) || ( k>=65 && k<=90 ) || k === Alias.space;
};

var Console = function(){
  DOC.apply(this);
  var bg = new pixi.Graphics();
  this.addChild(bg);
  bg.lineStyle(4,0x000000);
  bg.beginFill(0xffffff);
  bg.drawRect(0,0,496,46);
  this.prefix = '>';
  this.lines = [];
  this.lineno = 0;
  this.buffer = '';
  this.lastLine = '';
  this.cursor = 0;
  this.min = 0;
  this.line = new pixi.Text('>',{font: 'bold 32px VT323'});
  this.line.position.x = 12;
  this.line.position.y = 12;
  this.addChild(this.line);
  this.online = [];
  var _this = this;

  var actions = {};
  actions[Alias.enter] = function(event){
    _this.pushLine();
  };
  actions[Alias.backspace] = function(event){
    event.preventDefault();
    _this.removeChar();
    _this.renderText();
  };
  actions[Alias.left] = function(event){
    event.preventDefault();
    _this.moveCursor(-1);
    _this.renderText();
  };

  actions[Alias.right] = function(event){
    event.preventDefault();
    _this.moveCursor(1);
    _this.renderText();
  };

  actions[Alias.up] = function(event){
    event.preventDefault();
    _this.moveHistory(-1);
    _this.renderText();
  };

  actions[Alias.down] = function(event){
    event.preventDefault();
    _this.moveHistory(1);
    _this.renderText();
  };

  document.body.addEventListener('keydown',function(event){
    var key = event.keyCode || event.which;
    if( isValidKey(key) ) {
      _this.pushChar(String.fromCharCode(key));
    } else {
      var fun = actions[key];
      if(!!fun) {
        fun.call(_this,event);
      }
    }
    _this.renderText();
  });

};

Console.prototype = DOC.prototype;

Console.prototype.renderText = function(){
  this.min = Math.max( this.cursor-32,0 );
  this.line.setText(this.prefix+this.buffer.substr(this.min,32));
  console.log(this);
  console.log(this.buffer);
};

Console.prototype.removeChar = function(){
  var buffer = this.buffer;
  var len = buffer.length;
  var cursor = this.cursor;
  if( cursor > 0 ) {
    this.buffer = buffer.substring(0,cursor-1)+buffer.substring(cursor,len);
    this.cursor -= 1;
  }
};

Console.prototype.pushChar = function(c){
  var cursor = this.cursor;
  var buffer = this.buffer;
  console.log('Buffer',buffer);
  console.log('Char',c);
  this.buffer = buffer.substring(0,cursor) + c + buffer.substring(cursor,buffer.length);
  this.cursor += 1;
};

Console.prototype.moveCursor = function(d){
  var cursor = this.cursor + d;
  var len = this.buffer.length;
  if( cursor >= 0 && cursor <= len ) {
    this.cursor = cursor;
  }
};

Console.prototype.pushLine = function(){
  this.lineno = this.lines.push( this.buffer );
  this.buffer = '';
  this.cursor = 0;
};

Console.prototype.moveHistory = function(d){
  var lineno = this.lineno + d;
  var count = this.lines.length;
  if( lineno === count ) {
    this.buffer = '';
    this.lineno = lineno;
    this.cursor = 0;
  }
  if( lineno >= 0 && lineno < count ) {
    this.buffer = this.lines[lineno];
    this.lineno = lineno;
    this.cursor = this.buffer.length;
  }
};

module.exports = Console;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":5}],5:[function(require,module,exports){
(function (global){
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);
var gui = new Gui();
module.exports = gui;
gui.domElement.style.display = 'none';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
exports.load = function(families,callback){

  window.WebFontConfig = {
    google: {
      families: families
    },
    active: callback
  };
  (function(){
    var wf = document.createElement('script');
    wf.src = ('https:' === document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();
};

},{}],7:[function(require,module,exports){
(function (global){
var gui = require('./debug');
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":1,"./animations/leftarm":2,"./animations/rightarm":3,"./console":4,"./debug":5,"./keydoc":8}],8:[function(require,module,exports){
var alias = {
  'left'  : 37,
  'up'    : 38,
  'right' : 39,
  'down'  : 40,
  'space' : 32,
  'tab'   : 9,
  'pageup'    : 33,
  'pagedown'  : 34,
  'escape'    : 27,
  'backspace' : 8,
  'meta'  : 91,
  'alt'   : 18,
  'ctrl'  : 17,
  'shift' : 16,
  'enter' : 13,
  'f1'  : 112,
  'f2'  : 113,
  'f3'  : 114,
  'f4'  : 115,
  'f5'  : 116,
  'f6'  : 117,
  'f7'  : 118,
  'f8'  : 119,
  'f9'  : 120,
  'f10' : 121,
  'f11' : 122,
  'f12' : 123
};

var listeners = {};

var pressed = {};

document.body.addEventListener('keyup',function(event){
  // event.preventDefault();
  var keyCode = event.keyCode || event.which;
  pressed[keyCode] = false;
},false);

document.body.addEventListener('keydown',function(event){
  // event.preventDefault();
  console.log(event);
  var keyCode = event.keyCode || event.which;
  pressed[keyCode] = true;
  Object.keys(listeners).forEach(function(keys){
    var i,len;
    var arr = keys.split('+');
    for( i = 0, len = arr.length; i < len; i += 1 ) {
      key = arr[i];
      keyCode = alias[key] || key.toUpperCase().charCodeAt(0);
      if( !pressed[keyCode] ) {
        return;
      }
    }
    var prop = true;
    arr = listeners[keys];
    for( i = 0, len = arr.length; i < len && prop; i += 1 ) {
      arr[i].call(null,event);
    }
  });
},false);

exports.addEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] === undefined ) {
    listeners[keys] = [];
  }
  if( listeners[keys].indexOf(listener) === -1 ) {
    listeners[keys].push(listener);
  }
};

exports.removeEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] !== undefined ) {
    var index = listeners[keys].indexOf(listener);
    if( index !== -1 ) {
      listeners[keys].splice(index,1);
    }
  }
};

exports.hasEventListener = function( type, listener ){
  var keys = type.split('+').sort().join('+');
  if( listeners[keys] === undefined ) {
    return false;
  }
  if( listeners[keys].indexOf(listener) === -1 ) {
      return false;
  }
  return true;
};

exports.dispatchEvent = function( event ){
  var type = event.type;
  if( listeners[type] === undefined ) {
    return;
  }
  listeners[type].forEach(function(listener){
    listener.call(event);
  });
};

},{}],9:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Fonts = require('./fonts');
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var game = require('./game');

var assets = game.assets || [];

var loader = new pixi.AssetLoader(assets);

var tile = 400 / assets.length;

var loadingBar = new pixi.Graphics();
var loaded = 0;
loadingBar.lineStyle(10,0xffffff);

loadingBar.drawRect(-5,-5,410,50);

loadingBar.lineStyle(0);

loadingBar.position.x = 200;
loadingBar.position.y = 280;

var loadingScreen = new pixi.Stage(0x000000);
var loading = true;

loadingScreen.addChild(loadingBar);

loader.onProgress = function(){
  loadingBar.beginFill( 0xffffff * Math.random() );
  loadingBar.drawRect(tile*loaded,0,tile,40);
  loadingBar.endFill();
  loaded += 1;
};

loader.onComplete = function(){
  loading = false;
};

var text;

Fonts.load(['VT323'],function(){
  text = new pixi.Text('Loading..',{font: '40px VT323',fill:'white'});
  text.position.x = 190;
  text.position.y = 230;
  window.text = text;
  loadingScreen.addChild(text);
  loader.load();
});

requestAnimFrame( function load(){
  if( loading ) {
    requestAnimFrame(load);
    renderer.render(loadingScreen);
  } else {
    var init_time = 0;
    var running = true;
    var context = {
      renderer: renderer,
      quit: function(){
        running = false;
      }
    };

    game.oninit(context);

    requestAnimFrame( function render(tick){

      if(running){
        requestAnimFrame(render);
        tick = tick || init_time;
        var dt = tick - init_time;
        init_time = tick;

        game.onframe(tick,dt);
      }

    });
  }
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./fonts":6,"./game":7}]},{},[9])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hbmltYXRpb24uanMiLCJzcmMvYW5pbWF0aW9ucy9sZWZ0YXJtLmpzIiwic3JjL2FuaW1hdGlvbnMvcmlnaHRhcm0uanMiLCJzcmMvY29uc29sZS5qcyIsInNyYy9kZWJ1Zy5qcyIsInNyYy9mb250cy5qcyIsInNyYy9nYW1lLmpzIiwic3JjL2tleWRvYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdktBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBUV0VFTiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRXRUVOIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5UV0VFTiA6IG51bGwpO1xudmFyIFR3ZWVuID0gVFdFRU4uVHdlZW47XG52YXIgY3VydmUgPSBUV0VFTi5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dDtcbnZhciBkdG9yID0gTWF0aC5QSSAvIDE4MDtcbnZhciBydG9kID0gMTgwIC8gTWF0aC5QSTtcblxudmFyIEFuaW1hdGlvbiA9IGZ1bmN0aW9uKHNwcml0ZSxmcmFtZXMpe1xuXG4gIHRoaXMuZnJhbWVzID0gZnJhbWVzIHx8IFtdO1xuICB0aGlzLnNwcml0ZSA9IHNwcml0ZTtcbiAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gdGhpcy5wb3N4O1xuICAgIHNwcml0ZS5wb3NpdGlvbi55ID0gdGhpcy5wb3N5O1xuICAgIHNwcml0ZS5yb3RhdGlvbiA9IHRoaXMucm90O1xuICB9O1xuICB0aGlzLmN1cnNvciA9IDA7XG4gIHRoaXMubG9vcCA9IGZhbHNlO1xuXG59O1xuXG52YXIgZm9ybWF0ID0gZnVuY3Rpb24oIGZyYW1lICl7XG4gIHJldHVybiB7XG4gICAgcG9zeDogZnJhbWUucG9zaXRpb24ueCB8fCAwLFxuICAgIHBvc3k6IGZyYW1lLnBvc2l0aW9uLnkgfHwgMCxcbiAgICByb3Q6IChmcmFtZS5yb3RhdGlvbnx8MCkgKiBkdG9yXG4gIH07XG59O1xuXG5BbmltYXRpb24ucHJvdG90eXBlID0ge1xuXG4gIGNvbnN0cnVjdG9yOiBBbmltYXRpb24sXG4gIGJ1aWxkOiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fMKge307XG4gICAgdGhpcy5sb29wID0gb3B0aW9ucy5sb29wIHx8IHRoaXMubG9vcDtcbiAgICB0aGlzLmN1cnNvciA9IG9wdGlvbnMuY3Vyc29yIHx8IHRoaXMuY3Vyc29yO1xuICAgIHZhciBmcmFtZXMgPSB0aGlzLmZyYW1lcztcbiAgICB2YXIgbGVuID0gZnJhbWVzLmxlbmd0aDtcbiAgICB2YXIgZG9Mb29wID0gdGhpcy5sb29wO1xuICAgIHZhciBvZmZzZXQgPSB0aGlzLmN1cnNvcjtcbiAgICB2YXIgaSA9IG9mZnNldDtcbiAgICB2YXIgb25mcmFtZSA9IHRoaXMub25mcmFtZTtcblxuICAgIHZhciBsYXN0LCBmaXJzdCwgdHdlZW4sIGZyYW1lO1xuXG4gICAgdmFyIG1heCA9IGkgKyBsZW47XG5cbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIGNvbXBsZXRlID0gZnVuY3Rpb24oZil7XG4gICAgICB2YXIgZm9ybSA9IGZvcm1hdChmcmFtZXNbZl0pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMucG9zeCA9IGZvcm0ucG9zeDtcbiAgICAgICAgdGhpcy5wb3N5ID0gZm9ybS5wb3N5O1xuICAgICAgICB0aGlzLnJvdCA9IGZvcm0ucm90O1xuICAgICAgICBpZihfdGhpcy5vbmZyYW1lKSB7XG4gICAgICAgICAgb25mcmFtZS5jYWxsKGZyYW1lcyxmKTtcbiAgICAgICAgfVxuICAgICAgICBfdGhpcy5jdXJzb3IgPSAoZisxKSAlIGxlbjtcbiAgICAgIH07XG4gICAgfTtcblxuXG4gICAgd2hpbGUoIGkgPCBtYXgpIHtcbiAgICAgIGZyYW1lID0gZnJhbWVzW2klbGVuXTtcbiAgICAgIHR3ZWVuID0gbmV3IFR3ZWVuKGZvcm1hdChmcmFtZSkpO1xuICAgICAgdmFyIG9uY29tcGxldGUgPSBjb21wbGV0ZShpJWxlbik7XG4gICAgICB2YXIgb25zdG9wID0gc3RvcChpJWxlbik7XG4gICAgICBpID0gaSArIDE7XG4gICAgICB2YXIgbmV4dCA9IGZyYW1lc1tpJWxlbl07XG4gICAgICB0d2Vlbi50byhmb3JtYXQobmV4dCksbmV4dC5kdXJhdGlvbnx8MTAwMClcbiAgICAgIC5kZWxheShuZXh0LmRlbGF5fHwwKVxuICAgICAgLmVhc2luZyhjdXJ2ZSlcbiAgICAgIC5vblVwZGF0ZSh0aGlzLnVwZGF0ZSkub25Db21wbGV0ZShvbmNvbXBsZXRlKTtcbiAgICAgIGlmKCAhIWxhc3QgKSB7XG4gICAgICAgIGxhc3QuY2hhaW4odHdlZW4pO1xuICAgICAgfVxuICAgICAgaWYoICFmaXJzdCApIHtcbiAgICAgICAgZmlyc3QgPSB0d2VlbjtcbiAgICAgIH1cbiAgICAgIGxhc3QgPSB0d2VlbjtcbiAgICB9XG5cbiAgICBpZiggZG9Mb29wICkge1xuICAgICAgbGFzdC5jaGFpbihmaXJzdCk7XG4gICAgfVxuXG4gICAgdGhpcy50d2VlbiA9IGZpcnN0O1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHBsYXk6IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgIHRoaXMuYnVpbGQob3B0aW9ucyk7XG4gICAgdmFyIGZpcnN0ID0gdGhpcy50d2VlbjtcbiAgICB2YXIgdGltZSA9IG9wdGlvbnMudHJhbnNpdGlvbjtcbiAgICBpZiggdGltZSApIHtcbiAgICAgIGR0ID0gZHQgfHwgMDtcbiAgICAgIHZhciBmcmFtZSA9IHRoaXMuZnJhbWVzWyB0aGlzLmN1cnNvciAlIHRoaXMuZnJhbWVzLmxlbmd0aCBdO1xuICAgICAgdmFyIHN0YXR1cyA9IHRoaXMuc3ByaXRlU3RhdHVzKCk7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdGhpcy50d2VlbiA9IG5ldyBUd2Vlbihmb3JtYXQoc3RhdHVzKSlcbiAgICAgIC50byhmb3JtYXQoZnJhbWUpLHRpbWUpXG4gICAgICAuZGVsYXkob3B0aW9ucy5kZWxheXx8MClcbiAgICAgIC5lYXNpbmcoY3VydmUpXG4gICAgICAub25VcGRhdGUodGhpcy51cGRhdGUpXG4gICAgICAub25Db21wbGV0ZShmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy50d2VlbiA9IGZpcnN0O1xuICAgICAgICBmaXJzdC5zdGFydCgpO1xuICAgICAgfSkub25TdG9wKGZ1bmN0aW9uKCl7XG4gICAgICAgIF90aGlzLnR3ZWVuID0gZmlyc3Q7XG4gICAgICB9KS5zdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJzdC5zdGFydCgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgcGF1c2U6IGZ1bmN0aW9uKCl7XG4gICAgdGhpcy50d2Vlbi5zdG9wKCk7XG4gICAgdGhpcy50d2Vlbi5zdG9wQ2hhaW5lZFR3ZWVucygpO1xuICAgIHRoaXMuY3Vyc29yID0gKHRoaXMuY3Vyc29yKzEpJXRoaXMuZnJhbWVzLmxlbmd0aDtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgc3ByaXRlU3RhdHVzOiBmdW5jdGlvbigpe1xuICAgIHJldHVybiB7XG4gICAgICBwb3NpdGlvbjogdGhpcy5zcHJpdGUucG9zaXRpb24sXG4gICAgICByb3RhdGlvbjogdGhpcy5zcHJpdGUucm90YXRpb24gKiBydG9kXG4gICAgfTtcbiAgfSxcbiAgb25GcmFtZTogZnVuY3Rpb24oY2Ipe1xuICAgIHRoaXMub25mcmFtZSA9IGNiO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBqdW1wVG86IGZ1bmN0aW9uKGkpe1xuICAgIGkgPSBpIHx8IDA7XG4gICAgdmFyIGZyYW1lID0gdGhpcy5mcmFtZXNbaV07XG4gICAgdGhpcy5jdXJzb3IgPSAoaSsxKSAlIHRoaXMuZnJhbWVzLmxlbmd0aDtcbiAgICB2YXIgc3ByaXRlID0gdGhpcy5zcHJpdGU7XG4gICAgc3ByaXRlLnBvc2l0aW9uLnggPSBmcmFtZS5wb3NpdGlvbi54O1xuICAgIHNwcml0ZS5wb3NpdGlvbi55ID0gZnJhbWUucG9zaXRpb24ueTtcbiAgICBzcHJpdGUucm90YXRpb24gPSBmcmFtZS5yb3RhdGlvbiAqIGR0b3I7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHJlcGVhdDogZnVuY3Rpb24odGltZXMpe1xuICAgIHZhciBmcmFtZXMgPSBbXS5jb25jYXQodGhpcy5mcmFtZXMpO1xuICAgIGZvcih2YXIgaSA9IDA7IGkgPCB0aW1lczsgaSArPSAxICl7XG4gICAgICB0aGlzLmZyYW1lcyA9IHRoaXMuZnJhbWVzLmNvbmNhdChmcmFtZXMpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY2hhaW46IGZ1bmN0aW9uKG90aGVyKXtcbiAgICB0aGlzLmZyYW1lcyA9IHRoaXMuZnJhbWVzLmNvbmNhdChvdGhlci5mcmFtZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBjbG9uZTogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gbmV3IEFuaW1hdGlvbih0aGlzLnNwcml0ZSxbXS5jb25jYXQodGhpcy5mcmFtZXMpKTtcbiAgfVxufTtcblxuQW5pbWF0aW9uLmxvYWRBbGwgPSBmdW5jdGlvbihzcHJpdGUsc2hlZXQpe1xuICB2YXIgYW5pbXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoc2hlZXQpLmZvckVhY2goZnVuY3Rpb24obmFtZSl7XG4gICAgYW5pbXNbbmFtZV0gPSBuZXcgQW5pbWF0aW9uKHNwcml0ZSxzaGVldFtuYW1lXSk7XG4gIH0pO1xuICByZXR1cm4gYW5pbXM7XG59O1xuXG5BbmltYXRpb24ubGluayA9IGZ1bmN0aW9uKGxpc3Qpe1xuICB2YXIgbGluayA9IG5ldyBBbmltYXRpb24obGlzdFswXS5zcHJpdGUpO1xuICBsaXN0LmZvckVhY2goZnVuY3Rpb24oYW5pbSl7XG4gICAgbGluay5mcmFtZXMgPSBsaW5rLmZyYW1lcy5jb25jYXQoYW5pbS5mcmFtZXMpO1xuICB9KTtcbiAgcmV0dXJuIGxpbms7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFuaW1hdGlvbjtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHR5cGluZzogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI0MCxcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDEyLFxuICAgIGR1cmF0aW9uOiAzMDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNjAsXG4gICAgICB5OiA2NTBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiA2LFxuICAgIGR1cmF0aW9uOiAzMDBcbiAgfVxuICBdLFxuICByZXN0OiBbXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjUwLFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMTcsXG4gICAgZHVyYXRpb246IDcwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI1MCxcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDE3LFxuICAgIGR1cmF0aW9uOiAxMDAwXG4gIH0sXG5cbiAgXVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIHR5cGluZzogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDQ4OCxcbiAgICAgIHk6IDY3M1xuICAgIH0sXG4gICAgcm90YXRpb246IDM1MCxcbiAgICBkdXJhdGlvbjogMjAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjrCoHtcbiAgICAgIHg6IDQ2OCxcbiAgICAgIHk6IDY2OFxuICAgIH0sXG4gICAgcm90YXRpb246IDM1NSxcbiAgICBkdXJhdGlvbjogMzAwLFxuICAgIGRlbGF5OiAxNTBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOsKge1xuICAgICAgeDogNTAwLFxuICAgICAgeTogNjYwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzQzLFxuICAgIGR1cmF0aW9uOiAzNTBcbiAgfSxcbiAgXSxcblxuICBtb3VzZTogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDU1NCxcbiAgICAgIHk6IDY3M1xuICAgIH0sXG4gICAgcm90YXRpb246IDM2OCxcbiAgICBkdXJhdGlvbjogNDAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogNTU2LFxuICAgICAgeTogNjcwXG4gICAgfSxcbiAgICByb3RhdGlvbjogMzY4LFxuICAgIGR1cmF0aW9uOiA1MDBcbiAgfVxuICBdXG5cbn07XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgZ3VpID0gcmVxdWlyZSgnLi9kZWJ1ZycpO1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG52YXIgRE9DID0gcGl4aS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG52YXIgQWxpYXMgPSB7XG4gIGxlZnQgICAgICA6IDM3LFxuICB1cCAgICAgICAgOiAzOCxcbiAgcmlnaHQgICAgIDogMzksXG4gIGRvd24gICAgICA6IDQwLFxuICBzcGFjZSAgICAgOiAzMixcbiAgdGFiICAgICAgIDogOSxcbiAgcGFnZXVwICAgIDogMzMsXG4gIHBhZ2Vkb3duICA6IDM0LFxuICBlc2NhcGUgICAgOiAyNyxcbiAgYmFja3NwYWNlIDogOCxcbiAgbWV0YSAgICAgIDogOTEsXG4gIGFsdCAgICAgICA6IDE4LFxuICBjdHJsICAgICAgOiAxNyxcbiAgc2hpZnQgICAgIDogMTYsXG4gIGVudGVyICAgICA6IDEzLFxuICBmMSAgICAgICAgOiAxMTIsXG4gIGYyICAgICAgICA6IDExMyxcbiAgZjMgICAgICAgIDogMTE0LFxuICBmNCAgICAgICAgOiAxMTUsXG4gIGY1ICAgICAgICA6IDExNixcbiAgZjYgICAgICAgIDogMTE3LFxuICBmNyAgICAgICAgOiAxMTgsXG4gIGY4ICAgICAgICA6IDExOSxcbiAgZjkgICAgICAgIDogMTIwLFxuICBmMTAgICAgICAgOiAxMjEsXG4gIGYxMSAgICAgICA6IDEyMixcbiAgZjEyICAgICAgIDogMTIzXG59O1xuXG52YXIgaXNWYWxpZEtleSA9IGZ1bmN0aW9uKGspe1xuICByZXR1cm4gKCBrPj00OCAmJiBrPD01NyApIHx8ICggaz49NjUgJiYgazw9OTAgKSB8fCBrID09PSBBbGlhcy5zcGFjZTtcbn07XG5cbnZhciBDb25zb2xlID0gZnVuY3Rpb24oKXtcbiAgRE9DLmFwcGx5KHRoaXMpO1xuICB2YXIgYmcgPSBuZXcgcGl4aS5HcmFwaGljcygpO1xuICB0aGlzLmFkZENoaWxkKGJnKTtcbiAgYmcubGluZVN0eWxlKDQsMHgwMDAwMDApO1xuICBiZy5iZWdpbkZpbGwoMHhmZmZmZmYpO1xuICBiZy5kcmF3UmVjdCgwLDAsNDk2LDQ2KTtcbiAgdGhpcy5wcmVmaXggPSAnPic7XG4gIHRoaXMubGluZXMgPSBbXTtcbiAgdGhpcy5saW5lbm8gPSAwO1xuICB0aGlzLmJ1ZmZlciA9ICcnO1xuICB0aGlzLmxhc3RMaW5lID0gJyc7XG4gIHRoaXMuY3Vyc29yID0gMDtcbiAgdGhpcy5taW4gPSAwO1xuICB0aGlzLmxpbmUgPSBuZXcgcGl4aS5UZXh0KCc+Jyx7Zm9udDogJ2JvbGQgMzJweCBWVDMyMyd9KTtcbiAgdGhpcy5saW5lLnBvc2l0aW9uLnggPSAxMjtcbiAgdGhpcy5saW5lLnBvc2l0aW9uLnkgPSAxMjtcbiAgdGhpcy5hZGRDaGlsZCh0aGlzLmxpbmUpO1xuICB0aGlzLm9ubGluZSA9IFtdO1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gIHZhciBhY3Rpb25zID0ge307XG4gIGFjdGlvbnNbQWxpYXMuZW50ZXJdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIF90aGlzLnB1c2hMaW5lKCk7XG4gIH07XG4gIGFjdGlvbnNbQWxpYXMuYmFja3NwYWNlXSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLnJlbW92ZUNoYXIoKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG4gIGFjdGlvbnNbQWxpYXMubGVmdF0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlQ3Vyc29yKC0xKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgYWN0aW9uc1tBbGlhcy5yaWdodF0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlQ3Vyc29yKDEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBhY3Rpb25zW0FsaWFzLnVwXSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVIaXN0b3J5KC0xKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgYWN0aW9uc1tBbGlhcy5kb3duXSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIF90aGlzLm1vdmVIaXN0b3J5KDEpO1xuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfTtcblxuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLGZ1bmN0aW9uKGV2ZW50KXtcbiAgICB2YXIga2V5ID0gZXZlbnQua2V5Q29kZSB8fMKgZXZlbnQud2hpY2g7XG4gICAgaWYoIGlzVmFsaWRLZXkoa2V5KSApIHtcbiAgICAgIF90aGlzLnB1c2hDaGFyKFN0cmluZy5mcm9tQ2hhckNvZGUoa2V5KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBmdW4gPSBhY3Rpb25zW2tleV07XG4gICAgICBpZighIWZ1bikge1xuICAgICAgICBmdW4uY2FsbChfdGhpcyxldmVudCk7XG4gICAgICB9XG4gICAgfVxuICAgIF90aGlzLnJlbmRlclRleHQoKTtcbiAgfSk7XG5cbn07XG5cbkNvbnNvbGUucHJvdG90eXBlID0gRE9DLnByb3RvdHlwZTtcblxuQ29uc29sZS5wcm90b3R5cGUucmVuZGVyVGV4dCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMubWluID0gTWF0aC5tYXgoIHRoaXMuY3Vyc29yLTMyLDAgKTtcbiAgdGhpcy5saW5lLnNldFRleHQodGhpcy5wcmVmaXgrdGhpcy5idWZmZXIuc3Vic3RyKHRoaXMubWluLDMyKSk7XG4gIGNvbnNvbGUubG9nKHRoaXMpO1xuICBjb25zb2xlLmxvZyh0aGlzLmJ1ZmZlcik7XG59O1xuXG5Db25zb2xlLnByb3RvdHlwZS5yZW1vdmVDaGFyID0gZnVuY3Rpb24oKXtcbiAgdmFyIGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICB2YXIgbGVuID0gYnVmZmVyLmxlbmd0aDtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yO1xuICBpZiggY3Vyc29yID4gMCApIHtcbiAgICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCxjdXJzb3ItMSkrYnVmZmVyLnN1YnN0cmluZyhjdXJzb3IsbGVuKTtcbiAgICB0aGlzLmN1cnNvciAtPSAxO1xuICB9XG59O1xuXG5Db25zb2xlLnByb3RvdHlwZS5wdXNoQ2hhciA9IGZ1bmN0aW9uKGMpe1xuICB2YXIgY3Vyc29yID0gdGhpcy5jdXJzb3I7XG4gIHZhciBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgY29uc29sZS5sb2coJ0J1ZmZlcicsYnVmZmVyKTtcbiAgY29uc29sZS5sb2coJ0NoYXInLGMpO1xuICB0aGlzLmJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCxjdXJzb3IpICsgYyArIGJ1ZmZlci5zdWJzdHJpbmcoY3Vyc29yLGJ1ZmZlci5sZW5ndGgpO1xuICB0aGlzLmN1cnNvciArPSAxO1xufTtcblxuQ29uc29sZS5wcm90b3R5cGUubW92ZUN1cnNvciA9IGZ1bmN0aW9uKGQpe1xuICB2YXIgY3Vyc29yID0gdGhpcy5jdXJzb3IgKyBkO1xuICB2YXIgbGVuID0gdGhpcy5idWZmZXIubGVuZ3RoO1xuICBpZiggY3Vyc29yID49IDAgJiYgY3Vyc29yIDw9IGxlbiApIHtcbiAgICB0aGlzLmN1cnNvciA9IGN1cnNvcjtcbiAgfVxufTtcblxuQ29uc29sZS5wcm90b3R5cGUucHVzaExpbmUgPSBmdW5jdGlvbigpe1xuICB0aGlzLmxpbmVubyA9IHRoaXMubGluZXMucHVzaCggdGhpcy5idWZmZXIgKTtcbiAgdGhpcy5idWZmZXIgPSAnJztcbiAgdGhpcy5jdXJzb3IgPSAwO1xufTtcblxuQ29uc29sZS5wcm90b3R5cGUubW92ZUhpc3RvcnkgPSBmdW5jdGlvbihkKXtcbiAgdmFyIGxpbmVubyA9IHRoaXMubGluZW5vICsgZDtcbiAgdmFyIGNvdW50ID0gdGhpcy5saW5lcy5sZW5ndGg7XG4gIGlmKCBsaW5lbm8gPT09IGNvdW50ICkge1xuICAgIHRoaXMuYnVmZmVyID0gJyc7XG4gICAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gICAgdGhpcy5jdXJzb3IgPSAwO1xuICB9XG4gIGlmKCBsaW5lbm8gPj0gMCAmJiBsaW5lbm8gPCBjb3VudCApIHtcbiAgICB0aGlzLmJ1ZmZlciA9IHRoaXMubGluZXNbbGluZW5vXTtcbiAgICB0aGlzLmxpbmVubyA9IGxpbmVubztcbiAgICB0aGlzLmN1cnNvciA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDb25zb2xlO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgR3VpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuZGF0LkdVSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuZGF0LkdVSSA6IG51bGwpO1xudmFyIGd1aSA9IG5ldyBHdWkoKTtcbm1vZHVsZS5leHBvcnRzID0gZ3VpO1xuZ3VpLmRvbUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiZXhwb3J0cy5sb2FkID0gZnVuY3Rpb24oZmFtaWxpZXMsY2FsbGJhY2spe1xuXG4gIHdpbmRvdy5XZWJGb250Q29uZmlnID0ge1xuICAgIGdvb2dsZToge1xuICAgICAgZmFtaWxpZXM6IGZhbWlsaWVzXG4gICAgfSxcbiAgICBhY3RpdmU6IGNhbGxiYWNrXG4gIH07XG4gIChmdW5jdGlvbigpe1xuICAgIHZhciB3ZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHdmLnNyYyA9ICgnaHR0cHM6JyA9PT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyAnaHR0cHMnIDogJ2h0dHAnKSArXG4gICAgJzovL2FqYXguZ29vZ2xlYXBpcy5jb20vYWpheC9saWJzL3dlYmZvbnQvMS93ZWJmb250LmpzJztcbiAgICB3Zi50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgd2YuYXN5bmMgPSAndHJ1ZSc7XG4gICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3Ziwgcyk7XG4gIH0pKCk7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIGd1aSA9IHJlcXVpcmUoJy4vZGVidWcnKTtcbnZhciB0d2VlbiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRXRUVOIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5UV0VFTiA6IG51bGwpO1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG52YXIgS2V5ZG9jID0gcmVxdWlyZSgnLi9rZXlkb2MnKTtcbnZhciBBbmltYXRpb24gPSByZXF1aXJlKCcuL2FuaW1hdGlvbicpO1xuXG52YXIgc3RhZ2UgPSBuZXcgcGl4aS5TdGFnZSgweDY2ZmY0NCk7XG52YXIgcmVuZGVyZXIscXVpdDtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbmFzc2V0czogW1xuJ2ltZy9iYWNrZ3JvdW5kLnBuZycsXG4naW1nL2xlZnRfYXJtLnBuZycsXG4naW1nL3JpZ2h0X2FybS5wbmcnXG5dLFxuXG5vbmluaXQ6IGZ1bmN0aW9uKGNvbnRleHQpIHtcbiAgcmVuZGVyZXIgPSBjb250ZXh0LnJlbmRlcmVyO1xuICBxdWl0ID0gY29udGV4dC5xdWl0O1xuXG4gIHZhciBiYWNrZ3JvdW5kID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvYmFja2dyb3VuZC5wbmcnKTtcblxuICBiYWNrZ3JvdW5kLmFuY2hvci54ID0gMDtcbiAgYmFja2dyb3VuZC5hbmNob3IueSA9IDA7XG4gIGJhY2tncm91bmQucG9zaXRpb24ueCA9IDA7XG4gIGJhY2tncm91bmQucG9zaXRpb24ueSA9IDA7XG5cbiAgLy8gdmFyIHBpeGVsYXRlRmlsdGVyID0gbmV3IHBpeGkuUGl4ZWxhdGVGaWx0ZXIoKTtcbiAgLy8gdmFyIHBpeGVsYXRlRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignUGl4ZWxhdGUnKTtcbiAgLy8gcGl4ZWxhdGVGb2xkZXIuYWRkKHBpeGVsYXRlRmlsdGVyLnNpemUsJ3gnLDEsMzIpLm5hbWUoJ1BpeGVsU2l6ZVgnKTtcbiAgLy8gcGl4ZWxhdGVGb2xkZXIuYWRkKHBpeGVsYXRlRmlsdGVyLnNpemUsJ3knLDEsMzIpLm5hbWUoJ1BpeGVsU2l6ZVknKTtcbiAgLy9cbiAgLy8gdmFyIGNvbnRhaW5lciA9IG5ldyBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXIoKTtcbiAgLy8gY29udGFpbmVyLmZpbHRlcnMgPSBbIHBpeGVsYXRlRmlsdGVyIF07XG4gIC8vXG4gIC8vIGNvbnRhaW5lci5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcbiAgLy8gc3RhZ2UuYWRkQ2hpbGQoY29udGFpbmVyKTtcblxuICBzdGFnZS5hZGRDaGlsZChiYWNrZ3JvdW5kKTtcblxuICB2YXIgbGVmdEFybSA9IHBpeGkuU3ByaXRlLmZyb21JbWFnZSgnaW1nL2xlZnRfYXJtLnBuZycpO1xuICBsZWZ0QXJtLmFuY2hvci54ID0gMC41O1xuICBsZWZ0QXJtLmFuY2hvci55ID0gMTtcblxuICB2YXIgcmlnaHRBcm0gPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9yaWdodF9hcm0ucG5nJyk7XG4gIHJpZ2h0QXJtLmFuY2hvci54ID0gMC41O1xuICByaWdodEFybS5hbmNob3IueSA9IDE7XG5cbiAgdmFyIHJvdGF0aW9uID0ge1xuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDBcbiAgfTtcblxuICB2YXIgbGVmdFNoZWV0ID0gQW5pbWF0aW9uLmxvYWRBbGwobGVmdEFybSxyZXF1aXJlKCcuL2FuaW1hdGlvbnMvbGVmdGFybScpKTtcbiAgdmFyIHJpZ2h0U2hlZXQgPSBBbmltYXRpb24ubG9hZEFsbChyaWdodEFybSxyZXF1aXJlKCcuL2FuaW1hdGlvbnMvcmlnaHRhcm0nKSk7XG5cbiAgdmFyIGxlZnRBbmltID0gQW5pbWF0aW9uLmxpbmsoW1xuICAgIGxlZnRTaGVldC50eXBpbmcuY2xvbmUoKS5yZXBlYXQoNCksXG4gICAgbGVmdFNoZWV0LnJlc3RcbiAgXSkuanVtcFRvKDApLnBsYXkoe2xvb3A6IHRydWV9KTtcblxuICB2YXIgcmlnaHRBbmltID0gQW5pbWF0aW9uLmxpbmsoW1xuICAgIHJpZ2h0U2hlZXQudHlwaW5nLmNsb25lKCkucmVwZWF0KDIpLFxuICAgIHJpZ2h0U2hlZXQubW91c2UsXG4gICAgcmlnaHRTaGVldC50eXBpbmddKVxuICAgIC5qdW1wVG8oMCkucGxheSh7bG9vcDp0cnVlfSk7XG5cblxuICB2YXIgZG9BbmltYXRlID0geyBsZWZ0OiB0cnVlLCByaWdodDogdHJ1ZSB9O1xuXG4gIHZhciBhcm1Gb2xkZXIgPSBndWkuYWRkRm9sZGVyKCdMZWZ0IEFybScpO1xuICB2YXIgb3B0aW9uO1xuICBhcm1Gb2xkZXIuYWRkKGxlZnRBcm0ucG9zaXRpb24sJ3gnLC0yMDAsMTAwMCkubmFtZSgnUG9zaXRpb24gWCcpO1xuICBhcm1Gb2xkZXIuYWRkKGxlZnRBcm0ucG9zaXRpb24sJ3knLC0yMDAsMTAwMCkubmFtZSgnUG9zaXRpb24gWScpO1xuICBvcHRpb24gPSBhcm1Gb2xkZXIuYWRkKHJvdGF0aW9uLCdyaWdodCcsMCwzNjApLm5hbWUoJ1JvdGF0aW9uJyk7XG4gIG9wdGlvbi5vbkNoYW5nZShmdW5jdGlvbih2YWx1ZSl7XG4gICAgbGVmdEFybS5yb3RhdGlvbiA9IHZhbHVlICogTWF0aC5QSSAvIDE4MDtcbiAgfSk7XG4gIG9wdGlvbiA9IGFybUZvbGRlci5hZGQoZG9BbmltYXRlLCdsZWZ0JykubmFtZSgnQW5pbWF0ZScpO1xuICBvcHRpb24ub25DaGFuZ2UoZnVuY3Rpb24odmFsdWUpe1xuICAgIGlmKCB2YWx1ZSApIHtcbiAgICAgIGxlZnRBbmltLnBsYXkoe3RyYW5zaXRpb246IDIwMH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZWZ0QW5pbS5wYXVzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgYXJtRm9sZGVyID0gZ3VpLmFkZEZvbGRlcignUmlnaHQgQXJtJyk7XG4gIGFybUZvbGRlci5hZGQocmlnaHRBcm0ucG9zaXRpb24sJ3gnLC0yMDAsMTAwMCkubmFtZSgnUG9zaXRpb24gWCcpO1xuICBhcm1Gb2xkZXIuYWRkKHJpZ2h0QXJtLnBvc2l0aW9uLCd5JywtMjAwLDEwMDApLm5hbWUoJ1Bvc2l0aW9uIFknKTtcbiAgYXJtRm9sZGVyLmFkZChyb3RhdGlvbiwncmlnaHQnLDAsMzYwKS5uYW1lKCdSb3RhdGlvbicpO1xuICBvcHRpb24gPSBhcm1Gb2xkZXIuYWRkKHJvdGF0aW9uLCdsZWZ0JywwLDM2MCkubmFtZSgnUm90YXRpb24nKTtcbiAgb3B0aW9uLm9uQ2hhbmdlKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICByaWdodEFybS5yb3RhdGlvbiA9IHZhbHVlICogTWF0aC5QSSAvIDE4MDtcbiAgfSk7XG4gIG9wdGlvbiA9IGFybUZvbGRlci5hZGQoZG9BbmltYXRlLCdyaWdodCcpLm5hbWUoJ0FuaW1hdGUnKTtcbiAgb3B0aW9uLm9uQ2hhbmdlKGZ1bmN0aW9uKHZhbHVlKXtcbiAgICBpZiggdmFsdWUgKSB7XG4gICAgICByaWdodEFuaW0ucGxheSh7dHJhbnNpdGlvbjogMjAwfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJpZ2h0QW5pbS5wYXVzZSgpO1xuICAgIH1cbiAgfSk7XG5cbiAgc3RhZ2UuYWRkQ2hpbGQoIGxlZnRBcm0gKTtcbiAgc3RhZ2UuYWRkQ2hpbGQoIHJpZ2h0QXJtICk7XG5cbiAgS2V5ZG9jLmFkZEV2ZW50TGlzdGVuZXIoJ2VzY2FwZScsZnVuY3Rpb24oKXtcbiAgICBxdWl0KCk7XG4gIH0pO1xuXG4gIHZhciBDb25zb2xlID0gcmVxdWlyZSgnLi9jb25zb2xlJyk7XG5cbiAgdmFyIHRlcm0gPSBuZXcgQ29uc29sZSgpO1xuICB0ZXJtLnBvc2l0aW9uLnggPSAxNTA7XG4gIHRlcm0ucG9zaXRpb24ueSA9IDUzMDtcbiAgc3RhZ2UuYWRkQ2hpbGQodGVybSk7XG5cbn0sXG5vbmZyYW1lOiBmdW5jdGlvbih0aW1lLGR0KXtcblxuICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuICB0d2Vlbi51cGRhdGUoKTtcblxufSxcbm9ucXVpdDogZnVuY3Rpb24oKXtcbiAgY29uc29sZS5sb2coJ0V4aXQgZ2FtZScpO1xufVxuXG59O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCJ2YXIgYWxpYXMgPSB7XG4gICdsZWZ0JyAgOiAzNyxcbiAgJ3VwJyAgICA6IDM4LFxuICAncmlnaHQnIDogMzksXG4gICdkb3duJyAgOiA0MCxcbiAgJ3NwYWNlJyA6IDMyLFxuICAndGFiJyAgIDogOSxcbiAgJ3BhZ2V1cCcgICAgOiAzMyxcbiAgJ3BhZ2Vkb3duJyAgOiAzNCxcbiAgJ2VzY2FwZScgICAgOiAyNyxcbiAgJ2JhY2tzcGFjZScgOiA4LFxuICAnbWV0YScgIDogOTEsXG4gICdhbHQnICAgOiAxOCxcbiAgJ2N0cmwnICA6IDE3LFxuICAnc2hpZnQnIDogMTYsXG4gICdlbnRlcicgOiAxMyxcbiAgJ2YxJyAgOiAxMTIsXG4gICdmMicgIDogMTEzLFxuICAnZjMnICA6IDExNCxcbiAgJ2Y0JyAgOiAxMTUsXG4gICdmNScgIDogMTE2LFxuICAnZjYnICA6IDExNyxcbiAgJ2Y3JyAgOiAxMTgsXG4gICdmOCcgIDogMTE5LFxuICAnZjknICA6IDEyMCxcbiAgJ2YxMCcgOiAxMjEsXG4gICdmMTEnIDogMTIyLFxuICAnZjEyJyA6IDEyM1xufTtcblxudmFyIGxpc3RlbmVycyA9IHt9O1xuXG52YXIgcHJlc3NlZCA9IHt9O1xuXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJyxmdW5jdGlvbihldmVudCl7XG4gIC8vIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIHZhciBrZXlDb2RlID0gZXZlbnQua2V5Q29kZSB8fMKgZXZlbnQud2hpY2g7XG4gIHByZXNzZWRba2V5Q29kZV0gPSBmYWxzZTtcbn0sZmFsc2UpO1xuXG5kb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLGZ1bmN0aW9uKGV2ZW50KXtcbiAgLy8gZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgY29uc29sZS5sb2coZXZlbnQpO1xuICB2YXIga2V5Q29kZSA9IGV2ZW50LmtleUNvZGUgfHzCoGV2ZW50LndoaWNoO1xuICBwcmVzc2VkW2tleUNvZGVdID0gdHJ1ZTtcbiAgT2JqZWN0LmtleXMobGlzdGVuZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleXMpe1xuICAgIHZhciBpLGxlbjtcbiAgICB2YXIgYXJyID0ga2V5cy5zcGxpdCgnKycpO1xuICAgIGZvciggaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSApIHtcbiAgICAgIGtleSA9IGFycltpXTtcbiAgICAgIGtleUNvZGUgPSBhbGlhc1trZXldIHx8IGtleS50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XG4gICAgICBpZiggIXByZXNzZWRba2V5Q29kZV0gKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHByb3AgPSB0cnVlO1xuICAgIGFyciA9IGxpc3RlbmVyc1trZXlzXTtcbiAgICBmb3IoIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuICYmIHByb3A7IGkgKz0gMSApwqB7XG4gICAgICBhcnJbaV0uY2FsbChudWxsLGV2ZW50KTtcbiAgICB9XG4gIH0pO1xufSxmYWxzZSk7XG5cbmV4cG9ydHMuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdID09PSB1bmRlZmluZWQgKSB7XG4gICAgbGlzdGVuZXJzW2tleXNdID0gW107XG4gIH1cbiAgaWYoIGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEgKSB7XG4gICAgbGlzdGVuZXJzW2tleXNdLnB1c2gobGlzdGVuZXIpO1xuICB9XG59O1xuXG5leHBvcnRzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKXtcbiAgdmFyIGtleXMgPSB0eXBlLnNwbGl0KCcrJykuc29ydCgpLmpvaW4oJysnKTtcbiAgaWYoIGxpc3RlbmVyc1trZXlzXSAhPT0gdW5kZWZpbmVkICkge1xuICAgIHZhciBpbmRleCA9IGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiggaW5kZXggIT09IC0xICkge1xuICAgICAgbGlzdGVuZXJzW2tleXNdLnNwbGljZShpbmRleCwxKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuaGFzRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdID09PSB1bmRlZmluZWQgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICl7XG4gIHZhciB0eXBlID0gZXZlbnQudHlwZTtcbiAgaWYoIGxpc3RlbmVyc1t0eXBlXSA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0ZW5lcnNbdHlwZV0uZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgbGlzdGVuZXIuY2FsbChldmVudCk7XG4gIH0pO1xufTtcbiJdfQ==
