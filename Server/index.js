const express  = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const index = require('./routes/index');
const post = require('./routes/post');

//set port
const port = 3000 || process.env.PORT;

const app = express();

//view Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile); 

//set static folder 
app.use(express.static(path.join(__dirname, 'client')));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//routes
app.use('/', index);
app.use('/api', post);

app.listen(port, ()=>{
  console.log(`Server started on ${port}.`);
});