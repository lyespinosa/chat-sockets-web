const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let users = [];

const adminNameSpace = io.of('/admin');
adminNameSpace.on('connection', (socket) => {

  socket.on('join', (data) => {
    socket.join(data.room);
    socket.username = data.name
    if (users.includes(data.name) != true) {
      console.log(`Username ${socket.username} se ha conectado desde ${socket.handshake.address}`);
      console.log("El socket - " + JSON.stringify(socket.id) + socket.username)
      adminNameSpace.in(data.room).emit('user joined', `${data.name} se ha unido al chat`);
      users.push(socket.username)
    } else {
      console.log("este usuario ya existe")
      adminNameSpace.to(socket.id).emit('change username',);
    }

  })

  socket.on('chat message', (msg, image, room, name) => {
    console.log('message: ' + JSON.stringify(name) + ": " + msg);
    adminNameSpace.in(room).emit('chat message', name + ": " + msg, image);
  });

  socket.on('private message', (msg, image, room, name, sendBy) => {
    console.log('message: ' + JSON.stringify(name) + ": " + msg);
    adminNameSpace.in(room).emit('private message', name + " [Privado] : " + msg, image, name, sendBy);
  });


  socket.on('disconnect', (data) => {
    users = users.filter((item) => item !== socket.username);
    console.log('user deleted - ' + socket.username);

  });



});




server.listen(4000, () => {
  console.log('listening on *:4000');
});
