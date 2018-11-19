var mysql = require('mysql');
var Promise = require('bluebird');

var pool = mysql.createPool({
    // host: 'localhost',
    host: '47.95.226.238',
    port: 3306,
    user: 'duzhuo',
    // password: '123456',
    password: 'duzhuo',
    database: 'loanuser'
})

let getConn = function getConn(sql, arr, cb) {
    pool.getConnection((err, conn) => {
        if (err) {
            console.log("获得连接错误")
            console.log(err);
            cb(err, null)
        }
        conn.query(sql, arr, (err, result) => {
            if (err) {
                console.log("数据库出现错误?");
                console.log(err);
                cb(err, null)
                // 关闭数据库连接?
                conn.release();
            }
            cb(null, result);
            conn.release();
        })
    })
}

module.exports.getConn = getConn;