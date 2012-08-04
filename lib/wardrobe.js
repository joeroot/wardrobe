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
  var character = 0;
  var i = 0;

  //source = source.replace(/(\n|\r)+/g, '\n');

  while (i < source.length) {
    var chunk = source.slice(i, source.length);
    var value = null;
    
    if (chunk[0] == '.') {
      value = chunk[0];
      tokens.push(['DOT', value, line, character]);
      character = character + 1;
      i = i + 1;
    }
    // Comments
    else if ((value = chunk.match(/#[^(\n|\r)]*/)) && value.index=== 0) {
      value = value[0]; 
      tokens.push(["COMMENT", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Keywords and identifiers
    else if ((value = chunk.match(/[a-z]\w*/)) && value.index === 0) {
      value = value[0];
      if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line, character]);}
      else if (keywords.indexOf(value) >= 0) {tokens.push([value.toUpperCase(), value, line, character]);}
      else {tokens.push(["IDENT", value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Constants
    else if ((value = chunk.match(/[A-Z]\w*/)) && value.index === 0) {
      value = value[0];
      tokens.push(["CONST", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Grammatical symbols
    else if ((value = chunk.match(/\:|\(|\)|\,|\[|\]/)) && value.index === 0) {
      value = value[0];
      if (value == '(') {tokens.push(['LPAREN', value, line, character]);}
      else if (value == ')') {tokens.push(['RPAREN', value, line, character]);}
      else if (value == '[') {tokens.push(['LSQUARE', value, line, character]);}
      else if (value == ']') {tokens.push(['RSQUARE', value, line, character]);}
      else if (value == ',') {tokens.push(['COMMA', value, line, character]);}
      else if (value == ':') {tokens.push(['COLON', value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Operators
    else if ((value = chunk.match(/\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*/)) && value.index === 0) {
      value = value[0];
      if (operator.indexOf(value) >= 0) {tokens.push([value, value, line, character]);}
      else if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line, character]);}
      else if (math.indexOf(value) >= 0) {tokens.push(['MATH', value, line, character]);}
      else if (comparators.indexOf(value) >= 0) {tokens.push(['COMP', value, line, character]);}
      else if (assign.indexOf(value) >= 0) {tokens.push(['ASSIGN', value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Numbers
    else if ((value = chunk.match(/[0-9]+(\.[0-9]+)?/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NUMBER", value, line]);
      character = character + value.length;
      i = i + value.length;
    }
    // Strings
    else if ((value = chunk.match(/"(.*?)"/)) && value.index === 0) {
      value = value[0];
      tokens.push(["STRING", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Newlines
    else if ((value = chunk.match(/((\s)*\n|(\s)*\r)+/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NEWLINE", value, line, character]);
      line = line + value.replace(/ /g, '').length;
      character = 0;
      i = i + value.length;
    }
    else {
      //console.error("Unmatched: " + escape(value[0]));
      character = character + 1;
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

var error = require('./error');

/**
 * Initialises a new runtime environment
 *
 * @param {WardrobeObject} obj initial current object
 * @param {WardrobeClass} cls intial current class
 */
var WardrobeRuntime = function() { 
  this.classes = {};
  this.methods = {};
  this.globals = {};
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

WardrobeRuntime.prototype.addMethod = function(method) {
  this.methods[method.name] = method;
  return method;
};

WardrobeRuntime.prototype.createMethod = function(name, params, body) {
  var method = new WardrobeMethod(name, params, body);
  this.addMethod(method);
  return method;
};

WardrobeRuntime.prototype.getMethod = function(name) {
  var method = null;
  if (this.methods[name] !== undefined && typeof(this.methods[name]) == 'object') {
    method = this.methods[name];
  }
  return method;
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
  for (var name in this.locals) {
    var local = this.getLocal(name);
    clone.addLocal(name, local.type, local.object);
  }
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
  if (method !== null) {
    method.call(context, this, args);
  } else {
    throw new error.WardrobeNoMethodError(context, name);
  }
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
    method = this.methods[name];
  } else if (this.hasSuperClass()) {
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

WardrobeClass.prototype.newObject = function(args) {
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
  var param, name, type, arg;
  
  for (var p = 0; p < this.params.length; p++) {
    param = this.params[p];
    name = param.identifier.name;
    type = Runtime.getClass(param.type.name);
    arg = args[name] || args.unary;
    context.addLocal(name, type, arg);
  }

  context.setCurrentObject(receiver);
  context = this.body.evaluate(context); 

  for (p = 0; p < this.params.length; p++) {
    name = this.params[p].identifier.name;
    if (old_context.getLocal(name) !== undefined) {
      context.setLocalType(name, old_context.getLocalType(name));
      context.setLocalObject(name, old_context.getLocalObject(name));
    } else {
      delete context.deleteLocal(name);
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
      var object = Runtime.getClass('String').newObject(receiver.toString());
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
}

WardrobeString.prototype.newObject = function(string) {
  return new WardrobeObject(this, string);
};

WardrobeString.prototype.installMethods = function() {
  this.methods.length = new WardrobeMethod(
    'length', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').newObject(receiver.value.length);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.concat = new WardrobeMethod(
    'concat',
    [{type: {name: 'String'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('String').newObject(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{type: {name: 'String'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
};

WardrobeNumber.prototype = new WardrobeClass();
WardrobeNumber.prototype.constructor = WardrobeNumber;
function WardrobeNumber() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'Number';
  this.super_class = Runtime.getClass('Object');
  this.methods = {};
}

WardrobeNumber.prototype.newObject = function(argument) {
  return new WardrobeObject(this, argument);
};

WardrobeNumber.prototype.installMethods = function() {
  this.methods.add = new WardrobeMethod(
    'add', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.subtract = new WardrobeMethod(
    'subtract', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value - right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.divide = new WardrobeMethod(
    'divide', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value / right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.multiply = new WardrobeMethod(
    'multiply',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value * right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.greaterThan= new WardrobeMethod(
    'greaterThan',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value > right.value).toString());
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
}

WardrobeTrue.prototype.installMethods = function() {
  this.methods.and = new WardrobeMethod(
    'and',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
};

WardrobeTrue.prototype.newObject = function() {
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
}

WardrobeFalse.prototype.newObject = function() {
  return new WardrobeObject(this, false);
};

WardrobeFalse.prototype.installMethods = function() {
  this.methods.and = new WardrobeMethod(
    'and',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('false'));
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context, receiver, args) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
};

WardrobeList.prototype = new WardrobeClass();
WardrobeList.prototype.constructor = WardrobeList;
function WardrobeList() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'List';
  this.super_class = Runtime.getClass('Object');
  this.methods = {}; 
}

WardrobeList.prototype.installMethods = function() {
  this.methods.length = new WardrobeMethod(
    'length',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').newObject(receiver.value.length);
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
    [{type: {name: 'List'}, identifier: {name: 'right'}}],
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
    [{type: {name: 'Object'}, identifier: {name: 'item'}}],
    {evaluate: function(context) {
      var item = context.getLocalObject('item');
      context.getCurrentObject().value.push(item);
      context.setReturnObject(item);
      return context;
    }}
  );
  this.methods.get = new WardrobeMethod(
    'get',
    [{type: {name: 'Number'}, identifier: {name: 'index'}}],
    {evaluate: function(context) {
      var index = context.getLocalObject('index');
      context.setReturnObject(context.getCurrentObject().value[index.value]);
      return context;
    }}
  );
  this.methods.indexOf = new WardrobeMethod(
    'indexOf',
    [{type: {name: 'Object'}, identifier: {name: 'item'}}],
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
      context.setReturnObject(Runtime.getClass('Number').newObject(index));
      return context;
    }}
  );
};

WardrobeList.prototype.toString = function() {
  return '[' + this.value + ']'; 
};

WardrobeList.prototype.newObject = function(list) {
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
}

WardrobeSystem.prototype.installMethods = function() {
  this.methods.print = new WardrobeMethod(
    'print',
    [{type: {name: 'Object'}, identifier: {name: 'object'}}],
    {evaluate: function(context) {
      var obj = context.getLocalObject('object').value;
      if (typeof(window) != 'undefined') {
        logToConsole(obj);
      }
      console.log(obj.toString());
      return context;
    }}
  );
};

WardrobeSystem.prototype.newObject = function() {
  return new WardrobeObject(this, null);
};

var wardrobe_class = new WardrobeClass('Class', null);
wardrobe_class.cls = wardrobe_class;

var wardrobe_object_class = new WardrobeObjectClass();
wardrobe_object_class.cls = wardrobe_class;

wardrobe_class.setSuperClass(wardrobe_object_class);

var Runtime = new WardrobeRuntime();

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
Runtime.getClass('String').installMethods();
Runtime.getClass('Number').installMethods();
Runtime.getClass('List').installMethods();
Runtime.getClass('TrueBoolean').installMethods();
Runtime.getClass('FalseBoolean').installMethods();
Runtime.getClass('System').installMethods();

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').newObject());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').newObject());
Runtime.addGlobal('system', Runtime.getClass('System').newObject());

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
  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error) {
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

}
require['./parser'] = new function() {
  var exports = this;
  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"block":9,"statement":10,"expression":11,"COMMENT":12,"RETURN":13,"declare":14,"constant":15,"identifier":16,"bracketed":17,"value":18,"assign":19,"literal":20,"class":21,"function":22,"call":23,"create":24,"operation":25,"if":26,"while":27,"LPAREN":28,"RPAREN":29,"assignable":30,"const":31,"this":32,"ASSIGN":33,"property":34,"IDENT":35,"DOT":36,"list_accessor":37,"LSQUARE":38,"RSQUARE":39,"CONST":40,"NUMBER":41,"STRING":42,"TRUE":43,"FALSE":44,"list":45,"list_items":46,"COMMA":47,"THIS":48,"CLASS":49,"END":50,"EXTENDS":51,"DEF":52,"params":53,"arguments":54,"NEW":55,"unary_argument":56,"named_arguments":57,"COLON":58,"+":59,"-":60,"MATH":61,"COMP":62,"LOGIC":63,"IF":64,"ELSE":65,"WHILE":66,"DO":67,"for":68,"FOR":69,"IN":70,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",12:"COMMENT",13:"RETURN",28:"LPAREN",29:"RPAREN",31:"const",33:"ASSIGN",35:"IDENT",36:"DOT",38:"LSQUARE",39:"RSQUARE",40:"CONST",41:"NUMBER",42:"STRING",43:"TRUE",44:"FALSE",47:"COMMA",48:"THIS",49:"CLASS",50:"END",51:"EXTENDS",52:"DEF",55:"NEW",58:"COLON",59:"+",60:"-",61:"MATH",62:"COMP",63:"LOGIC",64:"IF",65:"ELSE",66:"WHILE",67:"DO",69:"FOR",70:"IN"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[9,3],[8,1],[8,1],[10,1],[10,2],[10,1],[14,2],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[17,3],[18,1],[18,1],[18,1],[19,3],[19,3],[30,1],[30,1],[16,1],[34,3],[37,4],[15,1],[20,1],[20,1],[20,1],[20,1],[20,1],[45,3],[46,0],[46,1],[46,3],[32,1],[21,4],[21,6],[22,7],[22,8],[53,0],[53,2],[53,4],[23,6],[23,4],[24,5],[54,1],[54,1],[56,1],[57,0],[57,3],[57,5],[25,2],[25,2],[25,3],[25,3],[25,3],[25,3],[25,3],[26,4],[26,6],[26,5],[27,5],[68,7],[68,7]],
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
case 6:this.$ = new yy.Block($$[$0-1], this._$, yytext);
break;
case 7:this.$ = $$[$0];
break;
case 8:this.$ = $$[$0];
break;
case 9:this.$ = new yy.Comment($$[$0], this._$, yytext);
break;
case 10:this.$ = new yy.Return($$[$0], this._$, yytext);
break;
case 11:this.$ = $$[$0];
break;
case 12:this.$ = new yy.Declare($$[$0-1], $$[$0], this._$, yytext);
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
case 22:this.$ = $$[$0];
break;
case 23:this.$ = $$[$0];
break;
case 24:this.$ = $$[$0];
break;
case 25:this.$ = $$[$0-1];
break;
case 26:this.$ = $$[$0];
break;
case 27:this.$ = $$[$0];
break;
case 28:this.$ = $$[$0];
break;
case 29:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 30:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 31:this.$ = $$[$0];
break;
case 32:this.$ = $$[$0];
break;
case 33:this.$ = new yy.Identifier($$[$0], this._$, yytext);
break;
case 34:this.$ = new yy.Property($$[$0-2], $$[$0], this._$, yytext);
break;
case 35:this.$ = new yy.ListAccessor($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 36:this.$ = new yy.Constant($$[$0], this._$, yytext);
break;
case 37:this.$ = new yy.Number($$[$0], this._$, yytext);
break;
case 38:this.$ = new yy.String($$[$0], this._$, yytext);
break;
case 39:this.$ = new yy.True(this._$, yytext);
break;
case 40:this.$ = new yy.False(this._$, yytext);
break;
case 41:this.$ = $$[$0];
break;
case 42:this.$ = new yy.List($$[$0-1])
break;
case 43:this.$ = []
break;
case 44:this.$ = [$$[$0]]
break;
case 45:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 46:this.$ = new yy.This(this._$, yytext);
break;
case 47:this.$ = new yy.Class($$[$0-2], null, $$[$0-1], this._$, yytext);
break;
case 48:this.$ = new yy.Class($$[$0-4], $$[$0-2], $$[$0-1], this._$, yytext);
break;
case 49:this.$ = new yy.Function(null, $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 50:this.$ = new yy.Function($$[$0-6], $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 51:this.$ = [];
break;
case 52:this.$ = [new yy.Param($$[$0-1], $$[$0])];
break;
case 53:this.$ = $$[$0-3]; $$[$0-3].push(new yy.Param($$[$0-1], $$[$0], this._$, yytext));
break;
case 54:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 55:this.$ = new yy.Call($$[$0-3], null, $$[$0-1], this._$, yytext);
break;
case 56:this.$ = new yy.Create($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 57:this.$ = $$[$0];
break;
case 58:this.$ = $$[$0];
break;
case 59:this.$ = [new yy.Argument(new yy.Identifier('unary'), $$[$0])];
break;
case 60:this.$ = [];
break;
case 61:this.$ = [new yy.Argument($$[$0-2], $$[$0])];
break;
case 62:this.$ = $$[$0-4]; $$[$0-4].push(new yy.Argument($$[$0-2], $$[$0], this._$, yytext));
break;
case 63:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 64:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 65:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 66:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 67:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 68:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 69:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 70:this.$ = new yy.If($$[$0-2], $$[$0-1], null, this._$, yytext);
break;
case 71:this.$ = new yy.If($$[$0-4], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 72:this.$ = new yy.If($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 73:this.$ = new yy.While($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 74:
break;
case 75:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{1:[3]},{1:[2,1]},{4:[1,44],6:45,7:[1,46]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{4:[2,9],7:[2,9]},{11:53,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,11],7:[2,11],33:[1,55]},{4:[2,13],7:[2,13],29:[2,13],36:[2,13],39:[2,13],47:[2,13],59:[2,13],60:[2,13],61:[2,13],62:[2,13],63:[2,13],67:[2,13]},{4:[2,14],7:[2,14],29:[2,14],36:[2,14],39:[2,14],47:[2,14],59:[2,14],60:[2,14],61:[2,14],62:[2,14],63:[2,14],67:[2,14]},{4:[2,15],7:[2,15],29:[2,15],36:[2,15],39:[2,15],47:[2,15],59:[2,15],60:[2,15],61:[2,15],62:[2,15],63:[2,15],67:[2,15]},{4:[2,16],7:[2,16],29:[2,16],36:[2,16],39:[2,16],47:[2,16],59:[2,16],60:[2,16],61:[2,16],62:[2,16],63:[2,16],67:[2,16]},{4:[2,17],7:[2,17],16:56,29:[2,17],35:[1,43],36:[2,17],39:[2,17],47:[2,17],59:[2,17],60:[2,17],61:[2,17],62:[2,17],63:[2,17],67:[2,17]},{4:[2,18],7:[2,18],29:[2,18],36:[2,18],39:[2,18],47:[2,18],59:[2,18],60:[2,18],61:[2,18],62:[2,18],63:[2,18],67:[2,18]},{4:[2,19],7:[2,19],29:[2,19],36:[2,19],39:[2,19],47:[2,19],59:[2,19],60:[2,19],61:[2,19],62:[2,19],63:[2,19],67:[2,19]},{4:[2,20],7:[2,20],29:[2,20],36:[2,20],39:[2,20],47:[2,20],59:[2,20],60:[2,20],61:[2,20],62:[2,20],63:[2,20],67:[2,20]},{4:[2,21],7:[2,21],29:[2,21],36:[2,21],39:[2,21],47:[2,21],59:[2,21],60:[2,21],61:[2,21],62:[2,21],63:[2,21],67:[2,21]},{4:[2,22],7:[2,22],29:[2,22],36:[2,22],39:[2,22],47:[2,22],59:[2,22],60:[2,22],61:[2,22],62:[2,22],63:[2,22],67:[2,22]},{4:[2,23],7:[2,23],29:[2,23],36:[2,23],39:[2,23],47:[2,23],59:[2,23],60:[2,23],61:[2,23],62:[2,23],63:[2,23],67:[2,23]},{4:[2,24],7:[2,24],29:[2,24],36:[2,24],39:[2,24],47:[2,24],59:[2,24],60:[2,24],61:[2,24],62:[2,24],63:[2,24],67:[2,24]},{11:57,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,26],7:[2,26],29:[2,26],33:[1,58],36:[2,26],39:[2,26],47:[2,26],59:[2,26],60:[2,26],61:[2,26],62:[2,26],63:[2,26],67:[2,26]},{4:[2,27],7:[2,27],29:[2,27],36:[2,27],39:[2,27],47:[2,27],59:[2,27],60:[2,27],61:[2,27],62:[2,27],63:[2,27],67:[2,27]},{4:[2,28],7:[2,28],29:[2,28],36:[2,28],39:[2,28],47:[2,28],59:[2,28],60:[2,28],61:[2,28],62:[2,28],63:[2,28],67:[2,28]},{4:[2,37],7:[2,37],29:[2,37],36:[2,37],39:[2,37],47:[2,37],59:[2,37],60:[2,37],61:[2,37],62:[2,37],63:[2,37],67:[2,37]},{4:[2,38],7:[2,38],29:[2,38],36:[2,38],39:[2,38],47:[2,38],59:[2,38],60:[2,38],61:[2,38],62:[2,38],63:[2,38],67:[2,38]},{4:[2,39],7:[2,39],29:[2,39],36:[2,39],39:[2,39],47:[2,39],59:[2,39],60:[2,39],61:[2,39],62:[2,39],63:[2,39],67:[2,39]},{4:[2,40],7:[2,40],29:[2,40],36:[2,40],39:[2,40],47:[2,40],59:[2,40],60:[2,40],61:[2,40],62:[2,40],63:[2,40],67:[2,40]},{4:[2,41],7:[2,41],29:[2,41],36:[2,41],39:[2,41],47:[2,41],59:[2,41],60:[2,41],61:[2,41],62:[2,41],63:[2,41],67:[2,41]},{4:[2,36],7:[2,36],28:[2,36],29:[2,36],35:[2,36],36:[2,36],39:[2,36],47:[2,36],51:[2,36],59:[2,36],60:[2,36],61:[2,36],62:[2,36],63:[2,36],67:[2,36]},{15:59,40:[1,31]},{15:61,16:60,35:[1,43],40:[1,31]},{4:[2,31],7:[2,31],28:[1,62],29:[2,31],33:[2,31],36:[2,31],39:[2,31],47:[2,31],59:[2,31],60:[2,31],61:[2,31],62:[2,31],63:[2,31],67:[2,31]},{15:63,40:[1,31]},{11:64,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:65,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:66,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:67,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,32],7:[2,32],29:[2,32],33:[2,32],36:[2,32],39:[2,32],47:[2,32],59:[2,32],60:[2,32],61:[2,32],62:[2,32],63:[2,32],67:[2,32]},{4:[2,46],7:[2,46],29:[2,46],36:[2,46],39:[2,46],47:[2,46],59:[2,46],60:[2,46],61:[2,46],62:[2,46],63:[2,46],67:[2,46]},{11:69,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],39:[2,43],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,46:68,47:[2,43],48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,33],7:[2,33],28:[2,33],29:[2,33],33:[2,33],36:[2,33],39:[2,33],47:[2,33],58:[2,33],59:[2,33],60:[2,33],61:[2,33],62:[2,33],63:[2,33],67:[2,33]},{1:[2,2]},{8:70,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{12:[2,3],13:[2,3],28:[2,3],31:[2,3],35:[2,3],38:[2,3],40:[2,3],41:[2,3],42:[2,3],43:[2,3],44:[2,3],48:[2,3],49:[2,3],50:[2,3],52:[2,3],55:[2,3],59:[2,3],60:[2,3],64:[2,3],65:[2,3],66:[2,3]},{16:71,35:[1,43]},{11:72,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:73,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:74,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:75,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:76,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,10],7:[2,10],36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{33:[1,55]},{11:77,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,12],7:[2,12],33:[2,12]},{29:[1,78],36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{11:79,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{6:82,7:[1,46],9:80,51:[1,81]},{28:[1,83]},{16:84,35:[1,43]},{11:88,14:54,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],29:[2,60],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,47:[2,60],48:[1,41],49:[1,32],52:[1,33],54:85,55:[1,35],56:86,57:87,59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{28:[1,90]},{4:[2,63],7:[2,63],29:[2,63],36:[2,63],39:[2,63],47:[2,63],59:[2,63],60:[2,63],61:[1,50],62:[1,51],63:[1,52],67:[2,63]},{4:[2,64],7:[2,64],29:[2,64],36:[2,64],39:[2,64],47:[2,64],59:[2,64],60:[2,64],61:[1,50],62:[1,51],63:[1,52],67:[2,64]},{6:82,7:[1,46],9:91,36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52],67:[1,92]},{39:[1,93],47:[1,94]},{36:[1,47],39:[2,44],47:[2,44],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{4:[2,5],7:[2,5]},{4:[2,34],7:[2,34],28:[1,95],29:[2,34],33:[2,34],36:[2,34],39:[2,34],47:[2,34],59:[2,34],60:[2,34],61:[2,34],62:[2,34],63:[2,34],67:[2,34]},{4:[2,65],7:[2,65],29:[2,65],36:[2,65],39:[2,65],47:[2,65],59:[2,65],60:[2,65],61:[1,50],62:[1,51],63:[1,52],67:[2,65]},{4:[2,66],7:[2,66],29:[2,66],36:[2,66],39:[2,66],47:[2,66],59:[2,66],60:[2,66],61:[1,50],62:[1,51],63:[1,52],67:[2,66]},{4:[2,67],7:[2,67],29:[2,67],36:[2,67],39:[2,67],47:[2,67],59:[2,67],60:[2,67],61:[2,67],62:[1,51],63:[1,52],67:[2,67]},{4:[2,68],7:[2,68],29:[2,68],36:[2,68],39:[2,68],47:[2,68],59:[2,68],60:[2,68],61:[2,68],62:[2,68],63:[1,52],67:[2,68]},{4:[2,69],7:[2,69],29:[2,69],36:[2,69],39:[2,69],47:[2,69],59:[2,69],60:[2,69],61:[2,69],62:[2,69],63:[2,69],67:[2,69]},{4:[2,29],7:[2,29],29:[2,29],36:[1,47],39:[2,29],47:[2,29],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52],67:[2,29]},{4:[2,25],7:[2,25],29:[2,25],36:[2,25],39:[2,25],47:[2,25],59:[2,25],60:[2,25],61:[2,25],62:[2,25],63:[2,25],67:[2,25]},{4:[2,30],7:[2,30],29:[2,30],36:[1,47],39:[2,30],47:[2,30],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52],67:[2,30]},{50:[1,96]},{15:97,40:[1,31]},{5:98,8:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{15:100,29:[2,51],40:[1,31],47:[2,51],53:99},{28:[1,101]},{29:[1,102]},{29:[2,57]},{29:[2,58],47:[1,103]},{29:[2,59],36:[1,47],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{28:[1,62],29:[2,31],33:[2,31],36:[2,31],58:[1,104],59:[2,31],60:[2,31],61:[2,31],62:[2,31],63:[2,31]},{11:88,14:54,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],29:[2,60],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,47:[2,60],48:[1,41],49:[1,32],52:[1,33],54:105,55:[1,35],56:86,57:87,59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{50:[1,106],65:[1,107]},{6:82,7:[1,46],9:108},{4:[2,42],7:[2,42],29:[2,42],36:[2,42],39:[2,42],47:[2,42],59:[2,42],60:[2,42],61:[2,42],62:[2,42],63:[2,42],67:[2,42]},{11:109,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{11:88,14:54,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],29:[2,60],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,47:[2,60],48:[1,41],49:[1,32],52:[1,33],54:110,55:[1,35],56:86,57:87,59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,47],7:[2,47],29:[2,47],36:[2,47],39:[2,47],47:[2,47],59:[2,47],60:[2,47],61:[2,47],62:[2,47],63:[2,47],67:[2,47]},{6:82,7:[1,46],9:111},{6:112,7:[1,46]},{29:[1,113],47:[1,114]},{16:115,35:[1,43]},{15:100,29:[2,51],40:[1,31],47:[2,51],53:116},{4:[2,55],7:[2,55],29:[2,55],36:[2,55],39:[2,55],47:[2,55],59:[2,55],60:[2,55],61:[2,55],62:[2,55],63:[2,55],67:[2,55]},{16:117,35:[1,43]},{11:118,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{29:[1,119]},{4:[2,70],7:[2,70],29:[2,70],36:[2,70],39:[2,70],47:[2,70],59:[2,70],60:[2,70],61:[2,70],62:[2,70],63:[2,70],67:[2,70]},{6:82,7:[1,46],9:120,26:121,64:[1,38]},{50:[1,122]},{36:[1,47],39:[2,45],47:[2,45],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{29:[1,123]},{50:[1,124]},{8:70,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],50:[2,6],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],65:[2,6],66:[1,39]},{6:82,7:[1,46],9:125},{15:126,40:[1,31]},{29:[2,52],47:[2,52]},{29:[1,127],47:[1,114]},{58:[1,128]},{29:[2,61],36:[1,47],47:[2,61],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{4:[2,56],7:[2,56],29:[2,56],36:[2,56],39:[2,56],47:[2,56],59:[2,56],60:[2,56],61:[2,56],62:[2,56],63:[2,56],67:[2,56]},{50:[1,129]},{4:[2,72],7:[2,72],29:[2,72],36:[2,72],39:[2,72],47:[2,72],59:[2,72],60:[2,72],61:[2,72],62:[2,72],63:[2,72],67:[2,72]},{4:[2,73],7:[2,73],29:[2,73],36:[2,73],39:[2,73],47:[2,73],59:[2,73],60:[2,73],61:[2,73],62:[2,73],63:[2,73],67:[2,73]},{4:[2,54],7:[2,54],29:[2,54],36:[2,54],39:[2,54],47:[2,54],59:[2,54],60:[2,54],61:[2,54],62:[2,54],63:[2,54],67:[2,54]},{4:[2,48],7:[2,48],29:[2,48],36:[2,48],39:[2,48],47:[2,48],59:[2,48],60:[2,48],61:[2,48],62:[2,48],63:[2,48],67:[2,48]},{50:[1,130]},{16:131,35:[1,43]},{6:82,7:[1,46],9:132},{11:133,14:54,15:14,16:34,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:[1,22],30:23,31:[1,24],32:25,34:40,35:[1,43],38:[1,42],40:[1,31],41:[1,26],42:[1,27],43:[1,28],44:[1,29],45:30,48:[1,41],49:[1,32],52:[1,33],55:[1,35],59:[1,36],60:[1,37],64:[1,38],66:[1,39]},{4:[2,71],7:[2,71],29:[2,71],36:[2,71],39:[2,71],47:[2,71],59:[2,71],60:[2,71],61:[2,71],62:[2,71],63:[2,71],67:[2,71]},{4:[2,49],7:[2,49],29:[2,49],36:[2,49],39:[2,49],47:[2,49],59:[2,49],60:[2,49],61:[2,49],62:[2,49],63:[2,49],67:[2,49]},{29:[2,53],47:[2,53]},{50:[1,134]},{29:[2,62],36:[1,47],47:[2,62],59:[1,48],60:[1,49],61:[1,50],62:[1,51],63:[1,52]},{4:[2,50],7:[2,50],29:[2,50],36:[2,50],39:[2,50],47:[2,50],59:[2,50],60:[2,50],61:[2,50],62:[2,50],63:[2,50],67:[2,50]}],
defaultActions: {2:[2,1],44:[2,2],86:[2,57]},
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
    if (error.is_wardrobe_error) {
      switch (error.error) {
        default: 
          console.log(error);
          context = error.context;
          break;
      }
    } else {
      throw error;
    }
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

function run(source, debug) {
  var tokens = lexer.lex(source);
  if (debug) {
    console.log('Lexer finished, tokens: \n');
    console.log(tokens);
  }

  parser.yy = nodes; 
  parser.lexer =  {
    "lex": function() {
      var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF', '', 0, 0];
      this.yytext = token[1];
      this.yylineno = token[2];
      this.yyleng = this.yytext.length;
      this.yylloc = {
        first_line: this.yylineno, 
        last_line: this.yylineno, 
        first_column: token[3], 
        last_column: token[3] + this.yyleng
      };
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
  if (debug) {
    console.log('\nParser finished, abstract syntax tree: \n');
    console.log(ast);

    console.log("\nIntepreting code, output: \n");
  }
  context = interpreter.run(ast);
  if (debug) {
    console.log('\nIntepreter finished, final context:\n');
    console.log(context);
  }
  return context;
}

exports.run = run;
}
    return require['./wardrobe'];  }();    if (typeof define === 'function' && define.amd) {      define(function() { return Wardrobe; });    } else {      root.Wardrobe = Wardrobe;     }  }(this));