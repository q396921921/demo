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

// 创建一个订单
router.post('/createOrder', function (req, res, next) {
    console.log(123456);
    let body = req.body
    mdOrder.createOrder(body, (ret) => {
        res.send(ret)
    })
});
// 如果此订单指定内容为空，删除此订单
router.post('/deleteOrder', function (req, res, next) {
    let body = req.body
    mdOrder.deleteOrderById(body, (ret) => {
        res.send(ret)
    })
});
// 为刚才创建的订单赋值
router.post('/updateOrder', function (req, res, next) {
    let body = req.body
    mdOrder.updateOrder(body, (ret) => {
        res.send(ret)
    })
});
// 创建此订单的所有状态
router.post('/createOrderFlow', function (req, res, next) {
    let body = req.body;
    mdOrder.createOrderFlow(body, (ret) => {
        res.send(ret)
    })
});
router.post('/getEmpByUsername', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    if (body.username && body.username != '') {
        mdEmp.getEmp(body, (ret) => {
            res.send(ret);
        })
    }
})







// 通过商品id获得商品
router.post('/getProductById', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    mdOrder.getProductById(body, (ret) => {
        res.send(ret)
    })
})
// 获得是否询值的产品，以及什么类型（房贷or车贷）的以及房贷或评估所产品
router.post('/getProductByOther', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    mdOrder.getProductByOther(body, (ret) => {
        res.send(ret)
    })
    // // 电脑端数据接收
    // getPostData(req, res, (body) => {
    //     mdOrder.getProductByOther(body, (ret) => {
    //         res.send(ret)
    //     })
    // })1`
})
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
// 获得产品类型，通过商品id
router.post('/getProductTypeByProduct_id', function (req, res, next) {
    let body = req.body;
    body = JSON.parse(Object.keys(body));
    mdOrder.getProductById(body, (ret) => {
        res.send(ret)
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

// 获得公司资质介绍
router.get('/getzizhiInfo', function (req, res, next) {
    let body = req.body;
    mdData.getzizhi(body, (ret) => {
        res.send(ret);
    })
})


// 订单的基本信息的
function getTime(ret, cb) {
    let data = JSON.parse(ret).result;
    if (data && data != '') {
        for (let i = 0; i < data.length; i++) {
            let appliTime = data[i].appliTime;
            let loanTime = data[i].loanTime;
            let seeTime = data[i].seeTime;
            if (appliTime) {
                data[i].appliTime = timestampToTime(appliTime);
            }
            if (loanTime) {
                data[i].loanTime = timestampToTime(loanTime);
            }
            if (seeTime) {
                data[i].seeTime = timestampToTime(seeTime);
            }
            if (i == data.length - 1) {
                cb(JSON.stringify({ 'result': data }));
            }
        }
    } else {
        cb(ret);
    }
}
function timestampToTime(timestamp) {
    let text;
    if (timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        Y = date.getFullYear() + '-';
        M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        D = date.getDate();
        if (D < 10) {
            D = '0' + D + ' '
        } else {
            D = D + ' '
        }
        h = date.getHours();
        if (h < 10) {
            h = '0' + h + ':'
        } else {
            h = h + ':'
        }
        m = date.getMinutes();
        if (m < 10) {
            m = '0' + m;
        }
        text = Y + M + D + h + m;
    } else {
        text = '';
    }
    return text;
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