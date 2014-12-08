var game = require('./game');
var topics = require('./topics');
var Stats = require('./stats');

module.exports = function(text){

  text = text.toLowerCase();
  var args = text.split(' ');

  var com = commands[args[0]||''];
  if(!com){
    return 'Try help/list';
  }

  var inp = args[1] || '';
  var opt = com.options;
  if( !opt ) {
    return com.action(inp);
  } else {
    if( opt.indexOf(inp) === - 1 ) {
      return 'Option doesn\'t exist';
    } else {
      return com.action(inp);
    }
  }

};

var selectRandom = function(arr){
  return arr[ Math.floor(arr.length*Math.random()) ];
};

var commands = {

  help: {
    info: [ 'I am HELP', 'rtfm', 'Helpcetion' ],
    action: function(arg){
      if( arg === '' ) {
        return 'Type two words';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var info = com.info || ['Contact Admin'];
      return selectRandom(com.info);
    }
  },
  list: {
    info: ['Show options'],
    action: function(arg){
      if( arg === '' ) {
        return 'Use your imagination ;)';
      }
      var com = commands[arg];
      if( !com ) {
        return 'Command doesn\'t exist';
      }
      var options = com.options || ['EVERYTHING'];
      return arg+' '+options.join(',');
    }
  },
  'goto': {
    info: [ 'Go somewhere', 'Don\'t just sit there' ],
    options: ['shop','bed','bathroom'],
    action: function(arg){
      if( arg === 'shop' ) {
        return 'On weekends the shop is closed';
      }
      if( arg === 'bed' ) {
        Stats.get('sleep').value = 80 + 20 * Math.random();
        game.fastForward( 5 + Math.random()*2 );
        return 'You awake well rested';
      }
      if( arg == 'bathroom' ) {
        Stats.get('shower').addValue( 10 + Math.random() *10 );
        return 'Flush!!';
      }
      return 'Not implemented';
    }
  },

  eat: {
    info: [ 'Eat something', 'Are you hungry?', 'Mmmmhm!!' ],
    options: ['sandwich','cake','pizza'],
    action: function(arg){
      Stats.get('eat').addValue( 30 * Math.random()*30 );
      game.fastForward(0.2);
      return 'Yummy ... '+arg;
    }
  },
  'new' : {
    info: [ 'Start a new game'],
    options: ['game'],
    action: function(arg){
      game.play();
      return 'Topic: '+topics[Math.floor(topics.length*Math.random())];
    }
  },
  drink : {
    info: ['Drink something','Don\'t dehydrate','Gulp!'],
    options: ['coffee','coke','water','beer'],
    action: function(arg){
      Stats.get('drink').addValue( 30 * Math.random()*30 );
      if( arg === 'coffee' || arg == 'coke' ) {
        Stats.get('sleep').addValue( Math.random()*20 );
      }
      game.fastForward(0.1);
      return 'Schlurp!';
    }
  },
  write : {
    info: ['Write something','Lorem Ipsum Dolor Sit Amet'],
    options: ['code','todo'],
    action: function(arg){
      Stats.get('creativity').addValue(20*Math.random());
      game.fastForward( 6 * Math.random());
      if( arg === 'code' && Math.random() > 0.7 ) {
        game.boost(100);
        return 'Good work!';
      } else {
        if( Math.random() > 0.6 ) {
          game.boost(-40);
          return 'Ups, a bug!';
        }
      }
      return 'Don\'t panic!';
    }
  },
  speak : {
    info: ['Speak with somebody','Bla bla bla'],
    options: ['gf','mum','mentor'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  get : {
    info: ['Getter/Setter'],
    options: ['gf','supplies','framework'],
    action: function(arg){
      return 'Not implemented';
    }
  },
  improve : {
    info: ['Nobody is perfect'],
    options: ['graphics','gameplay'],
    action: function(arg){
      game.boost( 50 + 80 * Math.random() );
      game.fastForward(2);
      return 'Getting there!';
    }
  },
  take : {
    info: ['Take me on...','...take on me'],
    options: ['shower','break'],
    action: function(arg){
      Stats.get('creativity').addValue(20);
      if( arg === 'shower' ) {
        Stats.get('shower').value = 80 + Math.random()*20;
        game.fastForward(0.5);
        return 'clean body = clean mind';
      } else {
        Stats.get('sleep').addValue(30);
        return 'Breaking bad ;)';
      }
    }
  }
};
