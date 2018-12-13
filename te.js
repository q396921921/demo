
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
var pool = require('./db/mysql/pool');
var promise = require('bluebird');
async function sync(mysql, redis, IdName, tName, cb) {
    try {
        if (redis) {
            let count = 0;
            async.eachSeries(redis, function (rds, cb2) {
                count = await judge(mysql, rds, count, IdName, tName);
                cb2();
            }, function (err) {
                cb(null, 'success');
            })
        } else {
            cb(null, 'success');
        }
    } catch (err) {
        cb('error');
    }
}
// repet this function
var judge = promise.promisify(async function (mysql, rds, count, IdName, tName, cb) {
    try {
        let Id1 = rds[IdName];
        let keys = Object.keys(rds);
        let vals = Object.values(rds);
        if (mysql.length >= (count + 1)) {
            // update or not change
            let Id2 = mysql[count][IdName];
            if (Id1 === Id2) {
                if (JSON.stringify(rds) === JSON.stringify(mysql[count])) {
                    cb(null, ++count);
                } else {
                    let ret = await update(keys, vals, IdName, tName);
                    cb(null, ++count);
                }
            } else {
                // delete this mysql data and insert
                let arr = [Id1];
                let sql = "delete from " + tName + ' where ' + IdName + '=?';
                let ret = await db(sql, arr);
                judge(mysql, rds, count, IdName, tName, cb);
            }
        } else {
            // insert
            let ret = await insert(keys, vals, tName);
            cb(null, ++count);
        }
    } catch (err) {
        cb('error');
    }
})
var update = promise.promisify(async function (keys, vals, IdName, tName, cb) {
    try {
        let set = "";
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (i != keys.length - 1) {
                set += ' ' + k + '=?,';
            } else {
                set += ' ' + k + '=?';
            }
        }
        let arr = vals.concat([Id1]);
        let sql = 'update ' + tName + ' set' + set + ' where ' + IdName + '=?';
        let ret = await db(sql, arr);
        cb(null, ret);
    } catch (err) {
        cb('error');
    }
})
var insert = promise.promisify(async function (keys, vals, tName, cb) {
    try {
        let circle1 = "";
        let circle2 = "";
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (i != keys.length - 1) {
                circle1 += k + ',';
                circle2 += '?,';
            } else {
                circle1 += k;
                circle2 += '?';
            }
        }
        let sql = "insert into " + tName + "(" + circle1 + ") values (" + circle2 + ")";
        let ret = await db(sql, vals);
        cb(null, ret)
    } catch (err) {
        cb('error');
    }
})
const db = promise.promisify(function (sql, arr, cb) {
    pool.getConn(sql, arr, (err, ret) => {
        if (err) {
            cb('error');
        } else {
            cb(null, ret);
        }
    })
})