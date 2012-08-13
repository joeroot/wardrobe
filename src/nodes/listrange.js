var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

ListRange.prototype = new Node('ListRange');
ListRange.prototype.constructor = ListRange;
function ListRange(start, end, range, text) {
  this.start = start;
  this.end = end;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.start.evaluate(context);
    var start = context.getReturnObject();
    
    context = this.end.evaluate(context);
    var end = context.getReturnObject();

    var start_is_num = start.getClass() == Runtime.getClass('Number');
    var end_is_num = end.getClass() == Runtime.getClass('Number');
    if (!start_is_num || !end_is_num) {
      throw "Not a number";
    }

    start = start.getValue();
    end = end.getValue();

    var list = [];
    for (var i = start; i <= end; i++) {
      list.push(Runtime.getClass('Number').newObject(i));
    }

    context.setReturnObject(Runtime.getClass('List').newObject(list));

    return context;
  };
}

exports.ListRange = ListRange;
