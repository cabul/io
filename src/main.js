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
  camera.position.set(5,10,20);
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
  light.position.set(-100,200,100);
  scene.add(light);
  
  var loader = new THREE.JSONLoader();
  loader.load("res/humanoid.js",function(geometry) {
    var material = new THREE.MeshLambertMaterial({color: 0x55B663});
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