// 这个模块是用来封装与订单有关的东西
// 包括，商品，类型，流程，状态
let fs = require("fs");
let url = require("url");
let qs = require("querystring");
let queryOrder = require("./../db_mysql/queryOrder");
let otherOrder = require("./../db_mysql/otherOrder");
let queryEmp = require("./../db_mysql/queryEmp");
let otherEmp = require("./../db_mysql/otherEmp");
let async = require("async");
let momoent = require("moment");
let xlsx = require("node-xlsx");
let path = require("path");
let timer = require("./timer");
let promise = require('bluebird');
var debug = require("debug")("app:server");
let public = require("./../public/public");
const uploadFile = public.uploadFolde; // 后台修改上传图片文件的文件夹名字
const excelFile = public.excelFile;
const symbol = public.symbol;

const get = require('./../db_redis/get_redis');

module.exports = {
  // 前端
  // /**
  //  * 传入商品id，返回这个订单的流程与状态
  //  */
  // getFlowStateByPro_Id: async function (body, cb) {
  //   try {
  //     let obj = {
  //       tName: 'product',
  //       condi: 'and',
  //       limit: body.limit,
  //       product_id: product_id
  //     };
  //     let product = await get.myData(obj);
  //     let obj1 = {
  //       tName: 'flow',
  //       condi: 'and',
  //       flow_id: product[0].flow_id
  //     }
  //     this.getSortFlowState(obj1, cb);
  //   } catch (err) {
  //     cb('error');
  //   }
  // },

  /**
   * 通过商品id，删除对应的内勤
   */
  deleteOffPro: async function (body, cb) {
    try {
      let product_id = body.product_id;
      let obj = {
        tName: 'relation_product_dep',
        condi: 'and',
        product_id: product_id
      }
      await get.delete(obj);
      cb('success');
    } catch (err) {
      debug("删除商品对应的内勤错误");
      cb('error');
    }
  },
  /**
   * 通过商品id，查询与此商品相关联的内勤
   */
  getOffByProduct_id: async function (body, cb) {
    try {
      let product_id = body.product_id;
      let obj = {
        tName: 'relation_product_dep',
        condi: 'and',
        product_id: product_id
      }
      let office = await get.myData(obj);
      cb(JSON.stringify({ data: office }));
    } catch (err) {
      debug("查询商品对应的内勤错误");
      cb('error');
    }
  },
  /**
   * 通过商品id，内勤id，部门id，查询此内勤负责的业务
   */
  getProEmp: async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_product_dep',
        condi: 'and',
        product_id: body.product_id,
        off_id: body.off_id,
        dep_id: body.dep_id
      }
      let business = await get.myData(obj);
      cb(JSON.stringify({ data: business }));
    } catch (err) {
      debug("在通过商品id，内勤id，部门id查询内勤负责此部门的业务时错误");
      cb('error');
    }
  },
  /**
   * 传入商品id，部门id，内勤id，为内勤分配产品
   */
  allotProduct: async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_product_dep',
        condi: 'and',
        product_id: body.product_id,
        off_id: body.off_id,
        dep_id: body.dep_id,
      }
      // 查询之前与此商品相关联的内勤,然后删掉
      await get.delete(obj);
      let emp_id_arr = body.emp_id_arr;
      for (let i = 0; i < emp_id_arr.length; i++) {
        let dep_emp_id = emp_id_arr[i];
        obj[dep_emp_id] = dep_emp_id;
        await get.insert(obj);
      }
      cb('success')
    } catch (err) {
      debug("删除内勤商品对应业务错误");
      cb('error');
    }

  },
  // not do
  /**
   * 传入商品id以及订单id，创建这个商品的所有状态
   */
  createOrderFlow: async function (body, cb) {
    try {
      let obj2 = {
        tName: 'product',
        condi: 'and',
        product_id: body.product_id,
        order_id: Number(body.order_id),
      };
      let product = await get.myData(obj2);
      let flow_id = product[0].data.flow_id;
      let sortFlow = await getsortFlow(flow_id);
      let obj = {
        tName: 'relation_state_flow',
        condi: 'and',
      }
      for (let i = 0; i < sortFlow.length; i++) {
        obj.tName = 'relation_state_flow'
        obj.flow_detail_id = sortFlow[i].data.flow_detail_id;
        let state_detail_id_arr = await get.myData(obj);
        delete obj['flow_detail_id'];
        for (let j = 0; j < state_detail_id_arr.length; j++) {
          let maxId = await get.tbMaxId({ tName: 'relation_order_state', condi: 'and' }, 'relation_state_id');
          let obj3 = {
            tName: 'relation_order_state',
            condi: 'and',
            relation_state_id: maxId,
            order_id: Number(body.order_id),
            state_detail_id: state_detail_id_arr[j].data.state_detail_id,
          }
          // let data = await otherOrder.getBigRealtionOrder_id();
          // let keys = Object.keys(data[0]);
          // let relation_state_id = data[0][keys[0]];
          await get.insert(obj);
        }
      }
      cb('success');
    } catch (err) {
      debug("创建这个商品的所有状态错误");
      cb('error');
    }
  },
  // not update
  /**
   * 传入订单id，修改订单信息
   */
  updateOrder: async function (body, cb) {
    try {
      let order_id = body.or_id;
      let product_id = body.product_id;
      let channel_id = body.channel_id;
      let type = body.type;
      if (typeof type != "string" && type) {
        type = type.toString();
      }
      let inmoney = body.inmoney;
      let orderFile = body.orderFile;
      let clientName = body.clientName;
      let userComment = body.userComment; // 用户备注
      let obj = {
        tName: 'emp',
        condi: 'and',
        emp_id: channel_id
      };

      let emps = await get.myData(obj);
      let count = 0;
      while (count < 2) {
        if (count == 1) {
          await get.update(obj, { 'submitTime': new Date().toLocaleString() });
        } else if (count == 2) {
          let iiuv = emps[0].data.iiuv;
          if (iiuv) {
            let dep_emp = await get.myDataAndOrNot(obj, null, { 'type': 6 });
            let dep_emp_id;
            if (emps.length != 0) {
              dep_emp_id = dep_emp[0].data.emp_id;
            }
            let obj2 = {
              tName: 'relation_product_dep',
              condi: 'and',
              "product_id": product_id,
              "dep_emp_id": dep_emp_id
            }
            let office = await get.myData(obj2);
            let office_id;
            if (ret3.length != 0) {
              office_id = office[0].data.off_id;
            }

            await otherOrder.updateOrder(
              {
                type: type, business_id: dep_emp_id, office_id: office_id, product_id: product_id,
                channel_id: channel_id, clientName: clientName, inmoney: inmoney, orderFile: orderFile,
                userComment: userComment
              },
              [
                type, dep_emp_id, office_id, product_id, channel_id,
                clientName, inmoney, orderFile, userComment, order_id
              ]);
          } else {
            await otherOrder.updateOrder(
              {
                type: type, product_id: product_id, channel_id: channel_id, clientName: clientName,
                inmoney: inmoney, orderFile: orderFile, userComment: userComment
              },
              [
                type, product_id, channel_id, clientName, inmoney,
                orderFile, userComment, order_id
              ]);
          }
          cb('success');
        }
        count++;
      }
    } catch (err) {
      cb('error');
    }
  },
  // not update
  /**
   * 后台通过订单id直接删除订单功能
   */
  deleteOrder: async function (body, cb) {
    try {
      let order_id = body.order_id;
      await otherOrder.deleteOrderById([order_id]);
      cb('success');
    } catch (err) {
      cb('error');
    }
  },
  // not update
  // 此删除也无需完善，中间代码是用来验证是否需要删除的
  /**
   * 传入订单id删除此订单
   */
  deleteOrderById: async function (body, cb) {
    try {
      let order_arr = body.order_arr;
      order_arr = JSON.parse(order_arr);
      let count = 0; // 删除了几个订单
      for (let i = 0; i < order_arr.length; i++) {
        const order = order_arr[i];
        let order_id = order.order_id;
        let order_type = order.order_type;
        let oreders = await queryOrder.getOrder({ order_id: order_id }, [order_id]);
        if (oreders.length != 0) {
          let product_id = oreders[0].product_id;
          let channel_id = oreders[0].channel_id;
          let type = oreders[0].type;
          let inmoney = oreders[0].inmoney;
          let orderFile = oreders[0].orderFile;
          let clientName = oreders[0].clientName;
          if (order_type == "1") {
            // 订单
            if (product_id && channel_id && type && inmoney && orderFile && clientName) {
              continue;
            } else {
              await otherOrder.deleteOrderById([order_id]);
              count++;
            }
          } else if (order_type == "2") {
            // 询值
            if (product_id && channel_id && type && orderFile) {
              continue;
            } else {
              await otherOrder.deleteOrderById([order_id]);
              count++;
            }
          } else if (order_type == "3") {
            // 推荐
            if (channel_id && clientName && type && orderFile) {
              continue;
            } else {
              await otherOrder.deleteOrderById([order_id]);
              count++;
            }
          }
        }
      }
      cb(count.toString());
    } catch (err) {
      cb('error');
    }
  },
  // not update
  /**
   * 传入该角色id，部门id，以及内勤id来获得他权限下的所有未处理订单
   */
  getNoHandleOrders: async function (body, cb) {
    try {
      let otjs = {};
      let order_type = body.order_type
      let role_type = body.role_type;
      let userdep_id = body.userdep_id;
      let busoff_id = body.busoff_id;
      let orders = await queryOrder.getNoHandleOrders({ "role_type": role_type, "userdep_id": userdep_id, "busoff_id": busoff_id },
        { "order_state": 1, "order_type": order_type }, [1, order_type]);
      cb(ret.length + "");
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入材料id与具体材料id数组，指定中间表
   */
  updateFileType: async function (body, cb) {
    try {
      let file_type_id = body.file_type_id;
      let detail_file_type_id_arr = body.detail_file_type_id;
      if (typeof (detail_file_type_id_arr) != "object") {
        detail_file_type_id_arr = [detail_file_type_id_arr];
      }
      let obj = {
        tName: 'relation_file_type_detail',
        condi: 'and',
        file_type_id: file_type_id,
      }
      await get.delete(obj);
      for (let i = 0; i < detail_file_type_id_arr.length; i++) {
        const detail_file_type_id = detail_file_type_id_arr[i];
        obj.detail_file_type_id = detail_file_type_id;
        await get.insert(obj);
      }
      cb('success');
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入具体材料id，删除一个具体材料
   */
  deleteDetailFileType: async function (body, cb) {
    try {
      let detail_file_type_id = body.detail_file_type_id;
      let obj = {
        tName: 'relation_file_type_detail',
        condi: 'and',
        detail_file_type_id: detail_file_type_id,
      }
      let files = await get.myData(obj);
      if (files.length != 0) {
        cb("fileFail");
      } else {
        obj.tName = 'detail_file_type';
        await get.delete(obj);
        cb('success');
      }
    } catch (err) {
      cb('error');
    }
  },
  // 优化完毕
  /**
   * 传入材料表id，删除一个材料
   */
  deleteFileType: async function (body, cb) {
    try {
      let obj = {
        tName: 'product',
        condi: 'and',
        file_type_id: body.file_type_id,
      };

      let product = await get.myData(obj);
      if (product.length != 0) {
        cb("productFail");
      } else {
        obj.tName = 'file_types_num';
        await get.delete(obj);
        cb('success')
      }
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 创建申请材料
   */
  insertFileType: async function (body, cb) {
    try {
      let bus_name = body.bus_name;
      let maxId = await get.tbMaxId({ tName: 'file_types_num', condi: 'and' }, 'file_type_id');
      let obj = {
        tName: 'file_types_num',
        file_type_id: maxId,
        name: bus_name,
      }
      await get.insert(obj);
      cb('success')
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 创建具体的申请材料
   */
  insertDetailFileType: async function (body, cb) {
    try {
      let name_arr = body.name;
      let text_arr = body.text;
      if (typeof name_arr != "object") {
        name_arr = [name_arr];
      }
      if (typeof text_arr != "object") {
        text_arr = [text_arr];
      }
      let count = 0;
      let obj = {
        tName: 'detail_file_type',
      }
      for (let i = 0; i < name_arr.length; i++) {
        const name = name_arr[i];
        obj.detail_file_type_id = await get.tbMaxId({'tName':'detail_file_type',condi:'or'},'detail_file_type_id')
        obj.name = name;
        obj.text = text_arr[count++];
        await get.insert(obj);
      }
      cb('success');
    } catch (err) {
      cb('error');
    }
  },
  // 创建一个商品
  insertProduct: async function (req, cb) {
    try {
      let body = req.body;
      let name = body.name;
      let product_type_id = parseInt(body.product_type_id);
      let product = await otherOrder.insertProduct([name, product_type_id]);
      let product_id = product.insertId;
      req.body.product_id = product_id;
      this.updateProductInfo(req, cb);
    } catch (err) {
      cb('error');
    }
  },
  // 创建一个商品
  insertProductType: async function (req, cb) {
    try {
      let body = req.body;
      let product_type_name = body.product_type_name;
      await otherOrder.insertProductType([product_type_name]);
      cb('success');
    } catch (err) {
      cb('error');
    }
  },
  updateProductInfo: async function (req, cb) {
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
          let obj = {};
          obj.data = { product_id: product_id };
          obj.arr = [product_id];
          let product = queryOrder.getProduct(obj);
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
      let jsObj = {
        name: name, isNum: isNum, isBourse: isBourse, putaway: putaway, threeText: threeText,
        product_detail: product_detail, imgPath: imgPathDetail, imgPath2: imgPathDetail2, imgPathSmall: imgPathSmall,
        flow_id: flow_id, file_type_id: file_type_id, product_intro: product_intro
      };
      let arr = [name, isNum, isBourse, putaway, threeText, product_detail, imgPathDetail,
        imgPathDetail2, imgPathSmall, flow_id, file_type_id, product_intro, product_id];
      await otherOrder.updateProductInfo(jsObj, arr);
      cb('success');
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得file_type表的id与name
   */
  getFile_typeNameId: async function (body, cb) {
    try {
      let file_types = await queryOrder.getFile_typeNameId({}, []);
      cb(JSON.stringify({ data: file_types }));
    } catch (err) {
      cb('error');
    }

  },
  /**
   * 无须传入数据，获得flow表的id与name
   */
  getFlowNameId: async function (body, cb) {
    try {
      let flows = await queryOrder.getFlowNameId({}, []);
      cb(JSON.stringify({ data: flows }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 多表查询
   * 传入具体的文件类型数表id，查询出对应的数据条数，以及名字，id
   */
  getDetailFile_types: async function (body, cb) {
    try {
      let file_type_id = body.file_type_id;
      let data = await queryOrder.getDetailFile_types([file_type_id]);
      cb(JSON.stringify({ data: data }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 查询所有的文件类型
   */
  getDetailFileType: async function (body, cb) {
    try {
      let data = await queryOrder.getDetailFileType();
      cb(JSON.stringify({ data: data }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入流程id
   * 得到具体的各个流程与各个状态
   */
  getSortFlowState: async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_state_flow',
        condi: 'and',
      };
      let sortFlows = await getsortFlow(body.flow_id);
      let state_details_arr = [];
      // 遍历多个具体的流程信息，获得每个具体流程下对应的多个具体状态信息
      for (let i = 0; i < sortFlows.length; i++) {
        obj.tName = 'relation_state_flow'
        let state_details = [];   // 一个具体流程，对应的多个具体状态
        obj.flow_detail_id = sortFlows[i].data.flow_detail_id;
        let state_detail_id_arr = await get.myData(obj);
        delete obj['flow_detail_id'];
        for (let j = 0; j < state_detail_id_arr.length; j++) {
          obj.state_detail_id = state_detail_id_arr[j].data.state_detail_id;
          obj.tName = 'state_detail';
          let state_detail = await get.myData(obj);
          state_details.push(state_detail[0].data);
          delete obj['state_detail_id'];
        }
        state_details_arr.push(state_details);
      }
      cb(JSON.stringify({ data: [sortFlows, state_details_arr] }));
    } catch (err) {
      cb('error');
    }
  },
  getFlowByFlow_detail_id: async function (body, cb) {
    try {
      let flow_detail_id = body.flow_detail_id;
      let flows = await queryOrder.getFlow({ flow_detail_id: flow_detail_id }, [flow_detail_id]);
      cb(JSON.stringify({ data: flows }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得符合条件的订单信息
   * 传入不同订单信息,返回筛选后的订单，
   * 返回json字符串格式{ "result": result }
   */
  getOrders: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let appli_id = body.appli_id;
      let type = body.type;
      let channel_id = body.channel_id;
      let business_id = body.business_id;
      let office_id = body.office_id;
      let order_type = body.order_type;

      let limit = body.limit;
      let role_type = body.role_type;
      let userdep_id = body.userdep_id;
      let busoff_id = body.busoff_id;

      let jsonObj = {
        order_id: order_id,
        appli_id: appli_id,
        type: type,
        channel_id: channel_id,
        business_id: business_id,
        office_id: office_id,
        order_type: order_type
      };
      let arr = [
        order_id,
        appli_id,
        type,
        channel_id,
        business_id,
        office_id,
        order_type
      ];
      let otjs = {
        limit: limit,
        role_type: role_type,
        userdep_id: userdep_id,
        busoff_id: busoff_id
      };
      let splits = await queryOrder.getOrderSplitPage(otjs, jsonObj, arr);
      cb(JSON.stringify({ result: splits }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入商品id
   * 获得此id所对应的产品
   */
  getProductById: async function (body, cb) {
    try {
      let obj = {};
      let product_id = body.product_id;
      let product_type_id = body.product_type_id;
      let putaway = body.putaway;
      let isNum = body.isNum;
      obj.data = { product_id: product_id, isNum: isNum, product_type_id: product_type_id };
      obj.arr = [product_id, isNum, product_type_id];
      let products = await queryOrder.getProduct(obj);
      cb(JSON.stringify({ data: products }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得是否询值的产品，以及什么类型（房贷or车贷）的以及房贷或评估所产品
   */
  getProductByOther: async function (body, cb) {
    try {
      let obj = {};
      let isNum = body.isNum;
      let isBourse = body.isBourse;
      let putaway = body.putaway;
      let product_type_id = body.product_type_id;
      obj.data = { isNum: isNum, isBourse: isBourse, putaway: putaway, product_type_id: product_type_id };
      obj.arr = [isNum, isBourse, putaway, product_type_id];
      let products = await queryOrder.getProduct(obj);
      cb(JSON.stringify({ data: products }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入商品类别id
   * 获得同类别的所有商品
   */
  getProductsByTypeId: async function (body, cb) {

    try {
      let obj = {};
      let product_type_id = body.product_type_id;
      let isNum = body.isNum;
      obj.data = { "product_type_id": product_type_id, "isNum": isNum };
      obj.arr = [product_type_id, isNum];
      obj.limit = body.limit;
      let products = await queryOrder.getProduct(obj);
      cb(JSON.stringify({ data: products }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得不是申请订单的订单
   */
  getNotAppliOrders: async function (body, cb) {
    try {
      let appli_id = body.appli_id;
      if (appli_id) {
        let orders = await otherOrder.getNotAppliOrdersById([appli_id]);
        cb(JSON.stringify({ result: orders }));
      } else {
        let orders = await otherOrder.getNotAppliOrders([]);
        cb(JSON.stringify({ result: orders }));
      }
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得所有的产品类型
   * 返回用json.stringy()转换后的json字符串格式 result
   */
  getProductTypes: async function (body, cb) {
    try {
      let pType = await queryOrder.getProductType({}, []);
      cb(JSON.stringify(pType));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入订单id,order_id，返回所有对应状态
   */
  getOrderStateByOrder_id: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let oStates = await queryOrder.getOrderState({ order_id: order_id }, [order_id]);
      cb(JSON.stringify({ data: oStates }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 获得这张订单的所有信息
   */
  // 这个用异步更快，所以无需更改为同步
  getAllOrderInfo: function (body, cb) {
    let arr = [];
    let t = this;
    async.parallel([
      function (cb2) {
        t.getFlowStateByPro_Id(body).then((ret) => {
          let data = JSON.parse(ret).data;
          arr.push({ allFlowState: data });
          cb2();
        });
      },
      function (cb2) {
        t.getOrderStateByOrder_id(body).then((ret) => {
          let data = JSON.parse(ret).data;
          getTime2(data, rt => {
            arr.push({ allState: rt });
            cb2();
          });
        });
      },
      function (cb2) {
        t.getFlow(body).then((ret) => {
          let data = JSON.parse(ret).result[3];
          getTime2(data, rt => {
            arr.push({ flowTime: rt });
            cb2();
          });
        });
      }],
      function (err) {
        cb(JSON.stringify({ data: arr }));
      }
    );
  },

  /**
   * 传入订单与状态中间表的id，
   * 返回具体的流程的字符串值
   */
  getStates: async function (body, cb) {
    try {
      let relation_state_id = body.state_id;
      let oStates = await queryOrder.getOrderState({ relation_state_id: relation_state_id }, [relation_state_id]);
      let state_detail_id = oStates[0].state_detail_id;
      let sDetal = await queryOrder.getStateDetail({ state_detail_id: state_detail_id }, [state_detail_id]);
      let state_name = sDetal[0].state_name;
      cb(state_name);
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入订单编号，
   * 返回流程id，大流程对应各小流程的时间，订单id, 返回json字符串格式{ "result": [flow_id,[t1,t2,t3...],order_id] }
   */
  getFlow: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let orders = await queryOrder.getOrder({ order_id: order_id }, [order_id]);
      let obj = {};
      let product_id = orders[0].product_id;
      let flowState = orders[0].flowState;
      obj.data = { product_id: product_id };
      obj.arr = [product_id];
      let products = await queryOrder.getProduct(obj);
      let flow_id = products[0].flow_id;
      let flows = await queryOrder.getSortFlows([flow_id]);
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
        let stateFlow = await queryOrder.getStateFlow({ flow_detail_id: flow_detail_id }, [flow_detail_id]);
        let state_detail_id;
        if (stateFlow[0]) {
          state_detail_id = stateFlow[0].state_detail_id;
        }
        let oState = await queryOrder.getOrderState({ order_id: order_id, state_detail_id: state_detail_id }, [order_id, state_detail_id]);
        arr2.push(oState[0]);
      }
      arr.push(flow_id);
      arr.push(order_id);
      arr.push(flows);
      arr.push(arr2);
      arr.push(count2);
      cb(JSON.stringify({ result: arr }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入订单id，以及当前订单对应的流程ID
   * 返回这个订单，当前流程的id值，以及流程按leavl级别升序排序的所有数据
   */
  getState: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let flow_id = body.flow_id;
      let orders = await queryOrder.getOrder({ order_id: order_id }, [order_id]);
      if (orders[0].flowState) {
        cb(orders[0].flowState);
      } else {
        cb("");
      }
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入具体流程，flow_detail_id
   * 返回栏值所对应的流程的字符串值以及各个状态，json字符串格式{ "result": [[object,object...],string] }
   */
  getStatess: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let flow_detail_id = body.flow_id;
      let flows = await queryOrder.getFlow({ flow_detail_id: flow_detail_id }, [flow_detail_id]);
      let flow_name = flows[0].flow_name;
      let sortSates = await queryOrder.getSortStates([flow_detail_id]);
      let arr1 = [];
      let arr2 = [];
      for (let i = 0; i < sortSates.length; i++) {
        const rst = sortSates[i];
        let state_detail_id = rst.state_detail_id;
        let oState = await queryOrder.getOrderState({ state_detail_id: state_detail_id, order_id: order_id }, [state_detail_id, order_id]);
        arr1.push(oState[0]);
        let sDetal = await queryOrder.getStateDetail({ state_detail_id: state_detail_id }, [state_detail_id]);
        arr2.push(sDetal[0]);
      }
      cb(JSON.stringify({ result: [arr1, arr2, flow_name] }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 无须传入数据
   * 获得总利润的值以及count订单尾号的值
   */
  getProfit: async function (cb) {
    try {
      let profit = await queryOrder.getProfit();
      cb(JSON.stringify({ data: profit }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 无须传入东西，创建一个空订单，返回订单id,json格式
   */
  createOrder: async function (body, cb) {
    try {
      let order_type = body.order_type;
      if (typeof order_type != "string" && order_type) {
        order_type = order_type.toString();
      }
      let appli_id = body.appli_id;
      appli_id = addZero(appli_id);
      let appliTime = new Date();
      let bigOId = await otherOrder.getBigOrder_id();
      let keys = Object.keys(bigOId[0]);
      let order_id = bigOId[0][keys[0]];
      let newOrder = await otherOrder.createEmptyOrder([++order_id, appli_id, appliTime, order_type]);
      cb(JSON.stringify({ data: newOrder.insertId }));
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入创建流程所需要的数据
   * 创建一个完整的流程
   */
  createFlow: async function (body, cb) {
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
      let arr = [];
      arr.push(detail_flow_name[i]);
      arr.push(parseInt(flow_leavl[i]));
      flow_arr.push(arr);
    }

    let state_arr = [];
    for (let i = 0; i < state_leavl.length; i++) {
      let arr = [];
      arr.push(detail_state_name[i]);
      arr.push(parseInt(state_leavl[i]));
      state_arr.push(arr);
    }
    let flow_id;
    let detail_flow_id_arr = [];
    let detail_state_id_arr = [];

    // 这个for循环是用来将对应的具体状态的等级，拼接在一起.拼接格式为 [[detail_state_name, leavl], [detail_state_name, leavl], ......]
    async.parallel([
      function (cb2) {
        (async function () {
          try {
            let flow = await otherOrder.insertFlow([flow_name]);
            flow_id = flow.insertId;
            cb2(null, 1);
          } catch (err) {
            cb('error');
          }
        })();
      },
      function (cb2) {
        (async function () {
          for (let i = 0; i < flow_arr.length; i++) {
            const arr = flow_arr[i];
            try {
              let order = await otherOrder.insertDetailFlow(arr);
              let detail_flow_id = order.insertId;
              detail_flow_id_arr.push(detail_flow_id);
            } catch (err) {
              cb('error');
            }
          }
          cb2(null, 2);
        })();
      },
      function (cb2) {
        (async function () {
          for (let i = 0; i < state_arr.length; i++) {
            const arr = state_arr[i];
            if (arr[0] != "0") {
              let sDetail = await otherOrder.insertDetailState(arr);
              let detail_state_id = sDetail.insertId;
              detail_state_id_arr.push(detail_state_id);
            } else {
              detail_state_id_arr.push(null);
            }
          }
          cb2(null, 3);
        })();
      }
    ]), function (err) {
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
            let rFlows = await otherOrder.insertRelationFlow([flow_id, detail_flow_id]);
            for (let j = 0; j < arr[count].length; j++) {
              const detail_state_id = arr[count];
              await otherOrder.insertRelationState([detail_flow_id, detail_state_id]);
              count++;
            }
          }
          cb('success');
        } catch (err) {
          cb('error')
        }
      })()
    }
  },

  // 搞定！！！！！！即数据库用了触发器
  /**
   * 传入流程id，flow_id，查看流程中间表，是否有与此对应的值
   * 数据库出现错误返回error，存在关联不能删除返回fail，可以删除就返回success
   */
  deleteFlow: async function (body, cb) {
    let obj = {};
    let flow_id = body.flow_id;
    let flow_arr;
    let state_arr;
    obj.data = { flow_id: flow_id };
    obj.arr = [flow_id];
    let products = await queryOrder.getProduct(obj);
    if (products.length != 0) {
      cb("productFail");
    } else {
      let sFlows = await queryOrder.getSortFlows([flow_id]);
      async.each(sFlows, function (rt1, cb2) {
        (async function () {
          try {
            let flow_detail_id = rt1.flow_detail_id;
            let states = await queryOrder.getSortStates([flow_detail_id]);
            state_arr = states;
            async.each(states, function (rt2, cb3) {
              (async function () {
                try {
                  let state_detail_id = rt2.state_detail_id;
                  let oState = await queryOrder.getOrderState({ state_detail_id: state_detail_id }, [state_detail_id]);
                  if (oState.length != 0) {
                    cb("orderFail");
                  } else {
                    cb3();
                  }
                } catch (err) {
                  cb('error')
                }
              })()
            }, function (err) {
              cb2();
            })
          } catch (err) {
            cb('error');
          }
        })()
      }, function (err) {
        cb('success');
      })
    }
  },
  // 此删除无须更改。
  /**
   * 根据传入的商品id，删除此商品
   */
  deleteProduct: async function (body, cb) {
    try {
      let product_id = body.product_id;
      let orders = await queryOrder.getOrder({ product_id: product_id }, [product_id]);
      if (ret.length != 0) {
        cb("orderFail");
      } else {
        let obj = {};
        obj.data = { product_id: product_id };
        obj.arr = [product_id];
        let products = await queryOrder.getProduct(obj);
        let agoImgPath = products[0].imgPath;
        deleteFile(agoImgPath);
        agoImgPath = products[0].imgPathSmall;
        deleteFile(agoImgPath);
        await otherOrder.deleteProduct([product_id]);
        cb("success");
      }
    } catch (err) {
      cb('error');
    }
  },
  /**
   * 传入大状态与订单id，修改他的大状态
   */
  setOrder_state: async function (body, cb) {
    try {
      let order_state = body.order_state;
      let order_id = body.order_id;
      let oState = await otherOrder.setOrder_state([order_state, order_id]);
      cb("success");
    } catch (err) {
      cb("error");
    }
  },
  /**
   * 传入还款状态1和2，修改还款状态
   */
  setRefund_state: async function (body, cb) {
    try {
      let refund = body.refund;
      let order_id = body.order_id;
      await otherOrder.setRefund_state([refund, order_id]);
      cb("success");
    } catch (err) {
      cb("error");
    }
  },

  /**
   * 传入order_id以及状态id，state_detail_id和失败原因failReason将
   * 修改订单与状态中间表的失败原因
   */
  setFailReason: async function (body, cb) {
    try {
      let order_id = body.order_id;
      let failReason = body.failReason;
      if (failReason == "") {
        failReason = null;
      }
      await otherOrder.setFailReason([failReason, order_id]);
      if (failReason && failReason != "") {
        this.setOrder_state({ order_state: 4, order_id: order_id }, cb);
      } else {
        this.setOrder_state({ order_state: 2, order_id: order_id }, cb);
      }
    } catch (err) {
      cb('error');
    }
  },

  /**
   * 传入要修改的总利润的值
   * 修改总利润的值
   */
  updateProfit: async function (body, cb) {
    try {
      let profit = body.profit;
      await otherOrder.updateProfit([profit]);
      cb('error');
    } catch (err) {
      cb("success");
    }
  },
  /**
   * 传入状态表id，state_detail_id与订单id,order_id,和时间time
   * 返回success或error
   */
  setState: async function (body, cb) {
    try {
      let state_detail_id = body.state_detail_id;
      let order_id = body.order_id;
      let time = body.time;
      await otherOrder.setStateTime([time, order_id, state_detail_id]);
      let oState = await queryOrder.getOrderState({ state_detail_id: state_detail_id, order_id: order_id }, [state_detail_id, order_id]);
      let relation_state_id = oState[0].relation_state_id;
      await otherOrder.setState([relation_state_id, order_id]);
      cb("success");
    } catch (err) {
      cb("error");
    }
  },
  /**
   * 设置此订单流程对应的时间
   * 传入流程id，flow_id,与订单id，order_id与栏值，以及中间表流程对应的事件，flow_time
   * 把对应的订单的申请流程id修改为当前流程
   * 返回success或error
   */
  setFlowTime: async function (body, cb) {
    try {
      let flow_detail_id = body.flow_detail_id;
      let order_id = body.order_id;
      let flow_time = body.flow_time;
      await otherOrder.updateOrder({ flowState: flow_detail_id }, [flow_detail_id, order_id]);
      let sFlows = await queryOrder.getStateFlow({ flow_detail_id: flow_detail_id }, [flow_detail_id]);
      for (let i = 0; i < sFlows.length; i++) {
        const rt = sFlows[i];
        let state_detail_id = rt.state_detail_id;
        await otherOrder.setFlowTime([flow_time, order_id, state_detail_id]);
      }
      cb("success");
    } catch (err) {
      cb("error");
    }
  },
  /**
   * 传入订单id，以及字段名，以及要修改的内容
   */
  updateOneOrder: async function (body, cb) {
    try {
      let name = body.name[0];
      let val = body.name[1];
      let order_id = body.order_id;
      await otherOrder.updateOneOrder(name, [val, order_id]);
      cb("success");
    } catch (err) {
      cb("error");
    }
  },

  screenOrder: function (body, cb2) {
    let userdep_id = body.userdep_id;
    let role_type = body.role_type;
    let emp_id = body.emp_id;
    async.parallel({
      type: function (cb) {
        // 获取筛选的所有类型
        (async function () {
          try {
            let result = await queryOrder.getProductType({}, []);
            cb(null, result);
          } catch (err) {
            cb2('error')
          }
        })()
      }, channel: function (cb) {

        (async function () {
          try {
            let arr = [];
            if (role_type == 3) {
              if (userdep_id) {
                let ret = await queryEmp.getEmpIdAndName({ type: "5", dep_id: userdep_id }, [5, userdep_id]);
                async.each(ret, function (rt, cb3) {
                  (async function () {
                    try {
                      let iiuv = rt.iiuv;
                      let ret2 = await queryEmp.getDepUsers([iiuv, 6]);
                      if (ret2.length != 0) {
                        arr = arr.concat(ret2)
                      }
                      cb3();
                    } catch (err) {
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
              let off_busName = await queryEmp.getOffBusName([emp_id]);
              async.each(off_busName, function (rt, cb3) {
                let iiuv = rt.iiuv;
                (async function () {
                  try {
                    let ret2 = await queryEmp.getDepUsers([iiuv, 6]);
                    if (ret2.length != 0) {
                      arr = arr.concat(ret2)
                    }
                    cb3();
                  } catch (err) {
                    cb2('error');
                  }
                })();
              }, function (err) {
                cb(null, arr);
              })
            } else if (role_type == 5) {
              let obj = {};
              obj.data = { emp_id: emp_id };
              obj.arr = [emp_id];
              let emps = await queryEmp.getEmp(obj);
              let iiuv = emps[0].iiuv;
              let users = await queryEmp.getDepUsers([iiuv, 6]);
              cb(null, users)
            } else {
              // 获取筛选的所有渠道
              let result = await queryEmp.getEmpIdAndName({ type: "6" }, [6]);
              cb(null, result);
            }
          } catch (err) {
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
                let ret = await queryEmp.getEmpIdAndName({ type: "5", dep_id: userdep_id }, [5, userdep_id]);
                cb(null, ret);
              } else {
                cb(null, [])
              };
            } else if (role_type == 4) {
              let ret = await queryEmp.getOffBusName([emp_id]);
              cb(null, ret)
            } else if (role_type == 5) {
              let ret = await queryEmp.getEmpIdAndName({ type: "5", "emp_id": emp_id }, [5, emp_id]);
              cb(null, ret)
            } else {
              let ret = await queryEmp.getEmpIdAndName({ type: "5" }, [5]);
              cb(null, ret);
            }
          } catch (err) {
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
                let rets = queryEmp.getEmpIdAndName({ type: "5", dep_id: userdep_id }, [5, userdep_id]);
                let arr2 = [];
                async.each(rets, function (rts, callback) {
                  (async function () {
                    try {
                      let dep_emp_id = rts.emp_id;
                      let ret = queryEmp.getBusNameId([dep_emp_id]);
                      if (ret.length != 0) {
                        arr = arr.concat(ret);
                      }
                      callback();
                    } catch (err) {
                      cb2('error');
                    }
                  })()
                }, function (err) {
                  let flag = true;
                  for (let i = 0; i < arr.length; i++) {
                    let emp_id1 = arr[i].emp_id;
                    if (arr2.length == 0) {
                      arr2.push(arr[i])
                    } else {
                      // 默认没有和其一样的值
                      let flag = false;
                      for (let j = 0; j < arr2.length; j++) {
                        let emp_id2 = arr2[j].emp_id;
                        if (emp_id2 == emp_id1) {
                          // 相等，那么就有不需要加入
                          flag = true;
                          break;
                        }
                      }
                      if (!flag) {
                        arr2.push(arr[i])
                      } else {
                        continue;
                      }
                    }
                  }
                  cb(null, arr2)
                })
              } else {
                cb(null, []);
              }
            } else if (role_type == 4) {
              let ret = await queryEmp.getEmpIdAndName({ type: "4", "emp_id": emp_id });
              cb(null, ret);
            } else if (role_type == 5) {
              let ret = await queryEmp.getBusNameId([emp_id]);
              let arr2 = [];
              for (let i = 0; i < ret.length; i++) {
                let emp_id1 = ret[i].emp_id;
                if (arr2.length == 0) {
                  arr2.push(ret[i])
                } else {
                  // 默认没有和其一样的值
                  let flag = false;
                  for (let j = 0; j < arr2.length; j++) {
                    let emp_id2 = arr2[j].emp_id;
                    if (emp_id2 == emp_id1) {
                      // 相等，那么就有不需要加入
                      flag = true;
                      break;
                    }
                  }
                  if (!flag) {
                    arr2.push(ret[i])
                  } else {
                    continue;
                  }
                }
              }
              cb(null, arr2);
            } else {
              // 获取筛选的所有内勤
              let result = await queryEmp.getEmpIdAndName({ type: "4" }, [4]);
              cb(null, result);
            }
          } catch (err) {
            cb2('error')
          }
        })()
      },
      dep: function (cb) {
        // 获取筛选的所有部门
        (async function () {
          try {
            let ret = await queryEmp.getDep("", []);
            cb(null, ret);
          } catch (err) {
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
  screen: async function (body, cb) {
    let dep_id = body.dep_id; // 部门id
    let order_type = body.order_type; // 订单类型
    let type = body.type; // 商品类型
    let channel_id = body.channel_id; // 渠道id（用户id）
    let business_id = body.business_id; // 业务id
    let office_id = body.office_id; // 内勤id
    let order_state = body.order_state; // 内勤id
    let time1 = body.time1; // 起始时间
    let timeType = body.timeType; // 申请时间还是放款时间

    let limit = body.limit; // 分页
    let role_type = body.role_type;
    let userdep_id = body.userdep_id;
    let busoff_id = body.busoff_id;

    if (time1) {
      time1 = time1.toString();
    }
    let time2 = body.time2; // 结束时间
    if (time2) {
      time2 = time2.toString();
    }
    let otjs = {
      limit: limit, dep_id: dep_id, timeType: timeType, role_type: role_type,
      userdep_id: userdep_id, busoff_id: busoff_id
    };
    try {
      if (dep_id) {
        let jsBody = {
          order_type: order_type, type: type, channel_id: channel_id, business_id: "",
          office_id: office_id, order_state: order_state, time1: time1, time2: time2
        };
        let arr = [order_type, type, channel_id, business_id, office_id, order_state, time1, time2];
        if (role_type != 3) {
          arr.push(dep_id);
        }
        let splits = await queryOrder.getScreenOrderSplitPage(otjs, jsBody, arr);
        cb(JSON.stringify({ result: result }));
      } else {
        let jsBody = {
          order_type: order_type, type: type, channel_id: channel_id, business_id: business_id,
          office_id: office_id, order_state: order_state, time1: time1, time2: time2
        };
        let result = await queryOrder.getScreenOrderSplitPage(otjs, jsBody, [order_type, type, channel_id, business_id,
          office_id, order_state, time1, time2]);
        let arr = [];
        async.each(result, function (rt, cb3) {
          (async function () {
            try {
              let obj = {};
              let business_id = rt.business_id;
              obj.data = { emp_id: business_id };
              obj.arr = [business_id];
              let emps = await queryEmp.getEmp(obj);
              if (ret.length != 0) {
                rt.dep_id = ret[0].dep_id;
              }
              arr.push(rt);
              cb3();
            } catch (err) {
              cb('error');
            }
          })();
        }, function (err) {
          cb(JSON.stringify({ result: arr }))
        })
      }
    } catch (err) {
      cb('error');
    }
  },
  //写入excel表格
  /**
   * @param {Object} results  results[json对象，json对象]
   * @param {any} callback    callback("true或者false") true写入成功，false写入失败
   */
  writeExcel: function (results, callback) {
    let arrStr = public.outputTitleArrOrder;
    let data = [arrStr];
    // fs.writeFileSync('b.xlsx', buffer, 'binary');
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      let keys = Object.keys(result);
      let arr = [];
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        let time;
        switch (k) {
          case "emp_id":
            cb2();
            break;
          case "relation_state_id":
            getState(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "flowState":
            getFlow(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "product_id":
            getProduct(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "order_state":
            getOrderState(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "seeTime":
            time = Date.parse(new Date(result[k]));
            getTime(time, rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "loanTime":
            time = Date.parse(new Date(result[k]));
            getTime(time, rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "type":
            getType(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "failReason":
            set_br_n(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "empComment":
            set_br_n(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "userComment":
            set_br_n(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "appliTime":
            time = Date.parse(new Date(result[k]));
            getTime(time, rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "order_type":
            cb2();
            break;
          case "channel_id":
            getEmpName(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "office_id":
            getEmpName(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "business_id":
            getEmpName(result[k], rt => {
              arr.push(rt);
              cb2();
            });
            break;
          case "card_name":
            arr.push(result[k]);
            cb2("over");
            break;
          default:
            arr.push(result[k]);
            cb2();
        }
      }
    }
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      let keys = Object.keys(result);
      let arr = [];
      for (let j = 0; j < keys.length; j++) {
        const k = keys[j];
        data.push(arr);
      }
    }
    let buffer = xlsx.build([{ name: "sheet1", data: data }]);
    let timeStr = new Date().getTime();
    let pathStr = path.join(__dirname, "../public/" + excelFile + "/" + timeStr + ".xlsx");
    fs.writeFile(pathStr, buffer, "binary", function (err) {
      if (err) {
        callback("false", null);
      } else {
        timer.deleteExcel(pathStr);
        callback("true", pathStr);
      }
    });
  },
  /**
   * 为total_profit表中的count赋值，也就是订单编号尾数
   */
  setCount: async function (body, cb) {
    try {
      let count = body.count;
      let counts = await otherOrder.updateCount([count]);
      cb(null, "success");
    } catch (err) {
      cb(null, "error");
    }
  }
};

function set_br_n(text, cb) {
  let str = "";
  if (text) {
    let arr = text.split("&br");
    for (let i = 0; i < arr.length; i++) {
      str += arr[i];
    }
    cb(str);
  } else {
    cb("暂无");
  }
}
function splitOrderFile(fileStr, cb) {
  let ax = "";
  async.each(fileStr, function (file, cb2) {
    ax += public.path + public.httpport + "/" + file + ";";
    cb2();
  }, function (err) {
    cb(ax);
  }
  );
}

// 处理订单输出excel的方法
// 获得员工的名字
async function getEmpName(emp_id, cb) {
  try {
    if (emp_id && emp_id != "") {
      let obj = {};
      obj.data = { emp_id: emp_id };
      obj.arr = [emp_id];
      let rst = await queryEmp.getEmp(obj);
      if (rst[0].name) {
        cb(rst[0].name);
      } else {
        cb("暂无");
      }
    } else {
      cb("暂无");
    }
  } catch (err) {
    cb('error');
  }
}
// 获得订单的流程
async function getFlow(flow_detail_id, cb) {
  try {
    if (flow_detail_id) {
      let flows = await queryOrder.getFlow({ flow_detail_id: flow_detail_id }, [flow_detail_id]);
      let flow = ret[0].flow_name;
      cb(flow);
    } else {
      cb("暂无");
    }
  } catch (err) {
    cb("error");
  }
}
// 获得订单的状态
async function getState(relation_state_id, cb) {
  try {
    if (relation_state_id) {
      let result = await queryOrder.getOrderState({ relation_state_id: relation_state_id }, [relation_state_id]);
      let state_state_id = result[0].state_state_id;
      let rst = await queryOrder.getStateDetail({ state_state_id: state_state_id }, [state_state_id]);
      let state = rst[0].state_name;
      if (state) {
        cb(state);
      } else {
        cb("暂无");
      }
    } else {
      cb("暂无");
    }
  } catch (err) {
    cb('error');
  }
}
// 获得商品的名字
async function getProduct(product_id, cb) {
  try {
    if (product_id && product_id != "") {
      let obj = {};
      obj.data = { product_id: product_id };
      obj.arr = [product_id];
      let rst = await queryOrder.getProduct(obj);
      if (rst[0].name) {
        cb(rst[0].name);
      } else {
        cb("暂无");
      }
    } else {
      cb("暂无");
    }
  } catch (err) {
    cb('error');
  }
}
// 获得商品的类别名字
async function getType(type, cb) {
  try {
    let pType = await queryOrder.getProductType({ product_type_id: type }, [type]);
    if (rst[0].name) {
      cb(rst[0].name);
    } else {
      cb("暂无");
    }
  } catch (err) {
    cb('error');
  }
}

// 订单的流程的时间
function getTime2(ret, cb) {
  for (let i = 0; i < ret.length; i++) {
    const rt = ret[i];
    let state_time = rt.state_time;
    let flow_time = rt.flow_time;
    if (state_time) {
      rt.state_time = timestampToTime2(state_time);
    }
    if (flow_time) {
      rt.flow_time = timestampToTime2(flow_time);
    }

  }
  cb(ret);
}
function timestampToTime2(timestamp, cb) {
  let text = null;
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate();
  if (D < 10) {
    D = "0" + D + " ";
  } else {
    D = D + " ";
  }
  h = date.getHours();
  if (h < 10) {
    h = "0" + h + ":";
  } else {
    h = h + ":";
  }
  m = date.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  text = Y + M + D + h + m;
  return text;
}
function getTime(timestamp, cb) {
  let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  Y = date.getFullYear() + "-";
  M =
    (date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1) + "-";
  D = date.getDate();
  if (D < 10) {
    D = "0" + D + " ";
  } else {
    D = D + " ";
  }
  h = date.getHours();
  if (h < 10) {
    h = "0" + h + ":";
  } else {
    h = h + ":";
  }
  m = date.getMinutes();
  if (m < 10) {
    m = "0" + m;
  }
  if (Y + M + D + h + m) {
    cb(Y + M + D + h + m);
  } else {
    cb("暂无");
  }
}
// 得到实际订单状态，那5个成功失败的
function getOrderState(num, cb) {
  let text = "";
  if (num == 1) {
    text = "申请中";
  } else if (num == 2) {
    text = "审核中";
  } else if (num == 3) {
    text = "通过";
  } else if (num == 4) {
    text = "失败";
  } else if (num == 5) {
    text = "撤销";
  }
  cb(text);
}
// 判断文件路径是否存在，如果存在将这个路径删除掉
function deleteFile(imgAgoPath) {
  if (imgAgoPath) {
    let pathStr = path.join(
      __dirname,
      "../public/" + uploadFile + "/" + imgAgoPath
    );
    if (fs.existsSync(pathStr)) {
      fs.unlinkSync(pathStr);
    }
  }
}
// 数位不够加0,生成订单编号
function addZero(num) {
  let tm = Date.now();
  tm = momoent(tm).format("YYYYMMDD");
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


/**
 * 根据传入的key，来相对应的对数组中的所有json对象排序
 * 并将传入的jsStr拼接到每一个json对象中
 * @param {Array} arr 
 * @param {string} key
 * @param {Json} jsStr
 */
function sortArrAsc(arr, key, jsStr) {
  var i = arr.length, j;
  var tempExchangVal;
  while (i > 0) {
    for (j = 0; j < i - 1; j++) {
      if (arr[j][key] > arr[j + 1][key]) {
        tempExchangVal = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = tempExchangVal;
      }
    }
    i--;
  }
  for (let i = 0; i < arr.length; i++) {
    const jsStr2 = arr[i];
    arr[i] = concat(jsStr2, jsStr);
  }
  return arr;
}
/**
 * 传入两个json对象，将其合并为一个
 */
function concat(jsonbject1, jsonbject2) {
  var resultJsonObject = {};
  for (var attr in jsonbject1) {
    resultJsonObject[attr] = jsonbject1[attr];
  }
  for (var attr in jsonbject2) {
    resultJsonObject[attr] = jsonbject2[attr];
  }
  return resultJsonObject;
}
/**
 * 传入flow_id，flow_detail与relation_flow_detail多表排序查询
 */
let getsortFlow = promise.promisify(async function (flow_id, cb) {
  try {
    let obj = {
      tName: 'flow',
      condi: 'and',
      limit: null,
      flow_id: flow_id
    };
    // 通过flow_id获得获得流程的信息（流程表）
    let flows = await get.myData(obj);
    obj.tName = 'relation_flow_detail';
    // 通过flow_id获得流程对应的多个具体流程（中间表）
    let rFlow_details = await get.myData(obj);
    obj.tName = 'flow_detail';
    let flow_details_arr = [];
    delete obj['flow_id'];
    // 获得具体流程的信息，并与流程信息拼接在一起
    for (let i = 0; i < rFlow_details.length; i++) {
      obj.flow_detail_id = rFlow_details[i].data.flow_detail_id;
      let data = await get.myData(obj)
      flow_details_arr.push(data[0]);
    }
    // 排序
    let sortFlows = sortArrAsc(flow_details_arr, 'leavl', flows[0].data);
    cb(null, sortFlows);
  } catch (err) {
    cb('error');
  }
})