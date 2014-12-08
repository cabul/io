var gui = require('./debug');
var pixi = require('pixi');
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
