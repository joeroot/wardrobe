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

WardrobeTypeError.prototype = new WardrobeRuntimeError('NoSuchParameter');
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
  operator: /!\=|!|\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*|\%|\=/,
  number: /[0-9]+(\.[0-9]+)?/,
  string: /"(.*?)"|'(.*?)'/,
  newline: /((\s)*\n|(\s)*\r)+/
};

var keywords = ['this', 'class', 'extends', 'function', 'method', 'if', 'then', 'else', 'for', 'in', 'while', 'do', 'end', 'return', 'true', 'false', 'nothing'];

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
    }}
  );
};

function WardrobeMethod(name, params, body) {
  this.name = name;
  this.params = params;
  this.body = body;
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
    if (old_context.hasLocal(name)) {
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
  WardrobeClass.call(this, 'Object', null);
}

WardrobeObjectClass.prototype.installMethods = function() {
  this.addMethod(new WardrobeMethod(
    'create', 
    [], 
    {evaluate: function(context) {
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'toString', 
    [], 
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = Runtime.getClass('String').newObject(receiver.toString());
      context.setReturnObject(object);
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'getClass',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var object = receiver.cls;
      context.setReturnObject(object);
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'belongsTo',
    [{type: {name: 'Class'}, identifier: {name: 'cls'}}],
    {evaluate: function(context) {
      console.log("hey there");
      var receiver = context.getCurrentObject();
      var cls = context.getLocalObject('cls');
      var belongs = receiver.getClass().subClassOf(cls);
      var object = Runtime.getGlobalObject(belongs.toString());
      context.setReturnObject(object);
      return context;
    }}
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
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'concat',
    [{type: {name: 'String'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getClass('String').newObject(receiver.value + right.value);
      context.setReturnObject(object);
      return context;
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'positive',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(+receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'negative',
    [],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      receiver.setValue(-receiver.getValue());
      context.setReturnObject(receiver);
      return context;
    }}
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
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobalObject('true'));
      return context;
    }}
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
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'or',
    [{type: {name: 'Boolean'}, identifier: {name: 'right'}}],
    {evaluate: function(context, receiver, args) {
      var right = context.getLocalObject('right');
      context.setReturnObject(right);
      return context;
    }}
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
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'reverse',
    [],
    {evaluate: function(context) {
      context.getCurrentObject().value.reverse(); 
      context.setReturnObject(context.getCurrentObject());
      return context;
    }}
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
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'pop',
    [],
    {evaluate: function(context) {
      var item = context.getCurrentObject().value.pop();
      context.setReturnObject(item);
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'push',
    [{type: {name: 'Object'}, identifier: {name: 'item'}}],
    {evaluate: function(context) {
      var item = context.getLocalObject('item');
      context.getCurrentObject().value.push(item);
      context.setReturnObject(item);
      return context;
    }}
  ));
  this.addMethod(new WardrobeMethod(
    'get',
    [{type: {name: 'Number'}, identifier: {name: 'index'}}],
    {evaluate: function(context) {
      var index = context.getLocalObject('index');
      context.setReturnObject(context.getCurrentObject().value[index.value]);
      return context;
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
    }}
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
  var Node = function(kind) {
  this.kind = kind;
  this.ignore = ['Program'];
};

Node.prototype.evaluate = function(context) {
  var nodeHooks = require('../interpreter').hooks[this.kind] || {};
  var beforeHook = nodeHooks.before || null;
  var afterHook = nodeHooks.after || null;

  if (beforeHook && typeof(beforeHook) == 'function') {beforeHook(context, this);}

  try {
    context = this.evaluateNode(context);
  } catch(error) {
    if (error.is_wardrobe_error && this.ignore.indexOf(this.kind) == -1) {
      error.addToStack(this);
    }
    throw error;
  }

  if (afterHook && typeof(afterHook) == 'function') {afterHook(context, this);}

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
    var func = Runtime.getClass('Function').newObject(this.params, this.block);
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
        case '+': 
          if (left.instanceOf('Number') && right.instanceOf('Number')) {
            context = left.call(context, 'add', args); 
          } else if (left.instanceOf('String') && right.instanceOf('String')) {
            context = left.call(context, 'concat', args);
          }
          break;
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
symbols_: {"error":2,"root":3,"EOF":4,"lines":5,"t":6,"NEWLINE":7,"block":8,"line":9,"statement":10,"expression":11,"COMMENT":12,"RETURN":13,"method":14,"bracketed":15,"assignable":16,"const":17,"declare":18,"assign":19,"literal":20,"this":21,"constant":22,"class":23,"function":24,"call":25,"operation":26,"if":27,"for":28,"while":29,"(":30,")":31,"identifier":32,"=":33,"property":34,"list_accessor":35,"IDENT":36,".":37,"[":38,"]":39,"CONST":40,"NUMBER":41,"STRING":42,"TRUE":43,"FALSE":44,"NOTHING":45,"list":46,"list_items":47,"..":48,",":49,"THIS":50,"CLASS":51,"class_block":52,"END":53,"EXTENDS":54,"class_lines":55,"class_line":56,"METHOD":57,"params":58,"->":59,"FUNCTION":60,"arguments":61,"unary_argument":62,"named_arguments":63,":":64,"+":65,"-":66,"!":67,"MATH":68,"COMP":69,"LOGIC":70,"IF":71,"ELSE":72,"WHILE":73,"DO":74,"FOR":75,"IN":76,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",12:"COMMENT",13:"RETURN",17:"const",30:"(",31:")",33:"=",36:"IDENT",37:".",38:"[",39:"]",40:"CONST",41:"NUMBER",42:"STRING",43:"TRUE",44:"FALSE",45:"NOTHING",48:"..",49:",",50:"THIS",51:"CLASS",53:"END",54:"EXTENDS",57:"METHOD",59:"->",60:"FUNCTION",64:":",65:"+",66:"-",67:"!",68:"MATH",69:"COMP",70:"LOGIC",71:"IF",72:"ELSE",73:"WHILE",74:"DO",75:"FOR",76:"IN"},
productions_: [0,[3,1],[3,2],[6,1],[8,3],[5,1],[5,3],[9,1],[9,1],[10,1],[10,2],[10,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[11,1],[15,3],[18,2],[18,4],[19,3],[16,1],[16,1],[16,1],[32,1],[34,3],[35,4],[22,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[46,3],[46,5],[47,0],[47,1],[47,3],[21,1],[23,4],[23,6],[52,3],[55,1],[55,3],[56,1],[56,1],[14,7],[14,9],[24,8],[24,9],[58,0],[58,2],[58,4],[25,6],[25,4],[61,0],[61,1],[61,1],[62,1],[63,3],[63,5],[26,2],[26,2],[26,2],[26,3],[26,3],[26,3],[26,3],[26,3],[27,4],[27,6],[27,5],[29,5],[28,7],[28,7]],
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
case 27:this.$ = $$[$0-1];
break;
case 28:this.$ = new yy.Declare($$[$0-1], $$[$0], null, this._$, yytext);
break;
case 29:this.$ = new yy.Declare($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 30:this.$ = new yy.Assign($$[$0-2], $$[$0], this._$, yytext);
break;
case 31:this.$ = $$[$0];
break;
case 32:this.$ = $$[$0];
break;
case 33:this.$ = $$[$0];
break;
case 34:this.$ = new yy.Identifier($$[$0], this._$, yytext);
break;
case 35:this.$ = new yy.Property($$[$0-2], $$[$0], this._$, yytext);
break;
case 36:this.$ = new yy.ListAccessor($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 37:this.$ = new yy.Constant($$[$0], this._$, yytext);
break;
case 38:this.$ = new yy.Number($$[$0], this._$, yytext);
break;
case 39:this.$ = new yy.String($$[$0], this._$, yytext);
break;
case 40:this.$ = new yy.True(this._$, yytext);
break;
case 41:this.$ = new yy.False(this._$, yytext);
break;
case 42:this.$ = new yy.Nothing(this._$, yytext);
break;
case 43:this.$ = $$[$0];
break;
case 44:this.$ = new yy.List($$[$0-1])
break;
case 45:this.$ = new yy.ListRange($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 46:this.$ = []
break;
case 47:this.$ = [$$[$0]]
break;
case 48:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 49:this.$ = new yy.This(this._$, yytext);
break;
case 50:this.$ = new yy.Class($$[$0-2], null, $$[$0-1], this._$, yytext);
break;
case 51:this.$ = new yy.Class($$[$0-4], $$[$0-2], $$[$0-1], this._$, yytext);
break;
case 52:this.$ = new yy.Block($$[$0-1], this._$, yytext);
break;
case 53:this.$ = [$$[$0]];
break;
case 54:this.$ = $$[$0-2]; $$[$0-2].push($$[$0]);
break;
case 55:this.$ = $$[$0];
break;
case 56:this.$ = $$[$0];
break;
case 57:this.$ = new yy.Method(null, $$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 58:this.$ = new yy.Method($$[$0-3], $$[$0-7], $$[$0-5], $$[$0-2], this._$, yytext);
break;
case 59:this.$ = new yy.Function($$[$0-2], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 60:this.$ = new yy.Declare(new yy.Constant("Function"), $$[$0-7], new yy.Function($$[$0-2], $$[$0-5], $$[$0-1], this._$, yytext), this._$, yytext);
break;
case 61:this.$ = [];
break;
case 62:this.$ = [new yy.Param($$[$0-1], $$[$0])];
break;
case 63:this.$ = $$[$0-3]; $$[$0-3].push(new yy.Param($$[$0-1], $$[$0], this._$, yytext));
break;
case 64:this.$ = new yy.Call($$[$0-3], $$[$0-5], $$[$0-1], this._$, yytext);
break;
case 65:this.$ = new yy.Call($$[$0-3], null, $$[$0-1], this._$, yytext);
break;
case 66:this.$ = [];
break;
case 67:this.$ = $$[$0];
break;
case 68:this.$ = $$[$0];
break;
case 69:this.$ = [new yy.Argument(new yy.Identifier("unary", this._$, yytext), $$[$0], this._$, yytext)];
break;
case 70:this.$ = [new yy.Argument($$[$0-2], $$[$0], this._$, yytext)];
break;
case 71:this.$ = $$[$0-4]; $$[$0-4].push(new yy.Argument($$[$0-2], $$[$0], this._$, yytext));
break;
case 72:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 73:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 74:this.$ = new yy.Operator($$[$0-1], null, $$[$0], this._$, yytext);
break;
case 75:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 76:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 77:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 78:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 79:this.$ = new yy.Operator($$[$0-1], $$[$0-2], $$[$0], this._$, yytext);
break;
case 80:this.$ = new yy.If($$[$0-2], $$[$0-1], null, this._$, yytext);
break;
case 81:this.$ = new yy.If($$[$0-4], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 82:this.$ = new yy.If($$[$0-3], $$[$0-2], $$[$0], this._$, yytext);
break;
case 83:this.$ = new yy.While($$[$0-3], $$[$0-1], this._$, yytext);
break;
case 84:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
case 85:this.$ = new yy.For($$[$0-5], $$[$0-3], $$[$0-1], this._$, yytext);
break;
}
},
table: [{3:1,4:[1,2],5:3,9:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],57:[1,25],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{1:[3]},{1:[2,1]},{4:[1,48],6:49,7:[1,50]},{4:[2,5],7:[2,5]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{4:[2,9],7:[2,9]},{11:59,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,11],7:[2,11]},{4:[2,12],7:[2,12],30:[2,12],31:[2,12],37:[2,12],38:[2,12],39:[2,12],48:[2,12],49:[2,12],65:[2,12],66:[2,12],68:[2,12],69:[2,12],70:[2,12],74:[2,12],76:[2,12]},{4:[2,13],7:[2,13],30:[2,13],31:[2,13],33:[1,60],37:[2,13],38:[2,13],39:[2,13],48:[2,13],49:[2,13],65:[2,13],66:[2,13],68:[2,13],69:[2,13],70:[2,13],74:[2,13],76:[2,13]},{4:[2,14],7:[2,14],30:[2,14],31:[2,14],37:[2,14],38:[2,14],39:[2,14],48:[2,14],49:[2,14],65:[2,14],66:[2,14],68:[2,14],69:[2,14],70:[2,14],74:[2,14],76:[2,14]},{4:[2,15],7:[2,15],30:[2,15],31:[2,15],37:[2,15],38:[2,15],39:[2,15],48:[2,15],49:[2,15],65:[2,15],66:[2,15],68:[2,15],69:[2,15],70:[2,15],74:[2,15],76:[2,15]},{4:[2,16],7:[2,16],30:[2,16],31:[2,16],37:[2,16],38:[2,16],39:[2,16],48:[2,16],49:[2,16],65:[2,16],66:[2,16],68:[2,16],69:[2,16],70:[2,16],74:[2,16],76:[2,16]},{4:[2,17],7:[2,17],30:[2,17],31:[2,17],37:[2,17],38:[2,17],39:[2,17],48:[2,17],49:[2,17],65:[2,17],66:[2,17],68:[2,17],69:[2,17],70:[2,17],74:[2,17],76:[2,17]},{4:[2,18],7:[2,18],30:[2,18],31:[2,18],37:[2,18],38:[2,18],39:[2,18],48:[2,18],49:[2,18],65:[2,18],66:[2,18],68:[2,18],69:[2,18],70:[2,18],74:[2,18],76:[2,18]},{4:[2,19],7:[2,19],30:[2,19],31:[2,19],32:61,36:[1,46],37:[2,19],38:[2,19],39:[2,19],48:[2,19],49:[2,19],65:[2,19],66:[2,19],68:[2,19],69:[2,19],70:[2,19],74:[2,19],76:[2,19]},{4:[2,20],7:[2,20],30:[2,20],31:[2,20],37:[2,20],38:[2,20],39:[2,20],48:[2,20],49:[2,20],65:[2,20],66:[2,20],68:[2,20],69:[2,20],70:[2,20],74:[2,20],76:[2,20]},{4:[2,21],7:[2,21],30:[2,21],31:[2,21],37:[2,21],38:[2,21],39:[2,21],48:[2,21],49:[2,21],65:[2,21],66:[2,21],68:[2,21],69:[2,21],70:[2,21],74:[2,21],76:[2,21]},{4:[2,22],7:[2,22],30:[2,22],31:[2,22],37:[2,22],38:[2,22],39:[2,22],48:[2,22],49:[2,22],65:[2,22],66:[2,22],68:[2,22],69:[2,22],70:[2,22],74:[2,22],76:[2,22]},{4:[2,23],7:[2,23],30:[2,23],31:[2,23],37:[2,23],38:[2,23],39:[2,23],48:[2,23],49:[2,23],65:[2,23],66:[2,23],68:[2,23],69:[2,23],70:[2,23],74:[2,23],76:[2,23]},{4:[2,24],7:[2,24],30:[2,24],31:[2,24],37:[2,24],38:[2,24],39:[2,24],48:[2,24],49:[2,24],65:[2,24],66:[2,24],68:[2,24],69:[2,24],70:[2,24],74:[2,24],76:[2,24]},{4:[2,25],7:[2,25],30:[2,25],31:[2,25],37:[2,25],38:[2,25],39:[2,25],48:[2,25],49:[2,25],65:[2,25],66:[2,25],68:[2,25],69:[2,25],70:[2,25],74:[2,25],76:[2,25]},{4:[2,26],7:[2,26],30:[2,26],31:[2,26],37:[2,26],38:[2,26],39:[2,26],48:[2,26],49:[2,26],65:[2,26],66:[2,26],68:[2,26],69:[2,26],70:[2,26],74:[2,26],76:[2,26]},{32:62,36:[1,46]},{11:63,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,31],7:[2,31],30:[2,31],31:[2,31],33:[2,31],37:[2,31],38:[2,31],39:[2,31],48:[2,31],49:[2,31],65:[2,31],66:[2,31],68:[2,31],69:[2,31],70:[2,31],74:[2,31],76:[2,31]},{4:[2,32],7:[2,32],30:[2,32],31:[2,32],33:[2,32],37:[2,32],38:[2,32],39:[2,32],48:[2,32],49:[2,32],65:[2,32],66:[2,32],68:[2,32],69:[2,32],70:[2,32],74:[2,32],76:[2,32]},{4:[2,33],7:[2,33],30:[2,33],31:[2,33],33:[2,33],37:[2,33],38:[2,33],39:[2,33],48:[2,33],49:[2,33],65:[2,33],66:[2,33],68:[2,33],69:[2,33],70:[2,33],74:[2,33],76:[2,33]},{4:[2,38],7:[2,38],30:[2,38],31:[2,38],37:[2,38],38:[2,38],39:[2,38],48:[2,38],49:[2,38],65:[2,38],66:[2,38],68:[2,38],69:[2,38],70:[2,38],74:[2,38],76:[2,38]},{4:[2,39],7:[2,39],30:[2,39],31:[2,39],37:[2,39],38:[2,39],39:[2,39],48:[2,39],49:[2,39],65:[2,39],66:[2,39],68:[2,39],69:[2,39],70:[2,39],74:[2,39],76:[2,39]},{4:[2,40],7:[2,40],30:[2,40],31:[2,40],37:[2,40],38:[2,40],39:[2,40],48:[2,40],49:[2,40],65:[2,40],66:[2,40],68:[2,40],69:[2,40],70:[2,40],74:[2,40],76:[2,40]},{4:[2,41],7:[2,41],30:[2,41],31:[2,41],37:[2,41],38:[2,41],39:[2,41],48:[2,41],49:[2,41],65:[2,41],66:[2,41],68:[2,41],69:[2,41],70:[2,41],74:[2,41],76:[2,41]},{4:[2,42],7:[2,42],30:[2,42],31:[2,42],37:[2,42],38:[2,42],39:[2,42],48:[2,42],49:[2,42],65:[2,42],66:[2,42],68:[2,42],69:[2,42],70:[2,42],74:[2,42],76:[2,42]},{4:[2,43],7:[2,43],30:[2,43],31:[2,43],37:[2,43],38:[2,43],39:[2,43],48:[2,43],49:[2,43],65:[2,43],66:[2,43],68:[2,43],69:[2,43],70:[2,43],74:[2,43],76:[2,43]},{4:[2,49],7:[2,49],30:[2,49],31:[2,49],37:[2,49],38:[2,49],39:[2,49],48:[2,49],49:[2,49],65:[2,49],66:[2,49],68:[2,49],69:[2,49],70:[2,49],74:[2,49],76:[2,49]},{4:[2,37],7:[2,37],30:[2,37],31:[2,37],36:[2,37],37:[2,37],38:[2,37],39:[2,37],48:[2,37],49:[2,37],54:[2,37],65:[2,37],66:[2,37],68:[2,37],69:[2,37],70:[2,37],74:[2,37],76:[2,37]},{22:64,40:[1,37]},{30:[1,65],32:66,36:[1,46]},{11:67,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:68,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:69,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:70,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{18:72,22:73,32:71,36:[1,46],40:[1,37]},{11:74,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,34],7:[2,34],30:[2,34],31:[2,34],33:[2,34],37:[2,34],38:[2,34],39:[2,34],48:[2,34],49:[2,34],64:[2,34],65:[2,34],66:[2,34],68:[2,34],69:[2,34],70:[2,34],74:[2,34],76:[2,34]},{11:76,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],39:[2,46],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,47:75,49:[2,46],50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{1:[2,2]},{9:77,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],57:[1,25],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{12:[2,3],13:[2,3],17:[2,3],30:[2,3],36:[2,3],38:[2,3],40:[2,3],41:[2,3],42:[2,3],43:[2,3],44:[2,3],45:[2,3],50:[2,3],51:[2,3],53:[2,3],57:[2,3],60:[2,3],65:[2,3],66:[2,3],67:[2,3],71:[2,3],72:[2,3],73:[2,3],75:[2,3]},{32:78,36:[1,46]},{11:82,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],31:[2,66],32:83,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],61:79,62:80,63:81,65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:84,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:85,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:86,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:87,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:88,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:89,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,10],7:[2,10],30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{11:90,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,28],7:[2,28],30:[2,28],31:[2,28],33:[1,91],37:[2,28],38:[2,28],39:[2,28],48:[2,28],49:[2,28],65:[2,28],66:[2,28],68:[2,28],69:[2,28],70:[2,28],74:[2,28],76:[2,28]},{30:[1,92]},{30:[1,52],31:[1,93],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{6:96,7:[1,50],52:94,54:[1,95]},{22:98,31:[2,61],40:[1,37],49:[2,61],58:97},{30:[1,99]},{4:[2,72],7:[2,72],30:[1,52],31:[2,72],37:[1,51],38:[1,58],39:[2,72],48:[2,72],49:[2,72],65:[2,72],66:[2,72],68:[1,55],69:[2,72],70:[1,57],74:[2,72],76:[2,72]},{4:[2,73],7:[2,73],30:[1,52],31:[2,73],37:[1,51],38:[1,58],39:[2,73],48:[2,73],49:[2,73],65:[2,73],66:[2,73],68:[1,55],69:[2,73],70:[1,57],74:[2,73],76:[2,73]},{4:[2,74],7:[2,74],30:[1,52],31:[2,74],37:[1,51],38:[1,58],39:[2,74],48:[2,74],49:[2,74],65:[2,74],66:[2,74],68:[1,55],69:[2,74],70:[1,57],74:[2,74],76:[2,74]},{6:101,7:[1,50],8:100,30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{76:[1,102]},{76:[1,103]},{32:61,36:[1,46]},{30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57],74:[1,104]},{39:[1,105],49:[1,106]},{30:[1,52],37:[1,51],38:[1,58],39:[2,47],48:[1,107],49:[2,47],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{4:[2,6],7:[2,6]},{4:[2,35],7:[2,35],30:[1,108],31:[2,35],33:[2,35],37:[2,35],38:[2,35],39:[2,35],48:[2,35],49:[2,35],65:[2,35],66:[2,35],68:[2,35],69:[2,35],70:[2,35],74:[2,35],76:[2,35]},{31:[1,109]},{31:[2,67]},{31:[2,68],49:[1,110]},{30:[1,52],31:[2,69],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{30:[2,31],31:[2,31],33:[2,31],37:[2,31],38:[2,31],64:[1,111],65:[2,31],66:[2,31],68:[2,31],69:[2,31],70:[2,31]},{4:[2,75],7:[2,75],30:[1,52],31:[2,75],37:[1,51],38:[1,58],39:[2,75],48:[2,75],49:[2,75],65:[2,75],66:[2,75],68:[1,55],69:[2,75],70:[1,57],74:[2,75],76:[2,75]},{4:[2,76],7:[2,76],30:[1,52],31:[2,76],37:[1,51],38:[1,58],39:[2,76],48:[2,76],49:[2,76],65:[2,76],66:[2,76],68:[1,55],69:[2,76],70:[1,57],74:[2,76],76:[2,76]},{4:[2,77],7:[2,77],30:[1,52],31:[2,77],37:[1,51],38:[1,58],39:[2,77],48:[2,77],49:[2,77],65:[2,77],66:[2,77],68:[2,77],69:[2,77],70:[1,57],74:[2,77],76:[2,77]},{4:[2,78],7:[2,78],30:[1,52],31:[2,78],37:[1,51],38:[1,58],39:[2,78],48:[2,78],49:[2,78],65:[1,53],66:[1,54],68:[1,55],69:[2,78],70:[1,57],74:[2,78],76:[2,78]},{4:[2,79],7:[2,79],30:[1,52],31:[2,79],37:[1,51],38:[1,58],39:[2,79],48:[2,79],49:[2,79],65:[2,79],66:[2,79],68:[2,79],69:[2,79],70:[2,79],74:[2,79],76:[2,79]},{30:[1,52],37:[1,51],38:[1,58],39:[1,112],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{4:[2,30],7:[2,30],30:[1,52],31:[2,30],37:[1,51],38:[1,58],39:[2,30],48:[2,30],49:[2,30],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57],74:[2,30],76:[2,30]},{11:113,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{22:98,31:[2,61],40:[1,37],49:[2,61],58:114},{4:[2,27],7:[2,27],30:[2,27],31:[2,27],37:[2,27],38:[2,27],39:[2,27],48:[2,27],49:[2,27],65:[2,27],66:[2,27],68:[2,27],69:[2,27],70:[2,27],74:[2,27],76:[2,27]},{53:[1,115]},{22:116,40:[1,37]},{14:119,18:120,22:73,40:[1,37],55:117,56:118,57:[1,25]},{31:[1,121],49:[1,122]},{32:123,36:[1,46]},{22:98,31:[2,61],40:[1,37],49:[2,61],58:124},{53:[1,125],72:[1,126]},{5:127,9:4,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],57:[1,25],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:128,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:129,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{6:101,7:[1,50],8:130},{4:[2,44],7:[2,44],30:[2,44],31:[2,44],37:[2,44],38:[2,44],39:[2,44],48:[2,44],49:[2,44],65:[2,44],66:[2,44],68:[2,44],69:[2,44],70:[2,44],74:[2,44],76:[2,44]},{11:131,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:132,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{11:82,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],31:[2,66],32:83,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],61:133,62:80,63:81,65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,65],7:[2,65],30:[2,65],31:[2,65],37:[2,65],38:[2,65],39:[2,65],48:[2,65],49:[2,65],65:[2,65],66:[2,65],68:[2,65],69:[2,65],70:[2,65],74:[2,65],76:[2,65]},{32:134,36:[1,46]},{11:135,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{4:[2,36],7:[2,36],30:[2,36],31:[2,36],33:[2,36],37:[2,36],38:[2,36],39:[2,36],48:[2,36],49:[2,36],65:[2,36],66:[2,36],68:[2,36],69:[2,36],70:[2,36],74:[2,36],76:[2,36]},{4:[2,29],7:[2,29],30:[1,52],31:[2,29],37:[1,51],38:[1,58],39:[2,29],48:[2,29],49:[2,29],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57],74:[2,29],76:[2,29]},{31:[1,136],49:[1,122]},{4:[2,50],7:[2,50],30:[2,50],31:[2,50],37:[2,50],38:[2,50],39:[2,50],48:[2,50],49:[2,50],65:[2,50],66:[2,50],68:[2,50],69:[2,50],70:[2,50],74:[2,50],76:[2,50]},{6:96,7:[1,50],52:137},{6:138,7:[1,50]},{7:[2,53]},{7:[2,55]},{7:[2,56]},{59:[1,139]},{22:140,40:[1,37]},{31:[2,62],49:[2,62]},{31:[1,141],49:[1,122]},{4:[2,80],7:[2,80],30:[2,80],31:[2,80],37:[2,80],38:[2,80],39:[2,80],48:[2,80],49:[2,80],65:[2,80],66:[2,80],68:[2,80],69:[2,80],70:[2,80],74:[2,80],76:[2,80]},{6:101,7:[1,50],8:142,27:143,71:[1,43]},{6:144,7:[1,50]},{30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57],74:[1,145]},{30:[1,52],37:[1,51],38:[1,58],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57],74:[1,146]},{53:[1,147]},{30:[1,52],37:[1,51],38:[1,58],39:[2,48],49:[2,48],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{30:[1,52],37:[1,51],38:[1,58],39:[1,148],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{31:[1,149]},{64:[1,150]},{30:[1,52],31:[2,70],37:[1,51],38:[1,58],49:[2,70],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{6:101,7:[1,50],8:151,59:[1,152]},{53:[1,153]},{14:119,18:120,22:73,40:[1,37],53:[2,52],56:154,57:[1,25]},{22:155,40:[1,37]},{32:156,36:[1,46]},{59:[1,157]},{53:[1,158]},{4:[2,82],7:[2,82],30:[2,82],31:[2,82],37:[2,82],38:[2,82],39:[2,82],48:[2,82],49:[2,82],65:[2,82],66:[2,82],68:[2,82],69:[2,82],70:[2,82],74:[2,82],76:[2,82]},{9:77,10:5,11:6,12:[1,7],13:[1,8],14:9,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],53:[2,4],57:[1,25],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],72:[2,4],73:[1,45],75:[1,44]},{6:101,7:[1,50],8:159},{6:101,7:[1,50],8:160},{4:[2,83],7:[2,83],30:[2,83],31:[2,83],37:[2,83],38:[2,83],39:[2,83],48:[2,83],49:[2,83],65:[2,83],66:[2,83],68:[2,83],69:[2,83],70:[2,83],74:[2,83],76:[2,83]},{4:[2,45],7:[2,45],30:[2,45],31:[2,45],37:[2,45],38:[2,45],39:[2,45],48:[2,45],49:[2,45],65:[2,45],66:[2,45],68:[2,45],69:[2,45],70:[2,45],74:[2,45],76:[2,45]},{4:[2,64],7:[2,64],30:[2,64],31:[2,64],37:[2,64],38:[2,64],39:[2,64],48:[2,64],49:[2,64],65:[2,64],66:[2,64],68:[2,64],69:[2,64],70:[2,64],74:[2,64],76:[2,64]},{11:161,15:10,16:11,17:[1,12],18:13,19:14,20:15,21:16,22:17,23:18,24:19,25:20,26:21,27:22,28:23,29:24,30:[1,26],32:27,34:28,35:29,36:[1,46],38:[1,47],40:[1,37],41:[1,30],42:[1,31],43:[1,32],44:[1,33],45:[1,34],46:35,50:[1,36],51:[1,38],60:[1,39],65:[1,40],66:[1,41],67:[1,42],71:[1,43],73:[1,45],75:[1,44]},{53:[1,162]},{22:163,40:[1,37]},{4:[2,51],7:[2,51],30:[2,51],31:[2,51],37:[2,51],38:[2,51],39:[2,51],48:[2,51],49:[2,51],65:[2,51],66:[2,51],68:[2,51],69:[2,51],70:[2,51],74:[2,51],76:[2,51]},{7:[2,54]},{6:101,7:[1,50],8:164},{31:[2,63],49:[2,63]},{22:165,40:[1,37]},{4:[2,81],7:[2,81],30:[2,81],31:[2,81],37:[2,81],38:[2,81],39:[2,81],48:[2,81],49:[2,81],65:[2,81],66:[2,81],68:[2,81],69:[2,81],70:[2,81],74:[2,81],76:[2,81]},{53:[1,166]},{53:[1,167]},{30:[1,52],31:[2,71],37:[1,51],38:[1,58],49:[2,71],65:[1,53],66:[1,54],68:[1,55],69:[1,56],70:[1,57]},{4:[2,57],7:[2,57]},{6:101,7:[1,50],8:168},{53:[1,169]},{6:101,7:[1,50],8:170},{4:[2,84],7:[2,84],30:[2,84],31:[2,84],37:[2,84],38:[2,84],39:[2,84],48:[2,84],49:[2,84],65:[2,84],66:[2,84],68:[2,84],69:[2,84],70:[2,84],74:[2,84],76:[2,84]},{4:[2,85],7:[2,85],30:[2,85],31:[2,85],37:[2,85],38:[2,85],39:[2,85],48:[2,85],49:[2,85],65:[2,85],66:[2,85],68:[2,85],69:[2,85],70:[2,85],74:[2,85],76:[2,85]},{53:[1,171]},{4:[2,59],7:[2,59],30:[2,59],31:[2,59],37:[2,59],38:[2,59],39:[2,59],48:[2,59],49:[2,59],65:[2,59],66:[2,59],68:[2,59],69:[2,59],70:[2,59],74:[2,59],76:[2,59]},{53:[1,172]},{4:[2,58],7:[2,58]},{4:[2,60],7:[2,60],30:[2,60],31:[2,60],37:[2,60],38:[2,60],39:[2,60],48:[2,60],49:[2,60],65:[2,60],66:[2,60],68:[2,60],69:[2,60],70:[2,60],74:[2,60],76:[2,60]}],
defaultActions: {2:[2,1],48:[2,2],80:[2,67],118:[2,53],119:[2,55],120:[2,56],154:[2,54]},
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