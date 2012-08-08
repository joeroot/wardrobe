var WardrobeRuntimeError = function(kind) {
  this.kind = kind;
  this.is_wardrobe_error = true;
};

WardrobeRuntimeError.prototype.errorString = function() {return "An error has occured.";};
WardrobeRuntimeError.prototype.addToStack = function(node) {this.stack.push(node);};
WardrobeRuntimeError.prototype.getStack = function() {return this.stack;};
WardrobeRuntimeError.prototype.stackToString = function() {
  var str = "";
  for (var i = 1; i < this.stack.length; i++) {
    str += '\n' + this.stack[i].getStartLine() + ", " + this.stack[i].getStartColumn() + ': ' + this.stack[i].kind;
  }
  return str;
};


WardrobeRuntimeError.prototype.getStartColumn = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getStartColumn();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getEndColumn = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getEndColumn();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getStartLine = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getStartLine();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getEndLine = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getEndLine();
  } 
  return start;
};

exports.WardrobeRuntimeError = WardrobeRuntimeError;
