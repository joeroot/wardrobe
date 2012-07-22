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

WardrobeObject.prototype.call = function(context, method, args) {
  context = this.cls.methods[method].call(context, this, args);
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
      str += property + ":" + this.properties[property].value.toString() + ",";
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

WardrobeClass.prototype.addProperty = function(cls, name, value) {
  this.properties[name] = {cls: cls, name: name, value: value};
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
  var old_locals = context.locals;
  var old_current_object = context.current_object;
  var old_current_class = context.current_class;
  var param, p;

  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    var argument = args[p];
    context.locals[param] = {cls: argument.cls, name: param, value: argument};
  }
  
  context.current_object = receiver;
  context = this.body.evaluate(context); 
  
  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    if (old_locals[param] !== undefined) {
      context.locals[param] = old_locals[param];
    } else {
      delete context.locals[param];
    }
  }
  context.current_object = old_current_object;
  context.current_class = old_current_class;
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
      var receiver = context.current_object;
      context.value = Runtime.getClass('Number').new_object(receiver.value.length);
      return context;
    }}
  );
  this.methods.concat = new WardrobeMethod(
    'concat',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getClass('String').new_object(receiver.value + right.value);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getClass('Number').new_object(receiver.value + right.value);
      return context;
    }}
  );
  this.methods.subtract = new WardrobeMethod(
    'subtract', 
    [{name: 'right'}], 
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getClass('Number').new_object(receiver.value - right.value);
      return context;
    }}
  );
  this.methods.divide = new WardrobeMethod(
    'divide', 
    [{name: 'right'}], 
    {evaluate: function(context) {
      console.log("hi there");
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getClass('Number').new_object(receiver.value / right.value);
      return context;
    }}
  );
  this.methods.multiply = new WardrobeMethod(
    'multiply',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getClass('Number').new_object(receiver.value * right.value);
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
      var right = context.locals['right'].value;
      context.value = right;
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{name: 'right'}],
    {evaluate: function(context) {
      context.value = Runtime.getGlobal('true').value;
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
      context.value = Runtime.getGlobal('false').value;
      return context;
    }}
  );
  this.methods.or = new WardrobeMethod(
    'or',
    [{name: 'right'}],
    {evaluate: function(context, receiver, args) {
      var right = context.locals['right'].value;
      context.value = right;
      return context;
    }}
  );
  this.methods.equals = new WardrobeMethod(
    'equals',
    [{name: 'right'}],
    {evaluate: function(context) {
      var receiver = context.current_object;
      var right = context.locals['right'].value;
      context.value = Runtime.getGlobal((receiver.value == right.value).toString()).value;
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
      var receiver = context.current_object;
      context.value = Runtime.getClass('Number').new_object(receiver.value.length);
      return context;
    }}
  );
  this.methods.reverse = new WardrobeMethod(
    'reverse',
    [],
    {evaluate: function(context) {
      context.current_object.value.reverse(); 
      context.value = context.current_object;
      return context;
    }}
  );
  this.methods.concat = new WardrobeMethod(
    'concat',
    [{name: 'right'}],
    {evaluate: function(context) {
      var right = context.locals['right'].value;
      var concat = context.current_object.value.concat(right.value);
      context.current_object.value = concat;
      return context;
    }}
  );
  this.methods.pop = new WardrobeMethod(
    'pop',
    [],
    {evaluate: function(context) {
      var item = context.current_object.value.pop();
      context.value = item;
      return context;
    }}
  );
  this.methods.push = new WardrobeMethod(
    'push',
    [{name: 'item'}],
    {evaluate: function(context) {
      var item = context.locals['item'].value;
      context.current_object.value.push(item);
      context.value = item;
      return context;
    }}
  );
  this.methods.get = new WardrobeMethod(
    'get',
    [{name: 'index'}],
    {evaluate: function(context) {
      var index = context.locals['index'].value;
      context.value = context.current_object.value[index.value];
      return context;
    }}
  );
  this.methods.indexOf = new WardrobeMethod(
    'indexOf',
    [{name: 'item'}],
    {evaluate: function(context) {
      var item = context.locals['item'].value;
      var list = context.current_object.value;
      var index = -1;
      console.log(item);
      for (var i = 0; i < list.length; i++) {
        if (list[i].call(context, 'equals', [item]).value.value) {
          index = i;
          break;
        }
      }
      context.value = Runtime.getClass('Number').new_object(index);
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
      var obj = context.locals['object'].value;
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

WardrobeRuntime = function(obj, cls, locals, classes) { 
  this.obj = obj;
  this.cls = cls;
  this.locals = {};
  this.classes = {};
  this.globals = {};

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

  this.addLocal = function(name, value) {
    this.locals[name] = {cls: value.cls, name: name, value: value};
    return this.locals[name];
  };

  this.getLocal = function(name) {
    return this.locals[name];
  };

  this.addGlobal= function(name, value) {
    this.globals[name] = {cls: value.cls, name: name, value: value};
    return this.globals[name];
  };

  this.getGlobal = function(name) {
    return this.globals[name];
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
Runtime.addClass('List', new WardrobeList());
Runtime.addClass('Boolean', new WardrobeBoolean());
Runtime.addClass('TrueBoolean', new WardrobeTrue());
Runtime.addClass('FalseBoolean', new WardrobeFalse());
Runtime.addClass('System', new WardrobeSystem());

Runtime.addGlobal('true', Runtime.getClass('TrueBoolean').new_object());
Runtime.addGlobal('false', Runtime.getClass('FalseBoolean').new_object());
Runtime.addGlobal('system', Runtime.getClass('System').new_object());

exports.Runtime = Runtime;
