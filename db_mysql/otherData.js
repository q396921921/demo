// 这个是用来修改前端页面那些显示的东西的
let conn = require('./pool')
var Promise = require('bluebird');;

module.exports = {
    /**
     * 传入要修改的图片路径，和对应id修改
     */
    updatezizhiImg: Promise.promisify(function (arr, cb) {
        let sql = "update data_zizhi set imgPath=? where zizhi_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入要修改的文字内容，和对应id修改
     */
    updatezizhiText: Promise.promisify(function (arr, cb) {
        let sql = "update data_zizhi set text=? where zizhi_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入商品id以及uid，修改对应商品
     */
    updatehome_page_product: Promise.promisify(function (arr, cb) {
        let sql = "update data_home_page set product_id=? where home_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入图片路径以及uid，修改广告
     */
    updatehome_page_ADImg: Promise.promisify(function (data, arr, cb) {
        // let sql = "update data_home_page set imgPath=?,imgPath2=?,product_id=? where home_id=?";
        let sql = "update data_home_page set ";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        sql += ' where home_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入内容以及uid，修改广告
     */
    updatehome_page_ADText: Promise.promisify(function (arr, cb) {
        let sql = "update data_home_page set text=?,product_id=? where home_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入business_id与name修改合作伙伴表的name值
     */
    updatebusiness: Promise.promisify(function (arr, cb) {
        let sql = "update data_business set bus_name=? where bus_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入small_text与bank_imgPath以及对应的uid修改银行表中的小图标和小文字
     */
    updatebusinessSmallTextAndBankImg: Promise.promisify(function (arr, cb) {
        let sql = "update data_partner set small_text=?,bank_imgPath=? where partner_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入small_text以及对应的uid修改银行表中的小文字
     */
    updatebusinessSmallText: Promise.promisify(function (arr, cb) {
        let sql = "update data_partner set small_text=? where partner_id=?";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入name
     */
    updatepartnerDetail: Promise.promisify(function (data, arr, cb) {
        let sql = "update data_partner set ";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        sql += ' where partner_id=?';
        conn.getConn(sql, arr, cb);
    }),
}

function isEmpty(arr) {
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == 'null') {
            arr2.push(null);
        } else if (arr[i] != "" && arr[i]) {
            arr2.push(arr[i]);
        }
    }
    return arr2;
}

function isExist(sql, data) {
    let keys = Object.keys(data);
    let count = 0;
    for (let i = 0; i < keys.length; i++) {
        let value = data[keys[i]];
        if (value != '' && value && count == 0) {
            sql += keys[i] + '=?'
            count++;
        } else if (value != '' && value) {
            sql += ',' + keys[i] + '=?'
            count++;
        }
    }
    return sql;
}