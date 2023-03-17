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

io.on('connection', (socket) => {

  socket.on('join', (data) => {
    socket.username = data.name
    if (users.includes(data.name) != true) {
      console.log(`Username ${socket.username} se ha conectado desde ${socket.handshake.address}`);
      io.emit('server message', `${data.name} se ha unido al chat`);
      users.push(socket.username)
    } else {
      console.log("este usuario ya existe")
      io.to(socket.id).emit('change username',);
    }

  })

  socket.on('chat message', (msg, image, name) => {
    //console.log(  name + ": " + msg);
    io.emit('chat message', name + ": " + msg, image);
  });

  socket.on('private message', (msg, image, name, sendBy) => {
    console.log('message: ' + JSON.stringify(name) + ": " + msg);
    io.emit('private message', name + " [Privado] : " + msg, image, name, sendBy);
  });


  socket.on('disconnect', () => {

    console.log('usuario desconectado - ' + socket.username);
    io.emit('server message', `${socket.username} salió del chat`);
    users = users.filter((item) => item !== socket.username);

  });



});




server.listen(4000, () => {
  console.log('listening on *:4000');
});
