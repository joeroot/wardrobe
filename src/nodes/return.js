var Node = require('./node').Node;

Return.prototype = new Node('Return');
Return.prototype.constructor = Return;
function Return(expression, range, text) {
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context);
    throw {kind: 'Return', context: context};
  };
}

exports.Return = Return;
