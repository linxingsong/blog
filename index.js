const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const config_url = require('./config/database');

const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(config_url.url, [config_url.db], (err)=>{
  if(err){
    console.log("Could not connect to database: ", err);
  }else{
    console.log("Connected to database: "+ config_url.db);
  }
});

app.use(express.static(__dirname+'/client/dist/'));

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});


const port = process.env.PORT || 8080;

app.listen(port, ()=>{
  console.log(`Listen on port ${port}.`);
})
