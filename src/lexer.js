var regex = {
  comment: /#[^\n|\r]*/,
  identifier: /[a-z]\w*/,
  constant: /[A-Z]\w*/,
  grammar: /->|\.\.|\.|\:|\(|\)|\,|\[|\]/,
  operator: /!\=|!|\=\=|>\=|<\=|>|<|\=|&&|\|\||\+|\-|\/|\*|\%|\=/,
  number: /[0-9]+(\.[0-9]+)?/,
  string: /"(.*?)"|'(.*?)'/,
  newline: /((\s)*\n|(\s)*\r)+/
};

var keywords = ['this', 'super', 'class', 'extends', 'function', 'method', 'if', 'then', 'else', 'for', 'in', 'while', 'do', 'end', 'return', 'true', 'false', 'nothing'];

var operators = {
  comp: ['!=', '==', '>', '<', '>=', '<='],
  logic:  ['&&', 'and', '||', 'or'],
  math: ['/', '*', '%']
};

function scan(source) {
  var tokens = [];    // Initialise empty set of tokens
  var line = 1;       // Set intial line to 1
  var column = 0;     // Set initial column to 0
  var i = 0;          // Set column index to 0

  while (i < source.length) {
    var chunk = source.slice(i); // chunk is the remaining source code left to be lexed
    var lexeme = null;           // initalise current lexeme
    
    var match = function(regex) {
      lexeme = chunk.match(regex);
      if (lexeme && lexeme.index === 0) {
        lexeme = lexeme[0];
        return true;
      }
      return false;
    };

    // Comments
    if (match(regex.comment)) {
      tokens.push(["COMMENT", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Keywords and identifiers
    else if (match(regex.identifier)) {
      if (operators.logic.indexOf(lexeme) >= 0) {tokens.push(['LOGIC', lexeme, line, column]);}
      else if (keywords.indexOf(lexeme) >= 0) {tokens.push([lexeme.toUpperCase(), lexeme, line, column]);}
      else {tokens.push(["IDENT", lexeme, line, column]);}
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Constants
    else if (match(regex.constant)) {
      tokens.push(["CONST", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Grammatical symbols
    else if (match(regex.grammar)) {
      tokens.push([lexeme, lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Operators
    else if (match(regex.operator)) {
      var symbol = null;
      for (kind in operators) {
        if (operators[kind].indexOf(lexeme) >= 0) {
          symbol = kind.toUpperCase();
          tokens.push([symbol, lexeme, line, column]);
          break;
        }
      }
      if (symbol === null) {tokens.push([lexeme, lexeme, line, column]);}
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Numbers
    else if (match(regex.number)) {
      tokens.push(["NUMBER", lexeme, line]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Strings
    else if (match(regex.string)) {
      tokens.push(["STRING", lexeme, line, column]);
      column = column + lexeme.length;
      i = i + lexeme.length;
    }
    // Newlines
    else if (match(regex.newline)) {
      tokens.push(["NEWLINE", lexeme, line, column]);
      line = line + lexeme.replace(/ /g, '').length;
      column = 0;
      i = i + lexeme.length;
    }
    else {
      //console.error("Unmatched: " + escape(lexeme[0]));
      column = column + 1;
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
