var Parser = require('jison').Parser;

var grammar = {
  "startSymbol": "root",
  
  "operators": [

  ],

  "bnf": {
    "root": [
      ["EOF", "return [];"],
      ["program EOF", "return $1;"]
    ],

    "t": [
      ["NEWLINE", "$$ = $1;"]
    ],

    "program": [
      ["line", "$$ = [$1];"],
      ["program t line", "$$ = $1; $1.push($3);"],
      ["program t", "$$ = $1;"]
    ],

    "line": [
      ["statement", "$$ = $1;"],
      ["expression", "$$ = $1;"]
    ],
    
    "statement": [
      ["RETURN primary", "$$ = new yy.Return($2);"]
    ],

    "block": [
      ["t program t", "$$ = new yy.Block($2);"] 
    ],

    "expression": [
      ["if", "$$ = $1;"],
      ["while", "$$ = $1;"],
      ["for", "$$ = $1;"],
      ["assign", "$$ = $1;"],
      ["operation", "$$ = $1;"],
      ["call", "$$ = $1;"],
      ["function", "$$ = $1;"],
      ["class", "$$ = $1;"],
      ["primary", "$$ = $1;"],
      ["LPAREN expression RPAREN", "$$ = $2;"]
    ],

    "if": [
      ["IF expression THEN block END", "$$ = new yy.If($2, $4, null);"],
      ["IF expression THEN block ELSE block END", "$$ = new yy.If($2, $4, $6);"]
    ],

    "while": [
      ["WHILE expression DO block END", "$$ = new yy.While($2, $4);"]
    ],

    "for": [
      ["FOR ident IN expression DO block END", "$$ = new yy.For($2, $4, $6);"]
    ],

    "assign": [
      ["identifier ASSIGN expression", "$$ = new yy.Assign($1, $3);"]
    ],

    "operation": [
      ["primary COMP primary", "$$ = new yy.Operator($2, $1, $3);"],
      ["primary MATH primary", "$$ = new yy.Operator($2, $1, $3);"],
      ["primary LOGIC primary", "$$ = new yy.Operator($2, $1, $3);"] 
    ],

    "call": [
      //["expression DOT identifier LPAREN arguments RPAREN", "$$ = new yy.Call($3, $1, $5);"],
      ["identifier LPAREN arguments RPAREN", "$$ = new yy.Call($1, null, $3);"] 
    ],

    "function": [
      ["DEF identifier LPAREN arguments RPAREN block END", "$$ = new yy.Function($2, $4, $6);"]
    ],

    "class": [
      ["CLASS constant block END", "$$ = new yy.Class($2, $3);"]
    ],

    "arguments": [
      ["", "$$ = [];"],
      ["primary", "$$ = [$1];"],
      ["arguments COMMA primary", "$$ = $1; $1.push($3);"]
    ],

    "primary": [
      ["identifier", "$$ = $1;"],
      ["literal", "$$ = $1;"]
    ],

    "identifier": [
      ["IDENT", "$$ = new yy.Identifier($1);"]
    ],

    "literal": [
      ["NUMBER", "$$ = new yy.Number($1);"],
      ["STRING", "$$ = new yy.String($1);"]
    ],

    "constant": [
      ["CONST", "$$ = new yy.Const($1)"]
    ]
  }

};

var parser = new Parser(grammar, {debug: true});

var fs = require('fs');
fs.writeFile('src/parser.js', parser.generate());
