var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Declare.prototype = new Node('Declare');
Declare.prototype.constructor = Declare;
function Declare (type, identifier, range, text) {
  this.type = type;
  this.identifier = identifier;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.identifier.name;
    var type = Runtime.getClass(this.type.name);

    var isObjectProperty = context.current_class !== null;

    var nothing = Runtime.getGlobalObject('nothing');
    // If we are within a class definition (i.e. current class is null), 
    // declare as an object property, otherwise declare as a local variable.
    if (isObjectProperty) {
      context.getCurrentClass().addProperty(name, type, nothing);
    } else {
      context.addLocal(name, type, nothing);
    }
    context.setReturnObject(nothing);

    return context;
  };
}

exports.Declare = Declare;
