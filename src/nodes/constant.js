var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Constant.prototype = new Node('Constant');
Constant.prototype.constructor = Constant;
/**
 * @param {String} name constant's name
 */
function Constant(name, range, text) {
  this.name = name;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var cls = Runtime.getClass(this.name);
    context.setReturnObject(cls);
    return context;
  };
}

exports.Constant = Constant;
