var EditSession = require("ace/edit_session").EditSession;
var RubyMode = require("ace/mode/ruby").Mode;
var Range = require("ace/range").Range;
var editor;
var sessions = {};

(function($) {
  $.fn.blinky = function() {
    var that = this;
    function go() {
      $(that).toggle();
      setTimeout(go, 800); 
    }
    go();
  };
})(jQuery);

$(document).ready(function(){
  $('select#files').dropkick({
    change: function() {openFile($(this).val());}
  });

  $('.flash').blinky();

  $('#run').click(function(){
    run();
    return false;
  });

  editor = ace.edit("editor");
  editor.setTheme("ace/theme/tomorrow");
  editor.setShowPrintMargin(false);

  openFile($('select#files').val());

  editor.commands.addCommand({
    name: 'runCode',
    bindKey: {
      win: 'Shift-Return',
      mac: 'Shift-Return',
      sender: 'editor|cli'
    },
    exec: function(env, args, request) {
      run();
    }
  });

  editor.focus();
});

function openFile(file) {
  var session = sessions[file];
  if (session === undefined) {
    $.ajax({
      async: false,
      type: 'GET',
      url: '../' + file,
      success: function(data) {
        session = new EditSession(data);
        session.setMode(new RubyMode());
        session.setTabSize(2);
        session.on('change', function(){
          editor.getSession().setAnnotations([]);
          var markers = session.getMarkers();
          for (var marker in markers) {
            session.removeMarker(marker);
          }

          try {
            Wardrobe.parse(session.getValue());
          } catch(err) {
            if (err.is_wardrobe_error) {
              switch(err.kind) {
                case 'Syntax': handleSyntaxError(err); break;
                default: 
                  break;
              }
            } else {
              throw err;
            }
          }
        });
        sessions[file] = session;
      }
    });
  }
  editor.setSession(session);
}

function run() {
  try {
    var session = editor.getSession();
    session.clearAnnotations();

    var context = Wardrobe.run(editor.getValue());
    var value = context.getReturnObject().toString();
    
    $('#console pre em.flash').before('\<em class="result"\>\<\/em\>\n');
    $('#console  em.result:last').text('=> ' + value);
    $('#console').scrollTop($('#console').children().height());
  } catch(err) {
    if (err.is_wardrobe_error) {
      switch(err.kind) {
        case 'Syntax': handleSyntaxError(err); break;
        default: 
          break;
      }
    } else {
      throw err;
    }
  }
}

function handleSyntaxError(err) {
  editor.getSession().setAnnotations([{
    row: err.getStartLine() - 1,
    column: err.getStartColumn(),
    text: err.toString(),
    type: "error" // also warning and information
  }]);

  var line = err.getStartLine() - 1;
  editor.getSession().addMarker(new Range(line, err.getStartColumn(), line, err.getEndColumn()), "warning", "text"); 
}

function print(value) {
  value = value.toString().toString();
  $('#console pre em.flash').before("\<em class='print'\>\<\/em\>\n");
  $('#console  em.print:last').text(value);
  $('#console').scrollTop($('#console').children().height());
}

