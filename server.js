const express           = require('express');
const app               = express();
const http              = require('http').Server(app);
const io                = require('socket.io')(http);
const fs                = require('fs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile('index.html')
})

app.post('/', (req, res) => {

})

io.on('connection', (socket) => {
  console.log('Client connected.');
  socket.join('update');

  // When new data is incoming broadcast a message to all clients
  // listening on the update channel.
  socket.on('UPDATE_DATA', () => {
    io.to('update').emit('incoming_data', JSON.stringify(data));
  });

});

http.listen(8080, () => console.log('Listening on port 8080.'));