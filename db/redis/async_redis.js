// 将数据库的语句转换为同步的
const promise = require('bluebird');
const db = require('./redis_conn.js').client;
client = {};

// 开启事务
client.multi = promise.promisify(function (obj, cb) {
    db.multi(obj).exec(function (err, replies) {
        if (err) {
            cb(err);
        } else {
            cb(null, replies);
        }
    })
});
// 通过索引进行修改
client.lset = promise.promisify(function (key, index, value, cb) {
    db.lset(key, index, value, (err, ret) => {
        if (err) {
            console.log(err);
            cb('error');
        } else {
            cb(null, ret);
        }
    });
})
// 遍历此list
client.lrange = promise.promisify(function (key, start, stop, cb) {
    db.lrange(key, start, stop, (err, ret) => {
        if (err) {
            console.log(err);
            cb('error');
        } else {
            cb(null, ret);
        }
    })
})
// 通过索引删除
client.lrem = promise.promisify(function (key, count, value, cb) {
    db.lrem(key, count, value, (err, ret) => {
        if (err) {
            console.log(err);
            cb('error');
        } else {
            cb(null, ret);
        }
    })
})
client.rpush = promise.promisify(function (key, value, cb) {
    db.rpush(key, value, (err, ret) => {
        if (err) {
            console.log(err);
            cb('error');
        } else {
            cb(null, ret);
        }
    })
})
module.exports = client;