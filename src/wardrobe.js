var colors = require('./colors/colors')
var lexer = require('./lexer/lexer')

exports.run = function(source) {
  lexer.lexer(source);
}