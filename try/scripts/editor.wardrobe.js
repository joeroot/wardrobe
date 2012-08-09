var EditSession = require("ace/edit_session").EditSession;
var RubyMode = require("ace/mode/ruby").Mode;
var Range = require("ace/range").Range;
var editor;
var sessions = {};
var errors = {};
var current_file = null;

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

  $('#warning').click(function() {
    if (current_file && errors[current_file] !== undefined && errors[current_file].length > 0) {
      var err = errors[current_file][0];
      var line = err.getStartLine();
      editor.gotoLine(line);
      var range = new Range(line-1, err.getStartColumn(), line-1, err.getEndColumn());
      console.log(editor.getSelection());
      sessions[current_file].getSelection().setSelectionRange(range); 
      editor.focus();
    }
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
          clearAnnotationsAndMarkers(session);
          try {
            Wardrobe.parse(session.getValue());
            $('#warning').removeClass('live');
            errors[file] = [];
          } catch(err) {
            if (err.is_wardrobe_error) {
              $('#warning').addClass('live');
              errors[file] = [err];
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
        errors[file] = [];
      }
    });
  }
  editor.setSession(session);
  current_file = file;
}

function clearAnnotationsAndMarkers(session) {
  session.setAnnotations([]);
  var markers = session.getMarkers();
  for (var marker in markers) {
    session.removeMarker(marker);
  }
}

function run() {
  try {
    var session = editor.getSession();

    clearAnnotationsAndMarkers(session);
    errors[current_file] = [];
    $('#warning').removeClass('live');

    var context = Wardrobe.run(editor.getValue());
    var value = context.getReturnObject().toString();
    
    $('#console pre em.flash').before('\<em class="result"\>\<\/em\>\n');
    $('#console  em.result:last').text('=> ' + value);
    $('#console').scrollTop($('#console').children().height());
  } catch(err) {
    if (err.is_wardrobe_error) {
      errors[current_file] = [err];
      $('#warning').addClass('live');
      switch(err.kind) {
        case 'Syntax': handleSyntaxError(err); break;
        case 'NoSuchMethod': handleRuntimeError(err); break;
        case 'NoSuchParameter': handleRuntimeError(err); break;
        case 'MissingArguments': handleRuntimeError(err); break;
        case 'UndeclaredPropertyOrVariable': handleRuntimeError(err); break;
        default: console.log(err); break;
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

function handleRuntimeError(err) {
  editor.getSession().setAnnotations([{
    row: err.getStartLine() - 1,
    column: err.getStartColumn(),
    text: err.toString(),
    type: "error" // also warning and information
  }]);

  var line = err.getStartLine() - 1;
  console.log(err);
  editor.getSession().addMarker(new Range(line, err.getStartColumn(), line, err.getEndColumn()), "warning", "text"); 
}

function print(value) {
  value = value.toString().toString();
  $('#console pre em.flash').before("\<em class='print'\>\<\/em\>\n");
  $('#console  em.print:last').text(value);
  $('#console').scrollTop($('#console').children().height());
}

