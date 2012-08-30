var fs = require('fs');

desc('Builds Wardrobe for the browser.');
task('browser', function (params) {
  var files = [
    'errors/syntaxerror', 
    'errors/runtimeerror',
    'errors/typeerror', 
    'errors/missingarguments',
    'errors/nosuchparam',
    'errors/nosuchmethod',
    'errors/nosuchclass',
    'errors/undeclaredpropertyorvariable',
    'errors',
    'lexer', 
    'runtime', 
    'nodes/node', 
    'nodes/constant', 
    'nodes/argument', 
    'nodes/assign', 
    'nodes/block', 
    'nodes/call', 
    'nodes/class', 
    'nodes/comment', 
    'nodes/declare', 
    'nodes/false', 
    'nodes/for', 
    'nodes/function', 
    'nodes/identifier', 
    'nodes/if', 
    'nodes/list', 
    'nodes/listaccessor', 
    'nodes/listrange', 
    'nodes/method', 
    'nodes/nothing',
    'nodes/number', 
    'nodes/operator', 
    'nodes/param', 
    'nodes/property', 
    'nodes/program', 
    'nodes/return', 
    'nodes/string', 
    'nodes/this', 
    'nodes/true', 
    'nodes/while', 
    'nodes', 
    'parser', 
    'interpreter', 
    'wardrobe'
  ];
  var src = fs.readFileSync("src/browser.js");
  
  src = src + "(function(root) {\n";
  src = src + "  var Wardrobe = function() {\n";
  src = src + "    function require(path){ return require[path]; }";
  
  for (i = 0; i < files.length; i++) {
    var file = files[i];
    src = src + "require['./" + file + "'] = new function() {\n";
    src = src + "  var exports = this;\n";
    src = src + "  " + fs.readFileSync("src/" + file + ".js");
    src = src + "}\n";
    var split = file.split('/');
    if (split.length > 1) {
      console.log(split[1] + " " + file);
      src = src + "require['./" + split[1] + "'] = require['./" + file + "'];\n";
    } else {
      src = src + "require['../" + file + "'] = require['./" + file + "'];\n";
    }
  }

  src = src + "    return require['./wardrobe'];";
  src = src + "  }();";
  src = src + "    if (typeof define === 'function' && define.amd) {";
  src = src + "      define(function() { return Wardrobe; });";
  src = src + "    } else { ";
  src = src + "     root.Wardrobe = Wardrobe;";
  src = src + "     }";
  src = src + "  }(this));";

  fs.writeFile('lib/wardrobe.js', src);
});
