// Intializing the server and external resources
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Screen width list
let screenWidthList = [];

// Communicating with the port
server.listen(8080, () => {
  console.log('listening on *:8080');
});

// Defining the folder
app.use(express.static(__dirname + "/public"))

// Listening for connection events
io.on('connection', (socket) => {

  // Checking for the screen width on the connection
  const connectionScreenWidth = parseInt(socket.handshake.query.screenWidth);

  // If screen width is found and isn't on the list
  if (connectionScreenWidth && !screenWidthList.map(item => item.id).includes(socket.id)) {
    // Create a item with it's id and width
    const newItem = {
      id: socket.id,
      screenWidth: connectionScreenWidth
    }

    // Add the item to the list
    screenWidthList = [...screenWidthList, newItem];

    // Controlling the number of current display screens connected
    if (screenWidthList.length > 2) {
      screenWidthList = screenWidthList.filter((_, index) => index !== 0);
    }
  }

  // Inform of the new connection
  console.log('New conection ->', screenWidthList);

  // Check if the draw is to be displayed on multiple screens and emit events with the necessary information
  socket.on('draw', (item) => {
    if (screenWidthList[0] && item.end.x > screenWidthList[0].screenWidth) {
      io.emit('updateDraw', { ...item, direction: screenWidthList[1].id, firstSize: screenWidthList[0].screenWidth })
    } else if (screenWidthList[0]) {
      io.emit('updateDraw', { ...item, direction: screenWidthList[0].id })
    }
  })
})
