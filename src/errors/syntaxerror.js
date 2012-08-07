var WardrobeSyntaxError = function(hash) {
  this.kind = 'Syntax';
  this.hash = hash;
};

WardrobeSyntaxError.prototype.is_wardrobe_error =  true;
WardrobeSyntaxError.prototype.toString = function() {
  return "syntax error";
};

WardrobeSyntaxError.prototype.getStartColumn = function() {return this.hash.loc.first_column;};
WardrobeSyntaxError.prototype.getEndColumn = function() {return this.hash.loc.last_column;};
WardrobeSyntaxError.prototype.getStartLine = function() {return this.hash.loc.first_line;};
WardrobeSyntaxError.prototype.getEndLine = function() {return this.hash.loc.last_line;};

exports.WardrobeSyntaxError = WardrobeSyntaxError;
