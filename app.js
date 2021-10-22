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

    if (connectionScreenWidth && !screenWidthList.map(item => item.id).includes(socket.id)) {
      const newItem = {
        id: socket.id,
        screenWidth: connectionScreenWidth
      }

      screenWidthList = [...screenWidthList, newItem];

      if (screenWidthList.length > 2){
        screenWidthList = screenWidthList.filter((_, index) => index !== 0);
      }
    }

    console.log('New conection ->', screenWidthList);

    socket.on('draw', (item) => {
        if (screenWidthList[0] && item.end.x > screenWidthList[0].screenWidth) {
          io.emit('updateDraw', {...item, direction: screenWidthList[1].id, firstSize: screenWidthList[0].screenWidth})
        } else if (screenWidthList[0]){
          io.emit('updateDraw', {...item, direction: screenWidthList[0].id})
        }
    })
})
