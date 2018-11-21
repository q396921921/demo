var db2 = require('redis');
var option = {
    host: '47.92.215.175', // default 
    // host: 'localhost', // default 
    port: 6379, //default 
    max_clients: 30, // defalut 
    perform_checks: false, // checks for needed push/pop functionality 
    database: 0, // database number to use 
    options: {
        auth_pass: ''
    } //options for createClient of node-redis, optional 
}
/**
 * 获得一个redis连接
 */
const db_client = db2.createClient(option);
db_client.on('error', function (err) {
    console.log('连接出现错误');
    console.log(err);
    if (err) {
        console.log('error');
    }
})
db_client.on('connect', function () {
    console.log('Redis连接成功');
})
exports.client = db_client;


// var db = {};
// /**
//  * 获取存储在key中指定字段field的值。
//  * @param {string} key 
//  * @param {string} field 
//  * @param {function} callback 
//  */
// db.hget = function (key, field, callback) {
//     redisPool.hget(key, field, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 获取在哈希表中指定 key 的所有字段和值
//  * @param {string} key 
//  * @param {function} callback 
//  */
// db.hgetall = function (key, callback) {
//     redisPool.hgetall(key, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 将哈希表 key 中的字段 field 的值设为 value 
//  * @param {string} key 
//  * @param {string} field 
//  * @param {string} value 
//  * @param {function} callback 
//  */
// db.hset = function (key, field, value, callback) {
//     redisPool.hset(key, field, value, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// db.hmset = function (key, field, value, callback) {
//     redisPool.hmset(key, field, value, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 删除一个或多个哈希表字段fields
//  * @param {string} key
//  * @param {Array} fields 
//  * @callback callback - (err,result)
//  */
// db.hdel = function (key, fields, callback) {
//     redisPool.hdel(key, fields, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 
//  * @param {string} key 
//  * @param {function} callback
//  * 获取相对应的键值 
//  */
// db.get = function (key, callback) {
//     redisPool.get(key, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }

// /**
//  * 设置相应的键与值
//  * @param {string} key 
//  * @param {string} value 
//  * @param {function} callback
//  */ 
// db.set = function (key, value, callback) {
//     redisPool.set(key, value, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 为这个键设置过期时间
//  * @param {string} key 
//  * @param {string} value 
//  * @param {function} callback 
//  */
// db.expire = function (key, value, callback) {
//     redisPool.expire(key, value, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 删除对应的键
//  * @param {string} key 
//  * @param {function} callback 
//  */
// db.del = function (key, callback) {
//     redisPool.del(key, (err, result) => {
//         if (err) {
//             console.log(err);
//             callback(err, null);
//         } else {
//             callback(null, result);
//         }
//     })
// }
// /**
//  * 移出并获取列表的最后一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。
//  * @param {String} key - 传入的键值
//  * @param {Function} cb - {function} - 回调函数
//  */
// db.brpop = function (key, cb) {

// }
// /**
//  * 移出并获取列表的第一个元素， 如果列表没有元素会阻塞列表直到等待超时或发现可弹出元素为止。
//  * @param {String} key 
//  * @param {Function} cb 
//  */
// db.blpop = function (key, cb) {

// }
// /**
//  * 在列表中              添加一个或多个值
//  * @param {String} key 
//  * @param {String} value 
//  * @callback callback
//  */
// db.rpush = function (key, value, callback) {

// }

// db.lpush = function (key, value, callback) {

// }