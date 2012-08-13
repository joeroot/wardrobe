var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

For.prototype = new Node('For');
For.prototype.constructor = For;
function For(assignable, iterable, block, range, text) {
  this.assignable = assignable;
  this.iterable = iterable;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name;
    if (this.assignable.kind == 'Declare') {
      context = this.assignable.evaluate(context);
      name = this.assignable.identifier.name;
    } else {
      // If assignable is an identifier (thus already declared)
      name = this.assignable.name; 
    }

    context = this.iterable.evaluate(context);
    var list = context.getReturnObject().getValue();

    for (var i = 0; i < list.length; i++) {
      var current = list[i];
      context.setLocalObject(name, current);
      context = this.block.evaluate(context);
    }

    if (this.assignable.kind == 'Declare') {
      context.deleteLocal(name);
    }

    return context;
  };
}

exports.For = For;
