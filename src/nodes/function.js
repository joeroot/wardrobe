var Node = require('./node').Node;
var Constant = require('./constant').Constant;
var Runtime = require('../runtime').Runtime;

Function.prototype = new Node('Function');
Function.prototype.constructor = Function;
function Function(type, params, block, range, text) {
  this.type = type;
  this.params = params;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var func = Runtime.getClass('Function').newObject(this.params, this.block, context);
    context.setReturnObject(func);

    return context; 
  };
}

exports.Function = Function;
