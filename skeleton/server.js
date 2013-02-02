var fs = require('fs');
var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.end(fs.readFileSync('matrix.html', 'utf8'));
});

app.use(express.static(__dirname + '/static'));
app.listen(3000);