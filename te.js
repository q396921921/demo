
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


// let te = 'abc<pic>saofdf<pic>';
// let c = '<pic>';
// let b = te.indexOf('<pic>');
// while (true) {
//     if(te.includes('')) {

//     }
// }
// console.log(b);