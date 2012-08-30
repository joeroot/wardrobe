var Node = require('./node').Node;

Program.prototype = new Node('Program');
Program.prototype.constructor = Program;
/*
 * 
 */
function Program(lines, range, text) {
  this.lines = lines;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    try {
      for (var l = 0; l < lines.length; l++) {
        var line = this.lines[l];
        context = line.evaluate(context);  
      }
    } catch(err) {
      if (err.kind !== undefined && err.kind == 'Return') {
        context = err.context;
      } else {
        throw err;
      }
    }

    return context;
  };
}

exports.Program = Program;
