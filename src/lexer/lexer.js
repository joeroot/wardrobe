var keywords = ['if', 'while', 'do', 'end', 'true', 'false'];

function scan(source) {
  console.log(escape(source));
  var tokens = [];
  var i = 0;
  while (i < source.length) {
    var chunk = source.slice(i, source.length);
    var value = null;
    
    // Keywords and identifiers
    if ((value = chunk.match(/[a-z]\w*/)) && value.index === 0) {
      value = value[0];
      if (keywords.indexOf(value) >= 0) {tokens.push([value.toUpperCase(), value]);}
      else {tokens.push(["IDENT", value]);}
      i = i + value.length;
    }
    // Constants
    else if ((value = chunk.match(/[A-Z]\w*/)) && value.index === 0) {
      value = value[0];
      tokens.push(["CONSTANT", value]);
      i = i + value.length;
    }
    // Numbers
    else if ((value = chunk.match(/[0-9]+(\.[0-9]+)?/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NUMBER", Number(value)]);
      i = i + value.length;
    }
    // Strings
    else if ((value = chunk.match(/"(.*?)"/)) && value.index === 0) {
      value = value[0];
      tokens.push(["STRING", value]);
      i = i + value.length;
    }
    // Newlines
    else if ((value = chunk.match(/(\n|\r)+/)) && value.index === 0) {
      value = value[0];
      tokens.push(["NEWLINE", value]);
      i = i + 1;
    }
    else {
      console.log(escape(source[i]));
      i = i + 1;
    }
  }
  return tokens;
}

function lexer(source) {
  console.log(scan(source));
}
