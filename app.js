const express = require('express');
const expressSession = require("express-session")
//var RedisStore = require('connect-redis')(expressSession);
//const redis = require('redis');
//const RedisServer = require('redis-server');
//var commands = require('redis-commands');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const resend = require('./routes/resend');
const app = express();
const responseTime = require('response-time')
var obj = {
  everything: [],
  topHeadLines: [],
  date: function () {
    let t = new date()
    return t
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'malaguenhaaaaa', saveUninitialized: true,
  resave: true
}));
app.use(responseTime());
/*app.use('/publicbower', express.static(path.join(__dirname, 'build/modern/public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'build/modern/public')));
app.use('/src', express.static(path.join(__dirname, 'build/modern/src')));*/

app.use('/publicbower', express.static(path.join(__dirname, 'public/bower_components/webcomponentsjs')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/socket', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist')));
app.use('/src', express.static(path.join(__dirname, 'src')));

app.use('/', index);
app.use('/mixtable/*', index);
app.use('/elemTitle/*', index);
app.use('/removeelem/*', index);
app.use('/profile/*', index);
app.post('/audio/', resend);
module.exports = app;
/* upload.single('file'), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.body)
}*/