'use strict';

const express           = require('express');
const app               = express();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const fs                = require('fs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const IsJson = (data) => {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
}

io.on('connection', (socket) => {
  console.log('Client connected.');
  socket.join('update');

  // When new data is incoming, broadcast a message to all clients
  // listening on the update channel with the data and write to .txt file.
  socket.on('UPDATE_DATA', (data) => {
    //Validate if JSON is valid or not
    let parsedData = JSON.parse(data);
    let validateJson = IsJson(parsedData);
    if (validateJson) {
      io.to('update').emit('INCOMING_DATA', JSON.stringify(parsedData));
      //Write JSON data to .txt file

    } else {
      io.to('update').emit('JSON_ERROR', data);
    }

  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });

});

http.listen(8080, () => console.log('Listening on port 8080.'));