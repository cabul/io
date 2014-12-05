var three = require('three');

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
