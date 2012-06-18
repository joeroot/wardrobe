/*! 
Wardrobe: A language for learning to program. 
Homepage: http://github.com/joeroot/wardrobe 
By: Joe Root (http://joeroot.com/) 
Version: 0.0.1 
Released: 18-06-12
*/


function run(source) {
  lexer(source);
}

var path = require('path');
var fs = require('fs');

function parseArguments(argv) {
  var parsed = {};

  if (argv.length >= 2) {
    parsed.source = fs.readFileSync(argv[2], 'utf8');
  } 

  return parsed;
}

exports.command = function() {
  parsed = parseArguments(process.argv);
  run(parsed.source);
};

function parse(source) {
  lines = source.split("\n");
  for (i = 0; i < lines.length; i++) {
    line = lines[i];
    for (c = 0; c < line.length; c++) {
    
    }
  }
  return [];
}

function lexer(source) {
  console.log(parse(source));
}