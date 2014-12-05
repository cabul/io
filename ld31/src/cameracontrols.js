var keycombo = require('./keycombo');
var TWEEN = require('tween');
var three = require('three');

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
