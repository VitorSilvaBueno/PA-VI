const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let screenWidthList = [];

server.listen(8080, () => {
  console.log('listening on *:8080');
});

app.use(express.static(__dirname + "/public"))

io.on('connection', (socket) => {
    const connectionScreenWidth = parseInt(socket.handshake.query.screenWidth);

    // TODO: improve 
    if (connectionScreenWidth && !screenWidthList.map(item => item.id).includes(socket.id)) {
      const newItem = {
        id: socket.id,
        screenWidth: connectionScreenWidth
      }

      screenWidthList = [...screenWidthList, newItem];
    }
    
    

    console.log('New conection ->', screenWidthList);

    socket.on('draw', (item) => {
        if (item.end.x > screenWidthList[2].screenWidth) {
          io.emit('updateDraw', {...item, direction: screenWidthList[3].id, firstSize: screenWidthList[2].screenWidth})
        } else {
          io.emit('updateDraw', {...item, direction: screenWidthList[2].id})
        }
        
    })
})