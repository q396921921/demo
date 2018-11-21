// 专门处理前端动态数据显示的模块

var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var queryData = require('../db/mysql/queryData')
var otherData = require('../db/mysql/otherData')
var queryOrder = require('../db/mysql/queryOrder')
var async = require('async')
var momoent = require('moment');
var xlsx = require('node-xlsx');
var path = require('path');
var timer = require('./timer');
const promise = require('bluebird');
var debug = require('debug')('app:server');
var public = require('../public/public');
var symbol = public.symbol;
var uploadFile = public.uploadFolde;      // 后台修改上传图片文件的文件夹名字
const util = require('./util');


md = {
    /**
     * data_business表
     * @param {JSON} body 查询条件
     */
    getData_business: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'data_business',
                condi: 'and',
            }
            let obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = getData(ret);
            cb(null, data);
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * data_home_page表
     * @param {JSON} body 查询条件
     */
    getData_home_page: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'data_home_page',
                condi: 'and',
            }
            let obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * data_partner表
     * @param {JSON} body 查询条件
     */
    getData_partner: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'data_partner',
                condi: 'and',
            }
            let obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * data_zizhi表
     * @param {JSON} body 查询条件
     */
    getData_zizhi: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'data_zizhi',
                condi: 'and',
            }
            let obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
}

module.exports = {};