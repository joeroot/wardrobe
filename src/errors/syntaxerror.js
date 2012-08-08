var WardrobeSyntaxError = function(hash, token) {
  this.kind = 'Syntax';
  this.hash = hash;
  this.token = token;
};

WardrobeSyntaxError.prototype.is_wardrobe_error =  true;
WardrobeSyntaxError.prototype.toString = function() {
  str = 'Syntax error: expecting ';
  for (var i = 0; i < this.hash.expected.length; i++) {
    if (i == this.hash.expected.length - 1) {
      str += ' or ';
    } else if (i !== 0) {
      str += ', ';
    }
    str += this.hash.expected[i].toLowerCase();
  }
  return str + ".";
};

WardrobeSyntaxError.prototype.getStartColumn = function() {return this.token[3];};
WardrobeSyntaxError.prototype.getEndColumn = function() {return this.token[3] + this.token[1].length;};
WardrobeSyntaxError.prototype.getStartLine = function() {return this.token[2];};
WardrobeSyntaxError.prototype.getEndLine = function() {return this.token[2];};

exports.WardrobeSyntaxError = WardrobeSyntaxError;
