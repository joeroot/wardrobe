var Node = require('./node').Node;

ListRange.prototype = new Node('ListRange');
ListRange.prototype.constructor = ListRange;
function ListRange(start, end, range, text) {
  this.start = start;
  this.end = end;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    return context;
  };
}

exports.ListRange = ListRange;
