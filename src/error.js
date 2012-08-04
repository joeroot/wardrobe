var WardrobeError = function() {
  this.error = 'Undefined';
};

WardrobeError.prototype.is_wardrobe_error =  true;
WardrobeError.prototype.line_no = null; 

WardrobeError.prototype.hasLineNo = function() {return this.line_no !== null;};
WardrobeError.prototype.setLineNo = function(line_no) {this.line_no = line_no;};
WardrobeError.prototype.getLineNo = function() {return this.line_no;};
WardrobeError.prototype.errorString = function() {return "An error has occured.";};

WardrobeNoMethodError.prototype = new WardrobeError();
WardrobeNoMethodError.prototype.constructor = WardrobeNoMethodError;
function WardrobeNoMethodError(context, method) {
  this.error = 'NoMethod';
  this.context = context;
  this.receiver = context.getReturnObject();
  this.method = method;
}

WardrobeNoMethodError.prototype.errorString = function() {
  var str = this.line_no + ": ";
  str += "No method " + this.method + " for object's of class " + this.receiver.cls.name + ".";
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
  str += "No method " + this.method + " for object's of class " + this.receiver.cls.name + ".";
  return str;
};

exports.WardrobeError = WardrobeError;
exports.WardrobeNoMethodError = WardrobeNoMethodError;
