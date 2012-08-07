// # `nodes.js`
// `nodes.js` exports a series of node constructors for the parser to intialise.
// Each node contains an `evaluate` method which the interpreter calls when
// evaluating the node. The `context` parameter contains the current runtimes
// context, and can be ammended and references as needed. The `evaluate` method
// must return a `context`.

var Runtime = require('./runtime').Runtime;

exports.nodes = {
  Node: require('./nodes/node').Node,
  Argument: require('./nodes/argument').Argument,
  Assign: require('./nodes/assign').Assign,
  Block: require('./nodes/block').Block,
  Call: require('./nodes/call').Call,
  Class: require('./nodes/class').Class,
  Comment: require('./nodes/comment').Comment,
  Constant: require('./nodes/constant').Constant,
  Create: require('./nodes/create').Create,
  Declare: require('./nodes/declare').Declare,
  False: require('./nodes/false').False,
  Function: require('./nodes/function').Function,
  Identifier: require('./nodes/identifier').Identifier,
  If: require('./nodes/if').If,
  List: require('./nodes/list').List,
  ListAccessor: require('./nodes/listaccessor').ListAccessor,
  Number: require('./nodes/number').Number,
  Operator: require('./nodes/operator').Operator,
  Param: require('./nodes/param').Param,
  Property: require('./nodes/property').Property,
  Return: require('./nodes/return').Return,
  String: require('./nodes/string').String,
  This: require('./nodes/this').This,
  True: require('./nodes/true').True,
  While: require('./nodes/while').While
};

