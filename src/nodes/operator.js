var Node = require('./node').Node;

// TODO: add lazy evaluation on operators, particularly booleans    
Operator.prototype = new Node('Operator');
Operator.prototype.constructor = Operator;
function Operator(operator, left, right, range, text) {
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var right = null;
    if (this.left !== null) {
      context = this.left.evaluate(context);
      var left = context.getReturnObject();
      context = this.right.evaluate(context);
      var args = {unary: context.getReturnObject()};

      switch(this.operator) {
        case 'and': context = left.call(context, 'and', args); break;
        case 'or': context = left.call(context, 'or', args); break;
        case '<': break;
        case '>': context = left.call(context, 'greaterThan', args); break;
        case '<=': break;
        case '>=': break;
        case '==': context = left.call(context, 'equals', args); break;
        case '+': context = left.call(context, 'add', args); break;
        case '-': context = left.call(context, 'subtract', args); break;
        case '/': context = left.call(context, 'divide', args); break;
        case '*': context = left.call(context, 'multiply', args); break;
        default: break;
      }
    } else {
      context = this.right.evaluate(context);
      right = context.getReturnObject();

      switch(this.operator) {
        case '+': context = right.call(context, 'positive', []); break;
        case '-': context = right.call(context, 'negative', []); break;
        default: break;
      }
    }

    return context;
  };
}

exports.Operator = Operator;
