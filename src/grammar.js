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
      ["NEWLINE", "$$ = $1"]
    ],

    "program": [
      ["line", "$$ = [$1]"],
      ["program t line", "$$ = $1; $1.push($3)"],
      ["program t", "$$ = $1"]
    ],

    "line": [
      ["statement", "$$ = $1"],
      ["expression", "$$ = $1"]
    ],
    
    "statement": [
      ["RETURN primary", "$$ = ['Return', $2]"]
    ],

    "block": [
      ["t program t", "$$ = ['Block', $2]"] 
    ],

    "expression": [
      ["if", "$$ = $1;"],
      ["while", "$$ = $1;"],
      ["for", "$$ = $1;"],
      ["assign", "$$ = $1"],
      ["operation", "$$ = $1"],
      ["call", "$$ = $1"],
      ["function", "$$ = $1"],
      ["primary", "$$ = $1"],
      ["LPAREN expression RPAREN", "$$ = $2"]
    ],

    "if": [
      ["IF expression THEN block END", "$$ = ['If', $2, $4]"],
      ["IF expression THEN block ELSE block END", "$$ = ['If', $2, $4, $6]"]
    ],

    "while": [
      ["WHILE expression DO block END", "$$ = ['While', $2, $4]"]
    ],

    "for": [
      ["FOR ident IN expression DO block END", "['For', $2, $4, $6]"]
    ],

    "assign": [
      ["identifier ASSIGN expression", "$$ = ['Assign', $1, $3]"]
    ],

    "operation": [
      ["primary COMP primary", "$$ = ['Comp', $2, $1, $3]"],
      ["primary MATH primary", "$$ = ['Math', $2, $1, $3]"],
      ["primary LOGIC primary", "$$ = ['Logic', $2, $1, $3]"] 
    ],

    "call": [
      ["identifier LPAREN arguments RPAREN", "$$ = ['Call', $1, $3]"] 
    ],

    "function": [
      ["DEF identifier LPAREN arguments RPAREN block END", "$$ = ['Function', $2, $4, $6]"]
    ],

    "arguments": [
      ["", "$$ = ['Arguments', []]"],
      ["primary", "$$ = ['Arguments', [$1]]"],
      ["arguments COMMA primary", "$$ = $1; $1[1].push($3);"]
    ],

    "primary": [
      ["identifier", "$$ = $1"],
      ["literal", "$$ = $1"]
    ],

    "identifier": [
      ["IDENT", "$$ = ['Identifier', $1]"] 
    ],

    "literal": [
      ["NUMBER", "$$ = ['Number', $1]"],
      ["STRING", "$$ = ['String', $1]"]
    ]
  }

};

var parser = new Parser(grammar, {debug: true});

var fs = require('fs');
fs.writeFile('src/parser.js', parser.generate());