var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Declare.prototype = new Node('Declare');
Declare.prototype.constructor = Declare;
function Declare (type, identifier, expression, range, text) {
  this.type = type;
  this.identifier = identifier;
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.identifier.name;
    var type = Runtime.getClass(this.type.name);

    var isObjectProperty = context.current_class !== null;

    var assign = Runtime.getGlobalObject('nothing');
    if (this.expression !== null) {
      context = this.expression.evaluate(context);
      assign = context.getReturnObject();
    }

    // If we are within a class definition (i.e. current class is null), 
    // declare as an object property, otherwise declare as a local variable.
    if (isObjectProperty) {
      context.getCurrentClass().addInstanceProperty(name, type, assign);
    } else {
      context.addLocal(name, type, assign);
    }
    
    context.setReturnObject(assign);

    return context;
  };
}

exports.Declare = Declare;
