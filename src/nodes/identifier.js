var Node = require('./node').Node;

Identifier.prototype = new Node('Identifier');
Identifier.prototype.constructor = Identifier;
/**
 * @param {String} name identifier's name
 */
function Identifier(name, range, text) {
  this.name = name;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    if (context.getLocal(this.name) === undefined) {
      throw new error.WardrobeUndeclaredPropertyOrVariable(context, null);
    }

    var object = context.getLocalObject(this.name);
    context.setReturnObject(object);
    return context;
  };
}

exports.Identifier = Identifier;
