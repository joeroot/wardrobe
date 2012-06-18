var path = require('path');
var fs = require('fs');
var wardrobe = require('./wardrobe')

function parseArguments(argv) {
  var arguments = {};

  if (argv.length >= 2) {
    arguments.source = fs.readFileSync(argv[2], 'utf8')
  } 

  return arguments
}

exports.run = function() {
  arguments = parseArguments(process.argv)
  wardrobe.run(arguments.source)
};