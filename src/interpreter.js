var Context = require('./runtime').Context;

function run(ast, hooks) {
  if (!hooks) {hooks = {};}
  exports.hooks = hooks;
  var context = new Context();
  context = ast.evaluate(context);
  return context;
}

exports.run = run;
