// 专门处理前端动态数据显示的模块

const async = require('async')
const promise = require('bluebird');
const get = require('../db/redis/get_redis');
const public = require('../public/public');
const symbol = public.symbol;
const uploadFile = public.uploadFolde;      // 后台修改上传图片文件的文件夹名字
const util = require('./util');
const log = require('./log');

const mo = require('./methodOrder');
const md = {
    /**
     * data_business表
     * @param {JSON} body 查询条件
     */
    getData_business: promise.promisify(async function (req, cb) {
        try {
            let body = req.body;
            let obj = { tName: 'data_business' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data);
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    }),
    /**
     * data_home_page表
     * @param {JSON} body 查询条件
     */
    getData_home_page: promise.promisify(async function (req, cb) {
        try {
            let body = req.body;
            let obj = { tName: 'data_home_page', condi: 'and' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    }),
    /**
     * data_partner表
     * @param {JSON} body 查询条件
     */
    getData_partner: promise.promisify(async function (req, cb) {
        try {
            let body = req.body;
            let obj = { tName: 'data_partner', condi: 'and' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    }),
    /**
     * data_zizhi表
     * @param {JSON} body 查询条件
     * @returns {Array} [json1,json2...]
     */
    getData_zizhi: promise.promisify(async function (req, cb) {
        try {
            let body = req.body;
            let obj = { tName: 'data_zizhi', condi: 'and' }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    }),


    // 分割


    // use
    /**
     * 传入zizhi_id，修改内容，图片路径。
     * @param {JSON} req 
     * @callback {string} success/error
     */
    updatezizhi: async function (req, cb) {
        try {
            let body = req.body;
            let zizhi_id = body.database_id;
            let text = body.text;
            let imgPath = req.files.length
            let rt = await md.getData_zizhi({ body: "" });
            async.parallel([
                function (cb2) {
                    (async function () {
                        try {
                            if (text) {
                                await get.update({ tName: 'data_zizhi', zizhi_id: zizhi_id }, { text: text });
                                cb2(null, 'text')
                            } else {
                                cb2(null, 'text')
                            }
                        } catch (err) {
                            log.errLog(req)
                            cb('error');
                        }
                    })()
                },
                function (cb2) {
                    (async function () {
                        try {
                            if (imgPath != 0) {
                                imgPath = req.files[0].path;
                                let imgAgoPath = rt[0].imgPath;
                                util.deleteFile(imgAgoPath, uploadFile);
                                imgPath = imgPath.split(uploadFile + symbol)[1];
                                let ret = await md.getData_zizhi({ body: { zizhi_id: zizhi_id } });
                                await get.update({ tName: 'data_zizhi', zizhi_id: zizhi_id }, { imgPath: imgPath });
                                cb2(null, 'img');
                            } else {
                                cb2(null, 'img')
                            }
                        } catch (err) {
                            log.errLog(req)
                            cb('error');
                        }
                    })()
                }
            ], function (err, result) {
                log.controlLog(req, { outData: 'success', control: '修改了其他管理的资质' });
                cb('success')
            })
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
    // use
    /**
     * 获取资质表的信息
     * @param {JSON} body
     * @returns {string} '{"data":"[json1,json2...]"}'
     */
    get_home_page: async function (req, cb) {
        try {
            let ret = await md.getData_home_page({ body: "" });
            let arr = [];
            for (let i = 0; i < ret.length; i++) {
                const rt = ret[i];
                let home_id = rt.home_id;
                let product_id = rt.product_id;
                if (product_id) {
                    let products = await mo.getProduct({ body: { product_id: product_id } });
                    arr.push({ "home_id": home_id, "product": products[0] })
                } else {
                    arr.push(rt);
                }
            }
            cb(JSON.stringify({ "data": arr }))
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
    // use
    /**
     * 修改home_page的信息
     * @param {JSON} req 
     * @returns {string} success
     */
    updatehome_page: async function (req, cb) {
        try {
            let body = req.body;
            let product_id = body.product_id;
            let home_id = body.database_id;
            // 如果传过来的商品id有值，那就是修改商品，否则就是广告
            if (product_id) {
                await get.update({ tName: 'data_home_page', home_id: home_id }, { product_id: product_id });
                cb('success');
            } else {
                let text = body.text;
                let imgPathLength = req.files.length
                let isUpdate = body.isUpdate;
                let rt = await md.getData_home_page({ body: { home_id: home_id } });
                async.parallel([
                    function (cb2) {
                        (async function () {
                            try {
                                if (text) {
                                    await get.update({ tName: 'data_home_page', home_id: home_id }, { text: text, product_id: 'null' });
                                    cb2(null, 'text')
                                } else {
                                    cb2(null, 'text')
                                }

                            } catch (err) {
                                log.errLog(req);
                                cb('error')
                            }
                        })()
                    },
                    function (cb2) {
                        (async function () {
                            try {
                                if (imgPathLength != 0) {
                                    let imgPath = null;
                                    let imgPath2 = null;
                                    // 获取上传图片的(req.files[count].path)
                                    let count = 0;
                                    // 获取传入数据库哪个字段的(imgPath,imgPath2,~~~等)
                                    let count2 = 0;
                                    for (let i = 0; i < isUpdate.length; i++) {
                                        const isNum = isUpdate[i];
                                        if (isNum == 0) {
                                            count2++;
                                        } else {
                                            let imgAgoPath;
                                            if (count2 == 0) {
                                                imgPath = req.files[count].path;
                                                imgAgoPath = rt[0].imgPath;
                                                imgPath = imgPath.split(uploadFile + symbol)[1];
                                            } else if (count2 == 1) {
                                                imgPath2 = req.files[count].path;
                                                imgAgoPath = rt[0].imgPath2;
                                                imgPath2 = imgPath2.split(uploadFile + symbol)[1];
                                            }
                                            count++;
                                            count2++;
                                            util.deleteFile(imgAgoPath, uploadFile);
                                        }
                                    }
                                    await get.update({ tName: 'data_home_page', home_id: home_id }, { "imgPath": imgPath, "imgPath2": imgPath2, "product_id": 'null' });
                                    cb2(null, 'img');
                                } else {
                                    cb2(null, 'img')
                                }
                            } catch (err) {
                                log.errLog(req);
                                cb('error');
                            }
                        })()
                    }
                ], function (err, result) {
                    log.controlLog(req, { outData: 'success', control: '修改了主页的详细数据' });
                    cb('success')
                })
            }
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
    // use
    updatebusinessAndPartner: async function (req, cb) {
        let body = req.body;
        let bus_id = body.database_id;
        let name = body.name;
        let select_arr = body.select;   // 哪个需要修改银行图标路径
        let partner_id_arr = body.partner_id;   // 对应的表的id
        let small_text_arr = body.small_text    // id对应的小文字
        try {
            await get.update({ tName: 'data_business', bus_id: bus_id }, { bus_name: name });
            let count1 = 0;
            let count2 = 0;
            for (let i = 0; i < select_arr.length; i++) {
                const select = select_arr[i];
                let partner_id = partner_id_arr[count1];
                let small_text = small_text_arr[count1];
                if (select == 1) {
                    let ret2 = await md.getData_partner({ body: { "partner_id": partner_id } });
                    let imgAgoPath = ret2[0].bank_imgPath;
                    let bank_imgPath = req.files[count2].path;
                    if (imgAgoPath && imgAgoPath != "") {
                        util.deleteFile(imgAgoPath, uploadFile);
                    }
                    bank_imgPath = bank_imgPath.split(uploadFile + symbol)[1];
                    await get.update({ tName: 'data_partner', partner_id: partner_id }, { small_text: small_text, bank_imgPath: bank_imgPath })
                    count1++;
                    count2++;
                } else {
                    await get.update({ tName: 'data_partner', partner_id: partner_id }, { small_text: small_text })
                    count1++;
                }
            }
            log.controlLog(req, { outData: 'success', control: '修改了详细合作伙伴的文本，银行图标' });
            cb('success')
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
    // use
    updatepartnerDetail: async function (req, cb) {
        try {
            let body = req.body;
            let partner_id = body.database_id;
            let name = body.name
            let big_text = body.text;
            let imgPath = req.files.length
            let ret = await md.getData_partner({ body: { "partner_id": partner_id } });
            if (imgPath != 0) {
                let imgAgoPath = ret[0].imgPath;
                imgPath = req.files[0].path;
                util.deleteFile(imgAgoPath, uploadFile);
                imgPath = imgPath.split(uploadFile + symbol)[1];
                await get.update({ tName: 'data_partner', "partner_id": partner_id }, { "name": name, "big_text": big_text, "imgPath": imgPath });
                log.controlLog(req, { outData: 'success', control: '修改了简略合作伙伴的名字，文本，图片' });
                cb('success')
            } else {
                await get.update({ tName: 'data_partner', "partner_id": partner_id }, { "name": name, "big_text": big_text });
                log.controlLog(req, { outData: 'success', control: '修改了简略合作伙伴的名字，文本' });
                cb('success')
            }
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
}

module.exports = md;