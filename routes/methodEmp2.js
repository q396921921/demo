var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var queryEmp = require('../db/mysql/queryEmp')
var otherEmp = require('../db/mysql/otherEmp')
var async = require('async')
var momoent = require('moment');
var xlsx = require('node-xlsx');
var path = require('path');
var timer = require('./timer');
const promise = require('bluebird');
var debug = require('debug')('app:server');
var public = require('../public/public');
var excelFile = public.excelFileCreate;
const util = require('./util');


let me = {
    /**
       * emp表
       * @param {JSON} body 查询条件
       */
    getEmp: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'emp',
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
     * dep表
     * @param {JSON} body 查询条件
     */
    getDep: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'dep',
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
     * relation_emp_resource表
     * @param {JSON} body 查询条件
     */
    getRelation_emp_resource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_emp_resource',
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
     * relation_emp_role表
     * @param {JSON} body 查询条件
     */
    getRelation_emp_role: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_emp_role',
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
     * relation_role_resource表
     * @param {JSON} body 查询条件
     */
    getRelation_role_resource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_role_resource',
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
     * resource表
     * @param {JSON} body 查询条件
     */
    getResource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'resource',
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
     * role表
     * @param {JSON} body 查询条件
     */
    getRole: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'role',
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

module.exports = me;