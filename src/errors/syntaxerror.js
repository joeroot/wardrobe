var WardrobeSyntaxError = function(hash, token) {
  this.kind = 'Syntax';
  this.hash = hash;
  this.token = token;
};

WardrobeSyntaxError.prototype.is_wardrobe_error =  true;
WardrobeSyntaxError.prototype.toString = function() {
  return "syntax error";
};

WardrobeSyntaxError.prototype.getStartColumn = function() {return this.token[3];};
WardrobeSyntaxError.prototype.getEndColumn = function() {return this.token[3] + this.token[1].length;};
WardrobeSyntaxError.prototype.getStartLine = function() {return this.token[2];};
WardrobeSyntaxError.prototype.getEndLine = function() {return this.token[2];};

exports.WardrobeSyntaxError = WardrobeSyntaxError;
