var Wardrobe = require('../../src/wardrobe');
var assert = require('assert');

describe('String', function(){

  /*  
   *  Methods: length, concat, equals
   */

  describe('#concat', function(){

    it('should return a new String equal to itself when concatenated with an empty string', function(){
      var topic = Wardrobe.run('"Foo".concat("")', false).getReturnObject();
      assert.equal(topic.getClass().name, 'String');
      assert.equal(topic.getValue(), "Foo");
    });

    it('should return a new String equal to itself appended with the parameterised String', function() {
      var topic = Wardrobe.run('"Foo".concat("Bar")', false).getReturnObject();
      assert.equal(topic.getClass().name, 'String');
      assert.equal(topic.getValue(), "FooBar");
    });

  });
  
  describe('#equals', function(){

    it('should return false when called with a different string', function(){
      var topic = Wardrobe.run('"Foo".equal("Bar")', false).getReturnObject();
      assert.equal(topic.getValue(), false);
    });

    it('should return true when called with the same string', function(){
      var topic = Wardrobe.run('"Foo".equal("Foo")', false).getReturnObject();
      assert.equal(topic.getValue(), true);
    });

  });

  describe('#length', function() {

    it('should return the Number 0 when called on an empty string', function(){
      var topic = Wardrobe.run('"".length()', false).getReturnObject();
      assert.equal(topic.getClass().name, 'Number');
      assert.equal(topic.value, 0);
    });

    it('should return a Number denoting the correct length when called on a non-empty string', function(){
      var topic = Wardrobe.run('"Foo".length()', false).getReturnObject();
      assert.equal(topic.getClass().name, 'Number');
      assert.equal(topic.value, 3);
    });

  });

});

