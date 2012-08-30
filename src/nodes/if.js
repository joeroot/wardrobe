var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

If.prototype = new Node('If');
If.prototype.constructor = If;
function If(conditional, true_branch, false_branch, range, text) {
  this.conditional = conditional;
  this.true_branch = true_branch;
  this.false_branch = false_branch;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.conditional.evaluate(context);
    if (context.getReturnObject() !== Runtime.getGlobalObject('false')) {
      context = this.true_branch.evaluate(context);
    } else if (false_branch !== null) {
      context = this.false_branch.evaluate(context);
    }
    return context;
  };
}

exports.If = If;
