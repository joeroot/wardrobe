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
    this.expression = expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      return context;
    };
  },

  Assign: function(identifier, expression) {
    this.identifier = identifier;
    this.expression = expression;

    this.evaluate = function(context) {
      context = this.expression.evaluate(context);
      switch (this.identifier.scope) {
        case 'this':
          context.classes[context.current_class].locals[this.identifier.name] = context.value;
        break;
        default: 
          context.locals[this.identifier.name] = context.value;
        break;
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
      if (context.value !== null && context.value !== false) {
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
      while (context.value !== null && context.value !== false) {
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
      var func = {};
      func.name = this.identifier.name;
      func.type = 'WardrobeFunction';
      func.params = this.params;
      func.block = this.block;

      if (context.current_class !== null) {
        context.classes[context.current_class].locals[func.name] = func;
      } else {
        context.locals[func.name] = func;
      }

      return context; 
    };
  },

  // TODO: Call: decide how to handle local/global variables
  // TODO: Call: add argument length error checking
  Call: function(identifier, target, args) {
    this.identifier = identifier;
    this.target = target;
    this.args = args;

    this.evaluate = function(context) {
      var args = [];
      var func = context.locals[this.identifier.name];

      for (var a = 0; a < this.args.length; a++) {
        var arg = this.args[a];
        context = arg.evaluate(context);
        args[a] = context.value;
      }

      if (this.identifier.name == "print" && this.target === null) {
        if (typeof(wardrobe_in_browser) !== 'undefined') {
          logToConsole(args);
        } else {
          console.log(args);
        }
      } else if (func !== null) {
        for (var p = 0; p < func.params.length; p++) {
          context.locals[func.params[p].name] = args[p]; 
        }
        context = func.block.evaluate(context);
      }

      return context;
    };
  },

  Operator: function(operator, left, right) {
    this.operator = operator;
    this.left = left;
    this.right = right;

    this.evaluate = function(context) {
      context = this.left.evaluate(context);
      var left = context.value;
      context = this.right.evaluate(context);
      var right = context.value;

      switch(this.operator) {
        case '<': context.value = (left < right); break;
        case '>': context.value = (left > right); break;
        case '<=': context.value = (left <= right); break;
        case '>=': context.value = (left >= right); break;
        case '==': context.value = (left == right); break;
        case '+': context.value = (left + right); break;
        case '-': context.value = (left - right); break;
        case '/': context.value = (left / right); break;
        case '*': context.value = (left * right); break;
        default: break;
      }

      return context;
    };
  },

  Identifier: function(name, scope) {
    this.name = name;
    this.scope = scope;

    this.evaluate = function(context) {
      switch (this.scope) {
        case 'this':
          context.value = context.classes[context.current_class].locals[this.name];
        break;
        default:
          context.value = context.locals[this.name];
        break;
      }
      return context;
    };
  },

  Number: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.value = this.value;
      return context;
    };
  },

  String: function(value) {
    this.value = value.slice(1, value.length - 1);

    this.evaluate = function(context) {
      context.value = this.value;
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
      var cls = {};
      cls.name = this.name;
      cls.type = 'WardrobeClass';
      cls.block = this.block;
      cls.locals = {};

      var prior_class = context.current_class;
      context.classes[cls.name] = cls;

      context.current_class = cls.name;
      context = block.evaluate(context);
      context.current_class = prior_class;


      return context;
    };
  }

};


//function evaluateClass(node, context) {
//  var name = node[1][1];
//  var definition= node[2];
//
//  var cls = evaluate(definition, emptyContext());
//  context.classes[name] = {};
//  context.classes[name]['fn'] = cls['fn'];
//  context.classes[name]['locals'] = cls['local'];
//
//  return context;
