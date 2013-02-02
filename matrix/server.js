var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

server.listen(3000);

app.get('/', function(req, res){
	res.sendfile('matrix.html');
});

var FILE = 'static/js/matrix.js';

function refreshFile(){
  return {contents: fs.readFileSync(FILE, 'utf8')};
}

io.sockets.on('connection', function (socket) {
  socket.emit('file', refreshFile());
  socket.on('refresh', function (data) {
    socket.emit('file', refreshFile());
  });
  socket.on('save', function (data){
  	fs.writeFileSync(FILE, data.contents);
  	// Emit a confirmation ...
  });
});

app.use(express.static(__dirname + '/static'));