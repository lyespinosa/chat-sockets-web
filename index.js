const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const users = new Map();

const adminNameSpace = io.of('/admin');
adminNameSpace.on('connection', (socket) => {

  socket.on('join', (data) => {
    socket.join(data.room);
    adminNameSpace.in(data.room).emit('chat message', `New user joined the ${data.room} room`);
    console.log("El socket - " + JSON.stringify(socket.id) + data.name)
    users.values();
  })

  socket.on('chat message', (msg, image, room, name) => {
    console.log('message: ' + JSON.stringify(name) + ": " + msg);
    adminNameSpace.in(room).emit('chat message', name + ": " + msg, image);
  });

socket.on('user image', (data) => {
  adminNameSpace.in(data.room).emit('addimage', "Imagen compartida: " + data);
});

socket.on('disconnect', () => {
  console.log('user disconnected');
});



});




server.listen(3001, () => {
  console.log('listening on *:3001');
});
