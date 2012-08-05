var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Create.prototype = new Node('Create');
Create.prototype.constructor = Create;
function Create(constant, args, range, text) {
  this.constant = constant;
  this.args = args;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var args = {};
    for (var a = 0; a < this.args.length; a++) {
      var arg = this.args[a];
      context = arg.evaluate(context);
      var name = arg.identifier.name;
      var object = context.getReturnObject();
      args[name] = object;
    }

    var cls = Runtime.getClass(this.constant.name);
    var newObject = cls.newObject(args);

    context.setReturnObject(newObject);
    return context;
  };
}

exports.Create = Create;
