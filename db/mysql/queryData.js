let conn = require('./pool')
var Promise = require('bluebird');;

// 这个是用来查询前端页面那些显示的东西的

module.exports = {
    /**
     * 获取资质表的信息
     */
    getzizhi: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from data_zizhi t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 获取首页表的所有信息
     */
    gethome_page: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from data_home_page t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 获取业务合作伙伴表信息
     */
    getbusiness: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from data_business t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 获取银行表信息
     */
    getpartner: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from data_partner t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    // /**
    //  * 获取文件类型表信息
    //  */
    // getfile_type: Promise.promisify(function (data, arr, cb) {
    //     let sql = "select * from data_file_type t where 1=1";
    //     arr = isEmpty(arr);
    //     sql = isExist(sql, data);
    //     conn.getConn(sql, arr, cb);
    // }),
    /**
     * 获得新闻
     */
    getNews: Promise.promisify(function (otjs, arr, cb) {
        let limit = otjs.limit;
        let sql = "";
        if (arr[0]) {
            sql = 'select * from news where new_id=? order by new_id desc';
        } else {
            sql = 'select * from news order by new_id desc';
        }
        if (limit && limit != '') {
            sql += ' limit ' + (limit - 1) * 15 + ',15';
        }
        conn.getConn(sql, arr, cb);
    }),
}

function isEmpty(arr) {
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != "" && arr[i]) {
            arr2.push(arr[i]);
        }
    }
    return arr2;
}

function isExist(sql, data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let value = data[keys[i]];
        if (value != '' && value) {
            sql += ' and t.' + keys[i] + '=?'
        }
    }
    return sql;
}