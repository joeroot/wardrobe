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
    var name;
    switch (this.assignable.kind) {
      case 'Identifier':
        name = this.assignable.name;

        if (context.getLocal(name) === undefined) {
          var identErr = new errors.WardrobeUndeclaredPropertyOrVariable(context, null);
          identErr.addToStack(this.assignable);
          throw identErr;
        }

        context = this.expression.evaluate(context);
        context.setLocalObject(name, context.getReturnObject());
        break;

      case 'Property': 
        context = this.assignable.expression.evaluate(context); 
        var receiver = context.getReturnObject();
        var property = this.assignable.identifier.name;

        if (receiver.getProperty(property) === undefined) {
          var propErr = new errors.WardrobeUndeclaredPropertyOrVariable(context, receiver);
          propErr.addToStack(this.assignable);
          throw propErr;
        }

        context = this.expression.evaluate(context);
        receiver.setProperty(property, context.getReturnObject()); 
        break;
        
      case 'ListAccessor': 
        context = this.assignable.expression.evaluate(context);
        var list = context.getReturnObject();

        context = this.assignable.index_expression.evaluate(context);
        var index = context.getReturnObject();

        context = this.expression.evaluate(context);
        var set_to = context.getReturnObject();

        context = list.call(context, 'set', {index: index, to: set_to});
        break;

      default: break;
    }

    return context;
  };
}

exports.Assign = Assign;
