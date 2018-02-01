process.env.NO_DEPRECATION = 'redis-async-wrapper';

var after = require('after')
var assert = require('assert')
var dal = require('../')

describe('redis-async-wrapper', function(){
  it('get wrapper', function(){
    assert.equal(typeof dal.init, 'function')
  })

  it('should success', function() {
  })

  it('should fail', function() {
  })

})
