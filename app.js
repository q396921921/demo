var createError = require('http-errors');
var express = require('express');   // import frame
var path = require('path');   // path module
var cookieParser = require('cookie-parser');  // cookie
var cors = require('cors');   // cross domain
var session = require('express-session')
var ejs = require('ejs');

// import routers file
var usersRouter = require('./routes/users');
var headRouter = require('./routes/head');

// create frame
var app = express();
// insert middleware

// view
app.engine('html', ejs.__express);  // use html as engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));  // set default path such as view file html or ejs

// var accessLog = fs.createWriteStream('./log/access.log', { flags: 'a' });  // margan
// var errorLog = fs.createWriteStream('./log/error.log', { flags: 'a' });  // margan
// app.use(logger('dev')); // the middleware of log,this can print to console
// app.use(logger('combined', { stream: accessLog }));  // morgan print to logs file

// parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cross-domain
app.use(cors());

app.use(cookieParser());

// session middleware
app.use(session({
  secret: 'secret', // signing sessionId-related cookies
  resave: true,
  name: 'oh2', // the name of the cookie saved at the front end
  saveUninitialized: false, // whether to save not initialization session
  cookie: {
    maxAge: 1000 * 60 * 30, // set up session's effective time
  },
}));

// public static path, you can get all resources in this folder by adding resourse name to the root path
app.use('/', express.static(path.join(__dirname, 'public')));

// insert router
app.use('/users', usersRouter);
app.use('/head', headRouter);

// capture 404 error
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;