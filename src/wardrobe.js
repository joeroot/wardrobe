var path = require('path');
var fs = require('fs');

var lexer = require('./lexer');
var parser = require('./parser').parser;
var interpreter = require('./interpreter');

function parseArguments(argv) {
  var parsed = {};

  if (argv.length >= 2) {
    parsed.source = fs.readFileSync(argv[2], 'utf8');
  } 

  return parsed;
}

function run(source) {
  var tokens = lexer.lex(source);
  console.log('\n');
  console.log(tokens);
  
  parser.lexer =  {
    "lex": function() {
      var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF'];
      this.yytext = token[1];
      this.yylineno = token[2];
      return token[0];
    },
    "setInput": function(tokens) {
      this.tokens = tokens;
      this.pos = 0;
    },
    "upcomingInput": function() {
      return "";
    }
  };

  var ast = parser.parse(tokens);
  console.log('\n');
  console.log(ast);

  context = interpreter.run(ast);
  console.log('\n');
  console.log(context);
}

commands = parseArguments(process.argv);
run(commands.source);
