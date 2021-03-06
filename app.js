//60132289 양희원
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var methodOverride = require('method-override');
var flash = require('connect-flash');
var mongoose   = require('mongoose');
var passport = require('passport');
var configAuth = require('./config/auth');
var routes = require('./routes/index');
var users = require('./routes/users');
var rooms = require('./routes/rooms');
var reservations = require('./routes/reservations');
var routeAuth = require('./routes/auth');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
if (app.get('env') === 'development') {
  app.locals.pretty = true;
}
app.locals.moment = require('moment');
mongoose.connect('mongodb://qwe:qwe@ds021299.mlab.com:21299/a');
mongoose.connection.on('error', console.log);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'long-long-long-secret-string-1313513tefgwdsvbjkvasd'
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(path.join(__dirname, '/bower_components')));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  console.log("REQ USER", req.user);
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});
configAuth(passport);
app.use('/', routes);
app.use('/users', users);
app.use('/rooms', rooms);
app.use('/reservations', reservations);
routeAuth(app, passport);
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
