function logToConsole(x) {
  print(x);
}
(function(root) {
  var Wardrobe = function() {
    function require(path){ return require[path]; }require['./errors/syntaxerror'] = new function() {
  var exports = this;
  var WardrobeSyntaxError = function(hash, token) {
  this.kind = 'Syntax';
  this.hash = hash;
  this.token = token;
};

WardrobeSyntaxError.prototype.is_wardrobe_error =  true;
WardrobeSyntaxError.prototype.toString = function() {
  str = this.hash.line + ': Syntax error, expecting ';
  for (var i = 0; i < this.hash.expected.length; i++) {
    if (i == this.hash.expected.length - 1) {
      str += ' or ';
    } else if (i !== 0) {
      str += ', ';
    }
    str += this.hash.expected[i].toLowerCase();
  }
  str += ', not ' + this.token[1];
  return str + ".";
};

WardrobeSyntaxError.prototype.getStartColumn = function() {return this.token[3];};
WardrobeSyntaxError.prototype.getEndColumn = function() {return this.token[3] + this.token[1].length;};
WardrobeSyntaxError.prototype.getStartLine = function() {return this.token[2];};
WardrobeSyntaxError.prototype.getEndLine = function() {return this.token[2];};

exports.WardrobeSyntaxError = WardrobeSyntaxError;
}
require['./syntaxerror'] = require['./errors/syntaxerror'];
require['./errors/runtimeerror'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = function(kind) {
  this.kind = kind;
  this.is_wardrobe_error = true;
};

WardrobeRuntimeError.prototype.errorString = function() {return "An error has occured.";};
WardrobeRuntimeError.prototype.addToStack = function(node) {this.stack.push(node);};
WardrobeRuntimeError.prototype.getStack = function() {return this.stack;};
WardrobeRuntimeError.prototype.stackToString = function() {
  var str = "";
  for (var i = 1; i < this.stack.length; i++) {
    str += '\n' + this.stack[i].getStartLine() + ", " + this.stack[i].getStartColumn() + ': ' + this.stack[i].kind;
  }
  return str;
};


WardrobeRuntimeError.prototype.getStartColumn = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getStartColumn();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getEndColumn = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getEndColumn();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getStartLine = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getStartLine();
  } 
  return start;
};

WardrobeRuntimeError.prototype.getEndLine = function() {
  var start = 0;
  if (this.stack.length > 0) {
    start = this.stack[0].getEndLine();
  } 
  return start;
};

exports.WardrobeRuntimeError = WardrobeRuntimeError;
}
require['./runtimeerror'] = require['./errors/runtimeerror'];
require['./errors/missingarguments'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeMissingArgumentsError.prototype = new WardrobeRuntimeError('MissingArguments');
WardrobeMissingArgumentsError.prototype.constructor = WardrobeMissingArgumentsError;
function WardrobeMissingArgumentsError(context, receiver, missing_params) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
  this.missing_params = missing_params;
}

WardrobeMissingArgumentsError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "Missing argument(s) for the parameter(s) ";
  for (var p = 0; p < this.missing_params.length; p++) {
    var param = this.missing_params[p];
    str += param.identifier.name;
    if (p < this.missing_params.length - 1) {str += ", ";}
  }
  str += " when calling " + this.stack[0].identifier.name;
  if (this.receiver !== null) {
    str += " on an object of class " + this.receiver.cls.name + ".";
  } else {
    str += ".";
  }
   
  str += this.stackToString();
  return str;
};

exports.WardrobeMissingArgumentsError = WardrobeMissingArgumentsError;
}
require['./missingarguments'] = require['./errors/missingarguments'];
require['./errors/nosuchparam'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchParameterError.prototype = new WardrobeRuntimeError('NoSuchParameter');
WardrobeNoSuchParameterError.prototype.constructor = WardrobeNoSuchParameterError;
function WardrobeNoSuchParameterError(context, receiver, incorrect_params) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
  this.incorrect_params = incorrect_params;
}

WardrobeNoSuchParameterError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No such parameter(s) ";
  for (var p = 0; p < this.incorrect_params.length; p++) {
    var param = this.incorrect_params[p];
    str += param;
    if (p < this.incorrect_params.length - 1) {str += ", ";}
  }
  str += " when calling " + this.stack[0].identifier.name;
  if (this.receiver !== null) {
    str += " on an object of class " + this.receiver.cls.name + ".";
  } else {
    str += ".";
  }
   
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchParameterError = WardrobeNoSuchParameterError;
}
require['./nosuchparam'] = require['./errors/nosuchparam'];
require['./errors/nosuchmethod'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchMethodError.prototype = new WardrobeRuntimeError('NoSuchMethod');
WardrobeNoSuchMethodError.prototype.constructor = WardrobeNoSuchMethodError;
function WardrobeNoSuchMethodError(context, receiver) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
}

WardrobeNoSuchMethodError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No method " + this.stack[0].identifier.name + " ";
  if (this.receiver !== null) {
    str += "for objects of class " + this.receiver.cls.name + ".";
  } else {
    str += "has been defined globally.";
  }
  for (var i = 1; i < this.stack.length; i++) {
    str += '\n' + this.stack[i].getStartLine() + ': ' + this.stack[i].kind;
  }
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchMethodError = WardrobeNoSuchMethodError;
}
require['./nosuchmethod'] = require['./errors/nosuchmethod'];
require['./errors/undeclaredpropertyorvariable'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeUndeclaredPropertyOrVariable.prototype = new WardrobeRuntimeError('UndeclaredPropertyOrVariable');
WardrobeUndeclaredPropertyOrVariable.prototype.constructor = WardrobeUndeclaredPropertyOrVariable;
function WardrobeUndeclaredPropertyOrVariable(context, receiver) {
  this.stack = [];
  this.context = context;
  this.receiver = receiver;
}

WardrobeUndeclaredPropertyOrVariable.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  if (this.stack[0].kind == 'Property') {
    str += "No such property " + this.stack[0].identifier.name + " ";
    str += "for objects of class " + this.receiver.cls.name + ".";
  } else {
    str += "No such variable " + this.stack[0].name + ".";
  }
  
  str += this.stackToString();
  return str;
};

exports.WardrobeUndeclaredPropertyOrVariable = WardrobeUndeclaredPropertyOrVariable;
}
require['./undeclaredpropertyorvariable'] = require['./errors/undeclaredpropertyorvariable'];
require['./errors'] = new function() {
  var exports = this;
  var ErrorCodes = {
  UndefinedError: -1,
  NoSuchMethod: 0
};

exports.WardrobeSyntaxError = 
  require('./errors/syntaxerror').WardrobeSyntaxError;

exports.WardrobeNoSuchMethodError = 
  require('./errors/nosuchmethod').WardrobeNoSuchMethodError;

exports.WardrobeMissingArgumentsError = 
  require('./errors/missingarguments').WardrobeMissingArgumentsError;

exports.WardrobeNoSuchParameterError = 
  require('./errors/nosuchparam').WardrobeNoSuchParameterError;

exports.WardrobeUndeclaredPropertyOrVariable = 
  require('./errors/undeclaredpropertyorvariable').WardrobeUndeclaredPropertyOrVariable;
}
require['../errors'] = require['./errors'];
require['./lexer'] = new function() {
  var exports = this;
  var keywords = ['this', 'new', 'class', 'extends', 'function', 'method', 'if', 'then', 'else', 'for', 'in', 'while', 'do', 'end', 'return', 'true', 'false'];
var assign = ['='];
var operator = ['+', '-', '!'];
var comparators = ['!=', '==', '>', '<', '>=', '<='];
var logic = ['&&', 'and', '||', 'or'];
var math = ['/', '*', '%'];

function scan(source) {
  var tokens = [];
  var line = 1;
  var character = 0;
  var i = 0;

  //source = source.replace(/(\n|\r)+/g, '\n');

  while (i < source.length) {
    var chunk = source.slice(i, source.length);
    var value = null;
    
    // Comments
    if ((value = chunk.match(/#[^\n|\r]*/)) && value.index=== 0) {
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
    else if ((value = chunk.match(/\.\.|\.|\:|\(|\)|\,|\[|\]/)) && value.index === 0) {
      value = value[0];
      tokens.push([value, value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Operators
    else if ((value = chunk.match(/!\=|!|\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*|\%/)) && value.index === 0) {
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
    else if ((value = chunk.match(/"(.*?)"|'(.*?)'/)) && value.index === 0) {
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
require['../lexer'] = require['./lexer'];
require['./runtime'] = new function() {
  var exports = this;
  "use strict";

var errors = require('./errors');

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
  var method = undefined;
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
  this.properties = {};
  this.value = value;
  if (value === null) {this.value = this;}
  if (Runtime !== undefined) {
    var properties = this.cls.getProperties();
    for (var property in properties) {
      this.properties[property] = {};
      this.properties[property].type = properties[property].type;
      this.properties[property].object = properties[property].object;
    }
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
    throw new errors.WardrobeNoSuchMethodError(context, this);
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
  return this.getProperty(property).object;
};

WardrobeObject.prototype.toString = function() {
  var str = "";
  if (this.value !== this) {
   switch(this.cls.name) {
    case 'String': str += '"' + this.value + '"'; break;
    case 'List': str += '[' + this.value + ']'; break;
    case 'Function': 
      str += '<' + this.cls.name + ':(';
      for (var param in this.params) {
        str += this.params[param].type.name + ':'; 
        str += this.params[param].identifier.name + ',';
      }
      str = str.substring(0,str.length-1);
      str += ')>';
      break;
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

WardrobeClass.prototype.setPropertyObject = function(name, object) {
  this.properties[name].object = object;
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
  var missing_params = [];
  var params_list = [];
  var param, name, type, arg;

  // Bind all variables
  for (var p = 0; p < this.params.length; p++) {
    param = this.params[p];
    name = param.identifier.name;
    params_list.push(name);
    type = Runtime.getClass(param.type.name);
    arg = args[name] || args.unary;
    if (arg === undefined) {missing_params.push(param);}
    context.addLocal(name, type, arg);
  }

  if (missing_params.length > 0) {
    throw new errors.WardrobeMissingArgumentsError(context, receiver, missing_params);
  }

  if (this.params.length == 1) {params_list.push("unary");}
  var incorrect_params = [];
  for (arg in args) {
    if (params_list.indexOf(arg) == -1) {incorrect_params.push(arg);}
  }

  if (incorrect_params.length > 0) {
    throw new errors.WardrobeNoSuchParameterError(context, receiver, incorrect_params);
  }

  context.setCurrentObject(receiver);
  try {
    context = this.body.evaluate(context); 
  } catch(err) {
    if (err.kind !== undefined && err.kind == 'Return') {
      context = err.context;
    } else {
      throw err;
    }
  }

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

WardrobeFunction.prototype = new WardrobeClass();
WardrobeFunction.prototype.constructor = WardrobeFunction;
function WardrobeFunction() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'Function';
  this.super_class = Runtime.getClass('Object');
  this.methods = {};
}

WardrobeFunction.prototype.newObject = function(params, body) {
  return new WardrobeFunctionObject(params, body);
};

WardrobeFunctionObject.prototype = new WardrobeObject();
WardrobeFunctionObject.prototype.constructor = WardrobeFunctionObject;
function WardrobeFunctionObject(params, body) {
  this.cls = Runtime.getClass('Function');
  this.value = {params: params, body: body};

  this.params = params;
  this.body = body;
}

WardrobeFunctionObject.prototype.apply = function(context, args) { 
  var old_context = context.clone();
  var missing_params = [];
  var params_list = [];
  var param, name, type, arg;

  for (var p = 0; p < this.params.length; p++) {
    param = this.params[p];
    name = param.identifier.name;
    params_list.push(name);
    type = Runtime.getClass(param.type.name);
    arg = args[name] || args.unary;
    if (arg === undefined) {missing_params.push(param);}
    context.addLocal(name, type, arg);
  }

  if (missing_params.length > 0) {
    throw new errors.WardrobeMissingArgumentsError(context, null, missing_params);
  }

  if (this.params.length == 1) {params_list.push("unary");}
  var incorrect_params = [];
  for (arg in args) {
    if (params_list.indexOf(arg) == -1) {incorrect_params.push(arg);}
  }

  if (incorrect_params.length > 0) {
    throw new errors.WardrobeNoSuchParameterError(context, null, incorrect_params);
  }

  context.setCurrentObject(null);
  context.setCurrentClass(null);
  try {
    context = this.body.evaluate(context); 
  } catch(err) {
    if (err.kind !== undefined && err.kind == 'Return') {
      context = err.context;
    } else {
      throw err;
    }
  }

  // Unbind function variables, and re-instate old bindings
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
    'getClass',
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
  this.methods.equal = new WardrobeMethod(
    'equal',
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
  this.methods.modulus= new WardrobeMethod(
    'modulus',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value % right.value);
      context.setReturnObject(object);
      return context;
    }}
  );
  this.methods.equal = new WardrobeMethod(
    'equal',
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
  this.methods.lessThan = new WardrobeMethod(
    'lessThan',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value < right.value).toString());
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

WardrobeBoolean.prototype.installMethods = function() {
  this.methods.negate = new WardrobeMethod(
    'negate',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getGlobalObject((!receiver.value).toString());
      context.setReturnObject(object);
      return context;
    }}
  );
};

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
  this.methods.equal = new WardrobeMethod(
    'equal',
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
  this.methods.equal = new WardrobeMethod(
    'equal',
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
  this.methods.set = new WardrobeMethod(
    'set',
    [
      {type: {name: 'Number'}, identifier: {name: 'index'}},
      {type: {name: 'Object'}, identifier: {name: 'to'}}
    ],
    {evaluate: function(context) {
      var index = context.getLocalObject('index');
      var object = context.getLocalObject('to');
      context.getCurrentObject().value[index.value] = object;
      context.setReturnObject(object);
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
        if (list[i].call(context, 'equal', {unary: item}).getReturnObject().value) {
          index = i;
          break;
        }
      }
      context.setReturnObject(Runtime.getClass('Number').newObject(index));
      return context;
    }}
  );
  this.methods.map= new WardrobeMethod(
    'map',
    [{type: {name: 'Function'}, identifier: {name: 'with'}}],
    {evaluate: function(context) {
      var list = context.getCurrentObject().getValue();
      var func = context.getLocalObject('with');
      var mapped_list = [];
      for (var item = 0; item < list.length; item++) {
        context = func.apply(context, {unary: list[item]});
        mapped_list.push(context.getReturnObject());
      }
      context.setReturnObject(Runtime.getClass('List').newObject(mapped_list));
      return context;
    }}
  );
  this.methods.filter= new WardrobeMethod(
    'filter',
    [{type: {name: 'Function'}, identifier: {name: 'by'}}],
    {evaluate: function(context) {
      var list = context.getCurrentObject().getValue();
      var func = context.getLocalObject('by');
      var filtered_list = [];
      for (var item = 0; item < list.length; item++) {
        context = func.apply(context, {unary: list[item]});
        if (context.getReturnObject().value) {
          filtered_list.push(list[item]);
        }
      }
      context.setReturnObject(Runtime.getClass('List').newObject(filtered_list));
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
Runtime.addClass('Function', new WardrobeFunction());
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
Runtime.getClass('Boolean').installMethods();
Runtime.getClass('TrueBoolean').installMethods();
Runtime.getClass('FalseBoolean').installMethods();
Runtime.getClass('System').installMethods();

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').newObject());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').newObject());
Runtime.addGlobal('system', Runtime.getClass('System').newObject());

exports.Runtime = Runtime;
exports.Context = Context;
}
require['../runtime'] = require['./runtime'];
require['./nodes/node'] = new function() {
  var exports = this;
  var Node = function(kind) {
  this.kind = kind;
  this.ignore = [];
};

Node.prototype.evaluate = function(context) {
  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && this.ignore.indexOf(this.kind) == -1) {
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

exports.Node = Node;
}
require['./node'] = require['./nodes/node'];
require['./nodes/constant'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.Constant = Constant;
}
require['./constant'] = require['./nodes/constant'];
require['./nodes/argument'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

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

exports.Argument = Argument;
}
require['./argument'] = require['./nodes/argument'];
require['./nodes/assign'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var errors = require('../errors');

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
          var identErr = new errors.WardrobeUndeclaredPropertyOrVariable(context, null);
          identErr.addToStack(this.assignable);
          throw identErr;
        }

        context = this.expression.evaluate(context);
        context.setLocalObject(name, context.getReturnObject());
        break;

      case 'Property': 
        context = this.assignable.expression.evaluate(context); 
        var receiver = context.getReturnObject();
        var property = this.assignable.identifier.name;

        if (receiver.getProperty(property) === undefined) {
          var propErr = new errors.WardrobeUndeclaredPropertyOrVariable(context, receiver);
          propErr.addToStack(this.assignable);
          throw propErr;
        }

        context = this.expression.evaluate(context);
        receiver.setProperty(property, context.getReturnObject()); 
        break;
        
      case 'ListAccessor': 
        context = this.assignable.expression.evaluate(context);
        var list = context.getReturnObject();

        context = this.assignable.index_expression.evaluate(context);
        var index = context.getReturnObject();

        context = this.expression.evaluate(context);
        var set_to = context.getReturnObject();

        context = list.call(context, 'set', {index: index, to: set_to});
        break;

      default: break;
    }

    return context;
  };
}

exports.Assign = Assign;
}
require['./assign'] = require['./nodes/assign'];
require['./nodes/block'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

Block.prototype = new Node('Block');
Block.prototype.constructor = Block;
/*
 * 
 */
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

exports.Block = Block;
}
require['./block'] = require['./nodes/block'];
require['./nodes/call'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;
var errors = require('../errors');

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
    var is_method = this.receiver !== null;
    var is_system_method = ['print'].indexOf(method_name) >= 0;

    if (is_method) {
      context = this.receiver.evaluate(context);
      var receiver_object = context.getReturnObject();
      context = receiver_object.call(context, method_name, args); 
    } else if (is_system_method){
      context = Runtime.getGlobalObject('system').call(context, 'print', args);
    } else {
      context = this.identifier.evaluate(context);
      var func = context.getReturnObject();
      if (func.getClass() != Runtime.getClass('Function')) {
        throw "Not a function.";
      }
      context = func.apply(context, args);
    }

    return context;
  };
}

exports.Call = Call;
}
require['./call'] = require['./nodes/call'];
require['./nodes/class'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Constant = require('./constant').Constant;
var Runtime = require('../runtime').Runtime;

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

exports.Class = Class;
}
require['./class'] = require['./nodes/class'];
require['./nodes/comment'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

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

exports.Comment = Comment;
}
require['./comment'] = require['./nodes/comment'];
require['./nodes/create'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.Create = Create;
}
require['./create'] = require['./nodes/create'];
require['./nodes/declare'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.Declare = Declare;
}
require['./declare'] = require['./nodes/declare'];
require['./nodes/false'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.False = False;
}
require['./false'] = require['./nodes/false'];
require['./nodes/for'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

For.prototype = new Node('For');
For.prototype.constructor = For;
function For(assignable, iterable, block, range, text) {
  this.assignable = assignable;
  this.iterable = iterable;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name;
    if (this.assignable.kind == 'Declare') {
      context = this.assignable.evaluate(context);
      name = this.assignable.identifier.name;
    } else {
      // If assignable is an identifier (thus already declared)
      name = this.assignable.name; 
    }

    context = this.iterable.evaluate(context);
    var list = context.getReturnObject().getValue();

    for (var i = 0; i < list.length; i++) {
      var current = list[i];
      context.setLocalObject(name, current);
      context = this.block.evaluate(context);
    }

    if (this.assignable.kind == 'Declare') {
      context.deleteLocal(name);
    }

    return context;
  };
}

exports.For = For;
}
require['./for'] = require['./nodes/for'];
require['./nodes/function'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Constant = require('./constant').Constant;
var Runtime = require('../runtime').Runtime;

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

    var func = Runtime.getClass('Function').newObject(this.params, this.block);
    context.addLocal(this.identifier.name, Runtime.getClass('Function'), func); 
    context.setReturnObject(func);

    return context; 
  };
}

exports.Function = Function;
}
require['./function'] = require['./nodes/function'];
require['./nodes/identifier'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var errors = require('../errors');

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
      throw new errors.WardrobeUndeclaredPropertyOrVariable(context, null);
    }

    var object = context.getLocalObject(this.name);
    context.setReturnObject(object);
    return context;
  };
}

exports.Identifier = Identifier;
}
require['./identifier'] = require['./nodes/identifier'];
require['./nodes/if'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.If = If;
}
require['./if'] = require['./nodes/if'];
require['./nodes/list'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.List = List;
}
require['./list'] = require['./nodes/list'];
require['./nodes/listaccessor'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

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
    var list = context.getReturnObject();

    context = this.index_expression.evaluate(context);
    var index = context.getReturnObject();

    context = list.call(context, 'get', {unary: index});

    return context;
  };
}

exports.ListAccessor = ListAccessor;
}
require['./listaccessor'] = require['./nodes/listaccessor'];
require['./nodes/listrange'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

ListRange.prototype = new Node('ListRange');
ListRange.prototype.constructor = ListRange;
function ListRange(start, end, range, text) {
  this.start = start;
  this.end = end;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.start.evaluate(context);
    var start = context.getReturnObject();
    
    context = this.end.evaluate(context);
    var end = context.getReturnObject();

    var start_is_num = start.getClass() == Runtime.getClass('Number');
    var end_is_num = end.getClass() == Runtime.getClass('Number');
    if (!start_is_num || !end_is_num) {
      throw "Not a number";
    }

    start = start.getValue();
    end = end.getValue();

    var list = [];
    for (var i = start; i <= end; i++) {
      list.push(Runtime.getClass('Number').newObject(i));
    }

    context.setReturnObject(Runtime.getClass('List').newObject(list));

    return context;
  };
}

exports.ListRange = ListRange;
}
require['./listrange'] = require['./nodes/listrange'];
require['./nodes/method'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Constant = require('./constant').Constant;
var Runtime = require('../runtime').Runtime;

Method.prototype = new Node('Method');
Method.prototype.constructor = Method;
function Method(type, identifier, params, block, range, text) {
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
      throw "Must declare method within a class template";
    }

    return context; 
  };
}

exports.Method = Method;
}
require['./method'] = require['./nodes/method'];
require['./nodes/number'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.Number = Number;
}
require['./number'] = require['./nodes/number'];
require['./nodes/operator'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

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
        case '<': context = left.call(context, 'lessThan', args); break;
        case '>': context = left.call(context, 'greaterThan', args); break;
        case '<=': 
          context = left.call(context, 'equal', args);
          if (!context.getReturnObject().getValue()) {
            context = left.call(context, 'lessThan', args);
          }
          break;
        case '>=':
          context = left.call(context, 'equal', args);
          if (!context.getReturnObject().getValue()) {
            context = left.call(context, 'greaterThan', args);
          }
          break;
        case '==': context = left.call(context, 'equal', args); break;
        case '!=': 
          context = left.call(context, 'equal', args);
          context = context.getReturnObject().call(context, 'negate', {});
          break;
        case '+': context = left.call(context, 'add', args); break;
        case '-': context = left.call(context, 'subtract', args); break;
        case '/': context = left.call(context, 'divide', args); break;
        case '*': context = left.call(context, 'multiply', args); break;
        case '%': context = left.call(context, 'modulus', args); break;
        default: break;
      }
    } else {
      context = this.right.evaluate(context);
      right = context.getReturnObject();

      switch(this.operator) {
        case '+': context = right.call(context, 'positive', []); break;
        case '-': context = right.call(context, 'negative', []); break;
        case '!': context = right.call(context, 'negate', []); break;
        default: break;
      }
    }

    return context;
  };
}

exports.Operator = Operator;
}
require['./operator'] = require['./nodes/operator'];
require['./nodes/param'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

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

exports.Param = Param;
}
require['./param'] = require['./nodes/param'];
require['./nodes/property'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var errors = require('../errors');

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
      throw new errors.WardrobeUndeclaredPropertyOrVariable(context, receiver);
    }

    var object = receiver.getPropertyObject(property);
    context.setReturnObject(object);

    return context;
  };
}

exports.Property = Property;
}
require['./property'] = require['./nodes/property'];
require['./nodes/return'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

Return.prototype = new Node('Return');
Return.prototype.constructor = Return;
function Return(expression, range, text) {
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context = this.expression.evaluate(context);
    throw {kind: 'Return', context: context};
  };
}

exports.Return = Return;
}
require['./return'] = require['./nodes/return'];
require['./nodes/string'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.String = String;
}
require['./string'] = require['./nodes/string'];
require['./nodes/this'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.This = This;
}
require['./this'] = require['./nodes/this'];
require['./nodes/true'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.True = True;
}
require['./true'] = require['./nodes/true'];
require['./nodes/while'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

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

exports.While = While;
}
require['./while'] = require['./nodes/while'];
require['./nodes'] = new function() {
  var exports = this;
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
  For: require('./nodes/for').For,
  Function: require('./nodes/function').Function,
  Identifier: require('./nodes/identifier').Identifier,
  If: require('./nodes/if').If,
  List: require('./nodes/list').List,
  ListAccessor: require('./nodes/listaccessor').ListAccessor,
  ListRange: require('./nodes/listrange').ListRange,
  Method: require('./nodes/method').Method,
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

}
require['../nodes'] = require['./nodes'];
require['./parser'] = new function() {
  var exports = this;
  /* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"block":9,"statement":10,"expression":11,"COMMENT":12,"RETURN":13,"declare":14,"constant":15,"identifier":16,"bracketed":17,"value":18,"assign":19,"literal":20,"class":21,"method":22,"function":23,"call":24,"create":25,"operation":26,"if":27,"for":28,"while":29,"(":30,")":31,"assignable":32,"const":33,"this":34,"ASSIGN":35,"property":36,"list_accessor":37,"IDENT":38,".":39,"[":40,"]":41,"CONST":42,"NUMBER":43,"STRING":44,"TRUE":45,"FALSE":46,"list":47,"list_items":48,"..":49,",":50,"THIS":51,"CLASS":52,"END":53,"EXTENDS":54,"METHOD":55,"params":56,"FUNCTION":57,"arguments":58,"NEW":59,"unary_argument":60,"named_arguments":61,":":62,"+":63,"-":64,"!":65,"MATH":66,"COMP":67,"LOGIC":68,"IF":69,"ELSE":70,"WHILE":71,"DO":72,"FOR":73,"IN":74,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",12:"COMMENT",13:"RETURN",30:"(",31:")",33:"const",35:"ASSIGN",38:"IDENT",39:".",40:"[",41:"]",42:"CONST",43:"NUMBER",44:"STRING",45:"TRUE",46:"FALSE",49:"..",50:",",51:"THIS",52:"CLASS",53:"END",54:"EXTENDS",55:"METHOD",57:"FUNCTION",59:"NEW",62:":",63:"+",64:"-",65:"!",66:"MATH",67:"COMP",68:"LOGIC",69:"IF",70:"ELSE",71:"WHILE",72:"DO",73:"FOR",74:"IN"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[9,3],[8,1],[8,1],[10,1],[10,2],[10,1],[14,2],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[17,3],[18,1],[18,1],[18,1],[19,3],[19,3],[32,1],[32,1],[32,1],[16,1],[36,3],[37,4],[15,1],[20,1],[20,1],[20,1],[20,1],[20,1],[47,3],[47,5],[48,0],[48,1],[48,3],[34,1],[21,4],[21,6],[22,7],[22,8],[23,7],[23,8],[56,0],[56,2],[56,4],[24,6],[24,4],[25,5],[58,1],[58,1],[60,1],[61,0],[61,3],[61,5],[26,2],[26,2],[26,2],[26,3],[26,3],[26,3],[26,3],[26,3],[27,4],[27,6],[27,5],[29,5],[28,7],[28,7]],
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
case 25:this.$ = $$[$0];
break;
case 26:this.$ = $$[$0];
break;
case 27:this.$ = $$[$0-1];
break;
case 28:this.$ = $$[$0];
break;
case 29:this.$ = $$[$0];
break;
case 30:this.$ = $$[$0];
break;
case 31:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 32:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 33:this.$ = $$[$0];
break;
case 34:this.$ = $$[$0];
break;
case 35:this.$ = $$[$0];
break;
case 36:this.$ = new yy.Identifier($$[$0], this._$, yytext);
break;
case 37:this.$ = new yy.Property($$[$0-2], $$[$0], this._$, yytext);
break;
case 38:this.$ = new yy.ListAccessor($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 39:this.$ = new yy.Constant($$[$0], this._$, yytext);
break;
case 40:this.$ = new yy.Number($$[$0], this._$, yytext);
break;
case 41:this.$ = new yy.String($$[$0], this._$, yytext);
break;
case 42:this.$ = new yy.True(this._$, yytext);
break;
case 43:this.$ = new yy.False(this._$, yytext);
break;
case 44:this.$ = $$[$0];
break;
case 45:this.$ = new yy.List($$[$0-1])
break;
case 46:this.$ = new yy.ListRange($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 47:this.$ = []
break;
case 48:this.$ = [$$[$0]]
break;
case 49:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 50:this.$ = new yy.This(this._$, yytext);
break;
case 51:this.$ = new yy.Class($$[$0-2], null, $$[$0-1], this._$, yytext);
break;
case 52:this.$ = new yy.Class($$[$0-4], $$[$0-2], $$[$0-1], this._$, yytext);
break;
case 53:this.$ = new yy.Method(null, $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 54:this.$ = new yy.Method($$[$0-6], $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 55:this.$ = new yy.Function(null, $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 56:this.$ = new yy.Function($$[$0-6], $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 57:this.$ = [];
break;
case 58:this.$ = [new yy.Param($$[$0-1], $$[$0])];
break;
case 59:this.$ = $$[$0-3]; $$[$0-3].push(new yy.Param($$[$0-1], $$[$0], this._$, yytext));
break;
case 60:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 61:this.$ = new yy.Call($$[$0-3], null, $$[$0-1], this._$, yytext);
break;
case 62:this.$ = new yy.Create($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 63:this.$ = $$[$0];
break;
case 64:this.$ = $$[$0];
break;
case 65:this.$ = [new yy.Argument(new yy.Identifier("unary", this._$, yytext), $$[$0], this._$, yytext)];
break;
case 66:this.$ = [];
break;
case 67:this.$ = [new yy.Argument($$[$0-2], $$[$0], this._$, yytext)];
break;
case 68:this.$ = $$[$0-4]; $$[$0-4].push(new yy.Argument($$[$0-2], $$[$0], this._$, yytext));
break;
case 69:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 70:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 71:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 72:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 73:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 74:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 75:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 76:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 77:this.$ = new yy.If($$[$0-2], $$[$0-1], null, this._$, yytext);
break;
case 78:this.$ = new yy.If($$[$0-4], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 79:this.$ = new yy.If($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 80:this.$ = new yy.While($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 81:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 82:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{1:[3]},{1:[2,1]},{4:[1,50],6:51,7:[1,52]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{4:[2,9],7:[2,9]},{11:61,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,11],7:[2,11],35:[1,63]},{4:[2,13],7:[2,13],30:[2,13],31:[2,13],39:[2,13],40:[2,13],41:[2,13],49:[2,13],50:[2,13],63:[2,13],64:[2,13],66:[2,13],67:[2,13],68:[2,13],72:[2,13]},{4:[2,14],7:[2,14],30:[2,14],31:[2,14],39:[2,14],40:[2,14],41:[2,14],49:[2,14],50:[2,14],63:[2,14],64:[2,14],66:[2,14],67:[2,14],68:[2,14],72:[2,14]},{4:[2,15],7:[2,15],30:[2,15],31:[2,15],39:[2,15],40:[2,15],41:[2,15],49:[2,15],50:[2,15],63:[2,15],64:[2,15],66:[2,15],67:[2,15],68:[2,15],72:[2,15]},{4:[2,16],7:[2,16],30:[2,16],31:[2,16],39:[2,16],40:[2,16],41:[2,16],49:[2,16],50:[2,16],63:[2,16],64:[2,16],66:[2,16],67:[2,16],68:[2,16],72:[2,16]},{4:[2,17],7:[2,17],16:64,30:[2,17],31:[2,17],38:[1,49],39:[2,17],40:[2,17],41:[2,17],49:[2,17],50:[2,17],63:[2,17],64:[2,17],66:[2,17],67:[2,17],68:[2,17],72:[2,17]},{4:[2,18],7:[2,18],30:[2,18],31:[2,18],39:[2,18],40:[2,18],41:[2,18],49:[2,18],50:[2,18],63:[2,18],64:[2,18],66:[2,18],67:[2,18],68:[2,18],72:[2,18]},{4:[2,19],7:[2,19],30:[2,19],31:[2,19],39:[2,19],40:[2,19],41:[2,19],49:[2,19],50:[2,19],63:[2,19],64:[2,19],66:[2,19],67:[2,19],68:[2,19],72:[2,19]},{4:[2,20],7:[2,20],30:[2,20],31:[2,20],39:[2,20],40:[2,20],41:[2,20],49:[2,20],50:[2,20],63:[2,20],64:[2,20],66:[2,20],67:[2,20],68:[2,20],72:[2,20]},{4:[2,21],7:[2,21],30:[2,21],31:[2,21],39:[2,21],40:[2,21],41:[2,21],49:[2,21],50:[2,21],63:[2,21],64:[2,21],66:[2,21],67:[2,21],68:[2,21],72:[2,21]},{4:[2,22],7:[2,22],30:[2,22],31:[2,22],39:[2,22],40:[2,22],41:[2,22],49:[2,22],50:[2,22],63:[2,22],64:[2,22],66:[2,22],67:[2,22],68:[2,22],72:[2,22]},{4:[2,23],7:[2,23],30:[2,23],31:[2,23],39:[2,23],40:[2,23],41:[2,23],49:[2,23],50:[2,23],63:[2,23],64:[2,23],66:[2,23],67:[2,23],68:[2,23],72:[2,23]},{4:[2,24],7:[2,24],30:[2,24],31:[2,24],39:[2,24],40:[2,24],41:[2,24],49:[2,24],50:[2,24],63:[2,24],64:[2,24],66:[2,24],67:[2,24],68:[2,24],72:[2,24]},{4:[2,25],7:[2,25],30:[2,25],31:[2,25],39:[2,25],40:[2,25],41:[2,25],49:[2,25],50:[2,25],63:[2,25],64:[2,25],66:[2,25],67:[2,25],68:[2,25],72:[2,25]},{4:[2,26],7:[2,26],30:[2,26],31:[2,26],39:[2,26],40:[2,26],41:[2,26],49:[2,26],50:[2,26],63:[2,26],64:[2,26],66:[2,26],67:[2,26],68:[2,26],72:[2,26]},{11:65,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,28],7:[2,28],30:[2,28],31:[2,28],35:[1,66],39:[2,28],40:[2,28],41:[2,28],49:[2,28],50:[2,28],63:[2,28],64:[2,28],66:[2,28],67:[2,28],68:[2,28],72:[2,28]},{4:[2,29],7:[2,29],30:[2,29],31:[2,29],39:[2,29],40:[2,29],41:[2,29],49:[2,29],50:[2,29],63:[2,29],64:[2,29],66:[2,29],67:[2,29],68:[2,29],72:[2,29]},{4:[2,30],7:[2,30],30:[2,30],31:[2,30],39:[2,30],40:[2,30],41:[2,30],49:[2,30],50:[2,30],63:[2,30],64:[2,30],66:[2,30],67:[2,30],68:[2,30],72:[2,30]},{4:[2,40],7:[2,40],30:[2,40],31:[2,40],39:[2,40],40:[2,40],41:[2,40],49:[2,40],50:[2,40],63:[2,40],64:[2,40],66:[2,40],67:[2,40],68:[2,40],72:[2,40]},{4:[2,41],7:[2,41],30:[2,41],31:[2,41],39:[2,41],40:[2,41],41:[2,41],49:[2,41],50:[2,41],63:[2,41],64:[2,41],66:[2,41],67:[2,41],68:[2,41],72:[2,41]},{4:[2,42],7:[2,42],30:[2,42],31:[2,42],39:[2,42],40:[2,42],41:[2,42],49:[2,42],50:[2,42],63:[2,42],64:[2,42],66:[2,42],67:[2,42],68:[2,42],72:[2,42]},{4:[2,43],7:[2,43],30:[2,43],31:[2,43],39:[2,43],40:[2,43],41:[2,43],49:[2,43],50:[2,43],63:[2,43],64:[2,43],66:[2,43],67:[2,43],68:[2,43],72:[2,43]},{4:[2,44],7:[2,44],30:[2,44],31:[2,44],39:[2,44],40:[2,44],41:[2,44],49:[2,44],50:[2,44],63:[2,44],64:[2,44],66:[2,44],67:[2,44],68:[2,44],72:[2,44]},{4:[2,39],7:[2,39],30:[2,39],31:[2,39],38:[2,39],39:[2,39],40:[2,39],41:[2,39],49:[2,39],50:[2,39],54:[2,39],63:[2,39],64:[2,39],66:[2,39],67:[2,39],68:[2,39],72:[2,39]},{15:67,42:[1,33]},{15:69,16:68,38:[1,49],42:[1,33]},{15:71,16:70,38:[1,49],42:[1,33]},{15:72,42:[1,33]},{11:73,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:74,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:75,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:76,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{14:78,15:79,16:77,38:[1,49],42:[1,33]},{11:80,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,33],7:[2,33],30:[2,33],31:[2,33],35:[2,33],39:[2,33],40:[2,33],41:[2,33],49:[2,33],50:[2,33],63:[2,33],64:[2,33],66:[2,33],67:[2,33],68:[2,33],72:[2,33]},{4:[2,34],7:[2,34],30:[2,34],31:[2,34],35:[2,34],39:[2,34],40:[2,34],41:[2,34],49:[2,34],50:[2,34],63:[2,34],64:[2,34],66:[2,34],67:[2,34],68:[2,34],72:[2,34]},{4:[2,35],7:[2,35],30:[2,35],31:[2,35],35:[2,35],39:[2,35],40:[2,35],41:[2,35],49:[2,35],50:[2,35],63:[2,35],64:[2,35],66:[2,35],67:[2,35],68:[2,35],72:[2,35]},{4:[2,50],7:[2,50],30:[2,50],31:[2,50],39:[2,50],40:[2,50],41:[2,50],49:[2,50],50:[2,50],63:[2,50],64:[2,50],66:[2,50],67:[2,50],68:[2,50],72:[2,50]},{11:82,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],41:[2,47],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,48:81,50:[2,47],51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,36],7:[2,36],30:[2,36],31:[2,36],35:[2,36],39:[2,36],40:[2,36],41:[2,36],49:[2,36],50:[2,36],62:[2,36],63:[2,36],64:[2,36],66:[2,36],67:[2,36],68:[2,36],72:[2,36],74:[2,36]},{1:[2,2]},{8:83,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{12:[2,3],13:[2,3],30:[2,3],33:[2,3],38:[2,3],40:[2,3],42:[2,3],43:[2,3],44:[2,3],45:[2,3],46:[2,3],51:[2,3],52:[2,3],53:[2,3],55:[2,3],57:[2,3],59:[2,3],63:[2,3],64:[2,3],65:[2,3],69:[2,3],70:[2,3],71:[2,3],73:[2,3]},{16:84,38:[1,49]},{11:88,14:62,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],31:[2,66],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,50:[2,66],51:[1,47],52:[1,34],55:[1,35],57:[1,36],58:85,59:[1,37],60:86,61:87,63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:90,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:91,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:92,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:93,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:94,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:95,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,10],7:[2,10],30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{35:[1,63]},{11:96,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,12],7:[2,12],35:[2,12],74:[2,12]},{30:[1,54],31:[1,97],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{11:98,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{6:101,7:[1,52],9:99,54:[1,100]},{30:[1,102]},{16:103,38:[1,49]},{30:[1,104]},{16:105,38:[1,49]},{30:[1,106]},{4:[2,69],7:[2,69],30:[1,54],31:[2,69],39:[2,69],40:[1,60],41:[2,69],49:[2,69],50:[2,69],63:[2,69],64:[2,69],66:[1,57],67:[2,69],68:[1,59],72:[2,69]},{4:[2,70],7:[2,70],30:[1,54],31:[2,70],39:[2,70],40:[1,60],41:[2,70],49:[2,70],50:[2,70],63:[2,70],64:[2,70],66:[1,57],67:[2,70],68:[1,59],72:[2,70]},{4:[2,71],7:[2,71],30:[1,54],31:[2,71],39:[2,71],40:[1,60],41:[2,71],49:[2,71],50:[2,71],63:[2,71],64:[2,71],66:[1,57],67:[2,71],68:[1,59],72:[2,71]},{6:101,7:[1,52],9:107,30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{74:[1,108]},{74:[1,109]},{16:64,38:[1,49]},{30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59],72:[1,110]},{41:[1,111],50:[1,112]},{30:[1,54],39:[1,53],40:[1,60],41:[2,48],49:[1,113],50:[2,48],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{4:[2,5],7:[2,5]},{4:[2,37],7:[2,37],30:[1,114],31:[2,37],35:[2,37],39:[2,37],40:[2,37],41:[2,37],49:[2,37],50:[2,37],63:[2,37],64:[2,37],66:[2,37],67:[2,37],68:[2,37],72:[2,37]},{31:[1,115]},{31:[2,63]},{31:[2,64],50:[1,116]},{30:[1,54],31:[2,65],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{30:[2,33],31:[2,33],35:[2,33],39:[2,33],40:[2,33],62:[1,117],63:[2,33],64:[2,33],66:[2,33],67:[2,33],68:[2,33]},{4:[2,72],7:[2,72],30:[1,54],31:[2,72],39:[2,72],40:[1,60],41:[2,72],49:[2,72],50:[2,72],63:[2,72],64:[2,72],66:[1,57],67:[2,72],68:[1,59],72:[2,72]},{4:[2,73],7:[2,73],30:[1,54],31:[2,73],39:[2,73],40:[1,60],41:[2,73],49:[2,73],50:[2,73],63:[2,73],64:[2,73],66:[1,57],67:[2,73],68:[1,59],72:[2,73]},{4:[2,74],7:[2,74],30:[1,54],31:[2,74],39:[2,74],40:[1,60],41:[2,74],49:[2,74],50:[2,74],63:[2,74],64:[2,74],66:[2,74],67:[2,74],68:[1,59],72:[2,74]},{4:[2,75],7:[2,75],30:[1,54],31:[2,75],39:[2,75],40:[1,60],41:[2,75],49:[2,75],50:[2,75],63:[1,55],64:[1,56],66:[1,57],67:[2,75],68:[1,59],72:[2,75]},{4:[2,76],7:[2,76],30:[1,54],31:[2,76],39:[2,76],40:[1,60],41:[2,76],49:[2,76],50:[2,76],63:[2,76],64:[2,76],66:[2,76],67:[2,76],68:[2,76],72:[2,76]},{30:[1,54],39:[1,53],40:[1,60],41:[1,118],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{4:[2,31],7:[2,31],30:[1,54],31:[2,31],39:[1,53],40:[1,60],41:[2,31],49:[2,31],50:[2,31],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59],72:[2,31]},{4:[2,27],7:[2,27],30:[2,27],31:[2,27],39:[2,27],40:[2,27],41:[2,27],49:[2,27],50:[2,27],63:[2,27],64:[2,27],66:[2,27],67:[2,27],68:[2,27],72:[2,27]},{4:[2,32],7:[2,32],30:[1,54],31:[2,32],39:[1,53],40:[1,60],41:[2,32],49:[2,32],50:[2,32],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59],72:[2,32]},{53:[1,119]},{15:120,42:[1,33]},{5:121,8:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{15:123,31:[2,57],42:[1,33],50:[2,57],56:122},{30:[1,124]},{15:123,31:[2,57],42:[1,33],50:[2,57],56:125},{30:[1,126]},{11:88,14:62,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],31:[2,66],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,50:[2,66],51:[1,47],52:[1,34],55:[1,35],57:[1,36],58:127,59:[1,37],60:86,61:87,63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{53:[1,128],70:[1,129]},{11:130,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:131,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{6:101,7:[1,52],9:132},{4:[2,45],7:[2,45],30:[2,45],31:[2,45],39:[2,45],40:[2,45],41:[2,45],49:[2,45],50:[2,45],63:[2,45],64:[2,45],66:[2,45],67:[2,45],68:[2,45],72:[2,45]},{11:133,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:134,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{11:88,14:62,15:14,16:89,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],31:[2,66],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,50:[2,66],51:[1,47],52:[1,34],55:[1,35],57:[1,36],58:135,59:[1,37],60:86,61:87,63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,61],7:[2,61],30:[2,61],31:[2,61],39:[2,61],40:[2,61],41:[2,61],49:[2,61],50:[2,61],63:[2,61],64:[2,61],66:[2,61],67:[2,61],68:[2,61],72:[2,61]},{16:136,38:[1,49]},{11:137,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,38],7:[2,38],30:[2,38],31:[2,38],35:[2,38],39:[2,38],40:[2,38],41:[2,38],49:[2,38],50:[2,38],63:[2,38],64:[2,38],66:[2,38],67:[2,38],68:[2,38],72:[2,38]},{4:[2,51],7:[2,51],30:[2,51],31:[2,51],39:[2,51],40:[2,51],41:[2,51],49:[2,51],50:[2,51],63:[2,51],64:[2,51],66:[2,51],67:[2,51],68:[2,51],72:[2,51]},{6:101,7:[1,52],9:138},{6:139,7:[1,52]},{31:[1,140],50:[1,141]},{16:142,38:[1,49]},{15:123,31:[2,57],42:[1,33],50:[2,57],56:143},{31:[1,144],50:[1,141]},{15:123,31:[2,57],42:[1,33],50:[2,57],56:145},{31:[1,146]},{4:[2,77],7:[2,77],30:[2,77],31:[2,77],39:[2,77],40:[2,77],41:[2,77],49:[2,77],50:[2,77],63:[2,77],64:[2,77],66:[2,77],67:[2,77],68:[2,77],72:[2,77]},{6:101,7:[1,52],9:147,27:148,69:[1,41]},{30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59],72:[1,149]},{30:[1,54],39:[1,53],40:[1,60],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59],72:[1,150]},{53:[1,151]},{30:[1,54],39:[1,53],40:[1,60],41:[2,49],50:[2,49],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{30:[1,54],39:[1,53],40:[1,60],41:[1,152],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{31:[1,153]},{62:[1,154]},{30:[1,54],31:[2,67],39:[1,53],40:[1,60],50:[2,67],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{53:[1,155]},{8:83,10:5,11:6,12:[1,7],13:[1,8],14:9,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],53:[2,6],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],70:[2,6],71:[1,43],73:[1,42]},{6:101,7:[1,52],9:156},{15:157,42:[1,33]},{31:[2,58],50:[2,58]},{31:[1,158],50:[1,141]},{6:101,7:[1,52],9:159},{31:[1,160],50:[1,141]},{4:[2,62],7:[2,62],30:[2,62],31:[2,62],39:[2,62],40:[2,62],41:[2,62],49:[2,62],50:[2,62],63:[2,62],64:[2,62],66:[2,62],67:[2,62],68:[2,62],72:[2,62]},{53:[1,161]},{4:[2,79],7:[2,79],30:[2,79],31:[2,79],39:[2,79],40:[2,79],41:[2,79],49:[2,79],50:[2,79],63:[2,79],64:[2,79],66:[2,79],67:[2,79],68:[2,79],72:[2,79]},{6:101,7:[1,52],9:162},{6:101,7:[1,52],9:163},{4:[2,80],7:[2,80],30:[2,80],31:[2,80],39:[2,80],40:[2,80],41:[2,80],49:[2,80],50:[2,80],63:[2,80],64:[2,80],66:[2,80],67:[2,80],68:[2,80],72:[2,80]},{4:[2,46],7:[2,46],30:[2,46],31:[2,46],39:[2,46],40:[2,46],41:[2,46],49:[2,46],50:[2,46],63:[2,46],64:[2,46],66:[2,46],67:[2,46],68:[2,46],72:[2,46]},{4:[2,60],7:[2,60],30:[2,60],31:[2,60],39:[2,60],40:[2,60],41:[2,60],49:[2,60],50:[2,60],63:[2,60],64:[2,60],66:[2,60],67:[2,60],68:[2,60],72:[2,60]},{11:164,14:62,15:14,16:44,17:10,18:11,19:12,20:13,21:15,22:16,23:17,24:18,25:19,26:20,27:21,28:22,29:23,30:[1,24],32:25,33:[1,26],34:27,36:45,37:46,38:[1,49],40:[1,48],42:[1,33],43:[1,28],44:[1,29],45:[1,30],46:[1,31],47:32,51:[1,47],52:[1,34],55:[1,35],57:[1,36],59:[1,37],63:[1,38],64:[1,39],65:[1,40],69:[1,41],71:[1,43],73:[1,42]},{4:[2,52],7:[2,52],30:[2,52],31:[2,52],39:[2,52],40:[2,52],41:[2,52],49:[2,52],50:[2,52],63:[2,52],64:[2,52],66:[2,52],67:[2,52],68:[2,52],72:[2,52]},{53:[1,165]},{16:166,38:[1,49]},{6:101,7:[1,52],9:167},{53:[1,168]},{6:101,7:[1,52],9:169},{4:[2,78],7:[2,78],30:[2,78],31:[2,78],39:[2,78],40:[2,78],41:[2,78],49:[2,78],50:[2,78],63:[2,78],64:[2,78],66:[2,78],67:[2,78],68:[2,78],72:[2,78]},{53:[1,170]},{53:[1,171]},{30:[1,54],31:[2,68],39:[1,53],40:[1,60],50:[2,68],63:[1,55],64:[1,56],66:[1,57],67:[1,58],68:[1,59]},{4:[2,53],7:[2,53],30:[2,53],31:[2,53],39:[2,53],40:[2,53],41:[2,53],49:[2,53],50:[2,53],63:[2,53],64:[2,53],66:[2,53],67:[2,53],68:[2,53],72:[2,53]},{31:[2,59],50:[2,59]},{53:[1,172]},{4:[2,55],7:[2,55],30:[2,55],31:[2,55],39:[2,55],40:[2,55],41:[2,55],49:[2,55],50:[2,55],63:[2,55],64:[2,55],66:[2,55],67:[2,55],68:[2,55],72:[2,55]},{53:[1,173]},{4:[2,81],7:[2,81],30:[2,81],31:[2,81],39:[2,81],40:[2,81],41:[2,81],49:[2,81],50:[2,81],63:[2,81],64:[2,81],66:[2,81],67:[2,81],68:[2,81],72:[2,81]},{4:[2,82],7:[2,82],30:[2,82],31:[2,82],39:[2,82],40:[2,82],41:[2,82],49:[2,82],50:[2,82],63:[2,82],64:[2,82],66:[2,82],67:[2,82],68:[2,82],72:[2,82]},{4:[2,54],7:[2,54],30:[2,54],31:[2,54],39:[2,54],40:[2,54],41:[2,54],49:[2,54],50:[2,54],63:[2,54],64:[2,54],66:[2,54],67:[2,54],68:[2,54],72:[2,54]},{4:[2,56],7:[2,56],30:[2,56],31:[2,56],39:[2,56],40:[2,56],41:[2,56],49:[2,56],50:[2,56],63:[2,56],64:[2,56],66:[2,56],67:[2,56],68:[2,56],72:[2,56]}],
defaultActions: {2:[2,1],50:[2,2],86:[2,63]},
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
require['../parser'] = require['./parser'];
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
  } catch(err) {
    if (err.kind !== undefined && err.kind == 'Return') {
      context = err.context;
    } else {
      // Handlers here?
      throw err;
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
require['../interpreter'] = require['./interpreter'];
require['./wardrobe'] = new function() {
  var exports = this;
  var lexer = require('./lexer');
var nodes = require('./nodes').nodes;
var parser = require('./parser').parser;
var interpreter = require('./interpreter');
var errors = require('./errors');

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

parser.yy.parseError = function (err, hash) {
  //if (!(hash.expected.indexOf("';'") >= 0 && (hash.token === 'CLOSEBRACE' || parser.yy.lineBreak || parser.yy.lastLineBreak || hash.token === 1))) {
  var lex = parser.lexer;
  var token = lex.tokens[lex.pos-1];
  throw new errors.WardrobeSyntaxError(hash, token);
};

function run(source, debug) {
  var tokens = lexer.lex(source);
  
  if (debug) {
    console.log('Lexer finished, tokens: \n');
    console.log(tokens);
  }

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

function parse(source) {
  var tokens = lexer.lex(source);
  return parser.parse(tokens);
}

exports.run = run;
exports.parse = parse;
}
require['../wardrobe'] = require['./wardrobe'];
    return require['./wardrobe'];  }();    if (typeof define === 'function' && define.amd) {      define(function() { return Wardrobe; });    } else {      root.Wardrobe = Wardrobe;     }  }(this));