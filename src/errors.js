var ErrorCodes = {
  UndefinedError: -1,
  NoSuchMethod: 0
};

exports.WardrobeSyntaxError = 
  require('./errors/syntaxerror').WardrobeSyntaxError;

exports.WardrobeNoSuchMethodError = 
  require('./errors/nosuchmethod').WardrobeNoSuchMethodError;

exports.WardrobeMissingArgumentsError = 
  require('./errors/missingarguments').WardrobeMissingArgumentsError;

exports.WardrobeNoSuchParameterError = 
  require('./errors/nosuchparam').WardrobeNoSuchParameterError;

exports.WardrobeUndeclaredPropertyOrVariable = 
  require('./errors/undeclaredpropertyorvariable').WardrobeUndeclaredPropertyOrVariable;
