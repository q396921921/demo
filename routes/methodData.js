// 专门处理前端动态数据显示的模块

var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var queryData = require('./../db_mysql/queryData')
var otherData = require('./../db_mysql/otherData')
var queryOrder = require('./../db_mysql/queryOrder')
var async = require('async')
var momoent = require('moment');
var xlsx = require('node-xlsx');
var path = require('path');
var timer = require('./timer');
var debug = require('debug')('app:server');
var public = require('./../public/public');
var symbol = public.symbol;
var uploadFile = public.uploadFolde;      // 后台修改上传图片文件的文件夹名字

module.exports = {
    /**
     * 无须传入任何东西，直接获取表中信息
     */
    getzizhi: async function (body, cb) {
        try {
            let data = await queryData.getzizhi({}, []);
            cb(JSON.stringify({ 'data': ret }))
        } catch (err) {
            cb('error')
        }
    },
    /**
     * 传入zizhi_id，修改内容，图片路径。
     */
    updatezizhi: async function (req, cb) {
        let body = req.body;
        let zizhi_id = body.database_id;
        let text = body.text;
        let imgPath = req.files.length
        let rt = await queryData.getzizhi({}, []);
        async.parallel([
            function (cb2) {
                (async function () {
                    try {
                        if (text) {
                            let ret = await otherData.updatezizhiText([text, zizhi_id]);
                            cb2(null, 'text')
                        } else {
                            cb2(null, 'text')
                        }
                    } catch (err) {
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
                            deleteFile(imgAgoPath);
                            imgPath = imgPath.split(uploadFile + symbol)[1];
                            await otherData.updatezizhiImg([imgPath, zizhi_id]);
                            cb2(null, 'img')
                        } else {
                            cb2(null, 'img')
                        }
                    } catch (err) {
                        cb('error');
                    }
                })()
            }
        ], function (err, result) {
            cb('success')
        })
    },
    /**
     * 获取资质表的信息
     */
    get_home_page: async function (body, cb) {
        try {
            let ret = await queryData.gethome_page({}, []);
            let arr = [];
            for (let i = 0; i < ret.length; i++) {
                const rt = ret[i];
                let home_id = rt.home_id;
                let product_id = rt.product_id;
                if (product_id) {
                    let obj = {};
                    obj.data = { product_id: product_id };
                    obj.arr = [product_id];
                    let products = await queryOrder.getProduct(obj);
                    arr.push({ "home_id": home_id, "product": ret2[0] })
                } else {
                    arr.push(rt);
                }
            }
            cb(JSON.stringify({ "data": arr }))
        } catch (err) {
            cb('error');
        }
    },
    updatehome_page: async function (req, cb) {
        let body = req.body;
        let product_id = body.product_id;
        let home_id = body.database_id;
        // 如果传过来的商品id有值，那就是修改商品，否则就是广告
        if (product_id) {
            try {
                await otherData.updatehome_page_product([product_id, home_id]);
                cb('success')
            } catch (err) {
                cb('error')
            }
        } else {
            let text = body.text;
            let imgPathLength = req.files.length
            let isUpdate = body.isUpdate;
            let rt = await queryData.gethome_page({ home_id: home_id }, [home_id]);
            async.parallel([
                function (cb2) {
                    (async function () {
                        try {
                            if (text) {
                                await otherData.updatehome_page_ADText([text, null, home_id]);
                                cb2(null, 'text')
                            } else {
                                cb2(null, 'text')
                            }

                        } catch (err) {
                            cb('error')
                        }
                    })()
                },
                function (cb2) {
                    if (imgPathLength != 0) {
                        let imgPath = null;
                        let imgPath2 = null;
                        // 获取上传图片的(req.files[count].path)
                        let count = 0;
                        // 获取传入数据库哪个字段的(imgPath,imgPath2,~~~等)
                        let count2 = 0;
                        for (let i = 0; i < isUpdate.length; i++) {
                            const isNum = isUpdate[i];
                            (async function () {
                                try {
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
                                        deleteFile(imgAgoPath);
                                        await otherData.updatehome_page_ADImg({ "imgPath": imgPath, "imgPath2": imgPath2, "product_id": 'null' }, [imgPath, imgPath2, 'null', home_id]);
                                    }
                                } catch (err) {
                                    cb('error');
                                }
                            })()
                        }

                    } else {
                        cb2(null, 'img')
                    }
                }
            ], function (err, result) {
                cb('success')
            })
        }
    },
    /**
     * 获得合作伙伴表的所有信息
     */
    getbusiness: async function (body, cb) {
        try {
            let ret = await queryData.getbusiness({}, []);
            cb(JSON.stringify({ "data": ret }))
        } catch (err) {
            cb('error')
        }
    },
    /**
     * 传入bus_id(业务id)以及类型id获得对应银行
     */
    getPartnerBank: async function (body, cb) {
        try {
            let bus_id = body.bus_id;
            let twoLine = body.twoLine;
            let partner_id = body.partner_id;
            let ret = await queryData.getpartner({ bus_id: bus_id, twoLine: twoLine, partner_id: partner_id }, [bus_id, twoLine, partner_id]);
            cb(JSON.stringify({ "data": ret }))
        } catch (err) {
            cb('error')
        }
    },
    updatebusinessAndPartner: async function (req, cb) {
        let body = req.body;
        let bus_id = body.database_id;
        let name = body.name;
        let select_arr = body.select;   // 哪个需要修改银行图标路径
        let partner_id_arr = body.partner_id;   // 对应的表的id
        let small_text_arr = body.small_text    // id对应的小文字
        try {
            await otherData.updatebusiness([name, bus_id]);
            let count1 = 0;
            let count2 = 0;
            let jsonObj = [];
            for (let i = 0; i < select_arr.length; i++) {
                const select = select_arr[i];
                let partner_id = partner_id_arr[count1];
                let small_text = small_text_arr[count1];
                if (select == 1) {
                    let ret2 = await queryData.getpartner({ "partner_id": partner_id }, [partner_id]);
                    let imgAgoPath = ret2[0].bank_imgPath;
                    let imgPath = req.files[count2].path;
                    if (imgAgoPath && imgAgoPath != "") {
                        deleteFile(imgAgoPath);
                    }
                    imgPath = imgPath.split(uploadFile + symbol)[1];
                    await otherData.updatebusinessSmallTextAndBankImg([small_text, imgPath, partner_id]);
                    count1++;
                    count2++;
                } else {
                    await otherData.updatebusinessSmallText([small_text, partner_id]);
                    count1++;
                }
            }
            cb('success')
        } catch (err) {
            cb('error');
        }
        // 先修改伙伴表对应的名字
    },
    updatepartnerDetail: async function (req, cb) {
        try {
            let body = req.body;
            let partner_id = body.database_id;
            let name = body.name
            let big_text = body.text;
            let imgPath = req.files.length
            let ret = await queryData.getpartner({ "partner_id": partner_id }, [partner_id]);
            if (imgPath != 0) {
                let imgAgoPath = ret[0].bank_imgPath;
                imgPath = req.files[0].path;
                deleteFile(imgAgoPath);
                imgPath = imgPath.split(uploadFile + symbol)[1];
                await otherData.updatepartnerDetail({ "name": name, "big_text": big_text, "imgPath": imgPath }, [name, big_text, imgPath, partner_id]);
                cb('success')
            } else {
                await otherData.updatepartnerDetail({ "name": name, "big_text": big_text }, [name, big_text, imgPath, partner_id]);
                cb('success')
            }
        } catch (err) {
            cb('error');
        }
    },
}

// 判断文件路径是否存在，如果存在将这个路径删除掉
function deleteFile(imgAgoPath) {
    let pathStr = path.join(__dirname, '../public/' + uploadFile + '/' + imgAgoPath);
    if (fs.existsSync(pathStr)) {
        fs.unlinkSync(pathStr)
    }
}