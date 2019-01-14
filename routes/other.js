/*
 * @Author: duzhuo
 * @Date: 2019-01-03 16:49:52
 * @LastEditors: duzhuo
 * @LastEditTime: 2019-01-14 17:13:21
 * @Description: 
 */
var express = require('express');
var router = express.Router();
const url = require('url');
const qs = require('qs');
var mdData = require('../control/methodData');


// 前端baner
router.get('/other*', function (req, res, next) {
    let ul = url.parse(req.url)
    let ulstr = "other/" + ul.pathname.substring(1);
    let menu = qs.parse(ul.query).menu;
    req.session.menu = menu ? menu : req.session.menu;
    res.render(ulstr, { "username": req.session.username, "menu": req.session.menu })
});

/**
 * @description: 创建一条新闻
 * @method: post
 * @param {string} title 主标题
 * @param {string} title2 副标题
 * @param {string} newsData 内容
 * @param {string} time xxxx-xx-xx
 * @param {number} isUpdate 0/代表图片无须修改，1/图片有变动需要修改
 * @returns: success
 */
router.post('/insertNew', function (req, res, next) {
    mdData.insertNew(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 获得分页后的新闻
 * @method: post
 * @param {number} new_id 可填或不填
 * @param {number} limit 页数
 * @returns: "{data:[x,x...]}"
 */
router.post('/getNews', function (req, res, next) {
    mdData.getNewsSplit(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 修改新闻
 * @method: post
 * @param {string} title 主标题
 * @param {string} title2 副标题
 * @param {string} newsData 内容
 * @param {string} time xxxx-xx-xx
 * @param {number} isUpdate 0/代表图片无须修改，1/图片有变动需要修改
 * @returns: success
 */
router.post('/updateNew', function (req, res, next) {
    mdData.updateNew(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 删除一条新闻
 * @method: post
 * @param {number} new_id 
 * @returns: success
 */
router.post('/deleteNew', function (req, res, next) {
    mdData.deleteNew(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 获得所有的数据，时间间隔中的实际增长量
 * @method: post
 * @param {string} time1 起始时间
 * @param {string} time2 结束时间
 * @returns: "{[x,x...]}"
 */
router.post('/getAllData', function (req, res, next) {
    mdData.getAllData(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 获得增长基数与指数
 * @method: get
 * @returns: "{data:x}"
 */
router.get('/getDataAB', function (req, res, next) {
    mdData.getDataAB("", (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 修改增长基数与指数
 * @method: post
 * @param {number} loanA 放款基数
 * @param {number} loanB 放款指数
 * @param {number} dealA 成交基数
 * @param {number} dealB 成交指数
 * @param {number} callA 询值基数
 * @param {number} callB 询值指数
 * @param {number} empA 用户注册基数
 * @param {number} empB 用户注册指数
 * @returns: success
 */
router.post('/updateDataAB', function (req, res, next) {
    mdData.updateDataAB(req, (ret) => {
        res.send(ret);
    })
})


/**
 * @description: 获得资质的信息
 * @method: get
 * @returns: "{data:[x]}"
 */
router.get('/getzizhiInfo', function (req, res, next) {
    mdData.getData_zizhi(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 获得手机的四个banner主页
 * @method: get
 * @returns: "{data:[x,x...]}"
 */
router.get('/gethome_page', function (req, res, next) {
    mdData.get_home_page(req, (ret) => {
        res.send(ret)
    })
})
/**
 * @description: 获得业务的具体信息
 * @method: get
 * @returns: "{data:[x,x...]}"
 */
router.get('/getbusiness', function (req, res, next) {
    mdData.getData_business(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})
/**
 * @description: 获得业务下对应的多个银行信息
 * @method: post
 * @param {number} partner_id 详细业务id
 * @param {number} bus_id 业务id
 * @param {number} twoLine 1-房贷， 2-机构
 * @returns: "{data:[x,x...]}"
 */
router.post('/getPartnerBankOrOrgan', function (req, res, next) {
    mdData.getData_partner(req, (ret, ret2) => {
        if (ret) {
            res.send(ret);
        } else {
            res.send(JSON.stringify({ 'data': ret2 }))
        }
    })
})

/**
 * @description: 修改资质表信息
 * @method: post
 * @param {number} database_id 主键id
 * @param {string} text 资质描述内容
 * @param {string} file 图片
 * @returns: success
 */
router.post('/updateDataZZ', function (req, res, next) {
    mdData.updatezizhi(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 修改首页表信息
 * @method: post
 * @param {number} product_id 可选，即是否展示商品
 * @param {number} database_id 在表中对应的主键id 
 * @param {string} text 内容
 * @param {string} file 图片
 * @param {number} isUpdate 图片是否修改 0/1
 * @returns: success
 */
router.post('/updateDataHP', function (req, res, next) {
    mdData.updatehome_page(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 修改数据表信息
 * @method: post
 * @param {number} database_id 修改业务名字的主键id
 * @param {string} name 银行名字
 * @param {Array} select 0/1,[x,x...] 是否需要修改图片路径
 * @param {Array} partner_id [x,x...] 银行信息的主键id
 * @param {Array} small_text 要修改的小内容 [t1,t2...] 
 * @returns: success
 */
router.post('/updateDataP', function (req, res, next) {
    mdData.updatebusinessAndPartner(req, (ret) => {
        res.send(ret);
    })
})
/**
 * @description: 修改银行详细表信息
 * @method: post
 * @param {number} database_id 银行详细信息的主键id
 * @param {string} name 名字
 * @param {string} big_text 详细内容
 * @param {string} file 图片 
 * @returns: success
 */
router.post('/updateDataD', function (req, res, next) {
    mdData.updatepartnerDetail(req, (ret) => {
        res.send(ret);
    })
})


module.exports = router;