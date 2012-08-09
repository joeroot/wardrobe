var Node = function(kind) {
  this.kind = kind;
  this.ignore = [];
};

Node.prototype.evaluate = function(context) {
  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && this.ignore.indexOf(this.kind) == -1) {
      error.addToStack(this);
    }
    throw error;
  }
  return context;
};

Node.prototype.getStartColumn = function() {return this.range.first_column;};
Node.prototype.getEndColumn = function() {return this.range.last_column;};
Node.prototype.getStartLine = function() {return this.range.first_line;};
Node.prototype.getEndLine = function() {return this.range.last_line;};

exports.Node = Node;
