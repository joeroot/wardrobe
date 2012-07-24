var Parser = require('jison').Parser;

var grammar = {
  "startSymbol": "root",

  "operators": [
    ["right", "ASSIGN"],
    ["left", "DOT"],
    ["left", "MATH"],
    ["left", "+", "-"],
    ["left", "COMP"],
    ["left", "LOGIC"],
    ["right", "FOR", "WHILE"]
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
      ["COMMENT", "$$ = new yy.Comment($1);"],
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
      ["create", "$$ = $1;"],
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
      ["CONST identifier", "$$ = new yy.Declare($1, $2, null);"],
      ["CONST identifier ASSIGN expression", "$$ = new yy.Declare($1, $2, $4);"],
      ["identifier ASSIGN expression", "$$ = new yy.Assign($1, $3);"]
    ],

    "operation": [
      ["expression + expression", "$$ = new yy.Operator($2, $1, $3);"],
      ["expression - expression", "$$ = new yy.Operator($2, $1, $3);"],
      ["expression COMP expression", "$$ = new yy.Operator($2, $1, $3);"],
      ["expression MATH expression", "$$ = new yy.Operator($2, $1, $3);"],
      ["expression LOGIC expression", "$$ = new yy.Operator($2, $1, $3);"] 
    ],

    "function": [
      ["DEF identifier LPAREN params RPAREN block END", "$$ = new yy.Function($2, $4, $6);"]
    ],

    "params": [
      ["", "$$ = [];"],
      ["identifier", "$$ = [$1];"],
      ["params COMMA identifier", "$$ = $1; $1.push($3);"]
    ],

    "call": [
      ["expression DOT identifier LPAREN arguments RPAREN", "$$ = new yy.Call($3, $1, $5);"],
      ["identifier LPAREN arguments RPAREN", "$$ = new yy.Call($1, null, $3);"] 
    ],

    "create": [
      ["NEW CONST LPAREN arguments RPAREN", "$$ = new yy.Create($2, $4);"]
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
      ["IDENT", "$$ = new yy.Identifier($1, 'local');"],
      ["THIS DOT IDENT", "$$ = new yy.Identifier($3, 'this');"]
    ],

    "literal": [
      ["NUMBER", "$$ = new yy.Number($1);"],
      ["STRING", "$$ = new yy.String($1);"],
      ["TRUE", "$$ = new yy.True($1);"],
      ["FALSE", "$$ = new yy.False($1);"],
      ["list", "$$  = $1;"]
    ],
    
    "list": [
      ["LSQUARE list_items RSQUARE", "$$ = new yy.List($2)"]
    ],

    "list_items": [
      ["", "$$ = []"],
      ["expression", "$$ = [$1]"],
      ["list_items COMMA expression", "$$ = $1; $1.push($3);"] 
    ],

    "constant": [
      ["CONST", "$$ = new yy.Const($1);"]
    ],

    "class": [
      ["CLASS constant block END", "$$ = new yy.Class($2, null, $3);"],
      ["CLASS constant EXTENDS constant block END", "$$ = new yy.Class($2, $4, $5);"]
    ]

  }

};

var parser = new Parser(grammar, {debug: true});

var fs = require('fs');
fs.writeFile('src/parser.js', parser.generate());