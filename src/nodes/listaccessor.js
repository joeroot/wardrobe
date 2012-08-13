var Node = require('./node').Node;

ListAccessor.prototype = new Node('ListAccessor');
ListAccessor.prototype.constructor = ListAccessor;
/**
 * @param {Expression} expression expression which should evaluate to a List object
 * @param {Expression} index_expression expression which should evaluate to a Number denoting the index
 */
function ListAccessor(expression, index_expression, range, text) {
  this.expression = expression;
  this.index_expression = index_expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context);
    var list = context.getReturnObject();

    context = this.index_expression.evaluate(context);
    var index = context.getReturnObject();

    context = list.call(context, 'get', {unary: index});

    return context;
  };
}

exports.ListAccessor = ListAccessor;
