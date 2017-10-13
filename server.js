const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();

mongoose.connect('mongodb://dev:dev123@ds125914.mlab.com:25914/dev_yournurse', { useMongoClient: true });
mongoose.Promise = global.Promise;

/* for local dev use line below*/

// app.use(express.static(path.join(__dirname, 'client/build')));
// app.get('', function (req, res) {
//    res.sendFile(path.join(__dirname, 'client/build/index.html'));
//  })

process.env.PWD = process.cwd();
app.set('client', path.join(process.env.PWD, 'client/build'));
app.use(express.static(path.join(process.env.PWD, 'client/build')));

app.use(bodyParser.json());

app.use(cors());
app.use(routes);
app.use(function(req, res, err, next){
  res.header('Access-Control-Allow-Origin',  '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
});

app.listen(process.env.PORT, function(){
  console.log("Server is running");
});
