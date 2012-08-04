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
