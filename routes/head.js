// createOrder

var express = require('express');
var router = express.Router();
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var async = require('async')
var path1 = require('path');
var momoent = require('moment');



// 这是封装之后的模块
var mdOrder = require('./methodOrder');
var mdEmp = require('./methodEmp');
var mdData = require('./methodData');

// use
// 创建一个订单
router.post('/createOrder', function (req, res, next) {
    let body = req.body
    mdOrder.createOrder(body, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(ret2);
        }
    });
});
// use
// 如果此订单指定内容为空，删除此订单
router.post('/deleteOrder', function (req, res, next) {
    let body = req.body
    mdOrder.deleteOrderById(body)
});
// use
// 为刚才创建的订单赋值
router.post('/updateOrder', function (req, res, next) {
    let body = req.body
    mdOrder.updateOrder(body, (ret) => {
        res.send(ret)
    })
});
// use
// 创建此订单的所有状态
router.post('/createOrderFlow', function (req, res, next) {
    let body = req.body;
    mdOrder.createOrderFlow(body, (ret) => {
        res.send(ret)
    })
});
// use
router.post('/getEmpByUsername', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    if (body.username && body.username != '') {
        mdEmp.getEmp(body, (ret, ret2) => {
            if (ret) {
                res.send(ret);
            } else {
                res.send(JSON.stringify({ data: ret2 }));
            }
        })
    }
})






// use
// getProductByOther与此路由合并为一个
router.post('/getProductById', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    mdOrder.getProduct(body, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(ret2);
        }
    })
})
// use
// 前端给客户所有订单信息
router.post('/getOrders', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));   // 手机端数据接收
    mdOrder.getOrders(body, (ret) => {
        getTime(ret, (rt) => {
            res.send(rt);
        })
    })
    // // 电脑端数据接收
    // getPostData(req, res, (body) => {
    //     mdOrder.getOrders(body, (ret) => {
    //         getTime(ret, (rt) => {
    //             res.send(rt)
    //         })
    //     })
    // })
});
// 获得所有的询值推荐订单信息
router.post('/getProductTypes', function (req, res, next) {
    let body = req.body;
    mdOrder.getProductTypes(body, (ret) => {
        res.send(ret)
    })
})
// use
// 获得产品类型，通过商品id
router.post('/getProductByOther', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    mdOrder.getProduct(body, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ data: ret2 }));
        }
    })
});
// 前端通过订单id获得其所对应的所有流程时间
router.post('/getAllOrderInfo', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));   // 手机端数据接收
    mdOrder.getAllOrderInfo(body, (ret) => {
        res.send(ret)
    })
    // getPostData(req, res, (body) => {
    //     mdOrder.getAllOrderInfo(body, (ret) => {
    //         res.send(ret)
    //     })
    // })
});
// 修改订单是否已还完款的两个状态
router.post('/setRefund_state', function (req, res, next) {
    let body = req.body;
    mdOrder.setRefund_state(body, (ret) => {
        res.send(ret)
    })
    // getPostData(req, res, (body) => {
    //     mdOrder.setRefund_state(body, (ret) => {
    //         res.send(ret)
    //     })
    // })
})
// use
// 获得公司资质介绍
router.get('/getzizhiInfo', function (req, res, next) {
    let body = req.body;
    mdData.getData_zizhi(body, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }));
        }
    })
})

// use
// 订单的基本信息的
function getTime(ret, cb) {
    let data = JSON.parse(ret).result;
    if (data && data != '') {
        for (let i = 0; i < data.length; i++) {
            let appliTime = data[i].appliTime;
            let loanTime = data[i].loanTime;
            let seeTime = data[i].seeTime;
            if (appliTime) {
                data[i].appliTime = new Date(appliTime).toLocaleTimeString();
            }
            if (loanTime) {
                data[i].loanTime = new Date(loanTime).toLocaleTimeString();
            }
            if (seeTime) {
                data[i].seeTime = new Date(seeTime).toLocaleTimeString();
            }
            if (i == data.length - 1) {
                cb(JSON.stringify({ 'result': data }));
            }
        }
    } else {
        cb(ret);
    }
}
function getPostData(req, res, callback) {
    var body = "";
    req.on('data', function (chunk) {
        body += chunk;
    });
    req.on('end', function () {
        if (body == '' || !body) {
            res.send(JSON.stringify({ "body": "null" }));
        }
        else {
            callback(JSON.parse(body));
        }
    });
}
module.exports = router;