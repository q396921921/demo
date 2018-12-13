const async = require('async');
const promise = require('bluebird');
const get = {};
const client = require('./async_redis');

// var chatroom = [];
// var total_profit = [];
// var data_business = [];
// var data_home_page = [];
// var data_partner = [];
// var data_zizhi = [];
// var dep = [];
// var detail_file_type = [];
// var emp = [];
// var file_types_num = [];
// var flow = [];
// var flow_detail = [];
// var order1 = [];
// var order2 = [];
// var order3 = [];
// var product = [];
// var product_type = [];
// var relation_emp_resource = [];
// var relation_emp_role = [];
// var relation_file_type_detail = [];
// var relation_flow_detail = [];
// var relation_order_state = [];
// var relation_product_dep = [];
// var relation_role_resource = [];
// var relation_state_flow = [];
// var resource = [];
// var role = [];
// var state_detail = [];

let getAllDate = promise.promisify(async function getDate(obj, cb) {
    try {
        let tName = obj.tName;
        // let arr = getVar(tName);
        // if (arr.length != 0) {
        //     cb(null, arr);
        // } else {
        let ret = await client.lrange(tName, 0, -1);
        arr = [];
        for (let i = 0; i < ret.length; i++) {
            const data = JSON.parse(ret[i]);
            arr.push(data);
        }
        setVar(arr, tName);
        cb(null, arr);
        // }
    } catch (err) {
        cb(err)
    }
})

/**
 * 通过传入相应的条件，得到相应的数据
 * @param  {Object} condis {tName:x, condi:x(默认值为and),xxx(数据库字段名):yyy...}
 * @returns {Array} [{data:x,row:y},...]; 
 */
get.myData = promise.promisify(async function (condis, cb) {
    try {
        let condi = condis.condi;
        if (!condi) {
            condis.condi = 'and';
            condi = 'and';
        }
        let data = await getAllDate(condis);
        let arr = [];
        if (condi == 'or') {
            arr = getOrDate(condis, data);
        } else if (condi == 'and') {
            arr = getAndDate(condis, data);
        }
        cb(null, arr);
    } catch (err) {
        console.log(err);
        cb('error');
    }
})
/**
 * 注意：如果有or，那么需要传入主键id，不能去重没有主键id的表
 * 传入查询的表名json格式（为了查出整张表所有数据），然后传入json格式的各个数据，进行多次筛选
 * and即=，not！=，or或者，后续可能会加> < >= <=
 * @param {JSON} tName {tName:x}表名
 * @param {JSON} rule {and:{字段名:x },or:{字段名:x }, not:{字段名:x }}
 * @returns {Array} [{data:x,row:y},...]; 
 */
get.myDataAndOrNot = promise.promisify(async function (tName, rule, cb) {
    try {
        let arr = await getAllDate(tName);
        let arr2 = [];  // 用于存储or规则下，复合条件的数据
        let and = rule.and;
        let or = rule.or;
        let id = "";
        if (or) {
            id = or.id;
        }
        let not = rule.not;
        let bigEqual = rule.bigEqual;
        let smallEqual = rule.smallEqual;

        if (or) {
            let keys = Object.keys(or);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = false;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (k != 'id') {
                        if (val[k] == or[k]) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (flag) {
                    arr2.push(arr[i]);
                }
            }
        }
        if (and) {
            let keys = Object.keys(and);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = true;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val[k] == and[k]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
        if (not) {
            let keys = Object.keys(not);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = true;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val[k] != not[k]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
        if (bigEqual) {
            let keys = Object.keys(bigEqual);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有复合此条件的
                let flag = true;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val[k] >= bigEqual[k]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
        if (smallEqual) {
            let keys = Object.keys(smallEqual);
            for (let i = 0; i < arr.length; i++) {
                const val = arr[i]
                // 默认有与此条件相等的
                let flag = true;
                for (let j = 0; j < keys.length; j++) {
                    const k = keys[j];
                    if (val[k] <= smallEqual[k]) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    arr.splice(i, 1);
                    i--;
                }
            }
        }
        arr = arr.concat(arr2);
        let hash = [];
        arr = arr.reduce((preVal, curVal) => {
            hash[curVal[id]] ? '' : hash[curVal[id]] = true && preVal.push(curVal);
            return preVal
        }, [])
        cb(null, arr);
    } catch (err) {
        console.log(err);
        cb('error');
    }
})
/**
 * 修改redis数据库数据
 * @param {JSON} condis   查询条件，包括tName与condi
 * @param {JSON} update   修改条件
 * @returns {string} success
 */
get.update = promise.promisify(async function (condis, update, cb) {
    try {
        let condi = condis.condi;
        if (condis.tName == 'order') {
            let order_type = condis.order_type;
            if (order_type == 1) {
                condis.tName = 'order1';
            } else if (order_type == 2) {
                condis.tName = 'order2';
            } else {
                condis.tName = 'order3';
            }
        }
        if (!condi) {
            condis.condi = 'and';
            condi = 'and';
        }
        for (const key in update) {
            if (update.hasOwnProperty(key)) {
                const val = update[key];
                if (val == 'null') {
                    update[key] = null;
                }
            }
        }
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
            // let arr = getVar(tName);
            // arr[row] = data;
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
 * @param {JSON} condis   查询条件包括tName,condi
 * @returns {string} success
 */
get.delete = promise.promisify(async function (condis, cb) {
    try {
        let condi = condis.condi;
        if (!condi) {
            condis.condi = 'and';
            condi = 'and';
        }
        // 查询出符合条件的数据
        let result = await get.myData(condis);
        let tName = condis.tName;
        // 遍历符合条件的数据，得到索引，与源数据
        for (let i = 0; i < result.length; i++) {
            const obj = result[i];
            let data = obj.data;
            let row = obj.row;
            // 将服务器保存的数据也修改了
            // let arr = getVar(tName);
            // arr.splice(row, 1);
            // 传回redis一定是字符串
            data = JSON.stringify(data);
            // 删除数据
            await client.lrem(tName, 0, data);
        }
        cb(null, 'success')
    } catch (err) {
        cb(err);
    }
});
/**
 * @param {JSON} condis {tName:x, 主键id:x, 其他字段:x };
 * @returns {string} success
 */
get.insert = promise.promisify(async function (condis, cb) {
    try {
        let tName = condis.tName;
        let obj = getObj(tName);
        for (const key in condis) {
            if (key != 'tName' && key != 'condi') {
                obj[key] = condis[key]
            }
        }
        // let arr = getVar(tName);
        // arr.push(obj);
        obj = JSON.stringify(obj);
        await client.rpush(tName, obj);
        cb(null, 'success');
    } catch (err) {
        cb(err);
    }
})
/**
 * 传入表名获取当前表最大的（ 主键id + 1 ）的值，order表特殊，需要传递order字段，会遍历三张order表
 * @param {JSON} condis {tName:x }
 * @param {string} key 字段名
 * @returns {number} maxId
 */
get.tbMaxId = promise.promisify(async function (condis, key, cb) {
    try {
        let tName = condis.tName;
        let result = [];
        if (tName == 'order') {
            condis.tName = 'order1';
            result = result.concat(await getAllDate(condis));
            condis.tName = 'order2';
            result = result.concat(await getAllDate(condis));
            condis.tName = 'order3';
            result = result.concat(await getAllDate(condis));
        } else {
            result = await getAllDate(condis);
        }
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
 * @param {JSON} condi 筛选条件{字段名1:x, 字段名2:x ...};
 * @param {Array} data 要筛选的数据
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
            if (k != 'tName' && k != 'condi') {
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
 */
function getAndDate(condi, data) {
    let keys = Object.keys(condi);
    let arr = [];
    for (const key in condi) {
        if (condi.hasOwnProperty(key)) {
            const val = condi[key];
            if (val == 'null') {
                condi[key] = null;
            }
        }
    }
    for (let i = 0; i < data.length; i++) {
        const val = data[i];
        // 默认有与此条件相等的
        let flag = true;
        for (let j = 0; j < keys.length; j++) {
            const k = keys[j];
            if (k != 'tName' && k != 'condi') {
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
            if (k != 'tName' && k != 'condi') {
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
/**
 * not use
 * 获得与此表名相同的变量的值，返回其中储存的数据
 * @param {string} tName 表名
 * @returns {Array} [json1,json2,...]
 */
function getVar(tName) {
    switch (tName) {
        case 'total_profit':
            return total_profit;
        case 'data_business':
            return data_business;
        case 'data_home_page':
            return data_home_page;
        case 'data_partner':
            return data_partner;
        case 'data_zizhi':
            return data_zizhi;
        case 'dep':
            return dep;
        case 'detail_file_type':
            return detail_file_type;
        case 'emp':
            return emp;
        case 'file_types_num':
            return file_types_num;
        case 'flow':
            return flow;
        case 'flow_detail':
            return flow_detail;
        case 'order1':
            return order1;
        case 'order2':
            return order2;
        case 'order3':
            return order3;
        case 'product':
            return product;
        case 'product_type':
            return product_type;
        case 'relation_emp_resource':
            return relation_emp_resource;
        case 'relation_emp_role':
            return relation_emp_role;
        case 'relation_file_type_detail':
            return relation_file_type_detail;
        case 'relation_flow_detail':
            return relation_flow_detail;
        case 'relation_order_state':
            return relation_order_state;
        case 'relation_product_dep':
            return relation_product_dep;
        case 'relation_role_resource':
            return relation_role_resource;
        case 'relation_state_flow':
            return relation_state_flow;
        case 'resource':
            return resource;
        case 'role':
            return role;
        case 'state_detail':
            return state_detail;
        case 'chatroom':
            return chatroom;
        default:
            break;
    }
}
/**
 * not use
 * 通过传入表名，将传入的数据赋值给正确的变量
 * @param {Array} data [json1,json2...];
 * @param {string} tName 表名
 */
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
        case 'chatroom':
            chatroom = data;
            break;
        default:
            break;
    }
}



// get mysql db every table's colums
function getObj(tName, cb) {
    let obj = {};
    switch (tName) {
        case 'total_profit':
            obj = {
                profit: null,
                count: null,
                loanA: null,
                loanB: null,
                dealA: null,
                dealB: null,
                callA: null,
                callB: null,
                empA: null,
                empB: null,
            }
            return obj;
        case 'data_business':
            obj = {
                bus_id: "",
                bus_name: null,
            }
            return obj;
        case 'data_home_page':
            obj = {
                home_id: "",
                text: null,
                imgPath: null,
                product_id: null,
                imgPath2: null,
            }
            return obj;
        case 'data_partner':
            obj = {
                partner_id: "",
                bus_id: null,
                name: null,
                big_text: null,
                imgPath: null,
                small_text: null,
                bank_imgPath: null,
                twoLine: null,
            }
            return obj;
        case 'data_zizhi':
            obj = {
                zizhi_id: "",
                text: null,
                imgPath: null,
            }
            return obj;
        case 'dep':
            obj = {
                dep_id: "",
                manager_id: null,
                manager2_id: null,
                manager3_id: null,
                managerName: null,
            }
            return obj;
        case 'detail_file_type':
            obj = {
                detail_file_type_id: "",
                name: null,
                text: null,
            }
            return obj;
        case 'emp':
            obj = {
                emp_id: "",
                dep_id: null,
                username: null,
                password: null,
                tel: null,
                gender: null,
                type: null,
                iiuv: null,
                idCard: null,
                registTime: null,
                logTime: null,
                submitTime: null,
                power_type: 1,
            }
            return obj;
        case 'file_types_num':
            obj = {
                file_type_id: "",
                name: null,
            }
            return obj;
        case 'flow':
            obj = {
                flow_id: "",
                flow_name: null,
            }
            return obj;
        case 'flow_detail':
            obj = {
                flow_detail_id: "",
                flow_name: null,
                leavl: null
            }
            return obj;
        case 'order1':
            return getOrderObj();
        case 'order2':
            return getOrderObj();
        case 'order3':
            return getOrderObj();
        case 'product':
            obj = {
                flow_id: null,
                product_id: "",
                product_type_id: null,
                name: null,
                product_intro: null,
                product_detail: null,
                imgPathSmall: null,
                imgPath: null,
                imgPath2: null,
                file_type_id: null,
                threeText: null,
                isNum: 0,
                isBourse: 0,
                putaway: 0
            }
            return obj;
        case 'product_type':
            obj = {
                product_type_id: "",
                name: null
            }
            return obj;
        case 'relation_emp_resource':
            obj = {
                emp_id: null,
                resource_id: null,
                id: "",
            }
            return obj;
        case 'relation_emp_role':
            obj = {
                role_id: null,
                resource_id: null,
                id: "",
            }
            return obj;
        case 'relation_file_type_detail':
            obj = {
                file_type_id: null,
                detail_file_type_id: null,
                id: "",
            }
            return obj;
        case 'relation_flow_detail':
            obj = {
                flow_id: null,
                flow_detail_id: null,
                id: "",
            }
            return obj;
        case 'relation_order_state':
            obj = {
                relation_state_id: "",
                order_id: null,
                state_detail_id: null,
                state_time: null,
                flow_time: null,
                failReason: null
            }
            return obj;
        case 'relation_product_dep':
            obj = {
                dep_id: null,
                product_id: null,
                off_id: null,
                dep_emp_id: null,
                failReason: ""
            }
            return obj;
        case 'relation_role_resource':
            obj = {
                role_id: null,
                resource_id: null,
                id: "",
            }
            return obj;
        case 'relation_state_flow':
            obj = {
                flow_detail_id: null,
                state_detail_id: null,
                id: "",
            }
            return obj;
        case 'resource':
            obj = {
                resource_id: "",
                url: null,
                name: null,
                type: null
            }
            return obj;
        case 'role':
            obj = {
                role_id: "",
                name: null,
                code: null,
                leavl: null
            }
            return obj;
        case 'state_detail':
            obj = {
                state_detail_id: "",
                state_name: null,
                leavl: null,
            }
            return obj;
        case 'chatroom':
            obj = {
                chat_id: "",
                appli_id: null,
                clientName: null,
                productName: null,
                Uname: null,
                Utel: null,
                Bname: null,
                Btel: null,
                Oname: null,
                Otel: null,
                Mname: null,
                Mtel: null,
                chatfile: null
            }
            return obj;
        default:
            break;
    }
}

function getOrderObj() {
    obj = {
        order_id: "",
        product_id: null,
        flowState: null,
        relation_state_id: null,
        appli_id: null,
        channel_id: null,
        business_id: null,
        office_id: null,
        clientName: null,
        type: null,
        inmoney: null,
        money: null,
        appliTime: null,
        loanTime: null,
        seeTime: null,
        failReason: null,
        userComment: null,
        empComment: null,
        orderFile: null,
        order_type: 1,
        order_state: 1,
        bank_name: null,
        bank_id: null,
        card_name: null,
        refund: null,
        commend1: null,
        commend2: null,
        commend3: null,
        commend4: null,
        interest: 0.000,
        call_message: null,
        refund_date: null,
        color: null
    }
    return obj;
}
module.exports = get;