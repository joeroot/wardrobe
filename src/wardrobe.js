var lexer = require('./lexer');
var nodes = require('./nodes').nodes;
var parser = require('./parser').parser;
var interpreter = require('./interpreter');
var errors = require('./errors');

parser.yy = nodes; 

parser.lexer =  {
  "lex": function() {
    var token = this.tokens[this.pos] ? this.tokens[this.pos++] : ['EOF', '', 0, 0];
    this.yytext = token[1];
    this.yylineno = token[2];
    this.yyleng = this.yytext.length;
    this.yylloc = {
      first_line: this.yylineno, 
      last_line: this.yylineno, 
      first_column: token[3], 
      last_column: token[3] + this.yyleng
    };
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

parser.yy.parseError = function (err, hash) {
  //if (!(hash.expected.indexOf("';'") >= 0 && (hash.token === 'CLOSEBRACE' || parser.yy.lineBreak || parser.yy.lastLineBreak || hash.token === 1))) {
  var lex = parser.lexer;
  var token = lex.tokens[lex.pos-1];
  throw new errors.WardrobeSyntaxError(hash, token);
};

function run(source, debug, hooks) {
  var tokens = lexer.lex(source);
  
  if (debug) {
    console.log('Lexer finished, tokens: \n');
    console.log(tokens);
  }

  var ast = parser.parse(tokens);

  if (debug) {
    console.log('\nParser finished, abstract syntax tree: \n');
    console.log(ast);

    console.log("\nIntepreting code, output: \n");
  }
  context = interpreter.run(ast, hooks);
  if (debug) {
    console.log('\nIntepreter finished, final context:\n');
    console.log(context);
  }
  
  return context;
}

function parse(source) {
  var tokens = lexer.lex(source);
  return parser.parse(tokens);
}

exports.run = run;
exports.parse = parse;
