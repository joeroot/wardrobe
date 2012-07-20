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

WardrobeObject.prototype.call = function(context, method, arguments) {
  context = this.cls.methods[method].call(context, this, arguments);
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
  var str= '<' + this.cls.name + ':' + this.value + '>';
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

WardrobeClass.prototype.new_object = function(arguments) {
  var obj = new WardrobeObject(this, null);
  //obj.call(init, arguments);
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

WardrobeMethod.prototype.call = function(context, receiver, arguments) { 
  var old_context = context;
  var param, p;

  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    var argument = arguments[p];
    context.locals[param] = {cls: argument.cls, name: param, value: argument};
  }
  
  context.current_object = receiver;
  context = this.body.evaluate(context); 
  
  for (p = 0; p < this.params.length; p++) {
    param = this.params[p].name;
    if (old_context.locals[param] !== undefined) {
      context.locals[param] = old_context.locals[param];
    } else {
      delete context.locals[param];
    }
  }
  context.current_object = old_context.current_object;
  return context;
};

WardrobeString.prototype = new WardrobeClass();
WardrobeString.prototype.constructor = WardrobeString;
function WardrobeString() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'String';
  this.methods = {
    length: new WardrobeMethod(
      'length', 
      [], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = Runtime.getClass('Number').new_object(receiver.value.length);
        return context;
      }}
    ),
    concat: new WardrobeMethod(
      'concat',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('String').new_object(receiver.value + right.value);
        return context;
      }}
    )
  };
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
  this.methods = {
    add: new WardrobeMethod(
      'add', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value + right.value);
        return context;
      }}
    ),
    subtract: new WardrobeMethod(
      'subtract', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value - right.value);
        return context;
      }}
    ),
    divide: new WardrobeMethod(
      'divide', 
      [{name: 'right'}], 
      {evaluate: function(context) {
        console.log("hi there");
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value / right.value);
        return context;
      }}
    ),
    multiply: new WardrobeMethod(
      'multiply',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        var right = context.locals['right'].value;
        context.value = Runtime.getClass('Number').new_object(receiver.value * right.value);
        return context;
      }}
    )
  };
}

WardrobeNumber.prototype.new_object = function(argument) {
  return new WardrobeObject(this, argument);
};

WardrobeTrue.prototype = new WardrobeClass();
WardrobeTrue.prototype.constructor = WardrobeTrue;
function WardrobeTrue() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'True';
  this.methods = {
    and: new WardrobeMethod(
      'and',
      [{name: 'right'}],
      {evaluate: function(context) {
        var right = context.locals['right'];
        context.value = right;
        return context;
      }}
    ),
    or: new WardrobeMethod(
      'or',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = receiver;
        return context;
      }}
    )
  };
}

WardrobeTrue.prototype.new_object = function() {
  return new WardrobeObject(this, true);
};

WardrobeFalse.prototype = new WardrobeClass();
WardrobeFalse.prototype.constructor = WardrobeFalse;
function WardrobeFalse() {
  this.cls = Runtime.getClass('Class');
  this.value = this;

  this.name = 'False';
  this.methods = {
    and: new WardrobeMethod(
      'and',
      [{name: 'right'}],
      {evaluate: function(context) {
        var receiver = context.current_object;
        context.value = receiver;
        return context;
      }}
    ),
    or: new WardrobeMethod(
      'or',
      [{name: 'right'}],
      {evaluate: function(context, receiver, arguments) {
        var right = context.locals['right'];
        context.value = right;
        return context;
      }}
    )
  };
}

WardrobeFalse.prototype.new_object = function() {
  return new WardrobeObject(this, false);
};

WardrobeRuntime = function(obj, cls, locals, classes) { 
  this.obj = obj;
  this.cls = cls;
  this.locals = {};
  this.classes = {};

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

  this.addLocal = function(name, local) {
    this.locals[name] = local;
    return this.locals[name];
  };

  this.getLocal = function(name) {
    return this.locals[name];
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
Runtime.addClass('List', new WardrobeClass('List', {}, {}));
Runtime.addClass('True', new WardrobeClass('True', {}, {}));
Runtime.addClass('False', new WardrobeClass('False', {}, {}));

exports.Runtime = Runtime;
