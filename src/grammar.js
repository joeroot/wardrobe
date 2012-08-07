var Parser = require('jison').Parser;

var grammar = {
  "startSymbol": "root",

  "operators": [
    ["right", "ASSIGN"],
    ["left", "DOT"],
    ["right", "COMMA"],
    ["left", "+", "-", "!"],
    ["left", "MATH"],
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
      ["NEWLINE"]
    ],

    "program": [
      ["line", "$$ = [$1];"],
      ["program t line", "$$ = $1; $1.push($3);"]
    ],

    "block": [
      ["t program t", "$$ = new yy.Block($2, @$, yytext);"] 
    ],
    
    "line": [
      ["statement"],
      ["expression"]
    ],

    // Statements do not evaluate as objects
    "statement": [
      ["COMMENT", "$$ = new yy.Comment($1, @$, yytext);"],           // e.g. # This is a comment
      ["RETURN expression", "$$ = new yy.Return($2, @$, yytext);"],  // e.g. return x, return square.getWidth()
      ["declare"]                                     
    ],

    "declare": [
      ["constant identifier", "$$ = new yy.Declare($1, $2, @$, yytext);"]  // e.g. Number n, String s 
    ],

    "expression": [
      ["bracketed"],
      ["value"],
      ["assign"],
      ["literal"],
      ["constant"],
      ["class"],
      ["function"],
      ["call"],
      ["create"],
      ["operation"],
      ["if"],
      ["while"]
    ],

    "bracketed": [
      ["LPAREN expression RPAREN", "$$ = $2;"]
    ],

    "value": [
      ["assignable"],
      ["const"],
      ["this"]
    ],

    "assign": [
      ["declare ASSIGN expression", "$$ = new yy.Assign($1, $3, @$, yytext);"],    // e.g. Number x = 10
      ["assignable ASSIGN expression", "$$ = new yy.Assign($1, $3, @$, yytext);"]  // e.g. x = 20
    ],

    "assignable": [
      ["identifier"],
      ["property"]
      //["list_accessor"] 
    ],

    "identifier": [
      ["IDENT", "$$ = new yy.Identifier($1, @$, yytext);"]  // e.g. x, width, name
    ],

    "property": [
      ["expression DOT identifier", "$$ = new yy.Property($1, $3, @$, yytext);"]  // e.g. this.x, obj.width
    ],

    "list_accessor": [
      ["expression LSQUARE expression RSQUARE", "$$ = new yy.ListAccessor($1, $3, @$, yytext);"]  // e.g. names[0], items[x]
    ],

    "constant": [
      ["CONST", "$$ = new yy.Constant($1, @$, yytext);"]  // e.g. Number, String
    ],

    "literal": [
      ["NUMBER", "$$ = new yy.Number($1, @$, yytext);"],  // e.g. 10, 1.33
      ["STRING", "$$ = new yy.String($1, @$, yytext);"],  // e.g. "hello world"
      ["TRUE", "$$ = new yy.True(@$, yytext);"],      // i.e. true
      ["FALSE", "$$ = new yy.False(@$, yytext);"],    // i.e. false
      ["list"]
    ],

    "list": [
      ["LSQUARE list_items RSQUARE", "$$ = new yy.List($2)"]  // e.g. [1,2,3,4]
    ],

    "list_items": [
      ["", "$$ = []"],                                          // i.e. empty list
      ["expression", "$$ = [$1]"],                              // e.g. 1
      ["list_items COMMA expression", "$$ = $1; $1.push($3);"]  // e.g. 1,2,3,4
    ],

    "this": [
      ["THIS", "$$ = new yy.This(@$, yytext);"]  // i.e. this
    ],

    "class": [
      ["CLASS constant block END", "$$ = new yy.Class($2, null, $3, @$, yytext);"],
      ["CLASS constant EXTENDS constant block END", "$$ = new yy.Class($2, $4, $5, @$, yytext);"]
    ],

    "function": [
      ["DEF identifier LPAREN params RPAREN block END", "$$ = new yy.Function(null, $2, $4, $6, @$, yytext);"],
      ["DEF constant identifier LPAREN params RPAREN block END", "$$ = new yy.Function($2, $3, $5, $7, @$, yytext);"]
    ],

    "params": [
      ["", "$$ = [];"],
      ["constant identifier", "$$ = [new yy.Param($1, $2)];"],
      ["params COMMA constant identifier", "$$ = $1; $1.push(new yy.Param($3, $4, @$, yytext));"]
    ],

    "call": [
      ["expression DOT identifier LPAREN arguments RPAREN", "$$ = new yy.Call($3, $1, $5, @$, yytext);"], // e.g. 2.add(10), obj.update(name: "John", age: 71) 
      ["identifier LPAREN arguments RPAREN", "$$ = new yy.Call($1, null, $3, @$, yytext);"]               // e.g. print(10), error(message: "Error!", code: 10)
    ],

    "create": [
      ["NEW constant LPAREN arguments RPAREN", "$$ = new yy.Create($2, $4, @$, yytext);"]  // new Person(name: John, age: 71)
    ],

    "arguments": [
      ["unary_argument"],
      ["named_arguments"]
    ],

    "unary_argument": [
      ["expression", "$$ = [new yy.Argument(new yy.Identifier('unary', @$, yytext), $1, @$, yytext)];"]  // e.g. 19, x, "hello"
    ],

    "named_arguments": [
      ["", "$$ = [];"],                                                                                   // i.e empty arguments
      ["identifier COLON expression", "$$ = [new yy.Argument($1, $3, @$, yytext)];"],                                   // i.e. name: "John"
      ["named_arguments COMMA identifier COLON expression", "$$ = $1; $1.push(new yy.Argument($3, $5, @$, yytext));"]   // i.e. name: "John", age: 71
    ],

    "operation": [
      ["+ expression", "$$ = new yy.Operator($1, null, $2, @$, yytext);"],
      ["- expression", "$$ = new yy.Operator($1, null, $2, @$, yytext);"],
      ["! expression", "$$ = new yy.Operator($1, null, $2, @$, yytext);"],
      ["expression + expression", "$$ = new yy.Operator($2, $1, $3, @$, yytext);"],
      ["expression - expression", "$$ = new yy.Operator($2, $1, $3, @$, yytext);"],
      ["expression MATH expression", "$$ = new yy.Operator($2, $1, $3, @$, yytext);"],
      ["expression COMP expression", "$$ = new yy.Operator($2, $1, $3, @$, yytext);"],
      ["expression LOGIC expression", "$$ = new yy.Operator($2, $1, $3, @$, yytext);"] 
    ],
    
    "if": [
      ["IF expression block END", "$$ = new yy.If($2, $3, null, @$, yytext);"],           // e.g. if bool BLOCK end
      ["IF expression block ELSE block END", "$$ = new yy.If($2, $3, $5, @$, yytext);"],  // e.g. if bool BLOCK else BLOCK end
      ["IF expression block ELSE if", "$$ = new yy.If($2, $3, $5, @$, yytext);"]          // e.g. if bool BLOCK else IF
    ],

    "while": [
      ["WHILE expression DO block END", "$$ = new yy.While($2, $4, @$, yytext);"]  // e.g. while bool do BLOCK end
    ],

    "for": [
      ["FOR identifier IN expression DO block END", ""],
      ["FOR declare IN expression DO block END", "$$ = new yy.For($2, $4, $6, @$, yytext);"]  // e.g. for Number n in ns do BLOCK end 
    ]

  }

};

for (rule in grammar.bnf) {
  expressions = grammar.bnf[rule];
  for (var i = 0; i < expressions.length; i++) {
    if (expressions[i].length == 1) {expressions[i].push("$$ = $1;");}
  }
}

var parser = new Parser(grammar, {debug: true});

var fs = require('fs');
fs.writeFile('src/parser.js', parser.generate());
