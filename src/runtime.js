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

WardrobeRuntime.prototype.addGlobal = function(name, value) {
  this.globals[name] = {cls: value.cls, name: name, value: value};
  return this.globals[name];
};

WardrobeRuntime.prototype.getGlobal = function(name) {
  return this.globals[name];
};

WardrobeRuntime.prototype.addClass = function(name, cls) {
  this.classes[name] = cls;
  return this.getClass(name);
};

WardrobeRuntime.prototype.createClass = function(name, params, properties) {
  var cls = new WardrobeClass(name, params, properties);
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
    this.properties = this.cls.properties;
  } else {
    this.properties = {};
  }
};

WardrobeObject.prototype.getClass = function() {
  return this.cls;
};

WardrobeObject.prototype.call = function(context, method, args) {
  context = this.cls.methods[method].call(context, this, args);
  return context;
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

WardrobeClass.prototype.addProperty = function(name, cls, object) {
  this.properties[name] = {cls: cls, object: object};
};

WardrobeClass.prototype.new_object = function(args) {
  var obj = new WardrobeObject(this, null);
  //obj.call(init, args);
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

WardrobeString.prototype = new WardrobeClass();
WardrobeString.prototype.constructor = WardrobeString;
function WardrobeString() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'String';
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
      var object = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
      var object = Runtime.getGlobal((receiver.value == right.value).toString()).value;
      context.setReturnObject(object);
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
  this.methods = {};
}

WardrobeTrue.prototype = new WardrobeClass();
WardrobeTrue.prototype.constructor = WardrobeTrue;
function WardrobeTrue() {
  this.cls = Runtime.getClass('Boolean');
  this.value = this;

  this.name = 'TrueBoolean';
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
      context.setReturnObject(Runtime.getGlobal('true').value);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.getCurrentObject();
      var right = context.getLocalObject('right');
      var object = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
  this.cls = Runtime.getClass('Boolean');
  this.value = this;

  this.name = 'FalseBoolean';
  this.methods = {};
  this.methods.and = new WardrobeMethod(
    'and',
    [{name: 'right'}],
    {evaluate: function(context) {
      context.setReturnObject(Runtime.getGlobal('false').value);
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
      var object = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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

WardrobeList.prototype.new_object = function(list) {
  return new WardrobeObject(this, list);
};

WardrobeSystem.prototype = new WardrobeClass();
WardrobeSystem.prototype.constructor = WardrobeSystem;
function WardrobeSystem() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'System';
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

var wardrobe_class = new WardrobeClass('Class', {}, {});
wardrobe_class.cls = wardrobe_class;

var Runtime = new WardrobeRuntime(wardrobe_class, wardrobe_class.cls, {});

Runtime.addClass('Class', wardrobe_class);
Runtime.addClass('Object', new WardrobeClass('Object', {}, {}));
Runtime.addClass('Method', new WardrobeClass('Method', {}, {}));
Runtime.addClass('String', new WardrobeString());
Runtime.addClass('Number', new WardrobeNumber());
Runtime.addClass('List', new WardrobeList());
Runtime.addClass('Boolean', new WardrobeBoolean());
Runtime.addClass('TrueBoolean', new WardrobeTrue());
Runtime.addClass('FalseBoolean', new WardrobeFalse());
Runtime.addClass('System', new WardrobeSystem());

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').new_object());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').new_object());
Runtime.addGlobal('system', Runtime.getClass('System').new_object());

exports.Runtime = Runtime;
exports.Context = Context;
