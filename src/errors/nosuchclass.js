var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchClass.prototype = new WardrobeRuntimeError('NoSuchClass');
WardrobeNoSuchClass.prototype.constructor = WardrobeNoSuchClass;
function WardrobeNoSuchClass(context, name) {
  this.stack = [];
  this.context = context;
  this.name = name;
}

WardrobeNoSuchClass.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No such class " + this.name + ".";
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchClass = WardrobeNoSuchClass;
