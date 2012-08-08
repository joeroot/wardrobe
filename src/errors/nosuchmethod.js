var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchMethodError.prototype = new WardrobeRuntimeError('NoSuchMethod');
WardrobeNoSuchMethodError.prototype.constructor = WardrobeNoSuchMethodError;
function WardrobeNoSuchMethodError(context, receiver) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
}

WardrobeNoSuchMethodError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No method " + this.stack[0].identifier.name + " ";
  if (this.receiver !== null) {
    str += "for objects of class " + this.receiver.cls.name + ".";
  } else {
    str += "has been defined globally.";
  }
  for (var i = 1; i < this.stack.length; i++) {
    str += '\n' + this.stack[i].getStartLine() + ': ' + this.stack[i].kind;
  }
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchMethodError = WardrobeNoSuchMethodError;
