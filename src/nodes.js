var Runtime = require('./runtime').Runtime;


// # `nodes.js`
// `nodes.js` exports a series of node constructors for the parser to intialise.
// Each node contains an `evaluate` method which the interpreter calls when
// evaluating the node. The `context` parameter contains the current runtimes
// context, and can be ammended and references as needed. The `evaluate` method
// must return a `context`.

exports.nodes = {

  // The `Block` node evaluates blocks of codes as defined in Wardobe's
  // specification. The constructor takes an array of lines, whilst the
  // evaluate method then evaluates each line within the specified context,
  // before returning the final context.
  Block: function(lines) {
    this.lines = lines;

    this.evaluate = function(context) {
      for (var l = 0; l < lines.length; l++) {
        var line = this.lines[l];
        context = line.evaluate(context);  
      }
      return context;
    };
  },

  // The `Comment` node does nothing. Can be used as a hook if needed in the
  // future.
  Comment: function(comment) {
    this.comment = comment;

    this.evaluate = function(context) {
      return context;
    };
  },

  // The `Return` node evaluates return statements. The expression to be
  // returned is evaluated within the supplied context. Though not explicitly
  // defined here, Wardrobe always places the value of the last evaluated
  // expression in the context value field, thus no explicit context
  // manipulation is required.
  Return: function(expression) {
    this.type = 'Return';
    this.expression = expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      return context;
    };
  },

  // The 'Assign` node evaluates assigments, accepting an `Identifier` and 
  // `Expression` node in its constructor. The `evaluate` method first evaluates
  // the context, before assigning it in the context's identifier store. Its
  // exact storage location is based upon the identifiier's scope.
  Assign: function(identifier, expression) {
    this.type = 'Assign';
    this.identifier = identifier;
    this.expression = expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      if (this.identifier.scope == 'local') {
        context.setLocalObject(this.identifier.name, context.getReturnObject());
      } else {
        context.getCurrentObject().setProperty(this.identifier.name, context.getReturnObject());
      }
      return context;
    };
  },

  // If
  If: function(conditional, true_branch, false_branch) {
    this.conditional = conditional;
    this.true_branch = true_branch;
    this.false_branch = false_branch;

    this.evaluate = function(context) {
      context = this.conditional.evaluate(context);
      if (context.getReturnObject !== null && context.getReturnObject() !== Runtime.getGlobal('false').value) {
        context = this.true_branch.evaluate(context);
      } else if (false_branch !== null) {
        context = this.false_branch.evaluate(context);
      }
      return context;
    };
  },

  While: function(conditional, block) {
    this.conditional = conditional;
    this.block = block;

    this.evaluate = function(context) {
      context = this.conditional.evaluate(context);
      while (context.getReturnObject() !== null && context.getReturnObject() !== Runtime.getGlobal('false').value) {
        context = this.block.evaluate(context);
        context = this.conditional.evaluate(context);
      }
      return context;
    };
  },

  Function: function(identifier, params, block) {
    this.type = 'Function';
    this.identifier = identifier;
    this.params = params;
    this.block = block;

    this.evaluate = function(context) {
      if (context.current_class !== null) {
        context.current_class.createMethod(this.identifier.name, this.params, this.block);
      }
      return context; 
    };
  },

  // TODO: Call: decide how to handle local/global variables
  // TODO: Call: add argument length error checking
  Call: function(identifier, receiver, args) {
    this.type = 'Call';
    this.identifier = identifier;
    this.method = this.identifier.name;
    this.receiver = receiver;
    this.args = args;

    this.evaluate = function(context) {
      var args = [];
      for (var a = 0; a < this.args.length; a++) {
        var arg = this.args[a];
        context = arg.evaluate(context);
        args[a] = context.getReturnObject();
      }

      if (this.receiver !== null) {
        context = this.receiver.evaluate(context);
        var receiver_object = context.getReturnObject();
        context = receiver_object.call(context, this.method, args); 
      } else {
        Runtime.getGlobal('system').value.call(context, 'print', args);
      }

      return context;
    };
  },

  // TODO: add lazy evaluation on operators, particularly booleans    
  Operator: function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;

    this.evaluate = function(context) {
      context = this.left.evaluate(context);
      var left = context.getReturnObject();
      context = this.right.evaluate(context);
      var right = context.getReturnObject();

      switch(this.operator) {
        case 'and': context = left.call(context, 'and', [right]); break;
        case 'or': context = left.call(context, 'or', [right]); break;
        case '<': break;
        case '>': break;
        case '<=': break;
        case '>=': break;
        case '==': context = left.call(context, 'equals', [right]); break;
        case '+': context = left.call(context, 'add', [right]); break;
        case '-': context = left.call(context, 'subtract', [right]); break;
        case '/': context = left.call(context, 'divide', [right]); break;
        case '*': context = left.call(context, 'multiply', [right]); break;
        default: break;
      }

      return context;
    };
  },

  Identifier: function(name, scope) {
    this.name = name;
    this.scope = scope;

    this.evaluate = function(context) {
      if (this.scope == 'local') {
        context.setReturnObject(context.getLocalObject(this.name));
      } else {
        context.setReturnObject(context.getCurrentObject().getPropertyObject(this.name));
      }
      return context;
    };
  },

  Number: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getClass('Number').new_object(this.value));
      return context;
    };
  },

  String: function(value) {
    this.value = value.slice(1, value.length - 1);

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getClass('String').new_object(this.value));
      return context;
    };
  },
  
  True: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getGlobal('true').value);
      return context;
    };
  },

  False: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getGlobal('false').value);
      return context;
    };
  },

  List: function(items) {
    this.items = items;

    this.evaluate = function(context) {
      var list = [];
      
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        context = item.evaluate(context);
        list.push(context.getReturnObject());
      }

      context.setReturnObject(Runtime.getClass('List').new_object(list));

      return context;
    };
  },

  Const: function(name) {
    this.name = name;

    this.evaluate = function(context) {
      return context;
    };
  },

  Class: function(constant, block) {
    this.type = 'Class';
    this.name = constant.name;
    this.block = block;

    this.evaluate = function(context) {
      var cls = Runtime.createClass(this.name, {}, {});
      prior_class = context.current_class;
      context.current_class = cls;
      context = this.block.evaluate(context);
      context.setCurrentClass(prior_class);
      return context;
    };
  },

  Declare: function(cls, identifier, expression) {
    this.type = 'Declare';
    this.cls = cls; 
    this.identifier = identifier;
    this.expression = expression;

    this.evaluate = function(context) {
      if (this.expression === null) {
        context.setReturnObject(null);
      } else {
        context = this.expression.evaluate(context);
      }
      
      cls = Runtime.getClass(this.cls);

      if (context.current_class !== null) {
        context.getCurrentClass().addProperty(this.identifier.name, cls, context.getReturnObject());
      } else {
        context.addLocal(this.identifier.name, cls, context.getReturnObject());
      }
      
      return context;
    };
  },

  Create: function(cls, arguments) {
    this.cls = cls;
    this.arguments = arguments;

    this.evaluate = function(context) {
      var object = Runtime.getClass(this.cls).new_object(this.arguments);
      context.setReturnObject(object);
      return context;
    };
  }
};
