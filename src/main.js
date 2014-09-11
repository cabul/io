var scene,camera,renderer,mesh,controls;

init();
animate();

function init() {
  scene = new THREE.Scene();
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;
          
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(WIDTH,HEIGHT);
  document.body.appendChild(renderer.domElement);
  
  camera = new THREE.PerspectiveCamera(45,WIDTH/HEIGHT,0.1,20000);
  camera.position.set(20,14,12);
  scene.add(camera);
  
  window.addEventListener('resize', function(){
    var WIDTH = window.innerWidth,
        HEIGHT = window.innerHeight;
    renderer.setSize(WIDTH,HEIGHT);
    camera.aspect = WIDTH/HEIGHT;
    camera.updateProjectionMatrix();
  });
  
  renderer.setClearColor(0x333F47, 1);
  var light = new THREE.PointLight(0xffffff);
  light.position.set(100,200,100);
  scene.add(light);
  var ambient = new THREE.AmbientLight(0x707070);
  scene.add(ambient);
  
  var loader = new THREE.JSONLoader();
  loader.load("res/mouse.js",function(geometry,materials) {
    console.log(arguments);
    var material = new THREE.MeshFaceMaterial(materials);
    for(var i = 0, len=materials.length;i<len;++i) {
      materials[i].shading = THREE.FlatShading;
    }
    mesh = new THREE.Mesh(geometry,material);
    scene.add(mesh);
  });
  
  controls = new THREE.OrbitControls(camera,renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene,camera);
  controls.update();
}