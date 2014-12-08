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
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./animation":1,"./animations/leftarm":2,"./animations/rightarm":3}],5:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);

var bg = pixi.Sprite.fromImage('img/background.png');

bg.anchor.x = 0;
bg.anchor.y = 0;
bg.position.x = 0;
bg.position.y = 0;

exports.addTo = function(stage){
  stage.addChild(bg);
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
(function (global){
var Gui = (typeof window !== "undefined" ? window.dat.GUI : typeof global !== "undefined" ? global.dat.GUI : null);
var gui = new Gui();
module.exports = gui;
gui.domElement.style.display = 'none';

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
var Timer = require('./timer');
var Terminal = require('./terminal');
var Progress = require('./progress');
var Stats = require('./stats');
var snow = require('./snow');

var timer = new Timer({msph:1500});
var terminal = new Terminal();

var score = {
  points: 0,
}

var progress = new Progress(score,'points');
progress.setSize(310,10).setLimit(1000).build();

var seconds = 0;

var boost = function(amnt){
  score.points += amnt;
  score.points = Math.min( Math.max( score.points + amnt, 0 ),1000 );
};

var stats = [
  'creativity',
  'sleep',
  'drink',
  'eat',
  'shower'
];

timer.onUpdate(function(time){
  var sec = Math.floor(time);
  if( sec !== seconds ){
    stats.forEach(function(stat){
      boost( Stats.get(stat).influence() );
    });
    snow.setSize( (1000 - score.points) / 100  );
    Progress.update();
  }
});

exports.addTo = function(stage){
  timer.position.x = 620;
  timer.position.y = 40;
  stage.addChild(timer);
  terminal.position.x = 150;
  terminal.position.y = 495;
  stage.addChild(terminal);
  progress.position.x = 230;
  progress.position.y = 56;
  stage.addChild(progress);
  var stat = new Stats('creativity',0xffcc55,-0.5);
  stat.position.x = 580;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('sleep',0xde87cd,3);
  stat.position.x = 620;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('drink',0x37c871,10);
  stat.position.x = 660;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('eat',0xd3575f,6);
  stat.position.x = 700;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('shower',0x5f8dd3,2);
  stat.position.x = 740;
  stat.position.y = 300;
  stage.addChild(stat);
};

var initStats = function(){
  Stats.get('sleep').value = 100;
  Stats.get('creativity').value = 10;
  Stats.get('eat').value = 80;
  Stats.get('drink').value = 70;
  Stats.get('shower').value = 70;
  Stats.enable = true;
};

exports.play = function(){
  score.points = 0;
  initStats();
  timer.reset().onComplete(function(){
    Stats.enable = false;
    terminal.println('Time is up! Your score: '+Math.round(score.points));
  }).start();
};

exports.boost = boost;

exports.fastForward = function(dt){
  // timer.time = Math.min(timer.time-dt,0);
  timer.fastForward(dt);
};


},{"./progress":9,"./snow":12,"./stats":13,"./terminal":14,"./timer":15}],9:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],10:[function(require,module,exports){
var game = require('./game');
var topics = require('./topics');
var Stats = require('./stats');

module.exports = function(text){

  text = text.toLowerCase();
  var args = text.split(' ');

  var com = commands[args[0]||''];
  if(!com){
    return 'Try help/list';
  }

  var inp = args[1] || '';
  var opt = com.options;
  if( !opt ) {
    return com.action(inp);
  } else {
    if( opt.indexOf(inp) === - 1 ) {
      return 'Option doesn\'t exist';
    } else {
      return com.action(inp);
    }
  }

};

var selectRandom = function(arr){
  return arr[ Math.floor(arr.length*Math.random()) ];
};

var commands = {

  help: {
    info: [ 'I am HELP', 'rtfm', 'Helpcetion' ],
    action: function(arg){
      if( arg === '' ) {
        return 'Type two words';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var info = com.info || ['Contact Admin'];
      return selectRandom(com.info);
    }
  },
  list: {
    info: ['Show options'],
    action: function(arg){
      if( arg === '' ) {
        return 'Use your imagination ;)';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var options = com.options || ['EVERYTHING'];
      return arg+' '+options.join(',');
    }
  },
  'goto': {
    info: [ 'Go somewhere', 'Don\'t just sit there' ],
    options: ['shop','bed','bathroom'],
    action: function(arg){
      if( arg === 'shop' ) {
        return 'On weekends the shop is closed';
      }
      if( arg === 'bed' ) {
        Stats.get('sleep').value = 80 + 20 * Math.random();
        game.fastForward( 5 + Math.random()*2 );
        return 'You awake well rested';
      }
      if( arg == 'bathroom' ) {
        Stats.get('shower').addValue( 10 + Math.random() *10 );
        return 'Flush!!';
      }
      return 'Not implemented';
    }
  },

  eat: {
    info: [ 'Eat something', 'Are you hungry?', 'Mmmmhm!!' ],
    options: ['sandwich','cake','pizza'],
    action: function(arg){
      Stats.get('eat').addValue( 30 * Math.random()*30 );
      game.fastForward(0.2);
      return 'Yummy ... '+arg;
    }
  },
  'new' : {
    info: [ 'Start a new game'],
    options: ['game'],
    action: function(arg){
      game.play();
      return 'Topic: '+topics[Math.floor(topics.length*Math.random())];
    }
  },
  drink : {
    info: ['Drink something','Don\'t dehydrate','Gulp!'],
    options: ['coffee','coke','water','beer'],
    action: function(arg){
      Stats.get('drink').addValue( 30 * Math.random()*30 );
      if( arg === 'coffee' || arg == 'coke' ) {
        Stats.get('sleep').addValue( Math.random()*20 );
      }
      game.fastForward(0.1);
      return 'Schlurp!';
    }
  },
  write : {
    info: ['Write something','Lorem Ipsum Dolor Sit Amet'],
    options: ['code','todo'],
    action: function(arg){
      Stats.get('creativity').addValue(20*Math.random());
      game.fastForward( 6 * Math.random());
      if( arg === 'code' && Math.random() > 0.7 ) {
        game.boost(100);
        return 'Good work!';
      } else {
        if( Math.random() > 0.6 ) {
          game.boost(-40);
          return 'Ups, a bug!';
        }
      }
      return 'Don\'t panic!';
    }
  },
  speak : {
    info: ['Speak with somebody','Bla bla bla'],
    options: ['gf','mum','mentor'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  get : {
    info: ['Getter/Setter'],
    options: ['gf','supplies','framework'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  improve : {
    info: ['Nobody is perfect'],
    options: ['graphics','gameplay'],
    action: function(arg){
      game.boost( 50 + 80 * Math.random() );
      game.fastForward(2);
      return 'Getting there!';
    }
  },
  take : {
    info: ['Take me on...','...take on me'],
    options: ['shower','break'],
    action: function(arg){
      Stats.get('creativity').addValue(20);
      if( arg === 'shower' ) {
        Stats.get('shower').value = 80 + Math.random()*20;
        game.fastForward(0.5);
        return 'clean body = clean mind';
      } else {
        Stats.get('sleep').addValue(30);
        return 'Breaking bad ;)';
      }
    }
  }
};

},{"./game":8,"./stats":13,"./topics":16}],11:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./arms":4,"./background":5,"./game":8,"./progress":9,"./snow":12,"./stats":13}],12:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);

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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],13:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./progress":9}],14:[function(require,module,exports){
(function (global){
var gui = require('./debug');
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;
var repl = require('./repl');

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
  return ( k>=65 && k<=90 ) || k === Alias.space;
};

var Terminal = function(){
  DOC.apply(this);
  this.enabled = false;
  var bg = new pixi.Graphics();
  this.addChild(bg);
  bg.lineStyle(4,0x000000);
  bg.beginFill(0xffffff);
  bg.drawRect(0,0,496,96);
  this.prefix = '>';
  this.lines = [];
  this.lineno = 0;
  this.buffer = 'NEW GAME';
  this.lastLine = '';
  this.cursor = 8;
  this.min = 0;
  this.output = new pixi.Text('Type something',{font: 'bold 32px VT323'});
  this.output.position.x = 12;
  this.output.position.y = 12;
  this.addChild(this.output);
  this.line = new pixi.Text('>',{font: 'bold 32px VT323'});
  this.line.position.x = 12;
  this.line.position.y = 52;
  this.addChild(this.line);
  this.online = [];
  var _this = this;
  this.renderText();

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

Terminal.prototype = Object.create(DOC.prototype);

Terminal.prototype.renderText = function(){
  this.min = Math.max( this.cursor-32,0 );
  this.line.setText(this.prefix+this.buffer.substr(this.min,32));
  return this;
};

Terminal.prototype.removeChar = function(){
  var buffer = this.buffer;
  var len = buffer.length;
  var cursor = this.cursor;
  if( cursor > 0 ) {
    this.buffer = buffer.substring(0,cursor-1)+buffer.substring(cursor,len);
    this.cursor -= 1;
  }
  return this;
};

Terminal.prototype.pushChar = function(c){
  var cursor = this.cursor;
  var buffer = this.buffer;
  this.buffer = buffer.substring(0,cursor) + c + buffer.substring(cursor,buffer.length);
  this.cursor += 1;
  return this;
};

Terminal.prototype.moveCursor = function(d){
  var cursor = this.cursor + d;
  var len = this.buffer.length;
  if( cursor >= 0 && cursor <= len ) {
    this.cursor = cursor;
  }
  return this;
};

Terminal.prototype.pushLine = function(){
  this.lineno = this.lines.push( this.buffer );
  this.println( repl(this.buffer) );
  this.buffer = '';
  this.cursor = 0;
  return this;
};

Terminal.prototype.moveHistory = function(d){
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
  return this;
};

Terminal.prototype.println = function(text){
  this.output.setText(text);
  return this;
};

module.exports = Terminal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./debug":6,"./repl":10}],15:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var DOC = pixi.DisplayObjectContainer;
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
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
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],16:[function(require,module,exports){
module.exports = [
'Entire Game on One Screen',
'Artificial Life',
'Snowman',
'After the End',
'Death is Useful',
'One Rule',
'Generation',
'Avoid the Light',
'Deep Space',
'You Are Not Sup. 2 Be Here',
'Everything Falls Apart',
'End Where You Started',
'Isolation',
'Machines',
'You Can’t Stop',
'Color is Everything',
'Playing Both Sides',
'Borders',
'Chaos',
'Deja vu'
];
},{}],17:[function(require,module,exports){
(function (global){
var pixi = (typeof window !== "undefined" ? window.PIXI : typeof global !== "undefined" ? global.PIXI : null);
var Fonts = require('./fonts');
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

window.audio = new Audio('mp3/typing.mp3');
window.audio.loop = true;
window.audio.play();

var game = require('./setup');

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
},{"./fonts":7,"./setup":11}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9hbmltYXRpb24uanMiLCJzcmMvYW5pbWF0aW9ucy9sZWZ0YXJtLmpzIiwic3JjL2FuaW1hdGlvbnMvcmlnaHRhcm0uanMiLCJzcmMvYXJtcy5qcyIsInNyYy9iYWNrZ3JvdW5kLmpzIiwic3JjL2RlYnVnLmpzIiwic3JjL2ZvbnRzLmpzIiwic3JjL2dhbWUuanMiLCJzcmMvcHJvZ3Jlc3MuanMiLCJzcmMvcmVwbC5qcyIsInNyYy9zZXR1cC5qcyIsInNyYy9zbm93LmpzIiwic3JjL3N0YXRzLmpzIiwic3JjL3Rlcm1pbmFsLmpzIiwic3JjL3RpbWVyLmpzIiwic3JjL3RvcGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgVFdFRU4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcbnZhciBUd2VlbiA9IFRXRUVOLlR3ZWVuO1xudmFyIGN1cnZlID0gVFdFRU4uRWFzaW5nLlNpbnVzb2lkYWwuSW5PdXQ7XG52YXIgZHRvciA9IE1hdGguUEkgLyAxODA7XG52YXIgcnRvZCA9IDE4MCAvIE1hdGguUEk7XG5cbnZhciBBbmltYXRpb24gPSBmdW5jdGlvbihzcHJpdGUsZnJhbWVzKXtcblxuICB0aGlzLmZyYW1lcyA9IGZyYW1lcyB8fCBbXTtcbiAgdGhpcy5zcHJpdGUgPSBzcHJpdGU7XG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKXtcbiAgICBzcHJpdGUucG9zaXRpb24ueCA9IHRoaXMucG9zeDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IHRoaXMucG9zeTtcbiAgICBzcHJpdGUucm90YXRpb24gPSB0aGlzLnJvdDtcbiAgfTtcbiAgdGhpcy5jdXJzb3IgPSAwO1xuICB0aGlzLmxvb3AgPSBmYWxzZTtcblxufTtcblxudmFyIGZvcm1hdCA9IGZ1bmN0aW9uKCBmcmFtZSApe1xuICByZXR1cm4ge1xuICAgIHBvc3g6IGZyYW1lLnBvc2l0aW9uLnggfHwgMCxcbiAgICBwb3N5OiBmcmFtZS5wb3NpdGlvbi55IHx8IDAsXG4gICAgcm90OiAoZnJhbWUucm90YXRpb258fDApICogZHRvclxuICB9O1xufTtcblxuQW5pbWF0aW9uLnByb3RvdHlwZSA9IHtcblxuICBjb25zdHJ1Y3RvcjogQW5pbWF0aW9uLFxuICBidWlsZDogZnVuY3Rpb24ob3B0aW9ucyl7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHzCoHt9O1xuICAgIHRoaXMubG9vcCA9IG9wdGlvbnMubG9vcCB8fCB0aGlzLmxvb3A7XG4gICAgdGhpcy5jdXJzb3IgPSBvcHRpb25zLmN1cnNvciB8fCB0aGlzLmN1cnNvcjtcbiAgICB2YXIgZnJhbWVzID0gdGhpcy5mcmFtZXM7XG4gICAgdmFyIGxlbiA9IGZyYW1lcy5sZW5ndGg7XG4gICAgdmFyIGRvTG9vcCA9IHRoaXMubG9vcDtcbiAgICB2YXIgb2Zmc2V0ID0gdGhpcy5jdXJzb3I7XG4gICAgdmFyIGkgPSBvZmZzZXQ7XG4gICAgdmFyIG9uZnJhbWUgPSB0aGlzLm9uZnJhbWU7XG5cbiAgICB2YXIgbGFzdCwgZmlyc3QsIHR3ZWVuLCBmcmFtZTtcblxuICAgIHZhciBtYXggPSBpICsgbGVuO1xuXG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHZhciBjb21wbGV0ZSA9IGZ1bmN0aW9uKGYpe1xuICAgICAgdmFyIGZvcm0gPSBmb3JtYXQoZnJhbWVzW2ZdKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLnBvc3ggPSBmb3JtLnBvc3g7XG4gICAgICAgIHRoaXMucG9zeSA9IGZvcm0ucG9zeTtcbiAgICAgICAgdGhpcy5yb3QgPSBmb3JtLnJvdDtcbiAgICAgICAgaWYoX3RoaXMub25mcmFtZSkge1xuICAgICAgICAgIG9uZnJhbWUuY2FsbChmcmFtZXMsZik7XG4gICAgICAgIH1cbiAgICAgICAgX3RoaXMuY3Vyc29yID0gKGYrMSkgJSBsZW47XG4gICAgICB9O1xuICAgIH07XG5cblxuICAgIHdoaWxlKCBpIDwgbWF4KSB7XG4gICAgICBmcmFtZSA9IGZyYW1lc1tpJWxlbl07XG4gICAgICB0d2VlbiA9IG5ldyBUd2Vlbihmb3JtYXQoZnJhbWUpKTtcbiAgICAgIHZhciBvbmNvbXBsZXRlID0gY29tcGxldGUoaSVsZW4pO1xuICAgICAgdmFyIG9uc3RvcCA9IHN0b3AoaSVsZW4pO1xuICAgICAgaSA9IGkgKyAxO1xuICAgICAgdmFyIG5leHQgPSBmcmFtZXNbaSVsZW5dO1xuICAgICAgdHdlZW4udG8oZm9ybWF0KG5leHQpLG5leHQuZHVyYXRpb258fDEwMDApXG4gICAgICAuZGVsYXkobmV4dC5kZWxheXx8MClcbiAgICAgIC5lYXNpbmcoY3VydmUpXG4gICAgICAub25VcGRhdGUodGhpcy51cGRhdGUpLm9uQ29tcGxldGUob25jb21wbGV0ZSk7XG4gICAgICBpZiggISFsYXN0ICkge1xuICAgICAgICBsYXN0LmNoYWluKHR3ZWVuKTtcbiAgICAgIH1cbiAgICAgIGlmKCAhZmlyc3QgKSB7XG4gICAgICAgIGZpcnN0ID0gdHdlZW47XG4gICAgICB9XG4gICAgICBsYXN0ID0gdHdlZW47XG4gICAgfVxuXG4gICAgaWYoIGRvTG9vcCApIHtcbiAgICAgIGxhc3QuY2hhaW4oZmlyc3QpO1xuICAgIH1cblxuICAgIHRoaXMudHdlZW4gPSBmaXJzdDtcblxuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICBwbGF5OiBmdW5jdGlvbihvcHRpb25zKXtcbiAgICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgICB0aGlzLmJ1aWxkKG9wdGlvbnMpO1xuICAgIHZhciBmaXJzdCA9IHRoaXMudHdlZW47XG4gICAgdmFyIHRpbWUgPSBvcHRpb25zLnRyYW5zaXRpb247XG4gICAgaWYoIHRpbWUgKSB7XG4gICAgICBkdCA9IGR0IHx8IDA7XG4gICAgICB2YXIgZnJhbWUgPSB0aGlzLmZyYW1lc1sgdGhpcy5jdXJzb3IgJSB0aGlzLmZyYW1lcy5sZW5ndGggXTtcbiAgICAgIHZhciBzdGF0dXMgPSB0aGlzLnNwcml0ZVN0YXR1cygpO1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMudHdlZW4gPSBuZXcgVHdlZW4oZm9ybWF0KHN0YXR1cykpXG4gICAgICAudG8oZm9ybWF0KGZyYW1lKSx0aW1lKVxuICAgICAgLmRlbGF5KG9wdGlvbnMuZGVsYXl8fDApXG4gICAgICAuZWFzaW5nKGN1cnZlKVxuICAgICAgLm9uVXBkYXRlKHRoaXMudXBkYXRlKVxuICAgICAgLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICAgICAgX3RoaXMudHdlZW4gPSBmaXJzdDtcbiAgICAgICAgZmlyc3Quc3RhcnQoKTtcbiAgICAgIH0pLm9uU3RvcChmdW5jdGlvbigpe1xuICAgICAgICBfdGhpcy50d2VlbiA9IGZpcnN0O1xuICAgICAgfSkuc3RhcnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmlyc3Quc3RhcnQoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHBhdXNlOiBmdW5jdGlvbigpe1xuICAgIHRoaXMudHdlZW4uc3RvcCgpO1xuICAgIHRoaXMudHdlZW4uc3RvcENoYWluZWRUd2VlbnMoKTtcbiAgICB0aGlzLmN1cnNvciA9ICh0aGlzLmN1cnNvcisxKSV0aGlzLmZyYW1lcy5sZW5ndGg7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIHNwcml0ZVN0YXR1czogZnVuY3Rpb24oKXtcbiAgICByZXR1cm4ge1xuICAgICAgcG9zaXRpb246IHRoaXMuc3ByaXRlLnBvc2l0aW9uLFxuICAgICAgcm90YXRpb246IHRoaXMuc3ByaXRlLnJvdGF0aW9uICogcnRvZFxuICAgIH07XG4gIH0sXG4gIG9uRnJhbWU6IGZ1bmN0aW9uKGNiKXtcbiAgICB0aGlzLm9uZnJhbWUgPSBjYjtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAganVtcFRvOiBmdW5jdGlvbihpKXtcbiAgICBpID0gaSB8fCAwO1xuICAgIHZhciBmcmFtZSA9IHRoaXMuZnJhbWVzW2ldO1xuICAgIHRoaXMuY3Vyc29yID0gKGkrMSkgJSB0aGlzLmZyYW1lcy5sZW5ndGg7XG4gICAgdmFyIHNwcml0ZSA9IHRoaXMuc3ByaXRlO1xuICAgIHNwcml0ZS5wb3NpdGlvbi54ID0gZnJhbWUucG9zaXRpb24ueDtcbiAgICBzcHJpdGUucG9zaXRpb24ueSA9IGZyYW1lLnBvc2l0aW9uLnk7XG4gICAgc3ByaXRlLnJvdGF0aW9uID0gZnJhbWUucm90YXRpb24gKiBkdG9yO1xuICAgIHJldHVybiB0aGlzO1xuICB9LFxuICByZXBlYXQ6IGZ1bmN0aW9uKHRpbWVzKXtcbiAgICB2YXIgZnJhbWVzID0gW10uY29uY2F0KHRoaXMuZnJhbWVzKTtcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgdGltZXM7IGkgKz0gMSApe1xuICAgICAgdGhpcy5mcmFtZXMgPSB0aGlzLmZyYW1lcy5jb25jYXQoZnJhbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH0sXG4gIGNoYWluOiBmdW5jdGlvbihvdGhlcil7XG4gICAgdGhpcy5mcmFtZXMgPSB0aGlzLmZyYW1lcy5jb25jYXQob3RoZXIuZnJhbWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfSxcbiAgY2xvbmU6IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBBbmltYXRpb24odGhpcy5zcHJpdGUsW10uY29uY2F0KHRoaXMuZnJhbWVzKSk7XG4gIH1cbn07XG5cbkFuaW1hdGlvbi5sb2FkQWxsID0gZnVuY3Rpb24oc3ByaXRlLHNoZWV0KXtcbiAgdmFyIGFuaW1zID0ge307XG4gIE9iamVjdC5rZXlzKHNoZWV0KS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGFuaW1zW25hbWVdID0gbmV3IEFuaW1hdGlvbihzcHJpdGUsc2hlZXRbbmFtZV0pO1xuICB9KTtcbiAgcmV0dXJuIGFuaW1zO1xufTtcblxuQW5pbWF0aW9uLmxpbmsgPSBmdW5jdGlvbihsaXN0KXtcbiAgdmFyIGxpbmsgPSBuZXcgQW5pbWF0aW9uKGxpc3RbMF0uc3ByaXRlKTtcbiAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKGFuaW0pe1xuICAgIGxpbmsuZnJhbWVzID0gbGluay5mcmFtZXMuY29uY2F0KGFuaW0uZnJhbWVzKTtcbiAgfSk7XG4gIHJldHVybiBsaW5rO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBbmltYXRpb247XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0ge1xuICB0eXBpbmc6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNDAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxMixcbiAgICBkdXJhdGlvbjogMzAwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjoge1xuICAgICAgeDogMjYwLFxuICAgICAgeTogNjUwXG4gICAgfSxcbiAgICByb3RhdGlvbjogNixcbiAgICBkdXJhdGlvbjogMzAwXG4gIH1cbiAgXSxcbiAgcmVzdDogW1xuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDI1MCxcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDE3LFxuICAgIGR1cmF0aW9uOiA3MDBcbiAgfSxcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiAyNTAsXG4gICAgICB5OiA2NzBcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAxNyxcbiAgICBkdXJhdGlvbjogMTAwMFxuICB9LFxuXG4gIF1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICB0eXBpbmc6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA0ODgsXG4gICAgICB5OiA2NzNcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNTAsXG4gICAgZHVyYXRpb246IDIwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246wqB7XG4gICAgICB4OiA0NjgsXG4gICAgICB5OiA2NjhcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNTUsXG4gICAgZHVyYXRpb246IDMwMCxcbiAgICBkZWxheTogMTUwXG4gIH0sXG4gIHtcbiAgICBwb3NpdGlvbjrCoHtcbiAgICAgIHg6IDUwMCxcbiAgICAgIHk6IDY2MFxuICAgIH0sXG4gICAgcm90YXRpb246IDM0MyxcbiAgICBkdXJhdGlvbjogMzUwXG4gIH0sXG4gIF0sXG5cbiAgbW91c2U6IFtcbiAge1xuICAgIHBvc2l0aW9uOiB7XG4gICAgICB4OiA1NTQsXG4gICAgICB5OiA2NzNcbiAgICB9LFxuICAgIHJvdGF0aW9uOiAzNjgsXG4gICAgZHVyYXRpb246IDQwMFxuICB9LFxuICB7XG4gICAgcG9zaXRpb246IHtcbiAgICAgIHg6IDU1NixcbiAgICAgIHk6IDY3MFxuICAgIH0sXG4gICAgcm90YXRpb246IDM2OCxcbiAgICBkdXJhdGlvbjogNTAwXG4gIH1cbiAgXVxuXG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG52YXIgQW5pbWF0aW9uID0gcmVxdWlyZSgnLi9hbmltYXRpb24nKTtcblxudmFyIGxlZnRBcm0gPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9sZWZ0X2FybS5wbmcnKTtcbmxlZnRBcm0uYW5jaG9yLnggPSAwLjU7XG5sZWZ0QXJtLmFuY2hvci55ID0gMTtcblxudmFyIHJpZ2h0QXJtID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvcmlnaHRfYXJtLnBuZycpO1xucmlnaHRBcm0uYW5jaG9yLnggPSAwLjU7XG5yaWdodEFybS5hbmNob3IueSA9IDE7XG5cbnZhciBsZWZ0U2hlZXQgPSBBbmltYXRpb24ubG9hZEFsbChsZWZ0QXJtLHJlcXVpcmUoJy4vYW5pbWF0aW9ucy9sZWZ0YXJtJykpO1xudmFyIHJpZ2h0U2hlZXQgPSBBbmltYXRpb24ubG9hZEFsbChyaWdodEFybSxyZXF1aXJlKCcuL2FuaW1hdGlvbnMvcmlnaHRhcm0nKSk7XG5cbnZhciBsZWZ0QW5pbSA9IEFuaW1hdGlvbi5saW5rKFtcbiAgbGVmdFNoZWV0LnR5cGluZy5jbG9uZSgpLnJlcGVhdCg0KSxcbiAgbGVmdFNoZWV0LnJlc3Rcbl0pLmp1bXBUbygwKS5wbGF5KHtsb29wOiB0cnVlfSk7XG5cbnZhciByaWdodEFuaW0gPSBBbmltYXRpb24ubGluayhbXG4gIHJpZ2h0U2hlZXQudHlwaW5nLmNsb25lKCkucmVwZWF0KDIpLFxuICByaWdodFNoZWV0Lm1vdXNlLFxuICByaWdodFNoZWV0LnR5cGluZ10pXG4gIC5qdW1wVG8oMCkucGxheSh7bG9vcDp0cnVlfSk7XG5cbmV4cG9ydHMuYWRkVG8gPSBmdW5jdGlvbihzdGFnZSl7XG5cbiAgc3RhZ2UuYWRkQ2hpbGQobGVmdEFybSk7XG4gIHN0YWdlLmFkZENoaWxkKHJpZ2h0QXJtKTtcblxufTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xuXG52YXIgYmcgPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9iYWNrZ3JvdW5kLnBuZycpO1xuXG5iZy5hbmNob3IueCA9IDA7XG5iZy5hbmNob3IueSA9IDA7XG5iZy5wb3NpdGlvbi54ID0gMDtcbmJnLnBvc2l0aW9uLnkgPSAwO1xuXG5leHBvcnRzLmFkZFRvID0gZnVuY3Rpb24oc3RhZ2Upe1xuICBzdGFnZS5hZGRDaGlsZChiZyk7XG59O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgR3VpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuZGF0LkdVSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuZGF0LkdVSSA6IG51bGwpO1xudmFyIGd1aSA9IG5ldyBHdWkoKTtcbm1vZHVsZS5leHBvcnRzID0gZ3VpO1xuZ3VpLmRvbUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiZXhwb3J0cy5sb2FkID0gZnVuY3Rpb24oZmFtaWxpZXMsY2FsbGJhY2spe1xuXG4gIHdpbmRvdy5XZWJGb250Q29uZmlnID0ge1xuICAgIGdvb2dsZToge1xuICAgICAgZmFtaWxpZXM6IGZhbWlsaWVzXG4gICAgfSxcbiAgICBhY3RpdmU6IGNhbGxiYWNrXG4gIH07XG4gIChmdW5jdGlvbigpe1xuICAgIHZhciB3ZiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHdmLnNyYyA9ICgnaHR0cHM6JyA9PT0gZG9jdW1lbnQubG9jYXRpb24ucHJvdG9jb2wgPyAnaHR0cHMnIDogJ2h0dHAnKSArXG4gICAgJzovL2FqYXguZ29vZ2xlYXBpcy5jb20vYWpheC9saWJzL3dlYmZvbnQvMS93ZWJmb250LmpzJztcbiAgICB3Zi50eXBlID0gJ3RleHQvamF2YXNjcmlwdCc7XG4gICAgd2YuYXN5bmMgPSAndHJ1ZSc7XG4gICAgdmFyIHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JylbMF07XG4gICAgcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh3Ziwgcyk7XG4gIH0pKCk7XG59O1xuIiwidmFyIFRpbWVyID0gcmVxdWlyZSgnLi90aW1lcicpO1xudmFyIFRlcm1pbmFsID0gcmVxdWlyZSgnLi90ZXJtaW5hbCcpO1xudmFyIFByb2dyZXNzID0gcmVxdWlyZSgnLi9wcm9ncmVzcycpO1xudmFyIFN0YXRzID0gcmVxdWlyZSgnLi9zdGF0cycpO1xudmFyIHNub3cgPSByZXF1aXJlKCcuL3Nub3cnKTtcblxudmFyIHRpbWVyID0gbmV3IFRpbWVyKHttc3BoOjE1MDB9KTtcbnZhciB0ZXJtaW5hbCA9IG5ldyBUZXJtaW5hbCgpO1xuXG52YXIgc2NvcmUgPSB7XG4gIHBvaW50czogMCxcbn1cblxudmFyIHByb2dyZXNzID0gbmV3IFByb2dyZXNzKHNjb3JlLCdwb2ludHMnKTtcbnByb2dyZXNzLnNldFNpemUoMzEwLDEwKS5zZXRMaW1pdCgxMDAwKS5idWlsZCgpO1xuXG52YXIgc2Vjb25kcyA9IDA7XG5cbnZhciBib29zdCA9IGZ1bmN0aW9uKGFtbnQpe1xuICBzY29yZS5wb2ludHMgKz0gYW1udDtcbiAgc2NvcmUucG9pbnRzID0gTWF0aC5taW4oIE1hdGgubWF4KCBzY29yZS5wb2ludHMgKyBhbW50LCAwICksMTAwMCApO1xufTtcblxudmFyIHN0YXRzID0gW1xuICAnY3JlYXRpdml0eScsXG4gICdzbGVlcCcsXG4gICdkcmluaycsXG4gICdlYXQnLFxuICAnc2hvd2VyJ1xuXTtcblxudGltZXIub25VcGRhdGUoZnVuY3Rpb24odGltZSl7XG4gIHZhciBzZWMgPSBNYXRoLmZsb29yKHRpbWUpO1xuICBpZiggc2VjICE9PSBzZWNvbmRzICl7XG4gICAgc3RhdHMuZm9yRWFjaChmdW5jdGlvbihzdGF0KXtcbiAgICAgIGJvb3N0KCBTdGF0cy5nZXQoc3RhdCkuaW5mbHVlbmNlKCkgKTtcbiAgICB9KTtcbiAgICBzbm93LnNldFNpemUoICgxMDAwIC0gc2NvcmUucG9pbnRzKSAvIDEwMCAgKTtcbiAgICBQcm9ncmVzcy51cGRhdGUoKTtcbiAgfVxufSk7XG5cbmV4cG9ydHMuYWRkVG8gPSBmdW5jdGlvbihzdGFnZSl7XG4gIHRpbWVyLnBvc2l0aW9uLnggPSA2MjA7XG4gIHRpbWVyLnBvc2l0aW9uLnkgPSA0MDtcbiAgc3RhZ2UuYWRkQ2hpbGQodGltZXIpO1xuICB0ZXJtaW5hbC5wb3NpdGlvbi54ID0gMTUwO1xuICB0ZXJtaW5hbC5wb3NpdGlvbi55ID0gNDk1O1xuICBzdGFnZS5hZGRDaGlsZCh0ZXJtaW5hbCk7XG4gIHByb2dyZXNzLnBvc2l0aW9uLnggPSAyMzA7XG4gIHByb2dyZXNzLnBvc2l0aW9uLnkgPSA1NjtcbiAgc3RhZ2UuYWRkQ2hpbGQocHJvZ3Jlc3MpO1xuICB2YXIgc3RhdCA9IG5ldyBTdGF0cygnY3JlYXRpdml0eScsMHhmZmNjNTUsLTAuNSk7XG4gIHN0YXQucG9zaXRpb24ueCA9IDU4MDtcbiAgc3RhdC5wb3NpdGlvbi55ID0gMzAwO1xuICBzdGFnZS5hZGRDaGlsZChzdGF0KTtcbiAgc3RhdCA9IG5ldyBTdGF0cygnc2xlZXAnLDB4ZGU4N2NkLDMpO1xuICBzdGF0LnBvc2l0aW9uLnggPSA2MjA7XG4gIHN0YXQucG9zaXRpb24ueSA9IDMwMDtcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhdCk7XG4gIHN0YXQgPSBuZXcgU3RhdHMoJ2RyaW5rJywweDM3Yzg3MSwxMCk7XG4gIHN0YXQucG9zaXRpb24ueCA9IDY2MDtcbiAgc3RhdC5wb3NpdGlvbi55ID0gMzAwO1xuICBzdGFnZS5hZGRDaGlsZChzdGF0KTtcbiAgc3RhdCA9IG5ldyBTdGF0cygnZWF0JywweGQzNTc1Ziw2KTtcbiAgc3RhdC5wb3NpdGlvbi54ID0gNzAwO1xuICBzdGF0LnBvc2l0aW9uLnkgPSAzMDA7XG4gIHN0YWdlLmFkZENoaWxkKHN0YXQpO1xuICBzdGF0ID0gbmV3IFN0YXRzKCdzaG93ZXInLDB4NWY4ZGQzLDIpO1xuICBzdGF0LnBvc2l0aW9uLnggPSA3NDA7XG4gIHN0YXQucG9zaXRpb24ueSA9IDMwMDtcbiAgc3RhZ2UuYWRkQ2hpbGQoc3RhdCk7XG59O1xuXG52YXIgaW5pdFN0YXRzID0gZnVuY3Rpb24oKXtcbiAgU3RhdHMuZ2V0KCdzbGVlcCcpLnZhbHVlID0gMTAwO1xuICBTdGF0cy5nZXQoJ2NyZWF0aXZpdHknKS52YWx1ZSA9IDEwO1xuICBTdGF0cy5nZXQoJ2VhdCcpLnZhbHVlID0gODA7XG4gIFN0YXRzLmdldCgnZHJpbmsnKS52YWx1ZSA9IDcwO1xuICBTdGF0cy5nZXQoJ3Nob3dlcicpLnZhbHVlID0gNzA7XG4gIFN0YXRzLmVuYWJsZSA9IHRydWU7XG59O1xuXG5leHBvcnRzLnBsYXkgPSBmdW5jdGlvbigpe1xuICBzY29yZS5wb2ludHMgPSAwO1xuICBpbml0U3RhdHMoKTtcbiAgdGltZXIucmVzZXQoKS5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgU3RhdHMuZW5hYmxlID0gZmFsc2U7XG4gICAgdGVybWluYWwucHJpbnRsbignVGltZSBpcyB1cCEgWW91ciBzY29yZTogJytNYXRoLnJvdW5kKHNjb3JlLnBvaW50cykpO1xuICB9KS5zdGFydCgpO1xufTtcblxuZXhwb3J0cy5ib29zdCA9IGJvb3N0O1xuXG5leHBvcnRzLmZhc3RGb3J3YXJkID0gZnVuY3Rpb24oZHQpe1xuICAvLyB0aW1lci50aW1lID0gTWF0aC5taW4odGltZXIudGltZS1kdCwwKTtcbiAgdGltZXIuZmFzdEZvcndhcmQoZHQpO1xufTtcblxuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG52YXIgRE9DID0gcGl4aS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyO1xuXG52YXIgYWxsID0gW107XG5cbnZhciBQcm9ncmVzcyA9IGZ1bmN0aW9uKG9iaixrZXkpe1xuICBET0MuYXBwbHkodGhpcyk7XG4gIHRoaXMub2JqID0gb2JqO1xuICB0aGlzLmtleSA9IGtleTtcbiAgdGhpcy5mcm9tID0gb2JqW2tleV07XG4gIHRoaXMudG8gPSAxO1xuICB0aGlzLmJvcmRlciA9IDQ7XG4gIHRoaXMubGVuZ3RoID0gMTAwO1xuICB0aGlzLmRpbSA9IDIwO1xuICB0aGlzLmNvbG9ycyA9IHtcbiAgICBtYWluOiAweDAwMDBmZixcbiAgICBmaWxsOiAweGZmZmZmZixcbiAgICBib3JkZXI6IDB4MDAwMDAwXG4gIH07XG4gIHRoaXMub3JpZW50YXRpb24gPSAnaCc7XG4gIHRoaXMuYmFyID0gbmV3IHBpeGkuR3JhcGhpY3MoKTtcbiAgdGhpcy5hZGRDaGlsZCh0aGlzLmJhcik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUHJvZ3Jlc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShET0MucHJvdG90eXBlKTtcblxuUHJvZ3Jlc3MucHJvdG90eXBlLnNldExpbWl0ID0gZnVuY3Rpb24odmFsdWUpe1xuICB0aGlzLnRvID0gdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufTtcblByb2dyZXNzLnByb3RvdHlwZS5zZXRCb3JkZXIgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHRoaXMuYm9yZGVyID0gdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufTtcblByb2dyZXNzLnByb3RvdHlwZS5zZXRDb2xvcnMgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBjb2xvcnMgPSB0aGlzLmNvbG9ycztcbiAgdGhpcy5jb2xvcnMgPSB7XG4gICAgbWFpbjogdmFsdWUubWFpbiB8fCBjb2xvcnMubWFpbixcbiAgICBmaWxsOiB2YWx1ZS5maWxsIHx8IGNvbG9ycy5maWxsLFxuICAgIGJvcmRlcjogdmFsdWUuYm9yZGVyIHx8IGNvbG9ycy5ib3JkZXJcbiAgfTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUHJvZ3Jlc3MucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbihsZW5ndGgsZGltKXtcbiAgdGhpcy5sZW5ndGggPSBsZW5ndGggfHwgdGhpcy5sZW5ndGg7XG4gIHRoaXMuZGltID0gZGltIHx8wqB0aGlzLmRpbTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuUHJvZ3Jlc3MucHJvdG90eXBlLnNldE9yaWVudGF0aW9uID0gZnVuY3Rpb24odmFsdWUpe1xuICB0aGlzLm9yaWVudGF0aW9uID0gdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUHJvZ3Jlc3MucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMuYmFyLmJlZ2luRmlsbCh0aGlzLmNvbG9ycy5maWxsKTtcbiAgdGhpcy5iYXIuZHJhd1JlY3QoMCwwLHRoaXMubGVuZ3RoLHRoaXMuZGltKTtcbiAgdGhpcy5iYXIuZW5kRmlsbCgpO1xuICB0aGlzLmJhci5iZWdpbkZpbGwodGhpcy5jb2xvcnMubWFpbik7XG4gIHZhciBwcm9ncmVzcyA9IE1hdGgubWluKCAxLCAodGhpcy5vYmpbdGhpcy5rZXldLXRoaXMuZnJvbSkvKHRoaXMudG8tdGhpcy5mcm9tKSApO1xuICB0aGlzLmJhci5kcmF3UmVjdCgwLDAsdGhpcy5sZW5ndGgqcHJvZ3Jlc3MsdGhpcy5kaW0pO1xuICB0aGlzLmJhci5lbmRGaWxsKCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuUHJvZ3Jlc3MucHJvdG90eXBlLmJ1aWxkID0gZnVuY3Rpb24oKXtcblxuICB2YXIgaW5kZXggPSBhbGwuaW5kZXhPZih0aGlzKTtcbiAgaWYoIGluZGV4ICE9PSAtMSApIHtcbiAgICBhbGwuc3BsaWNlKGluZGV4LDEpO1xuICB9XG5cbiAgaWYoIHRoaXMub3JpZW50YXRpb24gPT09ICd2JyApIHtcbiAgICB0aGlzLmJhci5yb3RhdGlvbiA9IC0wLjUgKiBNYXRoLlBJO1xuICB9XG5cbiAgdGhpcy5iYXIubGluZVN0eWxlKHRoaXMuYm9yZGVyLHRoaXMuY29sb3JzLmJvcmRlcik7XG5cbiAgdGhpcy51cGRhdGUoKTtcblxuICBhbGwucHVzaCh0aGlzKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5Qcm9ncmVzcy51cGRhdGUgPSBmdW5jdGlvbigpe1xuICBhbGwuZm9yRWFjaChmdW5jdGlvbihwcm9nKXtcbiAgICBwcm9nLnVwZGF0ZSgpO1xuICB9KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZ3Jlc3M7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBnYW1lID0gcmVxdWlyZSgnLi9nYW1lJyk7XG52YXIgdG9waWNzID0gcmVxdWlyZSgnLi90b3BpY3MnKTtcbnZhciBTdGF0cyA9IHJlcXVpcmUoJy4vc3RhdHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih0ZXh0KXtcblxuICB0ZXh0ID0gdGV4dC50b0xvd2VyQ2FzZSgpO1xuICB2YXIgYXJncyA9IHRleHQuc3BsaXQoJyAnKTtcblxuICB2YXIgY29tID0gY29tbWFuZHNbYXJnc1swXXx8JyddO1xuICBpZighY29tKXtcbiAgICByZXR1cm4gJ1RyeSBoZWxwL2xpc3QnO1xuICB9XG5cbiAgdmFyIGlucCA9IGFyZ3NbMV0gfHwgJyc7XG4gIHZhciBvcHQgPSBjb20ub3B0aW9ucztcbiAgaWYoICFvcHQgKSB7XG4gICAgcmV0dXJuIGNvbS5hY3Rpb24oaW5wKTtcbiAgfSBlbHNlIHtcbiAgICBpZiggb3B0LmluZGV4T2YoaW5wKSA9PT0gLSAxICkge1xuICAgICAgcmV0dXJuICdPcHRpb24gZG9lc25cXCd0IGV4aXN0JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbS5hY3Rpb24oaW5wKTtcbiAgICB9XG4gIH1cblxufTtcblxudmFyIHNlbGVjdFJhbmRvbSA9IGZ1bmN0aW9uKGFycil7XG4gIHJldHVybiBhcnJbIE1hdGguZmxvb3IoYXJyLmxlbmd0aCpNYXRoLnJhbmRvbSgpKSBdO1xufTtcblxudmFyIGNvbW1hbmRzID0ge1xuXG4gIGhlbHA6IHtcbiAgICBpbmZvOiBbICdJIGFtIEhFTFAnLCAncnRmbScsICdIZWxwY2V0aW9uJyBdLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIGlmKCBhcmcgPT09ICcnICkge1xuICAgICAgICByZXR1cm4gJ1R5cGUgdHdvIHdvcmRzJztcbiAgICAgIH1cbiAgICAgIHZhciBjb20gPSBjb21tYW5kc1thcmddO1xuICAgICAgaWYoICFjb20gKSB7XG4gICAgICAgIHJldHVybiAnQ29tbWFuZCBkb2VzblxcJ3QgZXhpc3QnO1xuICAgICAgfVxuICAgICAgdmFyIGluZm8gPSBjb20uaW5mbyB8fCBbJ0NvbnRhY3QgQWRtaW4nXTtcbiAgICAgIHJldHVybiBzZWxlY3RSYW5kb20oY29tLmluZm8pO1xuICAgIH1cbiAgfSxcbiAgbGlzdDoge1xuICAgIGluZm86IFsnU2hvdyBvcHRpb25zJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgaWYoIGFyZyA9PT0gJycgKSB7XG4gICAgICAgIHJldHVybiAnVXNlIHlvdXIgaW1hZ2luYXRpb24gOyknO1xuICAgICAgfVxuICAgICAgdmFyIGNvbSA9IGNvbW1hbmRzW2FyZ107XG4gICAgICBpZiggIWNvbSApIHtcbiAgICAgICAgcmV0dXJuICdDb21tYW5kIGRvZXNuXFwndCBleGlzdCc7XG4gICAgICB9XG4gICAgICB2YXIgb3B0aW9ucyA9IGNvbS5vcHRpb25zIHx8IFsnRVZFUllUSElORyddO1xuICAgICAgcmV0dXJuIGFyZysnICcrb3B0aW9ucy5qb2luKCcsJyk7XG4gICAgfVxuICB9LFxuICAnZ290byc6IHtcbiAgICBpbmZvOiBbICdHbyBzb21ld2hlcmUnLCAnRG9uXFwndCBqdXN0IHNpdCB0aGVyZScgXSxcbiAgICBvcHRpb25zOiBbJ3Nob3AnLCdiZWQnLCdiYXRocm9vbSddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIGlmKCBhcmcgPT09ICdzaG9wJyApIHtcbiAgICAgICAgcmV0dXJuICdPbiB3ZWVrZW5kcyB0aGUgc2hvcCBpcyBjbG9zZWQnO1xuICAgICAgfVxuICAgICAgaWYoIGFyZyA9PT0gJ2JlZCcgKSB7XG4gICAgICAgIFN0YXRzLmdldCgnc2xlZXAnKS52YWx1ZSA9IDgwICsgMjAgKiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICBnYW1lLmZhc3RGb3J3YXJkKCA1ICsgTWF0aC5yYW5kb20oKSoyICk7XG4gICAgICAgIHJldHVybiAnWW91IGF3YWtlIHdlbGwgcmVzdGVkJztcbiAgICAgIH1cbiAgICAgIGlmKCBhcmcgPT0gJ2JhdGhyb29tJyApIHtcbiAgICAgICAgU3RhdHMuZ2V0KCdzaG93ZXInKS5hZGRWYWx1ZSggMTAgKyBNYXRoLnJhbmRvbSgpICoxMCApO1xuICAgICAgICByZXR1cm4gJ0ZsdXNoISEnO1xuICAgICAgfVxuICAgICAgcmV0dXJuICdOb3QgaW1wbGVtZW50ZWQnO1xuICAgIH1cbiAgfSxcblxuICBlYXQ6IHtcbiAgICBpbmZvOiBbICdFYXQgc29tZXRoaW5nJywgJ0FyZSB5b3UgaHVuZ3J5PycsICdNbW1taG0hIScgXSxcbiAgICBvcHRpb25zOiBbJ3NhbmR3aWNoJywnY2FrZScsJ3BpenphJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgU3RhdHMuZ2V0KCdlYXQnKS5hZGRWYWx1ZSggMzAgKiBNYXRoLnJhbmRvbSgpKjMwICk7XG4gICAgICBnYW1lLmZhc3RGb3J3YXJkKDAuMik7XG4gICAgICByZXR1cm4gJ1l1bW15IC4uLiAnK2FyZztcbiAgICB9XG4gIH0sXG4gICduZXcnIDoge1xuICAgIGluZm86IFsgJ1N0YXJ0IGEgbmV3IGdhbWUnXSxcbiAgICBvcHRpb25zOiBbJ2dhbWUnXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBnYW1lLnBsYXkoKTtcbiAgICAgIHJldHVybiAnVG9waWM6ICcrdG9waWNzW01hdGguZmxvb3IodG9waWNzLmxlbmd0aCpNYXRoLnJhbmRvbSgpKV07XG4gICAgfVxuICB9LFxuICBkcmluayA6IHtcbiAgICBpbmZvOiBbJ0RyaW5rIHNvbWV0aGluZycsJ0RvblxcJ3QgZGVoeWRyYXRlJywnR3VscCEnXSxcbiAgICBvcHRpb25zOiBbJ2NvZmZlZScsJ2Nva2UnLCd3YXRlcicsJ2JlZXInXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBTdGF0cy5nZXQoJ2RyaW5rJykuYWRkVmFsdWUoIDMwICogTWF0aC5yYW5kb20oKSozMCApO1xuICAgICAgaWYoIGFyZyA9PT0gJ2NvZmZlZScgfHwgYXJnID09ICdjb2tlJyApIHtcbiAgICAgICAgU3RhdHMuZ2V0KCdzbGVlcCcpLmFkZFZhbHVlKCBNYXRoLnJhbmRvbSgpKjIwICk7XG4gICAgICB9XG4gICAgICBnYW1lLmZhc3RGb3J3YXJkKDAuMSk7XG4gICAgICByZXR1cm4gJ1NjaGx1cnAhJztcbiAgICB9XG4gIH0sXG4gIHdyaXRlIDoge1xuICAgIGluZm86IFsnV3JpdGUgc29tZXRoaW5nJywnTG9yZW0gSXBzdW0gRG9sb3IgU2l0IEFtZXQnXSxcbiAgICBvcHRpb25zOiBbJ2NvZGUnLCd0b2RvJ10sXG4gICAgYWN0aW9uOiBmdW5jdGlvbihhcmcpe1xuICAgICAgU3RhdHMuZ2V0KCdjcmVhdGl2aXR5JykuYWRkVmFsdWUoMjAqTWF0aC5yYW5kb20oKSk7XG4gICAgICBnYW1lLmZhc3RGb3J3YXJkKCA2ICogTWF0aC5yYW5kb20oKSk7XG4gICAgICBpZiggYXJnID09PSAnY29kZScgJiYgTWF0aC5yYW5kb20oKSA+IDAuNyApIHtcbiAgICAgICAgZ2FtZS5ib29zdCgxMDApO1xuICAgICAgICByZXR1cm4gJ0dvb2Qgd29yayEnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoIE1hdGgucmFuZG9tKCkgPiAwLjYgKSB7XG4gICAgICAgICAgZ2FtZS5ib29zdCgtNDApO1xuICAgICAgICAgIHJldHVybiAnVXBzLCBhIGJ1ZyEnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gJ0RvblxcJ3QgcGFuaWMhJztcbiAgICB9XG4gIH0sXG4gIHNwZWFrIDoge1xuICAgIGluZm86IFsnU3BlYWsgd2l0aCBzb21lYm9keScsJ0JsYSBibGEgYmxhJ10sXG4gICAgb3B0aW9uczogWydnZicsJ211bScsJ21lbnRvciddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIHJldHVybiAnTm90IGltcGxlbWVudGVkJztcbiAgICB9XG4gIH0sXG4gIGdldCA6IHtcbiAgICBpbmZvOiBbJ0dldHRlci9TZXR0ZXInXSxcbiAgICBvcHRpb25zOiBbJ2dmJywnc3VwcGxpZXMnLCdmcmFtZXdvcmsnXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICByZXR1cm4gJ05vdCBpbXBsZW1lbnRlZCc7XG4gICAgfVxuICB9LFxuICBpbXByb3ZlIDoge1xuICAgIGluZm86IFsnTm9ib2R5IGlzIHBlcmZlY3QnXSxcbiAgICBvcHRpb25zOiBbJ2dyYXBoaWNzJywnZ2FtZXBsYXknXSxcbiAgICBhY3Rpb246IGZ1bmN0aW9uKGFyZyl7XG4gICAgICBnYW1lLmJvb3N0KCA1MCArIDgwICogTWF0aC5yYW5kb20oKSApO1xuICAgICAgZ2FtZS5mYXN0Rm9yd2FyZCgyKTtcbiAgICAgIHJldHVybiAnR2V0dGluZyB0aGVyZSEnO1xuICAgIH1cbiAgfSxcbiAgdGFrZSA6IHtcbiAgICBpbmZvOiBbJ1Rha2UgbWUgb24uLi4nLCcuLi50YWtlIG9uIG1lJ10sXG4gICAgb3B0aW9uczogWydzaG93ZXInLCdicmVhayddLFxuICAgIGFjdGlvbjogZnVuY3Rpb24oYXJnKXtcbiAgICAgIFN0YXRzLmdldCgnY3JlYXRpdml0eScpLmFkZFZhbHVlKDIwKTtcbiAgICAgIGlmKCBhcmcgPT09ICdzaG93ZXInICkge1xuICAgICAgICBTdGF0cy5nZXQoJ3Nob3dlcicpLnZhbHVlID0gODAgKyBNYXRoLnJhbmRvbSgpKjIwO1xuICAgICAgICBnYW1lLmZhc3RGb3J3YXJkKDAuNSk7XG4gICAgICAgIHJldHVybiAnY2xlYW4gYm9keSA9IGNsZWFuIG1pbmQnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgU3RhdHMuZ2V0KCdzbGVlcCcpLmFkZFZhbHVlKDMwKTtcbiAgICAgICAgcmV0dXJuICdCcmVha2luZyBiYWQgOyknO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIHR3ZWVuID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgUHJvZ3Jlc3MgPSByZXF1aXJlKCcuL3Byb2dyZXNzJyk7XG52YXIgU3RhdHMgPSByZXF1aXJlKCcuL3N0YXRzJyk7XG5cbnZhciBzdGFnZSA9IG5ldyBwaXhpLlN0YWdlKDB4NjZmZjQ0KTtcbnZhciByZW5kZXJlcixxdWl0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuYXNzZXRzOiBbXG4naW1nL2JhY2tncm91bmQucG5nJyxcbidpbWcvbGVmdF9hcm0ucG5nJyxcbidpbWcvcmlnaHRfYXJtLnBuZycsXG4naW1nL2ljb25zL3NsZWVwLnBuZycsXG4naW1nL2ljb25zL2NyZWF0aXZpdHkucG5nJyxcbidpbWcvaWNvbnMvZWF0LnBuZycsXG4naW1nL2ljb25zL2RyaW5rLnBuZycsXG4naW1nL2ljb25zL3Nob3dlci5wbmcnLFxuJ2ltZy9zbm93bWFuLnBuZydcbl0sXG5cbm9uaW5pdDogZnVuY3Rpb24oY29udGV4dCkge1xuICByZW5kZXJlciA9IGNvbnRleHQucmVuZGVyZXI7XG4gIHF1aXQgPSBjb250ZXh0LnF1aXQ7XG5cbiAgcmVxdWlyZSgnLi9zbm93JykuYWRkVG8oc3RhZ2UpO1xuICByZXF1aXJlKCcuL2JhY2tncm91bmQnKS5hZGRUbyhzdGFnZSk7XG4gIHJlcXVpcmUoJy4vYXJtcycpLmFkZFRvKHN0YWdlKTtcbiAgcmVxdWlyZSgnLi9nYW1lJykuYWRkVG8oc3RhZ2UpO1xuXG4gIC8vIHZhciBwaXhlbGF0ZUZpbHRlciA9IG5ldyBwaXhpLlBpeGVsYXRlRmlsdGVyKCk7XG4gIC8vIHZhciBwaXhlbGF0ZUZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1BpeGVsYXRlJyk7XG4gIC8vIHBpeGVsYXRlRm9sZGVyLmFkZChwaXhlbGF0ZUZpbHRlci5zaXplLCd4JywxLDMyKS5uYW1lKCdQaXhlbFNpemVYJyk7XG4gIC8vIHBpeGVsYXRlRm9sZGVyLmFkZChwaXhlbGF0ZUZpbHRlci5zaXplLCd5JywxLDMyKS5uYW1lKCdQaXhlbFNpemVZJyk7XG4gIC8vXG4gIC8vIHZhciBjb250YWluZXIgPSBuZXcgcGl4aS5EaXNwbGF5T2JqZWN0Q29udGFpbmVyKCk7XG4gIC8vIGNvbnRhaW5lci5maWx0ZXJzID0gWyBwaXhlbGF0ZUZpbHRlciBdO1xuICAvL1xuICAvLyBjb250YWluZXIuYWRkQ2hpbGQoYmFja2dyb3VuZCk7XG4gIC8vIHN0YWdlLmFkZENoaWxkKGNvbnRhaW5lcik7XG5cbn0sXG5vbmZyYW1lOiBmdW5jdGlvbih0aW1lLGR0KXtcblxuICByZW5kZXJlci5yZW5kZXIoc3RhZ2UpO1xuICB0d2Vlbi51cGRhdGUoKTtcbiAgU3RhdHMudXBkYXRlKGR0KTtcbiAgLy8gUHJvZ3Jlc3MudXBkYXRlKCk7XG5cbn0sXG5vbnF1aXQ6IGZ1bmN0aW9uKCl7XG4gIGNvbnNvbGUubG9nKCdFeGl0IGdhbWUnKTtcbn1cblxufTtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHBpeGkgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5QSVhJIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5QSVhJIDogbnVsbCk7XG5cbnZhciBmaWx0ZXIgPSBuZXcgcGl4aS5QaXhlbGF0ZUZpbHRlcigpO1xuZmlsdGVyLnNpemUueCA9IDIwO1xuZmlsdGVyLnNpemUueSA9IDIwO1xuXG52YXIgY29udGFpbmVyID0gbmV3IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcigpO1xuY29udGFpbmVyLmZpbHRlcnMgPSBbIGZpbHRlciBdO1xuXG52YXIgc3ByaXRlID0gcGl4aS5TcHJpdGUuZnJvbUltYWdlKCdpbWcvc25vd21hbi5wbmcnKTtcbnNwcml0ZS5hbmNob3IueCA9IDA7XG5zcHJpdGUuYW5jaG9yLnkgPSAwO1xuc3ByaXRlLnBvc2l0aW9uLnggPSAwO1xuc3ByaXRlLnBvc2l0aW9uLnkgPSAwO1xuY29udGFpbmVyLmFkZENoaWxkKHNwcml0ZSk7XG5cbmV4cG9ydHMuYWRkVG8gPSBmdW5jdGlvbihzdGFnZSl7XG5cbiAgc3RhZ2UuYWRkQ2hpbGQoY29udGFpbmVyKTtcblxufTtcblxuZXhwb3J0cy5zZXRTaXplID0gZnVuY3Rpb24oeCl7XG4gIGZpbHRlci5zaXplLnggPSB4O1xuICBmaWx0ZXIuc2l6ZS55ID0geDtcbn1cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIFByb2dyZXNzID0gcmVxdWlyZSgnLi9wcm9ncmVzcycpO1xudmFyIERPQyA9IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcjtcblxudmFyIGFsbCA9IHt9O1xuXG52YXIgbGlzdCA9IFtdO1xuXG52YXIgU3RhdHMgPSBmdW5jdGlvbihuYW1lLGNvbG9yLHNwZWVkLGZhY3Rvcil7XG4gIERPQy5hcHBseSh0aGlzKTtcbiAgdGhpcy52YWx1ZSA9IDA7XG4gIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgdGhpcy5mYWN0b3IgPSBmYWN0b3IgfHwgMTtcbiAgdmFyIGJhciA9IG5ldyBQcm9ncmVzcyh0aGlzLCd2YWx1ZScpXG4gICAgLnNldExpbWl0KDEwMClcbiAgICAuc2V0U2l6ZSgxNTAsMjApXG4gICAgLnNldE9yaWVudGF0aW9uKCd2JylcbiAgICAuc2V0Qm9yZGVyKDEpXG4gICAgLnNldENvbG9ycyh7bWFpbjpjb2xvcn0pXG4gICAgLmJ1aWxkKCk7XG5cbiAgdmFyIGljb24gPSBwaXhpLlNwcml0ZS5mcm9tSW1hZ2UoJ2ltZy9pY29ucy8nK25hbWUrJy5wbmcnKTtcbiAgYmFyLnBvc2l0aW9uLnggPSA1O1xuICBiYXIucG9zaXRpb24ueSA9IC0xMDtcbiAgdGhpcy5hZGRDaGlsZChiYXIpO1xuICB0aGlzLmFkZENoaWxkKGljb24pO1xuICBhbGxbbmFtZV0gPSB0aGlzO1xuICBsaXN0LnB1c2godGhpcyk7XG59XG5cblN0YXRzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRE9DLnByb3RvdHlwZSk7XG5cblN0YXRzLnByb3RvdHlwZS5hZGRWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdGhpcy52YWx1ZSA9IE1hdGgubWluKE1hdGgubWF4KHRoaXMudmFsdWUrdmFsdWUsMCksMTAwKTtcbn1cblxuU3RhdHMucHJvdG90eXBlLmluZmx1ZW5jZSA9IGZ1bmN0aW9uKCl7XG4gIHJldHVybiAodGhpcy52YWx1ZSkvMTAwMCAqIHRoaXMuZmFjdG9yO1xufTtcblxuU3RhdHMuZ2V0ID0gZnVuY3Rpb24obmFtZSl7XG4gIHJldHVybiBhbGxbbmFtZV07XG59XG5cblN0YXRzLmVuYWJsZSA9IGZhbHNlO1xuXG5TdGF0cy51cGRhdGUgPSBmdW5jdGlvbihkdCl7XG4gIGlmKFN0YXRzLmVuYWJsZSl7XG4gICAgbGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHN0YXQpe1xuICAgICAgc3RhdC52YWx1ZSA9IE1hdGgubWF4KHN0YXQudmFsdWUgLSBkdC8xMDAwICogc3RhdC5zcGVlZCwgMCk7XG4gICAgfSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBTdGF0cztcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBndWkgPSByZXF1aXJlKCcuL2RlYnVnJyk7XG52YXIgcGl4aSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlBJWEkgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlBJWEkgOiBudWxsKTtcbnZhciBET0MgPSBwaXhpLkRpc3BsYXlPYmplY3RDb250YWluZXI7XG52YXIgcmVwbCA9IHJlcXVpcmUoJy4vcmVwbCcpO1xuXG52YXIgQWxpYXMgPSB7XG4gIGxlZnQgICAgICA6IDM3LFxuICB1cCAgICAgICAgOiAzOCxcbiAgcmlnaHQgICAgIDogMzksXG4gIGRvd24gICAgICA6IDQwLFxuICBzcGFjZSAgICAgOiAzMixcbiAgdGFiICAgICAgIDogOSxcbiAgcGFnZXVwICAgIDogMzMsXG4gIHBhZ2Vkb3duICA6IDM0LFxuICBlc2NhcGUgICAgOiAyNyxcbiAgYmFja3NwYWNlIDogOCxcbiAgbWV0YSAgICAgIDogOTEsXG4gIGFsdCAgICAgICA6IDE4LFxuICBjdHJsICAgICAgOiAxNyxcbiAgc2hpZnQgICAgIDogMTYsXG4gIGVudGVyICAgICA6IDEzLFxuICBmMSAgICAgICAgOiAxMTIsXG4gIGYyICAgICAgICA6IDExMyxcbiAgZjMgICAgICAgIDogMTE0LFxuICBmNCAgICAgICAgOiAxMTUsXG4gIGY1ICAgICAgICA6IDExNixcbiAgZjYgICAgICAgIDogMTE3LFxuICBmNyAgICAgICAgOiAxMTgsXG4gIGY4ICAgICAgICA6IDExOSxcbiAgZjkgICAgICAgIDogMTIwLFxuICBmMTAgICAgICAgOiAxMjEsXG4gIGYxMSAgICAgICA6IDEyMixcbiAgZjEyICAgICAgIDogMTIzXG59O1xuXG52YXIgaXNWYWxpZEtleSA9IGZ1bmN0aW9uKGspe1xuICByZXR1cm4gKCBrPj02NSAmJiBrPD05MCApIHx8IGsgPT09IEFsaWFzLnNwYWNlO1xufTtcblxudmFyIFRlcm1pbmFsID0gZnVuY3Rpb24oKXtcbiAgRE9DLmFwcGx5KHRoaXMpO1xuICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgdmFyIGJnID0gbmV3IHBpeGkuR3JhcGhpY3MoKTtcbiAgdGhpcy5hZGRDaGlsZChiZyk7XG4gIGJnLmxpbmVTdHlsZSg0LDB4MDAwMDAwKTtcbiAgYmcuYmVnaW5GaWxsKDB4ZmZmZmZmKTtcbiAgYmcuZHJhd1JlY3QoMCwwLDQ5Niw5Nik7XG4gIHRoaXMucHJlZml4ID0gJz4nO1xuICB0aGlzLmxpbmVzID0gW107XG4gIHRoaXMubGluZW5vID0gMDtcbiAgdGhpcy5idWZmZXIgPSAnTkVXIEdBTUUnO1xuICB0aGlzLmxhc3RMaW5lID0gJyc7XG4gIHRoaXMuY3Vyc29yID0gODtcbiAgdGhpcy5taW4gPSAwO1xuICB0aGlzLm91dHB1dCA9IG5ldyBwaXhpLlRleHQoJ1R5cGUgc29tZXRoaW5nJyx7Zm9udDogJ2JvbGQgMzJweCBWVDMyMyd9KTtcbiAgdGhpcy5vdXRwdXQucG9zaXRpb24ueCA9IDEyO1xuICB0aGlzLm91dHB1dC5wb3NpdGlvbi55ID0gMTI7XG4gIHRoaXMuYWRkQ2hpbGQodGhpcy5vdXRwdXQpO1xuICB0aGlzLmxpbmUgPSBuZXcgcGl4aS5UZXh0KCc+Jyx7Zm9udDogJ2JvbGQgMzJweCBWVDMyMyd9KTtcbiAgdGhpcy5saW5lLnBvc2l0aW9uLnggPSAxMjtcbiAgdGhpcy5saW5lLnBvc2l0aW9uLnkgPSA1MjtcbiAgdGhpcy5hZGRDaGlsZCh0aGlzLmxpbmUpO1xuICB0aGlzLm9ubGluZSA9IFtdO1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB0aGlzLnJlbmRlclRleHQoKTtcblxuICB2YXIgYWN0aW9ucyA9IHt9O1xuICBhY3Rpb25zW0FsaWFzLmVudGVyXSA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgICBfdGhpcy5wdXNoTGluZSgpO1xuICB9O1xuICBhY3Rpb25zW0FsaWFzLmJhY2tzcGFjZV0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5yZW1vdmVDaGFyKCk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuICBhY3Rpb25zW0FsaWFzLmxlZnRdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUN1cnNvcigtMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMucmlnaHRdID0gZnVuY3Rpb24oZXZlbnQpe1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgX3RoaXMubW92ZUN1cnNvcigxKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgYWN0aW9uc1tBbGlhcy51cF0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlSGlzdG9yeSgtMSk7XG4gICAgX3RoaXMucmVuZGVyVGV4dCgpO1xuICB9O1xuXG4gIGFjdGlvbnNbQWxpYXMuZG93bl0gPSBmdW5jdGlvbihldmVudCl7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBfdGhpcy5tb3ZlSGlzdG9yeSgxKTtcbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH07XG5cbiAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihldmVudCl7XG4gICAgdmFyIGtleSA9IGV2ZW50LmtleUNvZGUgfHzCoGV2ZW50LndoaWNoO1xuICAgIGlmKCBpc1ZhbGlkS2V5KGtleSkgKSB7XG4gICAgICBfdGhpcy5wdXNoQ2hhcihTdHJpbmcuZnJvbUNoYXJDb2RlKGtleSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgZnVuID0gYWN0aW9uc1trZXldO1xuICAgICAgaWYoISFmdW4pIHtcbiAgICAgICAgZnVuLmNhbGwoX3RoaXMsZXZlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgICBfdGhpcy5yZW5kZXJUZXh0KCk7XG4gIH0pO1xuXG59O1xuXG5UZXJtaW5hbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERPQy5wcm90b3R5cGUpO1xuXG5UZXJtaW5hbC5wcm90b3R5cGUucmVuZGVyVGV4dCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMubWluID0gTWF0aC5tYXgoIHRoaXMuY3Vyc29yLTMyLDAgKTtcbiAgdGhpcy5saW5lLnNldFRleHQodGhpcy5wcmVmaXgrdGhpcy5idWZmZXIuc3Vic3RyKHRoaXMubWluLDMyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLnJlbW92ZUNoYXIgPSBmdW5jdGlvbigpe1xuICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gIHZhciBsZW4gPSBidWZmZXIubGVuZ3RoO1xuICB2YXIgY3Vyc29yID0gdGhpcy5jdXJzb3I7XG4gIGlmKCBjdXJzb3IgPiAwICkge1xuICAgIHRoaXMuYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLGN1cnNvci0xKStidWZmZXIuc3Vic3RyaW5nKGN1cnNvcixsZW4pO1xuICAgIHRoaXMuY3Vyc29yIC09IDE7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5UZXJtaW5hbC5wcm90b3R5cGUucHVzaENoYXIgPSBmdW5jdGlvbihjKXtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yO1xuICB2YXIgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gIHRoaXMuYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLGN1cnNvcikgKyBjICsgYnVmZmVyLnN1YnN0cmluZyhjdXJzb3IsYnVmZmVyLmxlbmd0aCk7XG4gIHRoaXMuY3Vyc29yICs9IDE7XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLm1vdmVDdXJzb3IgPSBmdW5jdGlvbihkKXtcbiAgdmFyIGN1cnNvciA9IHRoaXMuY3Vyc29yICsgZDtcbiAgdmFyIGxlbiA9IHRoaXMuYnVmZmVyLmxlbmd0aDtcbiAgaWYoIGN1cnNvciA+PSAwICYmIGN1cnNvciA8PSBsZW4gKSB7XG4gICAgdGhpcy5jdXJzb3IgPSBjdXJzb3I7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5UZXJtaW5hbC5wcm90b3R5cGUucHVzaExpbmUgPSBmdW5jdGlvbigpe1xuICB0aGlzLmxpbmVubyA9IHRoaXMubGluZXMucHVzaCggdGhpcy5idWZmZXIgKTtcbiAgdGhpcy5wcmludGxuKCByZXBsKHRoaXMuYnVmZmVyKSApO1xuICB0aGlzLmJ1ZmZlciA9ICcnO1xuICB0aGlzLmN1cnNvciA9IDA7XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGVybWluYWwucHJvdG90eXBlLm1vdmVIaXN0b3J5ID0gZnVuY3Rpb24oZCl7XG4gIHZhciBsaW5lbm8gPSB0aGlzLmxpbmVubyArIGQ7XG4gIHZhciBjb3VudCA9IHRoaXMubGluZXMubGVuZ3RoO1xuICBpZiggbGluZW5vID09PSBjb3VudCApIHtcbiAgICB0aGlzLmJ1ZmZlciA9ICcnO1xuICAgIHRoaXMubGluZW5vID0gbGluZW5vO1xuICAgIHRoaXMuY3Vyc29yID0gMDtcbiAgfVxuICBpZiggbGluZW5vID49IDAgJiYgbGluZW5vIDwgY291bnQgKSB7XG4gICAgdGhpcy5idWZmZXIgPSB0aGlzLmxpbmVzW2xpbmVub107XG4gICAgdGhpcy5saW5lbm8gPSBsaW5lbm87XG4gICAgdGhpcy5jdXJzb3IgPSB0aGlzLmJ1ZmZlci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5UZXJtaW5hbC5wcm90b3R5cGUucHJpbnRsbiA9IGZ1bmN0aW9uKHRleHQpe1xuICB0aGlzLm91dHB1dC5zZXRUZXh0KHRleHQpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVGVybWluYWw7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBwaXhpID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuUElYSSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuUElYSSA6IG51bGwpO1xudmFyIERPQyA9IHBpeGkuRGlzcGxheU9iamVjdENvbnRhaW5lcjtcbnZhciBUV0VFTiA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRXRUVOIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5UV0VFTiA6IG51bGwpO1xudmFyIFR3ZWVuID0gVFdFRU4uVHdlZW47XG52YXIgY3VydmUgPSBUV0VFTi5FYXNpbmcuTGluZWFyLk5vbmU7XG5cbnZhciBtYXggPSA0ODtcbnZhciBtc3BoID0gMjIwMDtcblxudmFyIFRpbWVyID0gZnVuY3Rpb24ob3B0aW9ucyl7XG4gIERPQy5hcHBseSh0aGlzKTtcbiAgdGhpcy50aW1lID0gbWF4O1xuICB0aGlzLm1heCA9IG9wdGlvbnMubWF4IHx8IG1heDtcbiAgdGhpcy5tc3BoID0gb3B0aW9ucy5tc3BoIHx8IG1zcGg7XG4gIHZhciBjb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgMHgwMDAwMDA7XG4gIHRoaXMuc2Vjb25kcyA9IG5ldyBwaXhpLlRleHQoJzQ4OjAwJyx7Zm9udDogJ2JvbGQgNjRweCBWVDMyMycsZmlsbDogY29sb3J9KTtcbiAgdGhpcy5hZGRDaGlsZCh0aGlzLnNlY29uZHMpO1xuICB0aGlzLmV4dHJhID0gMDtcbn07XG5cblRpbWVyLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRE9DLnByb3RvdHlwZSk7XG5cblRpbWVyLnByb3RvdHlwZS5mYXN0Rm9yd2FyZCA9IGZ1bmN0aW9uKGR0KXtcbiAgdGhpcy5leHRyYSArPSBkdDtcbn07XG5cblRpbWVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbih0aW1lKXtcbiAgdmFyIGggPSBNYXRoLmZsb29yKHRpbWUpICsgJyc7XG4gIHZhciBtID0gTWF0aC5mbG9vcigodGltZS1oKSo2MCkgKyAnJztcbiAgaWYoIGgubGVuZ3RoID09PSAxICkge1xuICAgIGggPSAnMCcraDtcbiAgfVxuICBpZiggbS5sZW5ndGggPT09IDEgKXtcbiAgICBtID0gJzAnK207XG4gIH1cbiAgdGhpcy50aW1lID0gdGltZTtcbiAgdGhpcy5zZWNvbmRzLnNldFRleHQoIGgrJzonK20gKTtcbiAgaWYodGhpcy5vbnVwZGF0ZSl7XG4gICAgdGhpcy5vbnVwZGF0ZSh0aW1lKTtcbiAgfVxufTtcblRpbWVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCl7XG4gIHRoaXMudGltZSA9IHRoaXMubWF4O1xuICByZXR1cm4gdGhpcztcbn07XG5UaW1lci5wcm90b3R5cGUub25Db21wbGV0ZSA9IGZ1bmN0aW9uKGZ1bil7XG4gIHRoaXMub25jb21wbGV0ZSA9IGZ1bjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuVGltZXIucHJvdG90eXBlLm9uVXBkYXRlID0gZnVuY3Rpb24oZnVuKXtcbiAgdGhpcy5vbnVwZGF0ZSA9IGZ1bjtcbiAgcmV0dXJuIHRoaXM7XG59XG5cblRpbWVyLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uKCl7XG4gIHZhciBkdXJhdGlvbiA9IHRoaXMudGltZSAqIHRoaXMubXNwaDtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdGhpcy50d2VlbiA9IG5ldyBUd2Vlbih0aGlzKVxuICAudG8oe3RpbWU6IDB9LGR1cmF0aW9uKVxuICAuZWFzaW5nKGN1cnZlKS5vblVwZGF0ZShmdW5jdGlvbigpe1xuICAgIGlmKCBfdGhpcy5leHRyYSApIHtcbiAgICAgIHRoaXMudGltZSArPSBfdGhpcy5leHRyYTtcbiAgICAgIF90aGlzLmV4dHJhID0gMDtcbiAgICB9XG4gICAgX3RoaXMudXBkYXRlKHRoaXMudGltZSk7XG4gIH0pLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICBpZihfdGhpcy5vbmNvbXBsZXRlKXtcbiAgICAgIF90aGlzLm9uY29tcGxldGUoKTtcbiAgICB9XG4gIH0pLnN0YXJ0KCk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuVGltZXIucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbigpe1xuICBpZih0aGlzLnR3ZWVuKXtcbiAgICB0aGlzLnR3ZWVuLnN0b3AoKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUaW1lcjtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gW1xuJ0VudGlyZSBHYW1lIG9uIE9uZSBTY3JlZW4nLFxuJ0FydGlmaWNpYWwgTGlmZScsXG4nU25vd21hbicsXG4nQWZ0ZXIgdGhlIEVuZCcsXG4nRGVhdGggaXMgVXNlZnVsJyxcbidPbmUgUnVsZScsXG4nR2VuZXJhdGlvbicsXG4nQXZvaWQgdGhlIExpZ2h0JyxcbidEZWVwIFNwYWNlJyxcbidZb3UgQXJlIE5vdCBTdXAuIDIgQmUgSGVyZScsXG4nRXZlcnl0aGluZyBGYWxscyBBcGFydCcsXG4nRW5kIFdoZXJlIFlvdSBTdGFydGVkJyxcbidJc29sYXRpb24nLFxuJ01hY2hpbmVzJyxcbidZb3UgQ2Fu4oCZdCBTdG9wJyxcbidDb2xvciBpcyBFdmVyeXRoaW5nJyxcbidQbGF5aW5nIEJvdGggU2lkZXMnLFxuJ0JvcmRlcnMnLFxuJ0NoYW9zJyxcbidEZWphIHZ1J1xuXTsiXX0=
