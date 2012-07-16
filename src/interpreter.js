function run(ast) {
  var context = emptyContext();

  ast = setLoadStructure(ast);

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
