
var http = require('http');

var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);

var sockets = {};

app.use(express.static(__dirname + '/../public'));

server.listen(8080);

io.on('connection', function (socket) {
  sendUserList();
  socket.on('msg', function (data) {
    if (!sockets[socket.id]) {
      io.emit('msg', {
        time: Date.now(),
        name: data.name,
        message: 'joined..'
      });
    } else if (sockets[socket.id] !== data.name) {
      io.emit('msg', {
        time: Date.now(),
        name: sockets[socket.id],
        message: 'changed name to ' + data.name + '..'
      });
    }
    sockets[socket.id] = data.name;
    sendUserList();
    data.time = Date.now();
    io.emit('msg', data);
  });
  socket.on('disconnect', function () {
    var name = sockets[socket.id];

    if (name) {
      io.emit('msg', {
        time: Date.now(),
        name: name,
        message: 'left..'
      })
      sockets[socket.id] = null;
      sendUserList();
    }
  });
  function sendUserList () {
    var names = [];

    for (var id in sockets) {
      if (sockets[id]) {
        names.push(sockets[id]);
      }
    }
    io.emit('userlist', names);
  }
});
