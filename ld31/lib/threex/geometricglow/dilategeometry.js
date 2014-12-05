/**
* @namespace
*/
var THREEx	= THREEx || {};

/**
* dilate a geometry inplace
* @param  {THREE.Geometry} geometry geometry to dilate
* @param  {Number} length   percent to dilate, use negative value to erode
*/
THREEx.dilateGeometry	= function(geometry, length){
  // gather vertexNormals from geometry.faces
  var vertexNormals	= new Array(geometry.vertices.length);
  geometry.vertices.forEach(function(vertex, idx){
    vertexNormals[idx] = new THREE.Vector3();
  });
  geometry.faces.forEach(function(face){
    if( face instanceof THREE.Face4 ){
      vertexNormals[face.a].add(face.vertexNormals[0]);
      vertexNormals[face.b].add(face.vertexNormals[1]);
      vertexNormals[face.c].add(face.vertexNormals[2]);
      vertexNormals[face.d].add(face.vertexNormals[3]);
    }else if( face instanceof THREE.Face3 ){
      vertexNormals[face.a].add(face.vertexNormals[0]);
      vertexNormals[face.b].add(face.vertexNormals[1]);
      vertexNormals[face.c].add(face.vertexNormals[2]);
    }else	console.assert(false);
  });
  // modify the vertices according to vertextNormal
  geometry.vertices.forEach(function(vertex, idx){
    var vertexNormal = vertexNormals[idx].normalize();
    vertex.x	+= vertexNormal.x * length;
    vertex.y	+= vertexNormal.y * length;
    vertex.z	+= vertexNormal.z * length;
  });
};
