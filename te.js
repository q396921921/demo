
// // var socket_io = require('socket.io-client');
// // let socket = socket_io.connect('http://192.168.1.121:3333');

// // setTimeout(() => {
// //     let order_type = "1";
// //     socket.emit('createOrder', order_type);
// // }, 1000);

// // socket.on('getOrder_id', (data) => {
// //     console.log('我收到了服务器返回的订单id: ' + data.order_id);
// // })
// // let WebSocket = require('ws');
// // var ws = new WebSocket("ws://192.168.1.138:2222");
// // ws.onopen = function () {
// //     console.log('我连接到服务器了');
// // }
// // ws.onmessage = function(e) {
// //     let data = e.data;
// //     console.log('我接受到了来自服务器的消息'+data);
// // }
// // ws.onclose = function(event) {
// //     var code = event.code;
// //     var reason = event.reason;
// //     var wasClean = event.wasClean;
// //     console.log('我得错误码为：'+code,'我得错误原因为：'+reason,'我得清除事件:'+wasClean);
// // // }
// // var async = require('async');

// // var mdb = require('./db_mysql/queryOrder');
// // var md = require('./db_redis/copy_mysql');

// // var request = require('request');


// // request({ url: 'https://oh2.daotongkeji.com' + '/management/creatChatroom', method: "post", body: { order_id: 895 }, json: true }, (err, res, body) => {
// //     if (err) {
// //         console.log(err);
// //     } else {
// //         console.log(546465646);
// //         console.log(body);
// //         // 如果返回success的话证明这个订单的状态创建好了
// //         if (body == 'success') {
// //             console.log('创建聊天房间成功');
// //         }
// //     }
// // })
// const queryOrder = require('./db_mysql/queryOrder');
// const queryEmp = require('./db_mysql/queryEmp');
// const queryData = require('./db_mysql/queryData');

// // const copy = require('./db_redis/copy_mysql');
// // copy.product_type((ret) => {
// // console.log(ret);
// // });

// // const async = require('async');
// // queryOrder.getOrderState({}, [], (err, ret) => {
// //     console.log(ret);
// // })

// const Promise = require('bluebird')

// // function aaa(data, cb) {
// //     setTimeout(function () {
// //         console.log('我是1');
// //         cb(data)
// //     }, 2000)
// // }

// // function bbb(data, cb) {
// //     setTimeout(function () {
// //         console.log('我是2');
// //         cb('222')
// //     }, 1000)
// // }

// // let asyncaaa = Promise.promisify(aaa);
// // let asyncbbb = Promise.promisify(bbb);


// function first(data, cb) {
//     console.log(data);
//     var str = "first";
//     console.log("begin");
//     cb(null, str);
// }

// function second(data, cb) {
//     var str = "second";
//     console.log(data);
//     cb(null, str);
// }

// var firstAsync = Promise.promisify(first);
// var secondAsync = Promise.promisify(second);

// // Promise.resolve('123').then(firstAsync).then(console.log).catch(console.log)

// // class Thenable {
// //     constructor(num) {
// //         this.num = num
// //         console.log(this.num);
// //     }
// //     then(resolve, reject) {
// //         console.log(resolve) // function() {native code}
// //         // 1000ms后将this.num*2作为resolve值
// //         setTimeout(() => { resolve(this.num * 2), 1000 })
// //     }
// // }
// // async function f() {
// //     // 等待1s，result变为2
// //     let result = await new Thenable(1)
// //     console.log(result);
// // }
// // f();





// const db = require('./db_redis/redis_conn');
// const client = db.client




// let multi = client.multi();
// multi.lset('key', 1, '__deleted__');
// // LSET ListKey index "__deleted__"
// // LREM ListKey 0 "__deleted__"
// multi.lrem('key', 0, '__deleted__');
// multi.lpush('key','100');
// multi.exec(function (err, replies) {
//     console.log(replies); // 101, 2
// })

let fs = require('fs');
// fs.stat('./s', (err, ret) => {
//     console.log(ret);
// })

var writable = fs.createWriteStream('a.jpg', {
    flags: 'w',
    defaultEncoding: 'base64',
    // mode: 0666,
});

writable.on('finish', function () {
    console.log('write finished');
    writable.end();
    process.exit(0);
});
writable.on('error', function (err) {
    console.log('write error - %s', err.message);
});



// var readable = fs.createReadStream('./plustag.jpg', {
//     flags: 'r',
//     encoding: 'base64',
//     autoClose: true,
//     // mode: 0666,
// });

// readable.on('open', function (fd) {
//     console.log('file was opened, fd - ', fd);
// });

// readable.on('readable', function () {
//     console.log('received readable');
// });

// readable.on('data', function (chunk) {
//     writable.write(chunk, 'base64');
//     console.log(writable.bytesWritten);
//     // console.log('read %d bytes: %s', chunk.length, chunk);
// });

// readable.on('end', function () {
//     console.log('read end');
// });

// readable.on('close', function () {
//     console.log('file was closed.');
// });

// readable.on('error', function (err) {
//     console.log('error occured: %s', err.message);
// });
// let req = "";
// let a = { "ip": req.ip, "userAgent": req.headers.user - agent, }

// var request = require('request');
// request({ url: 'https://oh2.daotongkeji.com/management/rmChatroom', method: "post", body: { order_id: 2519 }, json: true }, (err, res, body) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(body);
//     }
// })
// console.log(process.argv);

var db2 = require('redis');
var option = {
    host: '47.92.215.175', // default 
    // host: 'localhost', // default 
    port: 6379, //default 
    auth_pass: 'chaiyang44554454554464',
    max_clients: 30, // defalut 
    perform_checks: false, // checks for needed push/pop functionality 
    database: 0, // database number to use 
    // options: {
    //     auth_pass: 'shaoshi123'
    // } //options for createClient of node-redis, optional 
}
/**
 * 获得一个redis连接
 */

// db2.on('error', function (err) {
//     console.log('连接出现错误');
//     console.log(err);
//     if (err) {
//         console.log('error');
//     }
// })

// db2.on('connect', function () {
//     console.log('Redis连接成功');
// })
// var sub = db2.createClient(option), pub = db2.createClient(option);
// var msg_count = 0;

// sub.on("subscribe", function (channel, count) {
//     pub.publish("a nice channel", "I am sending a message.");
//     pub.publish("a nice channel", "I am sending a second message.");
//     pub.publish("a nice channel", "I am sending my last message.");
// });

// sub.on("message", function (channel, message) {
//     console.log("sub channel " + channel + ": " + message);
//     msg_count += 1;
//     if (msg_count === 3) {
//         sub.unsubscribe();
//         sub.quit();
//         pub.quit();
//     }
// });
// sub.subscribe("a nice channel");

// var client  = require("redis").createClient(option);
// client.monitor(function (err, res) {
//     console.log("Entering monitoring mode.");
// });
// client.set('foo', 'bar');

// client.on("monitor", function (time, args, raw_reply) {
//     console.log(time + ": " + args); // 1458910076.446514:['set', 'foo', 'bar']
// });

var client = db2.createClient(option);
// var clientBlocking = client.duplicate();

// var get = function() {
//     console.log("get called");
//     client.get("any_key",function() { console.log("get returned"); });
//     setTimeout( get, 1000 );
// };
// var brpop = function() {
//     console.log("brpop called");
//     clientBlocking.brpop("nonexistent", 5, function() {
//         console.log("brpop return");
//         setTimeout( brpop, 1000 );
//     });
// };
// get();
// brpop();
let arr = [];
arr.push(123);
console.log(arr);
