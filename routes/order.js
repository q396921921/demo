var express = require('express');
var router = express.Router();
const url = require('url');
const qs = require('qs');
const public = require("../public/public");
var mdOrder = require('../control/methodOrder');


router.get('/order*', function (req, res, next) {
    let ul = url.parse(req.url)
    let ulstr = 'order/' + ul.pathname.substring(1);
    let obj = qs.parse(ul.query);
    let menu = obj.menu;
    let order_id = obj.order_id;
    req.session.menu = menu ? menu : req.session.menu;
    res.render(ulstr, { "username": req.session.username, "menu": req.session.menu, order_id: order_id })
});
/**
 * 传入五项数据，返回分页后的订单数据
 * @param {number} role_type 角色类型id
 * @param {number} userdep_id 部门id
 * @param {number} busoff_id 对应内勤id
 * @param {number} limit 页码
 * @param {number} order_type 订单类型
 * @returns {JsonString} {data:[ar1,ar2...],totalPage:x, totalNum:x }
 */
router.post('/getSplitOrders', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getOrders(req);
            res.send(JSON.stringify(data));
        } catch (err) {
            res.send('error');
        }
    })()
})
// use
router.post('/getOrders', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getOrders(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 传入flow_detail_id，返回对应的具体流程
 * @param {number} flow_detail_id 
 * @returns {JsonString} {data:data}
 */
router.post('/getFlow_detail', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getFlow_detail(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 传入state_id,返回对应的具体状态
 * @param {number} state_id 具体状态id
 * @returns {string} 具体状态的名字
 */
router.post('/getStates', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getStates(req);
            res.send(data);
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 传入订单id
 * @param {number} order_id
 * @returns {JsonString} {flow_id: x, order_id: x, flows: x, arr2: x, count2: x}
 * 具体流程id，订单id，具体流程名字，流程对应时间及失败原因，当前流程排序号
 */
router.post('/getFlows', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getFlows(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 删除订单
 * @param {number} order_type
 * @param {number} order_id
 * @returns {string} success
 */
router.post('/deleteOrder', function (req, res, next) {
    mdOrder.deleteOrder(req, (ret) => {
        res.send(ret)
    });
})
/**
 * 得到订单的流程对应ID
 * @param {number} order_type
 * @param {number} order_id
 * @returns {string} flowState
 */
router.post('/getState', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getOrder(req);
            res.send(data[0].flowState + "");
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 传入具体流程flow_detail_id，
 * @param {number} flow_detail_id 订单状态中间表id
 * 返回此id对应的订单状态中间表的具体信息，以及该流程下对应的多个状态，以及该具体流程的名字
 * @returns {JsonString} { orderState: x, states: x, flow_name: x }
 */
router.post('/getStatess', function (req, res, next) {
    mdOrder.getStatess(req, (ret) => {
        res.send(ret);
    });
})
/**
 * 传入订单id与失败原因，设置订单的失败原因，为空时，自动将订单状态设为审核中
 * @param {number} order_id
 * @param {string} failReason
 * @returns {string} success
 */
router.post('/setFailReason', function (req, res, next) {
    mdOrder.setFailReason(req, (ret) => {
        res.send(ret)
    })
})
/**
 * 修改总利润
 * @param {number} profit 利润数值
 * @returns {string} success
 */
router.post('/updateProfit', function (req, res, next) {
    mdOrder.updateProfit(req, (ret) => {
        res.send(ret);
    })
})
/**
 * 得到总利润
 * @returns {JsonString} {data:xx}
 */
router.get('/getTotal_profit', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getTotal_profit(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * 设置订单的具体状态及时间
 * @param {number} order_id 订单id
 * @param {number} state_detail_id 状态id
 * @param {dateString} time 时间
 * @returns {string} success
 */
router.post('/setState', function (req, res, next) {
    let body = req.body;
    mdOrder.setState(body, (ret) => {
        res.send(ret)
    });
})
/**
 * 设置订单的当前流程及时间
 * @param {number} flow_id 流程id
 * @param {number} order_id 订单id
 * @param {timeString} flow_time 流程时间
 * @returns {string} success
 */
router.post('/setFlow', function (req, res, next) {
    mdOrder.setFlowTime(req, (ret) => {
        res.send(ret)
    });
})
/**
 * 修改订单的基本信息
 * @param {number} order_type 订单类型
 * @param {Array} name [key,value] key为要修改的字段名，value为要修改的值
 * @param {number} order_id 订单id
 */
router.post('/updateOrder', function (req, res, next) {
    mdOrder.updateOneOrder(req, (ret) => {
        res.send(ret)
    })
})
/**
 * 修改订单大状态
 * @param {number} order_type 订单类型
 * @param {number} order_id 订单id
 * @param {number} order_state 订单状态
 */
router.post('/setOrder_state2', function (req, res, next) {
    mdOrder.setOrder_state(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(ret2)
        }
    })
})
/**
 * 修改是否提前还款状态
 * @param {number} refund  0/1
 * @param {number} order_id 
 * @returns {string} success
 */
router.post('/setRefund_state', function (req, res, next) {
    mdOrder.setRefund_state(req, (ret) => {
        res.send(ret)
    })
})
/**
 * 
 */
router.post('/getScreen', function (req, res, next) {
    mdOrder.screenOrder(req, (ret) => {
        res.send(ret)
    })
})
router.post('/screen', function (req, res, next) {
    mdOrder.screen(req, (ret) => {
        res.send(ret)
    });
})
/**
 * 传入要打印成excel表格的数据，返回生成文件的路径地址
 * @param {Array} data 要写成excel的数据
 * @returns {string} 路径
 */
router.post('/writeExcel', function (req, res, next) {
    let body = req.body;
    mdOrder.writeExcel(JSON.parse(body.data), req, (flag, pathStr) => {
        if (flag == 'true') {
            res.send(pathStr)
        } else {
            res.send('error')
        }
    })
})
/**
 * 通过访问不同的url，下载不同的图片
 * 格式/userfile/*图片具体路径
 */
router.get('/' + public.userfile + '/*', function (req, res, next) {
    res.download('.' + req.path)
})
module.exports = router;