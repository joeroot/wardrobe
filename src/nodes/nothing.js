var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Nothing.prototype = new Node('Nothing');
Nothing.prototype.constructor = Nothing;
function Nothing(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getGlobalObject('nothing'));
    return context;
  };
}

exports.Nothing = Nothing;
