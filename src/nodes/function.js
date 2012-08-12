var Node = require('./node').Node;
var Constant = require('./constant').Constant;
var Runtime = require('../runtime').Runtime;

Function.prototype = new Node('Function');
Function.prototype.constructor = Function;
function Function(type, identifier, params, block, range, text) {
  this.type = type || new Constant('Object');
  this.identifier = identifier;
  this.params = params;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.identifier.name;

    var func = Runtime.getClass('Function').newObject(this.params, this.block);
    context.addLocal(this.identifier.name, Runtime.getClass('Function'), func); 
    context.setReturnObject(func);

    return context; 
  };
}

exports.Function = Function;
