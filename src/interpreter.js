var Context = require('./runtime').Context;

function run(ast) {
  var context = new Context();

  ast = setLoadStructure(ast);

  try {
    for (i = 0; i < ast.length; i++) {
      var node = ast[i];
      context = node.evaluate(context);
    }
  } catch(error) {
    if (error.is_wardrobe_error) {
      switch (error.error) {
        default: 
          console.log(error.errorString());
          context = error.context;
          break;
      }
    } else {
      throw error;
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
