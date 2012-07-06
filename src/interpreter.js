function run(ast) {
  var context = {
    'local': {},
    'global': {},
    'value': null
  }

  for (i = 0; i < ast.length; i++) {
    var node = ast[i];
    context = eval(node, context);
  }

  return context;
}

function eval(node, context) {
  
  switch(node[0]) {
  
    case 'Block': 
      var lines = node[1];
      
      for (l = 0; l < lines.length; l++) {
        var line = lines[l];
        context = eval(line, context);
      }

      break;

    case 'Return': 
      var expression = node[1];
      context = eval(expression, context);

      break;

    case 'Assign':
      var identifier = node[1][1];
      var expression = node[2];
      context = eval(expression, context);
      context.local[identifier] = context.value;
    
      break;

    case 'If':
      var conditional = node[1];
      context = eval(conditional, context);
      var bool = context.value;
      
      if (bool != null && bool != false) {
        var branch = node[2];
        context = eval(branch, context); 
      } else if (node.length == 4) {
        var branch = node[3];
        context = eval(branch, context);  
      }
      
      break;

    case 'While':
      var conditional = node[1];
      var block = node[2];
      context = eval(conditional, context);
      
      while (context.value != null && context.value != false) {
        context = eval(block, context);
        context = eval(conditional, context);
      }
      
      break;

    case 'Function':
      var name = node[1][1];
      var args = node[2];
      var block = node[3];
      
      context.local[name] = [args, block];

      break;

    case 'Call':
      var name = node[1];
      var args = node[2][1];
      var func = context.local[name[1]];

      for (var a = 0; a < args.length; a++) {
        var arg = args[a];
        context = eval(arg, context);
        args[a] = context.value;
      }

      if (name[1] == "print") { 
        console.log(args[0]); 
      } else if (func != null){
        var params = func[0][1];
        var block = func[1];
        
        context.global = context.local;
        context.local = {};

        for (p = 0; p < params.length; p++) {
          params[p] = params[p][1];
          context.local[params[p]] = args[p];
        }

        context = eval(block, context);
        
        context.local = context.global;
        context.global = {};
      }
      
      break;

    case 'Comp':
      var comparator = node[1];
      var left = node[2];
      var right = node[3];

      context = eval(left, context);
      left = context.value;
      context = eval(right, context);
      right = context.value;
      switch(comparator) {
        case '<': context.value = (left < right); break;
        case '>': context.value = (left > right); break;
        case '<=': context.value = (left <= right); break;
        case '>=': context.value = (left >= right); break;
        case '==': context.value = (left == right); break;
      }

      break;

    case 'Math':
      var operator = node[1];
      var left = node[2];
      var right = node[3];

      context = eval(left, context);
      left = context.value;
      context = eval(right, context);
      right = context.value;

      switch(operator) {
        case '+': context.value = (left + right); break;
        case '-': context.value = (left - right); break;
        case '/': context.value = (left / right); break;
        case '*': context.value = (left * right); break;
      }

      break;

    case 'Identifier':
      var identifier = node[1];
      context.value = context.local[identifier];
      
      break;

    case 'Number':
      context.value = node[1];
      
      break;
    
    case 'String':
      context.value = node[1].slice(1, node[1].length - 1);
      
      break;

  }
 
  var log = {
    'node': node,
    'context': context
  };

  //console.log(log);

  return context;
}


exports.run = run;
