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
    /**
     * news表
     * @param {JSON} body 查询条件
     * @returns {Array} [json1,json2...]
     */
    getNews: promise.promisify(async function (req, cb) {
        try {
            let body = req.body;
            let obj = { tName: 'news', condi: 'and' }
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
     * 修改数据指数
     * @param {JSON} req 
     * @returns {string} success
     */
    updateDataAB: async function (req, cb) {
        try {
            let body = req.body;
            let data = await get.update({ tName: 'total_profit' }, body);
            await get.multi(data);
            log.controlLog(req, { outData: 'success', control: '修改数据成功' });
            cb('success');
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    },
    // use
    /**
     * 获得增长基数与增长指数
     */
    getDataAB: async function (req, cb) {
        try {
            let data = await mo.getTotal_profit("");
            cb(JSON.stringify({ data: data[0] }));
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    },
    // use
    /**
     * 查询实际数据增长量
     * @param {JSON} req {time1:x, time2:x}
     * @returns {string} "{'deals':x, 'emps':x, 'loans':x, 'calls':x}"
     */
    getAllData: async function (req, cb) {
        let body = req.body;
        let time1 = body.time1;
        let time2 = body.time2;
        let data = {};
        async.auto([
            function (cb2) {
                (async function () {
                    try {
                        let ret1 = await get.myDataAndOrNot({ tName: 'order1' }, { not: { money: 'null', loanTime: 'null' }, bigEqual: { loanTime: time1 }, smallEqual: { loanTime: time2 } });
                        data.deals = ret1.length;
                        cb2();
                    } catch (err) {
                        log.errLog(req)
                        cb('error');
                    }
                })()
            },
            function (cb2) {
                (async function () {
                    try {
                        let ret2 = await get.myDataAndOrNot({ tName: 'emp' }, { and: { type: 6 }, bigEqual: { registTime: time1 }, smallEqual: { registTime: time2 } });
                        data.emps = ret2.length;
                        cb2();
                    } catch (err) {
                        log.errLog(req)
                        cb('error');
                    }
                })()
            },
            function (cb2) {
                (async function () {
                    try {
                        let ret3 = await get.myDataAndOrNot({ tName: 'order1' }, { not: { money: 'null' }, bigEqual: { loanTime: time1 }, smallEqual: { loanTime: time2 } });
                        let sum = 0;
                        for (let i = 0; i < ret3.length; i++) {
                            const val = ret3[i].money;
                            sum += val;
                        }
                        data.loans = sum;
                        cb2();
                    } catch (err) {
                        log.errLog(req)
                        cb('error');
                    }
                })()
            },
            function (cb2) {
                (async function () {
                    try {
                        let ret4 = await get.myDataAndOrNot({ tName: 'order2' }, { bigEqual: { loanTime: time1 }, smallEqual: { loanTime: time2 } });
                        data.calls = ret4.length;;
                        cb2();
                    } catch (err) {
                        log.errLog(req)
                        cb('error');
                    }
                })()
            },
        ], function (err) {
            cb(JSON.stringify(data));
        })
    },
    /**
     * 删除一条新闻
     */
    deleteNew: async function (req, cb) {
        try {
            let body = req.body;
            let new_id = body.new_id;
            let data = await get.delete({ tName: 'news', new_id: new_id });
            await get.multi(data);
            log.controlLog(req, { outData: 'success', control: '删除了一条新闻' });
            cb('success');
        } catch (err) {
            console.log(err);
            log.errLog(req)
            cb('error');
        }
    },
    /**
     * 修改新闻
     */
    updateNew: async function (req, cb) {
        let body = req.body;
        let new_id = body.new_id;
        let title = JSON.stringify(body.title);
        let title2 = JSON.stringify(body.title2);
        let newsData = JSON.stringify(body.newsData);
        let time = body.time;
        time = Date.parse(time)
        time = new Date(time - 28800000);
        let isUpdate = body.isUpdate;
        let files = req.files;
        let imgPath = "";
        let imgPath2 = "";
        try {
            let ret = await md.getNews({ new_id: new_id });

            let fileStrAgo = ret[0].imgPath;
            let fileStrAgo2 = ret[0].imgPath2;
            if (fileStrAgo) {
                fileStrAgo = fileStrAgo.split(';');
            } else {
                fileStrAgo = [];
            }
            if (fileStrAgo2) {
                fileStrAgo2 = fileStrAgo2.split(';');
            } else {
                fileStrAgo2 = [];
            }
            // 将数据库与所有图片路径，其中这次被替换了的，进行替换。并将以前的删除
            let count = 0;
            let count2 = 0;
            let count3 = 0;
            for (let i = 0; i < isUpdate.length; i++) {
                const num = isUpdate[i];
                if (num == 1) {
                    if (i <= 2) {
                        if (fileStrAgo2 && fileStrAgo2[count2]) {
                            deleteFile(fileStrAgo2[count2])
                        }
                        fileStrAgo2[count2] = files[count3].path.split(public.uploadFolde + symbol)[1];
                        count2++;
                    } else if (i > 2) {
                        if (fileStrAgo && fileStrAgo[count]) {
                            deleteFile(fileStrAgo[count])
                        }
                        fileStrAgo[count] = files[count3].path.split(public.uploadFolde + symbol)[1];
                        count++;
                    }
                    count3++;
                } else {
                    if (i <= 2) {
                        count2++;
                    } else if (i > 2) {
                        count++;
                    }
                }
            }
            if (fileStrAgo) {
                for (let i = 0; i < fileStrAgo.length; i++) {
                    const file = fileStrAgo[i];
                    if (file) {
                        imgPath += file + ';';
                    }
                }
            }
            if (fileStrAgo2) {
                for (let i = 0; i < fileStrAgo2.length; i++) {
                    const file = fileStrAgo2[i];
                    if (file) {
                        imgPath2 += file + ';';
                    }
                }
            }
            let obj = {
                title: title, time: time, title2: title2, newsData: newsData,
                imgPath: imgPath, imgPath2: imgPath2
            };
            let data = await get.update({ tName: 'news', new_id: new_id }, obj);
            await get.multi(data);
            log.controlLog(req, { outData: 'success', control: '修改了一条新闻' });
            cb('success');
        } catch (err) {
            log.errLog(req)
            cb('error');
        }

    },
    /**
     * 查找新闻
     */
    getNewsSplit: async function (req, cb) {
        try {
            let body = req.body;
            let new_id = body.new_id;
            let limit = body.limit;
            if (!new_id) {
                new_id = "";
            }
            let data = await md.getNews({ new_id: new_id });
            data = util.sortArr(data, 'time', 'desc');
            data = util.splitPage({ tName: 'news', limit: limit }, data);
            cb(JSON.stringify({ data: data }));
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    },
    /**
     * 添加一条新闻
     */
    insertNew: async function (req, cb) {
        let body = req.body;
        let title = JSON.stringify(body.title);
        let title2 = JSON.stringify(body.title2);
        let newsData = JSON.stringify(body.newsData);
        let isUpdate = body.isUpdate;
        let time = body.time;
        time = Date.parse(time)
        time = new Date(time - 28800000);
        let files = req.files;
        let imgPath = "";
        let imgPath2 = "";
        let count = 0;
        try {
            for (let i = 0; i < isUpdate.length; i++) {
                const num = isUpdate[i];
                if (num == 1) {
                    let file = files[count];
                    let filePath = file.path.split(public.uploadFolde + symbol)[1];
                    if (i <= 2) {
                        imgPath2 += filePath + ';';
                    } else {
                        imgPath += filePath + ';';
                    }
                    count++;
                }
            }
            let maxId = await get.tbMaxId({ tName: 'news' }, 'new_id');
            let obj = {
                tName: 'news', new_id: maxId, title: title, time: time, title2: title2, newsData: newsData,
                imgPath: imgPath, imgPath2: imgPath2,
            };
            let data = await get.insert(obj); 
            await get.multi(data);
            log.controlLog(req, { outData: 'success', control: '增加了一条新闻' });
            cb('success');
        } catch (err) {
            log.errLog(req)
            cb('error');
        }
    },








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
            let data1 = [];
            let data2 = [];
            async.parallel([
                function (cb2) {
                    (async function () {
                        try {
                            if (text) {
                                data1 = await get.update({ tName: 'data_zizhi', zizhi_id: zizhi_id }, { text: text });
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
                                data2 = await get.update({ tName: 'data_zizhi', zizhi_id: zizhi_id }, { imgPath: imgPath });
                                await get.multi(data1.concat(data2));
                                cb2(null, 'img');
                            } else {
                                await get.multi(data1);
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
            let data1 = [];
            let data2 = [];
            if (product_id) {
                data1 = await get.update({ tName: 'data_home_page', home_id: home_id }, { product_id: product_id });
                await get.multi(data1);
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
                                    data1 = await get.update({ tName: 'data_home_page', home_id: home_id }, { text: text, product_id: 'null' });
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
                                    data2 = await get.update({ tName: 'data_home_page', home_id: home_id }, { "imgPath": imgPath, "imgPath2": imgPath2, "product_id": 'null' });
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
                    (async function () {
                        try {
                            await get.multi(data1.concat(data2));
                            log.controlLog(req, { outData: 'success', control: '修改了主页的详细数据' });
                            cb('success')
                        } catch (err) {
                            log.errLog(req);
                            cb('error');
                        }
                    })()
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
            let data1 = await get.update({ tName: 'data_business', bus_id: bus_id }, { bus_name: name });
            let count1 = 0;
            let count2 = 0;
            let data2 = [];
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
                    data2 = data2.concat(await get.update({ tName: 'data_partner', partner_id: partner_id }, { small_text: small_text, bank_imgPath: bank_imgPath }));
                    count1++;
                    count2++;
                } else {
                    data2 = data2.concat(await get.update({ tName: 'data_partner', partner_id: partner_id }, { small_text: small_text }))
                    count1++;
                }
            }
            await get.multi(data1.concat(data2));
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
            let data = [];
            if (imgPath != 0) {
                let imgAgoPath = ret[0].imgPath;
                imgPath = req.files[0].path;
                util.deleteFile(imgAgoPath, uploadFile);
                imgPath = imgPath.split(uploadFile + symbol)[1];
                data = await get.update({ tName: 'data_partner', "partner_id": partner_id }, { "name": name, "big_text": big_text, "imgPath": imgPath });
                log.controlLog(req, { outData: 'success', control: '修改了简略合作伙伴的名字，文本，图片' });
                cb('success')
            } else {
                data = await get.update({ tName: 'data_partner', "partner_id": partner_id }, { "name": name, "big_text": big_text });
                log.controlLog(req, { outData: 'success', control: '修改了简略合作伙伴的名字，文本' });
                cb('success')
            }
            await get.multi(data);
        } catch (err) {
            log.errLog(req);
            cb('error');
        }
    },
}

module.exports = md;