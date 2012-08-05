var Runtime = require('./runtime').Runtime;
var error = require('./error');

// # `nodes.js`
// `nodes.js` exports a series of node constructors for the parser to intialise.
// Each node contains an `evaluate` method which the interpreter calls when
// evaluating the node. The `context` parameter contains the current runtimes
// context, and can be ammended and references as needed. The `evaluate` method
// must return a `context`.

var Node = function(kind) {
  this.kind = kind;
  this.range = {
    first_line: 0,
    first_column: 0,
    last_line: 0,
    last_column: 0
  };
};

Node.prototype.evaluate = function(context) {
  var ignore = [];
  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && ignore.indexOf(this.kind) == -1) {
      error.addToStack(this);
    }
    throw error;
  }
  return context;
};

Node.prototype.getStartColumn = function() {return this.range.first_column;};
Node.prototype.getEndColumn = function() {return this.range.last_column;};
Node.prototype.getStartLine = function() {return this.range.first_line;};
Node.prototype.getEndLine = function() {return this.range.last_line;};

Block.prototype = new Node('Block');
Block.prototype.constructor = Block;
function Block(lines, range, text) {
  this.lines = lines;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    for (var l = 0; l < lines.length; l++) {
      var line = this.lines[l];
      context = line.evaluate(context);  
    }
    return context;
  };
}

Comment.prototype = new Node('Comment');
Comment.prototype.constructor = Comment;
function Comment(comment, range, text) {
  this.comment = comment;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    return context;
  };
}

Return.prototype = new Node('Return');
Return.prototype.constructor = Return;
function Return(expression, range, text) {
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context);
    return context;
  };
}

Declare.prototype = new Node('Declare');
Declare.prototype.constructor = Declare;
function Declare (type, identifier, range, text) {
  this.type = type;
  this.identifier = identifier;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.identifier.name;
    var type = Runtime.getClass(this.type.name);

    var isObjectProperty = context.current_class !== null;

    // If we are within a class definition (i.e. current class is null), 
    // declare as an object property, otherwise declare as a local variable.
    if (isObjectProperty) {
      context.getCurrentClass().addProperty(name, type, null);
    } else {
      context.addLocal(name, type, null);
    }

    return context;
  };
}

Assign.prototype = new Node('Assign');
Assign.prototype.constructor = Assign;
function Assign(assignable, expression, range, text) {
  this.assignable = assignable;
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name, err;
    switch (this.assignable.kind) {
      case 'Declare':
        name = this.assignable.identifier.name;
        context = this.assignable.evaluate(context);
        context = this.expression.evaluate(context);
        var object = context.getReturnObject();
        if (context.current_class === null) { 
          context.setLocalObject(name, object);
        } else {
          context.getCurrentClass().setPropertyObject(name, object);
        }
        break;
      case 'Identifier':
        name = this.assignable.name;

        if (context.getLocal(name) === undefined) {
          err = new error.WardrobeUndeclaredPropertyOrVariable(context, null);
          err.addToStack(this.assignable);
          throw err;
        }

        context = this.expression.evaluate(context);
        context.setLocalObject(name, context.getReturnObject());
        break;
      case 'Property': 
        context = this.assignable.expression.evaluate(context); 
        var receiver = context.getReturnObject();
        var property = this.assignable.identifier.name;

        if (receiver.getProperty(property) === undefined) {
          err = new error.WardrobeUndeclaredPropertyOrVariable(context, receiver);
          err.addToStack(this.assignable);
          throw err;
        }

        context = this.expression.evaluate(context);
        receiver.setProperty(property, context.getReturnObject()); 
        break;
      case 'ListAccessor': break;
      default: break;
    }

    return context;
  };
}

Identifier.prototype = new Node('Identifier');
Identifier.prototype.constructor = Identifier;
/**
 * @param {String} name identifier's name
 */
function Identifier(name, range, text) {
  this.name = name;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    if (context.getLocal(this.name) === undefined) {
      throw new error.WardrobeUndeclaredPropertyOrVariable(context, null);
    }

    var object = context.getLocalObject(this.name);
    context.setReturnObject(object);
    return context;
  };
}

Property.prototype = new Node('Property');
Property.prototype.constructor = Property;
/**
 * @param {Node} expression expression whose property is being retrieved
 * @param {Identifier} identifier property to be retrieved
 */
function Property(expression, identifier, range, text) {
  this.expression = expression;
  this.identifier = identifier;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context); 

    var receiver = context.getReturnObject();
    var property = this.identifier.name;

    if (receiver.getProperty(property) === undefined) {
      throw new error.WardrobeUndeclaredPropertyOrVariable(context, receiver);
    }

    var object = receiver.getPropertyObject(property);
    context.setReturnObject(object);

    return context;
  };
}

ListAccessor.prototype = new Node('ListAccessor');
ListAccessor.prototype.constructor = ListAccessor;
/**
 * @param {Expression} expression expression which should evaluate to a List object
 * @param {Expression} index_expression expression which should evaluate to a Number denoting the index
 */
function ListAccessor(expression, index_expression, range, text) {
  this.expression = expression;
  this.index_expression = index_expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context);
    var list = context.getCurrentObject();

    context = this.index_expression.evaluate(context);
    var index = context.getCurrentObject();

    context = list.call(context, 'get', {unary: index});
  };
}

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

Number.prototype = new Node('Number');
Number.prototype.constructor = Number;
/**
 * @param {Number} value numeric value of number
 */
function Number(value, range, text) {
  this.value = parseFloat(value);
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getClass('Number').newObject(this.value));
    return context;
  };
}

String.prototype = new Node('String');
String.prototype.constructor = String;
/**
 * @param {String} value string value of string
 */
function String(value, range, text) {
  this.value = value.slice(1, value.length - 1);
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getClass('String').newObject(this.value));
    return context;
  };
}

True.prototype = new Node('True');
True.prototype.constructor = True;
function True(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getGlobalObject('true'));
    return context;
  };
}

False.prototype = new Node('False');
False.prototype.constructor = False;
function False(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getGlobalObject('false'));
    return context;
  };
}

List.prototype = new Node('List');
List.prototype.constructor = List;
/**
 * @param {[Expression]} items array of expressions to intialise the List with
 */
function List(items, range, text) {
  this.items = items;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var list = [];

    for (var i = 0; i < this.items.length; i++) {
      var item = this.items[i];
      context = item.evaluate(context);
      list.push(context.getReturnObject());
    }

    context.setReturnObject(Runtime.getClass('List').newObject(list));

    return context;
  };
}

This.prototype = new Node('This');
This.prototype.constructor = This;
function This(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var current = context.getCurrentObject();
    context.setReturnObject(current);
    return context;
  };
}

Class.prototype = new Node('Class');
Class.prototype.constructor = Class;
function Class(constant, inherits, block, range, text) {
  this.constant= constant;
  this.inherits = inherits || new Constant('Object'); 
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.constant.name;
    var super_cls = Runtime.getClass(this.inherits.name);
    var cls = Runtime.createClass(name, super_cls);

    var prior_cls = context.getCurrentClass();
    context.setCurrentClass(cls);

    context = this.block.evaluate(context);

    context.setCurrentClass(prior_cls);

    return context;
  };
}

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

    if (context.getCurrentClass() !== null) {
      context.getCurrentClass().createMethod(name, this.params, this.block);
    } else {
      Runtime.createMethod(name, this.params, this.block);
    }

    return context; 
  };
}

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

Argument.prototype = new Node('Argument');
Argument.prototype.constructor = Argument;
function Argument(identifier, argument, range, text) {
  this.identifier = identifier;
  this.argument = argument;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.argument.evaluate(context);
    return context;
  };
}

// TODO: add lazy evaluation on operators, particularly booleans    
Operator.prototype = new Node('Operator');
Operator.prototype.constructor = Operator;
function Operator(operator, left, right, range, text) {
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var right = null;
    if (this.left !== null) {
      context = this.left.evaluate(context);
      var left = context.getReturnObject();
      context = this.right.evaluate(context);
      var args = {unary: context.getReturnObject()};

      switch(this.operator) {
        case 'and': context = left.call(context, 'and', args); break;
        case 'or': context = left.call(context, 'or', args); break;
        case '<': break;
        case '>': context = left.call(context, 'greaterThan', args); break;
        case '<=': break;
        case '>=': break;
        case '==': context = left.call(context, 'equals', args); break;
        case '+': context = left.call(context, 'add', args); break;
        case '-': context = left.call(context, 'subtract', args); break;
        case '/': context = left.call(context, 'divide', args); break;
        case '*': context = left.call(context, 'multiply', args); break;
        default: break;
      }
    } else {
      context = this.right.evaluate(context);
      right = context.getReturnObject();

      switch(this.operator) {
        case '+': context = right.call(context, 'positive', []); break;
        case '-': context = right.call(context, 'negative', []); break;
        default: break;
      }
    }

    return context;
  };
}

If.prototype = new Node('If');
If.prototype.constructor = If;
function If(conditional, true_branch, false_branch, range, text) {
  this.conditional = conditional;
  this.true_branch = true_branch;
  this.false_branch = false_branch;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.conditional.evaluate(context);
    if (context.getReturnObject !== null && context.getReturnObject() !== Runtime.getGlobalObject('false')) {
      context = this.true_branch.evaluate(context);
    } else if (false_branch !== null) {
      context = this.false_branch.evaluate(context);
    }
    return context;
  };
}

While.prototype = new Node('While');
While.prototype.constructor = While;
function While(conditional, block, range, text) {
  this.conditional = conditional;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.conditional.evaluate(context);
    while (context.getReturnObject() !== null && context.getReturnObject() !== Runtime.getGlobalObject('false')) {
      context = this.block.evaluate(context);
      context = this.conditional.evaluate(context);
    }
    return context;
  };
}

exports.nodes = {
  Block: Block,
  Comment: Comment,
  Return: Return,
  Declare: Declare,
  Assign: Assign,
  Identifier: Identifier,
  Property: Property,
  ListAccessor: ListAccessor,
  Constant: Constant,
  Number: Number,
  String: String,
  True: True,
  False: False,
  List: List,
  This: This,
  Class: Class,
  Function: Function,
  Param: Param,
  Call: Call,
  Create: Create,
  Argument: Argument,
  Operator: Operator,
  If: If,
  While: While
};

