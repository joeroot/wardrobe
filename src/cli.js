var path = require('path');
var fs = require('fs');

var wardrobe = require('./wardrobe');

function parseArguments(argv) {
  var parsed = {};

  if (argv.length >= 2) {
    parsed.source = fs.readFileSync(argv[2], 'utf8');
  } 

  return parsed;
}

commands = parseArguments(process.argv);
wardrobe.run(commands.source);
