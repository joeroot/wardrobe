var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeTypeError.prototype = new WardrobeRuntimeError('NoSuchParameter');
WardrobeTypeError.prototype.constructor = WardrobeTypeError;
function WardrobeTypeError(context, objectType, variableType) {
  this.stack = [];
  this.context = context;
  this.objectType = objectType;
  this.variableType = variableType;
}

WardrobeTypeError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "Type error, " + this.objectType.name + " is not of type " + this.variableType.name + ".";
  str += this.stackToString();
  return str;
};

exports.WardrobeTypeError = WardrobeTypeError;
