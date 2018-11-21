const async = require('async');
const promise = require('bluebird');
const get = {};
const client = require('./async_redis');

var total_profit = [];
var data_business = [];
var data_home_page = [];
var data_partner = [];
var data_zizhi = [];
var dep = [];
var detail_file_type = [];
var emp = [];
var file_types_num = [];
var flow = [];
var flow_detail = [];
var order1 = [];
var order2 = [];
var order3 = [];
var product = [];
var product_type = [];
var relation_emp_resource = [];
var relation_emp_role = [];
var relation_file_type_detail = [];
var relation_flow_detail = [];
var relation_order_state = [];
var relation_product_dep = [];
var relation_role_resource = [];
var relation_state_flow = [];
var resource = [];
var role = [];
var state_detail = [];

let getAllDate = promise.promisify(async function getDate(obj, cb) {
    try {
        let tName = obj.tName;
        let arr = getVar(tName);
        if (arr.length != 0) {
            cb(null, arr);
        } else {
            let ret = await client.lrange(tName, 0, -1);
            for (let i = 0; i < ret.length; i++) {
                const data = JSON.parse(ret[i]);
                arr.push(data);
            }
            setVar(arr, tName);
            cb(null, arr);
        }
    } catch (err) {
        cb(err)
    }


})


/**
 * 通过传入相应的条件，得到相应的数据
 * @param  {Object} condis
 * 包括tName：要查询的表名；  condi：or/and与还是或；  limit：第几页；  数据库字段名：实际值
 */
get.myData = promise.promisify(async function (condis, cb) {
    try {
        let condi = condis.condi;
        let limit = condis.limit;
        let sort = condis.sort;
        let nums = 10;
        let data = await getAllDate(condis);
        let arr = [];
        if (condi == 'or') {
            arr = getOrDate(condis, data);
        } else if (condi == 'and') {
            arr = getAndDate(condis, data);
        }
        if (sort) {
            arr = sortArr(arr, sort);
            console.log(arr);
        }
        if (limit) {
            if (tName == 'order1' || tName == 'order3') {
                nums = 20;
            } else if (tName == 'order2') {
                nums = 10;
            } else if (tName == 'emp' || tName == 'product') {
                nums = 15;
            }
            let arr2 = [];
            for (let i = (limit * nums); i < arr.length; i++) {
                if (i == nums * (limit + 1)) {
                    break;
                } else if (i == arr.length - 1) {
                    arr2.push(arr[i]);
                    break
                }
                arr2.push(arr[i]);
            }
            cb(null, arr2);
        } else {
            cb(null, arr);
        }
    } catch (err) {
        console.log(err);
        cb('error');
    }
})
// 查询语句and和or和not都有,默认是and
get.myDataAndOrNot = promise.promisify(async function (condiAnd, condiOr, condiNot, cb) {
    try {
        let condi = condiAnd.condi;
        let data = await getAllDate(condis);
        let arr = [];
        if (condi == 'or') {
            arr = getOrDate(condis, data);
        } else if (condi == 'and') {
            arr = getAndDate(condis, data);
        } else if (condi == 'not') {
            arr = getNotData(condis, data);
        }
        let tName = condiAnd.tName;
        if (condiOr) {
            let keys = Object.keys(condiOr);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = false;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val.data[k] == condi[k]) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                }
            }
        } else if (condiNot) {
            let keys = Object.keys(condiNot);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = true;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val.data[k] == condi[k]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                }
            }
        }
        if (limit) {
            if (tName == 'order1' || tName == 'order3') {
                nums = 20;
            } else if (tName == 'order2') {
                nums = 10;
            } else if (tName == 'emp' || tName == 'product') {
                nums = 15;
            }
            let arr2 = [];
            for (let i = (limit * nums); i < arr.length; i++) {
                if (i == nums * (limit + 1)) {
                    break;
                } else if (i == arr.length - 1) {
                    arr2.push(arr[i]);
                    break
                }
                arr2.push(arr[i]);
            }
            cb(null, arr2);
        } else {
            cb(null, arr);
        }
    } catch (err) {
        console.log(err);
        cb('error');
    }
})
/**
 * 修改redis数据库数据
 * @param {Object} condis   查询条件
 * @param {Object} update   修改条件
 * 
 */
get.update = promise.promisify(async function (condis, update, cb) {
    try {
        // 查询出符合条件的数据
        let result = await get.myData(condis);
        let tName = condis.tName;
        // 遍历符合条件的数据，得到索引，与源数据
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            let data = obj.data;
            let row = obj.row;
            // 遍历需要更改的值，并将源数据更改
            for (const k in update) {
                const val = update[k];
                data[k] = val;
            }
            // 将服务器保存的数据也修改了
            let arr = getVar(tName);
            arr[row] = data;
            data = JSON.stringify(data);
            // 将更改好的源数据，通过索引修改回去
            await client.lset(tName, row, data);
        }
        cb(null, 'success');
    } catch (err) {
        cb(err);
    }
})

/**
 * 删除redis数据库数据
 * @param {Object} condis   查询条件
 * 
 */
get.delete = promise.promisify(async function (condis, cb) {
    try {
        // 查询出符合条件的数据
        let result = await get.myData(condis);
        let tName = condis.tName;
        // 遍历符合条件的数据，得到索引，与源数据
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            let data = obj.data;
            let row = obj.row;
            // 将服务器保存的数据也修改了
            let arr = getVar(tName);
            arr.splice(row, 1);
            // 传回redis一定是字符串
            data = JSON.stringify(data);
            // 将更改好的源数据，通过索引修改回去
            await client.lrem(tName, 0, data);
        }
        cb(null, 'success')
    } catch (err) {
        cb(err);
    }
});
get.insert = promise.promisify(async function (condis, cb) {
    try {
        let tName = condis.tName;
        let obj = {};
        for (const key in condis) {
            if (key != 'tName' && key != 'condi' && key != 'limit') {
                obj[key] = condis[key]
            }
        }
        let arr = getVar(tName);
        arr.push(obj);
        obj = JSON.stringify(obj);
        await client.rpush(tName, obj);
        cb(null, 'success');
    } catch (err) {
        cb(err);
    }
})
get.tbMaxId = promise.promisify(async function (condis, key, cb) {
    try {
        let result = await getAllDate(condis);
        let maxId = 0;
        for (let i = 0; i < result.length; i++) {
            const val = result[i];
            if (val[key] > maxId) {
                maxId = val[key];
            }
        }
        cb(null, ++maxId);
    } catch (err) {
        cb('error')
    }
})
/**
 * 返回 不等于！=条件的数据
 * @param {*} condi 
 * @param {*} data 
 */
function getNotData(condi, data) {
    let keys = Object.keys(condi);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        const val = data[i];
        // 默认有与此条件相等的
        let flag = true;
        for (let j = 0; j < keys.length; j++) {
            const k = keys[j];
            if (k != 'tName' && k != 'condi' && k != 'limit' && k != 'sort') {
                if (val[k] == condi[k]) {
                    flag = false;
                    break;
                }
            }
        }
        if (flag) {
            let obj = {};
            obj.data = val;
            obj.row = i;
            arr.push(obj);
        }
    }
    return arr;
}
/**
 * 返回 与&& 条件的数据，即完全符合
 * @param {JSON} condi 
 * @param {Array} data 
 * @callback cb 
 */
function getAndDate(condi, data) {
    let keys = Object.keys(condi);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        const val = data[i];
        // 默认有与此条件相等的
        let flag = true;
        for (let j = 0; j < keys.length; j++) {
            const k = keys[j];
            if (k != 'tName' && k != 'condi' && k != 'limit' && k != 'sort') {
                if (val[k] != condi[k]) {
                    flag = false;
                    break;
                }
            }
        }
        if (flag) {
            let obj = {};
            obj.data = val;
            obj.row = i;
            arr.push(obj);
        }
    }
    return arr;
}

/**
 * 返回 与&& 条件的数据，即完全符合
 * @param {JSON} condi 
 * @param {Array} data 
 * @callback cb 
 */
function getOrDate(condi, data) {
    let keys = Object.keys(condi);
    let arr = [];
    for (let i = 0; i < data.length; i++) {
        const val = data[i];
        // 默认有与此条件相等的
        let flag = false;
        for (let j = 0; j < keys.length; j++) {
            const k = keys[j];
            if (k != 'tName' && k != 'condi' && k != 'limit' && k != 'sort') {
                if (val[k] == condi[k]) {
                    flag = true;
                    break;
                }
            }
        }
        if (flag) {
            let obj = {};
            obj.data = val;
            obj.row = i;
            arr.push(obj);
        }
    }
    return arr;
}
// 根据穿过来的sort规则进行排序
function sortArr(arr, sort) {
    let rule = sort[0]; // asc或desc
    let key = sort[1];  // 排序字段
    if (sort == 'asc') { // 从小到大
        var i = arr.length, j;
        var tempExchangVal;
        while (i > 0) {
            for (j = 0; j < i - 1; j++) {
                if (arr[j].data[key] > arr[j + 1].data[key]) {
                    tempExchangVal = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tempExchangVal;
                }
            }
            i--;
        }
        console.log(arry);
        return arr;
    } else if (sort == 'desc') {   //从大到小
        var i = arr.length, j;
        var tempExchangVal;
        while (i > 0) {
            for (j = 0; j < i - 1; j++) {
                if (arr[j].data[key] < arr[j + 1].data[key]) {
                    tempExchangVal = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = tempExchangVal;
                }
            }
            i--;
        }
        return arr;
    }
}
function getVar(tName) {
    switch (tName) {
        case 'total_profit':
            if (total_profit) {
                return total_profit;
            }
            break;
        case 'data_business':
            if (data_business) {
                return data_business;
            }
            break;
        case 'data_home_page':
            if (data_home_page) {
                return data_home_page;
            }
            break;
        case 'data_partner':
            if (data_partner) {
                return data_partner;
            }
            break;
        case 'data_zizhi':
            if (data_zizhi) {
                return data_zizhi;
            }
            break;
        case 'dep':
            if (dep) {
                return dep;
            }
            break;
        case 'detail_file_type':
            if (detail_file_type) {
                return detail_file_type;
            }
            break;
        case 'emp':
            if (emp) {
                return emp;
            }
            break;
        case 'file_types_num':
            if (file_types_num) {
                return file_types_num;
            }
            break;
        case 'flow':
            if (flow) {
                return flow;
            }
            break;
        case 'flow_detail':
            if (flow_detail) {
                return flow_detail;
            }
            break;
        case 'order1':
            if (order1) {
                return order1;
            }
            break;
        case 'order2':
            if (order2) {
                return order2;
            }
            break;
        case 'order3':
            if (order3) {
                return order3;
            }
            break;
        case 'product':
            if (product) {
                return product;
            }
            break;
        case 'product_type':
            if (product_type) {
                return product_type;
            }
            break;
        case 'relation_emp_resource':
            if (relation_emp_resource) {
                return relation_emp_resource;
            }
            break;
        case 'relation_emp_role':
            if (relation_emp_role) {
                return relation_emp_role;
            }
            break;
        case 'relation_file_type_detail':
            if (relation_file_type_detail) {
                return relation_file_type_detail;
            }
            break;
        case 'relation_flow_detail':
            if (relation_flow_detail) {
                return relation_flow_detail;
            }
            break;
        case 'relation_order_state':
            if (relation_order_state) {
                return relation_order_state;
            }
            break;
        case 'relation_product_dep':
            if (relation_product_dep) {
                return relation_product_dep;
            }
            break;
        case 'relation_role_resource':
            if (relation_role_resource) {
                return relation_role_resource;
            }
            break;
        case 'relation_state_flow':
            if (relation_state_flow) {
                return relation_state_flow;
            }
            break;
        case 'resource':
            if (resource) {
                return resource;
            }
            break;
        case 'role':
            if (role) {
                return role;
            }
        case 'state_detail':
            if (state_detail) {
                return state_detail;
            }
            break;
        default:
            break;
    }
}
function setVar(data, tName) {
    switch (tName) {
        case 'total_profit':
            total_profit = data;
            break;
        case 'data_business':
            data_business = data;
            break;
        case 'data_home_page':
            data_home_page = data;
            break;
        case 'data_partner':
            data_partner = data;
            break;
        case 'data_zizhi':
            data_zizhi = data;
            break;
        case 'dep':
            dep = data;
            break;
        case 'detail_file_type':
            detail_file_type = data;
            break;
        case 'emp':
            emp = data;
            break;
        case 'file_types_num':
            file_types_num = data;
            break;
        case 'flow':
            flow = data;
            break;
        case 'flow_detail':
            flow_detail = data;
            break;
        case 'order1':
            order1 = data;
            break;
        case 'order2':
            order2 = data;
            break;
        case 'order3':
            order3 = data;
            break;
        case 'product':
            product = data;
            break;
        case 'product_type':
            product_type = data;
            break;
        case 'relation_emp_resource':
            relation_emp_resource = data;
            break;
        case 'relation_emp_role':
            relation_emp_role = data;
            break;
        case 'getrelation_file_type_detail':
            getrelation_file_type_detail = data;
            break;
        case 'relation_flow_detail':
            relation_flow_detail = data;
            break;
        case 'relation_order_state':
            relation_order_state = data;
            break;
        case 'relation_product_dep':
            relation_product_dep = data;
            break;
        case 'relation_role_resource':
            relation_role_resource = data;
            break;
        case 'relation_state_flow':
            relation_state_flow = data;
            break;
        case 'resource':
            resource = data;
            break;
        case 'role':
            role = data;
        case 'state_detail':
            state_detail = data;
            break;
        default:
            break;
    }
}

module.exports = get;