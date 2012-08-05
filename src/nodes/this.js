var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

This.prototype = new Node('This');
This.prototype.constructor = This;
function This(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var current = context.getCurrentObject();
    context.setReturnObject(current);
    return context;
  };
}

exports.This = This;
