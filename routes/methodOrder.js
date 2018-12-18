// 这个模块是用来封装与订单有关的东西
// 包括，商品，类型，流程，状态

const fs = require("fs");
const async = require("async");
const xlsx = require("node-xlsx");
const path = require("path");
const timer = require("./timer");
const promise = require('bluebird');
const moment = require('moment');
const log = require('./log');

const me = require('./methodEmp');

let public = require("./../public/public");
const uploadFile = public.uploadFolde; // 后台修改上传图片文件的文件夹名字
const excelFile = public.excelFile;
const symbol = public.symbol;
const util = require('./util');

const get = require('./../db/redis/get_redis');

var md = {
  /**
   * total_profit表
   * @param {JSON} body 查询条件
   */
  getTotal_profit: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'total_profit' };
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data);
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * detail_file_type表
   * @param {JSON} body 查询条件
   */
  getDetail_file_type: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'detail_file_type' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * file_types_num表
   * @param {JSON} body 查询条件
   */
  getFile_types_num: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'file_types_num' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * flow表
   * @param {JSON} body 查询条件
   */
  getFlow: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'flow' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * flow_detail表
   * @param {JSON} body 查询条件
   */
  getFlow_detail: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'flow_detail' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * order表
   * @param {JSON} body 查询条件
   */
  getOrder: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_type = body.order_type;
      let tName = getOrderTName(order_type);
      let data;
      if (order_type) {
        let condis = { tName: tName }
        condis = util.spliceCode(condis, body);
        let ret = await get.myData(condis);
        data = util.getData(ret);
      } else {
        let condis = util.spliceCode({}, body);
        condis.tName = 'order1';
        let ret1 = await get.myData(condis);
        condis.tName = 'order2';
        let ret2 = await get.myData(condis);
        condis.tName = 'order3';
        let ret3 = await get.myData(condis);
        let ret = ret1.concat(ret2).concat(ret3);
        data = util.getData(ret);
      }
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * product表
   * @param {JSON} body 查询条件
   */
  getProduct: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'product' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * product_type表
   * @param {JSON} body 查询条件
   */
  getProduct_type: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'product_type' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * relation_file_type_detail表
   * @param {JSON} body 查询条件
   */
  getRelation_file_type_detail: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'relation_file_type_detail' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * relation_flow_detail表
   * @param {JSON} body 查询条件
   */
  getRelation_flow_detail: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'relation_flow_detail' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * relation_order_state表
   * @param {JSON} body 查询条件
   */
  getRelation_order_state: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'relation_order_state' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * relation_product_dep表
   * @param {JSON} body 查询条件
   */
  getRelation_product_dep: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'relation_product_dep' };
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * relation_state_flow表
   * @param {JSON} body 查询条件
   */
  getRelation_state_flow: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'relation_state_flow' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
      let data = util.getData(ret);
      cb(null, data)
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * state_detail表
   * @param {JSON} body 查询条件
   */
  getState_detail: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'state_detail' }
      condis = util.spliceCode(condis, body);
      let ret = await get.myData(condis);
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
   * 通过商品id，删除对应的内勤
   * @returns {string} success
   */
  deleteOffPro: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let product_id = body.product_id;
      let condis = {
        tName: 'relation_product_dep',
        product_id: product_id
      }
      await get.delete(condis);
      let pname = await md.getProduct(body);
      log.controlLog(req, { outData: 'success', control: `删除了商品：${pname[0].name}对应的内勤` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * 传入商品id，部门id，内勤id，为内勤分配产品
   * @returns {string} success
   */
  allotProduct: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let maxId = get.tbMaxId({ tName: 'relation_product_dep' }, 'id');
      let condis = {
        tName: 'relation_product_dep',
        product_id: body.product_id,
        off_id: body.off_id,
        dep_id: body.dep_id,
        id: maxId
      }
      // 查询之前与此商品相关联的内勤,然后删掉
      await get.delete(condis);
      let emp_id_arr = body.emp_id_arr;
      for (let i = 0; i < emp_id_arr.length; i++) {
        let dep_emp_id = emp_id_arr[i];
        condis[dep_emp_id] = dep_emp_id;
        await get.insert(condis);
      }
      log.controlLog(req, { outData: 'success', control: `为内勤分配产品` });
      cb('success')
    } catch (err) {
      log.errLog(req);
      cb('error');
    }

  }),
  // use
  /**
   * 传入商品id以及订单id，创建这个商品的所有状态
   * @returns {string} success
   */
  createOrderFlow: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let product = await md.getProduct({ body: { product_id: body.product_id } })
      let flow_id = product[0].flow_id;
      let sortFlow = await getsortFlow(flow_id);
      for (let i = 0; i < sortFlow.length; i++) {
        let state_detail_id_arr = await md.getRelation_state_flow({ body: { flow_detail_id: sortFlow[i].flow_detail_id } });
        for (let j = 0; j < state_detail_id_arr.length; j++) {
          let maxId = await get.tbMaxId({ tName: 'relation_order_state' }, 'relation_state_id');
          let obj3 = {
            tName: 'relation_order_state',
            relation_state_id: maxId,
            order_id: Number(body.order_id),
            state_detail_id: state_detail_id_arr[j].state_detail_id,
          }
          // let data = await otherOrder.getBigRealtionOrder_id();
          // let keys = Object.keys(data[0]);
          // let relation_state_id = data[0][keys[0]];
          await get.insert(obj3);
        }
      }
      log.controlLog(req, { outData: 'success', control: `为新生成的订单创建流程` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入订单id，修改订单信息
   */
  updateOrder: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_id = body.or_id;
      let product_id = body.product_id;
      let channel_id = body.channel_id;
      let order_type = body.order_type;
      let type = body.type;
      if (typeof order_type != "string" && order_type) {
        order_type = order_type.toString();
      }
      let inmoney = body.inmoney;
      let orderFile = body.orderFile;
      let clientName = body.clientName;
      let userComment = body.userComment; // 用户备注

      let emps = await me.getEmp({ body: { emp_id: channel_id } });
      let dep_emp = await get.myDataAndOrNot({ tName: 'emp' }, { and: { emp_id: channel_id }, not: { 'type': 6 } });
      let dep_emp_id;
      if (emps.length != 0) {
        dep_emp_id = dep_emp[0].emp_id;
      }
      let office = await md.getRelation_product_dep({ body: { product_id: product_id, dep_emp_id: dep_emp_id } });
      let office_id;
      if (office.length != 0) {
        office_id = office[0].data.off_id;
      }

      let count = 0;

      let obj = {
        order_type: order_type, business_id: dep_emp_id, office_id: office_id, product_id: product_id,
        channel_id: channel_id, clientName: clientName, inmoney: inmoney, orderFile: orderFile,
        userComment: userComment, type: type
      }; // 要修改的数据
      await get.update({ tName: 'emp', emp_id: channel_id }, { 'submitTime': new Date().toLocaleString() });  // 将用户最后提交订单的时间赋值到用户表
      obj = util.spliceCode({}, obj);
      let tName = getOrderTName(order_type)
      await get.update({ tName: tName, order_id: order_id }, obj);
      log.controlLog(req, {
        outData: 'success', control: `修改订单内勤：${channel_id},状态:${order_type},申请金额:${inmoney},客户姓名:${clientName},用户备注:${userComment}`
      });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 后台通过订单id直接删除订单功能
   */
  deleteOrder: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_id = body.order_id;
      let order_type = body.order_type;
      let tName = getOrderTName(order_type);
      // 管道
      await get.delete({ tName: 'chatroom', chat_id: order_id });  // 删除与订单关联的聊天房间
      await get.delete({ tName: 'relation_order_state', order_id: order_id }); // 删除与订单相关联的流程状态
      await get.delete({ tName: tName, order_id: order_id }); // 删除此订单
      log.controlLog(req, { outData: 'success', control: `删除此订单聊天房间即对应流程` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入订单id,查看是否完整，否则删除此订单
   * @param {JSON} body {order_id:x }
   * @returns {number} count 删除的订单数量
   */
  deleteOrderById: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_arr = body.order_arr;
      order_arr = JSON.parse(order_arr);
      let counts = body.count; // 删除了几个订单
      let count = 0;

      for (let i = 0; i < order_arr.length; i++) {
        const order = order_arr[i];
        let order_id = order.order_id;
        let order_type = order.order_type;
        let orders = await md.getOrder({ body: { order_type: order_type, order_id: order_id } });
        if (orders.length != 0) {
          let product_id = orders[0].product_id;
          let channel_id = orders[0].channel_id;
          let type = orders[0].type;
          let inmoney = orders[0].inmoney;
          let orderFile = orders[0].orderFile;
          let clientName = orders[0].clientName;
          if (order_type == "1") {
            // 订单
            if (product_id && channel_id && type && inmoney && orderFile && clientName) {
              continue;
            } else {
              await get.delete({ tName: 'order1', order_id: order_id });
              log.controlLog(req, { outData: 'success', control: `自动删除了错误订单` });
              count++;
            }
          } else if (order_type == "2") {
            // 询值
            if (product_id && channel_id && type && orderFile) {
              continue;
            } else {
              await get.delete({ tName: 'order2', order_id: order_id });
              log.controlLog(req, { outData: 'success', control: `自动删除了错误订单` });
              count++;
            }
          } else if (order_type == "3") {
            // 推荐
            if (channel_id && clientName && type && orderFile) {
              continue;
            } else {
              await get.delete({ tName: 'order3', order_id: order_id });
              log.controlLog(req, { outData: 'success', control: `自动删除了错误订单` });
              count++;
            }
          }
        }
      }
      counts = counts - count;
      md.setCount({ "count": counts })
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入材料id与具体材料id数组，指定中间表
   * @returns {string} success
   */
  updateFileType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let file_type_id = body.file_type_id;
      let detail_file_type_id_arr = body.detail_file_type_id;
      if (typeof (detail_file_type_id_arr) != "object") {
        detail_file_type_id_arr = [detail_file_type_id_arr];
      }
      let maxId = await get.tbMaxId({ tName: 'relation_file_type_detail' }, 'id');
      let condis = {
        tName: 'relation_file_type_detail',
        file_type_id: file_type_id,
        id: maxId
      }
      await get.delete(condis);
      for (let i = 0; i < detail_file_type_id_arr.length; i++) {
        const detail_file_type_id = detail_file_type_id_arr[i];
        condis.detail_file_type_id = detail_file_type_id;
        await get.insert(condis);
      }
      log.controlLog(req, { outData: 'success', control: `为材料分配具体材料` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入具体材料id，删除一个具体材料
   * @returns {string} fileFail/success
   */
  deleteDetailFileType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let detail_file_type_id = body.detail_file_type_id;
      let files = await md.getRelation_file_type_detail({ body: { detail_file_type_id: detail_file_type_id } });
      if (files.length != 0) {
        log.controlLog(req, { outData: 'success', control: `删除具体材料失败，材料不存在` });
        cb("fileFail");
      } else {
        await get.delete({ tName: 'detail_file_type', detail_file_type_id: detail_file_type_id });
        let dName = await md.getDetail_file_type(body);
        log.controlLog(req, { outData: 'success', control: `删除具体材料${dName[0].name}` });
        cb('success');
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入材料表id，删除一个材料
   * @returns {string} productFail/success
   */
  deleteFileType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let file_type_id = body.file_type_id;
      let product = await md.getProduct({ body: { file_type_id: body.file_type_id } });
      if (product.length != 0) {
        cb("productFail");
      } else {
        // 管道
        await get.delete({ tName: 'relation_file_type_detail', file_type_id: file_type_id }); // 删除与之关联的中间表
        await get.delete({ tName: 'file_types_num', file_type_id: file_type_id }); // 删除材料
        let dName = await md.getFile_types_num(body);
        log.controlLog(req, { outData: 'success', control: `删除具体材料${dName[0].name}` });
        cb('success')
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 创建申请材料
   * @returns {string} success
   */
  insertFileType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let bus_name = body.bus_name;
      let maxId = await get.tbMaxId({ tName: 'file_types_num' }, 'file_type_id');
      let condis = {
        tName: 'file_types_num',
        file_type_id: maxId,
        name: bus_name,
      }
      await get.insert(condis);
      log.controlLog(req, { outData: 'success', control: `创建了申请材料${name}` });
      cb('success')
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 创建具体的申请材料
   * @returns {string} success
   */
  insertDetailFileType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let name_arr = body.name;
      let text_arr = body.text;
      if (typeof name_arr != "object") {
        name_arr = [name_arr];
      }
      if (typeof text_arr != "object") {
        text_arr = [text_arr];
      }
      let count = 0;
      let condis = { tName: 'detail_file_type', }
      for (let i = 0; i < name_arr.length; i++) {
        const name = name_arr[i];
        condis.detail_file_type_id = await get.tbMaxId({ 'tName': 'detail_file_type', condi: 'or' }, 'detail_file_type_id');
        condis.name = name;
        condis.text = text_arr[count++];
        await get.insert(condis);
      }
      log.controlLog(req, { outData: 'success', control: `创建了具体材料${name_arr.toString()}` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  // 创建一个商品
  insertProduct: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'product' }
      let maxId = await get.tbMaxId(condis, 'product_id');

      condis.product_id = maxId;
      condis.product_type_id = Number(body.product_type_id);
      condis.name = body.name;
      condis.isNum = 0;
      condis.isBourse = 0;
      condis.putaway = 0;
      await get.insert(condis);
      req.body.product_id = maxId;
      log.controlLog(req, { outData: 'success', control: `创建了一个新商品${body.name}` });
      md.updateProductInfo(req, cb);
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 创建一个商品类别
   * @returns {string} success
   */
  insertProductType: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let condis = { tName: 'product_type' }
      let maxId = await get.tbMaxId(condis, 'product_type_id');
      condis.product_type_id = maxId;
      condis.name = body.product_type_name;
      await get.insert(condis);
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 修改商品的基本信息
   * @returns {string} success
   */
  updateProductInfo: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let product_intro = body.product_intro;
      let product_id = body.product_id;
      let name = body.name;
      let threeText = body.threeText;
      let isNum = body.isNum;
      let isBourse = body.isBourse;
      let putaway = body.putaway;
      let exist_arr = body.exist;

      let product_detail = body.product_detail;
      product_detail = product_detail.replace(/\n/g, "&br");
      let imgPath = req.files.length;
      let flow_id = body.flow_id;
      let file_type_id = body.file_type_id;

      let imgPathDetail = "";
      let imgPathDetail2 = "";
      let imgPathSmall = "";
      let count = 0;
      let count2 = 0;
      for (let i = 0; i < exist_arr.length; i++) {
        const exist = exist_arr[i];
        if (exist == 0) {
          count++;
          continue;
        } else if (exist == 1) {
          let product = await md.getProduct({ body: { product_id: product_id } });
          imgPath = req.files[count2].path;
          count2++;
          let imgAgoPath = "";
          if (count == 0) {
            imgAgoPath = product[0].imgPathSmall;
            imgPathSmall = imgPath.split(uploadFile + symbol)[1]; // 实际传入数据库的图片路径
          } else if (count == 1) {
            imgAgoPath = product[0].imgPath;
            imgPathDetail = imgPath.split(uploadFile + symbol)[1]; // 实际传入数据库的图片路径
          } else if (count == 2) {
            imgAgoPath = product[0].imgPath2;
            imgPathDetail2 = imgPath.split(uploadFile + symbol)[1]; // 实际传入数据库的图片路径
          }
          count++;
          continue;
        }
      }
      let obj2 = { tName: 'product', product_id: product_id }
      let obj3 = {
        name: name, isNum: isNum, isBourse: isBourse, putaway: putaway, threeText: threeText,
        product_detail: product_detail, imgPath: imgPathDetail, imgPath2: imgPathDetail2, imgPathSmall: imgPathSmall,
        flow_id: flow_id, file_type_id: file_type_id, product_intro: product_intro
      }
      obj3 = util.spliceCode({}, obj3);
      await get.update(obj2, obj3);
      log.controlLog(req, { outData: 'success', control: `修改了商品的具体信息` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入具体的文件类型数表id，查询出对应的数据条数，以及名字，id
   * @returns {Array} [json1,json2...]
   */
  getDetailFile_types: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      if (body.file_type_id) {
        let data = await md.getRelation_file_type_detail({ body: { file_type_id: body.file_type_id } });
        let data2 = [];
        for (let i = 0; i < data.length; i++) {
          const val = data[i];
          let val2 = await md.getDetail_file_type({ body: { detail_file_type_id: val.detail_file_type_id } });
          data2.push(val2[0]);
        }
        cb(null, data2);
      } else {
        cb(null, [])
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入流程id
   * 得到具体的各个流程与各个状态
   * @returns {Array} [sortFlows([json1,json2...]),state_details_arr([json1,json2...])]
   */
  getSortFlowState: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let sortFlows = await getsortFlow(body.flow_id);
      let state_details_arr = [];
      // 遍历多个具体的流程信息，获得每个具体流程下对应的多个具体状态信息
      for (let i = 0; i < sortFlows.length; i++) {
        let flow_detail_id = sortFlows[i].flow_detail_id;
        let state_details = await getsortSate(flow_detail_id);
        state_details_arr.push(state_details);
      }
      cb(null, [sortFlows, state_details_arr]);
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 获得符合条件的订单信息,区分权限
   * @param {JSON} body {order_type:x && userdep_id:x && busoff_id:x && role_type:x || order_state }
   * @returns {Array} [json1,json2...] || {number} data.length
   */
  getOrders: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      // let order_id = body.order_id;
      // let appli_id = body.appli_id;
      // let type = body.type;
      // let channel_id = body.channel_id;
      // let business_id = body.business_id;
      // let office_id = body.office_id;
      let order_state = body.order_state;
      let limit = body.limit;
      // 通过order_type判断去查询哪种类型的订单表
      let data = [];
      let obj = { tName: 'order', limit, limit };
      data = await getPowerOrder(body);
      if (order_state) {
        cb(null, data.length);
      } else {
        data = util.sortArr(data, 'appliTime', 'desc');
        data = util.splitPage(obj, data);
        cb(null, data);
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  /**
   * 传入要查询的商品的JSON数据，返回分页的商品
   * @param {JSON} body {limit:x, 其他字段:x }
   * @returns {string} "{'data':'[p1,p2...]'}"
   */
  getLimitProduct: async function (req, cb) {
    try {
      let body = req.body;
      let product_type_id = body.product_type_id;
      let limit = body.limit;
      let data = await md.getProduct({ body: { product_type_id: product_type_id } });
      data = util.splitPage({ tName: 'product', limit: limit }, data);
      cb(JSON.stringify({ 'data': data }));
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  },
  // use
  /**
   * 获得这张订单的所有信息
   * @returns {Array} [allFlowState,allState,flowTime]
   */
  getAllOrderInfo: function (req, cb) {
    let body = req.body;
    let arr = [];
    async.parallel([
      function (cb2) {
        (async function () {
          try {
            let product = await md.getProduct({ body: { product_id: body.product_id } });
            let data = await md.getSortFlowState({ flow_id: product[0].flow_id });
            arr.push({ allFlowState: data });
            cb2();
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })()
      },
      function (cb2) {
        (async function () {
          try {
            let ret = await md.getRelation_order_state({ body: { order_id: order_id } });
            let data = util.dataFormat(['state_time', 'flow_time'], ret);
            arr.push({ allState: data });
            cb2();
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })()
      },
      function (cb2) {
        (async function () {
          try {
            console.log(426985798799789);
            let ret = await md.getFlows({ body: body });
            ret = JSON.parse(ret)[3];
            let data = util.dataFormat(['state_time', 'flow_time'], ret);
            arr.push({ flowTime: rt });
            cb2();
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })()
      }],
      function (err) {
        cb(null, arr)
      }
    );
  },
  // use
  /**
   * 传入订单与状态中间表的id，
   * 返回具体的流程的字符串值
   * @returns {string} state_name
   */
  getStates: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let relation_state_id = body.state_id;
      let oStates = await md.getRelation_order_state({ body: { relation_state_id: relation_state_id } });
      let state_detail_id = oStates[0].state_detail_id;
      let sDetal = await md.getState_detail({ body: { state_detail_id: state_detail_id } });
      let state_name = sDetal[0].state_name;
      cb(null, state_name);
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入订单编号，
   * 返回流程id，大流程对应各小流程的时间，订单id, 
   * @returns {Array} [flow_id,[t1,t2,t3...],order_id]
   */
  getFlows: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_id = body.order_id;
      let orders = await md.getOrder({ body: { order_id: order_id, order_type: 1 } });
      let product_id = orders[0].product_id;
      let flowState = orders[0].flowState;
      let products = await md.getProduct({ body: { product_id: product_id } });
      let flow_id = products[0].flow_id;
      let flows = await getsortFlow(flow_id);
      let arr = [];
      let arr2 = []; // 得到的是，一个大流程各个小流程下对应的其中一个状态，主要需要的是流程对应的时间
      let count = 0;
      let count2 = null;
      for (let i = 0; i < flows.length; i++) {
        const rt = flows[i];
        let flow_detail_id = rt.flow_detail_id;
        if (flowState == flow_detail_id) {
          count2 = count;
        } else {
          count++;
        }
        let stateFlow = await md.getRelation_state_flow({ body: { flow_detail_id: flow_detail_id } });
        let state_detail_id;
        if (stateFlow[0]) {
          state_detail_id = stateFlow[0].state_detail_id;
        }
        let oState = await md.getRelation_order_state({ body: { order_id: order_id, state_detail_id: state_detail_id } });
        arr2.push(oState[0]);
      }
      arr.push(flow_id);
      arr.push(order_id);
      arr.push(flows);
      arr.push(arr2);
      arr.push(count2);
      cb(null, arr);
    } catch (err) {
      log.errLog(req);
      console.log(err);
      cb('error');
    }
  }),
  // use
  /**
   * 传入订单id，以及当前订单对应的流程ID
   * 返回这个订单，当前流程的id值，以及流程按leavl级别升序排序的所有数据
   * @returns {string} flowState/""
   */
  getState: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let orders = await md.getOrder({ body: { order_id: body.order_id, order_type: body.order_type } });
      orders = util.sortArr(oreders, 'leavl', 'asc');
      if (orders[0].flowState) {
        cb(orders[0].flowState);
      } else {
        cb("");
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入具体流程，flow_detail_id
   * 返回栏值所对应的流程的字符串值以及各个状态，json字符串格式
   *  @returns {Array} [[object,object...],string]
   */
  getStatess: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_id = body.order_id;
      let flow_detail_id = body.flow_id;
      let flows = await md.getFlow_detail({ body: { flow_detail_id: flow_detail_id } });
      let flow_name = flows[0].flow_name;
      let sortSates = await getsortSate(flow_detail_id);
      let arr1 = [];
      let arr2 = [];
      for (let i = 0; i < sortSates.length; i++) {
        const rst = sortSates[i];
        let state_detail_id = rst.state_detail_id;
        let oState = await md.getRelation_order_state({ body: { state_detail_id: state_detail_id, order_id: order_id } });
        arr1.push(oState[0]);
        let sDetal = await md.getState_detail({ body: { state_detail_id: state_detail_id } });
        arr2.push(sDetal[0]);
      }
      cb(JSON.stringify({ 'data': [arr1, arr2, flow_name] }));
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 无须传入东西，创建一个空订单，返回订单id,json格式
   * @returns {string} order_id 新创建空订单的主键id
   */
  createOrder: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_type = body.order_type;
      if (typeof order_type != "string" && order_type) {
        order_type = order_type.toString();
      }
      let appli_id = body.appli_id;
      appli_id = addZero(appli_id);
      let appliTime = new Date();
      // 获得主键
      let order_id = await get.tbMaxId({ tName: 'order' }, 'order_id');
      let tName = getOrderTName(order_type);
      await get.insert({ tName: tName, order_id: order_id, appli_id: appli_id, appliTime: appliTime, order_type, order_type });
      log.controlLog(req, { outData: 'success', control: `创建了一张空订单` });
      cb(null, order_id.toString());
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入创建流程所需要的数据
   * 创建一个完整的流程
   */
  createFlow: promise.promisify(async function (req, cb) {
    let body = req.body;
    let flow_name = body.flow_name;
    let detail_flow_name = body.detail_flow_name;
    let flow_leavl = body.flow_leavl;
    let detail_state_name = body.detail_state_name;
    let state_leavl = body.state_leavl;
    if (typeof detail_flow_name != "object") {
      detail_flow_name = [detail_flow_name];
    }
    if (typeof flow_leavl != "object") {
      flow_leavl = [flow_leavl];
    }
    if (typeof detail_state_name != "object") {
      detail_state_name = [detail_state_name];
    }
    if (typeof state_leavl != "object") {
      state_leavl = [state_leavl];
    }
    // 这个for循环是用来将对应的具体流程的等级，拼接在一起.拼接格式为 [[detail_flow_name, leavl], [detail_flow_name, leavl], ......]
    let flow_arr = [];
    for (let i = 0; i < flow_leavl.length; i++) {
      let condis = {
        flow_name: detail_flow_name[i],
        leavl: Number(flow_leavl[i])
      };
      flow_arr.push(condis);
    }
    let state_arr = [];
    for (let i = 0; i < state_leavl.length; i++) {
      let condis = {
        state_name: detail_state_name[i],
        leavl: Number(state_leavl[i])
      };
      state_arr.push(condis);
    }
    let flow_id;
    let detail_flow_id_arr = [];
    let detail_state_id_arr = [];

    // 这个for循环是用来将对应的具体状态的等级，拼接在一起.拼接格式为 [[detail_state_name, leavl], [detail_state_name, leavl], ......]
    async.parallel([
      function (cb2) {
        (async function () {
          try {
            flow_id = await get.tbMaxId({ tName: 'flow' }, 'flow_id');
            let condis = { tName: 'flow', flow_id: flow_id, flow_name: flow_name }
            await get.insert(condis);
            cb2(null, 1);
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })();
      },
      function (cb2) {
        (async function () {
          try {
            for (let i = 0; i < flow_arr.length; i++) {
              const condis = flow_arr[i];
              let flow_detail_id = await get.tbMaxId({ tName: 'flow_detail' }, 'flow_detail_id');
              condis.flow_detail_id = flow_detail_id;
              condis.tName = 'flow_detail';
              condis.flow_name = flow_arr[i].flow_name;
              let order = await get.insert(condis);
              detail_flow_id_arr.push(flow_detail_id);
            }
            cb2(null, 2);
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })();
      },
      function (cb2) {
        (async function () {
          try {
            for (let i = 0; i < state_arr.length; i++) {
              const condis = state_arr[i];
              condis.tName = 'state_detail';
              let state_detail_id = await get.tbMaxId({ tName: 'state_detail' }, 'state_detail_id');
              condis.state_detail_id = state_detail_id;
              condis.tName = 'state_detail';
              condis.state_name = state_arr[i].state_name;
              await get.insert(condis);
              detail_state_id_arr.push(state_detail_id);
            }
            cb2(null, 3);
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })();
      }
    ], function (err) {
      let arr = [];
      let arr2 = [];
      for (let i = 0; i < state_leavl.length; i++) {
        let num = parseInt(detail_state_id_arr[i]);
        if (state_leavl[i] != "1") {
          arr2.push(num);
        } else {
          arr2 = [];
          arr2.push(num);
          arr.push(arr2);
        }
      }
      let count = 0;
      (async function () {
        try {
          for (let i = 0; i < detail_flow_id_arr.length; i++) {
            const detail_flow_id = detail_flow_id_arr[i];
            let maxId1 = await get.tbMaxId({ tName: 'relation_flow_detail' }, 'id');
            let condis = {
              tName: 'relation_flow_detail',
              flow_id: flow_id,
              flow_detail_id: detail_flow_id,
              id: maxId1
            }
            await get.insert(condis);
            let maxId2 = await get.tbMaxId({ tName: 'relation_state_flow' }, 'id');
            let obj2 = {
              tName: 'relation_state_flow',
              flow_detail_id: detail_flow_id,
              id: maxId2
            }
            for (let i = 0; i < arr[count].length; i++) {
              const detail_state_id = arr[count][i];
              obj2.state_detail_id = detail_state_id;
              await get.insert(obj2);
            }
            count++;
          }
          log.controlLog(req, { outData: 'success', control: `创建了一个完成的流程${flow_name}` });
          cb('success');
        } catch (err) {
          log.errLog(req);
          cb('error')
        }
      })()
    })
  }),

  // use
  /**
   * 传入流程id，flow_id，查看流程中间表，是否有与此对应的值
   * 数据库出现错误返回error，存在关联不能删除返回fail，可以删除就返回success
   * @param {JSON} body flow_id流程的主键id
   * @returns {string} productFail(商品与该流程关联)/orderFail(订单状态与该流程关联)/success(删除成功)/error
   */
  deleteFlow: promise.promisify(async function (req, cb) {
    let body = req.body;
    let flow_id = body.flow_id;
    let flow_arr;
    let state_arr;

    let products = await md.getProduct({ body: { flow_id: flow_id } });
    let fName = await md.getFlow({ flow_id: flow_id });
    if (products.length != 0) {
      log.controlLog(req, { outData: 'success', control: `删除流程${fName[0].flow_name}失败，有商品与之关联` });
      cb("productFail");
    } else {
      let sFlows = await getsortFlow(flow_id);
      flow_arr = sFlows;
      async.each(sFlows, function (rt1, cb2) {
        (async function () {
          try {
            let flow_detail_id = rt1.flow_detail_id;
            let states = await getsortSate(flow_detail_id);
            state_arr = states;
            async.each(states, function (rt2, cb3) {
              (async function () {
                try {
                  let state_detail_id = rt2.state_detail_id;
                  let oState = await md.getRelation_order_state({ body: { state_detail_id: state_detail_id } });
                  if (oState.length != 0) {
                    log.controlLog(req, { outData: 'success', control: `删除流程${fName[0].flow_name}失败，有订单仍在使用` });
                    cb("orderFail");
                  } else {
                    cb3();
                  }
                } catch (err) {
                  log.errLog(req);
                  cb('error')
                }
              })()
            }, function (err) {
              cb2();
            })
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })()
      }, function (err) {
        (async function () {
          try {
            // 管道
            // 删除中间表流程与具体流程的关联
            await get.delete({ tName: 'relation_flow_detail', flow_id: flow_id });
            // 删除流程表的流程
            await get.delete({ tName: 'flow', flow_id: flow_id });
            for (let i = 0; i < flow_arr.length; i++) {
              const val = flow_arr[i];
              // 删除中间表具体流程与具体状态的关联
              await get.delete({ tName: 'relation_state_flow', flow_detail_id: val.flow_detail_id });
              // 删除具体流程详细表
              await get.delete({ tName: 'flow_detail', flow_detail_id: val.flow_detail_id });
            }
            for (let i = 0; i < state_arr.length; i++) {
              const val = state_arr[i];
              // 删除具体状态详细表
              await get.delete({ tName: 'state_detail', state_detail_id: val.state_detail_id })
            }
            log.controlLog(req, { outData: 'success', control: `删除了一个完成的流程${flow_name}` });
            cb('success');
          } catch (err) {
            log.errLog(req);
            cb('error');
          }
        })()
      })
    }
  }),
  // use
  /**
   * 根据传入的商品id，删除此商品
   * @param {JSON} body {product: x}
   * @returns {string} orderFail(该商品与订单有关联)/success/eror
   */
  deleteProduct: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let product_id = body.product_id;
      let order1 = await md.getOrder({ body: { order_type: 1, product_id: product_id } });
      let order2 = await md.getOrder({ body: { order_type: 2, product_id: product_id } });
      let order3 = await md.getOrder({ body: { order_type: 3, product_id: product_id } });
      let pName = await md.getProduct(body);
      if (order1 != 0 || order2 != 0 || order3 != 0) {
        log.controlLog(req, { outData: 'success', control: `删除商品${pName[0].name}失败，有订单与之关联` });
        cb("orderFail");
      } else {
        let products = await md.getProduct({ body: { product_id: product_id } });
        let agoImgPath = products[0].imgPath;
        util.deleteFile(agoImgPath, uploadFile);
        agoImgPath = products[0].imgPathSmall;
        util.deleteFile(agoImgPath, uploadFile);
        await get.delete({ tName: 'product', product_id: product_id });
        log.controlLog(req, { outData: 'success', control: `删除商品${pName[0].name}成功` });
        cb("success");
      }
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 传入大状态与订单id，修改他的大状态
   * @param {JSON} body {order_type:x, order_state:x, order_id:x}
   * @returns {string} success
   */
  setOrder_state: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_type = body.order_type;
      let order_state = body.order_state;
      let order_id = body.order_id;
      let tName = getOrderTName(order_type);
      let condis = { tName: tName, order_id: order_id }
      await get.update(condis, { order_state: order_state });
      log.controlLog(req, { outData: 'success', control: `设置订单id：${order_id}的状态为：${getRelation_order_state(order_state)}` });
      cb(null, "success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),
  // use
  /**
   * 传入还款状态1或2，修改还款状态
   * @param {JSON} body {refund:x, order_id:x };
   * @returns {string} success
   */
  setRefund_state: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let refund = body.refund;
      let order_id = body.order_id;
      await get.update({ tName: 'order1', order_id: order_id }, { refund: refund });
      log.controlLog(req, { outData: 'success', control: `设置还款状态：${refund = refund == 0 ? '未还款' : '还款'}` });
      cb("success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),
  // use
  /**
   * 修改订单与状态中间表的失败原因,如果failReason为空将订单状态变为审核中，否则为失败
   * @param {JSON} body {failReason:x, order_id:x };
   * @returns {string} success
   */
  setFailReason: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let order_id = body.order_id;
      let failReason = body.failReason;
      if (failReason == "") {
        failReason = null;
      }
      await get.update({ tName: 'order1', order_id: order_id }, { failReason: failReason });
      if (failReason && failReason != "") {
        await md.setOrder_state({ body: { order_state: 4, order_id: order_id, order_type: 1 } });
      } else {
        await md.setOrder_state({ body: { order_state: 2, order_id: order_id, order_type: 1 } });
      }
      log.controlLog(req, { outData: 'success', control: `设置失败原因：${failReason}` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  // use
  /**
   * 修改总利润的值
   * @param {JSON} body {profit:x };
   * @returns {string} success
   */
  updateProfit: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let profit = body.profit;
      await get.update({ tName: 'total_profit' }, { profit: profit });
      log.controlLog(req, { outData: 'success', control: `修改总利润为：${profit}` });
      cb('success');
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),
  // use
  /**
   * 传入状态表id，state_detail_id与订单id,order_id,和时间time
   * @param {JSON} body {state_detail_id:x, order_id:x, time:x };
   * @returns {string} success
   */
  setState: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let state_detail_id = body.state_detail_id;
      let order_id = body.order_id;
      let time = body.time;
      await get.update({ tName: 'relation_order_state', order_id: order_id, state_detail_id: state_detail_id }, { state_time: time });
      let oState = await md.getRelation_order_state({ body: { state_detail_id: state_detail_id, order_id: order_id } });
      let relation_state_id = oState[0].relation_state_id;
      await get.update({ tName: 'order1', order_id: order_id }, { relation_state_id: relation_state_id });
      cb("success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),
  // use
  /**
   * 设置此订单流程对应的时间,把对应的订单的申请流程id修改为当前流程
   * 传入流程id，flow_id,与订单id，order_id与栏值，以及中间表流程对应的事件，flow_time
   * @param {JSON} body {flow_id:x, order_id:x, flow_time:x }
   * @returns {string} success
   */
  setFlowTime: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let flow_detail_id = body.flow_detail_id;
      let order_id = body.order_id;
      let flow_time = body.flow_time;
      await get.update({ tName: 'order1', order_id: order_id }, { flowState: flow_detail_id });
      let sFlows = await md.getRelation_state_flow({ body: { flow_detail_id: flow_detail_id } });
      for (let i = 0; i < sFlows.length; i++) {
        const rt = sFlows[i];
        let state_detail_id = rt.state_detail_id;
        await get.update({ tName: 'relation_order_state', order_id: order_id, state_detail_id: state_detail_id }, { flow_time: flow_time });
      }
      log.controlLog(req, { outData: 'success', control: `设置流程时间：${flow_time}` });
      cb("success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),
  // use
  /**
   * 传入订单id，以及字段名，以及要修改的内容
   * @param {JSON} body {字段名:值};
   * @returns {string} success
   */
  updateOneOrder: promise.promisify(async function (req, cb) {
    try {
      let body = req.body;
      let obj = {};
      let order_type = body.order_type;
      let name = body.name[0];
      let val = body.name[1];
      obj[name] = val;
      let order_id = body.order_id;
      await get.update({ tName: 'order', order_type: order_type, order_id: order_id }, obj);
      log.controlLog(req, { outData: 'success', control: `修改订单信息${name}为：${val}` });
      cb("success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  }),

  screenOrder: function (req, cb2) {
    let body = req.body;
    let userdep_id = body.userdep_id;
    let role_type = body.role_type;
    let emp_id = body.emp_id;
    async.series({
      type: function (cb) {
        // 获取筛选的所有类型
        (async function () {
          try {
            let result = await md.getProduct_type({ body: null });
            cb(null, result);
          } catch (err) {
            log.errLog(req);
            cb2('error')
          }
        })()
      }, channel: function (cb) {
        (async function () {
          try {
            let arr = [];
            if (role_type == 3) {
              if (userdep_id) {
                let ret = await me.getEmp({ body: { type: "5", dep_id: userdep_id } });
                async.each(ret, function (rt, cb3) {
                  (async function () {
                    try {
                      let iiuv = rt.iiuv;
                      let ret2 = await me.getEmp({ body: { iiuv: iiuv, type: 6 } });
                      if (ret2.length != 0) {
                        arr = arr.concat(ret2)
                      }
                      cb3();
                    } catch (err) {
                      log.errLog(req);
                      cb2('error');
                    }
                  })()
                }, function (err) {
                  cb(null, arr);
                })
              } else {
                cb(null, [])
              }
            } else if (role_type == 4) {
              let arr = [];
              let ret = await getProduct_DepEmps({ off_id: emp_id }, 'dep_emp_id');
              async.each(ret, function (rt, cb3) {
                (async function () {
                  try {
                    ret2 = await me.getEmp({ body: { iiuv: rt.iiuv, type: 6 } });
                    if (ret2.length != 0) {
                      arr = arr.concat(ret2)
                    }
                    cb3();
                  } catch (err) {
                    log.errLog(req);
                    cb2('error');
                  }
                })();
              }, function (err) {
                cb(null, arr);
              })
            } else if (role_type == 5) {
              let emps = await me.getEmp({ body: { emp_id: emp_id } });
              let iiuv = emps[0].iiuv;
              let users = await me.getEmp({ body: { iiuv: iiuv, type: 6 } });
              cb(null, users)
            } else {
              // 获取筛选的所有渠道
              let result = await me.getEmp({ body: { type: 6 } });
              cb(null, result);
            }
          } catch (err) {
            log.errLog(req);
            cb2('error');
          }
        })()
      },
      business: function (cb) {
        (async function () {
          try {
            if (role_type == 3) {
              // 获取筛选的所有业务
              if (userdep_id) {
                let ret = await me.getEmp({ body: { type: "5", dep_id: userdep_id } });
                cb(null, ret);
              } else {
                cb(null, [])
              };
            } else if (role_type == 4) {
              let arr = await getProduct_DepEmps({ off_id: emp_id }, 'dep_emp_id');
              cb(null, arr)
            } else if (role_type == 5) {
              let ret = await me.getEmp({ body: { type: "5", "emp_id": emp_id } });
              cb(null, ret)
            } else {
              let ret = await me.getEmp({ body: { type: "5" } });
              cb(null, ret);
            }
          } catch (err) {
            log.errLog(req);
            cb2('error')
          }
        })()
      },
      business: function (cb) {
        (async function () {
          try {
            if (role_type == 3) {
              // 获取筛选的所有业务
              if (userdep_id) {
                let ret = await me.getEmp({ body: { type: "5", dep_id: userdep_id } });
                cb(null, ret);
              } else {
                cb(null, [])
              };
            } else if (role_type == 4) {
              let arr = await getProduct_DepEmps({ off_id: emp_id }, 'dep_emp_id');
              cb(null, arr)
            } else if (role_type == 5) {
              let ret = await me.getEmp({ body: { type: "5", "emp_id": emp_id } });
              cb(null, ret)
            } else {
              let ret = await me.getEmp({ body: { type: "5" } });
              cb(null, ret);
            }
          } catch (err) {
            log.errLog(req);
            cb2('error')
          }
        })()
      },
      office: function (cb) {
        (async function () {
          try {
            if (role_type == 3) {
              if (userdep_id) {
                let arr = [];
                let rets = await me.getEmp({ body: { type: "5", dep_id: userdep_id } });
                for (let i = 0; i < rets.length; i++) {
                  const rts = rets[i];
                  arr = arr.concat(await getProduct_DepEmps({ dep_emp_id: rts.emp_id }, 'off_id'));
                }
                let arr2 = [];
                let arr3 = []
                for (let i = 0; i < arr.length; i++) {
                  const val = arr[i];
                  if (arr2.indexOf(val.emp_id) < 0) {
                    arr2.push(val.emp_id);
                    arr3.push(val);
                  }
                }
                cb(null, arr3);
              } else {
                cb(null, []);
              }
            } else if (role_type == 4) {
              let ret = await me.getEmp({ body: { "emp_id": emp_id } });
              cb(null, ret);
            } else if (role_type == 5) {
              let ret = await getProduct_DepEmps({ dep_emp_id: emp_id }, 'off_id');
              cb(null, ret);
            } else {
              // 获取筛选的所有内勤
              let result = await me.getEmp({ body: { type: "4" } });
              cb(null, result);
            }
          } catch (err) {
            log.errLog(req);
            cb2('error')
          }
        })()
      },
      dep: function (cb) {
        // 获取筛选的所有部门
        (async function () {
          try {
            let ret = await me.getDep({ body: "" });
            cb(null, ret);
          } catch (err) {
            log.errLog(req);
            cb2('error')
          }
        })();
      }
    }, function (err, result) {
      cb2(JSON.stringify(result));
    })
  },
  /**
   * 筛选订单
   * 可选：传入部门id(dep_id),订单类型(order_type),商品类型(type),渠道id(channel_id),业务id(business_id),内勤id(office_id)
   * 以及起始时间(time1)，截止时间(time2)[格式:'xxxx-xx-xx xx:xx']
   * 返回json字符串格式，{"result":result[Arrar]}
   */
  screen: promise.promisify(async function (req, cb) {
    let body = req.body;
    let timeType = body.timeType; // 申请时间还是放款时间
    let limit = body.limit; // 分页
    let time1 = body.time1; // 起始时间
    if (time1) {
      time1 = time1.toString();
    }
    let time2 = body.time2; // 结束时间
    if (time2) {
      time2 = time2.toString();
    }
    let data = await getPowerOrder(body);
    try {
      let arr = [];
      // 按时间排序
      let timeKey = 'appliTime';
      if (timeType == 8) {  // appliTime
      } else if (timeType == 9) { // loanTime
        timeKey = 'loanTime';
      }
      data.forEach(function (val) {
        try {
          if (val[timeKey] >= time1 && val[timeKey] <= time2) {
            arr.push(val);
          }
        } catch (err) {
          log.errLog(req);
          cb('error');
        }
      });
      let b = util.sortArr(data, 'appliTime', 'desc');
      b = util.splitPage({ limit: limit }, arr);
      cb(JSON.stringify({ data: b }))
    } catch (err) {
      log.errLog(req);
      cb('error');
    }
  }),
  //写入excel表格
  /**
   * @param {Object} results  results[json对象，json对象]
   * @param {any} callback    callback("true或者false") true写入成功，false写入失败
   */
  writeExcel: async function (results, callback) {
    try {
      let arrStr = public.outputTitleArrOrder;
      let data = [arrStr];
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        let keys = Object.keys(result);
        let arr = [];
        for (let j = 0; j < keys.length; j++) {
          let val;
          const k = keys[j];
          let time;
          switch (k) {
            case "emp_id":
              break;
            case "relation_state_id":
              if (result[k]) {
                val = await getsortSate(result[k]);
                if (val.length != 0) {
                  arr.push(val[0].flow_name);
                } else {
                  arr.push('空');
                }
              } else {
                arr.push('空');
              }
              break;
            case "flowState":
              if (result[k]) {
                val = await getsortFlow(result[k]);
                if (val.length != 0) {
                  arr.push(val[0].flow_name);
                } else {
                  arr.push('空');
                }
              } else {
                arr.push('空');
              }
              break;
            case "product_id":
              val = await md.getProduct({ body: { product_id: result[k] } });
              if (val.length != 0) {
                arr.push(val[0].name);
              } else {
                arr.push('空');
              }
              break;
            case "order_state":
              val = getRelation_order_state({ body: result[k] });
              arr.push(val);
              break;
            case "seeTime":
              val = new Date(result[k]).toLocaleTimeString();
              arr.push(val);
              break;
            case "loanTime":
              val = new Date(result[k]).toLocaleTimeString();
              arr.push(val);
              break;
            case "type":
              val = await md.getProduct_type({ body: { product_type_id: result[k] } });
              if (val.length != 0) {
                arr.push(val[0].name);
              } else {
                arr.push('空');
              }
              break;
            case "failReason":
              val = set_br_n(result[k]);
              arr.push(val);
              break;
            case "empComment":
              val = set_br_n(result[k]);
              arr.push(val);
              break;
            case "userComment":
              val = set_br_n(result[k]);
              arr.push(val);
              break;
            case "appliTime":
              val = new Date(result[k]).toLocaleTimeString();
              arr.push(val);
              break;
            case "order_type":
              break;
            case "channel_id":
              val = await me.getEmp({ body: { emp_id: result[k] } });
              if (val.length != 0) {
                arr.push(val[0].name);
              } else {
                arr.push('空');
              }
              break;
            case "office_id":
              val = await me.getEmp({ body: { emp_id: result[k] } });
              if (val.length != 0) {
                arr.push(val[0].name);
              } else {
                arr.push('空');
              }
              break;
            case "business_id":
              val = await me.getEmp({ body: { emp_id: result[k] } });
              if (val.length != 0) {
                arr.push(val[0].name);
              } else {
                arr.push('空');
              }
              break;
            case "card_name":
              arr.push(result[k]);
              break;
            default:
              arr.push(result[k]);
          }
        }
        data.push(arr);
      }
      let buffer = xlsx.build([{ name: "sheet1", data: data }]);
      let timeStr = new Date().getTime();
      let pathStr = path.join(__dirname, "../public/" + excelFile + "/" + timeStr + ".xlsx");
      fs.writeFile(pathStr, buffer, "binary", function (err) {
        if (err) {
          callback("false", null);
        } else {
          timer.deleteExcel(pathStr);
          log.controlLog(req, { outData: 'success', control: `导出了订单` });
          callback("true", pathStr);
        }
      });
    } catch (err) {
      log.errLog(req);
      callback('error');
    }
  },
  // use
  /**
   * 为total_profit表中的count赋值，也就是订单编号尾数
   * @param {JSON} body
   */
  setCount: promise.promisify(async function (req, cb) {
    try {
      let count = body.count;
      let counts = await get.update({ tName: 'total_profit' }, { count: count });
      cb(null, "success");
    } catch (err) {
      log.errLog(req);
      cb("error");
    }
  })
};

// use
function set_br_n(text, cb) {
  let str = "";
  if (text) {
    let arr = text.split("&br");
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    return str;
  } else {
    return '空';
  }
}

// use
/**
 * 传入相应的数字，返回对应的字符串值
 * @param {number} num 1,2,3,4
 * @returns {string} 
 */
function getRelation_order_state(num, cb) {
  let text = "";
  if (num == 1) {
    text = "申请中";
  } else if (num == 2) {
    text = "审核中";
  } else if (num == 3) {
    text = "通过";
  } else if (num == 4) {
    text = "失败";
  }
  return text;
}
// use
/**
 * 数位不够加0,生成订单编号
 * @param {number} num 
 */
function addZero(num) {
  let tm = Date.now();
  tm = moment(tm).format("YYYYMMDD");
  let length = num.toString().length;
  let n = 0;
  if (length <= 4) {
    n = 4 - parseInt(length);
  }
  for (let i = 0; i < n; i++) {
    tm += "0";
  }
  tm += num;
  return tm;
}


// use
/**
 * @param {number} flow_id
 * @returns {Array} [json1,json2...] 当前流程下对应的具体流程从小到大排序
 */
let getsortFlow = promise.promisify(async function (flow_id, cb) {
  try {
    // 通过flow_id获得流程对应的多个具体流程（中间表）
    let rFlow_details = await md.getRelation_flow_detail({ body: { flow_id: flow_id } });
    let flow_details_arr = [];
    // 获得具体流程的信息，并与流程信息拼接在一起
    for (let i = 0; i < rFlow_details.length; i++) {
      let val = await md.getFlow_detail({ body: { flow_detail_id: rFlow_details[i].flow_detail_id } })
      flow_details_arr.push(val[0]);
    }
    // 排序
    let sortFlows = util.sortArr(flow_details_arr, 'leavl', 'asc');
    cb(null, sortFlows);
  } catch (err) {
    log.errLog(req);
    cb('error');
  }
})
// use
/**
 * @param {Number} flow_detail_id 具体流程id
 * @returns {Array} [json1,json2...] 当前具体流程下对应的具体状态从小到大排序
 */
let getsortSate = promise.promisify(async function (flow_detail_id, cb) {
  try {
    let state_detail_id_arr = await md.getRelation_state_flow({ body: { flow_detail_id: flow_detail_id } });
    let state_details = [];   // 一个具体流程，对应的多个具体状态
    for (let j = 0; j < state_detail_id_arr.length; j++) {
      let state_detail = await md.getState_detail({ body: { state_detail_id: state_detail_id_arr[j].state_detail_id } });
      state_details.push(state_detail[0]);
    }
    state_details = util.sortArr(state_details, 'leavl', 'asc');
    cb(null, state_details);
  } catch (err) {
    log.errLog(req);
    cb('error');
  }
})

// use
/**
 * @param {JSON} obj {order_type:x, userdep_id:x, busoff_id:x }
 * @param {JSON} obj2 {字段1:x, 字段2:x...}筛选条件
 * @returns {Array} data [json1,json2...]
 */
let getPowerOrder = promise.promisify(async function (obj, cb) {
  try {
    let dep_id = obj.dep_id; // 部门id
    let order_type = obj.order_type; // 订单类型
    let type = obj.type; // 商品类型
    let channel_id = obj.channel_id; // 渠道id（用户id）
    let business_id = obj.business_id; // 业务id
    let office_id = obj.office_id; // 内勤id
    let order_state = obj.order_state; // 订单状态

    // 个人权限信息
    let role_type = obj.role_type;
    let userdep_id = obj.userdep_id;
    let busoff_id = obj.busoff_id;

    let data;
    let jsBody = {
      order_type: order_type, type: type, channel_id: channel_id,
      business_id: business_id, office_id: office_id, order_state: order_state
    };
    if (role_type == 1 || role_type == 2) {    // 管理员 与 董事长
      let arr = [];
      if (dep_id) {
        let emps = await me.getEmp({ body: { dep_id: dep_id } });
        for (let i = 0; i < emps.length; i++) {
          const val = emps[i];
          let busId = val.emp_id;
          jsBody.business_id = busId;
          let ret = await md.getOrder({ body: jsBody });
          if (ret.length != 0) {
            arr = arr.concat(ret);
          }
        }
        data = arr;
      } else {
        data = await md.getOrder({ body: jsBody });
      }
    } else if (role_type == 3) {  // 经理
      if (dep_id) {
        if (dep_id == userdep_id) {
          let ret1 = await me.getEmp({ body: { dep_id: userdep_id } });
          let arr = [];
          for (let i = 0; i < ret1.length; i++) {
            const val = ret1[i];
            jsBody.business_id = val.emp_id;
            let ret2 = await md.getOrder({ body: jsBody });
            arr = arr.concat(ret2);
          }
          data = arr;
        } else {
          data = [];
        }
      } else {
        let ret1 = await me.getEmp({ body: { dep_id: userdep_id } });
        let arr = [];
        for (let i = 0; i < ret1.length; i++) {
          const val = ret1[i];
          jsBody.business_id = val.emp_id;
          let ret2 = await md.getOrder({ body: jsBody });
          arr = arr.concat(ret2);
        }
        data = arr;
      }
    } else if (role_type == 4) {  // 内勤
      jsBody.office_id = busoff_id;
      if (dep_id) {
        let arr = [];
        let emps = await getProduct_DepEmps({ dep_id: dep_id, off_id: busoff_id }, 'dep_emp_id');
        for (let i = 0; i < emps.length; i++) {
          const val = emps[i];
          jsBody.business_id = val.emp_id;
          arr = arr.concat(await md.getOrder({ body: jsBody }));
        }
        data = arr;
      } else {
        data = await md.getOrder({ body: jsBody });
      }
    } else if (role_type == 5) {  // 业务
      jsBody.business_id = busoff_id;
      data = await md.getOrder({ body: jsBody });
    }
    cb(null, data);
  } catch (err) {
    log.errLog(req);
    cb('error');
  }
})
// use
/**
 * 传入如下格式值，返回相对应的对应的数组格式的唯一人员
 * @param {JSON} data {dep_emp_id:x || off_id:x || dep_id:x}
 * @param {string} key 查出relation中间表时，获取相对应的键值（id）
 * @returns {Array} {json1,json2...} 
 */
let getProduct_DepEmps = promise.promisify(async function (data, key, cb) {
  try {
    let arr = [];
    let ret = await md.getRelation_product_dep({ body: data });
    let id_arr = [];
    for (let i = 0; i < ret.length; i++) {
      const val = ret[i];
      if (id_arr.indexOf(val[key]) < 0) {
        id_arr.push(val[key]);
      }
    }
    for (let i = 0; i < id_arr.length; i++) {
      const val = id_arr[i];
      let emp = await me.getEmp({ body: { emp_id: val } });
      arr.push(emp[0]);
    }
    cb(null, arr);
  } catch (err) {
    log.errLog(req);
    cb('error');
  }
})

/**
 * 传入ordertype的值，来判断tname的实际表名
 * @param {number} order_type 
 */
function getOrderTName(order_type) {
  let tName = "";
  if (order_type == 1) {
    tName = 'order1';
  } else if (order_type == 2) {
    tName = 'order2';
  } else {
    tName = 'order3';
  }
  return tName;
}
module.exports = md;