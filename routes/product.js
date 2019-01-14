/*
 * @Author: duzhuo
 * @Date: 2019-01-03 16:49:51
 * @LastEditors: duzhuo
 * @LastEditTime: 2019-01-14 15:05:20
 * @Description: 这个是关于商品模块的路由
 */
var express = require('express');
var router = express.Router();
const url = require('url');
const qs = require('qs');
var mdOrder = require('../control/methodOrder');

router.get('/product*', function (req, res, next) {
    let ul = url.parse(req.url)
    let ulstr = "product/" + ul.pathname.substring(1);
    let menu = qs.parse(ul.query).menu;
    req.session.menu = menu ? menu : req.session.menu;
    res.render(ulstr, { "username": req.session.username, "menu": req.session.menu })
});
/**
 * @description: 通过传入数据库product表的相应字段与值，得到复合条件的商品
 * @method: post
 * @param {number} product_id 商品id
 * @param {number} product_type_id 商品类型id
 * @param {number} isNum 是否为询值产品0/1
 * @param {number} isBourse 是否为交易所0/1
 * @param {number} putaway 是否上架0/1
 * @returns: "{data:[p1,p2...]}"
 */
router.post('/getProduct', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getProduct(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * @description: 获得所有的商品类型
 * @method: get
 * @returns: "{data:[pt1,pt2...]}"
 */
router.get('/getType', function (req, res, next) {
    (async function () {
        try {
            let data = await mdOrder.getProduct_type(req);
            res.send(JSON.stringify({ data: data }));
        } catch (err) {
            res.send('error');
        }
    })()
})
/**
 * @description: 获得不同类型的分页商品
 * @method: post
 * @param {number} product_type_id  商品类型
 * @param {number} limit 页数
 * @returns: "{data:[p1,p2...]}"
 */
router.post('/getLimitProduct', function (req, res, next) {
    mdOrder.getLimitProduct(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 得到具体的各个流程与各个状态
 * @method: post
 * @param {number} flow_id 流程id 
 * @returns: "{flows:x, states:x}"
 */
router.post('/getSortFlowState', function (req, res, next) {
    mdOrder.getSortFlowState(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify(ret2))
        }
    })
})
/**
 * @description: 传入具体的文件类型数表id，查询出包含的多个类型
 * @method: post
 * @param {number} file_type_id 具体文件类型id 
 * @returns: "{data:[x,x,x...]}"
 */
router.post('/getDetailFile_types', function (req, res, next) {
    mdOrder.getDetailFile_types(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 得到所有的流程信息
 * @method: get
 * @returns: "{data:[x,x...]}"
 */
router.get('/getFlow', function (req, res, next) {
    mdOrder.getFlow(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description:  得到所有的文件类型的名字
 * @method: get
 * @returns: "{data:[x,x...]}"
 */
router.get('/getFile_types_num', function (req, res, next) {
    mdOrder.getFile_types_num(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 获得所有的具体文件类型的名字
 * @method: get
 * @returns: "{data:[x,x...]}"
 */
router.get('/getDetail_file_type', function (req, res, next) {
    mdOrder.getDetail_file_type(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 传入数据库对应字段，修改商品的基本信息
 * @method: post
 * @returns: success
 */
router.post('/updateProductInfo', function (req, res, next) {
    mdOrder.updateProductInfo(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 传入数据库对应字段，创建一个新的商品
 * @method: post
 * @returns: success
 */
router.post('/insertProduct', function (req, res, next) {
    mdOrder.insertProduct(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 创建一个新的商品类型
 * @method: post
 * @param {string} name 类型名字 
 * @returns: success
 */
router.post('/insertProductType', function (req, res, next) {
    mdOrder.insertProductType(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 创建一个商品流程
 * @method: post
 * @param {string} flow_name 流程名字
 * @param {Array} detail_flow_name 具体流程名字的数组形式
 * @param {Array} flow_leavl 具体流程级别的数组形式
 * @param {Array} detail_state_name 具体状态名字的数组形式
 * @param {Array} state_leavl 具体状态级别的数组形式
 * @returns: success
 */
router.post('/createFlow', function (req, res, next) {
    mdOrder.createFlow(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 删除一个商品流程
 * @method: post
 * @param {number} flow_id 
 * @returns: orderFail-订单引用，productFail-关联商品，success-成功
 */
router.post('/deleteFlow', function (req, res, next) {
    mdOrder.deleteFlow(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 删除一个商品
 * @method: post
 * @param {number} product_id 
 * @returns: orderFail-有订单关联商品，success
 */
router.post('/deleteProduct', function (req, res, next) {
    mdOrder.deleteProduct(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 创建申请材料
 * @method: post
 * @param {string} bus_name 材料名字 
 * @returns: success
 */
router.post('/createFileType', function (req, res, next) {
    mdOrder.insertFileType(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 创建多个具体材料
 * @method: post
 * @param {Array} name 材料名字 
 * @param {Array} text 材料说明 
 * @returns: success
 */
router.post('/createDetailFileType', function (req, res, next) {
    mdOrder.insertDetailFileType(req, (ret) => {
        res.send(ret);
    })

})
/**
 * @description: 删除一个分配好的申请材料，并将其分配自身的具体材料解除匹配
 * @method: post
 * @param {number} file_type_id 申请材料id 
 * @returns: productFail-有商品与之关联，success
 */
router.post('/deleteFileType', function (req, res, next) {
    mdOrder.deleteFileType(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 删除具体材料
 * @method: post
 * @param {number} detail_file_type_id
 * @returns: fileFail-具体材料不存在，success
 */
router.post('/deleteDetailFileType', function (req, res, next) {
    mdOrder.deleteDetailFileType(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 修改之前为申请材料分配好的多个具体材料
 * @method: post
 * @param {number} file_type_id 申请材料id
 * @param {Array} detail_file_type_id [id1,id2...]
 * @returns: 
 */
router.post('/updateFileType', function (req, res, next) {
    mdOrder.updateFileType(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 将商品分配给业务人员并将业务分配给内勤人员
 * @method: post
 * @param {number} product_id 商品id 
 * @param {number} off_id 内勤id
 * @param {number} dep_id 部门id
 * @param {Array} emp_id_arr 业务id[x,x...] 
 * @returns: 
 */
router.post('/allotProduct', function (req, res, next) {
    mdOrder.allotProduct(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 传入数据库字段，获得商品，业务，与内勤之前的分配信息。
 * @method: post
 * @param {number} product_id 商品id 
 * @param {number} off_id 内勤id
 * @param {number} dep_id 部门id
 * @param {number} dep_emp_id 部门里的业务id
 * @returns: "{data:[x,x...]}"
 */
router.post('/getRelation_product_dep', function (req, res, next) {
    mdOrder.getRelation_product_dep(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 删除这个商品对应的内勤
 * @method: post
 * @param {number} product_id 商品id 
 * @returns: success
 */
router.post('/deleteOffPro', function (req, res, next) {
    mdOrder.deleteOffPro(req, (ret) => {
        res.send(ret);
    })
})

module.exports = router;