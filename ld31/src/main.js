var Detector = require('detector');
var THREE = require('three');
var THREEx = require('threex');
var Stats = require('stats');
var TWEEN = require('tween');
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

keycombo.addEventListener('f5',function(){
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
