'use strict';

const express           = require('express');
const app               = express();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const fs                = require('fs');
const datahelpers       = require('./utils/datahelpers.js');

app.use(express.static('public'));

//Simple client interface for capturing JSON and running queries.
app.get('/', (req, res) => {
  res.sendFile('index.html');
});


io.on('connection', (socket) => {
  console.log('Client connected.');
  socket.join('update');

  // When new JSON data is incoming, broadcast a message to all clients
  // listening on the update channel with the data and write to JSON file.
  socket.on('UPDATE_DATA', (data) => {

    //Validate if JSON is valid or not
    let validateJson = datahelpers.isJson(data);
    if (validateJson) {
      let parsedData = JSON.parse(data);
      io.to('update').emit('INCOMING_DATA', data);

      //Buffer of existing contents of JSON file.
      fs.readFile("./data.json", (err, content) => {
        //If contents exist in the file, treat it as an array of objects.
        //Otherwise, create an empty array and add the data.
        if (content.length !== 0) {
          let buffer = JSON.parse(content);
          buffer.push(parsedData);
          //Write JSON data to file buffer.
          fs.writeFile("./data.json", datahelpers.serialize(buffer), 'utf-8', (err) => {
              if (err) {
                  console.error(err);
                  return;
              };
              console.log("File has been updated.");
          });
        } else {
          //If file is empty, create JSON structure as array of objects.
          let json = [];
          json.push(parsedData);
          fs.writeFile("./data.json", datahelpers.serialize(json), 'utf-8', (err) => {
              if (err) {
                  console.error(err);
                  return;
              };
              console.log("Initial entry has been created.");
          });
        }
      });

    } else {
      //Emit the data back if it's not valid JSON for client side handler
      //To log appropriate error message.
      console.log('Incorrect JSON format specified.')
      io.to('update').emit('JSON_ERROR', data);
    }

  });

  socket.on('QUERY_DATA', (key) => {
    fs.readFile("./data.json", (err, content) => {
      //If key exist in the file, return it's value as the result.
      //Emit the returned result to client side code.
      if (content.length !== 0) {
        let buffer = JSON.parse(content);
        let result;
        buffer.forEach((obj) => {
          if(obj[key] != undefined) {
            result = obj[key];
          }
        });
      io.to('update').emit('QUERY_RESULT', result);
      } else {
        console.log("There is no data available.");
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected.');
  });

});

console.log(datahelpers.serialize([{test: 'test'}]));

exports.server = http.listen(8080);