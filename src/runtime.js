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
    }}
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
    [{type: {name: 'String'}, identifier: {name: 'right'}}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
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
