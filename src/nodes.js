// # `nodes.js`
// `nodes.js` exports a series of node constructors for the parser to intialise.
// Each node contains an `evaluate` method which the interpreter calls when
// evaluating the node. The `context` parameter contains the current runtimes
// context, and can be ammended and references as needed. The `evaluate` method
// must return a `context`.

var Runtime = require('./runtime').Runtime;
var error = require('./error');

var Node = require('./nodes/node').Node;
var Argument = require('./nodes/argument').Argument;
var Assign = require('./nodes/assign').Assign;
var Block = require('./nodes/block').Block;
var Call = require('./nodes/call').Call;
var Class = require('./nodes/class').Class;
var Comment = require('./nodes/comment').Comment;
var Constant = require('./nodes/constant').Constant;
var Create = require('./nodes/create').Create;
var Declare = require('./nodes/declare').Declare;
var False = require('./nodes/false').False;
var Function = require('./nodes/function').Function;
var Identifier = require('./nodes/identifier').Identifier;
var If = require('./nodes/if').If;
var List = require('./nodes/list').List;
var ListAccessor = require('./nodes/listaccessor').ListAccessor;
var Number = require('./nodes/number').Number;
var Operator = require('./nodes/operator').Operator;
var Param = require('./nodes/param').Param;
var Property = require('./nodes/property').Property;
var Return = require('./nodes/return').Return;
var String = require('./nodes/string').String;
var This = require('./nodes/this').This;
var True = require('./nodes/true').True;
var While = require('./nodes/while').While;

exports.nodes = {
  Argument: Argument,
  Assign: Assign,
  Block: Block,
  Call: Call,
  Class: Class,
  Comment: Comment,
  Constant: Constant,
  Create: Create,
  Declare: Declare,
  False: False,
  Function: Function,
  Identifier: Identifier,
  If: If,
  List: List,
  ListAccessor: ListAccessor,
  Number: Number,
  Operator: Operator,
  Param: Param,
  Property: Property,
  Return: Return,
  String: String,
  This: This,
  True: True,
  While: While
};

