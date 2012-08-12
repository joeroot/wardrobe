var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;
var errors = require('../errors');

Call.prototype = new Node('Call');
Call.prototype.constructor = Call;
function Call(identifier, receiver, args, range, text) {
  this.identifier = identifier;
  this.receiver = receiver;
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

    var method_name = this.identifier.name;
    var is_method = this.receiver !== null;
    var is_system_method = ['print'].indexOf(method_name) >= 0;

    if (is_method) {
      context = this.receiver.evaluate(context);
      var receiver_object = context.getReturnObject();
      context = receiver_object.call(context, method_name, args); 
    } else if (is_system_method){
      context = Runtime.getGlobalObject('system').call(context, 'print', args);
    } else {
      context = this.identifier.evaluate(context);
      var func = context.getReturnObject();
      if (func.getClass() != Runtime.getClass('Function')) {
        throw "Not a function.";
      }
      context = func.call(context, args);
    }

    return context;
  };
}

exports.Call = Call;
