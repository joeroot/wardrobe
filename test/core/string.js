var Wardrobe = require('../../src/wardrobe');
var assert = require('assert');

describe('String', function(){

  describe('#length', function() {

    it('should return a Number', function(){
      var topic = Wardrobe.run('"Foo".length()', false).getReturnObject();
      assert.equal(topic.getClass().name, 'Number');
    });

    it('should return 0 when called on an empty string', function(){
      var topic = Wardrobe.run('"".length()', false).getReturnObject();
      assert.equal(topic.getClass().name, 'Number');
      assert.equal(topic.value, 0);
    });

    it('should return correct length when called on a non-empty string', function(){
      var topic = Wardrobe.run('"Foo".length()', false).getReturnObject();
      assert.equal(topic.getClass().name, 'Number');
      assert.equal(topic.value, 3);
    });

  });


  describe('#concat', function(){

    it('should return a String', function(){
      var topic = Wardrobe.run('"Foo".concat("Bar")', false).getReturnObject();
      assert.equal(topic.getClass().name, 'String');
    });

    it('should return itself when concatenated with an empty string', function(){
      var topic = Wardrobe.run('"Foo".concat("")', false).getReturnObject();
      assert.equal(topic.getClass().name, 'String');
      assert.equal(topic.getValue(), "Foo");
    });

    it('should concatenate with another string correctly', function() {
      var topic = Wardrobe.run('"Foo".concat("Bar")', false).getReturnObject();
      assert.equal(topic.getClass().name, 'String');
      assert.equal(topic.getValue(), "FooBar");
    });

  });
  
  describe('#equals', function(){

    it('should return a Boolean', function(){
      var topic = Wardrobe.run('"Foo".equals("Bar")', false).getReturnObject();
      assert.equal(topic.getClass().getSuperClass().name, 'Boolean');
    });

    it('should return false when called with a different string', function(){
      var topic = Wardrobe.run('"Foo".equals("Bar")', false).getReturnObject();
      assert.equal(topic.getValue(), false);
    });

    it('should return true when called with the same string', function(){
      var topic = Wardrobe.run('"Foo".equals("Foo")', false).getReturnObject();
      assert.equal(topic.getValue(), true);
    });

  });
  
});

