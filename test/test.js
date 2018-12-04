'use strict';

const expect = require('chai').expect;
const server = require('../server.js');
const io = require('socket.io-client');
const ioOptions = {
      transports: ['websocket']
    , forceNew: true
    , reconnection: false
  };
const testMsg = 'HelloWorld';
var sender;
var receiver;



describe('Socket Events', function(){
  beforeEach(function(done){

    // start the io server
    server.start()
    // connect two io clients
    sender = io('http://localhost:8080/', ioOptions)
    receiver = io('http://localhost:8080/', ioOptions)

    // finish beforeEach setup
    done()
  })
  afterEach(function(done){

    // disconnect io clients after each test
    sender.disconnect()
    receiver.disconnect()
    done()
  })

  describe('Update Events', function(){
    it('Clients should receive a message when the `message` event is emited.', function(done){
      sender.emit('message', testMsg)
      receiver.on('message', function(msg){
        expect(msg).to.equal(testMsg)
        done()
      })
    })
  })
})
