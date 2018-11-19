

// 这个是用来增删改或一些特殊查询的关于账户的模块
let conn = require('./pool')
var Promise = require('bluebird');


module.exports = {
    /**
     * @param {function} cb
     * 返回数据库当前最大的推荐码值
     */
    getBigIIUV: Promise.promisify(function (cb) {
        sql = 'select max(iiuv) from emp';
        conn.getConn(sql, [], cb);
    }),
    /**
     * @param {Array} arr   [username,password,type,iiuv,regisTime]
     * 创建一个是业务员的账户（需要加推荐码）
     */
    insertUser5: Promise.promisify(function (arr, cb) {
        sql = 'insert into emp (username,password,tel,type,iiuv,registTime) values (?,?,?,?,?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * @param {Array} arr   [username,password,type,registTime]
     * 创建一个不是业务员的账户(不需要添加推荐码)
     */
    insertUser: Promise.promisify(function (arr, cb) {
        sql = 'insert into emp (username,password,tel,type,registTime) values (?,?,?,?,?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 将所有人的power_type的值变为1，即对应角色权限
     */
    recoverAllreource: Promise.promisify(function (arr, cb) {
        sql = 'update emp set power_type=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 删除用户对权限中间表所有信息
     */
    deleteALlEmpResource: Promise.promisify(function (arr, cb) {
        sql = 'delete from relation_emp_resource';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过用户id清除此账户对应的单独权限
     */
    deleteEmpResource: Promise.promisify(function (arr, cb) {
        sql = 'delete from relation_emp_resource where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过用户id清除此账户
     */
    deleteUser: Promise.promisify(function (arr, cb) {
        sql = 'delete from emp where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 修改一个角色的权限
     */
    insertRoleResource: Promise.promisify(function (arr, cb) {
        sql = 'insert into relation_role_resource (role_id,resource_id) values (?,?)'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过角色id，删除中间表此角色id对应的所有权限
     */
    deleteRoleResource: Promise.promisify(function (arr, cb) {
        sql = 'delete from relation_role_resource where role_id=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过用户id，将对应用户的权限类型修改为个人级别
     * @param {Array} arr   [power_type,emp_id]
     */
    updateUserPower_type: Promise.promisify(function (arr, cb) {
        sql = 'update emp set power_type=? where emp_id=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 通过账户id删除账户对权限中间表的权限信息
     */
    deleteUserResource: Promise.promisify(function (arr, cb) {
        sql = 'delete from relation_emp_resource where emp_id=?'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 修改一个用户的权限
     * [emp_id,resource_id]
     */
    insertUserResource: Promise.promisify(function (arr, cb) {
        sql = 'insert into relation_emp_resource (emp_id,resource_id) values (?,?)'
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入用户id
     * 恢复一个用户的权限 
     */
    recoverPower: Promise.promisify(function (arr, cb) {
        sql = 'update emp set power_type=1 where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    updateUserInfo: Promise.promisify(function (arr, password, cb) {
        if (password && password != "") {
            arr = [password].concat(arr);
            sql = 'update emp set password=?,name=?,tel=?,idCard=?,username=? where username=?'
        } else {
            sql = 'update emp set name=?,tel=?,idCard=?,username=? where username=?'
        }
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入推荐码与emp_id修改推荐码
     */
    updateUser6: Promise.promisify(function (arr, cb) {
        let sql = 'update emp set iiuv=? where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入最后提交时间，与渠道id，修改
     */
    updateSumbitTime: Promise.promisify(function (arr, cb) {
        let sql = 'update emp set submitTime=? where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入部门名字，创建一个部门
     */
    createDep: Promise.promisify(function (arr, cb) {
        sql = 'insert into dep (managerName) value (?)';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入部门id与用户id，将此员工分配到相应部门
     */
    allotUser: Promise.promisify(function (arr, cb) {
        sql = 'update emp set dep_id=? where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入部门id与用户id，将此员工分从部门删除
     */
    deleteDepUser: Promise.promisify(function (arr, cb) {
        sql = 'update emp set dep_id=null where emp_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 传入部门id，删除此部门 
     */
    deleteDep: Promise.promisify(function (arr, cb) {
        sql = 'delete from dep where dep_id=?';
        conn.getConn(sql, arr, cb);
    }),
    /**
     * 为部门分配正副经理
     * 或者删除部门正或副经理（置为空即可）
     */
    allotManager: Promise.promisify(function (num, arr, cb) {
        let sql = '';
        if (num == 1) {
            sql = 'update dep set manager_id=? where dep_id=?'
        } else if (num == 2) {
            sql = 'update dep set manager2_id=? where dep_id=?'
        } else if (num == 3) {
            sql = 'update dep set manager3_id=? where dep_id=?'
        }
        conn.getConn(sql, arr, cb);
    }),
}
