// 专门处理前端动态数据显示的模块

const promise = require('bluebird');
const get = require('../db/redis/get_redis');
const util = require('./util');

const ms = {
    /**
     * chatroom表
     * @param {JSON} body 查询条件
     */
    getChatroom: promise.promisify(async function (body, cb) {
        try {
            let obj = { tName: 'chatroom' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data);
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * message表
     * @param {JSON} body 查询条件
     */
    getMessage: promise.promisify(async function (body, cb) {
        try {
            let obj = { tName: 'message' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data);
        } catch (err) {
            cb('error');
        }
    }),
}

module.exports = ms;