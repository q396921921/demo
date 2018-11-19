// 将数据库的语句转换为同步的
const promise = require('bluebird');
const db = require('./redis_conn.js').client;
client = {};

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

module.exports = client;