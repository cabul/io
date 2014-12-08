var Timer = require('./timer');
var Terminal = require('./terminal');
var Progress = require('./progress');
var Stats = require('./stats');
var snow = require('./snow');

var timer = new Timer({msph:1500});
var terminal = new Terminal();

var score = {
  points: 0,
}

var progress = new Progress(score,'points');
progress.setSize(310,10).setLimit(1000).build();

var seconds = 0;

var boost = function(amnt){
  score.points += amnt;
  score.points = Math.min( Math.max( score.points + amnt, 0 ),1000 );
};

var stats = [
  'creativity',
  'sleep',
  'drink',
  'eat',
  'shower'
];

timer.onUpdate(function(time){
  var sec = Math.floor(time);
  if( sec !== seconds ){
    stats.forEach(function(stat){
      boost( Stats.get(stat).influence() );
    });
    snow.setSize( (1000 - score.points) / 100  );
    Progress.update();
  }
});

exports.addTo = function(stage){
  timer.position.x = 620;
  timer.position.y = 40;
  stage.addChild(timer);
  terminal.position.x = 150;
  terminal.position.y = 495;
  stage.addChild(terminal);
  progress.position.x = 230;
  progress.position.y = 56;
  stage.addChild(progress);
  var stat = new Stats('creativity',0xffcc55,-0.5);
  stat.position.x = 580;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('sleep',0xde87cd,3);
  stat.position.x = 620;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('drink',0x37c871,10);
  stat.position.x = 660;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('eat',0xd3575f,6);
  stat.position.x = 700;
  stat.position.y = 300;
  stage.addChild(stat);
  stat = new Stats('shower',0x5f8dd3,2);
  stat.position.x = 740;
  stat.position.y = 300;
  stage.addChild(stat);
};

var initStats = function(){
  Stats.get('sleep').value = 100;
  Stats.get('creativity').value = 10;
  Stats.get('eat').value = 80;
  Stats.get('drink').value = 70;
  Stats.get('shower').value = 70;
  Stats.enable = true;
};

exports.play = function(){
  score.points = 0;
  initStats();
  timer.reset().onComplete(function(){
    Stats.enable = false;
    terminal.println('Time is up! Your score: '+Math.round(score.points));
  }).start();
};

exports.boost = boost;

exports.fastForward = function(dt){
  // timer.time = Math.min(timer.time-dt,0);
  timer.fastForward(dt);
};

