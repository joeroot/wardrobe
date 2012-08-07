var keywords = ['this', 'new', 'class', 'extends', 'def', 'if', 'then', 'else', 'while', 'do', 'end', 'return', 'true', 'false'];
var assign = ['='];
var operator = ['+', '-', '!'];
var comparators = ['!=', '==', '>', '<', '>=', '<='];
var logic = ['&&', 'and', '||', 'or'];
var math = ['/', '*'];


function scan(source) {
  var tokens = [];
  var line = 1;
  var character = 0;
  var i = 0;

  //source = source.replace(/(\n|\r)+/g, '\n');

  while (i < source.length) {
    var chunk = source.slice(i, source.length);
    var value = null;
    
    if (chunk[0] == '.') {
      value = chunk[0];
      tokens.push(['DOT', value, line, character]);
      character = character + 1;
      i = i + 1;
    }
    // Comments
    else if ((value = chunk.match(/#[^\n|\r]*/)) && value.index=== 0) {
      value = value[0]; 
      tokens.push(["COMMENT", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Keywords and identifiers
    else if ((value = chunk.match(/[a-z]\w*/)) && value.index === 0) {
      value = value[0];
      if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line, character]);}
      else if (keywords.indexOf(value) >= 0) {tokens.push([value.toUpperCase(), value, line, character]);}
      else {tokens.push(["IDENT", value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Constants
    else if ((value = chunk.match(/[A-Z]\w*/)) && value.index === 0) {
      value = value[0];
      tokens.push(["CONST", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Grammatical symbols
    else if ((value = chunk.match(/\:|\(|\)|\,|\[|\]/)) && value.index === 0) {
      value = value[0];
      if (value == '(') {tokens.push(['LPAREN', value, line, character]);}
      else if (value == ')') {tokens.push(['RPAREN', value, line, character]);}
      else if (value == '[') {tokens.push(['LSQUARE', value, line, character]);}
      else if (value == ']') {tokens.push(['RSQUARE', value, line, character]);}
      else if (value == ',') {tokens.push(['COMMA', value, line, character]);}
      else if (value == ':') {tokens.push(['COLON', value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Operators
    else if ((value = chunk.match(/!\=|!|\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*/)) && value.index === 0) {
      value = value[0];
      if (operator.indexOf(value) >= 0) {tokens.push([value, value, line, character]);}
      else if (logic.indexOf(value) >= 0) {tokens.push(['LOGIC', value, line, character]);}
      else if (math.indexOf(value) >= 0) {tokens.push(['MATH', value, line, character]);}
      else if (comparators.indexOf(value) >= 0) {tokens.push(['COMP', value, line, character]);}
      else if (assign.indexOf(value) >= 0) {tokens.push(['ASSIGN', value, line, character]);}
      character = character + value.length;
      i = i + value.length;
    }
    // Numbers
    else if ((value = chunk.match(/[0-9]+(\.[0-9]+)?/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NUMBER", value, line]);
      character = character + value.length;
      i = i + value.length;
    }
    // Strings
    else if ((value = chunk.match(/"(.*?)"/)) && value.index === 0) {
      value = value[0];
      tokens.push(["STRING", value, line, character]);
      character = character + value.length;
      i = i + value.length;
    }
    // Newlines
    else if ((value = chunk.match(/((\s)*\n|(\s)*\r)+/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NEWLINE", value, line, character]);
      line = line + value.replace(/ /g, '').length;
      character = 0;
      i = i + value.length;
    }
    else {
      //console.error("Unmatched: " + escape(value[0]));
      character = character + 1;
      i = i + 1;
    }
  }

  // Drops any starting or trailing whitespace/newlines
  if (tokens[0][0] == 'NEWLINE') {tokens.shift();}
  if (tokens[tokens.length-1][0] == 'NEWLINE') {tokens.pop();}

  return tokens;
}

function lex(source) {
  return scan(source);
}

exports.lex = lex;
