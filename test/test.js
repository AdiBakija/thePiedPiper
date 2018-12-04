'use strict';
/* global describe it beforeEach afterEach*/
var expect = require('chai').expect;

var io = require('socket.io-client');
var io_server = require('socket.io').listen(8080);


var dataHelpers = require('../utils/datahelpers.js');

// Datahelpers Testing
describe('datahelpers', function() {

  describe('#isJson()', function() {
    it('should return true if valid JSON', function() {
      expect(dataHelpers.isJson('{"Key4": "Value4"}')).to.be.equal(true);
    });
  });

  describe('#serialize()', function() {
    it('should return serialized JSON data', function() {
      var json = {test: 'test'};
      var prettyJson = '{\n  "test": "test"\n}';
      expect(dataHelpers.serialize(json)).to.be.equal(prettyJson);
    });
  });

  describe('#query()', function() {
    it('should return the correct value from data, given a key', function() {
      var data = '[{"key1": "value1"}, {"key2": "value2"}]';
      var key = 'key2';
      expect(dataHelpers.query(data, key)).to.be.equal('value2');
    });
  });
});

// Socket.io Testing
describe('socket.io', function() {

  var socket;

  beforeEach(function(done) {
    // Setup
    socket = io.connect('http://localhost:8080', {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      done();
    });

  });

  afterEach((done) => {
    // Cleanup
    if (socket.connected) {
      socket.disconnect();
    }
    io_server.close();
    done();
  });

  it('should communicate from both ends', (done) => {
    // Once connected, emit Hello World
    io_server.emit('echo', 'Hello World!');

    socket.once('echo', (message) => {
      // Check that the message matches
      expect(message).to.equal('Hello World!');
      done();
    });

    io_server.on('connection', (socket) => {
      expect(socket).to.not.be.null;
    });
  });

});
