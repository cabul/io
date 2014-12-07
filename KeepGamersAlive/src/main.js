var pixi = require('pixi');
var Fonts = require('./fonts');
var renderer = pixi.autoDetectRenderer( 800,600 );
document.body.appendChild(renderer.view);

var game = require('./game');

var assets = game.assets || [];

var loader = new pixi.AssetLoader(assets);

var tile = 400 / assets.length;

var loadingBar = new pixi.Graphics();
var loaded = 0;
loadingBar.lineStyle(10,0xffffff);

loadingBar.drawRect(-5,-5,410,50);

loadingBar.lineStyle(0);

loadingBar.position.x = 200;
loadingBar.position.y = 280;

var loadingScreen = new pixi.Stage(0x000000);
var loading = true;

loadingScreen.addChild(loadingBar);

loader.onProgress = function(){
  loadingBar.beginFill( 0xffffff * Math.random() );
  loadingBar.drawRect(tile*loaded,0,tile,40);
  loadingBar.endFill();
  loaded += 1;
};

loader.onComplete = function(){
  loading = false;
};

var text;

Fonts.load(['VT323'],function(){
  text = new pixi.Text('Loading..',{font: '40px VT323',fill:'white'});
  text.position.x = 190;
  text.position.y = 230;
  window.text = text;
  loadingScreen.addChild(text);
  loader.load();
});

requestAnimFrame( function load(){
  if( loading ) {
    requestAnimFrame(load);
    renderer.render(loadingScreen);
  } else {
    var init_time = 0;
    var running = true;
    var context = {
      renderer: renderer,
      quit: function(){
        running = false;
      }
    };

    game.oninit(context);

    requestAnimFrame( function render(tick){

      if(running){
        requestAnimFrame(render);
        tick = tick || init_time;
        var dt = tick - init_time;
        init_time = tick;

        game.onframe(tick,dt);
      }

    });
  }
});
