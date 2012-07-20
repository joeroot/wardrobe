var fs = require('fs');

desc('Builds Wardrobe for the browser.');
task('browser', function (params) {
  var files = ['lexer', 'runtime', 'nodes', 'parser', 'interpreter', 'wardrobe'];
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
