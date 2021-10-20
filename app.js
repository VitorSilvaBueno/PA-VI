const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(8080, () => {
  console.log('listening on *:8080');
});

app.use(express.static(__dirname + "/public"))

io.on('connection', (socket) => {
    console.log('New conection')

    socket.on('draw', (item)=>{
        io.emit('updateDraw', item)
    })
})