const express = require('express');
const expressSession = require("express-session")
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const index = require('./routes/index');
const app = express();
const responseTime = require('response-time')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: 'malaguenhaaaaa', saveUninitialized: true,
  resave: true
}));
app.use(responseTime());
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