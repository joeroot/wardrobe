console.log('Succesfully required lexer');

function parse(source) {
  lines = source.split("\n");
  for (i = 0; i < lines.length; i++) {
    line = lines[i];
    for (c = 0; c < line.length; c++) {
    
    }
  }
  return [];
}

exports.lexer = function(source) {
  console.log(parse(source));
}