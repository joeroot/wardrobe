var wardrobe_in_browser = true;

function logToConsole(x) {
  print(x);
}
(function(root) {
  var Wardrobe = function() {
    function require(path){ return require[path]; }require['./lexer'] = new function() {
  var exports = this;
  var keywords = ['this', 'new', 'class', 'def', 'if', 'then', 'else', 'while', 'do', 'end', 'return', 'true', 'false'];
var assign = ['='];
var operator = ['+', '-'];
var comparators = ['==', '>', '<', '>=', '<='];
var logic = ['&&', 'and', '||', 'or'];
var math = ['/', '*'];


function scan(source) {
  var tokens = [];
  var line = 1;
  var i = 0;

  //source = source.replace(/(\n|\r)+/g, '\n');

  while (i < source.length) {
    var chunk = source.slice(i, source.length);
    var value = null;
    
    if (chunk[0] == '.') {
      value = chunk[0];
      tokens.push(['DOT', value, line]);
      i = i + 1;
    }
    // Comments
    else if ((value = chunk.match(/#[^(\n|\r)]*/)) && value.index=== 0) {
      value = value[0]; 
      tokens.push(["COMMENT", value, line]);
      i = i + value.length;
    }
    // Keywords and identifiers
    else if ((value = chunk.match(/[a-z]\w*/)) && value.index === 0) {
      value = value[0];
      if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line]);}
      else if (keywords.indexOf(value) >= 0) {tokens.push([value.toUpperCase(), value, line]);}
      else {tokens.push(["IDENT", value, line]);}
      i = i + value.length;
    }
    // Constants
    else if ((value = chunk.match(/[A-Z]\w*/)) && value.index === 0) {
      value = value[0];
      tokens.push(["CONST", value, line]);
      i = i + value.length;
    }
    // Grammatical symbols
    else if ((value = chunk.match(/\(|\)|\,/)) && value.index === 0) {
      value = value[0];
      if (value == '(') {tokens.push(['LPAREN', value, line]);}
      else if (value == ')') {tokens.push(['RPAREN', value, line]);}
      else if (value == ',') {tokens.push(['COMMA', value, line]);}
      i = i + value.length;
    }
    // Operators
    else if ((value = chunk.match(/\=|>\=|<\=|>|<|\=\=|&&|\|\||\+|\-|\/|\*/)) && value.index === 0) {
      value = value[0];
      if (assign.indexOf(value) >= 0) {tokens.push(['ASSIGN', value, line]);}
      if (operator.indexOf(value) >= 0) {tokens.push([value, value, line]);}
      else if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line]);}
      else if (math.indexOf(value) >= 0) {tokens.push(['MATH', value, line]);}
      else if (comparators.indexOf(value) >= 0) {tokens.push(['COMP', value, line]);}
      i = i + value.length;
    }
    // Numbers
    else if ((value = chunk.match(/[0-9]+(\.[0-9]+)?/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NUMBER", Number(value), line]);
      i = i + value.length;
    }
    // Strings
    else if ((value = chunk.match(/"(.*?)"/)) && value.index === 0) {
      value = value[0];
      tokens.push(["STRING", value, line]);
      i = i + value.length;
    }
    // Newlines
    else if ((value = chunk.match(/(\n|\r)+/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NEWLINE", value, line]);
      line = line + value.length;
      i = i + value.length;
    }
    else {
      //console.error("Unmatched: " + escape(value[0]));
      i = i + 1;
    }
  }
  return tokens;
}

function lex(source) {
  return scan(source);
}

exports.lex = lex;
}
require['./runtime'] = new function() {
  var exports = this;
  WardrobeObject = function(cls, value) {
  this.cls = cls;
  this.value = value;
  if (value === null) {this.value = this;}
  if (Runtime !== undefined) {
    this.properties = this.cls.properties;
  } else {
    this.properties = {};
  }
};

WardrobeObject.prototype.getClass = function() {
  return this.cls;
};

WardrobeObject.prototype.call = function(context, method, arguments) {
  context = this.cls.methods[method].call(context, this, arguments);
  return context;
};

WardrobeObject.prototype.setProperty = function(property, value) {
  this.properties[property].value =  value;
  return this.properties[property];
};

WardrobeObject.prototype.getProperty = function(property) {
  return this.properties[property];
};

WardrobeObject.prototype.toString = function() {
  var str= '<' + this.cls.name + ':' + this.value + '>';
  return str;
};

WardrobeClass.prototype = new WardrobeObject(); 
WardrobeClass.prototype.constructor = WardrobeClass;
function WardrobeClass(name, methods, properties) {
  if (Runtime !== undefined) {
    this.cls = Runtime.getClass('Class');  
  } else {
    this.cls = null;
  }
  this.value = this;

  this.name = name;
  this.methods = methods;
  this.properties = {};
}

WardrobeClass.prototype.addMethod = function(method) {
  this.methods[method.name] = method;
  return method;
};

WardrobeClass.prototype.createMethod = function(name, params, body) {
  var method = new WardrobeMethod(name, params, body);
  this.addMethod(method);
  return method;
};

WardrobeClass.prototype.addProperty = function(cls, name, value) {
  this.properties[name] = {cls: cls, name: name, value: value};
};

WardrobeClass.prototype.new_object = function(arguments) {
  var obj = new WardrobeObject(this, null);
  //obj.call(init, arguments);
  return obj;
};

WardrobeMethod.prototype = new WardrobeObject();
WardrobeMethod.prototype.constructor = WardrobeMethod;
function WardrobeMethod(name, params, body) {
  this.cls = Runtime.getClass('Method');
  this.name = name;
  this.params = params;
  this.body = body;
}

WardrobeMethod.prototype.call = function(context, receiver, arguments) { 
  var old_context = context;
  var param, p;

  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    var argument = arguments[p];
    context.locals[param] = {cls: argument.cls, name: param, value: argument};
  }
  
  context.current_object = receiver;
  context = this.body.evaluate(context); 
  
  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    if (old_context.locals[param] !== undefined) {
      context.locals[param] = old_context.locals[param];
    } else {
      delete context.locals[param];
    }
  }
  context.current_object = old_context.current_object;
  return context;
};

WardrobeString.prototype = new WardrobeClass();
WardrobeString.prototype.constructor = WardrobeString;
function WardrobeString() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'String';
  this.methods = {
    length: new WardrobeMethod(
      'length', 
      [], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = Runtime.getClass('Number').new_object(receiver.value.length);
        return context;
      }}
    ),
    concat: new WardrobeMethod(
      'concat',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('String').new_object(receiver.value + right.value);
        return context;
      }}
    )
  };
}

WardrobeString.prototype.new_object = function(string) {
  return new WardrobeObject(this, string);
};

WardrobeNumber.prototype = new WardrobeClass();
WardrobeNumber.prototype.constructor = WardrobeNumber;
function WardrobeNumber() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'Number';
  this.methods = {
    add: new WardrobeMethod(
      'add', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value + right.value);
        return context;
      }}
    ),
    subtract: new WardrobeMethod(
      'subtract', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value - right.value);
        return context;
      }}
    ),
    divide: new WardrobeMethod(
      'divide', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        console.log("hi there");
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value / right.value);
        return context;
      }}
    ),
    multiply: new WardrobeMethod(
      'multiply',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value * right.value);
        return context;
      }}
    )
  };
}

WardrobeNumber.prototype.new_object = function(argument) {
  return new WardrobeObject(this, argument);
};

WardrobeTrue.prototype = new WardrobeClass();
WardrobeTrue.prototype.constructor = WardrobeTrue;
function WardrobeTrue() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'True';
  this.methods = {
    and: new WardrobeMethod(
      'and',
      [{name: 'right'}],
      {evaluate: function(context) {
        var right = context.locals['right'];
        context.value = right;
        return context;
      }}
    ),
    or: new WardrobeMethod(
      'or',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = receiver;
        return context;
      }}
    )
  };
}

WardrobeTrue.prototype.new_object = function() {
  return new WardrobeObject(this, true);
};

WardrobeFalse.prototype = new WardrobeClass();
WardrobeFalse.prototype.constructor = WardrobeFalse;
function WardrobeFalse() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'False';
  this.methods = {
    and: new WardrobeMethod(
      'and',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = receiver;
        return context;
      }}
    ),
    or: new WardrobeMethod(
      'or',
      [{name: 'right'}],
      {evaluate: function(context, receiver, arguments) {
        var right = context.locals['right'];
        context.value = right;
        return context;
      }}
    )
  };
}

WardrobeFalse.prototype.new_object = function() {
  return new WardrobeObject(this, false);
};

WardrobeRuntime = function(obj, cls, locals, classes) { 
  this.obj = obj;
  this.cls = cls;
  this.locals = {};
  this.classes = {};

  this.setCurrentObject = function(obj) {
    this.obj = obj;
    this.cls = obj.getClass();
    return this.obj;
  };

  this.getCurrentObject = function() {
    return this.obj;
  };

  this.getCurrentClass = function() {
    return this.cls;
  };

  this.addLocal = function(name, local) {
    this.locals[name] = local;
    return this.locals[name];
  };

  this.getLocal = function(name) {
    return this.locals[name];
  };

  this.addClass = function(name, cls) {
    this.classes[name] = cls;
    return this.getClass(name);
  };

  this.createClass = function(name, params, properties) {
    var cls = new WardrobeClass(name, params, properties);
    this.addClass(name, cls);
    return this.getClass(name);
  };

  this.getClass = function(name) {
    return this.classes[name];
  };
};

wardrobe_class = new WardrobeClass('Class', {}, {});
wardrobe_class.cls = wardrobe_class;

var Runtime = new WardrobeRuntime(wardrobe_class, wardrobe_class.cls, {}, {});

Runtime.addClass('Class', wardrobe_class);
Runtime.addClass('Object', new WardrobeClass('Object', {}, {}));
Runtime.addClass('Method', new WardrobeClass('Method', {}, {}));
Runtime.addClass('String', new WardrobeString());
Runtime.addClass('Number', new WardrobeNumber());
Runtime.addClass('List', new WardrobeClass('List', {}, {}));
Runtime.addClass('True', new WardrobeClass('True', {}, {}));
Runtime.addClass('False', new WardrobeClass('False', {}, {}));

exports.Runtime = Runtime;
}
require['./nodes'] = new function() {
  var exports = this;
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
        context.locals[this.identifier.name].value = context.value;
      } else {
        context.current_object.setProperty(this.identifier.name, context.value);
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
        args[a] = context.value;
      }

      context = receiver.evaluate(context);
      receiver = context.value;

      context = receiver.call(context, this.method, args); 
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
      var left = context.value;
      context = this.right.evaluate(context);
      var right = context.value;

      switch(this.operator) {
        case '<': context.value = (left < right); break;
        case '>': context.value = (left > right); break;
        case '<=': context.value = (left <= right); break;
        case '>=': context.value = (left >= right); break;
        case '==': context.value = (left == right); break;
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
        context.value = context.locals[this.name].value;
      } else {
        console.log("GET CURRENT OBJECT PROPERTY");
        context.value = context.current_object.getProperty(this.name).value;
      }
      return context;
    };
  },

//  Property: function(expression, property) {
//    this.expression = expression;
//    this.property = property;
//
//   this.evaluate = function(context) {
//      context = this.expression.evaluate(context);
//      context.value = context.value.property(this.property);
//    };
//  },

  Number: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.value = Runtime.getClass('Number').new_object(this.value);
      return context;
    };
  },

  String: function(value) {
    this.value = value.slice(1, value.length - 1);

    this.evaluate = function(context) {
      context.value = Runtime.getClass('String').new_object(this.value);
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
      context.current_class = prior_class;
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
        context.value = null;
      } else {
        context = this.expression.evaluate(context);
      }
      
      cls = Runtime.getClass(this.cls);

      if (context.current_class !== null) {
        context.current_class.addProperty(cls, this.identifier.name, context.value);
      } else {
        context.locals[this.identifier.name] = {cls: cls, name: this.identifier.name, value: context.value};
      }
      
      return context;
    };
  },

  Create: function(cls, arguments) {
    this.cls = cls;
    this.arguments = arguments;

    this.evaluate = function(context) {
      context.value = Runtime.getClass(this.cls).new_object(arguments);
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
}
require['./parser'] = new function() {
  var exports = this;
  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"statement":9,"expression":10,"COMMENT":11,"RETURN":12,"primary":13,"block":14,"if":15,"while":16,"for":17,"assign":18,"operation":19,"call":20,"create":21,"function":22,"class":23,"LPAREN":24,"RPAREN":25,"IF":26,"THEN":27,"END":28,"ELSE":29,"WHILE":30,"DO":31,"FOR":32,"ident":33,"IN":34,"CONST":35,"identifier":36,"ASSIGN":37,"+":38,"-":39,"COMP":40,"MATH":41,"LOGIC":42,"DEF":43,"params":44,"COMMA":45,"DOT":46,"arguments":47,"NEW":48,"literal":49,"IDENT":50,"THIS":51,"NUMBER":52,"STRING":53,"constant":54,"CLASS":55,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",11:"COMMENT",12:"RETURN",24:"LPAREN",25:"RPAREN",26:"IF",27:"THEN",28:"END",29:"ELSE",30:"WHILE",31:"DO",32:"FOR",33:"ident",34:"IN",35:"CONST",37:"ASSIGN",38:"+",39:"-",40:"COMP",41:"MATH",42:"LOGIC",43:"DEF",45:"COMMA",46:"DOT",48:"NEW",50:"IDENT",51:"THIS",52:"NUMBER",53:"STRING",55:"CLASS"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[5,2],[8,1],[8,1],[9,1],[9,2],[14,3],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,3],[15,5],[15,7],[16,5],[17,7],[18,2],[18,4],[18,3],[19,3],[19,3],[19,3],[19,3],[19,3],[22,7],[44,0],[44,1],[44,3],[20,6],[20,4],[21,5],[47,0],[47,1],[47,3],[13,1],[13,1],[36,1],[36,3],[49,1],[49,1],[54,1],[23,4]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return [];
break;
case 2:return $$[$0-1];
break;
case 3:this.$ = $$[$0];
break;
case 4:this.$ = [$$[$0]];
break;
case 5:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 6:this.$ = $$[$0-1];
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:this.$ = new yy.Comment($$[$0]);
break;
case 10:this.$ = new yy.Return($$[$0]);
break;
case 11:this.$ = new yy.Block($$[$0-1]);
break;
case 12:this.$ = $$[$0];
break;
case 13:this.$ = $$[$0];
break;
case 14:this.$ = $$[$0];
break;
case 15:this.$ = $$[$0];
break;
case 16:this.$ = $$[$0];
break;
case 17:this.$ = $$[$0];
break;
case 18:this.$ = $$[$0];
break;
case 19:this.$ = $$[$0];
break;
case 20:this.$ = $$[$0];
break;
case 21:this.$ = $$[$0];
break;
case 22:this.$ = $$[$0-1];
break;
case 23:this.$ = new yy.If($$[$0-3], $$[$0-1], null);
break;
case 24:this.$ = new yy.If($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 25:this.$ = new yy.While($$[$0-3], $$[$0-1]);
break;
case 26:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 27:this.$ = new yy.Declare($$[$0-1], $$[$0], null);
break;
case 28:this.$ = new yy.Declare($$[$0-3], $$[$0-2], $$[$0]);
break;
case 29:this.$ = new yy.Assign($$[$0-2], $$[$0]);
break;
case 30:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 31:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 32:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 33:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 34:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 35:this.$ = new yy.Function($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 36:this.$ = [];
break;
case 37:this.$ = [$$[$0]];
break;
case 38:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 39:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1]);
break;
case 40:this.$ = new yy.Call($$[$0-3], null, $$[$0-1]);
break;
case 41:this.$ = new yy.Create($$[$0-3], $$[$0-1]);
break;
case 42:this.$ = [];
break;
case 43:this.$ = [$$[$0]];
break;
case 44:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 45:this.$ = $$[$0];
break;
case 46:this.$ = $$[$0];
break;
case 47:this.$ = new yy.Identifier($$[$0], 'local');
break;
case 48:this.$ = new yy.Identifier($$[$0], 'this');
break;
case 49:this.$ = new yy.Number($$[$0]);
break;
case 50:this.$ = new yy.String($$[$0]);
break;
case 51:this.$ = new yy.Const($$[$0]);
break;
case 52:this.$ = new yy.Class($$[$0-2], $$[$0-1]);
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,9:5,10:6,11:[1,7],12:[1,8],13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{1:[3]},{1:[2,1]},{4:[1,33],6:34,7:[1,35]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{4:[2,9],7:[2,9]},{13:42,36:43,49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32]},{4:[2,12],7:[2,12],25:[2,12],27:[2,12],31:[2,12],38:[2,12],39:[2,12],40:[2,12],41:[2,12],42:[2,12],46:[2,12]},{4:[2,13],7:[2,13],25:[2,13],27:[2,13],31:[2,13],38:[2,13],39:[2,13],40:[2,13],41:[2,13],42:[2,13],46:[2,13]},{4:[2,14],7:[2,14],25:[2,14],27:[2,14],31:[2,14],38:[2,14],39:[2,14],40:[2,14],41:[2,14],42:[2,14],46:[2,14]},{4:[2,15],7:[2,15],25:[2,15],27:[2,15],31:[2,15],38:[2,15],39:[2,15],40:[2,15],41:[2,15],42:[2,15],46:[2,15]},{4:[2,16],7:[2,16],25:[2,16],27:[2,16],31:[2,16],38:[2,16],39:[2,16],40:[2,16],41:[2,16],42:[2,16],46:[2,16]},{4:[2,17],7:[2,17],25:[2,17],27:[2,17],31:[2,17],38:[2,17],39:[2,17],40:[2,17],41:[2,17],42:[2,17],46:[2,17]},{4:[2,18],7:[2,18],25:[2,18],27:[2,18],31:[2,18],38:[2,18],39:[2,18],40:[2,18],41:[2,18],42:[2,18],46:[2,18]},{4:[2,19],7:[2,19],25:[2,19],27:[2,19],31:[2,19],38:[2,19],39:[2,19],40:[2,19],41:[2,19],42:[2,19],46:[2,19]},{4:[2,20],7:[2,20],25:[2,20],27:[2,20],31:[2,20],38:[2,20],39:[2,20],40:[2,20],41:[2,20],42:[2,20],46:[2,20]},{4:[2,21],7:[2,21],25:[2,21],27:[2,21],31:[2,21],38:[2,21],39:[2,21],40:[2,21],41:[2,21],42:[2,21],46:[2,21]},{10:44,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:45,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:46,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{33:[1,47]},{36:48,50:[1,29],51:[1,30]},{4:[2,45],7:[2,45],24:[1,50],25:[2,45],27:[2,45],31:[2,45],37:[1,49],38:[2,45],39:[2,45],40:[2,45],41:[2,45],42:[2,45],46:[2,45]},{35:[1,51]},{36:52,50:[1,29],51:[1,30]},{35:[1,54],54:53},{4:[2,46],7:[2,46],25:[2,46],27:[2,46],31:[2,46],38:[2,46],39:[2,46],40:[2,46],41:[2,46],42:[2,46],45:[2,46],46:[2,46]},{4:[2,47],7:[2,47],24:[2,47],25:[2,47],27:[2,47],31:[2,47],37:[2,47],38:[2,47],39:[2,47],40:[2,47],41:[2,47],42:[2,47],45:[2,47],46:[2,47]},{46:[1,55]},{4:[2,49],7:[2,49],25:[2,49],27:[2,49],31:[2,49],38:[2,49],39:[2,49],40:[2,49],41:[2,49],42:[2,49],45:[2,49],46:[2,49]},{4:[2,50],7:[2,50],25:[2,50],27:[2,50],31:[2,50],38:[2,50],39:[2,50],40:[2,50],41:[2,50],42:[2,50],45:[2,50],46:[2,50]},{1:[2,2]},{4:[2,6],7:[2,6],8:56,9:5,10:6,11:[1,7],12:[1,8],13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{4:[2,3],7:[2,3],11:[2,3],12:[2,3],24:[2,3],26:[2,3],28:[2,3],29:[2,3],30:[2,3],32:[2,3],35:[2,3],43:[2,3],48:[2,3],50:[2,3],51:[2,3],52:[2,3],53:[2,3],55:[2,3]},{10:57,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:58,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:59,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:60,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:61,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{36:62,50:[1,29],51:[1,30]},{4:[2,10],7:[2,10]},{4:[2,45],7:[2,45],25:[2,45],45:[2,45]},{25:[1,63],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{27:[1,64],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{31:[1,65],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{34:[1,66]},{4:[2,27],7:[2,27],25:[2,27],27:[2,27],31:[2,27],37:[1,67],38:[2,27],39:[2,27],40:[2,27],41:[2,27],42:[2,27],46:[2,27]},{10:68,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{13:70,25:[2,42],36:43,45:[2,42],47:69,49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32]},{24:[1,71]},{24:[1,72]},{6:74,7:[1,35],14:73},{7:[2,51]},{50:[1,75]},{4:[2,5],7:[2,5]},{4:[2,30],7:[2,30],25:[2,30],27:[2,30],31:[2,30],38:[2,30],39:[2,30],40:[1,38],41:[2,30],42:[1,40],46:[2,30]},{4:[2,31],7:[2,31],25:[2,31],27:[2,31],31:[2,31],38:[2,31],39:[2,31],40:[1,38],41:[2,31],42:[1,40],46:[2,31]},{4:[2,32],7:[2,32],25:[2,32],27:[2,32],31:[2,32],38:[2,32],39:[2,32],40:[2,32],41:[2,32],42:[1,40],46:[2,32]},{4:[2,33],7:[2,33],25:[2,33],27:[2,33],31:[2,33],38:[1,36],39:[1,37],40:[1,38],41:[2,33],42:[1,40],46:[2,33]},{4:[2,34],7:[2,34],25:[2,34],27:[2,34],31:[2,34],38:[2,34],39:[2,34],40:[2,34],41:[2,34],42:[2,34],46:[2,34]},{24:[1,76]},{4:[2,22],7:[2,22],25:[2,22],27:[2,22],31:[2,22],38:[2,22],39:[2,22],40:[2,22],41:[2,22],42:[2,22],46:[2,22]},{6:74,7:[1,35],14:77},{6:74,7:[1,35],14:78},{10:79,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{10:80,13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{4:[2,29],7:[2,29],25:[2,29],27:[2,29],31:[2,29],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{25:[1,81],45:[1,82]},{25:[2,43],45:[2,43]},{13:70,25:[2,42],36:43,45:[2,42],47:83,49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32]},{25:[2,36],36:85,44:84,45:[2,36],50:[1,29],51:[1,30]},{28:[1,86]},{5:87,8:4,9:5,10:6,11:[1,7],12:[1,8],13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{4:[2,48],7:[2,48],24:[2,48],25:[2,48],27:[2,48],31:[2,48],37:[2,48],38:[2,48],39:[2,48],40:[2,48],41:[2,48],42:[2,48],45:[2,48],46:[2,48]},{13:70,25:[2,42],36:43,45:[2,42],47:88,49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32]},{28:[1,89],29:[1,90]},{28:[1,91]},{31:[1,92],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{4:[2,28],7:[2,28],25:[2,28],27:[2,28],31:[2,28],38:[1,36],39:[1,37],40:[1,38],41:[1,39],42:[1,40],46:[1,41]},{4:[2,40],7:[2,40],25:[2,40],27:[2,40],31:[2,40],38:[2,40],39:[2,40],40:[2,40],41:[2,40],42:[2,40],46:[2,40]},{13:93,36:43,49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32]},{25:[1,94],45:[1,82]},{25:[1,95],45:[1,96]},{25:[2,37],45:[2,37]},{4:[2,52],7:[2,52],25:[2,52],27:[2,52],31:[2,52],38:[2,52],39:[2,52],40:[2,52],41:[2,52],42:[2,52],46:[2,52]},{6:97,7:[1,35]},{25:[1,98],45:[1,82]},{4:[2,23],7:[2,23],25:[2,23],27:[2,23],31:[2,23],38:[2,23],39:[2,23],40:[2,23],41:[2,23],42:[2,23],46:[2,23]},{6:74,7:[1,35],14:99},{4:[2,25],7:[2,25],25:[2,25],27:[2,25],31:[2,25],38:[2,25],39:[2,25],40:[2,25],41:[2,25],42:[2,25],46:[2,25]},{6:74,7:[1,35],14:100},{25:[2,44],45:[2,44]},{4:[2,41],7:[2,41],25:[2,41],27:[2,41],31:[2,41],38:[2,41],39:[2,41],40:[2,41],41:[2,41],42:[2,41],46:[2,41]},{6:74,7:[1,35],14:101},{36:102,50:[1,29],51:[1,30]},{7:[2,6],8:56,9:5,10:6,11:[1,7],12:[1,8],13:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],28:[2,11],29:[2,11],30:[1,21],32:[1,22],35:[1,23],36:24,43:[1,26],48:[1,25],49:28,50:[1,29],51:[1,30],52:[1,31],53:[1,32],55:[1,27]},{4:[2,39],7:[2,39],25:[2,39],27:[2,39],31:[2,39],38:[2,39],39:[2,39],40:[2,39],41:[2,39],42:[2,39],46:[2,39]},{28:[1,103]},{28:[1,104]},{28:[1,105]},{25:[2,38],45:[2,38]},{4:[2,24],7:[2,24],25:[2,24],27:[2,24],31:[2,24],38:[2,24],39:[2,24],40:[2,24],41:[2,24],42:[2,24],46:[2,24]},{4:[2,26],7:[2,26],25:[2,26],27:[2,26],31:[2,26],38:[2,26],39:[2,26],40:[2,26],41:[2,26],42:[2,26],46:[2,26]},{4:[2,35],7:[2,35],25:[2,35],27:[2,35],31:[2,35],38:[2,35],39:[2,35],40:[2,35],41:[2,35],42:[2,35],46:[2,35]}],
defaultActions: {2:[2,1],33:[2,2],54:[2,51]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                var errStr = "";
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
undefined
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}}
require['./interpreter'] = new function() {
  var exports = this;
  function run(ast) {
  var context = emptyContext();

  ast = setLoadStructure(ast);

  try {
    for (i = 0; i < ast.length; i++) {
      var node = ast[i];
      context = node.evaluate(context);
    }
  } catch(error) {
    
  }

  return context;
}

function emptyContext() {
  return {
    locals: {},
    current_class: null,
    current_object: null,
    value: null
  };
}

function setLoadStructure(ast) {
  var definitionNodes = [];
  var regularNodes = [];

  for (var a = 0; a < ast.length; a++) {
    node = ast[a];
    if (node.type == 'Class' || node.type == 'Function') {
      definitionNodes.push(node);
    } else {
      regularNodes.push(node);
    }
  }

  ast = definitionNodes.concat(regularNodes);
  return ast;
}

exports.run = run;
}
require['./wardrobe'] = new function() {
  var exports = this;
  var lexer = require('./lexer');
var nodes = require('./nodes').nodes;
var parser = require('./parser').parser;
var interpreter = require('./interpreter');

function run(source) {
  var tokens = lexer.lex(source);
  console.log('Lexer finished, tokens: \n');
  console.log(tokens);

  parser.yy = nodes; 
  parser.lexer =  {
    "lex": function() {
      var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF'];
      this.yytext = token[1];
      this.yylineno = token[2];
      return token[0];
    },
    "setInput": function(tokens) {
      this.tokens = tokens;
      this.pos = 0;
    },
    "upcomingInput": function() {
      return "";
    }
  };

  var ast = parser.parse(tokens);
  console.log('\nParser finished, abstract syntax tree: \n');
  console.log(ast);

  console.log("\nIntepreting code, output: \n");
  context = interpreter.run(ast);
  console.log('\nIntepreter finished, final context:\n');
  console.log(context);
  
  return context;
}

exports.run = run;
}
    return require['./wardrobe'];  }();    if (typeof define === 'function' && define.amd) {      define(function() { return Wardrobe; });    } else {      root.Wardrobe = Wardrobe;     }  }(this));