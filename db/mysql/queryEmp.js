let conn = require('./pool')
var Promise = require('bluebird');

module.exports = {
    /**
     * 查出所有的用户
     * 返回id与对应的名字
     */
    getEmpIdAndName: Promise.promisify(function (data, arr, cb) {
        let sql = "select emp_id,name,iiuv from emp t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 仅用于订单创建时，查询业务和经理的id
     * @param {Array} arr [iiuv,type1,type2]
     */
    getEmpId: Promise.promisify(function (arr, cb) {
        let sql = "select emp_id from emp where iiuv = ? and type!=6";
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询用户表
     */
    getEmp: Promise.promisify(function (obj, cb) {
        let limit = obj.limit;
        let sql = "select * from emp t where 1=1";
        arr = isEmpty(obj.arr);
        sql = isExist(sql, obj.data);
        // sql += ' order by registTime desc';
        if (limit && limit != "") {
            sql += ' limit ' + (limit - 1) * 15 + ',15';
        }
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询部门表
     */
    getDep: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from dep t where 1=1"
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询角色
     */
    getRole: Promise.promisify(function (data, arr, cb) {
        let sql = 'select * from role t where 1=1'
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询权限资源
     */
    getResource: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from resource t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询角色与权限中间表
     */
    getRoleResource: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from relation_role_resource t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 查询个人与权限中间表
     * @param {JSON} data - 要查询的条件字段名与对应的值
     * @param {Array} arr - 实际要传递的参数 
     * @cb cb 
     */
    getEmpResource: Promise.promisify(function (data, arr, cb) {
        let sql = "select * from relation_emp_resource t where 1=1";
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 获得所有的未被分配的员工
     * @param {JSON} data - 要查询的条件字段名与对应的值
     * @param {Array} arr - 实际要传递的参数 
     * @cb cb 
     */
    getAllEmpNotAllot: Promise.promisify(function (data, arr, cb) {
        let sql = 'select * from emp t where ISNULL(dep_id)';
        arr = isEmpty(arr);
        sql = isExist(sql, data);
        conn.getConn(sql, arr, cb);
    }),





    /**   针对筛选页面根据角色不同，查询不同的员工的方法 */
    /**
     * 多表查询，查询内勤名下的所有业务
     * @param {Array} arr - 内勤id
     * @cb cb 
     */
    getOffBusName: Promise.promisify(function (arr, cb) {
        let sql = 'select name,emp_id,iiuv from relation_product_dep t,emp t2 where t.dep_emp_id = t2.emp_id and t.off_id = ?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 多表查询，查询业务对应的所有内勤
     * @param {Array} arr - 业务id
     * @cb cb 
     */
    getBusNameId: Promise.promisify(function (arr, cb) {
        let sql = 'select name,emp_id from relation_product_dep t,emp t2 where t.off_id = t2.emp_id and t.dep_emp_id = ?';
        conn.getConn(sql, arr, cb);
    }),
    getDepUsers: Promise.promisify(function (arr, cb) {
        let sql = 'select name,emp_id from emp t where t.iiuv=? and type=?';
        conn.getConn(sql, arr, cb);
    }),






    /**
     * 获取所有聊天房间
     */
    getChatroom: Promise.promisify(function (arr, cb) {
        let sql = 'select * from chatroom';
        conn.getConn(sql, arr, cb);
    }),
}

function isEmpty(arr) {
    if (arr) {
        let arr2 = [];
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] != "" && arr[i]) {
                arr2.push(arr[i]);
            }
        }
        return arr2;
    } else {
        return '';
    }
}

function isExist(sql, data) {
    if (data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            let value = data[keys[i]];
            if (keys[i] == 'time1') {
                sql += ' and t.appliTime>?'
            } else if (keys[i] == 'time2') {
                sql += ' and t.appliTime<?'
            } else if (value != '' && value) {
                sql += ' and t.' + keys[i] + '=?'
            }
        }
    }
    return sql;
}