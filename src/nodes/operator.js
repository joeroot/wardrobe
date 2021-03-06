var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;
var errors = require('../errors');

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
      right = context.getReturnObject();
      var args = {unary: context.getReturnObject()};

      var is_string = left.instanceOf('String');
      var is_number = left.instanceOf('Number');
      var is_boolean = left.instanceOf('Boolean');

      if (['&'].indexOf(this.operator) >= 0 && !is_string) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('String'));
      } else if (['+', '-', '*', '/', '%'].indexOf(this.operator) >= 0 && !is_number) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('Number'));
      } else if (['and', 'or'].indexOf(this.operator) >= 0 && !is_boolean) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('Boolean'));
      }

      switch(this.operator) {
        case 'and': context = left.call(context, 'and', args); break;
        case 'or': context = left.call(context, 'or', args); break;
        case '<': context = left.call(context, 'lessThan', args); break;
        case '>': context = left.call(context, 'greaterThan', args); break;
        case '<=': 
          context = left.call(context, 'equal', args);
          if (!context.getReturnObject().getValue()) {
            context = left.call(context, 'lessThan', args);
          }
          break;
        case '>=':
          context = left.call(context, 'equal', args);
          if (!context.getReturnObject().getValue()) {
            context = left.call(context, 'greaterThan', args);
          }
          break;
        case '==': context = left.call(context, 'equal', args); break;
        case '!=': 
          context = left.call(context, 'equal', args);
          context = context.getReturnObject().call(context, 'negate', {});
          break;
        case '+': context = left.call(context, 'add', args); break;
        case '&': context = left.call(context, 'concat', args); break;
        case '-': context = left.call(context, 'subtract', args); break;
        case '/': context = left.call(context, 'divide', args); break;
        case '*': context = left.call(context, 'multiply', args); break;
        case '%': context = left.call(context, 'modulus', args); break;
        default: break;
      }
    } else {
      context = this.right.evaluate(context);
      right = context.getReturnObject();

      switch(this.operator) {
        case '+': context = right.call(context, 'positive', []); break;
        case '-': context = right.call(context, 'negative', []); break;
        case '!': context = right.call(context, 'negate', []); break;
        default: break;
      }
    }

    return context;
  };
}

exports.Operator = Operator;
