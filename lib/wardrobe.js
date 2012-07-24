function logToConsole(x) {
  print(x);
}
(function(root) {
  var Wardrobe = function() {
    function require(path){ return require[path]; }require['./lexer'] = new function() {
  var exports = this;
  var keywords = ['this', 'new', 'class', 'extends', 'def', 'if', 'then', 'else', 'while', 'do', 'end', 'return', 'true', 'false'];
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
    else if ((value = chunk.match(/\(|\)|\,|\[|\]/)) && value.index === 0) {
      value = value[0];
      if (value == '(') {tokens.push(['LPAREN', value, line]);}
      else if (value == ')') {tokens.push(['RPAREN', value, line]);}
      else if (value == '[') {tokens.push(['LSQUARE', value, line]);}
      else if (value == ']') {tokens.push(['RSQUARE', value, line]);}
      else if (value == ',') {tokens.push(['COMMA', value, line]);}
      i = i + value.length;
    }
    // Operators
    else if ((value = chunk.match(/\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*/)) && value.index === 0) {
      value = value[0];
      if (operator.indexOf(value) >= 0) {tokens.push([value, value, line]);}
      else if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line]);}
      else if (math.indexOf(value) >= 0) {tokens.push(['MATH', value, line]);}
      else if (comparators.indexOf(value) >= 0) {tokens.push(['COMP', value, line]);}
      else if (assign.indexOf(value) >= 0) {tokens.push(['ASSIGN', value, line]);}
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
    else if ((value = chunk.match(/((\s)*\n|(\s)*\r)+/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NEWLINE", value, line]);
      line = line + value.replace(/ /g, '').length;
      i = i + value.length;
    }
    else {
      //console.error("Unmatched: " + escape(value[0]));
      i = i + 1;
    }
  }

  // Drops any starting or trailing whitespace/newlines
  if (tokens[0][0] == 'NEWLINE') {tokens.shift();}
  if (tokens[tokens.length-1][0] == 'NEWLINE') {tokens.pop();}

  return tokens;
}

function lex(source) {
  return scan(source);
}

exports.lex = lex;
}
require['./runtime'] = new function() {
  var exports = this;
  "use strict";

var WardrobeRuntime = function(obj, cls, classes) { 
  this.obj = obj;
  this.cls = cls;
  this.classes = {};
  this.globals = {};
};

WardrobeRuntime.prototype.setCurrentObject = function(obj) {
  this.obj = obj;
  this.cls = obj.getClass();
  return this.obj;
};

WardrobeRuntime.prototype.getCurrentObject = function() {
  return this.obj;
};

WardrobeRuntime.prototype.getCurrentClass = function() {
  return this.cls;
};

WardrobeRuntime.prototype.addGlobal = function(name, object) {
  this.globals[name] = {type: object.cls, object: object};
  return this.globals[name];
};

WardrobeRuntime.prototype.getGlobal = function(name) {
  return this.globals[name];
};

WardrobeRuntime.prototype.getGlobalObject = function(name) {
  return this.globals[name].object;
};

WardrobeRuntime.prototype.addClass = function(name, cls) {
  this.classes[name] = cls;
  return this.getClass(name);
};

WardrobeRuntime.prototype.createClass = function(name, super_class) {
  var cls = new WardrobeClass(name, super_class);
  this.addClass(name, cls);
  return this.getClass(name);
};

WardrobeRuntime.prototype.getClass = function(name) {
  return this.classes[name];
};

var Context = function() {
  this.current_object = null;
  this.current_class = null;
  this.locals = {};
  this.return_object = null;
};

Context.prototype.clone = function() {
  var clone = new Context();
  clone.setCurrentObject(this.getCurrentObject());
  clone.setCurrentClass(this.getCurrentClass());
  clone.setReturnObject(this.getReturnObject());
  return clone;
};

Context.prototype.addLocal = function(name, type, object) {
  this.locals[name] = {type: type, object: object};
};

Context.prototype.deleteLocal = function(name) {
  delete this.locals[name];
};

Context.prototype.getLocal = function(name) {
  return this.locals[name];
};

Context.prototype.getLocalType = function(name) {
  return this.locals[name].type;
};

Context.prototype.setLocalType = function(name, type) {
  this.locals[name].type = type;
  return this.locals[name].type;
};

Context.prototype.getLocalObject = function(name) {
  return this.locals[name].object;
};

Context.prototype.setLocalObject = function(name, object) {
  this.locals[name].object = object;
  return this.locals[name].object;
};

Context.prototype.getCurrentObject = function() {
  return this.current_object;
};

Context.prototype.setCurrentObject = function(object) {
  this.current_object = object;
  return this.current_object;
};

Context.prototype.getCurrentClass = function() {
  return this.current_class;
};

Context.prototype.setCurrentClass = function(cls) {
  this.current_class = cls;
  return this.current_class;
};

Context.prototype.getReturnObject = function() {
  return this.return_object;
};

Context.prototype.setReturnObject = function(object) {
  this.return_object = object;
  return this.return_object;
};

var WardrobeObject = function(cls, value) {
  this.cls = cls;
  this.value = value;
  if (value === null) {this.value = this;}
  if (Runtime !== undefined) {
    this.properties = this.cls.getProperties();
  } else {
    this.properties = {};
  }
};

WardrobeObject.prototype.getClass = function() {
  return this.cls;
};

WardrobeObject.prototype.call = function(context, name, args) {
  var method = this.cls.getMethod(name);
  method.call(context, this, args);
  return context;
};

WardrobeObject.prototype.setValue = function(value) {
  this.value = value;
  return value;
};

WardrobeObject.prototype.getValue = function() {
  return this.value;
};

WardrobeObject.prototype.setProperty = function(property, object) {
  this.properties[property].object = object;
  return this.properties[property];
};

WardrobeObject.prototype.getProperty = function(property) {
  return this.properties[property];
};

WardrobeObject.prototype.getPropertyObject = function(property) {
  return this.properties[property].object;
};

WardrobeObject.prototype.toString = function() {
  var str = "";
  if (this.value !== this) {
   switch(this.cls.name) {
    case 'String': str += '"' + this.value + '"'; break;
    case 'List': str += '[' + this.value + ']'; break;
    default: str = this.value; break;
   }
  
  } else {
    str = '<' + this.cls.name + ':';
    str += "{";
    for (var property in this.properties) {
      var object = this.getPropertyObject(property);
      if (object === null) {
        object = 'null';
      } else {
        object = object.toString();
      }
      str += property + ":" + object + ",";
    }
    str = str.substring(0,str.length-1);
    str += "}";
    str += '>';
  }
  return str;
};


WardrobeClass.prototype = new WardrobeObject(); 
WardrobeClass.prototype.constructor = WardrobeClass;
function WardrobeClass(name, super_class) {
  if (Runtime !== undefined) {
    this.cls = Runtime.getClass('Class');  
  } else {
    this.cls = null;
  }
  this.value = this;

  this.super_class = super_class;
  this.name = name;
  this.methods = {};
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

WardrobeClass.prototype.getMethod = function(name) {
  var method = null;
  if (this.methods[name] !== undefined && typeof(this.methods[name]) == 'object') {
    //console.log(name + " " + this.name);
    method = this.methods[name];
  } else if (this.hasSuperClass()) {
  //console.log(this.name + ":");
  //console.log(this.methods);
    method = this.getSuperClass().getMethod(name);
  }
  return method;
};

WardrobeClass.prototype.hasMethod = function(method) {
  return this.methods[method] !== undefined;
};

WardrobeClass.prototype.addProperty = function(name, type, object) {
  this.properties[name] = {type: type, object: object};
};

WardrobeClass.prototype.getProperties = function() {
  var properties = {};
  if (this.hasSuperClass()) {
    properties = this.getSuperClass().getProperties();
  }
  for (var property in this.properties) {
    properties[property] = this.properties[property];
  }
  return properties;
};

WardrobeClass.prototype.getSuperClass = function() {
  return this.super_class;
};

WardrobeClass.prototype.setSuperClass = function(super_class) {
  this.super_class = super_class;
  return this.super_class;
};

WardrobeClass.prototype.hasSuperClass = function() {
  return this.super_class !== null;
};

WardrobeClass.prototype.toString = function() {
  return '<Class:' + this.name + '>';
};

WardrobeClass.prototype.new_object = function(args) {
  var context = new Context();
  var obj = new WardrobeObject(this, null);
  this.getMethod('init').call(context, obj, args);
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

WardrobeMethod.prototype.call = function(context, receiver, args) { 
  var old_context = context.clone();
  var param, p;

  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    var argument = args[p];
    context.addLocal(param, argument.cls, argument);
  }

  context.setCurrentObject(receiver);
  context = this.body.evaluate(context); 
  
  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    if (old_context.getLocal(param) !== undefined) {
      context.setLocalType(param, old_context.getLocalType(param));
      context.setLocalObject(param, old_context.getLocalObject(param));
    } else {
      delete context.deleteLocal(param);
    }
  }
  context.setCurrentObject(old_context.getCurrentObject());
  context.setCurrentClass(old_context.getCurrentClass());
  return context;
};

WardrobeObjectClass.prototype = new WardrobeClass();
WardrobeObjectClass.prototype.constructor = WardrobeObjectClass;
function WardrobeObjectClass() {
  this.cls = null;
  this.value = this;

  this.name = 'Object';
  this.super_class = null;
  this.methods = {};
}

WardrobeObjectClass.prototype.installMethods = function() {
  this.methods.init= new WardrobeMethod(
    'init', 
    [], 
    {evaluate: function(context) {
      return context;
    }}
  );
  this.methods.toString = new WardrobeMethod(
    'toString', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('String').new_object(receiver.toString());
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.getClass= new WardrobeMethod(
    'class',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = receiver.cls;
      context.setReturnObject(object);
      return context;
    }}
  );
};

WardrobeString.prototype = new WardrobeClass();
WardrobeString.prototype.constructor = WardrobeString;
function WardrobeString() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'String';
  this.super_class = Runtime.getClass('Object');
  this.methods = {};
  this.methods.length = new WardrobeMethod(
    'length', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').new_object(receiver.value.length);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.concat = new WardrobeMethod(
    'concat',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('String').new_object(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
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
  this.super_class = Runtime.getClass('Object');
  this.methods = {};
  this.methods.add = new WardrobeMethod(
    'add', 
    [{name: 'right'}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').new_object(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.subtract = new WardrobeMethod(
    'subtract', 
    [{name: 'right'}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').new_object(receiver.value - right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.divide = new WardrobeMethod(
    'divide', 
    [{name: 'right'}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').new_object(receiver.value / right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.multiply = new WardrobeMethod(
    'multiply',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').new_object(receiver.value * right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.positive= new WardrobeMethod(
    'positive',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(+receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }}
  );
  this.methods.negative= new WardrobeMethod(
    'negative',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(-receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }}
  );
  this.methods.greaterthan = new WardrobeMethod();
}

WardrobeNumber.prototype.new_object = function(argument) {
  return new WardrobeObject(this, argument);
};

WardrobeBoolean.prototype = new WardrobeClass();
WardrobeBoolean.prototype.constructor = WardrobeBoolean;
function WardrobeBoolean() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'Boolean';
  this.super_class = Runtime.getClass('Object');
  this.methods = {};
}

WardrobeTrue.prototype = new WardrobeClass();
WardrobeTrue.prototype.constructor = WardrobeTrue;
function WardrobeTrue() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'TrueBoolean';
  this.super_class = Runtime.getClass('Boolean');
  this.methods = {};
  this.methods.and = new WardrobeMethod(
    'and',
    [{name: 'right'}],
    {evaluate: function(context) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{name: 'right'}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
}

WardrobeTrue.prototype.new_object = function() {
  return new WardrobeObject(this, true);
};

WardrobeFalse.prototype = new WardrobeClass();
WardrobeFalse.prototype.constructor = WardrobeFalse;
function WardrobeFalse() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'FalseBoolean';
  this.super_class = Runtime.getClass('Boolean');
  this.methods = {};
  this.methods.and = new WardrobeMethod(
    'and',
    [{name: 'right'}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('false'));
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{name: 'right'}],
    {evaluate: function(context, receiver, args) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
}

WardrobeFalse.prototype.new_object = function() {
  return new WardrobeObject(this, false);
};

WardrobeList.prototype = new WardrobeClass();
WardrobeList.prototype.constructor = WardrobeList;
function WardrobeList() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'List';
  this.super_class = Runtime.getClass('Object');
  this.methods = {}; 
  this.methods.length = new WardrobeMethod(
    'length',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').new_object(receiver.value.length);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.reverse = new WardrobeMethod(
    'reverse',
    [],
    {evaluate: function(context) {
      context.getCurrentObject().value.reverse(); 
      context.setReturnObject(context.getCurrentObject());
      return context;
    }}
  );
  this.methods.concat = new WardrobeMethod(
    'concat',
    [{name: 'right'}],
    {evaluate: function(context) {
      var right = context.getLocalObject('right');
      var concat = context.getCurrentObject().value.concat(right.value);
      context.getCurrentObject().value = concat;
      context.setReturnObject(context.getCurrentObject());
      return context;
    }}
  );
  this.methods.pop = new WardrobeMethod(
    'pop',
    [],
    {evaluate: function(context) {
      var item = context.getCurrentObject().value.pop();
      context.setReturnObject(item);
      return context;
    }}
  );
  this.methods.push = new WardrobeMethod(
    'push',
    [{name: 'item'}],
    {evaluate: function(context) {
      var item = context.getLocalObject('item');
      context.getCurrentObject().value.push(item);
      context.setReturnObject(item);
      return context;
    }}
  );
  this.methods.get = new WardrobeMethod(
    'get',
    [{name: 'index'}],
    {evaluate: function(context) {
      var index = context.getLocalObject('index');
      context.setReturnObject(context.getCurrentObject().value[index.value]);
      return context;
    }}
  );
  this.methods.indexOf = new WardrobeMethod(
    'indexOf',
    [{name: 'item'}],
    {evaluate: function(context) {
      var item = context.getLocalObject('item');
      var list = context.getCurrentObject().value;
      var index = -1;
      for (var i = 0; i < list.length; i++) {
        if (list[i].call(context, 'equals', [item]).getReturnObject().value) {
          index = i;
          break;
        }
      }
      context.setReturnObject(Runtime.getClass('Number').new_object(index));
      return context;
    }}
  );
}

WardrobeList.prototype.toString = function() {
  return '[' + this.value + ']'; 
};

WardrobeList.prototype.new_object = function(list) {
  return new WardrobeObject(this, list);
};

WardrobeSystem.prototype = new WardrobeClass();
WardrobeSystem.prototype.constructor = WardrobeSystem;
function WardrobeSystem() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'System';
  this.super_class = Runtime.getClass('Object');
  this.methods = {}; 
  this.methods.print = new WardrobeMethod(
    'print',
    [{name: 'object'}],
    {evaluate: function(context) {
      var obj = context.getLocalObject('object').value;
      if (typeof(window) != 'undefined') {
        logToConsole(obj.toString());
      }
      console.log(obj.toString());
      return context;
    }}
  );
}

WardrobeSystem.prototype.new_object = function() {
  return new WardrobeObject(this, null);
};

var wardrobe_class = new WardrobeClass('Class', null);
wardrobe_class.cls = wardrobe_class;

var wardrobe_object_class = new WardrobeObjectClass();
wardrobe_object_class.cls = wardrobe_class;

wardrobe_class.setSuperClass(wardrobe_object_class);

var Runtime = new WardrobeRuntime(wardrobe_class, wardrobe_class.cls, {});

Runtime.addClass('Class', wardrobe_class);
Runtime.addClass('Object', wardrobe_object_class);
Runtime.addClass('Method', new WardrobeClass('Method', null));
Runtime.addClass('String', new WardrobeString());
Runtime.addClass('Number', new WardrobeNumber());
Runtime.addClass('List', new WardrobeList());
Runtime.addClass('Boolean', new WardrobeBoolean());
Runtime.addClass('TrueBoolean', new WardrobeTrue());
Runtime.addClass('FalseBoolean', new WardrobeFalse());
Runtime.addClass('System', new WardrobeSystem());

Runtime.getClass('Object').installMethods();

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').new_object());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').new_object());
Runtime.addGlobal('system', Runtime.getClass('System').new_object());

exports.Runtime = Runtime;
exports.Context = Context;
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
        Runtime.getGlobalObject('system').call(context, 'print', args);
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
      var right = null;
      if (this.left !== null) {
        context = this.left.evaluate(context);
        var left = context.getReturnObject();
        context = this.right.evaluate(context);
        right = context.getReturnObject();

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
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    };
  },

  False: function(value) {
    this.value = value;

    this.evaluate = function(context) {
      context.setReturnObject(Runtime.getGlobalObject('false'));
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
      context.setReturnObject(Runtime.getClass(this.name));
      return context;
    };
  },

  Class: function(constant, super_class, block) {
    this.type = 'Class';
    this.name = constant;
    this.super_name = 'Object';
    if (super_class !== null) {
      this.super_name = super_class.name;
    }
    this.block = block;

    this.evaluate = function(context) {
      var cls = Runtime.createClass(this.name, Runtime.getClass(this.super_name));
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
      
      type = Runtime.getClass(this.cls);

      if (context.current_class !== null) {
        context.getCurrentClass().addProperty(this.identifier.name, type, context.getReturnObject());
      } else {
        context.addLocal(this.identifier.name, type, context.getReturnObject());
      }
      
      return context;
    };
  },

  Create: function(cls, args) {
    this.cls = cls;
    this.args = args;

    this.evaluate = function(context) {
      var args = [];
      for (var a = 0; a < this.args.length; a++) {
        var arg = this.args[a];
        context = arg.evaluate(context);
        args[a] = context.getReturnObject();
      }

      var object = Runtime.getClass(this.cls).new_object(args);

      context.setReturnObject(object);
      return context;
    };
  }
};
}
require['./parser'] = new function() {
  var exports = this;
  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"block":9,"statement":10,"expression":11,"COMMENT":12,"RETURN":13,"primary":14,"if":15,"while":16,"for":17,"assign":18,"operation":19,"call":20,"create":21,"function":22,"class":23,"LPAREN":24,"RPAREN":25,"IF":26,"END":27,"ELSE":28,"WHILE":29,"DO":30,"FOR":31,"ident":32,"IN":33,"CONST":34,"identifier":35,"ASSIGN":36,"+":37,"-":38,"MATH":39,"COMP":40,"LOGIC":41,"DEF":42,"params":43,"COMMA":44,"DOT":45,"arguments":46,"NEW":47,"constant":48,"literal":49,"IDENT":50,"THIS":51,"NUMBER":52,"STRING":53,"TRUE":54,"FALSE":55,"list":56,"LSQUARE":57,"list_items":58,"RSQUARE":59,"CLASS":60,"EXTENDS":61,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",12:"COMMENT",13:"RETURN",24:"LPAREN",25:"RPAREN",26:"IF",27:"END",28:"ELSE",29:"WHILE",30:"DO",31:"FOR",32:"ident",33:"IN",34:"CONST",36:"ASSIGN",37:"+",38:"-",39:"MATH",40:"COMP",41:"LOGIC",42:"DEF",44:"COMMA",45:"DOT",47:"NEW",50:"IDENT",51:"THIS",52:"NUMBER",53:"STRING",54:"TRUE",55:"FALSE",57:"LSQUARE",59:"RSQUARE",60:"CLASS",61:"EXTENDS"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[9,3],[8,1],[8,1],[10,1],[10,2],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,3],[15,4],[15,6],[15,5],[16,5],[17,7],[18,2],[18,4],[18,3],[19,2],[19,2],[19,3],[19,3],[19,3],[19,3],[19,3],[22,7],[43,0],[43,1],[43,3],[20,6],[20,4],[21,5],[46,0],[46,1],[46,3],[14,1],[14,1],[14,1],[35,1],[35,3],[48,1],[49,1],[49,1],[49,1],[49,1],[49,1],[56,3],[58,0],[58,1],[58,3],[23,4],[23,6]],
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
case 6:this.$ = new yy.Block($$[$0-1]);
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:this.$ = new yy.Comment($$[$0]);
break;
case 10:this.$ = new yy.Return($$[$0]);
break;
case 11:this.$ = $$[$0];
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
case 22:this.$ = new yy.If($$[$0-2], $$[$0-1], null);
break;
case 23:this.$ = new yy.If($$[$0-4], $$[$0-3], $$[$0-1]);
break;
case 24:this.$ = new yy.If($$[$0-3], $$[$0-2], $$[$0]);
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
case 30:this.$ = new yy.Operator($$[$0-1], null, $$[$0]);
break;
case 31:this.$ = new yy.Operator($$[$0-1], null, $$[$0]);
break;
case 32:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 33:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 34:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 35:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 36:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0]);
break;
case 37:this.$ = new yy.Function($$[$0-5], $$[$0-3], $$[$0-1]);
break;
case 38:this.$ = [];
break;
case 39:this.$ = [$$[$0]];
break;
case 40:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 41:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1]);
break;
case 42:this.$ = new yy.Call($$[$0-3], null, $$[$0-1]);
break;
case 43:this.$ = new yy.Create($$[$0-3], $$[$0-1]);
break;
case 44:this.$ = [];
break;
case 45:this.$ = [$$[$0]];
break;
case 46:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 47:this.$ = $$[$0];
break;
case 48:this.$ = $$[$0];
break;
case 49:this.$ = $$[$0];
break;
case 50:this.$ = new yy.Identifier($$[$0], 'local');
break;
case 51:this.$ = new yy.Identifier($$[$0], 'this');
break;
case 52:this.$ = new yy.Const($$[$0]);
break;
case 53:this.$ = new yy.Number($$[$0]);
break;
case 54:this.$ = new yy.String($$[$0]);
break;
case 55:this.$ = new yy.True($$[$0]);
break;
case 56:this.$ = new yy.False($$[$0]);
break;
case 57:this.$ = $$[$0];
break;
case 58:this.$ = new yy.List($$[$0-1])
break;
case 59:this.$ = []
break;
case 60:this.$ = [$$[$0]]
break;
case 61:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 62:this.$ = new yy.Class($$[$0-2], null, $$[$0-1]);
break;
case 63:this.$ = new yy.Class($$[$0-4], $$[$0-2], $$[$0-1]);
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,10:5,11:6,12:[1,7],13:[1,8],14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{1:[3]},{1:[2,1]},{4:[1,40],6:41,7:[1,42]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],45:[1,48]},{4:[2,9],7:[2,9]},{14:49,34:[1,51],35:50,48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39]},{4:[2,11],7:[2,11],25:[2,11],30:[2,11],37:[2,11],38:[2,11],39:[2,11],40:[2,11],41:[2,11],44:[2,11],45:[2,11],59:[2,11]},{4:[2,12],7:[2,12],25:[2,12],30:[2,12],37:[2,12],38:[2,12],39:[2,12],40:[2,12],41:[2,12],44:[2,12],45:[2,12],59:[2,12]},{4:[2,13],7:[2,13],25:[2,13],30:[2,13],37:[2,13],38:[2,13],39:[2,13],40:[2,13],41:[2,13],44:[2,13],45:[2,13],59:[2,13]},{4:[2,14],7:[2,14],25:[2,14],30:[2,14],37:[2,14],38:[2,14],39:[2,14],40:[2,14],41:[2,14],44:[2,14],45:[2,14],59:[2,14]},{4:[2,15],7:[2,15],25:[2,15],30:[2,15],37:[2,15],38:[2,15],39:[2,15],40:[2,15],41:[2,15],44:[2,15],45:[2,15],59:[2,15]},{4:[2,16],7:[2,16],25:[2,16],30:[2,16],37:[2,16],38:[2,16],39:[2,16],40:[2,16],41:[2,16],44:[2,16],45:[2,16],59:[2,16]},{4:[2,17],7:[2,17],25:[2,17],30:[2,17],37:[2,17],38:[2,17],39:[2,17],40:[2,17],41:[2,17],44:[2,17],45:[2,17],59:[2,17]},{4:[2,18],7:[2,18],25:[2,18],30:[2,18],37:[2,18],38:[2,18],39:[2,18],40:[2,18],41:[2,18],44:[2,18],45:[2,18],59:[2,18]},{4:[2,19],7:[2,19],25:[2,19],30:[2,19],37:[2,19],38:[2,19],39:[2,19],40:[2,19],41:[2,19],44:[2,19],45:[2,19],59:[2,19]},{4:[2,20],7:[2,20],25:[2,20],30:[2,20],37:[2,20],38:[2,20],39:[2,20],40:[2,20],41:[2,20],44:[2,20],45:[2,20],59:[2,20]},{11:52,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:53,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:54,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{32:[1,55]},{4:[2,52],7:[2,52],25:[2,52],30:[2,52],35:56,37:[2,52],38:[2,52],39:[2,52],40:[2,52],41:[2,52],44:[2,52],45:[2,52],50:[1,32],51:[1,33],59:[2,52]},{4:[2,47],7:[2,47],24:[1,58],25:[2,47],30:[2,47],36:[1,57],37:[2,47],38:[2,47],39:[2,47],40:[2,47],41:[2,47],44:[2,47],45:[2,47],59:[2,47]},{11:59,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:60,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{34:[1,61]},{35:62,50:[1,32],51:[1,33]},{34:[1,63]},{4:[2,48],7:[2,48],25:[2,48],30:[2,48],37:[2,48],38:[2,48],39:[2,48],40:[2,48],41:[2,48],44:[2,48],45:[2,48],59:[2,48]},{4:[2,49],7:[2,49],25:[2,49],30:[2,49],37:[2,49],38:[2,49],39:[2,49],40:[2,49],41:[2,49],44:[2,49],45:[2,49],59:[2,49]},{4:[2,50],7:[2,50],24:[2,50],25:[2,50],30:[2,50],36:[2,50],37:[2,50],38:[2,50],39:[2,50],40:[2,50],41:[2,50],44:[2,50],45:[2,50],59:[2,50]},{45:[1,64]},{4:[2,53],7:[2,53],25:[2,53],30:[2,53],37:[2,53],38:[2,53],39:[2,53],40:[2,53],41:[2,53],44:[2,53],45:[2,53],59:[2,53]},{4:[2,54],7:[2,54],25:[2,54],30:[2,54],37:[2,54],38:[2,54],39:[2,54],40:[2,54],41:[2,54],44:[2,54],45:[2,54],59:[2,54]},{4:[2,55],7:[2,55],25:[2,55],30:[2,55],37:[2,55],38:[2,55],39:[2,55],40:[2,55],41:[2,55],44:[2,55],45:[2,55],59:[2,55]},{4:[2,56],7:[2,56],25:[2,56],30:[2,56],37:[2,56],38:[2,56],39:[2,56],40:[2,56],41:[2,56],44:[2,56],45:[2,56],59:[2,56]},{4:[2,57],7:[2,57],25:[2,57],30:[2,57],37:[2,57],38:[2,57],39:[2,57],40:[2,57],41:[2,57],44:[2,57],45:[2,57],59:[2,57]},{11:66,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],44:[2,59],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],58:65,59:[2,59],60:[1,29]},{1:[2,2]},{8:67,10:5,11:6,12:[1,7],13:[1,8],14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{12:[2,3],13:[2,3],24:[2,3],26:[2,3],27:[2,3],28:[2,3],29:[2,3],31:[2,3],34:[2,3],37:[2,3],38:[2,3],42:[2,3],47:[2,3],50:[2,3],51:[2,3],52:[2,3],53:[2,3],54:[2,3],55:[2,3],57:[2,3],60:[2,3]},{11:68,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:69,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:70,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:71,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:72,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{35:73,50:[1,32],51:[1,33]},{4:[2,10],7:[2,10]},{4:[2,47],7:[2,47]},{4:[2,52],7:[2,52]},{25:[1,74],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],45:[1,48]},{6:76,7:[1,42],9:75,37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],45:[1,48]},{30:[1,77],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],45:[1,48]},{33:[1,78]},{4:[2,27],7:[2,27],25:[2,27],30:[2,27],36:[1,79],37:[2,27],38:[2,27],39:[2,27],40:[2,27],41:[2,27],44:[2,27],45:[2,27],59:[2,27]},{11:80,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:82,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],25:[2,44],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],44:[2,44],46:81,47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{4:[2,30],7:[2,30],25:[2,30],30:[2,30],37:[2,30],38:[2,30],39:[1,45],40:[1,46],41:[1,47],44:[2,30],45:[2,30],59:[2,30]},{4:[2,31],7:[2,31],25:[2,31],30:[2,31],37:[2,31],38:[2,31],39:[1,45],40:[1,46],41:[1,47],44:[2,31],45:[2,31],59:[2,31]},{24:[1,83]},{24:[1,84]},{6:76,7:[1,42],9:85,61:[1,86]},{50:[1,87]},{44:[1,89],59:[1,88]},{37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,60],45:[1,48],59:[2,60]},{4:[2,5],7:[2,5]},{4:[2,32],7:[2,32],25:[2,32],30:[2,32],37:[2,32],38:[2,32],39:[1,45],40:[1,46],41:[1,47],44:[2,32],45:[2,32],59:[2,32]},{4:[2,33],7:[2,33],25:[2,33],30:[2,33],37:[2,33],38:[2,33],39:[1,45],40:[1,46],41:[1,47],44:[2,33],45:[2,33],59:[2,33]},{4:[2,34],7:[2,34],25:[2,34],30:[2,34],37:[2,34],38:[2,34],39:[2,34],40:[1,46],41:[1,47],44:[2,34],45:[2,34],59:[2,34]},{4:[2,35],7:[2,35],25:[2,35],30:[2,35],37:[2,35],38:[2,35],39:[2,35],40:[2,35],41:[1,47],44:[2,35],45:[2,35],59:[2,35]},{4:[2,36],7:[2,36],25:[2,36],30:[2,36],37:[2,36],38:[2,36],39:[2,36],40:[2,36],41:[2,36],44:[2,36],45:[2,36],59:[2,36]},{24:[1,90]},{4:[2,21],7:[2,21],25:[2,21],30:[2,21],37:[2,21],38:[2,21],39:[2,21],40:[2,21],41:[2,21],44:[2,21],45:[2,21],59:[2,21]},{27:[1,91],28:[1,92]},{5:93,8:4,10:5,11:6,12:[1,7],13:[1,8],14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{6:76,7:[1,42],9:94},{11:95,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:96,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{4:[2,29],7:[2,29],25:[2,29],30:[2,29],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,29],45:[1,48],59:[2,29]},{25:[1,97],44:[1,98]},{25:[2,45],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,45],45:[1,48]},{11:82,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],25:[2,44],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],44:[2,44],46:99,47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{25:[2,38],35:101,43:100,44:[2,38],50:[1,32],51:[1,33]},{27:[1,102]},{34:[1,51],48:103},{4:[2,51],7:[2,51],24:[2,51],25:[2,51],30:[2,51],36:[2,51],37:[2,51],38:[2,51],39:[2,51],40:[2,51],41:[2,51],44:[2,51],45:[2,51],59:[2,51]},{4:[2,58],7:[2,58],25:[2,58],30:[2,58],37:[2,58],38:[2,58],39:[2,58],40:[2,58],41:[2,58],44:[2,58],45:[2,58],59:[2,58]},{11:104,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{11:82,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],25:[2,44],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],44:[2,44],46:105,47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{4:[2,22],7:[2,22],25:[2,22],30:[2,22],37:[2,22],38:[2,22],39:[2,22],40:[2,22],41:[2,22],44:[2,22],45:[2,22],59:[2,22]},{6:76,7:[1,42],9:106,15:107,26:[1,20]},{6:108,7:[1,42]},{27:[1,109]},{30:[1,110],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],45:[1,48]},{4:[2,28],7:[2,28],25:[2,28],30:[2,28],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,28],45:[1,48],59:[2,28]},{4:[2,42],7:[2,42],25:[2,42],30:[2,42],37:[2,42],38:[2,42],39:[2,42],40:[2,42],41:[2,42],44:[2,42],45:[2,42],59:[2,42]},{11:111,14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{25:[1,112],44:[1,98]},{25:[1,113],44:[1,114]},{25:[2,39],44:[2,39]},{4:[2,62],7:[2,62],25:[2,62],30:[2,62],37:[2,62],38:[2,62],39:[2,62],40:[2,62],41:[2,62],44:[2,62],45:[2,62],59:[2,62]},{6:76,7:[1,42],9:115},{37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,61],45:[1,48],59:[2,61]},{25:[1,116],44:[1,98]},{27:[1,117]},{4:[2,24],7:[2,24],25:[2,24],30:[2,24],37:[2,24],38:[2,24],39:[2,24],40:[2,24],41:[2,24],44:[2,24],45:[2,24],59:[2,24]},{8:67,10:5,11:6,12:[1,7],13:[1,8],14:18,15:9,16:10,17:11,18:12,19:13,20:14,21:15,22:16,23:17,24:[1,19],26:[1,20],27:[2,6],28:[2,6],29:[1,21],31:[1,22],34:[1,23],35:24,37:[1,25],38:[1,26],42:[1,28],47:[1,27],48:30,49:31,50:[1,32],51:[1,33],52:[1,34],53:[1,35],54:[1,36],55:[1,37],56:38,57:[1,39],60:[1,29]},{4:[2,25],7:[2,25],25:[2,25],30:[2,25],37:[2,25],38:[2,25],39:[2,25],40:[2,25],41:[2,25],44:[2,25],45:[2,25],59:[2,25]},{6:76,7:[1,42],9:118},{25:[2,46],37:[1,43],38:[1,44],39:[1,45],40:[1,46],41:[1,47],44:[2,46],45:[1,48]},{4:[2,43],7:[2,43],25:[2,43],30:[2,43],37:[2,43],38:[2,43],39:[2,43],40:[2,43],41:[2,43],44:[2,43],45:[2,43],59:[2,43]},{6:76,7:[1,42],9:119},{35:120,50:[1,32],51:[1,33]},{27:[1,121]},{4:[2,41],7:[2,41],25:[2,41],30:[2,41],37:[2,41],38:[2,41],39:[2,41],40:[2,41],41:[2,41],44:[2,41],45:[2,41],59:[2,41]},{4:[2,23],7:[2,23],25:[2,23],30:[2,23],37:[2,23],38:[2,23],39:[2,23],40:[2,23],41:[2,23],44:[2,23],45:[2,23],59:[2,23]},{27:[1,122]},{27:[1,123]},{25:[2,40],44:[2,40]},{4:[2,63],7:[2,63],25:[2,63],30:[2,63],37:[2,63],38:[2,63],39:[2,63],40:[2,63],41:[2,63],44:[2,63],45:[2,63],59:[2,63]},{4:[2,26],7:[2,26],25:[2,26],30:[2,26],37:[2,26],38:[2,26],39:[2,26],40:[2,26],41:[2,26],44:[2,26],45:[2,26],59:[2,26]},{4:[2,37],7:[2,37],25:[2,37],30:[2,37],37:[2,37],38:[2,37],39:[2,37],40:[2,37],41:[2,37],44:[2,37],45:[2,37],59:[2,37]}],
defaultActions: {2:[2,1],40:[2,2]},
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
  var Context = require('./runtime').Context;

function run(ast) {
  var context = new Context();

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