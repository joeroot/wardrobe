var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchParameterError.prototype = new WardrobeRuntimeError('NoSuchParameter');
WardrobeNoSuchParameterError.prototype.constructor = WardrobeNoSuchParameterError;
function WardrobeNoSuchParameterError(context, receiver, incorrect_params) {
  this.context = context;
  this.receiver = receiver;
  this.incorrect_params = incorrect_params;
}

WardrobeNoSuchParameterError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No such parameter(s) ";
  for (var p = 0; p < this.incorrect_params.length; p++) {
    var param = this.incorrect_params[p];
    str += param;
    if (p < this.incorrect_params.length - 1) {str += ", ";}
  }
  str += " when calling " + this.stack[0].identifier.name;
  if (this.receiver !== null) {
    str += " on an object of class " + this.receiver.cls.name + ".";
  } else {
    str += ".";
  }
   
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchParameterError = WardrobeNoSuchParameterError;
