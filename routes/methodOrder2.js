// 这个模块是用来封装与订单有关的东西
// 包括，商品，类型，流程，状态
const fs = require("fs");
const url = require("url");
const qs = require("querystring");
const queryOrder = require("../db/mysql/queryOrder");
const otherOrder = require("../db/mysql/otherOrder");
const queryEmp = require("../db/mysql/queryEmp");
const otherEmp = require("../db/mysql/otherEmp");
const async = require("async");
const momoent = require("moment");
const xlsx = require("node-xlsx");
const path = require("path");
const timer = require("./timer");
const promise = require('bluebird');
var debug = require("debug")("app:server");
let public = require("../public/public");
const uploadFile = public.uploadFolde; // 后台修改上传图片文件的文件夹名字
const excelFile = public.excelFile;
const symbol = public.symbol;
const util = require('./util');

const get = require('../db/redis/get_redis');

var md = {
  /**
   * total_profit表
   * @param {JSON} body 查询条件
   */
  getTotal_profit: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'total_profit',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * detail_file_type表
   * @param {JSON} body 查询条件
   */
  getDetail_file_type: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'detail_file_type',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * file_types_num表
   * @param {JSON} body 查询条件
   */
  getFile_types_num: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'file_types_num',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * flow表
   * @param {JSON} body 查询条件
   */
  getFlow: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'flow',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * flow_detail表
   * @param {JSON} body 查询条件
   */
  getFlow_detail: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'flow_detail',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * order表
   * @param {JSON} body 查询条件
   */
  getOrders: promise.promisify(async function (body, cb) {
    try {
      let tName = "";
      let order_type = body.order_type;
      if (order_type == 1) {
        tName = 'order1';
      } else if (order_type == 2) {
        tName = 'order2';
      } else if (order_type == 3) {
        tName = 'order3';
      }
      let obj = {
        tName: tName,
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * product表
   * @param {JSON} body 查询条件
   */
  getProduct: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'product',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * product_type表
   * @param {JSON} body 查询条件
   */
  getProduct_type: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'product_type',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * relation_file_type_detail表
   * @param {JSON} body 查询条件
   */
  getRelation_file_type_detail: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_file_type_detail',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * relation_flow_detail表
   * @param {JSON} body 查询条件
   */
  getRelation_flow_detail: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_flow_detail',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * relation_order_state表
   * @param {JSON} body 查询条件
   */
  getRelation_order_state: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_order_state',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * relation_product_dep表
   * @param {JSON} body 查询条件
   */
  getRelation_product_dep: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_product_dep',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * relation_state_flow表
   * @param {JSON} body 查询条件
   */
  getRelation_state_flow: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'relation_state_flow',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  /**
   * state_detail表
   * @param {JSON} body 查询条件
   */
  getState_detail: promise.promisify(async function (body, cb) {
    try {
      let obj = {
        tName: 'state_detail',
        condi: 'and',
      }
      let obj = util.spliceCode(obj, body);
      let ret = await get.myData(obj);
      let data = getData(ret);
      cb(null, data)
    } catch (err) {
      cb('error');
    }
  }),
  
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
      let result = await queryOrder.getRelation_order_state({ relation_state_id: relation_state_id }, [relation_state_id]);
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
  } else if (num == 5) {
    text = "撤销";
  }
  cb(text);
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
 * 传入flow_id，flow_detail与relation_flow_detail多表排序查询
 */
let getsortFlow = promise.promisify(async function (flow_id, cb) {
  try {


    let obj = {
      tName: 'relation_flow_detail',
      condi: 'and',
      flow_id: flow_id
    };
    // 通过flow_id获得流程对应的多个具体流程（中间表）
    let rFlow_details = await get.myData(obj);
    let obj2 = {
      tName: 'flow_detail',
      condi: 'and',
    };
    let flow_details_arr = [];
    // 获得具体流程的信息，并与流程信息拼接在一起
    for (let i = 0; i < rFlow_details.length; i++) {
      obj2.flow_detail_id = rFlow_details[i].data.flow_detail_id;
      let val = await get.myData(obj2);
      flow_details_arr.push(val[0].data);
    }
    // 排序
    let sortFlows = sortArr(flow_details_arr, 'leavl', 'asc');
    cb(null, sortFlows);
  } catch (err) {
    cb('error');
  }
})


module.exports = md;