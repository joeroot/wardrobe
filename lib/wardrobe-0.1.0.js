var wardrobe_in_browser = true;

function logToConsole(x) {
  print(x);
}
(function(root) {
  var Wardrobe = function() {
    function require(path){ return require[path]; }require['./lexer'] = new function() {
  var exports = this;
  var keywords = ['this', 'class', 'def', 'if', 'then', 'else', 'while', 'do', 'end', 'return', 'true', 'false'];
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
require['./nodes'] = new function() {
  var exports = this;
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
        case 'local': 
          context.locals[this.identifier.name] = context.value;
          break;
        case 'this':
          context.classes[context.current_class].locals[this.identifier.name] = context.value;
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
      }

      return context;
    };
  },

  Identifier: function(name, scope) {
    this.name = name;
    this.scope = scope;

    this.evaluate = function(context) {
      switch (this.scope) {
        case 'local':
          context.value = context.locals[this.name];
          break;
        case 'this':
          context.value = context.classes[context.current_class].locals[this.name];
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
}
require['./parser'] = new function() {
  var exports = this;
  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"statement":9,"expression":10,"COMMENT":11,"RETURN":12,"primary":13,"block":14,"if":15,"while":16,"for":17,"assign":18,"operation":19,"call":20,"function":21,"class":22,"LPAREN":23,"RPAREN":24,"IF":25,"THEN":26,"END":27,"ELSE":28,"WHILE":29,"DO":30,"FOR":31,"ident":32,"IN":33,"identifier":34,"ASSIGN":35,"+":36,"-":37,"COMP":38,"MATH":39,"LOGIC":40,"DEF":41,"params":42,"COMMA":43,"DOT":44,"arguments":45,"literal":46,"IDENT":47,"THIS":48,"NUMBER":49,"STRING":50,"constant":51,"CONST":52,"CLASS":53,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",11:"COMMENT",12:"RETURN",23:"LPAREN",24:"RPAREN",25:"IF",26:"THEN",27:"END",28:"ELSE",29:"WHILE",30:"DO",31:"FOR",32:"ident",33:"IN",35:"ASSIGN",36:"+",37:"-",38:"COMP",39:"MATH",40:"LOGIC",41:"DEF",43:"COMMA",44:"DOT",47:"IDENT",48:"THIS",49:"NUMBER",50:"STRING",52:"CONST",53:"CLASS"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[5,2],[8,1],[8,1],[9,1],[9,2],[14,3],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,3],[15,5],[15,7],[16,5],[17,7],[18,3],[19,3],[19,3],[19,3],[19,3],[19,3],[21,7],[42,0],[42,1],[42,3],[20,6],[20,4],[45,0],[45,1],[45,3],[13,1],[13,1],[34,1],[34,3],[46,1],[46,1],[51,1],[22,4]],
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
case 21:this.$ = $$[$0-1];
break;
case 22:this.$ = new yy.If($$[$0-3], $$[$0-1], null);
break;
case 23:this.$ = new yy.If($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 24:this.$ = new yy.While($$[$0-3], $$[$0-1]);
break;
case 25:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 26:this.$ = new yy.Assign($$[$0-2], $$[$0]);
break;
case 27:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 28:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 29:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 30:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 31:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 32:this.$ = new yy.Function($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 33:this.$ = [];
break;
case 34:this.$ = [$$[$0]];
break;
case 35:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 36:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1]);
break;
case 37:this.$ = new yy.Call($$[$0-3], null, $$[$0-1]);
break;
case 38:this.$ = [];
break;
case 39:this.$ = [$$[$0]];
break;
case 40:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 41:this.$ = $$[$0];
break;
case 42:this.$ = $$[$0];
break;
case 43:this.$ = new yy.Identifier($$[$0], 'local');
break;
case 44:this.$ = new yy.Identifier($$[$0], 'this');
break;
case 45:this.$ = new yy.Number($$[$0]);
break;
case 46:this.$ = new yy.String($$[$0]);
break;
case 47:this.$ = new yy.Const($$[$0]);
break;
case 48:this.$ = new yy.Class($$[$0-2], $$[$0-1]);
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,9:5,10:6,11:[1,7],12:[1,8],13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{1:[3]},{1:[2,1]},{4:[1,30],6:31,7:[1,32]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[1,38]},{4:[2,9],7:[2,9]},{13:39,34:40,46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29]},{4:[2,12],7:[2,12],24:[2,12],26:[2,12],30:[2,12],36:[2,12],37:[2,12],38:[2,12],39:[2,12],40:[2,12],44:[2,12]},{4:[2,13],7:[2,13],24:[2,13],26:[2,13],30:[2,13],36:[2,13],37:[2,13],38:[2,13],39:[2,13],40:[2,13],44:[2,13]},{4:[2,14],7:[2,14],24:[2,14],26:[2,14],30:[2,14],36:[2,14],37:[2,14],38:[2,14],39:[2,14],40:[2,14],44:[2,14]},{4:[2,15],7:[2,15],24:[2,15],26:[2,15],30:[2,15],36:[2,15],37:[2,15],38:[2,15],39:[2,15],40:[2,15],44:[2,15]},{4:[2,16],7:[2,16],24:[2,16],26:[2,16],30:[2,16],36:[2,16],37:[2,16],38:[2,16],39:[2,16],40:[2,16],44:[2,16]},{4:[2,17],7:[2,17],24:[2,17],26:[2,17],30:[2,17],36:[2,17],37:[2,17],38:[2,17],39:[2,17],40:[2,17],44:[2,17]},{4:[2,18],7:[2,18],24:[2,18],26:[2,18],30:[2,18],36:[2,18],37:[2,18],38:[2,18],39:[2,18],40:[2,18],44:[2,18]},{4:[2,19],7:[2,19],24:[2,19],26:[2,19],30:[2,19],36:[2,19],37:[2,19],38:[2,19],39:[2,19],40:[2,19],44:[2,19]},{4:[2,20],7:[2,20],24:[2,20],26:[2,20],30:[2,20],36:[2,20],37:[2,20],38:[2,20],39:[2,20],40:[2,20],44:[2,20]},{10:41,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:42,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:43,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{32:[1,44]},{4:[2,41],7:[2,41],23:[1,46],24:[2,41],26:[2,41],30:[2,41],35:[1,45],36:[2,41],37:[2,41],38:[2,41],39:[2,41],40:[2,41],44:[2,41]},{34:47,47:[1,26],48:[1,27]},{51:48,52:[1,49]},{4:[2,42],7:[2,42],24:[2,42],26:[2,42],30:[2,42],36:[2,42],37:[2,42],38:[2,42],39:[2,42],40:[2,42],43:[2,42],44:[2,42]},{4:[2,43],7:[2,43],23:[2,43],24:[2,43],26:[2,43],30:[2,43],35:[2,43],36:[2,43],37:[2,43],38:[2,43],39:[2,43],40:[2,43],43:[2,43],44:[2,43]},{44:[1,50]},{4:[2,45],7:[2,45],24:[2,45],26:[2,45],30:[2,45],36:[2,45],37:[2,45],38:[2,45],39:[2,45],40:[2,45],43:[2,45],44:[2,45]},{4:[2,46],7:[2,46],24:[2,46],26:[2,46],30:[2,46],36:[2,46],37:[2,46],38:[2,46],39:[2,46],40:[2,46],43:[2,46],44:[2,46]},{1:[2,2]},{4:[2,6],7:[2,6],8:51,9:5,10:6,11:[1,7],12:[1,8],13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{4:[2,3],7:[2,3],11:[2,3],12:[2,3],23:[2,3],25:[2,3],27:[2,3],28:[2,3],29:[2,3],31:[2,3],41:[2,3],47:[2,3],48:[2,3],49:[2,3],50:[2,3],53:[2,3]},{10:52,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:53,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:54,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:55,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{10:56,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{34:57,47:[1,26],48:[1,27]},{4:[2,10],7:[2,10]},{4:[2,41],7:[2,41],24:[2,41],43:[2,41]},{24:[1,58],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[1,38]},{26:[1,59],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[1,38]},{30:[1,60],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[1,38]},{33:[1,61]},{10:62,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{13:64,24:[2,38],34:40,43:[2,38],45:63,46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29]},{23:[1,65]},{6:67,7:[1,32],14:66},{7:[2,47]},{47:[1,68]},{4:[2,5],7:[2,5]},{4:[2,27],7:[2,27],24:[2,27],26:[2,27],30:[2,27],36:[2,27],37:[2,27],38:[1,35],39:[2,27],40:[1,37],44:[2,27]},{4:[2,28],7:[2,28],24:[2,28],26:[2,28],30:[2,28],36:[2,28],37:[2,28],38:[1,35],39:[2,28],40:[1,37],44:[2,28]},{4:[2,29],7:[2,29],24:[2,29],26:[2,29],30:[2,29],36:[2,29],37:[2,29],38:[2,29],39:[2,29],40:[1,37],44:[2,29]},{4:[2,30],7:[2,30],24:[2,30],26:[2,30],30:[2,30],36:[1,33],37:[1,34],38:[1,35],39:[2,30],40:[1,37],44:[2,30]},{4:[2,31],7:[2,31],24:[2,31],26:[2,31],30:[2,31],36:[2,31],37:[2,31],38:[2,31],39:[2,31],40:[2,31],44:[2,31]},{23:[1,69]},{4:[2,21],7:[2,21],24:[2,21],26:[2,21],30:[2,21],36:[2,21],37:[2,21],38:[2,21],39:[2,21],40:[2,21],44:[2,21]},{6:67,7:[1,32],14:70},{6:67,7:[1,32],14:71},{10:72,13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{4:[2,26],7:[2,26],24:[2,26],26:[2,26],30:[2,26],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[2,26]},{24:[1,73],43:[1,74]},{24:[2,39],43:[2,39]},{24:[2,33],34:76,42:75,43:[2,33],47:[1,26],48:[1,27]},{27:[1,77]},{5:78,8:4,9:5,10:6,11:[1,7],12:[1,8],13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{4:[2,44],7:[2,44],23:[2,44],24:[2,44],26:[2,44],30:[2,44],35:[2,44],36:[2,44],37:[2,44],38:[2,44],39:[2,44],40:[2,44],43:[2,44],44:[2,44]},{13:64,24:[2,38],34:40,43:[2,38],45:79,46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29]},{27:[1,80],28:[1,81]},{27:[1,82]},{30:[1,83],36:[1,33],37:[1,34],38:[1,35],39:[1,36],40:[1,37],44:[1,38]},{4:[2,37],7:[2,37],24:[2,37],26:[2,37],30:[2,37],36:[2,37],37:[2,37],38:[2,37],39:[2,37],40:[2,37],44:[2,37]},{13:84,34:40,46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29]},{24:[1,85],43:[1,86]},{24:[2,34],43:[2,34]},{4:[2,48],7:[2,48],24:[2,48],26:[2,48],30:[2,48],36:[2,48],37:[2,48],38:[2,48],39:[2,48],40:[2,48],44:[2,48]},{6:87,7:[1,32]},{24:[1,88],43:[1,74]},{4:[2,22],7:[2,22],24:[2,22],26:[2,22],30:[2,22],36:[2,22],37:[2,22],38:[2,22],39:[2,22],40:[2,22],44:[2,22]},{6:67,7:[1,32],14:89},{4:[2,24],7:[2,24],24:[2,24],26:[2,24],30:[2,24],36:[2,24],37:[2,24],38:[2,24],39:[2,24],40:[2,24],44:[2,24]},{6:67,7:[1,32],14:90},{24:[2,40],43:[2,40]},{6:67,7:[1,32],14:91},{34:92,47:[1,26],48:[1,27]},{7:[2,6],8:51,9:5,10:6,11:[1,7],12:[1,8],13:17,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:[1,18],25:[1,19],27:[2,11],28:[2,11],29:[1,20],31:[1,21],34:22,41:[1,23],46:25,47:[1,26],48:[1,27],49:[1,28],50:[1,29],53:[1,24]},{4:[2,36],7:[2,36],24:[2,36],26:[2,36],30:[2,36],36:[2,36],37:[2,36],38:[2,36],39:[2,36],40:[2,36],44:[2,36]},{27:[1,93]},{27:[1,94]},{27:[1,95]},{24:[2,35],43:[2,35]},{4:[2,23],7:[2,23],24:[2,23],26:[2,23],30:[2,23],36:[2,23],37:[2,23],38:[2,23],39:[2,23],40:[2,23],44:[2,23]},{4:[2,25],7:[2,25],24:[2,25],26:[2,25],30:[2,25],36:[2,25],37:[2,25],38:[2,25],39:[2,25],40:[2,25],44:[2,25]},{4:[2,32],7:[2,32],24:[2,32],26:[2,32],30:[2,32],36:[2,32],37:[2,32],38:[2,32],39:[2,32],40:[2,32],44:[2,32]}],
defaultActions: {2:[2,1],30:[2,2],49:[2,47]},
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

  for (i = 0; i < ast.length; i++) {
    var node = ast[i];
    context = node.evaluate(context);
  }

  return context;
}

function emptyContext() {
  return {
    locals: {},
    globals: {},
    classes: {},
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