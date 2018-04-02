const express = require('express')
const mongoose = require('mongoose');
const config_url = require('./config/database');

const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

const authentication  = require('./routes/authenticaton');

mongoose.Promise = global.Promise;
mongoose.connect(config_url.url, (err)=>{
  if(err){
    console.log("Could not connect to database: ", err);
  }else{
    console.log("Connected to database.");
  }
});

app.use(express.static(__dirname+'/client/dist/'));
//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/authentication', authentication);

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});


const port = process.env.PORT || 8080;

app.listen(port, ()=>{
  console.log(`Listen on port ${port}.`);
})
