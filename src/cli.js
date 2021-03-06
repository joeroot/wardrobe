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

try {
  context = wardrobe.run(commands.source, true);
  console.log("\nFinal value\n");
  console.log(context.getReturnObject().toString());
} catch(err) {
  if (err.is_wardrobe_error) {
    console.log(err.toString());
  } else {
    throw err;
  }
}
