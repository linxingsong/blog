var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
var http = require('http');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, 'dist/index.html'));
})

// app.use('/', index);
// app.use('/api', post);

var port = process.env.PORT || 3000;
app.set('port', port);

var server = http.createServer(app);
server.listen(port, ()=>{
  console.log("Server is runing")
});

