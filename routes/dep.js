var express = require('express');
var router = express.Router();
const url = require('url');
const qs = require('qs');
var mdEmp = require('../control/methodEmp');

router.get('/dep*', function (req, res, next) {
    let ul = url.parse(req.url)
    let ulstr = "dep/" + ul.pathname.substring(1);
    let menu = qs.parse(ul.query).menu;
    req.session.menu = menu ? menu : req.session.menu;

    res.render(ulstr, { "username": req.session.username, "menu": req.session.menu })
});
/**
 * @description: 获得部门的详细信息
 * @method: post
 * @param {number} dep_id 可选 
 * @returns: "{data:[x,x...]}"
 */
router.post('/getDep', function (req, res, next) {
    mdEmp.getDep(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 创建一个部门
 * @method: post
 * @param {string} managerName 
 * @returns: success
 */
router.post('/createDep', function (req, res, next) {
    mdEmp.createDep(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 获得所有未被分配到部门的人
 * @method: post
 * @param {number} type 角色码 
 * @returns: "{data:[x,x...]}"
 */
router.post('/getAllEmpNotAllot', function (req, res, next) {
    mdEmp.getAllEmpNotAllot(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 为部门分配业务人员
 * @method: post
 * @param {number} dep_id
 * @param {Array} emp_id_arr 分配的业务emp表中对应的id 
 * @returns: success 
 */
router.post('/allotUser', function (req, res, next) {
    mdEmp.allotUser(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 给部门分配经理
 * @method: post
 * @param {number} emp_id 经理对应emp表的id
 * @param {number} dep_id 
 * @param {string} name manager_id-正经理/manager2_id-副经理/manager3_id-副经理,
 * @returns: success
 */
router.post('/allotManager', function (req, res, next) {
    mdEmp.allotManager(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 删除此部门分配的业务
 * @method: post
 * @param {number} dep_id
 * @param {Array} emp_id_arr [id1,id2...]要移除出部门的业务人员的emp表id 
 * @returns: success
 */
router.post('/deleteDepUser', function (req, res, next) {
    mdEmp.deleteDepUser(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 删除部门的经理
 * @method: post
 * @param {number} emp_id 经理对应emp表的id
 * @param {number} dep_id 
 * @param {string} name manager_id-正经理/manager2_id-副经理/manager3_id-副经理,
 * @returns: success
 */
router.post('/deleteManager', function (req, res, next) {
    mdEmp.deleteManager(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 删除部门
 * @method: post
 * @param {number} dep_id 
 * @returns: success
 */
router.post('/deleteDep', function (req, res, next) {
    mdEmp.deleteDep(req, (ret) => {
        res.send(ret)
    })
})

module.exports = router;