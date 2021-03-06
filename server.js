'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const fs = require('fs');
const dataFile = './data.json';
const dataHelpers = require('./utils/datahelpers.js');

app.use(express.static('public'));

// Simple client interface route for capturing JSON and running queries.
app.get('/', (req, res) => {
  res.sendFile('index.html');
});

/*
=========
SOCKET.IO
=========
*/

io.on('connection', (socket) => {
  console.log('Client connected.');
  socket.join('update');

  // When new JSON data is incoming, broadcast a message to all clients
  // listening on the update channel with the data and write to JSON file.
  socket.on('UPDATE_DATA', (data) => {

    // Validate JSON from client.
    let validateJson = dataHelpers.isJson(data);
    if (validateJson) {
      io.to('update').emit('INCOMING_DATA', data);
      dataHelpers.writeFile(data, dataFile);
    } else {
      // Emit the data back if it's not valid JSON for client side handler
      // to log appropriate error message.
      console.log('Incorrect JSON format specified.');
      io.to('update').emit('JSON_ERROR', data);
    }

  });

  // Query logic based on key provided from client.
  socket.on('QUERY_DATA', (key) => {

    // Buffer of existing contents of JSON file.
    fs.readFile(dataFile, (err, content) => {

      if (err) throw err;
      // If key exists in the file, return it's value as the result.
      // Emit the returned result to client side code.
      if (content.length !== 0) {
        let result = dataHelpers.query(content, key);
        io.to('update').emit('QUERY_RESULT', result);
      } else {
        console.log('There is no data available.');
      }

    });

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });

});

exports.server = http.listen(8080);
