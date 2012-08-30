var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

While.prototype = new Node('While');
While.prototype.constructor = While;
function While(conditional, block, range, text) {
  this.conditional = conditional;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.conditional.evaluate(context);
    var falseObject = Runtime.getGlobalObject('false');
    while (context.getReturnObject() !== null && 
              context.getReturnObject() !== falseObject) {
      context = this.block.evaluate(context);
      context = this.conditional.evaluate(context);
    }
    return context;
  };
}

exports.While = While;
