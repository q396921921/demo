#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('app:server');
var http = require('http');
// var io = require('./../socket');
var ws = require('./../websocket');   // 引入长连接文件
var public = require("./../public/public");   // 引入公共属性文件

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || public.httpport);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);    // 创建服务器
// io.getSocketio(server);
ws.getSocketio(public.wsport);  // 开启长连接服务器

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, function () {
  console.log(`端口为:${public.httpport}的后台短连接服务器已开启`,`process pid is : ${process.pid}`);
});  // 监听服务器
server.on('error', onError);  // 监听错误
server.on('listening', onListening);  // 服务器开始时打印事件


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  // debug('Listening on ' + bind);
}