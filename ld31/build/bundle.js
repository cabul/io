(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/cabul/github/github.io/ld31/src/cameracontrols.js":[function(require,module,exports){
(function (global){
var keycombo = require('./keycombo');
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var three = (typeof window !== "undefined" ? window.THREE : typeof global !== "undefined" ? global.THREE : null);

var CameraControls = function( camera, domElement ) {

  var _this = this;
  this.enabled = true;
  this.noZoom = false;
  this.noRotate = false;
  this.domElement = domElement;
  this.zoomSpeed = 1.2;
  this.camera = camera;
  this.staticMoving = false;
  this.dynamicDampingFactor = 0.2;
  this.maxZoom = 200;
  this.minZoom = 20;
  this.viewChange = 800;
  this._focus = new three.Vector3();
  var zoom = 0;

  var mousewheel = function(event) {
    if( !_this.enabled ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    var delta = 0;

    if( event.wheelDelta ) {
      delta = event.wheelDelta / 40;
    } else if( event.detail ) {
      delta = event.detail / 3;
    }

    zoom += delta * 0.01;
  };

  this.domElement.addEventListener('mousewheel',mousewheel, false);
  this.domElement.addEventListener('DOMMouseScroll',mousewheel, false);

  var updateZoom = function() {
    if( zoom === 0 ) {
      return;
    }
    var factor = 1.0 + zoom * _this.zoomSpeed;

    _this.setZoom(Math.min( _this.maxZoom, Math.max(_this.minZoom, (_this.camera.zoom * factor)) ));

    if( _this.staticMoving ) {
      zoom = 0;
    } else {
      zoom -= zoom*_this.dynamicDampingFactor;
    }
  };

  this.update = function() {
    if( !_this.noZoom ) {
      updateZoom();
    }
  };

  var viewState = 1;
  var camConfigs = [
  // { posx: 0, posy: 10, posz: 0,
  //   rotx: -1.5707963267948966,
  //   roty: 0.0,
  //   rotz: -0.7853981633974481 },
    { posx: -10, posy: 10, posz: 10,
      rotx: -0.7853981603287307,
      roty: -0.6154796918457905,
      rotz: -0.523598776277004 },
    { posx: 10, posy: 10, posz: 10,
      rotx: -0.7853981603287307,
      roty: 0.6154796918457905,
      rotz: 0.523598776277004 },
    { posx: 10, posy: 10, posz: -10,
      rotx: -2.3561944932610626,
      roty: 0.6154796918457909,
      rotz: 2.6179938773127893 },
    { posx: -10, posy: 10, posz: -10,
      rotx: -2.3561944932610626,
      roty: -0.6154796918457909,
      rotz: -2.6179938773127893 }
  ];

  var changingView = false;

  this.changeView = function(){
    if( _this.noRotate ) {
      return;
    }
    if( changingView ) {
      return;
    }
    var config = JSON.parse( JSON.stringify(camConfigs[viewState]));
    viewState = (viewState + 1) % camConfigs.length;
    var newConfig = camConfigs[viewState];
    var tween = new TWEEN.Tween(config)
    .to(newConfig,_this.viewChange)
    .easing( TWEEN.Easing.Quadratic.InOut )
    .onUpdate( function(){
      _this.setView(this);
    }).onComplete(function(){
      changingView = false;
    });
    changingView = true;
    tween.start();
  };

  this.setView(camConfigs[viewState]);

};


CameraControls.prototype = {

  constructor: CameraControls,
  handleResize: function() {
    this.camera.left = - window.innerWidth / 2;
    this.camera.right = window.innerWidth / 2;
    this.camera.top = window.innerHeight / 2;
    this.camera.bottom = - window.innerHeight / 2;
    this.camera.updateProjectionMatrix();
  },
  setView: function(view){
    this.camera.position.x = view.posx + this._focus.x;
    this.camera.position.y = view.posy + this._focus.y;
    this.camera.position.z = view.posz + this._focus.z;
    this.camera.rotation.x = view.rotx;
    this.camera.rotation.y = view.roty;
    this.camera.rotation.z = view.rotz;
  },

  setZoom: function(zoom){
    this.camera.zoom = zoom;
    this.camera.updateProjectionMatrix();
  },
  setFocus: function(focus){
    this.camera.position.sub(this._focus).add(focus);
    this._focus = focus;
  }

};

module.exports = CameraControls;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keycombo":"/Users/cabul/github/github.io/ld31/src/keycombo.js"}],"/Users/cabul/github/github.io/ld31/src/grid.js":[function(require,module,exports){
(function (global){
var three = (typeof window !== "undefined" ? window.THREE : typeof global !== "undefined" ? global.THREE : null);

var Grid = function(options){

  three.Object3D.call(this);

  this.type = 'GridMesh';

  this.cellsize = options.cellsize || 1;
  this.color = options.color || 0xffffff;
  this.cells = [];
  this.minX = 0;
  this.minY = 0;
  this.maxX = -1;
  this.maxY = -1;
  this._geometry = new three.Geometry();
  var off = this.cellsize / 2;
  this._geometry.vertices.push( new three.Vector3( -off,-off,off ) );
  this._geometry.vertices.push( new three.Vector3( off,-off,off ) );
  this._geometry.vertices.push( new three.Vector3( off,-off,-off ) );
  this._geometry.vertices.push( new three.Vector3( -off,-off,-off ) );
  this._geometry.vertices.push( new three.Vector3( -off,-off,off ) );
  this.material = options.material || new three.LineBasicMaterial({color: this.color});
  this.center = new three.Vector3();

  if( options.width && options.height ) {
    var x,y;
    for( x = 0; x < options.width; x += 1 ) {
      for( y = 0; y < options.height; y += 1 ) {
        this.addCell( {x:x,y:y} );
      }
    }
  }

};

Grid.prototype = Object.create( three.Object3D.prototype );

Grid.prototype.addCell = function(pos){
  this.maxX = Math.max( this.maxX, pos.x );
  this.minX = Math.min( this.minX, pos.x );
  this.maxY = Math.max( this.maxY, pos.y );
  this.minY = Math.min( this.minY, pos.y );

  var x = pos.x * this.cellsize;
  var z = - pos.y * this.cellsize;

  var cell = new three.Line(this._geometry,this.material);
  cell.position.set( x, 0, z );
  this.add(cell);
  this.cells[pos.x+','+pos.y] = cell;

  this.width = this.maxX - this.minX + 1;
  this.height = this.maxY - this.minY + 1;
  this.sizeX = this.width * this.cellsize;
  this.sizeY = this.height * this.cellsize;
  this.center.x = this.minX * this.cellsize + this.sizeX/2;
  this.center.z = - this.minY * this.cellsize - this.sizeY/2 + this.cellsize;
};

Grid.prototype.removeCell = function(pos){

};

Grid.Directions = {
  left: new three.Vector2(1,0),
  right: new three.Vector2(-1,0),
  up: new three.Vector2(0,-1),
  down: new three.Vector2(0,1)
};

module.exports = Grid;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/github.io/ld31/src/help.js":[function(require,module,exports){
var createDialog = function() {

  var dialog = document.createElement('div');
  dialog.title = 'Help';
  var sections = document.createElement('div');
  [

    {
      title: 'General',
      content: [
        'This game was created for Ludum Dare 31',
        'Have fun and don\'t forget to be awesome!',
        '<a href="mailto:calvin.bulla@gmail.com?Subject=Ludum%20Dare%2031" target="_top">Send me an email</a>'
      ]
    },
    {
      title: 'Objective',
      content: [
        'There is no objective, just play'
      ]
    },
    {
      title: 'Controls',
      content: [
        'Use <i>H</i> to toggle this help menu',
        'Use <i>C</i> to change the view angle'
      ]
    }

  ].forEach( function(section){

    var header = document.createElement('h3');
    header.innerHTML = section.title;
    var div = document.createElement('div');
    section.content.forEach(function(line){
      var p = document.createElement('p');
      p.innerHTML = line;
      div.appendChild(p);
    });
    sections.appendChild( header );
    sections.appendChild( div );

  });

  dialog.appendChild(sections);

  $(function(){
    // $(sections).accordion();
    $(dialog).dialog({width: 600, modal: true, draggable: false, height: 400});
  });

  return dialog;

};

var dialog = null;

module.exports = function() {

  if( dialog ) {
    $(dialog).dialog('destroy');
    dialog = null;
  } else {
    dialog = createDialog();
  }

};

// if( !Detector.webgl ) {
//   Detector.addGetWebGLMessage();
//
//   var img = document.createElement('img');
//   img.src = 'img/error'+ Math.floor( Math.random()*4 ) +'.jpg';
//   img.id = 'error';
//   img.onclick = function() {
//     window.open('http://www.google.com/chrome/');
//     window.open('http://www.mozilla.org/en-US/firefox/new/');
//   };
//   document.body.appendChild(img);
//
//   return;
// }

},{}],"/Users/cabul/github/github.io/ld31/src/keycombo.js":[function(require,module,exports){
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

},{}],"/Users/cabul/github/github.io/ld31/src/player.js":[function(require,module,exports){
(function (global){
var three = (typeof window !== "undefined" ? window.THREE : typeof global !== "undefined" ? global.THREE : null);
var tween = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);

var Player3D = function( options ) {

  three.Object3D.call(this);

  this.type = 'Player3D';

  this._size = options._size || 1;
  var material = options.material || new three.MeshBasicMaterial({color: 0xffffff * Math.random()});
  var geometry = new three.BoxGeometry(this._size,this._size,this._size);
  this._cube = new three.Mesh(geometry,material);
  this._cube.position.y = this._size / 2;
  this._axis = new three.Object3D();
  this._axis.position.y = - this._size / 2;
  this._axis.add(this._cube);
  this.add(this._axis);
  this._animation = null;
  this._moving = false;
};

Player3D.prototype = Object.create( three.Object3D.prototype );

Player3D.prototype.move = function(dir,dt){
  if( this._moving ) {
    return;
  }
  dir.x = dir.x === undefined ? 0 : dir.x;
  dir.y = dir.y === undefined ? 0 : dir.y;
  this._axis.position.x += dir.x * this._size / 2;
  this._cube.position.x -= dir.x * this._size / 2;
  this._axis.position.z -= dir.y * this._size / 2;
  this._cube.position.z += dir.y * this._size / 2;
  var rotX = - dir.y * 0.5 * Math.PI;
  var rotZ = - dir.x * 0.5 * Math.PI;
  var _this = this;
  this._animation = new tween.Tween( { x: 0, z: 0 } )
    .to({x: rotX, z: rotZ}, dt)
    .onUpdate(function(){
      _this._axis.rotation.x = this.x;
      _this._axis.rotation.z = this.z;
    })
    .easing(tween.Easing.Sinusoidal.InOut)
    .onComplete(function(){
      _this._axis.rotateX(-rotX);
      _this._axis.rotateZ(-rotZ);
      _this._axis.position.x -= dir.x * _this._size / 2;
      _this._cube.position.x += dir.x * _this._size / 2;
      _this._axis.position.z += dir.y * _this._size / 2;
      _this._cube.position.z -= dir.y * _this._size / 2;

      _this.position.x += dir.x * _this._size;
      _this.position.z -= dir.y * _this._size;
      _this._moving = false;
    })
    .start();
  this._moving = true;
};

module.exports = Player3D;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"/Users/cabul/github/github.io/ld31":[function(require,module,exports){
(function (global){
var Detector = (typeof window !== "undefined" ? window.Detector : typeof global !== "undefined" ? global.Detector : null);
var THREE = (typeof window !== "undefined" ? window.THREE : typeof global !== "undefined" ? global.THREE : null);
var THREEx = (typeof window !== "undefined" ? window.THREEx : typeof global !== "undefined" ? global.THREEx : null);
var Stats = (typeof window !== "undefined" ? window.Stats : typeof global !== "undefined" ? global.Stats : null);
var TWEEN = (typeof window !== "undefined" ? window.TWEEN : typeof global !== "undefined" ? global.TWEEN : null);
var CameraControls = require('./cameracontrols');
var keycombo = require('./keycombo');
var toggleHelp = require('./help');

var renderer;

if( Detector.webgl ) {
  renderer = new THREE.WebGLRenderer({antialias: true});
} else {

  var dialog = document.createElement('div');
  dialog.title = 'Attention';
  var msg = window.WebGLRenderingContext ? [
  'Your graphics card does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br />',
  'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.',
  'You can still play the game, but it might not work as intended'
  ] : [
  'Your browser does not seem to support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation" style="color:#000">WebGL</a>.<br/>',
  'Find out how to get it <a href="http://get.webgl.org/" style="color:#000">here</a>.',
  'Latest versions of Google Chrome or Mozilla Firefox are recommended',
  'You can still play the game, but it might not work as intended'
  ];

  msg.forEach(function(line){
    var p = document.createElement('p');
    p.innerHTML = line;
    dialog.appendChild(p);
  });

  $(function(){
    $(dialog).dialog({width: 600, modal: true, draggable: false});
  });
  renderer = new THREE.CanvasRenderer();
}
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setClearColor( 0x000000,1);
document.body.appendChild(renderer.domElement);

var camera = new THREE.OrthographicCamera( window.innerWidth/ - 2, window.innerWidth/ 2, window.innerHeight / 2, window.innerHeight/ -2, 1, 1000 );
camera.position.set( 10,10,10 );
camera.lookAt({x:0,y:0,z:0});
camera.updateProjectionMatrix();

var controls = new CameraControls(camera,renderer.domElement);
controls.setZoom( 60 );

// var controls = new THREE.OrthographicTrackballControls(camera,renderer.domElement);

var stats = new Stats();
stats.setMode(0);
document.body.appendChild(stats.domElement);

window.addEventListener('resize',function(){
  controls.handleResize();
  renderer.setSize(window.innerWidth,window.innerHeight);
});

var scene = new THREE.Scene();

var keyLight = new THREE.DirectionalLight(0xffffff,0.8);
keyLight.position.set(-2,4,3).normalize();
scene.add(keyLight);

var fillLight = new THREE.DirectionalLight(0xffffff,0.3);
fillLight.position.set(3,2,2).normalize();
scene.add(fillLight);

var backLight = new THREE.DirectionalLight(0xffffff,0.1);
backLight.position.set(1,1,-3).normalize();
scene.add(backLight);

var Player3D = require('./player');
var material = new THREE.MeshLambertMaterial({ color: 0xd0d0d0 });
var player = new Player3D({
  material: material
});

scene.add(player);
var Grid = require('./grid');

var grid = new Grid({width: 8, height: 8, color: 0xd0d0d0});
scene.add(grid);

controls.setFocus( grid.center );

var plane = new THREE.PlaneBufferGeometry(1,1);

keycombo.addEventListener('right',function(){
  var mesh = new THREE.Mesh(plane,material);
  mesh.rotateX( -0.5 * Math.PI );
  mesh.position.x = player.position.x;
  mesh.position.y = -0.5;
  mesh.position.z = player.position.z;
  scene.add(mesh);
  player.move({x:1},800);
});

keycombo.addEventListener('up',function(){
  var mesh = new THREE.Mesh(plane,material);
  mesh.rotateX( -0.5 * Math.PI );
  mesh.position.x = player.position.x;
  mesh.position.y = -0.5;
  mesh.position.z = player.position.z;
  scene.add(mesh);
  player.move({y:1},800);
});

keycombo.addEventListener('left',function(){
  var mesh = new THREE.Mesh(plane,material);
  mesh.rotateX( -0.5 * Math.PI );
  mesh.position.x = player.position.x;
  mesh.position.y = -0.5;
  mesh.position.z = player.position.z;
  scene.add(mesh);
  player.move({x:-1},800);
});

keycombo.addEventListener('down',function(){
  var mesh = new THREE.Mesh(plane,material);
  mesh.rotateX( -0.5 * Math.PI );
  mesh.position.x = player.position.x;
  mesh.position.y = -0.5;
  mesh.position.z = player.position.z;
  scene.add(mesh);
  player.move({y:-1},800);
});

keycombo.addEventListener('c',function(){
  controls.changeView();
});

keycombo.addEventListener('h',toggleHelp);

var time = 0, dt;
requestAnimationFrame(function render( tick ){
  dt = (tick)? (tick - time) : 0;
  time = tick || 0;
  requestAnimationFrame(render);
  renderer.render(scene,camera);
  controls.update();
  TWEEN.update(tick);
  stats.update();
});

toggleHelp();

window.camera = camera;
window.grid = grid;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./cameracontrols":"/Users/cabul/github/github.io/ld31/src/cameracontrols.js","./grid":"/Users/cabul/github/github.io/ld31/src/grid.js","./help":"/Users/cabul/github/github.io/ld31/src/help.js","./keycombo":"/Users/cabul/github/github.io/ld31/src/keycombo.js","./player":"/Users/cabul/github/github.io/ld31/src/player.js"}]},{},["/Users/cabul/github/github.io/ld31"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL3dhdGNoaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvY2FtZXJhY29udHJvbHMuanMiLCJzcmMvZ3JpZC5qcyIsInNyYy9oZWxwLmpzIiwic3JjL2tleWNvbWJvLmpzIiwic3JjL3BsYXllci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIga2V5Y29tYm8gPSByZXF1aXJlKCcuL2tleWNvbWJvJyk7XG52YXIgVFdFRU4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcbnZhciB0aHJlZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRIUkVFIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5USFJFRSA6IG51bGwpO1xuXG52YXIgQ2FtZXJhQ29udHJvbHMgPSBmdW5jdGlvbiggY2FtZXJhLCBkb21FbGVtZW50ICkge1xuXG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIHRoaXMubm9ab29tID0gZmFsc2U7XG4gIHRoaXMubm9Sb3RhdGUgPSBmYWxzZTtcbiAgdGhpcy5kb21FbGVtZW50ID0gZG9tRWxlbWVudDtcbiAgdGhpcy56b29tU3BlZWQgPSAxLjI7XG4gIHRoaXMuY2FtZXJhID0gY2FtZXJhO1xuICB0aGlzLnN0YXRpY01vdmluZyA9IGZhbHNlO1xuICB0aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yID0gMC4yO1xuICB0aGlzLm1heFpvb20gPSAyMDA7XG4gIHRoaXMubWluWm9vbSA9IDIwO1xuICB0aGlzLnZpZXdDaGFuZ2UgPSA4MDA7XG4gIHRoaXMuX2ZvY3VzID0gbmV3IHRocmVlLlZlY3RvcjMoKTtcbiAgdmFyIHpvb20gPSAwO1xuXG4gIHZhciBtb3VzZXdoZWVsID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBpZiggIV90aGlzLmVuYWJsZWQgKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICB2YXIgZGVsdGEgPSAwO1xuXG4gICAgaWYoIGV2ZW50LndoZWVsRGVsdGEgKSB7XG4gICAgICBkZWx0YSA9IGV2ZW50LndoZWVsRGVsdGEgLyA0MDtcbiAgICB9IGVsc2UgaWYoIGV2ZW50LmRldGFpbCApIHtcbiAgICAgIGRlbHRhID0gZXZlbnQuZGV0YWlsIC8gMztcbiAgICB9XG5cbiAgICB6b29tICs9IGRlbHRhICogMC4wMTtcbiAgfTtcblxuICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V3aGVlbCcsbW91c2V3aGVlbCwgZmFsc2UpO1xuICB0aGlzLmRvbUVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NTW91c2VTY3JvbGwnLG1vdXNld2hlZWwsIGZhbHNlKTtcblxuICB2YXIgdXBkYXRlWm9vbSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKCB6b29tID09PSAwICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgZmFjdG9yID0gMS4wICsgem9vbSAqIF90aGlzLnpvb21TcGVlZDtcblxuICAgIF90aGlzLnNldFpvb20oTWF0aC5taW4oIF90aGlzLm1heFpvb20sIE1hdGgubWF4KF90aGlzLm1pblpvb20sIChfdGhpcy5jYW1lcmEuem9vbSAqIGZhY3RvcikpICkpO1xuXG4gICAgaWYoIF90aGlzLnN0YXRpY01vdmluZyApIHtcbiAgICAgIHpvb20gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICB6b29tIC09IHpvb20qX3RoaXMuZHluYW1pY0RhbXBpbmdGYWN0b3I7XG4gICAgfVxuICB9O1xuXG4gIHRoaXMudXBkYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYoICFfdGhpcy5ub1pvb20gKSB7XG4gICAgICB1cGRhdGVab29tKCk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB2aWV3U3RhdGUgPSAxO1xuICB2YXIgY2FtQ29uZmlncyA9IFtcbiAgLy8geyBwb3N4OiAwLCBwb3N5OiAxMCwgcG9zejogMCxcbiAgLy8gICByb3R4OiAtMS41NzA3OTYzMjY3OTQ4OTY2LFxuICAvLyAgIHJvdHk6IDAuMCxcbiAgLy8gICByb3R6OiAtMC43ODUzOTgxNjMzOTc0NDgxIH0sXG4gICAgeyBwb3N4OiAtMTAsIHBvc3k6IDEwLCBwb3N6OiAxMCxcbiAgICAgIHJvdHg6IC0wLjc4NTM5ODE2MDMyODczMDcsXG4gICAgICByb3R5OiAtMC42MTU0Nzk2OTE4NDU3OTA1LFxuICAgICAgcm90ejogLTAuNTIzNTk4Nzc2Mjc3MDA0IH0sXG4gICAgeyBwb3N4OiAxMCwgcG9zeTogMTAsIHBvc3o6IDEwLFxuICAgICAgcm90eDogLTAuNzg1Mzk4MTYwMzI4NzMwNyxcbiAgICAgIHJvdHk6IDAuNjE1NDc5NjkxODQ1NzkwNSxcbiAgICAgIHJvdHo6IDAuNTIzNTk4Nzc2Mjc3MDA0IH0sXG4gICAgeyBwb3N4OiAxMCwgcG9zeTogMTAsIHBvc3o6IC0xMCxcbiAgICAgIHJvdHg6IC0yLjM1NjE5NDQ5MzI2MTA2MjYsXG4gICAgICByb3R5OiAwLjYxNTQ3OTY5MTg0NTc5MDksXG4gICAgICByb3R6OiAyLjYxNzk5Mzg3NzMxMjc4OTMgfSxcbiAgICB7IHBvc3g6IC0xMCwgcG9zeTogMTAsIHBvc3o6IC0xMCxcbiAgICAgIHJvdHg6IC0yLjM1NjE5NDQ5MzI2MTA2MjYsXG4gICAgICByb3R5OiAtMC42MTU0Nzk2OTE4NDU3OTA5LFxuICAgICAgcm90ejogLTIuNjE3OTkzODc3MzEyNzg5MyB9XG4gIF07XG5cbiAgdmFyIGNoYW5naW5nVmlldyA9IGZhbHNlO1xuXG4gIHRoaXMuY2hhbmdlVmlldyA9IGZ1bmN0aW9uKCl7XG4gICAgaWYoIF90aGlzLm5vUm90YXRlICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiggY2hhbmdpbmdWaWV3ICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgY29uZmlnID0gSlNPTi5wYXJzZSggSlNPTi5zdHJpbmdpZnkoY2FtQ29uZmlnc1t2aWV3U3RhdGVdKSk7XG4gICAgdmlld1N0YXRlID0gKHZpZXdTdGF0ZSArIDEpICUgY2FtQ29uZmlncy5sZW5ndGg7XG4gICAgdmFyIG5ld0NvbmZpZyA9IGNhbUNvbmZpZ3Nbdmlld1N0YXRlXTtcbiAgICB2YXIgdHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4oY29uZmlnKVxuICAgIC50byhuZXdDb25maWcsX3RoaXMudmlld0NoYW5nZSlcbiAgICAuZWFzaW5nKCBUV0VFTi5FYXNpbmcuUXVhZHJhdGljLkluT3V0IClcbiAgICAub25VcGRhdGUoIGZ1bmN0aW9uKCl7XG4gICAgICBfdGhpcy5zZXRWaWV3KHRoaXMpO1xuICAgIH0pLm9uQ29tcGxldGUoZnVuY3Rpb24oKXtcbiAgICAgIGNoYW5naW5nVmlldyA9IGZhbHNlO1xuICAgIH0pO1xuICAgIGNoYW5naW5nVmlldyA9IHRydWU7XG4gICAgdHdlZW4uc3RhcnQoKTtcbiAgfTtcblxuICB0aGlzLnNldFZpZXcoY2FtQ29uZmlnc1t2aWV3U3RhdGVdKTtcblxufTtcblxuXG5DYW1lcmFDb250cm9scy5wcm90b3R5cGUgPSB7XG5cbiAgY29uc3RydWN0b3I6IENhbWVyYUNvbnRyb2xzLFxuICBoYW5kbGVSZXNpemU6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2FtZXJhLmxlZnQgPSAtIHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLmNhbWVyYS5yaWdodCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMjtcbiAgICB0aGlzLmNhbWVyYS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuICAgIHRoaXMuY2FtZXJhLmJvdHRvbSA9IC0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbiAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH0sXG4gIHNldFZpZXc6IGZ1bmN0aW9uKHZpZXcpe1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnggPSB2aWV3LnBvc3ggKyB0aGlzLl9mb2N1cy54O1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnkgPSB2aWV3LnBvc3kgKyB0aGlzLl9mb2N1cy55O1xuICAgIHRoaXMuY2FtZXJhLnBvc2l0aW9uLnogPSB2aWV3LnBvc3ogKyB0aGlzLl9mb2N1cy56O1xuICAgIHRoaXMuY2FtZXJhLnJvdGF0aW9uLnggPSB2aWV3LnJvdHg7XG4gICAgdGhpcy5jYW1lcmEucm90YXRpb24ueSA9IHZpZXcucm90eTtcbiAgICB0aGlzLmNhbWVyYS5yb3RhdGlvbi56ID0gdmlldy5yb3R6O1xuICB9LFxuXG4gIHNldFpvb206IGZ1bmN0aW9uKHpvb20pe1xuICAgIHRoaXMuY2FtZXJhLnpvb20gPSB6b29tO1xuICAgIHRoaXMuY2FtZXJhLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgfSxcbiAgc2V0Rm9jdXM6IGZ1bmN0aW9uKGZvY3VzKXtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi5zdWIodGhpcy5fZm9jdXMpLmFkZChmb2N1cyk7XG4gICAgdGhpcy5fZm9jdXMgPSBmb2N1cztcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENhbWVyYUNvbnRyb2xzO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgdGhyZWUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5USFJFRSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVEhSRUUgOiBudWxsKTtcblxudmFyIEdyaWQgPSBmdW5jdGlvbihvcHRpb25zKXtcblxuICB0aHJlZS5PYmplY3QzRC5jYWxsKHRoaXMpO1xuXG4gIHRoaXMudHlwZSA9ICdHcmlkTWVzaCc7XG5cbiAgdGhpcy5jZWxsc2l6ZSA9IG9wdGlvbnMuY2VsbHNpemUgfHwgMTtcbiAgdGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHzCoDB4ZmZmZmZmO1xuICB0aGlzLmNlbGxzID0gW107XG4gIHRoaXMubWluWCA9IDA7XG4gIHRoaXMubWluWSA9IDA7XG4gIHRoaXMubWF4WCA9IC0xO1xuICB0aGlzLm1heFkgPSAtMTtcbiAgdGhpcy5fZ2VvbWV0cnkgPSBuZXcgdGhyZWUuR2VvbWV0cnkoKTtcbiAgdmFyIG9mZiA9IHRoaXMuY2VsbHNpemUgLyAyO1xuICB0aGlzLl9nZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBuZXcgdGhyZWUuVmVjdG9yMyggLW9mZiwtb2ZmLG9mZiApICk7XG4gIHRoaXMuX2dlb21ldHJ5LnZlcnRpY2VzLnB1c2goIG5ldyB0aHJlZS5WZWN0b3IzKCBvZmYsLW9mZixvZmYgKSApO1xuICB0aGlzLl9nZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBuZXcgdGhyZWUuVmVjdG9yMyggb2ZmLC1vZmYsLW9mZiApICk7XG4gIHRoaXMuX2dlb21ldHJ5LnZlcnRpY2VzLnB1c2goIG5ldyB0aHJlZS5WZWN0b3IzKCAtb2ZmLC1vZmYsLW9mZiApICk7XG4gIHRoaXMuX2dlb21ldHJ5LnZlcnRpY2VzLnB1c2goIG5ldyB0aHJlZS5WZWN0b3IzKCAtb2ZmLC1vZmYsb2ZmICkgKTtcbiAgdGhpcy5tYXRlcmlhbCA9IG9wdGlvbnMubWF0ZXJpYWwgfHwgbmV3IHRocmVlLkxpbmVCYXNpY01hdGVyaWFsKHtjb2xvcjogdGhpcy5jb2xvcn0pO1xuICB0aGlzLmNlbnRlciA9IG5ldyB0aHJlZS5WZWN0b3IzKCk7XG5cbiAgaWYoIG9wdGlvbnMud2lkdGggJiYgb3B0aW9ucy5oZWlnaHQgKSB7XG4gICAgdmFyIHgseTtcbiAgICBmb3IoIHggPSAwOyB4IDwgb3B0aW9ucy53aWR0aDsgeCArPSAxICkge1xuICAgICAgZm9yKCB5ID0gMDsgeSA8IG9wdGlvbnMuaGVpZ2h0OyB5ICs9IDEgKSB7XG4gICAgICAgIHRoaXMuYWRkQ2VsbCgge3g6eCx5Onl9ICk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn07XG5cbkdyaWQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggdGhyZWUuT2JqZWN0M0QucHJvdG90eXBlICk7XG5cbkdyaWQucHJvdG90eXBlLmFkZENlbGwgPSBmdW5jdGlvbihwb3Mpe1xuICB0aGlzLm1heFggPSBNYXRoLm1heCggdGhpcy5tYXhYLCBwb3MueCApO1xuICB0aGlzLm1pblggPSBNYXRoLm1pbiggdGhpcy5taW5YLCBwb3MueCApO1xuICB0aGlzLm1heFkgPSBNYXRoLm1heCggdGhpcy5tYXhZLCBwb3MueSApO1xuICB0aGlzLm1pblkgPSBNYXRoLm1pbiggdGhpcy5taW5ZLCBwb3MueSApO1xuXG4gIHZhciB4ID0gcG9zLnggKiB0aGlzLmNlbGxzaXplO1xuICB2YXIgeiA9IC0gcG9zLnkgKiB0aGlzLmNlbGxzaXplO1xuXG4gIHZhciBjZWxsID0gbmV3IHRocmVlLkxpbmUodGhpcy5fZ2VvbWV0cnksdGhpcy5tYXRlcmlhbCk7XG4gIGNlbGwucG9zaXRpb24uc2V0KCB4LCAwLCB6ICk7XG4gIHRoaXMuYWRkKGNlbGwpO1xuICB0aGlzLmNlbGxzW3Bvcy54KycsJytwb3MueV0gPSBjZWxsO1xuXG4gIHRoaXMud2lkdGggPSB0aGlzLm1heFggLSB0aGlzLm1pblggKyAxO1xuICB0aGlzLmhlaWdodCA9IHRoaXMubWF4WSAtIHRoaXMubWluWSArIDE7XG4gIHRoaXMuc2l6ZVggPSB0aGlzLndpZHRoICogdGhpcy5jZWxsc2l6ZTtcbiAgdGhpcy5zaXplWSA9IHRoaXMuaGVpZ2h0ICogdGhpcy5jZWxsc2l6ZTtcbiAgdGhpcy5jZW50ZXIueCA9IHRoaXMubWluWCAqIHRoaXMuY2VsbHNpemUgKyB0aGlzLnNpemVYLzI7XG4gIHRoaXMuY2VudGVyLnogPSAtIHRoaXMubWluWSAqIHRoaXMuY2VsbHNpemUgLSB0aGlzLnNpemVZLzIgKyB0aGlzLmNlbGxzaXplO1xufTtcblxuR3JpZC5wcm90b3R5cGUucmVtb3ZlQ2VsbCA9IGZ1bmN0aW9uKHBvcyl7XG5cbn07XG5cbkdyaWQuRGlyZWN0aW9ucyA9IHtcbiAgbGVmdDogbmV3IHRocmVlLlZlY3RvcjIoMSwwKSxcbiAgcmlnaHQ6IG5ldyB0aHJlZS5WZWN0b3IyKC0xLDApLFxuICB1cDogbmV3IHRocmVlLlZlY3RvcjIoMCwtMSksXG4gIGRvd246IG5ldyB0aHJlZS5WZWN0b3IyKDAsMSlcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JpZDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwidmFyIGNyZWF0ZURpYWxvZyA9IGZ1bmN0aW9uKCkge1xuXG4gIHZhciBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgZGlhbG9nLnRpdGxlID0gJ0hlbHAnO1xuICB2YXIgc2VjdGlvbnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgW1xuXG4gICAge1xuICAgICAgdGl0bGU6ICdHZW5lcmFsJyxcbiAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgJ1RoaXMgZ2FtZSB3YXMgY3JlYXRlZCBmb3IgTHVkdW0gRGFyZSAzMScsXG4gICAgICAgICdIYXZlIGZ1biBhbmQgZG9uXFwndCBmb3JnZXQgdG8gYmUgYXdlc29tZSEnLFxuICAgICAgICAnPGEgaHJlZj1cIm1haWx0bzpjYWx2aW4uYnVsbGFAZ21haWwuY29tP1N1YmplY3Q9THVkdW0lMjBEYXJlJTIwMzFcIiB0YXJnZXQ9XCJfdG9wXCI+U2VuZCBtZSBhbiBlbWFpbDwvYT4nXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ09iamVjdGl2ZScsXG4gICAgICBjb250ZW50OiBbXG4gICAgICAgICdUaGVyZSBpcyBubyBvYmplY3RpdmUsIGp1c3QgcGxheSdcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIHRpdGxlOiAnQ29udHJvbHMnLFxuICAgICAgY29udGVudDogW1xuICAgICAgICAnVXNlIDxpPkg8L2k+IHRvIHRvZ2dsZSB0aGlzIGhlbHAgbWVudScsXG4gICAgICAgICdVc2UgPGk+QzwvaT4gdG8gY2hhbmdlIHRoZSB2aWV3IGFuZ2xlJ1xuICAgICAgXVxuICAgIH1cblxuICBdLmZvckVhY2goIGZ1bmN0aW9uKHNlY3Rpb24pe1xuXG4gICAgdmFyIGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gzJyk7XG4gICAgaGVhZGVyLmlubmVySFRNTCA9IHNlY3Rpb24udGl0bGU7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNlY3Rpb24uY29udGVudC5mb3JFYWNoKGZ1bmN0aW9uKGxpbmUpe1xuICAgICAgdmFyIHAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBwLmlubmVySFRNTCA9IGxpbmU7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQocCk7XG4gICAgfSk7XG4gICAgc2VjdGlvbnMuYXBwZW5kQ2hpbGQoIGhlYWRlciApO1xuICAgIHNlY3Rpb25zLmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICB9KTtcblxuICBkaWFsb2cuYXBwZW5kQ2hpbGQoc2VjdGlvbnMpO1xuXG4gICQoZnVuY3Rpb24oKXtcbiAgICAvLyAkKHNlY3Rpb25zKS5hY2NvcmRpb24oKTtcbiAgICAkKGRpYWxvZykuZGlhbG9nKHt3aWR0aDogNjAwLCBtb2RhbDogdHJ1ZSwgZHJhZ2dhYmxlOiBmYWxzZSwgaGVpZ2h0OiA0MDB9KTtcbiAgfSk7XG5cbiAgcmV0dXJuIGRpYWxvZztcblxufTtcblxudmFyIGRpYWxvZyA9IG51bGw7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYoIGRpYWxvZyApIHtcbiAgICAkKGRpYWxvZykuZGlhbG9nKCdkZXN0cm95Jyk7XG4gICAgZGlhbG9nID0gbnVsbDtcbiAgfSBlbHNlIHtcbiAgICBkaWFsb2cgPSBjcmVhdGVEaWFsb2coKTtcbiAgfVxuXG59O1xuXG4vLyBpZiggIURldGVjdG9yLndlYmdsICkge1xuLy8gICBEZXRlY3Rvci5hZGRHZXRXZWJHTE1lc3NhZ2UoKTtcbi8vXG4vLyAgIHZhciBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbi8vICAgaW1nLnNyYyA9ICdpbWcvZXJyb3InKyBNYXRoLmZsb29yKCBNYXRoLnJhbmRvbSgpKjQgKSArJy5qcGcnO1xuLy8gICBpbWcuaWQgPSAnZXJyb3InO1xuLy8gICBpbWcub25jbGljayA9IGZ1bmN0aW9uKCkge1xuLy8gICAgIHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Lmdvb2dsZS5jb20vY2hyb21lLycpO1xuLy8gICAgIHdpbmRvdy5vcGVuKCdodHRwOi8vd3d3Lm1vemlsbGEub3JnL2VuLVVTL2ZpcmVmb3gvbmV3LycpO1xuLy8gICB9O1xuLy8gICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGltZyk7XG4vL1xuLy8gICByZXR1cm47XG4vLyB9XG4iLCJ2YXIgYWxpYXMgPSB7XG4gICdsZWZ0JyAgOiAzNyxcbiAgJ3VwJyAgICA6IDM4LFxuICAncmlnaHQnIDogMzksXG4gICdkb3duJyAgOiA0MCxcbiAgJ3NwYWNlJyA6IDMyLFxuICAndGFiJyAgIDogOSxcbiAgJ3BhZ2V1cCcgICAgOiAzMyxcbiAgJ3BhZ2Vkb3duJyAgOiAzNCxcbiAgJ2VzY2FwZScgICAgOiAyNyxcbiAgJ2JhY2tzcGFjZScgOiA4LFxuICAnbWV0YScgIDogOTEsXG4gICdhbHQnICAgOiAxOCxcbiAgJ2N0cmwnICA6IDE3LFxuICAnc2hpZnQnIDogMTYsXG4gICdmMScgIDogMTEyLFxuICAnZjInICA6IDExMyxcbiAgJ2YzJyAgOiAxMTQsXG4gICdmNCcgIDogMTE1LFxuICAnZjUnICA6IDExNixcbiAgJ2Y2JyAgOiAxMTcsXG4gICdmNycgIDogMTE4LFxuICAnZjgnICA6IDExOSxcbiAgJ2Y5JyAgOiAxMjAsXG4gICdmMTAnIDogMTIxLFxuICAnZjExJyA6IDEyMixcbiAgJ2YxMicgOiAxMjNcbn07XG5cbnZhciBsaXN0ZW5lcnMgPSB7fTtcblxudmFyIHByZXNzZWQgPSB7fTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXl1cCcsZnVuY3Rpb24oZXZlbnQpe1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBwcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gZmFsc2U7XG59LGZhbHNlKTtcblxuZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJyxmdW5jdGlvbihldmVudCl7XG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIHByZXNzZWRbZXZlbnQua2V5Q29kZV0gPSB0cnVlO1xuICBPYmplY3Qua2V5cyhsaXN0ZW5lcnMpLmZvckVhY2goZnVuY3Rpb24oa2V5cyl7XG4gICAgdmFyIGksbGVuO1xuICAgIHZhciBhcnIgPSBrZXlzLnNwbGl0KCcrJyk7XG4gICAgZm9yKCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxICkge1xuICAgICAga2V5ID0gYXJyW2ldO1xuICAgICAga2V5Q29kZSA9IGFsaWFzW2tleV0gfHwga2V5LnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgICAgIGlmKCAhcHJlc3NlZFtrZXlDb2RlXSApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICB2YXIgcHJvcCA9IHRydWU7XG4gICAgYXJyID0gbGlzdGVuZXJzW2tleXNdO1xuICAgIGV2dCA9IHtcbiAgICAgIHN0b3BQcm9wYWdhdGlvbjogZnVuY3Rpb24oKXsgcHJvcCA9IGZhbHNlOyB9LFxuICAgICAgdHlwZToga2V5c1xuICAgIH07XG4gICAgZm9yKCBpID0gMCwgbGVuID0gYXJyLmxlbmd0aDsgaSA8IGxlbiAmJiBwcm9wOyBpICs9IDEgKcKge1xuICAgICAgYXJyW2ldLmNhbGwobnVsbCxldnQpO1xuICAgIH1cbiAgfSk7XG59LGZhbHNlKTtcblxuZXhwb3J0cy5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICl7XG4gIHZhciBrZXlzID0gdHlwZS5zcGxpdCgnKycpLnNvcnQoKS5qb2luKCcrJyk7XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10gPT09IHVuZGVmaW5lZCApIHtcbiAgICBsaXN0ZW5lcnNba2V5c10gPSBbXTtcbiAgfVxuICBpZiggbGlzdGVuZXJzW2tleXNdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSApIHtcbiAgICBsaXN0ZW5lcnNba2V5c10ucHVzaChsaXN0ZW5lcik7XG4gIH1cbn07XG5cbmV4cG9ydHMucmVtb3ZlRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdICE9PSB1bmRlZmluZWQgKSB7XG4gICAgdmFyIGluZGV4ID0gbGlzdGVuZXJzW2tleXNdLmluZGV4T2YobGlzdGVuZXIpO1xuICAgIGlmKCBpbmRleCAhPT0gLTEgKSB7XG4gICAgICBsaXN0ZW5lcnNba2V5c10uc3BsaWNlKGluZGV4LDEpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0cy5oYXNFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oIHR5cGUsIGxpc3RlbmVyICl7XG4gIHZhciBrZXlzID0gdHlwZS5zcGxpdCgnKycpLnNvcnQoKS5qb2luKCcrJyk7XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10gPT09IHVuZGVmaW5lZCApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYoIGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5leHBvcnRzLmRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiggZXZlbnQgKXtcbiAgdmFyIHR5cGUgPSBldmVudC50eXBlO1xuICBpZiggbGlzdGVuZXJzW3R5cGVdID09PSB1bmRlZmluZWQgKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxpc3RlbmVyc1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICBsaXN0ZW5lci5jYWxsKGV2ZW50KTtcbiAgfSk7XG59O1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHRocmVlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVEhSRUUgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRIUkVFIDogbnVsbCk7XG52YXIgdHdlZW4gPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5UV0VFTiA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVFdFRU4gOiBudWxsKTtcblxudmFyIFBsYXllcjNEID0gZnVuY3Rpb24oIG9wdGlvbnMgKSB7XG5cbiAgdGhyZWUuT2JqZWN0M0QuY2FsbCh0aGlzKTtcblxuICB0aGlzLnR5cGUgPSAnUGxheWVyM0QnO1xuXG4gIHRoaXMuX3NpemUgPSBvcHRpb25zLl9zaXplIHx8IDE7XG4gIHZhciBtYXRlcmlhbCA9IG9wdGlvbnMubWF0ZXJpYWwgfHwgbmV3IHRocmVlLk1lc2hCYXNpY01hdGVyaWFsKHtjb2xvcjogMHhmZmZmZmYgKiBNYXRoLnJhbmRvbSgpfSk7XG4gIHZhciBnZW9tZXRyeSA9IG5ldyB0aHJlZS5Cb3hHZW9tZXRyeSh0aGlzLl9zaXplLHRoaXMuX3NpemUsdGhpcy5fc2l6ZSk7XG4gIHRoaXMuX2N1YmUgPSBuZXcgdGhyZWUuTWVzaChnZW9tZXRyeSxtYXRlcmlhbCk7XG4gIHRoaXMuX2N1YmUucG9zaXRpb24ueSA9IHRoaXMuX3NpemUgLyAyO1xuICB0aGlzLl9heGlzID0gbmV3IHRocmVlLk9iamVjdDNEKCk7XG4gIHRoaXMuX2F4aXMucG9zaXRpb24ueSA9IC0gdGhpcy5fc2l6ZSAvIDI7XG4gIHRoaXMuX2F4aXMuYWRkKHRoaXMuX2N1YmUpO1xuICB0aGlzLmFkZCh0aGlzLl9heGlzKTtcbiAgdGhpcy5fYW5pbWF0aW9uID0gbnVsbDtcbiAgdGhpcy5fbW92aW5nID0gZmFsc2U7XG59O1xuXG5QbGF5ZXIzRC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCB0aHJlZS5PYmplY3QzRC5wcm90b3R5cGUgKTtcblxuUGxheWVyM0QucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbihkaXIsZHQpe1xuICBpZiggdGhpcy5fbW92aW5nICkge1xuICAgIHJldHVybjtcbiAgfVxuICBkaXIueCA9IGRpci54ID09PSB1bmRlZmluZWQgPyAwIDogZGlyLng7XG4gIGRpci55ID0gZGlyLnkgPT09IHVuZGVmaW5lZCA/IDAgOiBkaXIueTtcbiAgdGhpcy5fYXhpcy5wb3NpdGlvbi54ICs9IGRpci54ICogdGhpcy5fc2l6ZSAvIDI7XG4gIHRoaXMuX2N1YmUucG9zaXRpb24ueCAtPSBkaXIueCAqIHRoaXMuX3NpemUgLyAyO1xuICB0aGlzLl9heGlzLnBvc2l0aW9uLnogLT0gZGlyLnkgKiB0aGlzLl9zaXplIC8gMjtcbiAgdGhpcy5fY3ViZS5wb3NpdGlvbi56ICs9IGRpci55ICogdGhpcy5fc2l6ZSAvIDI7XG4gIHZhciByb3RYID0gLSBkaXIueSAqIDAuNSAqIE1hdGguUEk7XG4gIHZhciByb3RaID0gLSBkaXIueCAqIDAuNSAqIE1hdGguUEk7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIHRoaXMuX2FuaW1hdGlvbiA9IG5ldyB0d2Vlbi5Ud2VlbiggeyB4OiAwLCB6OiAwIH0gKVxuICAgIC50byh7eDogcm90WCwgejogcm90Wn0sIGR0KVxuICAgIC5vblVwZGF0ZShmdW5jdGlvbigpe1xuICAgICAgX3RoaXMuX2F4aXMucm90YXRpb24ueCA9IHRoaXMueDtcbiAgICAgIF90aGlzLl9heGlzLnJvdGF0aW9uLnogPSB0aGlzLno7XG4gICAgfSlcbiAgICAuZWFzaW5nKHR3ZWVuLkVhc2luZy5TaW51c29pZGFsLkluT3V0KVxuICAgIC5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICBfdGhpcy5fYXhpcy5yb3RhdGVYKC1yb3RYKTtcbiAgICAgIF90aGlzLl9heGlzLnJvdGF0ZVooLXJvdFopO1xuICAgICAgX3RoaXMuX2F4aXMucG9zaXRpb24ueCAtPSBkaXIueCAqIF90aGlzLl9zaXplIC8gMjtcbiAgICAgIF90aGlzLl9jdWJlLnBvc2l0aW9uLnggKz0gZGlyLnggKiBfdGhpcy5fc2l6ZSAvIDI7XG4gICAgICBfdGhpcy5fYXhpcy5wb3NpdGlvbi56ICs9IGRpci55ICogX3RoaXMuX3NpemUgLyAyO1xuICAgICAgX3RoaXMuX2N1YmUucG9zaXRpb24ueiAtPSBkaXIueSAqIF90aGlzLl9zaXplIC8gMjtcblxuICAgICAgX3RoaXMucG9zaXRpb24ueCArPSBkaXIueCAqIF90aGlzLl9zaXplO1xuICAgICAgX3RoaXMucG9zaXRpb24ueiAtPSBkaXIueSAqIF90aGlzLl9zaXplO1xuICAgICAgX3RoaXMuX21vdmluZyA9IGZhbHNlO1xuICAgIH0pXG4gICAgLnN0YXJ0KCk7XG4gIHRoaXMuX21vdmluZyA9IHRydWU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjNEO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSkiXX0=
