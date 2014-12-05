var createDialog = function() {

  var dialog = document.createElement('div');
  dialog.title = 'Help';
  var sections = document.createElement('div');
  [

    {
      title: 'General',
      content: [
        'This game was created for Ludum Dare 31',
        'Have fun and don\'t forget to be awesome!',
        '<a href="mailto:calvin.bulla@gmail.com?Subject=Ludum%20Dare%2031" target="_top">Send me an email</a>'
      ]
    },
    {
      title: 'Objective',
      content: [
        'There is no objective, just play'
      ]
    },
    {
      title: 'Controls',
      content: [
        'Use <i>H</i> to toggle this help menu',
        'Use <i>C</i> to change the view angle'
      ]
    }

  ].forEach( function(section){

    var header = document.createElement('h3');
    header.innerHTML = section.title;
    var div = document.createElement('div');
    section.content.forEach(function(line){
      var p = document.createElement('p');
      p.innerHTML = line;
      div.appendChild(p);
    });
    sections.appendChild( header );
    sections.appendChild( div );

  });

  dialog.appendChild(sections);

  $(function(){
    // $(sections).accordion();
    $(dialog).dialog({width: 600, modal: true, draggable: false, height: 400});
  });

  return dialog;

};

var dialog = null;

module.exports = function() {

  if( dialog ) {
    $(dialog).dialog('destroy');
    dialog = null;
  } else {
    dialog = createDialog();
  }

};

// if( !Detector.webgl ) {
//   Detector.addGetWebGLMessage();
//
//   var img = document.createElement('img');
//   img.src = 'img/error'+ Math.floor( Math.random()*4 ) +'.jpg';
//   img.id = 'error';
//   img.onclick = function() {
//     window.open('http://www.google.com/chrome/');
//     window.open('http://www.mozilla.org/en-US/firefox/new/');
//   };
//   document.body.appendChild(img);
//
//   return;
// }
