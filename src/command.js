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