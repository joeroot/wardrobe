var Runtime = require('./runtime').Runtime;


// # `nodes.js`
// `nodes.js` exports a series of node constructors for the parser to intialise.
// Each node contains an `evaluate` method which the interpreter calls when
// evaluating the node. The `context` parameter contains the current runtimes
// context, and can be ammended and references as needed. The `evaluate` method
// must return a `context`.

exports.nodes = {

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

  Comment: function(comment) {
    this.comment = comment;

    this.evaluate = function(context) {
      return context;
    };
  },

  Return: function(expression) {
    this.kind = 'Return';
    this.expression = expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      return context;
    };
  },

  Declare: function(type, identifier) {
    this.kind = 'Declare';
    this.type = type;
    this.identifier = identifier;

    this.evaluate = function(context) {
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
  },

  Assign: function(assignable, expression) {
    this.kind = 'Assign';
    this.assignable = assignable;
    this.expression = expression;

    this.evaluate = function(context) {
      var name;
      switch (this.assignable.kind) {
        case 'Declare':
          name = this.assignable.identifier.name;
          context = this.assignable.evaluate(context);
          context = this.expression.evaluate(context);
          context.setLocalObject(name, context.getReturnObject());
          break;
        case 'Identifier':
          name = this.assignable.name;
          context = this.expression.evaluate(context);
          context.setLocalObject(name, context.getReturnObject());
          break;
        case 'Property': 
          context = this.assignable.expression.evaluate(context); 
          var receiver = context.getReturnObject();
          var property = this.assignable.identifier.name;
          context = this.expression.evaluate(context);
          receiver.setProperty(property, context.getReturnObject()); 
          break;
        case 'ListAccessor': break;
        default: break;
      }

      return context;
    };
  },

  /**
   * @param {String} name identifier's name
   */
  Identifier: function(name) {
    this.kind = 'Identifier';
    this.name = name;

    this.evaluate = function(context) {
      var object = context.getLocalObject(this.name);
     
      context.setReturnObject(object);
     
      return context;
    };
  },

  /**
   * @param {Node} expression expression whose property is being retrieved
   * @param {Identifier} identifier property to be retrieved
   */
  Property: function(expression, identifier) {
    this.kind = 'Property';
    this.expression = expression;
    this.identifier = identifier;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context); 

      var receiver = context.getReturnObject();
      var property = this.identifier.name;

      var object = receiver.getPropertyObject(property);
      context.setReturnObject(object);

      return context;
    };
  },

  /**
   * @param {Expression} expression expression which should evaluate to a List object
   * @param {Expression} index_expression expression which should evaluate to a Number denoting the index
   */
  ListAccessor: function(expression, index_expression) {
    this.kind = 'ListAccessor';
    this.expression = expression;
    this.index_expression = index_expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      var list = context.getCurrentObject();

      context = this.index_expression.evaluate(context);
      var index = context.getCurrentObject();

      context = list.call(context, 'get', {unary: index});
    };
  },

  /**
   * @param {String} name constant's name
   */
  Constant: function(name) {
    this.kind = 'Constant';
    this.name = name;

    this.evaluate = function(context) {
      var cls = Runtime.getClass(this.name);
      context.setReturnObject(cls);
      return context;
    };
  },

  /**
   * @param {Number} value numeric value of number
   */
  Number: function(value) {
    this.kind = 'Number';
    this.value = value;

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getClass('Number').new_object(this.value));
      return context;
    };
  },

  /**
   * @param {String} value string value of string
   */
  String: function(value) {
    this.kind = 'String';

    this.value = value.slice(1, value.length - 1);

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getClass('String').new_object(this.value));
      return context;
    };
  },

  True: function() {
    this.kind = 'True';

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    };
  },

  False: function() {
    this.kind = 'False';

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getGlobalObject('false'));
      return context;
    };
  },

  /**
   * @param {[Expression]} items array of expressions to intialise the List with
   */
  List: function(items) {
    this.kind = 'List';
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

  This: function() {
    this.kind = 'This';

    this.evaluate = function(context) {
      var current = context.getCurrentObject();
      context.setReturnObject(current);
      return context;
    };
  },

  Class: function(constant, inherits, block) {
    this.kind = 'Class';
    this.constant= constant;
    this.inherits = inherits || {name: 'Object'}; //TODO: fix this to create a new constant
    this.block = block;

    this.evaluate = function(context) {
      var name = this.constant.name;
      var super_cls = Runtime.getClass(this.inherits.name);
      var cls = Runtime.createClass(name, super_cls);

      var prior_cls = context.getCurrentClass();
      context.setCurrentClass(cls);

      context = this.block.evaluate(context);

      context.setCurrentClass(prior_cls);

      return context;
    };
  },

  Function: function(type, identifier, params, block) {
    this.kind = 'Function';
    this.type = type || {name: 'Object'}; //TODO: fix this to create a new constant
    this.identifier = identifier;
    this.params = params;
    this.block = block;

    this.evaluate = function(context) {
      var name = this.identifier.name;

      if (context.getCurrentClass() !== null) {
        context.getCurrentClass().createMethod(name, this.params, this.block);
      } else {
        Runtime.createMethod(name, this.params, this.block);
      }
      
      return context; 
    };
  },

  Param: function(type, identifier) {
    this.type = type;
    this.identifier = identifier;

    this.evaluate = function(context) {
      return context;
    };
  },

  Call: function(identifier, receiver, args) {
    this.kind = 'Call';
    this.identifier = identifier;
    this.receiver = receiver;
    this.args = args;

    this.evaluate = function(context) {
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
        // evaluate the receiever, before calling the method on the returned object
        context = this.receiver.evaluate(context);
        var receiver_object = context.getReturnObject();
        context = receiver_object.call(context, method_name, args); 
      } else if (method_name == 'print'){
        context = Runtime.getGlobalObject('system').call(context, 'print', args);
      } else {
        context = Runtime.getMethod(method_name).call(context, null, args);
      }

      return context;
    };
  },

  Create: function(constant, args) {
    this.kind = 'Create';
    this.constant = constant;
    this.args = args;

    this.evaluate = function(context) {
      var args = {};
      for (var a = 0; a < this.args.length; a++) {
        var arg = this.args[a];
        context = arg.evaluate(context);
        var name = arg.identifier.name;
        var object = context.getReturnObject();
        args[name] = object;
      }

      var cls = Runtime.getClass(this.constant.name);
      var new_object = cls.new_object(args);

      context.setReturnObject(new_object);
      return context;
    };
  },

  Argument: function(identifier, argument) {
    this.kind = 'Argument';
    this.identifier = identifier;
    this.argument = argument;

    this.evaluate = function(context) {
      context = this.argument.evaluate(context);
      return context;
    };
  },

  // TODO: add lazy evaluation on operators, particularly booleans    
  Operator: function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;

    this.evaluate = function(context) {
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
  },

  If: function(conditional, true_branch, false_branch) {
    this.conditional = conditional;
    this.true_branch = true_branch;
    this.false_branch = false_branch;

    this.evaluate = function(context) {
      context = this.conditional.evaluate(context);
      if (context.getReturnObject !== null && context.getReturnObject() !== Runtime.getGlobalObject('false')) {
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
      while (context.getReturnObject() !== null && context.getReturnObject() !== Runtime.getGlobalObject('false')) {
        context = this.block.evaluate(context);
        context = this.conditional.evaluate(context);
      }
      return context;
    };
  }
};
