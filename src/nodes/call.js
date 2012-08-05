var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;
var error = require('../error');

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

    if (this.receiver !== null) {
      // evaluate the receiver, before calling the method on the returned object
      context = this.receiver.evaluate(context);
      var receiver_object = context.getReturnObject();
      context = receiver_object.call(context, method_name, args); 
    } else if (method_name == 'print'){
      context = Runtime.getGlobalObject('system').call(context, 'print', args);
    } else {
      if (Runtime.getMethod(method_name) === undefined) {
        throw new error.WardrobeNoSuchMethodError(context, null);
      }
      context = Runtime.getMethod(method_name).call(context, null, args);
    }

    return context;
  };
}

exports.Call = Call;
