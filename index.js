const express = require('express')
const mongoose = require('mongoose');
const config_url = require('./config/database');

const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');

const cors = require('cors');

const authentication  = require('./routes/authenticaton');
const blogs = require('./routes/blog');

mongoose.Promise = global.Promise;
mongoose.connect(config_url.url, (err)=>{
  if(err){
    console.log("Could not connect to database: ", err);
  }else{
    console.log("Connected to database.");
  }
});

//cons
const corsOptions = {
  origin: 'http://localhost:4200'
}
//body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//cors here. cross domain
app.use(express.static(__dirname+'/public'));
app.use('/authentication', cors(corsOptions), authentication);
app.use('/blogs', cors(corsOptions), blogs);
app.get('*', (req, res)=>{
  res.sendFile(path.join(__dirname+'/public/index.html'));
});


const port = process.env.PORT || 8080;

app.listen(port, ()=>{
  console.log(`Listen on port ${port}.`);
})
