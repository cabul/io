(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    { posx: -10, posy: 10, posz: 10,
      rotx: -0.7853981603287307,
      roty: -0.6154796918457905,
      rotz: -0.523598776277004 },
    { posx: 10, posy: 10, posz: 10,
      rotx: -0.7853981603287307,
      roty: 0.6154796918457905,
      rotz: 0.523598776277004 }
    // { posx: 0, posy: 10, posz: 0,
    //   rotx: -1.5707963267948966,
    //   roty: 0.0,
    //   rotz: -0.7853981633974481 }
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
},{"./keycombo":4}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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
},{}],6:[function(require,module,exports){
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
},{"./cameracontrols":1,"./grid":2,"./help":3,"./keycombo":4,"./player":5}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsInNyYy9jYW1lcmFjb250cm9scy5qcyIsInNyYy9ncmlkLmpzIiwic3JjL2hlbHAuanMiLCJzcmMva2V5Y29tYm8uanMiLCJzcmMvcGxheWVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIGtleWNvbWJvID0gcmVxdWlyZSgnLi9rZXljb21ibycpO1xudmFyIFRXRUVOID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG52YXIgdGhyZWUgPSAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdy5USFJFRSA6IHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwuVEhSRUUgOiBudWxsKTtcblxudmFyIENhbWVyYUNvbnRyb2xzID0gZnVuY3Rpb24oIGNhbWVyYSwgZG9tRWxlbWVudCApIHtcblxuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB0aGlzLm5vWm9vbSA9IGZhbHNlO1xuICB0aGlzLm5vUm90YXRlID0gZmFsc2U7XG4gIHRoaXMuZG9tRWxlbWVudCA9IGRvbUVsZW1lbnQ7XG4gIHRoaXMuem9vbVNwZWVkID0gMS4yO1xuICB0aGlzLmNhbWVyYSA9IGNhbWVyYTtcbiAgdGhpcy5zdGF0aWNNb3ZpbmcgPSBmYWxzZTtcbiAgdGhpcy5keW5hbWljRGFtcGluZ0ZhY3RvciA9IDAuMjtcbiAgdGhpcy5tYXhab29tID0gMjAwO1xuICB0aGlzLm1pblpvb20gPSAyMDtcbiAgdGhpcy52aWV3Q2hhbmdlID0gODAwO1xuICB0aGlzLl9mb2N1cyA9IG5ldyB0aHJlZS5WZWN0b3IzKCk7XG4gIHZhciB6b29tID0gMDtcblxuICB2YXIgbW91c2V3aGVlbCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgaWYoICFfdGhpcy5lbmFibGVkICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgdmFyIGRlbHRhID0gMDtcblxuICAgIGlmKCBldmVudC53aGVlbERlbHRhICkge1xuICAgICAgZGVsdGEgPSBldmVudC53aGVlbERlbHRhIC8gNDA7XG4gICAgfSBlbHNlIGlmKCBldmVudC5kZXRhaWwgKSB7XG4gICAgICBkZWx0YSA9IGV2ZW50LmRldGFpbCAvIDM7XG4gICAgfVxuXG4gICAgem9vbSArPSBkZWx0YSAqIDAuMDE7XG4gIH07XG5cbiAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNld2hlZWwnLG1vdXNld2hlZWwsIGZhbHNlKTtcbiAgdGhpcy5kb21FbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTU1vdXNlU2Nyb2xsJyxtb3VzZXdoZWVsLCBmYWxzZSk7XG5cbiAgdmFyIHVwZGF0ZVpvb20gPSBmdW5jdGlvbigpIHtcbiAgICBpZiggem9vbSA9PT0gMCApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGZhY3RvciA9IDEuMCArIHpvb20gKiBfdGhpcy56b29tU3BlZWQ7XG5cbiAgICBfdGhpcy5zZXRab29tKE1hdGgubWluKCBfdGhpcy5tYXhab29tLCBNYXRoLm1heChfdGhpcy5taW5ab29tLCAoX3RoaXMuY2FtZXJhLnpvb20gKiBmYWN0b3IpKSApKTtcblxuICAgIGlmKCBfdGhpcy5zdGF0aWNNb3ZpbmcgKSB7XG4gICAgICB6b29tID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgem9vbSAtPSB6b29tKl90aGlzLmR5bmFtaWNEYW1waW5nRmFjdG9yO1xuICAgIH1cbiAgfTtcblxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKCAhX3RoaXMubm9ab29tICkge1xuICAgICAgdXBkYXRlWm9vbSgpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgdmlld1N0YXRlID0gMTtcbiAgdmFyIGNhbUNvbmZpZ3MgPSBbXG4gICAgeyBwb3N4OiAtMTAsIHBvc3k6IDEwLCBwb3N6OiAxMCxcbiAgICAgIHJvdHg6IC0wLjc4NTM5ODE2MDMyODczMDcsXG4gICAgICByb3R5OiAtMC42MTU0Nzk2OTE4NDU3OTA1LFxuICAgICAgcm90ejogLTAuNTIzNTk4Nzc2Mjc3MDA0IH0sXG4gICAgeyBwb3N4OiAxMCwgcG9zeTogMTAsIHBvc3o6IDEwLFxuICAgICAgcm90eDogLTAuNzg1Mzk4MTYwMzI4NzMwNyxcbiAgICAgIHJvdHk6IDAuNjE1NDc5NjkxODQ1NzkwNSxcbiAgICAgIHJvdHo6IDAuNTIzNTk4Nzc2Mjc3MDA0IH1cbiAgICAvLyB7IHBvc3g6IDAsIHBvc3k6IDEwLCBwb3N6OiAwLFxuICAgIC8vICAgcm90eDogLTEuNTcwNzk2MzI2Nzk0ODk2NixcbiAgICAvLyAgIHJvdHk6IDAuMCxcbiAgICAvLyAgIHJvdHo6IC0wLjc4NTM5ODE2MzM5NzQ0ODEgfVxuICBdO1xuXG4gIHZhciBjaGFuZ2luZ1ZpZXcgPSBmYWxzZTtcblxuICB0aGlzLmNoYW5nZVZpZXcgPSBmdW5jdGlvbigpe1xuICAgIGlmKCBfdGhpcy5ub1JvdGF0ZSApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoIGNoYW5naW5nVmlldyApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIGNvbmZpZyA9IEpTT04ucGFyc2UoIEpTT04uc3RyaW5naWZ5KGNhbUNvbmZpZ3Nbdmlld1N0YXRlXSkpO1xuICAgIHZpZXdTdGF0ZSA9ICh2aWV3U3RhdGUgKyAxKSAlIGNhbUNvbmZpZ3MubGVuZ3RoO1xuICAgIHZhciBuZXdDb25maWcgPSBjYW1Db25maWdzW3ZpZXdTdGF0ZV07XG4gICAgdmFyIHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKGNvbmZpZylcbiAgICAudG8obmV3Q29uZmlnLF90aGlzLnZpZXdDaGFuZ2UpXG4gICAgLmVhc2luZyggVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5Jbk91dCApXG4gICAgLm9uVXBkYXRlKCBmdW5jdGlvbigpe1xuICAgICAgX3RoaXMuc2V0Vmlldyh0aGlzKTtcbiAgICB9KS5vbkNvbXBsZXRlKGZ1bmN0aW9uKCl7XG4gICAgICBjaGFuZ2luZ1ZpZXcgPSBmYWxzZTtcbiAgICB9KTtcbiAgICBjaGFuZ2luZ1ZpZXcgPSB0cnVlO1xuICAgIHR3ZWVuLnN0YXJ0KCk7XG4gIH07XG5cbiAgdGhpcy5zZXRWaWV3KGNhbUNvbmZpZ3Nbdmlld1N0YXRlXSk7XG5cbn07XG5cblxuQ2FtZXJhQ29udHJvbHMucHJvdG90eXBlID0ge1xuXG4gIGNvbnN0cnVjdG9yOiBDYW1lcmFDb250cm9scyxcbiAgaGFuZGxlUmVzaXplOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNhbWVyYS5sZWZ0ID0gLSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG4gICAgdGhpcy5jYW1lcmEucmlnaHQgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIDI7XG4gICAgdGhpcy5jYW1lcmEudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC8gMjtcbiAgICB0aGlzLmNhbWVyYS5ib3R0b20gPSAtIHdpbmRvdy5pbm5lckhlaWdodCAvIDI7XG4gICAgdGhpcy5jYW1lcmEudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB9LFxuICBzZXRWaWV3OiBmdW5jdGlvbih2aWV3KXtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi54ID0gdmlldy5wb3N4ICsgdGhpcy5fZm9jdXMueDtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi55ID0gdmlldy5wb3N5ICsgdGhpcy5fZm9jdXMueTtcbiAgICB0aGlzLmNhbWVyYS5wb3NpdGlvbi56ID0gdmlldy5wb3N6ICsgdGhpcy5fZm9jdXMuejtcbiAgICB0aGlzLmNhbWVyYS5yb3RhdGlvbi54ID0gdmlldy5yb3R4O1xuICAgIHRoaXMuY2FtZXJhLnJvdGF0aW9uLnkgPSB2aWV3LnJvdHk7XG4gICAgdGhpcy5jYW1lcmEucm90YXRpb24ueiA9IHZpZXcucm90ejtcbiAgfSxcblxuICBzZXRab29tOiBmdW5jdGlvbih6b29tKXtcbiAgICB0aGlzLmNhbWVyYS56b29tID0gem9vbTtcbiAgICB0aGlzLmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH0sXG4gIHNldEZvY3VzOiBmdW5jdGlvbihmb2N1cyl7XG4gICAgdGhpcy5jYW1lcmEucG9zaXRpb24uc3ViKHRoaXMuX2ZvY3VzKS5hZGQoZm9jdXMpO1xuICAgIHRoaXMuX2ZvY3VzID0gZm9jdXM7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDYW1lcmFDb250cm9scztcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIHRocmVlID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVEhSRUUgOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRIUkVFIDogbnVsbCk7XG5cbnZhciBHcmlkID0gZnVuY3Rpb24ob3B0aW9ucyl7XG5cbiAgdGhyZWUuT2JqZWN0M0QuY2FsbCh0aGlzKTtcblxuICB0aGlzLnR5cGUgPSAnR3JpZE1lc2gnO1xuXG4gIHRoaXMuY2VsbHNpemUgPSBvcHRpb25zLmNlbGxzaXplIHx8IDE7XG4gIHRoaXMuY29sb3IgPSBvcHRpb25zLmNvbG9yIHx8wqAweGZmZmZmZjtcbiAgdGhpcy5jZWxscyA9IFtdO1xuICB0aGlzLm1pblggPSAwO1xuICB0aGlzLm1pblkgPSAwO1xuICB0aGlzLm1heFggPSAtMTtcbiAgdGhpcy5tYXhZID0gLTE7XG4gIHRoaXMuX2dlb21ldHJ5ID0gbmV3IHRocmVlLkdlb21ldHJ5KCk7XG4gIHZhciBvZmYgPSB0aGlzLmNlbGxzaXplIC8gMjtcbiAgdGhpcy5fZ2VvbWV0cnkudmVydGljZXMucHVzaCggbmV3IHRocmVlLlZlY3RvcjMoIC1vZmYsLW9mZixvZmYgKSApO1xuICB0aGlzLl9nZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBuZXcgdGhyZWUuVmVjdG9yMyggb2ZmLC1vZmYsb2ZmICkgKTtcbiAgdGhpcy5fZ2VvbWV0cnkudmVydGljZXMucHVzaCggbmV3IHRocmVlLlZlY3RvcjMoIG9mZiwtb2ZmLC1vZmYgKSApO1xuICB0aGlzLl9nZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBuZXcgdGhyZWUuVmVjdG9yMyggLW9mZiwtb2ZmLC1vZmYgKSApO1xuICB0aGlzLl9nZW9tZXRyeS52ZXJ0aWNlcy5wdXNoKCBuZXcgdGhyZWUuVmVjdG9yMyggLW9mZiwtb2ZmLG9mZiApICk7XG4gIHRoaXMubWF0ZXJpYWwgPSBvcHRpb25zLm1hdGVyaWFsIHx8IG5ldyB0aHJlZS5MaW5lQmFzaWNNYXRlcmlhbCh7Y29sb3I6IHRoaXMuY29sb3J9KTtcbiAgdGhpcy5jZW50ZXIgPSBuZXcgdGhyZWUuVmVjdG9yMygpO1xuXG4gIGlmKCBvcHRpb25zLndpZHRoICYmIG9wdGlvbnMuaGVpZ2h0ICkge1xuICAgIHZhciB4LHk7XG4gICAgZm9yKCB4ID0gMDsgeCA8IG9wdGlvbnMud2lkdGg7IHggKz0gMSApIHtcbiAgICAgIGZvciggeSA9IDA7IHkgPCBvcHRpb25zLmhlaWdodDsgeSArPSAxICkge1xuICAgICAgICB0aGlzLmFkZENlbGwoIHt4OngseTp5fSApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG59O1xuXG5HcmlkLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIHRocmVlLk9iamVjdDNELnByb3RvdHlwZSApO1xuXG5HcmlkLnByb3RvdHlwZS5hZGRDZWxsID0gZnVuY3Rpb24ocG9zKXtcbiAgdGhpcy5tYXhYID0gTWF0aC5tYXgoIHRoaXMubWF4WCwgcG9zLnggKTtcbiAgdGhpcy5taW5YID0gTWF0aC5taW4oIHRoaXMubWluWCwgcG9zLnggKTtcbiAgdGhpcy5tYXhZID0gTWF0aC5tYXgoIHRoaXMubWF4WSwgcG9zLnkgKTtcbiAgdGhpcy5taW5ZID0gTWF0aC5taW4oIHRoaXMubWluWSwgcG9zLnkgKTtcblxuICB2YXIgeCA9IHBvcy54ICogdGhpcy5jZWxsc2l6ZTtcbiAgdmFyIHogPSAtIHBvcy55ICogdGhpcy5jZWxsc2l6ZTtcblxuICB2YXIgY2VsbCA9IG5ldyB0aHJlZS5MaW5lKHRoaXMuX2dlb21ldHJ5LHRoaXMubWF0ZXJpYWwpO1xuICBjZWxsLnBvc2l0aW9uLnNldCggeCwgMCwgeiApO1xuICB0aGlzLmFkZChjZWxsKTtcbiAgdGhpcy5jZWxsc1twb3MueCsnLCcrcG9zLnldID0gY2VsbDtcblxuICB0aGlzLndpZHRoID0gdGhpcy5tYXhYIC0gdGhpcy5taW5YICsgMTtcbiAgdGhpcy5oZWlnaHQgPSB0aGlzLm1heFkgLSB0aGlzLm1pblkgKyAxO1xuICB0aGlzLnNpemVYID0gdGhpcy53aWR0aCAqIHRoaXMuY2VsbHNpemU7XG4gIHRoaXMuc2l6ZVkgPSB0aGlzLmhlaWdodCAqIHRoaXMuY2VsbHNpemU7XG4gIHRoaXMuY2VudGVyLnggPSB0aGlzLm1pblggKiB0aGlzLmNlbGxzaXplICsgdGhpcy5zaXplWC8yO1xuICB0aGlzLmNlbnRlci56ID0gLSB0aGlzLm1pblkgKiB0aGlzLmNlbGxzaXplIC0gdGhpcy5zaXplWS8yICsgdGhpcy5jZWxsc2l6ZTtcbn07XG5cbkdyaWQucHJvdG90eXBlLnJlbW92ZUNlbGwgPSBmdW5jdGlvbihwb3Mpe1xuXG59O1xuXG5HcmlkLkRpcmVjdGlvbnMgPSB7XG4gIGxlZnQ6IG5ldyB0aHJlZS5WZWN0b3IyKDEsMCksXG4gIHJpZ2h0OiBuZXcgdGhyZWUuVmVjdG9yMigtMSwwKSxcbiAgdXA6IG5ldyB0aHJlZS5WZWN0b3IyKDAsLTEpLFxuICBkb3duOiBuZXcgdGhyZWUuVmVjdG9yMigwLDEpXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyaWQ7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsInZhciBjcmVhdGVEaWFsb2cgPSBmdW5jdGlvbigpIHtcblxuICB2YXIgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGRpYWxvZy50aXRsZSA9ICdIZWxwJztcbiAgdmFyIHNlY3Rpb25zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIFtcblxuICAgIHtcbiAgICAgIHRpdGxlOiAnR2VuZXJhbCcsXG4gICAgICBjb250ZW50OiBbXG4gICAgICAgICdUaGlzIGdhbWUgd2FzIGNyZWF0ZWQgZm9yIEx1ZHVtIERhcmUgMzEnLFxuICAgICAgICAnSGF2ZSBmdW4gYW5kIGRvblxcJ3QgZm9yZ2V0IHRvIGJlIGF3ZXNvbWUhJyxcbiAgICAgICAgJzxhIGhyZWY9XCJtYWlsdG86Y2FsdmluLmJ1bGxhQGdtYWlsLmNvbT9TdWJqZWN0PUx1ZHVtJTIwRGFyZSUyMDMxXCIgdGFyZ2V0PVwiX3RvcFwiPlNlbmQgbWUgYW4gZW1haWw8L2E+J1xuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgdGl0bGU6ICdPYmplY3RpdmUnLFxuICAgICAgY29udGVudDogW1xuICAgICAgICAnVGhlcmUgaXMgbm8gb2JqZWN0aXZlLCBqdXN0IHBsYXknXG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICB0aXRsZTogJ0NvbnRyb2xzJyxcbiAgICAgIGNvbnRlbnQ6IFtcbiAgICAgICAgJ1VzZSA8aT5IPC9pPiB0byB0b2dnbGUgdGhpcyBoZWxwIG1lbnUnLFxuICAgICAgICAnVXNlIDxpPkM8L2k+IHRvIGNoYW5nZSB0aGUgdmlldyBhbmdsZSdcbiAgICAgIF1cbiAgICB9XG5cbiAgXS5mb3JFYWNoKCBmdW5jdGlvbihzZWN0aW9uKXtcblxuICAgIHZhciBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMycpO1xuICAgIGhlYWRlci5pbm5lckhUTUwgPSBzZWN0aW9uLnRpdGxlO1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBzZWN0aW9uLmNvbnRlbnQuZm9yRWFjaChmdW5jdGlvbihsaW5lKXtcbiAgICAgIHZhciBwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgcC5pbm5lckhUTUwgPSBsaW5lO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKHApO1xuICAgIH0pO1xuICAgIHNlY3Rpb25zLmFwcGVuZENoaWxkKCBoZWFkZXIgKTtcbiAgICBzZWN0aW9ucy5hcHBlbmRDaGlsZCggZGl2ICk7XG5cbiAgfSk7XG5cbiAgZGlhbG9nLmFwcGVuZENoaWxkKHNlY3Rpb25zKTtcblxuICAkKGZ1bmN0aW9uKCl7XG4gICAgLy8gJChzZWN0aW9ucykuYWNjb3JkaW9uKCk7XG4gICAgJChkaWFsb2cpLmRpYWxvZyh7d2lkdGg6IDYwMCwgbW9kYWw6IHRydWUsIGRyYWdnYWJsZTogZmFsc2UsIGhlaWdodDogNDAwfSk7XG4gIH0pO1xuXG4gIHJldHVybiBkaWFsb2c7XG5cbn07XG5cbnZhciBkaWFsb2cgPSBudWxsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuXG4gIGlmKCBkaWFsb2cgKSB7XG4gICAgJChkaWFsb2cpLmRpYWxvZygnZGVzdHJveScpO1xuICAgIGRpYWxvZyA9IG51bGw7XG4gIH0gZWxzZSB7XG4gICAgZGlhbG9nID0gY3JlYXRlRGlhbG9nKCk7XG4gIH1cblxufTtcblxuLy8gaWYoICFEZXRlY3Rvci53ZWJnbCApIHtcbi8vICAgRGV0ZWN0b3IuYWRkR2V0V2ViR0xNZXNzYWdlKCk7XG4vL1xuLy8gICB2YXIgaW1nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4vLyAgIGltZy5zcmMgPSAnaW1nL2Vycm9yJysgTWF0aC5mbG9vciggTWF0aC5yYW5kb20oKSo0ICkgKycuanBnJztcbi8vICAgaW1nLmlkID0gJ2Vycm9yJztcbi8vICAgaW1nLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbi8vICAgICB3aW5kb3cub3BlbignaHR0cDovL3d3dy5nb29nbGUuY29tL2Nocm9tZS8nKTtcbi8vICAgICB3aW5kb3cub3BlbignaHR0cDovL3d3dy5tb3ppbGxhLm9yZy9lbi1VUy9maXJlZm94L25ldy8nKTtcbi8vICAgfTtcbi8vICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbWcpO1xuLy9cbi8vICAgcmV0dXJuO1xuLy8gfVxuIiwidmFyIGFsaWFzID0ge1xuICAnbGVmdCcgIDogMzcsXG4gICd1cCcgICAgOiAzOCxcbiAgJ3JpZ2h0JyA6IDM5LFxuICAnZG93bicgIDogNDAsXG4gICdzcGFjZScgOiAzMixcbiAgJ3RhYicgICA6IDksXG4gICdwYWdldXAnICAgIDogMzMsXG4gICdwYWdlZG93bicgIDogMzQsXG4gICdlc2NhcGUnICAgIDogMjcsXG4gICdiYWNrc3BhY2UnIDogOCxcbiAgJ21ldGEnICA6IDkxLFxuICAnYWx0JyAgIDogMTgsXG4gICdjdHJsJyAgOiAxNyxcbiAgJ3NoaWZ0JyA6IDE2LFxuICAnZjEnICA6IDExMixcbiAgJ2YyJyAgOiAxMTMsXG4gICdmMycgIDogMTE0LFxuICAnZjQnICA6IDExNSxcbiAgJ2Y1JyAgOiAxMTYsXG4gICdmNicgIDogMTE3LFxuICAnZjcnICA6IDExOCxcbiAgJ2Y4JyAgOiAxMTksXG4gICdmOScgIDogMTIwLFxuICAnZjEwJyA6IDEyMSxcbiAgJ2YxMScgOiAxMjIsXG4gICdmMTInIDogMTIzXG59O1xuXG52YXIgbGlzdGVuZXJzID0ge307XG5cbnZhciBwcmVzc2VkID0ge307XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLGZ1bmN0aW9uKGV2ZW50KXtcbiAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgcHJlc3NlZFtldmVudC5rZXlDb2RlXSA9IGZhbHNlO1xufSxmYWxzZSk7XG5cbmRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsZnVuY3Rpb24oZXZlbnQpe1xuICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICBwcmVzc2VkW2V2ZW50LmtleUNvZGVdID0gdHJ1ZTtcbiAgT2JqZWN0LmtleXMobGlzdGVuZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGtleXMpe1xuICAgIHZhciBpLGxlbjtcbiAgICB2YXIgYXJyID0ga2V5cy5zcGxpdCgnKycpO1xuICAgIGZvciggaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSApIHtcbiAgICAgIGtleSA9IGFycltpXTtcbiAgICAgIGtleUNvZGUgPSBhbGlhc1trZXldIHx8IGtleS50b1VwcGVyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XG4gICAgICBpZiggIXByZXNzZWRba2V5Q29kZV0gKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHByb3AgPSB0cnVlO1xuICAgIGFyciA9IGxpc3RlbmVyc1trZXlzXTtcbiAgICBldnQgPSB7XG4gICAgICBzdG9wUHJvcGFnYXRpb246IGZ1bmN0aW9uKCl7IHByb3AgPSBmYWxzZTsgfSxcbiAgICAgIHR5cGU6IGtleXNcbiAgICB9O1xuICAgIGZvciggaSA9IDAsIGxlbiA9IGFyci5sZW5ndGg7IGkgPCBsZW4gJiYgcHJvcDsgaSArPSAxICnCoHtcbiAgICAgIGFycltpXS5jYWxsKG51bGwsZXZ0KTtcbiAgICB9XG4gIH0pO1xufSxmYWxzZSk7XG5cbmV4cG9ydHMuYWRkRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdID09PSB1bmRlZmluZWQgKSB7XG4gICAgbGlzdGVuZXJzW2tleXNdID0gW107XG4gIH1cbiAgaWYoIGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEgKSB7XG4gICAgbGlzdGVuZXJzW2tleXNdLnB1c2gobGlzdGVuZXIpO1xuICB9XG59O1xuXG5leHBvcnRzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiggdHlwZSwgbGlzdGVuZXIgKXtcbiAgdmFyIGtleXMgPSB0eXBlLnNwbGl0KCcrJykuc29ydCgpLmpvaW4oJysnKTtcbiAgaWYoIGxpc3RlbmVyc1trZXlzXSAhPT0gdW5kZWZpbmVkICkge1xuICAgIHZhciBpbmRleCA9IGxpc3RlbmVyc1trZXlzXS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICBpZiggaW5kZXggIT09IC0xICkge1xuICAgICAgbGlzdGVuZXJzW2tleXNdLnNwbGljZShpbmRleCwxKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydHMuaGFzRXZlbnRMaXN0ZW5lciA9IGZ1bmN0aW9uKCB0eXBlLCBsaXN0ZW5lciApe1xuICB2YXIga2V5cyA9IHR5cGUuc3BsaXQoJysnKS5zb3J0KCkuam9pbignKycpO1xuICBpZiggbGlzdGVuZXJzW2tleXNdID09PSB1bmRlZmluZWQgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmKCBsaXN0ZW5lcnNba2V5c10uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xICkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxuZXhwb3J0cy5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24oIGV2ZW50ICl7XG4gIHZhciB0eXBlID0gZXZlbnQudHlwZTtcbiAgaWYoIGxpc3RlbmVyc1t0eXBlXSA9PT0gdW5kZWZpbmVkICkge1xuICAgIHJldHVybjtcbiAgfVxuICBsaXN0ZW5lcnNbdHlwZV0uZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgbGlzdGVuZXIuY2FsbChldmVudCk7XG4gIH0pO1xufTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciB0aHJlZSA9ICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93LlRIUkVFIDogdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbC5USFJFRSA6IG51bGwpO1xudmFyIHR3ZWVuID0gKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cuVFdFRU4gOiB0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsLlRXRUVOIDogbnVsbCk7XG5cbnZhciBQbGF5ZXIzRCA9IGZ1bmN0aW9uKCBvcHRpb25zICkge1xuXG4gIHRocmVlLk9iamVjdDNELmNhbGwodGhpcyk7XG5cbiAgdGhpcy50eXBlID0gJ1BsYXllcjNEJztcblxuICB0aGlzLl9zaXplID0gb3B0aW9ucy5fc2l6ZSB8fCAxO1xuICB2YXIgbWF0ZXJpYWwgPSBvcHRpb25zLm1hdGVyaWFsIHx8IG5ldyB0aHJlZS5NZXNoQmFzaWNNYXRlcmlhbCh7Y29sb3I6IDB4ZmZmZmZmICogTWF0aC5yYW5kb20oKX0pO1xuICB2YXIgZ2VvbWV0cnkgPSBuZXcgdGhyZWUuQm94R2VvbWV0cnkodGhpcy5fc2l6ZSx0aGlzLl9zaXplLHRoaXMuX3NpemUpO1xuICB0aGlzLl9jdWJlID0gbmV3IHRocmVlLk1lc2goZ2VvbWV0cnksbWF0ZXJpYWwpO1xuICB0aGlzLl9jdWJlLnBvc2l0aW9uLnkgPSB0aGlzLl9zaXplIC8gMjtcbiAgdGhpcy5fYXhpcyA9IG5ldyB0aHJlZS5PYmplY3QzRCgpO1xuICB0aGlzLl9heGlzLnBvc2l0aW9uLnkgPSAtIHRoaXMuX3NpemUgLyAyO1xuICB0aGlzLl9heGlzLmFkZCh0aGlzLl9jdWJlKTtcbiAgdGhpcy5hZGQodGhpcy5fYXhpcyk7XG4gIHRoaXMuX2FuaW1hdGlvbiA9IG51bGw7XG4gIHRoaXMuX21vdmluZyA9IGZhbHNlO1xufTtcblxuUGxheWVyM0QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggdGhyZWUuT2JqZWN0M0QucHJvdG90eXBlICk7XG5cblBsYXllcjNELnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24oZGlyLGR0KXtcbiAgaWYoIHRoaXMuX21vdmluZyApIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZGlyLnggPSBkaXIueCA9PT0gdW5kZWZpbmVkID8gMCA6IGRpci54O1xuICBkaXIueSA9IGRpci55ID09PSB1bmRlZmluZWQgPyAwIDogZGlyLnk7XG4gIHRoaXMuX2F4aXMucG9zaXRpb24ueCArPSBkaXIueCAqIHRoaXMuX3NpemUgLyAyO1xuICB0aGlzLl9jdWJlLnBvc2l0aW9uLnggLT0gZGlyLnggKiB0aGlzLl9zaXplIC8gMjtcbiAgdGhpcy5fYXhpcy5wb3NpdGlvbi56IC09IGRpci55ICogdGhpcy5fc2l6ZSAvIDI7XG4gIHRoaXMuX2N1YmUucG9zaXRpb24ueiArPSBkaXIueSAqIHRoaXMuX3NpemUgLyAyO1xuICB2YXIgcm90WCA9IC0gZGlyLnkgKiAwLjUgKiBNYXRoLlBJO1xuICB2YXIgcm90WiA9IC0gZGlyLnggKiAwLjUgKiBNYXRoLlBJO1xuICB2YXIgX3RoaXMgPSB0aGlzO1xuICB0aGlzLl9hbmltYXRpb24gPSBuZXcgdHdlZW4uVHdlZW4oIHsgeDogMCwgejogMCB9IClcbiAgICAudG8oe3g6IHJvdFgsIHo6IHJvdFp9LCBkdClcbiAgICAub25VcGRhdGUoZnVuY3Rpb24oKXtcbiAgICAgIF90aGlzLl9heGlzLnJvdGF0aW9uLnggPSB0aGlzLng7XG4gICAgICBfdGhpcy5fYXhpcy5yb3RhdGlvbi56ID0gdGhpcy56O1xuICAgIH0pXG4gICAgLmVhc2luZyh0d2Vlbi5FYXNpbmcuU2ludXNvaWRhbC5Jbk91dClcbiAgICAub25Db21wbGV0ZShmdW5jdGlvbigpe1xuICAgICAgX3RoaXMuX2F4aXMucm90YXRlWCgtcm90WCk7XG4gICAgICBfdGhpcy5fYXhpcy5yb3RhdGVaKC1yb3RaKTtcbiAgICAgIF90aGlzLl9heGlzLnBvc2l0aW9uLnggLT0gZGlyLnggKiBfdGhpcy5fc2l6ZSAvIDI7XG4gICAgICBfdGhpcy5fY3ViZS5wb3NpdGlvbi54ICs9IGRpci54ICogX3RoaXMuX3NpemUgLyAyO1xuICAgICAgX3RoaXMuX2F4aXMucG9zaXRpb24ueiArPSBkaXIueSAqIF90aGlzLl9zaXplIC8gMjtcbiAgICAgIF90aGlzLl9jdWJlLnBvc2l0aW9uLnogLT0gZGlyLnkgKiBfdGhpcy5fc2l6ZSAvIDI7XG5cbiAgICAgIF90aGlzLnBvc2l0aW9uLnggKz0gZGlyLnggKiBfdGhpcy5fc2l6ZTtcbiAgICAgIF90aGlzLnBvc2l0aW9uLnogLT0gZGlyLnkgKiBfdGhpcy5fc2l6ZTtcbiAgICAgIF90aGlzLl9tb3ZpbmcgPSBmYWxzZTtcbiAgICB9KVxuICAgIC5zdGFydCgpO1xuICB0aGlzLl9tb3ZpbmcgPSB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQbGF5ZXIzRDtcblxufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pIl19
