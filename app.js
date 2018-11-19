var createError = require('http-errors');
var express = require('express');   // 导框架用的
var path = require('path');   // 路径模块
var cookieParser = require('cookie-parser');  // 操作cookie
var logger = require('morgan');     // 打日志用的
var cors = require('cors');   // 跨域的
var bodyParser = require('body-parser');  // 解析传过来的数据的
var session = require('express-session')
// var copy_mysql = require('./db_redis/copy_mysql');
// var source = require('source-map-support/register'); // 源映射
var ejs = require('ejs');

// 引进router文件夹下的路由文件
var usersRouter = require('./routes/users');
var headRouter = require('./routes/head');

// 创建框架
var app = express();
// 添加中间件的
app.engine('html', ejs.__express);  // 使用html做为项目模版
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');   // 默认使用jade模版

// app.use(bodyParser.raw({"limit":'30mb'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());    // 跨域
app.use(logger('dev'));
app.use(cookieParser());


// 使用 session 中间件
app.use(session({
  secret: 'secret', // 对session id 相关的cookie 进行签名
  resave: true,
  name: 'oh2', // 保存在前端的cookie的name
  saveUninitialized: false, // 是否保存未初始化的会话
  cookie: {
    maxAge: 1000 * 60 * 30, // 设置 session 的有效时间，单位毫秒
  },
}));

// 默认可以通过url直接访问到当前路径下的所有资源文件, '/'指定的是url中需要添加的前戳
app.use('/', express.static(path.join(__dirname, 'public')));



// 添加路由的
app.use('/users', usersRouter);
app.use('/head', headRouter);



// 捕获404错误与500错误的
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





// // 上传文件
// var multer = require('multer');
// var storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'D:/upload');
//   },
//   filename: function (req, file, cb) {
//     var name = file.mimetype.split('/')[1];
//     cb(null, file.fieldname + '-' + Date.now() + '.' + name);
//   }
// })
// var upload = multer({ storage: storage });

// app.use(upload.array('fil', 3));