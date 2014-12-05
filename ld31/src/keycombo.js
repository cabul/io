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
  event.preventDefault();
  pressed[event.keyCode] = false;
},false);

document.body.addEventListener('keydown',function(event){
  event.preventDefault();
  pressed[event.keyCode] = true;
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
    evt = {
      stopPropagation: function(){ prop = false; },
      type: keys
    };
    for( i = 0, len = arr.length; i < len && prop; i += 1 ) {
      arr[i].call(null,evt);
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
