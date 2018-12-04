var io = require('socket.io-client')
  , assert = require('assert')
  , expect = require('expect.js')
  // , io_server = require('../server.js')
  , datahelpers = require('../utils/datahelpers.js');

describe('datahelpers', function() {

  describe('#isJson()', function() {
    it('should return true if valid JSON', function() {
      expect(datahelpers.isJson('{"Key4": "Value4"}')).to.be.equal(true);
    });
  });

  describe('#serialize()', function() {
    it('should return serialized JSON data', function() {
      var json = {"test": "test"}
      var prettyJson = '{\n  "test": "test"\n}'
      expect(datahelpers.serialize(json)).to.be.equal(prettyJson);
    })
  })
});