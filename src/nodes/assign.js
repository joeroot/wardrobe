var Node = require('./node').Node;
var errors = require('../errors');

Assign.prototype = new Node('Assign');
Assign.prototype.constructor = Assign;
function Assign(assignable, expression, range, text) {
  this.assignable = assignable;
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name, err;
    switch (this.assignable.kind) {
      case 'Declare':
        name = this.assignable.identifier.name;
        context = this.assignable.evaluate(context);
        context = this.expression.evaluate(context);
        var object = context.getReturnObject();
        if (context.current_class === null) { 
          context.setLocalObject(name, object);
        } else {
          context.getCurrentClass().setPropertyObject(name, object);
        }
        break;

      case 'Identifier':
        name = this.assignable.name;

        if (context.getLocal(name) === undefined) {
          error= new errors.WardrobeUndeclaredPropertyOrVariable(context, null);
          error.addToStack(this.assignable);
          throw error;
        }

        context = this.expression.evaluate(context);
        context.setLocalObject(name, context.getReturnObject());
        break;

      case 'Property': 
        context = this.assignable.expression.evaluate(context); 
        var receiver = context.getReturnObject();
        var property = this.assignable.identifier.name;

        if (receiver.getProperty(property) === undefined) {
          error = new errors.WardrobeUndeclaredPropertyOrVariable(context, receiver);
          error.addToStack(this.assignable);
          throw error;
        }

        context = this.expression.evaluate(context);
        receiver.setProperty(property, context.getReturnObject()); 
        break;
        
      case 'ListAccessor': break;
      default: break;
    }

    return context;
  };
}

exports.Assign = Assign;
