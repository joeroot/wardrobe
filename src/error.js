var WardrobeError = function() {
  this.error = 'Undefined';
};
WardrobeError.prototype.is_wardrobe_error =  true;
WardrobeError.prototype.stack = [];
WardrobeError.prototype.errorString = function() {return "An error has occured.";};
WardrobeError.prototype.addToStack = function(node) {this.stack.push(node);};
WardrobeError.prototype.getStack = function() {return this.stack;};

WardrobeNoMethodError.prototype = new WardrobeError();
WardrobeNoMethodError.prototype.constructor = WardrobeNoMethodError;
function WardrobeNoMethodError(context, method) {
  this.error = 'NoMethod';
  this.context = context;
  this.receiver = context.getReturnObject();
  this.method = method;
}

WardrobeNoMethodError.prototype.errorString = function() {
  var str = this.stack[0].line_no + ": ";
  str += "No method " + this.method + " for objects of class " + this.receiver.cls.name + ".";
  for (var i = 1; i < this.stack.length; i++) {
    str += '\n' + this.stack[i].line_no + ' ' + this.stack[i].kind;
  }
  return str;
};

WardrobeMissingArgumentError.prototype = new WardrobeError();
WardrobeMissingArgumentError.prototype.constructor = WardrobeMissingArgumentError;
function WardrobeMissingArgumentError(context, method, missing) {
  this.error = 'MissingArgument';
  this.context = context;
  this.receiver = context.getReturnObject();
  this.method = method;
}

WardrobeMissingArgumentError.prototype.errorString = function() {
  var str = this.line_no + ": ";
  str += "No method " + this.method + " for objects of class " + this.receiver.cls.name + ".";
  return str;
};

exports.WardrobeError = WardrobeError;
exports.WardrobeNoMethodError = WardrobeNoMethodError;
