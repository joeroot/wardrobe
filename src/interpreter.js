function run(ast) {
  var context = emptyContext();
  
  for (i = 0; i < ast.length; i++) {
    var node = ast[i];
    context = node.evaluate(context);
  }

  return context;
}

function emptyContext() {
  return {
    locals: {},
    globals: {},
    classes: {},
    current_class: null,
    current_object: null,
    value: null
  };
}

exports.run = run;
