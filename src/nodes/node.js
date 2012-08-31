var Runtime = require('../runtime').Runtime;

var Node = function(kind) {
  this.kind = kind;
  this.ignore_in_trace = ['Program'];
};

Node.prototype.evaluate = function(context) {
  var nodeHooks = require('../interpreter').hooks[this.kind] || {};
  var beforeHook = nodeHooks.before || null;
  var afterHook = nodeHooks.after || null;

  if (beforeHook && typeof(beforeHook) == 'function') {beforeHook(context, Runtime, this);}

  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && this.ignore_in_trace.indexOf(this.kind) == -1) {
      error.addToStack(this);
    }
    throw error;
  }

  if (afterHook && typeof(afterHook) == 'function') {afterHook(context, Runtime, this);}

  return context;
};

Node.prototype.getStartColumn = function() {return this.range.first_column;};
Node.prototype.getEndColumn = function() {return this.range.last_column;};
Node.prototype.getStartLine = function() {return this.range.first_line;};
Node.prototype.getEndLine = function() {return this.range.last_line;};

exports.Node = Node;
