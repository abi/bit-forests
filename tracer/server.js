var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var burrito = require('burrito');

server.listen(3001);

app.get('/', function(req, res){
    res.end(fs.readFileSync('tracer.html', 'utf8'));
});

// Source code transformations

// type, name, line, method, args, val_before, val_after

function transform(original){
    var src = burrito(original, function (node) {
        if (node.name === 'assign'){        
          node.wrap("{%s; trace('" + node.value[1][1] + "', " + node.value[1][1] + ", " +
                      node.start['line'] + ", 'assignment', [])}");
            //console.log(node.start);
        } else if(node.name == 'call' && node.start['type'] === 'name' && node.value[0].length > 2){
          console.dir(node);
          node.wrap("{%s; trace('" + node.start['value'] + "', " + node.start['value'] + ", " +
                    node.start['line'] + ", '" + node.value[0][2] + "', [])}");
        }
        // console.log(node.name);
        // } else if (node.name === ''){

        // }

        // TODO: Support for detecting that it's a function call and checking that the name of the function is push
        // Note down, arrays before and after

    });
    console.log(src);
    return src;
}

// File watching

var FILE = 'source.js';

fs.watch(FILE, {}, function(event, filename){
    // TODO: Fix filename issue
    msg = refresh(filename);
    for(var i = 0; i < sockets.length; i++){
        sockets[i].emit('update', msg);
    }
});

function refresh(filename){
    var contents =  fs.readFileSync(FILE, 'utf8');
    var msg = {'source': contents, 'transformed': transform(contents)};
    return msg;
}

// Sockets

var sockets = []

io.sockets.on('connection', function (socket) {
  socket.emit('update', refresh(FILE));
  sockets.push(socket);
});

app.use(express.static(__dirname + '/static'));