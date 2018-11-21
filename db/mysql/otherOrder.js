// 这个是用来增删改或一些特殊查询的关于订单的模块
let conn = require('./pool')
var Promise = require('bluebird');

module.exports = {
    /**
     * 查询最大的订单id
     */
    getBigOrder_id: Promise.promisify(function (cb) {
        sql = 'select max(order_id) from order2';
        conn.getConn(sql, [], cb);
    }),
    /**
     * 查询最大的状态id
     */
    getBigRealtionOrder_id: Promise.promisify(function (cb) {
        sql = 'select max(relation_state_id) from relation_order_state';
        conn.getConn(sql, [], cb);
    }),
    /**
     * 传入订单id，删除此订单
     */
    deleteOrderById: Promise.promisify(function (arr, cb) {
        sql = 'delete from order2 where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入order_id以及状态id，state_detail_id和失败原因failReason将
     * 修改订单与状态中间表的失败原因
     */
    setFailReason: Promise.promisify(function (arr, cb) {
        let sql = 'update order2 set failReason=? where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 修改总利润的值
     */
    updateProfit: Promise.promisify(function (arr, cb) {
        let sql = 'update total_profit set profit=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 修改订单的count值
     */
    updateCount: Promise.promisify(function (arr, cb) {
        let sql = 'update total_profit set count=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 
     * 通过订单order_id以及state_id将订单order2表的状态修改
     */
    setState: Promise.promisify(function (arr, cb) {
        let sql = 'update order2 set relation_state_id=? where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过订单order_id以及state_id将中间表的时间修改
     */
    setStateTime: Promise.promisify(function (arr, cb) {
        let sql = 'update relation_order_state set state_time=? where order_id=? and state_detail_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过订单order_id以及state_detail_id将中间表的流程时间修改
     */
    setFlowTime: Promise.promisify(function (arr, cb) {
        let sql = 'update relation_order_state set flow_time=? where order_id=? and state_detail_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入订单id，具体状态id，在订单与状态中间表添加新的字段
     */
    isnertOrderState: Promise.promisify(function (arr, cb) {
        let sql = 'insert into relation_order_state (relation_state_id,order_id,state_detail_id) values (?,?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入订单id，以及字段名，以及要修改的内容
     */
    updateOneOrder: Promise.promisify(function (data, arr, cb) {
        let sql = 'update order2 set ' + data + '=? where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 按顺序传入名字，详细，图片路径,流程id，文件类型id与商品id
     * 修改商品的信息
     */
    updateProductInfo: Promise.promisify(function (data, arr, cb) {
        let sql = 'update product set ';
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        sql += ' where product_id=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入商品名字与类型id
     * 创建一个商品
     */
    insertProduct: Promise.promisify(function (arr, cb) {
        let sql = 'insert into product (name, product_type_id) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入类型名字
     * 创建一个商品类型
     */
    insertProductType: Promise.promisify(function (arr, cb) {
        let sql = 'insert into product_type (name) values (?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入流程的名字
     * 创建一个流程
     */
    insertFlow: Promise.promisify(function (arr, cb) {
        let sql = 'insert into flow (flow_name) value (?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入具体流程名字，与等级
     * 创建一个具体流程
     */
    insertDetailFlow: Promise.promisify(function (arr, cb) {
        let sql = 'insert into flow_detail (flow_name,leavl) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入具体状态名字，与等级
     * 创建一个具体状态
     */
    insertDetailState: Promise.promisify(function (arr, cb) {
        let sql = 'insert into state_detail (state_name,leavl) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入流程id，与具体流程id
     * 为中间表的流程与具体流程赋上关系
     */
    insertRelationFlow: Promise.promisify(function (arr, cb) {
        let sql = 'insert into relation_flow_detail (flow_id,flow_detail_id) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入具体流程id，与具体状态id
     * 为中间表的具体流程与具体状态赋上关系
     */
    insertRelationState: Promise.promisify(function (arr, cb) {
        let sql = 'insert into relation_state_flow (flow_detail_id,state_detail_id) values (?,?);';
        conn.getConn(sql, arr, cb);
    }),





    /**
     * 传入流程id，删除流程
     */
    deleteFlow: Promise.promisify(function (arr, cb) {
        let sql = 'delete from flow where flow_id=?';
        conn.getConn(sql, arr, cb);
    }),

    /**
     * 传入商品id，删除商品
     */
    deleteProduct: Promise.promisify(function (arr, cb) {
        let sql = 'delete from product where product_id=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入类型名,创建一个类型表
     */
    insertType: Promise.promisify(function (arr, cb) {
        let sql = 'insert into file_types_num (name) value (?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入具体类型名，以及详情，创建一个具体的类型
     */
    insertDetailType: Promise.promisify(function (arr, cb) {
        let sql = 'insert into detail_file_type (name,text) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 为类型与具体类型中间表赋值
     */
    insertRelationType: Promise.promisify(function (arr, cb) {
        let sql = 'insert into relation_file_type_detail (file_type_id,detail_file_type_id) values (?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 删除材料表，传入材料id
     */
    deleteFileType: Promise.promisify(function (arr, cb) {
        let sql = 'delete from file_types_num where file_type_id=?';
        conn.getConn(sql, arr, cb);
    }),
    deleteRelationFileType: Promise.promisify(function (arr, cb) {
        let sql = 'delete from relation_file_type_detail where file_type_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 删除具体材料表，传入材料id
     */
    deleteDetailFileType: Promise.promisify(function (arr, cb) {
        let sql = 'delete from detail_file_type where detail_file_type_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入订单id，以及大状态对应的id，修改订单的大状态
     */
    setOrder_state: Promise.promisify(function (arr, cb) {
        let sql = 'update order2 set order_state=? where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入订单id，以及还款状态对应的id，修改订单的大状态
     */
    setRefund_state: Promise.promisify(function (arr, cb) {
        let sql = 'update order2 set refund=? where order_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 无须传入东西，创建一个空订单，得到订单id，返回给前端
     */
    createEmptyOrder: Promise.promisify(function (arr, cb) {
        let sql = 'insert into order2 (order_id,appli_id,appliTime,order_type) values (?,?,?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入商品id，部门id，内勤id，为内勤分配产品
     */
    insertOffProduct: Promise.promisify(function (arr, cb) {
        let sql = 'insert into relation_product_dep (product_id,dep_id,off_id,dep_emp_id) values (?,?,?,?)'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入商品id,删除所有与之对应的内勤
     */
    deleteOffProduct: Promise.promisify(function (arr, cb) {
        let sql = 'delete from relation_product_dep where product_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入商品id，部门id，内勤id，删除所有与此内勤此部门对应的业务
     */
    deleteOffBus: Promise.promisify(function (arr, cb) {
        let sql = 'delete from relation_product_dep where product_id=? and dep_id=? and off_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过订单id修改其中的值,所有！
     */
    updateOrder: Promise.promisify(function (data, arr, cb) {
        let sql = 'update order2 set ';
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        sql += ' where order_id=?'
        conn.getConn(sql, arr, cb);
    }),

}


function isEmpty(arr) {
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != "" && arr[i]) {
            arr2.push(arr[i]);
        }
    }
    return arr2;
}

function isExist(sql, data) {
    let keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        let value = data[keys[i]];
        if (value != '' && value && i == 0) {
            sql += keys[i] + '=?'
        } else if (value != '' && value) {
            sql += ',' + keys[i] + '=?'
        }
    }
    return sql;
}