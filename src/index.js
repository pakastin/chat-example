
var http = require('http');

var express = require('express');
var socketio = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketio(server);

app.use(express.static(__dirname + '/../public'));

server.listen(8080);

io.on('connection', function (socket) {
  socket.on('msg', function (data) {
    data.time = Date.now();
    io.emit('msg', data);
  });
});
