var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeMissingArgumentsError.prototype = new WardrobeRuntimeError('MissingArguments');
WardrobeMissingArgumentsError.prototype.constructor = WardrobeMissingArgumentsError;
function WardrobeMissingArgumentsError(context, receiver, missing_params) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
  this.missing_params = missing_params;
}

WardrobeMissingArgumentsError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "Missing argument(s) for the parameter(s) ";
  for (var p = 0; p < this.missing_params.length; p++) {
    var param = this.missing_params[p];
    str += param.identifier.name;
    if (p < this.missing_params.length - 1) {str += ", ";}
  }
  str += " when calling " + this.stack[0].expression.name;
  if (this.receiver !== null) {
    str += " on an object of class " + this.receiver.cls.name + ".";
  } else {
    str += ".";
  }
   
  str += this.stackToString();
  return str;
};

exports.WardrobeMissingArgumentsError = WardrobeMissingArgumentsError;
