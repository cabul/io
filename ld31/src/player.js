var three = require('three');
var tween = require('tween');

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
