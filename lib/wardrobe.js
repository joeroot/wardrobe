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
require['./errors/typeerror'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeTypeError.prototype = new WardrobeRuntimeError('TypeError');
WardrobeTypeError.prototype.constructor = WardrobeTypeError;
function WardrobeTypeError(context, objectType, variableType) {
  this.stack = [];
  this.context = context;
  this.objectType = objectType;
  this.variableType = variableType;
}

WardrobeTypeError.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "Type error, " + this.objectType.name + " is not of type " + this.variableType.name + ".";
  str += this.stackToString();
  return str;
};

exports.WardrobeTypeError = WardrobeTypeError;
}
require['./typeerror'] = require['./errors/typeerror'];
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
require['./errors/nosuchclass'] = new function() {
  var exports = this;
  var WardrobeRuntimeError = require('./runtimeerror').WardrobeRuntimeError;

WardrobeNoSuchClass.prototype = new WardrobeRuntimeError('NoSuchClass');
WardrobeNoSuchClass.prototype.constructor = WardrobeNoSuchClass;
function WardrobeNoSuchClass(context, name) {
  this.stack = [];
  this.context = context;
  this.name = name;
}

WardrobeNoSuchClass.prototype.toString = function() {
  var str = this.stack[0].getStartLine() +  ", " + this.stack[0].getStartColumn() + ": ";
  str += "No such class " + this.name + ".";
  str += this.stackToString();
  return str;
};

exports.WardrobeNoSuchClass = WardrobeNoSuchClass;
}
require['./nosuchclass'] = require['./errors/nosuchclass'];
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

exports.WardrobeTypeError = 
  require('./errors/typeerror').WardrobeTypeError;

exports.WardrobeNoSuchMethodError = 
  require('./errors/nosuchmethod').WardrobeNoSuchMethodError;

exports.WardrobeMissingArgumentsError = 
  require('./errors/missingarguments').WardrobeMissingArgumentsError;

exports.WardrobeNoSuchParameterError = 
  require('./errors/nosuchparam').WardrobeNoSuchParameterError;

exports.WardrobeUndeclaredPropertyOrVariable = 
  require('./errors/undeclaredpropertyorvariable').WardrobeUndeclaredPropertyOrVariable;

exports.WardrobeNoSuchClass = 
  require('./errors/nosuchclass').WardrobeNoSuchClass;
}
require['../errors'] = require['./errors'];
require['./lexer'] = new function() {
  var exports = this;
  var regex = {
  comment: /#[^\n|\r]*/,
  identifier: /[a-z]\w*/,
  constant: /[A-Z]\w*/,
  grammar: /->|\.\.|\.|\:|\(|\)|\,|\[|\]/,
  operator: /!\=|!|\=\=|>\=|<\=|>|<|\=|&&|\|\||&|\+|\-|\/|\*|\%|\=/,
  number: /[0-9]+(\.[0-9]+)?/,
  string: /"(.*?)"|'(.*?)'/,
  newline: /((\s)*\n|(\s)*\r)+/
};

var keywords = ['this', 'super', 'class', 'extends', 'function', 'method', 'if', 'then', 'else', 'for', 'in', 'while', 'do', 'end', 'return', 'true', 'false', 'nothing'];

var operators = {
  comp: ['!=', '==', '>', '<', '>=', '<='],
  logic:  ['&&', 'and', '||', 'or'],
  math: ['/', '*', '%']
};

function scan(source) {
  var tokens = [];    // Initialise empty set of tokens
  var line = 1;       // Set intial line to 1
  var column = 0;     // Set initial column to 0
  var i = 0;          // Set column index to 0

  while (i < source.length) {
    var chunk = source.slice(i); // chunk is the remaining source code left to be lexed
    var lexeme = null;           // initalise current lexeme
    
    var match = function(regex) {
      lexeme = chunk.match(regex);
      if (lexeme && lexeme.index === 0) {
        lexeme = lexeme[0];
        return true;
      }
      return false;
    };

    // Comments
    if (match(regex.comment)) {
      tokens.push(["COMMENT", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Keywords and identifiers
    else if (match(regex.identifier)) {
      if (operators.logic.indexOf(lexeme) >= 0) {tokens.push(['LOGIC', lexeme, line, column]);}
      else if (keywords.indexOf(lexeme) >= 0) {tokens.push([lexeme.toUpperCase(), lexeme, line, column]);}
      else {tokens.push(["IDENT", lexeme, line, column]);}
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Constants
    else if (match(regex.constant)) {
      tokens.push(["CONST", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Grammatical symbols
    else if (match(regex.grammar)) {
      tokens.push([lexeme, lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Operators
    else if (match(regex.operator)) {
      var symbol = null;
      for (kind in operators) {
        if (operators[kind].indexOf(lexeme) >= 0) {
          symbol = kind.toUpperCase();
          tokens.push([symbol, lexeme, line, column]);
          break;
        }
      }
      if (symbol === null) {tokens.push([lexeme, lexeme, line, column]);}
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Numbers
    else if (match(regex.number)) {
      tokens.push(["NUMBER", lexeme, line]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Strings
    else if (match(regex.string)) {
      tokens.push(["STRING", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Newlines
    else if (match(regex.newline)) {
      tokens.push(["NEWLINE", lexeme, line, column]);
      line = line + lexeme.replace(/ /g, '').length;
      column = 0;
      i = i + lexeme.length;
    }
    else {
      //console.error("Unmatched: " + escape(lexeme[0]));
      column = column + 1;
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
 * createialises a new runtime environment
 *
 * @param {WardrobeObject} obj createial current object
 * @param {WardrobeClass} cls intial current class
 */
var WardrobeRuntime = function() { 
  this.classes = {};
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
  var cls = this.classes[name];
  if (!cls) {throw new errors.WardrobeNoSuchClass(this, name);}
  return cls;
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
    var local = this.locals[name];
    clone.addLocal(name, local.type, local.object);
  }
  return clone;
};

Context.prototype.addLocal = function(name, type, object) {
  var objectClass = object.getClass();
  if (!objectClass.subClassOf(type)) {
    throw new errors.WardrobeTypeError(this, objectClass, type);
  }
  this.locals[name] = {type: type, object: object};
};

Context.prototype.deleteLocal = function(name) {
  delete this.locals[name];
};

Context.prototype.hasLocal = function(name) {
  return !(this.locals[name] === undefined);
};

Context.prototype.getLocal = function(name) {
  var local = this.locals[name];
  if (!local) {
    throw new errors.WardrobeUndeclaredPropertyOrVariable(this, null);
  }
  return this.locals[name];
};

Context.prototype.getLocalType = function(name) {
  return this.getLocal(name).type;
};

Context.prototype.setLocalType = function(name, type) {
  this.locals[name].type = type;
  return this.locals[name].type;
};

Context.prototype.getLocalObject = function(name) {
  return this.getLocal(name).object;
};

Context.prototype.setLocalObject = function(name, object) {
  var objectClass = object.getClass();
  var variableType = this.locals[name].type;
  if (!objectClass.subClassOf(variableType)) {
    throw new errors.WardrobeTypeError(this, objectClass, variableType);
  }
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
  this.created = new Date().getTime();
  if (Runtime !== undefined) {
    var properties = this.cls.getInstanceProperties();
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

WardrobeObject.prototype.instanceOf = function(check) {
  if (typeof(check) == 'string') {
    check = Runtime.getClass(check);
  }
  return this.cls.subClassOf(check);
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
    case 'Nothing': str += 'nothing'; break;
    default: str = this.value; break;
   }
  
  } else {
    str = '<' + this.cls.name + ':';
    str += "{";
    var has_properties = false;
    for (var property in this.properties) {
      var object = this.getPropertyObject(property);
      if (object === null) {
        object = 'null';
      } else {
        object = object.toString();
      }
      str += property + ":" + object + ",";
      has_properties = true;
    }
    if (has_properties) {str = str.substring(0,str.length-1);}
    str += "}";
    str += '>';
  }
  return str;
};


WardrobeClass.prototype = new WardrobeObject(); 
WardrobeClass.prototype.constructor = WardrobeClass;
function WardrobeClass(name, super_class) {
  var cls = null;
  if (Runtime !== undefined) {
    cls = Runtime.getClass('Class');  
  }
  WardrobeObject.call(this, cls, null);

  this.super_class = super_class;
  this.name = name;
  this.methods = {};
  this.instance_properties = {};
}

WardrobeClass.prototype.subClassOf = function(cls) {
  var isSubClass = this === cls;
  if (!isSubClass && this.super_class !== null) {
    isSubClass = this.super_class.subClassOf(cls);
  }
  return isSubClass;
};

WardrobeClass.prototype.addMethod = function(method) {
  this.methods[method.name] = method;
  return method;
};

WardrobeClass.prototype.createMethod = function(name, params, body, type) {
  var method = new WardrobeMethod(name, params, body, type);
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

WardrobeClass.prototype.addInstanceProperty = function(name, type, object) {
  this.instance_properties[name] = {type: type, object: object};
};

WardrobeClass.prototype.setInstancePropertyObject = function(name, object) {
  this.instance_properties[name].object = object;
};

WardrobeClass.prototype.getInstanceProperties = function() {
  var properties = {};
  if (this.hasSuperClass()) {
    properties = this.getSuperClass().getInstanceProperties();
  }
  for (var property in this.instance_properties) {
    properties[property] = this.instance_properties[property];
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
  return obj;
};

WardrobeClass.prototype.installMethods = function() {
  this.methods['new'] = new WardrobeMethod(
    'new',
    [],
    {evaluate: function(context) {
      var current_class = context.getCurrentObject();
      var new_object = current_class.newObject();
      var constructor = current_class.getMethod('create');

      context.setCurrentObject(new_object);
      context = constructor.body.evaluate(context);

      new_object = context.getCurrentObject();

      context.setCurrentObject(current_class);
      context.setReturnObject(new_object);
      return context;
    }},
    {name: 'Object'}
  );
};

function WardrobeMethod(name, params, body, type) {
  this.name = name;
  this.params = params;
  this.body = body;
  this.type = type;
}

WardrobeMethod.prototype.call = function(context, receiver, args) { 
  var old_context = context.clone();
  var missing_params = [];
  var params_list = [];
  var param, name, type, arg;
  
  if (this.name == 'new') {
    this.params = receiver.getMethod('create').params;
  }

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
    if (old_context.hasLocal(name)) {
      context.setLocalType(name, old_context.getLocalType(name));
      context.setLocalObject(name, old_context.getLocalObject(name));
    } else {
      delete context.deleteLocal(name);
    }
  }

  context.setCurrentObject(old_context.getCurrentObject());
  context.setCurrentClass(old_context.getCurrentClass());
  
  if (this.name == 'new') {this.params = [];}

  return context;
};

WardrobeFunction.prototype = new WardrobeClass();
WardrobeFunction.prototype.constructor = WardrobeFunction;
function WardrobeFunction() {
  WardrobeClass.call(this, 'Function', Runtime.getClass('Object'));
}

WardrobeFunction.prototype.installMethods = function() {

};

WardrobeFunction.prototype.newObject = function(params, body, context) {
  return new WardrobeFunctionObject(params, body, context);
};

WardrobeFunctionObject.prototype = new WardrobeObject();
WardrobeFunctionObject.prototype.constructor = WardrobeFunctionObject;
function WardrobeFunctionObject(params, body, closure) {
  this.cls = Runtime.getClass('Function');
  this.value = {params: params, body: body};

  this.params = params;
  this.body = body;
  this.closure = closure.clone();
}

WardrobeFunctionObject.prototype.apply = function(context, args) { 
  var old_context = context;
  var closure = this.closure;
  for (name in context.locals) {
    if (closure.locals[name] === undefined) {
      closure.locals[name] = context.locals[name];
    }
  }
  context = closure;

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

  context.setCurrentObject(this);
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
  //for (p = 0; p < this.params.length; p++) {
    //name = this.params[p].identifier.name;
    //if (old_context.hasLocal(name)) {
      //context.setLocalType(name, old_context.getLocalType(name));
      //context.setLocalObject(name, old_context.getLocalObject(name));
    //} else {
      //delete context.deleteLocal(name);
    //}
  //}

  context.setCurrentObject(old_context.getCurrentObject());
  context.setCurrentClass(old_context.getCurrentClass());
  old_context.return_object = context.return_object;
  return old_context;
};

WardrobeObjectClass.prototype = new WardrobeClass();
WardrobeObjectClass.prototype.constructor = WardrobeObjectClass;
function WardrobeObjectClass() {
  WardrobeClass.call(this, 'Object', null);
}

WardrobeObjectClass.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'create', 
    [], 
    {evaluate: function(context) {
      return context;
    }},
    {name: 'Object'}
  ));
  this.addMethod(new WardrobeMethod(
    'toString', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('String').newObject(receiver.toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'String'}
  ));
  this.addMethod(new WardrobeMethod(
    'getClass',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = receiver.cls;
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Class'}
  ));
  this.addMethod(new WardrobeMethod(
    'belongsTo',
    [{type: {name: 'Class'}, identifier: {name: 'class'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var cls = context.getLocalObject('class');
      var belongs = receiver.getClass().subClassOf(cls);
      var object = Runtime.getGlobalObject(belongs.toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'equal',
    [{type: {name: 'Object'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object;
      if (receiver.value !== receiver && right.value !== right) {
        object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      } else {
        var equal = receiver.getClass() == right.getClass();
        equal = equal && receiver.created == right.created; 
        if (equal) {
          var property;
          for (property in receiver.properties) {
            equal = equal && receiver.properties[property] == right.properties[property]; 
          }
          for (property in right.properties) {
            equal = equal && receiver.properties[property] == right.properties[property]; 
          }
        }
        object = Runtime.getGlobalObject(equal.toString());
      }
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
};

WardrobeString.prototype = new WardrobeClass();
WardrobeString.prototype.constructor = WardrobeString;
function WardrobeString() {
  WardrobeClass.call(this, 'String', Runtime.getClass('Object'));
}

WardrobeString.prototype.newObject = function(string) {
  return new WardrobeObject(this, string);
};

WardrobeString.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'length', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').newObject(receiver.value.length);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'concat',
    [{type: {name: 'String'}, identifier: {name: 'with'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('with');
      var object = Runtime.getClass('String').newObject(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'String'}
  ));
  this.addMethod(new WardrobeMethod(
    'equal',
    [{type: {name: 'String'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
};

WardrobeNumber.prototype = new WardrobeClass();
WardrobeNumber.prototype.constructor = WardrobeNumber;
function WardrobeNumber() {
  WardrobeClass.call(this, 'Number', Runtime.getClass('Object'));
}

WardrobeNumber.prototype.newObject = function(number) {
  return new WardrobeObject(this, number);
};

WardrobeNumber.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'add', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'subtract', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value - right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'divide', 
    [{type: {name: 'Number'}, identifier: {name: 'right'}}], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value / right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'multiply',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value * right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'modulus',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('Number').newObject(receiver.value % right.value);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'equal',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'greaterThan',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value > right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'lessThan',
    [{type: {name: 'Number'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value < right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'positive',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(+receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'negative',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(-receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }},
    {name: 'Number'}
  ));
};

WardrobeBoolean.prototype = new WardrobeClass();
WardrobeBoolean.prototype.constructor = WardrobeBoolean;
function WardrobeBoolean() {
  WardrobeClass.call(this, 'Boolean', Runtime.getClass('Object'));
}

WardrobeBoolean.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'negate',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getGlobalObject((!receiver.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
};

WardrobeTrue.prototype = new WardrobeClass();
WardrobeTrue.prototype.constructor = WardrobeTrue;
function WardrobeTrue() {
  WardrobeClass.call(this, 'TrueBoolean', Runtime.getClass('Boolean'));
}

WardrobeTrue.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'and',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'equal',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
};

WardrobeTrue.prototype.newObject = function() {
  return new WardrobeObject(this, true);
};

WardrobeFalse.prototype = new WardrobeClass();
WardrobeFalse.prototype.constructor = WardrobeFalse;
function WardrobeFalse() {
  WardrobeClass.call(this, 'FalseBoolean', Runtime.getClass('Boolean'));
}

WardrobeFalse.prototype.newObject = function() {
  return new WardrobeObject(this, false);
};

WardrobeFalse.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'and',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('false'));
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context, receiver, args) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }},
    {name: 'Boolean'}
  ));
  this.addMethod(new WardrobeMethod(
    'equal',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobalObject((receiver.value == right.value).toString());
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Boolean'}
  ));
};

WardrobeList.prototype = new WardrobeClass();
WardrobeList.prototype.constructor = WardrobeList;
function WardrobeList() {
  WardrobeClass.call(this, 'List', Runtime.getClass('Object'));
}

WardrobeList.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'length',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('Number').newObject(receiver.value.length);
      context.setReturnObject(object);
      return context;
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
    'reverse',
    [],
    {evaluate: function(context) {
      context.getCurrentObject().value.reverse(); 
      context.setReturnObject(context.getCurrentObject());
      return context;
    }},
    {name: 'List'}
  ));
  this.addMethod(new WardrobeMethod(
    'concat',
    [{type: {name: 'List'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var right = context.getLocalObject('right');
      var concat = context.getCurrentObject().value.concat(right.value);
      context.getCurrentObject().value = concat;
      context.setReturnObject(context.getCurrentObject());
      return context;
    }},
    {name: 'List'}
  ));
  this.addMethod(new WardrobeMethod(
    'pop',
    [],
    {evaluate: function(context) {
      var item = context.getCurrentObject().value.pop();
      context.setReturnObject(item);
      return context;
    }},
    {name: 'Object'}
  ));
  this.addMethod(new WardrobeMethod(
    'push',
    [{type: {name: 'Object'}, identifier: {name: 'item'}}],
    {evaluate: function(context) {
      var item = context.getLocalObject('item');
      context.getCurrentObject().value.push(item);
      context.setReturnObject(item);
      return context;
    }},
    {name: 'Object'}
  ));
  this.addMethod(new WardrobeMethod(
    'get',
    [{type: {name: 'Number'}, identifier: {name: 'index'}}],
    {evaluate: function(context) {
      var index = context.getLocalObject('index');
      context.setReturnObject(context.getCurrentObject().value[index.value]);
      return context;
    }},
    {name: 'Object'}
  ));
  this.addMethod(new WardrobeMethod(
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
    }},
    {name: 'Object'}
  ));
  this.addMethod(new WardrobeMethod(
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
    }},
    {name: 'Number'}
  ));
  this.addMethod(new WardrobeMethod(
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
    }},
    {name: 'List'}
  ));
  this.addMethod(new WardrobeMethod(
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
    }},
    {name: 'List'}
  ));
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
  WardrobeClass.call(this, 'System', Runtime.getClass('Object'));
}

WardrobeSystem.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'print',
    [{type: {name: 'Object'}, identifier: {name: 'object'}}],
    {evaluate: function(context) {
      var obj = context.getLocalObject('object').value;
      if (typeof(window) != 'undefined') {
        logToConsole(obj);
      }
      console.log(obj.toString());
      return context;
    }},
    {name: 'Object'}
  ));
};

WardrobeSystem.prototype.newObject = function() {
  return new WardrobeObject(this, {});
};

WardrobeNothing.prototype = new WardrobeClass();
WardrobeNothing.prototype.constructor = WardrobeNothing;
function WardrobeNothing() {
  WardrobeClass.call(this, 'Nothing', Runtime.getClass('Object'));
}

WardrobeNothing.prototype.installMethods = function() {

};

WardrobeNothing.prototype.newObject = function() {
  return new WardrobeObject(this, {});
};

WardrobeNothing.prototype.subClassOf = function(cls) {
  return true;
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
Runtime.addClass('Nothing', new WardrobeNothing());
Runtime.addClass('System', new WardrobeSystem());

Runtime.getClass('Class').installMethods();
Runtime.getClass('Object').installMethods();
Runtime.getClass('String').installMethods();
Runtime.getClass('Number').installMethods();
Runtime.getClass('List').installMethods();
Runtime.getClass('Boolean').installMethods();
Runtime.getClass('TrueBoolean').installMethods();
Runtime.getClass('FalseBoolean').installMethods();
Runtime.getClass('Nothing').installMethods();
Runtime.getClass('System').installMethods();

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').newObject());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').newObject());
Runtime.addGlobal('system', Runtime.getClass('System').newObject());
Runtime.addGlobal('nothing', Runtime.getClass('Nothing').newObject());

exports.Runtime = Runtime;
exports.Context = Context;
}
require['../runtime'] = require['./runtime'];
require['./nodes/node'] = new function() {
  var exports = this;
  var Runtime = require('../runtime').Runtime;

var Node = function(kind) {
  this.kind = kind;
  this.ignore_in_trace = ['Program'];
};

Node.prototype.evaluate = function(context) {
  var nodeHooks = require('../interpreter').hooks[this.kind] || {};
  var beforeHook = nodeHooks.before || null;
  var afterHook = nodeHooks.after || null;

  if (beforeHook && typeof(beforeHook) == 'function') {beforeHook(context, Runtime, this);}

  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && this.ignore_in_trace.indexOf(this.kind) == -1) {
      error.addToStack(this);
    }
    throw error;
  }

  if (afterHook && typeof(afterHook) == 'function') {afterHook(context, Runtime, this);}

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
require['./nodes/declare'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Declare.prototype = new Node('Declare');
Declare.prototype.constructor = Declare;
function Declare (type, identifier, expression, range, text) {
  this.type = type;
  this.identifier = identifier;
  this.expression = expression;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var name = this.identifier.name;
    var type = Runtime.getClass(this.type.name);

    var isObjectProperty = context.current_class !== null;

    var assign = Runtime.getGlobalObject('nothing');
    if (this.expression !== null) {
      context = this.expression.evaluate(context);
      assign = context.getReturnObject();
    }

    // If we are within a class definition (i.e. current class is null), 
    // declare as an object property, otherwise declare as a local variable.
    if (isObjectProperty) {
      context.getCurrentClass().addInstanceProperty(name, type, assign);
    } else {
      context.addLocal(name, type, assign);
    }
    
    context.setReturnObject(assign);

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
function Function(type, params, block, range, text) {
  this.type = type;
  this.params = params;
  this.block = block;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    var func = Runtime.getClass('Function').newObject(this.params, this.block, context);
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
    if (context.getReturnObject() !== Runtime.getGlobalObject('false')) {
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
      context.getCurrentClass().createMethod(name, this.params, this.block, this.type);
    } else {
      throw "Must declare method within a class template";
    }

    return context; 
  };
}

exports.Method = Method;
}
require['./method'] = require['./nodes/method'];
require['./nodes/nothing'] = new function() {
  var exports = this;
  var Node = require('./node').Node;
var Runtime = require('../runtime').Runtime;

Nothing.prototype = new Node('Nothing');
Nothing.prototype.constructor = Nothing;
function Nothing(range, text) {
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    context.setReturnObject(Runtime.getGlobalObject('nothing'));
    return context;
  };
}

exports.Nothing = Nothing;
}
require['./nothing'] = require['./nodes/nothing'];
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
var Runtime = require('../runtime').Runtime;
var errors = require('../errors');

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
      right = context.getReturnObject();
      var args = {unary: context.getReturnObject()};

      var is_string = left.instanceOf('String');
      var is_number = left.instanceOf('Number');
      var is_boolean = left.instanceOf('Boolean');

      if (['&'].indexOf(this.operator) >= 0 && !is_string) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('String'));
      } else if (['+', '-', '*', '/', '%'].indexOf(this.operator) >= 0 && !is_number) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('Number'));
      } else if (['and', 'or'].indexOf(this.operator) >= 0 && !is_boolean) {
        throw new errors.WardrobeTypeError(context, left.getClass(), Runtime.getClass('Boolean'));
      }

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
        case '&': context = left.call(context, 'concat', args); break;
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
require['./nodes/program'] = new function() {
  var exports = this;
  var Node = require('./node').Node;

Program.prototype = new Node('Program');
Program.prototype.constructor = Program;
/*
 * 
 */
function Program(lines, range, text) {
  this.lines = lines;
  this.range = range;
  this.text = text;

  this.evaluateNode = function(context) {
    try {
      for (var l = 0; l < lines.length; l++) {
        var line = this.lines[l];
        context = line.evaluate(context);  
      }
    } catch(err) {
      if (err.kind !== undefined && err.kind == 'Return') {
        context = err.context;
      } else {
        throw err;
      }
    }

    return context;
  };
}

exports.Program = Program;
}
require['./program'] = require['./nodes/program'];
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
    if (current === null) {throw "No current object";}
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
    var falseObject = Runtime.getGlobalObject('false');
    while (context.getReturnObject() !== null && 
              context.getReturnObject() !== falseObject) {
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
  Nothing: require('./nodes/nothing').Nothing,
  Number: require('./nodes/number').Number,
  Operator: require('./nodes/operator').Operator,
  Param: require('./nodes/param').Param,
  Property: require('./nodes/property').Property,
  Program: require('./nodes/program').Program,
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
symbols_: {"error":2,"root":3,"EOF":4,"lines":5,"t":6,"NEWLINE":7,"block":8,"line":9,"statement":10,"expression":11,"COMMENT":12,"RETURN":13,"method":14,"bracketed":15,"assignable":16,"const":17,"declare":18,"assign":19,"literal":20,"this":21,"super":22,"constant":23,"class":24,"function":25,"call":26,"operation":27,"if":28,"for":29,"while":30,"(":31,")":32,"identifier":33,"=":34,"property":35,"list_accessor":36,"IDENT":37,".":38,"[":39,"]":40,"CONST":41,"NUMBER":42,"STRING":43,"TRUE":44,"FALSE":45,"NOTHING":46,"list":47,"list_items":48,"..":49,",":50,"THIS":51,"SUPER":52,"arguments":53,"CLASS":54,"class_block":55,"END":56,"EXTENDS":57,"class_lines":58,"class_line":59,"METHOD":60,"params":61,"->":62,"FUNCTION":63,"unary_argument":64,"named_arguments":65,":":66,"+":67,"-":68,"!":69,"&":70,"MATH":71,"COMP":72,"LOGIC":73,"IF":74,"ELSE":75,"WHILE":76,"DO":77,"FOR":78,"IN":79,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",12:"COMMENT",13:"RETURN",17:"const",31:"(",32:")",34:"=",37:"IDENT",38:".",39:"[",40:"]",41:"CONST",42:"NUMBER",43:"STRING",44:"TRUE",45:"FALSE",46:"NOTHING",49:"..",50:",",51:"THIS",52:"SUPER",54:"CLASS",56:"END",57:"EXTENDS",60:"METHOD",62:"->",63:"FUNCTION",66:":",67:"+",68:"-",69:"!",70:"&",71:"MATH",72:"COMP",73:"LOGIC",74:"IF",75:"ELSE",76:"WHILE",77:"DO",78:"FOR",79:"IN"},
productions_: [0,[3,1],[3,2],[6,1],[8,3],[5,1],[5,3],[9,1],[9,1],[10,1],[10,2],[10,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[15,3],[18,2],[18,4],[19,3],[16,1],[16,1],[16,1],[33,1],[35,3],[36,4],[23,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[47,3],[47,5],[48,0],[48,1],[48,3],[21,1],[22,6],[24,4],[24,6],[55,3],[58,1],[58,3],[59,1],[59,1],[14,7],[14,9],[25,8],[25,9],[61,0],[61,2],[61,4],[26,6],[26,4],[53,0],[53,1],[53,1],[64,1],[65,3],[65,5],[27,2],[27,2],[27,2],[27,3],[27,3],[27,3],[27,3],[27,3],[27,3],[28,4],[28,6],[28,5],[30,5],[29,7],[29,7]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return new yy.Program([]);
break;
case 2:return new yy.Program($$[$0-1]);
break;
case 3:this.$ = $$[$0];
break;
case 4:this.$ = new yy.Block($$[$0-1], this._$, yytext);
break;
case 5:this.$ = [$$[$0]];
break;
case 6:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
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
case 27:this.$ = $$[$0];
break;
case 28:this.$ = $$[$0-1];
break;
case 29:this.$ = new yy.Declare($$[$0-1], $$[$0], null, this._$, yytext);
break;
case 30:this.$ = new yy.Declare($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 31:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 32:this.$ = $$[$0];
break;
case 33:this.$ = $$[$0];
break;
case 34:this.$ = $$[$0];
break;
case 35:this.$ = new yy.Identifier($$[$0], this._$, yytext);
break;
case 36:this.$ = new yy.Property($$[$0-2], $$[$0], this._$, yytext);
break;
case 37:this.$ = new yy.ListAccessor($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 38:this.$ = new yy.Constant($$[$0], this._$, yytext);
break;
case 39:this.$ = new yy.Number($$[$0], this._$, yytext);
break;
case 40:this.$ = new yy.String($$[$0], this._$, yytext);
break;
case 41:this.$ = new yy.True(this._$, yytext);
break;
case 42:this.$ = new yy.False(this._$, yytext);
break;
case 43:this.$ = new yy.Nothing(this._$, yytext);
break;
case 44:this.$ = $$[$0];
break;
case 45:this.$ = new yy.List($$[$0-1]);
break;
case 46:this.$ = new yy.ListRange($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 47:this.$ = [];
break;
case 48:this.$ = [$$[$0]];
break;
case 49:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 50:this.$ = new yy.This(this._$, yytext);
break;
case 51:
break;
case 52:this.$ = new yy.Class($$[$0-2], null, $$[$0-1], this._$, yytext);
break;
case 53:this.$ = new yy.Class($$[$0-4], $$[$0-2], $$[$0-1], this._$, yytext);
break;
case 54:this.$ = new yy.Block($$[$0-1], this._$, yytext);
break;
case 55:this.$ = [$$[$0]];
break;
case 56:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 57:this.$ = $$[$0];
break;
case 58:this.$ = $$[$0];
break;
case 59:this.$ = new yy.Method(null, $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 60:this.$ = new yy.Method($$[$0-3], $$[$0-7], $$[$0-5], $$[$0-2], this._$, yytext);
break;
case 61:this.$ = new yy.Function($$[$0-2], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 62:this.$ = new yy.Declare(new yy.Constant("Function"), $$[$0-7], new yy.Function($$[$0-2], $$[$0-5], $$[$0-1], this._$, yytext), this._$, yytext);
break;
case 63:this.$ = [];
break;
case 64:this.$ = [new yy.Param($$[$0-1], $$[$0])];
break;
case 65:this.$ = $$[$0-3]; $$[$0-3].push(new yy.Param($$[$0-1], $$[$0], this._$, yytext));
break;
case 66:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 67:this.$ = new yy.Call($$[$0-3], null, $$[$0-1], this._$, yytext);
break;
case 68:this.$ = [];
break;
case 69:this.$ = $$[$0];
break;
case 70:this.$ = $$[$0];
break;
case 71:this.$ = [new yy.Argument(new yy.Identifier("unary", this._$, yytext), $$[$0], this._$, yytext)];
break;
case 72:this.$ = [new yy.Argument($$[$0-2], $$[$0], this._$, yytext)];
break;
case 73:this.$ = $$[$0-4]; $$[$0-4].push(new yy.Argument($$[$0-2], $$[$0], this._$, yytext));
break;
case 74:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 75:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 76:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 77:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 78:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 79:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 80:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 81:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 82:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 83:this.$ = new yy.If($$[$0-2], $$[$0-1], null, this._$, yytext);
break;
case 84:this.$ = new yy.If($$[$0-4], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 85:this.$ = new yy.If($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 86:this.$ = new yy.While($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 87:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 88:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
}
},
table: [{3:1,4:[1,2],5:3,9:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],60:[1,26],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{1:[3]},{1:[2,1]},{4:[1,49],6:50,7:[1,51]},{4:[2,5],7:[2,5]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{4:[2,9],7:[2,9]},{11:61,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,11],7:[2,11]},{4:[2,12],7:[2,12],31:[2,12],32:[2,12],38:[2,12],39:[2,12],40:[2,12],49:[2,12],50:[2,12],67:[2,12],68:[2,12],70:[2,12],71:[2,12],72:[2,12],73:[2,12],77:[2,12],79:[2,12]},{4:[2,13],7:[2,13],31:[2,13],32:[2,13],34:[1,62],38:[2,13],39:[2,13],40:[2,13],49:[2,13],50:[2,13],67:[2,13],68:[2,13],70:[2,13],71:[2,13],72:[2,13],73:[2,13],77:[2,13],79:[2,13]},{4:[2,14],7:[2,14],31:[2,14],32:[2,14],38:[2,14],39:[2,14],40:[2,14],49:[2,14],50:[2,14],67:[2,14],68:[2,14],70:[2,14],71:[2,14],72:[2,14],73:[2,14],77:[2,14],79:[2,14]},{4:[2,15],7:[2,15],31:[2,15],32:[2,15],38:[2,15],39:[2,15],40:[2,15],49:[2,15],50:[2,15],67:[2,15],68:[2,15],70:[2,15],71:[2,15],72:[2,15],73:[2,15],77:[2,15],79:[2,15]},{4:[2,16],7:[2,16],31:[2,16],32:[2,16],38:[2,16],39:[2,16],40:[2,16],49:[2,16],50:[2,16],67:[2,16],68:[2,16],70:[2,16],71:[2,16],72:[2,16],73:[2,16],77:[2,16],79:[2,16]},{4:[2,17],7:[2,17],31:[2,17],32:[2,17],38:[2,17],39:[2,17],40:[2,17],49:[2,17],50:[2,17],67:[2,17],68:[2,17],70:[2,17],71:[2,17],72:[2,17],73:[2,17],77:[2,17],79:[2,17]},{4:[2,18],7:[2,18],31:[2,18],32:[2,18],38:[2,18],39:[2,18],40:[2,18],49:[2,18],50:[2,18],67:[2,18],68:[2,18],70:[2,18],71:[2,18],72:[2,18],73:[2,18],77:[2,18],79:[2,18]},{4:[2,19],7:[2,19],31:[2,19],32:[2,19],38:[2,19],39:[2,19],40:[2,19],49:[2,19],50:[2,19],67:[2,19],68:[2,19],70:[2,19],71:[2,19],72:[2,19],73:[2,19],77:[2,19],79:[2,19]},{4:[2,20],7:[2,20],31:[2,20],32:[2,20],33:63,37:[1,47],38:[2,20],39:[2,20],40:[2,20],49:[2,20],50:[2,20],67:[2,20],68:[2,20],70:[2,20],71:[2,20],72:[2,20],73:[2,20],77:[2,20],79:[2,20]},{4:[2,21],7:[2,21],31:[2,21],32:[2,21],38:[2,21],39:[2,21],40:[2,21],49:[2,21],50:[2,21],67:[2,21],68:[2,21],70:[2,21],71:[2,21],72:[2,21],73:[2,21],77:[2,21],79:[2,21]},{4:[2,22],7:[2,22],31:[2,22],32:[2,22],38:[2,22],39:[2,22],40:[2,22],49:[2,22],50:[2,22],67:[2,22],68:[2,22],70:[2,22],71:[2,22],72:[2,22],73:[2,22],77:[2,22],79:[2,22]},{4:[2,23],7:[2,23],31:[2,23],32:[2,23],38:[2,23],39:[2,23],40:[2,23],49:[2,23],50:[2,23],67:[2,23],68:[2,23],70:[2,23],71:[2,23],72:[2,23],73:[2,23],77:[2,23],79:[2,23]},{4:[2,24],7:[2,24],31:[2,24],32:[2,24],38:[2,24],39:[2,24],40:[2,24],49:[2,24],50:[2,24],67:[2,24],68:[2,24],70:[2,24],71:[2,24],72:[2,24],73:[2,24],77:[2,24],79:[2,24]},{4:[2,25],7:[2,25],31:[2,25],32:[2,25],38:[2,25],39:[2,25],40:[2,25],49:[2,25],50:[2,25],67:[2,25],68:[2,25],70:[2,25],71:[2,25],72:[2,25],73:[2,25],77:[2,25],79:[2,25]},{4:[2,26],7:[2,26],31:[2,26],32:[2,26],38:[2,26],39:[2,26],40:[2,26],49:[2,26],50:[2,26],67:[2,26],68:[2,26],70:[2,26],71:[2,26],72:[2,26],73:[2,26],77:[2,26],79:[2,26]},{4:[2,27],7:[2,27],31:[2,27],32:[2,27],38:[2,27],39:[2,27],40:[2,27],49:[2,27],50:[2,27],67:[2,27],68:[2,27],70:[2,27],71:[2,27],72:[2,27],73:[2,27],77:[2,27],79:[2,27]},{33:64,37:[1,47]},{11:65,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,32],7:[2,32],31:[2,32],32:[2,32],34:[2,32],38:[2,32],39:[2,32],40:[2,32],49:[2,32],50:[2,32],67:[2,32],68:[2,32],70:[2,32],71:[2,32],72:[2,32],73:[2,32],77:[2,32],79:[2,32]},{4:[2,33],7:[2,33],31:[2,33],32:[2,33],34:[2,33],38:[2,33],39:[2,33],40:[2,33],49:[2,33],50:[2,33],67:[2,33],68:[2,33],70:[2,33],71:[2,33],72:[2,33],73:[2,33],77:[2,33],79:[2,33]},{4:[2,34],7:[2,34],31:[2,34],32:[2,34],34:[2,34],38:[2,34],39:[2,34],40:[2,34],49:[2,34],50:[2,34],67:[2,34],68:[2,34],70:[2,34],71:[2,34],72:[2,34],73:[2,34],77:[2,34],79:[2,34]},{4:[2,39],7:[2,39],31:[2,39],32:[2,39],38:[2,39],39:[2,39],40:[2,39],49:[2,39],50:[2,39],67:[2,39],68:[2,39],70:[2,39],71:[2,39],72:[2,39],73:[2,39],77:[2,39],79:[2,39]},{4:[2,40],7:[2,40],31:[2,40],32:[2,40],38:[2,40],39:[2,40],40:[2,40],49:[2,40],50:[2,40],67:[2,40],68:[2,40],70:[2,40],71:[2,40],72:[2,40],73:[2,40],77:[2,40],79:[2,40]},{4:[2,41],7:[2,41],31:[2,41],32:[2,41],38:[2,41],39:[2,41],40:[2,41],49:[2,41],50:[2,41],67:[2,41],68:[2,41],70:[2,41],71:[2,41],72:[2,41],73:[2,41],77:[2,41],79:[2,41]},{4:[2,42],7:[2,42],31:[2,42],32:[2,42],38:[2,42],39:[2,42],40:[2,42],49:[2,42],50:[2,42],67:[2,42],68:[2,42],70:[2,42],71:[2,42],72:[2,42],73:[2,42],77:[2,42],79:[2,42]},{4:[2,43],7:[2,43],31:[2,43],32:[2,43],38:[2,43],39:[2,43],40:[2,43],49:[2,43],50:[2,43],67:[2,43],68:[2,43],70:[2,43],71:[2,43],72:[2,43],73:[2,43],77:[2,43],79:[2,43]},{4:[2,44],7:[2,44],31:[2,44],32:[2,44],38:[2,44],39:[2,44],40:[2,44],49:[2,44],50:[2,44],67:[2,44],68:[2,44],70:[2,44],71:[2,44],72:[2,44],73:[2,44],77:[2,44],79:[2,44]},{4:[2,50],7:[2,50],31:[2,50],32:[2,50],38:[2,50],39:[2,50],40:[2,50],49:[2,50],50:[2,50],67:[2,50],68:[2,50],70:[2,50],71:[2,50],72:[2,50],73:[2,50],77:[2,50],79:[2,50]},{4:[2,38],7:[2,38],31:[2,38],32:[2,38],37:[2,38],38:[2,38],39:[2,38],40:[2,38],49:[2,38],50:[2,38],57:[2,38],67:[2,38],68:[2,38],70:[2,38],71:[2,38],72:[2,38],73:[2,38],77:[2,38],79:[2,38]},{23:67,41:[1,38]},{31:[1,68],33:69,37:[1,47]},{11:70,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:71,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:72,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:73,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{18:75,23:76,33:74,37:[1,47],41:[1,38]},{11:77,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,35],7:[2,35],31:[2,35],32:[2,35],34:[2,35],38:[2,35],39:[2,35],40:[2,35],49:[2,35],50:[2,35],66:[2,35],67:[2,35],68:[2,35],70:[2,35],71:[2,35],72:[2,35],73:[2,35],77:[2,35],79:[2,35]},{11:79,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],40:[2,47],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,48:78,50:[2,47],51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{1:[2,2]},{9:80,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],60:[1,26],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{12:[2,3],13:[2,3],17:[2,3],31:[2,3],37:[2,3],39:[2,3],41:[2,3],42:[2,3],43:[2,3],44:[2,3],45:[2,3],46:[2,3],51:[2,3],54:[2,3],56:[2,3],60:[2,3],63:[2,3],67:[2,3],68:[2,3],69:[2,3],74:[2,3],75:[2,3],76:[2,3],78:[2,3]},{33:81,37:[1,47]},{11:85,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],32:[2,68],33:86,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],53:82,54:[1,39],63:[1,40],64:83,65:84,67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:87,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:88,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:89,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:90,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:91,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:92,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:93,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,10],7:[2,10],31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{11:94,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,29],7:[2,29],31:[2,29],32:[2,29],34:[1,95],38:[2,29],39:[2,29],40:[2,29],49:[2,29],50:[2,29],67:[2,29],68:[2,29],70:[2,29],71:[2,29],72:[2,29],73:[2,29],77:[2,29],79:[2,29]},{31:[1,96]},{31:[1,53],32:[1,97],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{52:[1,98]},{6:101,7:[1,51],55:99,57:[1,100]},{23:103,32:[2,63],41:[1,38],50:[2,63],61:102},{31:[1,104]},{4:[2,74],7:[2,74],31:[1,53],32:[2,74],38:[1,52],39:[1,60],40:[2,74],49:[2,74],50:[2,74],67:[2,74],68:[2,74],70:[2,74],71:[1,57],72:[2,74],73:[1,59],77:[2,74],79:[2,74]},{4:[2,75],7:[2,75],31:[1,53],32:[2,75],38:[1,52],39:[1,60],40:[2,75],49:[2,75],50:[2,75],67:[2,75],68:[2,75],70:[2,75],71:[1,57],72:[2,75],73:[1,59],77:[2,75],79:[2,75]},{4:[2,76],7:[2,76],31:[1,53],32:[2,76],38:[1,52],39:[1,60],40:[2,76],49:[2,76],50:[2,76],67:[2,76],68:[2,76],70:[2,76],71:[1,57],72:[2,76],73:[1,59],77:[2,76],79:[2,76]},{6:106,7:[1,51],8:105,31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{79:[1,107]},{79:[1,108]},{33:63,37:[1,47]},{31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59],77:[1,109]},{40:[1,110],50:[1,111]},{31:[1,53],38:[1,52],39:[1,60],40:[2,48],49:[1,112],50:[2,48],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{4:[2,6],7:[2,6]},{4:[2,36],7:[2,36],31:[1,113],32:[2,36],34:[2,36],38:[2,36],39:[2,36],40:[2,36],49:[2,36],50:[2,36],67:[2,36],68:[2,36],70:[2,36],71:[2,36],72:[2,36],73:[2,36],77:[2,36],79:[2,36]},{32:[1,114]},{32:[2,69]},{32:[2,70],50:[1,115]},{31:[1,53],32:[2,71],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{31:[2,32],32:[2,32],34:[2,32],38:[2,32],39:[2,32],66:[1,116],67:[2,32],68:[2,32],70:[2,32],71:[2,32],72:[2,32],73:[2,32]},{4:[2,77],7:[2,77],31:[1,53],32:[2,77],38:[1,52],39:[1,60],40:[2,77],49:[2,77],50:[2,77],67:[2,77],68:[2,77],70:[2,77],71:[1,57],72:[2,77],73:[1,59],77:[2,77],79:[2,77]},{4:[2,78],7:[2,78],31:[1,53],32:[2,78],38:[1,52],39:[1,60],40:[2,78],49:[2,78],50:[2,78],67:[2,78],68:[2,78],70:[2,78],71:[1,57],72:[2,78],73:[1,59],77:[2,78],79:[2,78]},{4:[2,79],7:[2,79],31:[1,53],32:[2,79],38:[1,52],39:[1,60],40:[2,79],49:[2,79],50:[2,79],67:[2,79],68:[2,79],70:[2,79],71:[1,57],72:[2,79],73:[1,59],77:[2,79],79:[2,79]},{4:[2,80],7:[2,80],31:[1,53],32:[2,80],38:[1,52],39:[1,60],40:[2,80],49:[2,80],50:[2,80],67:[2,80],68:[2,80],70:[2,80],71:[2,80],72:[2,80],73:[1,59],77:[2,80],79:[2,80]},{4:[2,81],7:[2,81],31:[1,53],32:[2,81],38:[1,52],39:[1,60],40:[2,81],49:[2,81],50:[2,81],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[2,81],73:[1,59],77:[2,81],79:[2,81]},{4:[2,82],7:[2,82],31:[1,53],32:[2,82],38:[1,52],39:[1,60],40:[2,82],49:[2,82],50:[2,82],67:[2,82],68:[2,82],70:[2,82],71:[2,82],72:[2,82],73:[2,82],77:[2,82],79:[2,82]},{31:[1,53],38:[1,52],39:[1,60],40:[1,117],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{4:[2,31],7:[2,31],31:[1,53],32:[2,31],38:[1,52],39:[1,60],40:[2,31],49:[2,31],50:[2,31],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59],77:[2,31],79:[2,31]},{11:118,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{23:103,32:[2,63],41:[1,38],50:[2,63],61:119},{4:[2,28],7:[2,28],31:[2,28],32:[2,28],38:[2,28],39:[2,28],40:[2,28],49:[2,28],50:[2,28],67:[2,28],68:[2,28],70:[2,28],71:[2,28],72:[2,28],73:[2,28],77:[2,28],79:[2,28]},{31:[1,120]},{56:[1,121]},{23:122,41:[1,38]},{14:125,18:126,23:76,41:[1,38],58:123,59:124,60:[1,26]},{32:[1,127],50:[1,128]},{33:129,37:[1,47]},{23:103,32:[2,63],41:[1,38],50:[2,63],61:130},{56:[1,131],75:[1,132]},{5:133,9:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],60:[1,26],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:134,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:135,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{6:106,7:[1,51],8:136},{4:[2,45],7:[2,45],31:[2,45],32:[2,45],38:[2,45],39:[2,45],40:[2,45],49:[2,45],50:[2,45],67:[2,45],68:[2,45],70:[2,45],71:[2,45],72:[2,45],73:[2,45],77:[2,45],79:[2,45]},{11:137,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:138,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{11:85,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],32:[2,68],33:86,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],53:139,54:[1,39],63:[1,40],64:83,65:84,67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,67],7:[2,67],31:[2,67],32:[2,67],38:[2,67],39:[2,67],40:[2,67],49:[2,67],50:[2,67],67:[2,67],68:[2,67],70:[2,67],71:[2,67],72:[2,67],73:[2,67],77:[2,67],79:[2,67]},{33:140,37:[1,47]},{11:141,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,37],7:[2,37],31:[2,37],32:[2,37],34:[2,37],38:[2,37],39:[2,37],40:[2,37],49:[2,37],50:[2,37],67:[2,37],68:[2,37],70:[2,37],71:[2,37],72:[2,37],73:[2,37],77:[2,37],79:[2,37]},{4:[2,30],7:[2,30],31:[1,53],32:[2,30],38:[1,52],39:[1,60],40:[2,30],49:[2,30],50:[2,30],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59],77:[2,30],79:[2,30]},{32:[1,142],50:[1,128]},{11:85,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],32:[2,68],33:86,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],53:143,54:[1,39],63:[1,40],64:83,65:84,67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{4:[2,52],7:[2,52],31:[2,52],32:[2,52],38:[2,52],39:[2,52],40:[2,52],49:[2,52],50:[2,52],67:[2,52],68:[2,52],70:[2,52],71:[2,52],72:[2,52],73:[2,52],77:[2,52],79:[2,52]},{6:101,7:[1,51],55:144},{6:145,7:[1,51]},{7:[2,55]},{7:[2,57]},{7:[2,58]},{62:[1,146]},{23:147,41:[1,38]},{32:[2,64],50:[2,64]},{32:[1,148],50:[1,128]},{4:[2,83],7:[2,83],31:[2,83],32:[2,83],38:[2,83],39:[2,83],40:[2,83],49:[2,83],50:[2,83],67:[2,83],68:[2,83],70:[2,83],71:[2,83],72:[2,83],73:[2,83],77:[2,83],79:[2,83]},{6:106,7:[1,51],8:149,28:150,74:[1,44]},{6:151,7:[1,51]},{31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59],77:[1,152]},{31:[1,53],38:[1,52],39:[1,60],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59],77:[1,153]},{56:[1,154]},{31:[1,53],38:[1,52],39:[1,60],40:[2,49],50:[2,49],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{31:[1,53],38:[1,52],39:[1,60],40:[1,155],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{32:[1,156]},{66:[1,157]},{31:[1,53],32:[2,72],38:[1,52],39:[1,60],50:[2,72],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{6:106,7:[1,51],8:158,62:[1,159]},{32:[1,160]},{56:[1,161]},{14:125,18:126,23:76,41:[1,38],56:[2,54],59:162,60:[1,26]},{23:163,41:[1,38]},{33:164,37:[1,47]},{62:[1,165]},{56:[1,166]},{4:[2,85],7:[2,85],31:[2,85],32:[2,85],38:[2,85],39:[2,85],40:[2,85],49:[2,85],50:[2,85],67:[2,85],68:[2,85],70:[2,85],71:[2,85],72:[2,85],73:[2,85],77:[2,85],79:[2,85]},{9:80,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],56:[2,4],60:[1,26],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],75:[2,4],76:[1,46],78:[1,45]},{6:106,7:[1,51],8:167},{6:106,7:[1,51],8:168},{4:[2,86],7:[2,86],31:[2,86],32:[2,86],38:[2,86],39:[2,86],40:[2,86],49:[2,86],50:[2,86],67:[2,86],68:[2,86],70:[2,86],71:[2,86],72:[2,86],73:[2,86],77:[2,86],79:[2,86]},{4:[2,46],7:[2,46],31:[2,46],32:[2,46],38:[2,46],39:[2,46],40:[2,46],49:[2,46],50:[2,46],67:[2,46],68:[2,46],70:[2,46],71:[2,46],72:[2,46],73:[2,46],77:[2,46],79:[2,46]},{4:[2,66],7:[2,66],31:[2,66],32:[2,66],38:[2,66],39:[2,66],40:[2,66],49:[2,66],50:[2,66],67:[2,66],68:[2,66],70:[2,66],71:[2,66],72:[2,66],73:[2,66],77:[2,66],79:[2,66]},{11:169,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:25,31:[1,27],33:28,35:29,36:30,37:[1,47],39:[1,48],41:[1,38],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:[1,35],47:36,51:[1,37],54:[1,39],63:[1,40],67:[1,41],68:[1,42],69:[1,43],74:[1,44],76:[1,46],78:[1,45]},{56:[1,170]},{23:171,41:[1,38]},{4:[2,51],7:[2,51],31:[2,51],32:[2,51],38:[2,51],39:[2,51],40:[2,51],49:[2,51],50:[2,51],67:[2,51],68:[2,51],70:[2,51],71:[2,51],72:[2,51],73:[2,51],77:[2,51],79:[2,51]},{4:[2,53],7:[2,53],31:[2,53],32:[2,53],38:[2,53],39:[2,53],40:[2,53],49:[2,53],50:[2,53],67:[2,53],68:[2,53],70:[2,53],71:[2,53],72:[2,53],73:[2,53],77:[2,53],79:[2,53]},{7:[2,56]},{6:106,7:[1,51],8:172},{32:[2,65],50:[2,65]},{23:173,41:[1,38]},{4:[2,84],7:[2,84],31:[2,84],32:[2,84],38:[2,84],39:[2,84],40:[2,84],49:[2,84],50:[2,84],67:[2,84],68:[2,84],70:[2,84],71:[2,84],72:[2,84],73:[2,84],77:[2,84],79:[2,84]},{56:[1,174]},{56:[1,175]},{31:[1,53],32:[2,73],38:[1,52],39:[1,60],50:[2,73],67:[1,54],68:[1,55],70:[1,56],71:[1,57],72:[1,58],73:[1,59]},{4:[2,59],7:[2,59]},{6:106,7:[1,51],8:176},{56:[1,177]},{6:106,7:[1,51],8:178},{4:[2,87],7:[2,87],31:[2,87],32:[2,87],38:[2,87],39:[2,87],40:[2,87],49:[2,87],50:[2,87],67:[2,87],68:[2,87],70:[2,87],71:[2,87],72:[2,87],73:[2,87],77:[2,87],79:[2,87]},{4:[2,88],7:[2,88],31:[2,88],32:[2,88],38:[2,88],39:[2,88],40:[2,88],49:[2,88],50:[2,88],67:[2,88],68:[2,88],70:[2,88],71:[2,88],72:[2,88],73:[2,88],77:[2,88],79:[2,88]},{56:[1,179]},{4:[2,61],7:[2,61],31:[2,61],32:[2,61],38:[2,61],39:[2,61],40:[2,61],49:[2,61],50:[2,61],67:[2,61],68:[2,61],70:[2,61],71:[2,61],72:[2,61],73:[2,61],77:[2,61],79:[2,61]},{56:[1,180]},{4:[2,60],7:[2,60]},{4:[2,62],7:[2,62],31:[2,62],32:[2,62],38:[2,62],39:[2,62],40:[2,62],49:[2,62],50:[2,62],67:[2,62],68:[2,62],70:[2,62],71:[2,62],72:[2,62],73:[2,62],77:[2,62],79:[2,62]}],
defaultActions: {2:[2,1],49:[2,2],83:[2,69],124:[2,55],125:[2,57],126:[2,58],162:[2,56]},
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

function run(ast, hooks) {
  if (!hooks) {hooks = {};}
  exports.hooks = hooks;
  var context = new Context();
  context = ast.evaluate(context);
  return context;
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

function run(source, debug, hooks) {
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
  context = interpreter.run(ast, hooks);
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