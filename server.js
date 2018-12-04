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

/*
  ============
  DATA HELPERS
  ============
*/

//Helper function to validate JSON
const IsJson = (data) => {
    try {
        JSON.parse(data);
    } catch (e) {
        return false;
    }
    return true;
};

//Helper function to serialize JSON.
const serialize = (data) => {
  return JSON.stringify(data, null, 2);
};

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

    //Validate if JSON is valid or not
    //let parsedData = JSON.parse(data);
    let validateJson = IsJson(data);
    if (validateJson) {
      io.to('update').emit('INCOMING_DATA', data);

      //Buffer of existing contents of JSON file.
      fs.readFile("./data.json", (err, content) => {
        //If contents exist in the file, treat it as an array of objects.
        //Otherwise, create an empty array and add the data.
        if (content.length !== 0) {
          let buffer = JSON.parse(content);
          buffer.push(data);
          //Write JSON data to file buffer.
          fs.writeFile("./data.json", serialize(buffer), 'utf-8', (err) => {
              if (err) {
                  console.error(err);
                  return;
              };
              console.log("File has been updated.");
          });
        } else {
          let json = [];
          json.push(data);
          fs.writeFileSync("./data.json", serialize(json), 'utf-8', (err) => {
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
          let parsedObj = JSON.parse(obj);
          if(parsedObj[key] != undefined) {
            result = parsedObj[key];
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

exports.server = http.listen(8080);