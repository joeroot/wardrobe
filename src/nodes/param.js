var Node = require('./node').Node;

Param.prototype = new Node('Param');
Param.prototype.constructor = Param;
function Param(type, identifier, range, text) {
  this.type = type;
  this.identifier = identifier;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    return context;
  };
}

exports.Param = Param;
