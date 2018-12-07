var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var queryEmp = require('../db/mysql/queryEmp')
var otherEmp = require('../db/mysql/otherEmp')
var async = require('async')
var momoent = require('moment');
var xlsx = require('node-xlsx');
var path = require('path');
var timer = require('./timer');
const promise = require('bluebird');
var debug = require('debug')('app:server');
var public = require('../public/public');
var excelFile = public.excelFile;
const util = require('./util');

const get = require('../db/redis/get_redis');

const me = {
    /**
       * emp表
       * @param {JSON} body 查询条件
       */
    getEmp: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'emp',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * dep表
     * @param {JSON} body 查询条件
     */
    getDep: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'dep',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * relation_emp_resource表
     * @param {JSON} body 查询条件
     */
    getRelation_emp_resource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_emp_resource',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * relation_emp_role表
     * @param {JSON} body 查询条件
     */
    getRelation_emp_role: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_emp_role',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * relation_role_resource表
     * @param {JSON} body 查询条件
     */
    getRelation_role_resource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'relation_role_resource',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * resource表
     * @param {JSON} body 查询条件
     */
    getResource: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'resource',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),
    /**
     * role表
     * @param {JSON} body 查询条件
     */
    getRole: promise.promisify(async function (body, cb) {
        try {
            let obj = {
                tName: 'role',
                condi: 'and',
            }
            obj = util.spliceCode(obj, body);
            let ret = await get.myData(obj);
            let data = util.getData(ret);
            cb(null, data)
        } catch (err) {
            cb('error');
        }
    }),


    //  分割


    // use
    /**
     * 删除部门正或副经理
     * 传入正或副经理部门表对应的字段，以及账户id，以及部门id
     * @param {JSON} body {emp_id:x, dep_id:x, name:x}
     * @returns {string} success/error
     */
    deleteManager: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let dep_id = body.dep_id;
            let name = body.name;
            if (name == 'manager_id') {
                await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id: 'null' });
            } else if (name == 'manager2_id') {
                await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id2: 'null' });
            } else if (name == 'manager3_id') {
                await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id3: 'null' });
            }
            await get.update({ tName: 'emp', emp_id: emp_id }, { dep_id: 'null' });
            cb('success');
        } catch (err) {
            cb('error')
        }
    },
    // use
    /**
     * 传入部门id并删除此部门
     * @param {JSON} body {dep_id:x }
     * @returns {string} empExist(部门下有人) || success || error
     */
    deleteDep: async function (body, cb) {
        try {
            let dep_id = body.dep_id;
            let ret = await me.getEmp({ dep_id: dep_id });
            if (ret.length != 0) {
                cb('empExist')
            } else {
                await get.delete({ tName: 'dep', dep_id: dep_id })
                cb('success')
            }
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入账户id的数组，与部门id，将此账户从部门中删除
     * @param {JSON} body {emp_id_arr:[arr1,arr2...]}
     * @returns {string} success || error
     */
    deleteDepUser: async function (body, cb) {
        let emp_id_arr = body.emp_id_arr;
        async.each(emp_id_arr, function (emp_id, cb2) {
            (async function () {
                try {
                    await get.update({ tName: 'emp', emp_id: emp_id }, { dep_id: 'null' });
                    cb2();
                } catch (err) {
                    cb('error');
                }
            })()
        }, function (err) {
            cb('success');
        })
    },
    // use
    /**
     * 传入账户id，正副经理字段，以及部门id。为部门分配经理
     * @param {JSON} body {emp_id:x, dep_id:x, name:x}
     * @returns {string} userexist(已经被分配在其他部门) || success || error
     */
    allotManager: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let dep_id = body.dep_id;
            let name = body.name;
            let num = null;
            let ret = await me.getDep({ dep_id: dep_id });
            if (name == 'manager_id') {
                if (emp_id == ret[0].manager_id) {
                    cb('success')
                } else {
                    num = 1;
                }
            } else if (name == 'manager2_id') {
                if (emp_id == ret[0].manager2_id) {
                    cb('success')
                } else {
                    num = 2;
                }
            } else {
                if (emp_id == ret[0].manager3_id) {
                    cb('success')
                } else {
                    num = 3;
                }
            }
            let ret2 = await me.getEmp({ emp_id, emp_id, dep_id: 'null' });
            if (ret2.length == 0) {
                cb('userexist');
            } else {
                await get.update({ emp_id: emp_id }, { dep_id: dep_id });
                if (num == 1) {
                    await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id: emp_id });
                } else if (num == 2) {
                    await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id2: emp_id });
                } else if (num == 3) {
                    await get.update({ tName: 'dep', dep_id: dep_id }, { manager_id3: emp_id });
                }
                cb('success');
            }
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入部门id，与员工id。将相应的员工分配到相应的部门
     * @param {JSON} body {dep_id:x, emp_id_arr:[id1,id2...]}
     * @returns {string} success || error
     */
    allotUser: async function (body, cb) {
        let dep_id = body.dep_id;
        let emp_id_arr = body.emp_id_arr;
        async.each(emp_id_arr, function (emp_id, cb2) {
            (async function () {
                try {
                    let ret = await me.getEmp({ emp_id, emp_id, dep_id: 'null' });
                    await get.update({ tName: 'emp', emp_id: emp_id }, { dep_id: dep_id });
                    cb2();
                } catch (err) {
                    cb('error');
                }
            })()
        }, function (err) {
            cb('success');
        })
    },
    // use
    /**
     * 传入角色id，获得该角色下未被分配的员工
     * @param {JSON} body {type:x }
     * @returns {string} { "data": "[emp1],[emp2]..." } || error
     */
    getAllEmpNotAllot: async function (body, cb) {
        try {
            let type = body.type;
            let ret = await me.getEmp({ type, type, dep_id: 'null' });
            cb(JSON.stringify({ "data": ret }));
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入部门名字，创建一个部门
     * @param {JSON} body {managerName:x }
     * @returns {string} success || error
     */
    createDep: async function (body, cb) {
        try {
            let managerName = body.managerName;
            let maxId = get.tbMaxId({ tName: 'dep' }, 'dep_id');
            await get.insert({ tName: 'dep', dep_id: maxId, managerName: managerName });
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入用户id,删除此账户
     * @param {JSON} body {emp_id:x }
     * @returns {string} success || error
     */
    deleteUser: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            await get.delete({ tName: 'relation_emp_resource', emp_id: emp_id });
            await get.delete({ tName: 'emp', emp_id: emp_id })
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入用户id,使用户对应权限为角色
     * @param {JSON} body {emp_id:x }
     * @returns {string} success || error
     */
    recoverPower: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            await get.delete({ tName: 'relation_emp_resource', emp_id: emp_id });
            await get.update({ tName: 'emp', emp_id: emp_id }, { power_type: 1 });
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入用户名与密码判断是否为合法用户
     * @param {JSON} body {username:xx,password:xx}
     * @returns {string} isusers || "{'data':'emp'}" || error
     */
    getUserByUserPass: async function (body, cb) {
        try {
            let username = body.username;
            let password = body.password;
            if (password && password != "" && username && username != "") {
                let ret = await me.getEmp({ username: username, password: password });
                if (ret.length != 0) {
                    // 不允许用户角色登录
                    if (ret[0].type == 6) {
                        cb('isusers');
                    } else {
                        cb(JSON.stringify({ "data": ret[0] }))
                    }
                } else {
                    cb('error')
                }
            } else {
                cb('error')
            }
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 通过emp_id修改用户的信息
     * @param {JSON} body 
     * @returns {string} success || nouser || error
     */
    updateUser6: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let iiuv = body.iiuv;
            let ret = await me.getEmp({ "iiuv": iiuv, "type": 5 });
            if (ret.length == 1) {
                await get.update({ tName: 'emp', emp_id: emp_id }, { iiuv: iiuv });
                cb('success')
            } else {
                cb('nouser')
            }
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入用户的基本信息（包括密码），对其进行修改，
     * @param {JSON} body {name:x, username:x, tel:x, || repassword:x }
     * @returns {string} success || error
     */
    updateUserInfo: async function (body, cb) {
        try {
            let name = body.name;
            let repassword = body.repassword;
            let username = body.username;
            let tel = body.tel;
            if (password && password != "") {
                await get.update({ tName: 'emp', username: username }, { name: name, tel: tel, tel, username: tel, password: repassword });
            } else {
                await get.update({ tName: 'emp', username: username }, { name: name, tel: tel, tel, username: tel });
            }
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 传入username，返回这个唯一用户名的角色信息以及推荐码
     * @param {JSON} body   {username:xxx}
     * @returns {string} {data:[{},{},{}...,iiuv]}
     */
    getRoleInfo: async function (body, cb) {
        try {
            let username = body.username;
            let rslt = await me.getEmp({ username: username });
            let code = rslt[0].type;
            let rst = await me.getRole({ code: code });
            rst.push(rslt)
            cb(JSON.stringify({ data: rst }));
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 批量创建账户
     * @param {JSON} body {password:x, num:x, code:x}(密码/创建账户数量/账户角色)
     * @returns {string} "{ 'userArr': [emp1,emp2...] }"
     */
    createUser: async function (body, callback) {
        try {
            let password = body.password;
            let num = body.num;
            let code = body.code;

            // 定义一个用来存储所有新账户的数组
            let userArr = [];
            // 默认随机一个用户名
            let username = Math.floor(Math.random() * 100000 + 100000);
            if (username > 1000000) {
                username = username - 100000;
            }
            // 将数量变为数组，同步遍历
            let nums = [];
            for (let i = 0; i < num; i++) {
                nums.push(i);
            }
            if (code != '4') {
                for (let i = 0; i < nums.length; i++) {
                    const num = nums[i];
                    let bigIIUV = 100000;  //默认最小的邀请码
                    let biggerIIUV = await get.tbMaxId({ tName: 'emp' }, 'iiuv');
                    if (biggerIIUV > bigIIUV) {
                        bigIIUV = biggerIIUV;
                    }
                    while (true) {
                        let rslt = await me.getEmp({ username: username });
                        if (rslt.length > 0) {
                            username = Math.floor(Math.random() * 100000 + 100000);
                            if (username > 1000000) {
                                username = username - 100000;
                            }
                            continue;
                        } else {
                            // 如果没有，创建这个用户
                            let maxId = await get.tbMaxId({ tName: 'emp' }, 'emp_id');
                            userArr.push({ "username": username, "password": password, "iiuv": bigIIUV });
                            await get.insert({
                                tName: 'emp', emp_id: maxId, username: username, password: password,
                                type: code, iiuv: bigIIUV++, registTime: new Date()
                            })
                            break;
                        }
                    }
                }
                callback(JSON.stringify({ 'userArr': userArr }));
            } else {
                for (let i = 0; i < nums.length; i++) {
                    const num = nums[i];
                    while (true) {
                        let ralt = await me.getEmp({ "username": username });
                        if (rslt.length > 0) {
                            username = Math.floor(Math.random() * 100000 + 100000);
                            if (username > 1000000) {
                                username = username - 100000;
                            }
                            break;
                        } else {
                            // 如果没有，创建这个用户
                            let maxId = get.tbMaxId({ tName: 'emp' }, 'emp_id');
                            await get.insert({
                                tName: 'emp', emp_id: maxId, username: username, password: password,
                                type: code, registTime: new Date()
                            })
                            userArr.push({ "username": username, "password": password, "iiuv": '' });
                            break;
                        }
                    }
                }
                callback(JSON.stringify({ 'userArr': userArr }));
            }
        } catch (err) {
            console.log(err);
            callback('error');
        }
    },
    // use
    /**
     * 通过权限类型与角色类型查找用户,返回分页的数据
     * @param {JSON} body   {power_type:xx,type:xx,limit:x }
     * @returns {string} "{'data':[emp1,emp2...]}"
     */
    getEmpByType2: async function (body, cb) {
        try {
            let power_type = body.power_type;
            let limit = body.limit;
            let type = body.type;
            let rslt = await me.getEmp({ "power_type": power_type, "type": type });
            rslt = util.splitPage({ tName: 'emp', limit: limit }, rslt);
            cb(JSON.stringify({ data: rslt }));
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 返回所有权限以及此角色所拥有的权限
     * @param {JSON} body   {id(emp_id):xx}
     * @returns {string} "{'data':'[r1,r2...]'}"
     */
    getAllResourcesChecked: async function (body, cb) {
        try {
            let id = body.id;
            let rslt = await me.getResource("");
            let type = body.type;
            let arr = [];
            if (type == 'role') {
                let rslt2 = await me.getRelation_role_resource({ 'role_id': id });
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            } else if (type == 'user') {
                let rslt2 = await me.getRelation_emp_resource({ emp_id: id });
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            }
        } catch (err) {
            cb('error')
        }
    },
    // use
    /**
     * 将所有人的power_type的值变为1，即对应角色权限
     * @param {null} body
     * @returns {string} success || error
     */
    recoverAllreource: async function (body, cb) {
        try {
            await get.delete({ tName: 'relation_emp_resource' });
            await get.update({ tName: 'emp' }, { power_type: 1 });
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    /**
     * getEmpByType2方法与outputUsers的一个组合
     *  @param {JSON} body   {power_type:xx,type:xx}
     * 失败返回error
     * 成功返回数据
     */
    selectAndOutUsers: async function (body, cb) {
        let ret = await me.getEmp("");
        this.outputUsers(ret, (flag, ret) => {
            if (flag == 'true') {
                cb(ret)
            } else {
                console.log(ret);
                cb('error')
            }
        })
    },
    // use
    /**
     * 将之前这个角色所对应的多个权限全部删除掉，然后对本次的权限进行设置
     * @param {JSON} body {role_id:x, resource_id:[id1,id2...]}
     * @returns {string} success || error
     */
    updateRoleResource: async function (body, cb) {
        try {
            let role_id = body.role_id;
            let resource_id_arr = body.resource_id
            await get.delete({ tName: 'relation_role_resource', role_id: role_id });
            async.each(resource_id_arr, function (resource_id, cb2) {
                (async function () {
                    await get.insert({ tName: 'relation_role_resource', role_id: role_id, resource_id: resource_id });
                    cb2();
                })()
            }, function (err) {
                cb('success')
            })
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 通过用户id，获得他的权限
     * @param {JSON} body {emp_id:x }
     * @returns {string} "{'data':'[r1,r2...]'}"
     */
    getOneUserResource: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let rslt = await me.getResource("");
            let ret = await me.getEmp({ "emp_id": emp_id });
            let power_type = ret[0].power_type;
            let type = ret[0].type;
            let arr = [];
            if (power_type == 1) {
                let rslt2 = await me.getRelation_role_resource({ "role_id": type });
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            } else {
                let rslt2 = await me.getRelation_emp_resource({ emp_id: emp_id });
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            }
            console.log(arr);
        } catch (err) {
            cb('error');
        }
    },
    // use
    /**
     * 将角色权限变为单独权限
     * @param {JSON}   body     {emp_id:[x,y,z...],resource_id:[x,y,z...]}
     * @returns {string} success || error
     */
    updateRoleToUser: async function (body, cb) {
        console.log(body);
        let emp_id_arr = body.emp_id;
        let resource_id_arr = body.resource_id
        async.each(emp_id_arr, function (emp_id, cb2) {
            async.auto({
                deleteUserResource: function (cb3) {
                    (async function () {
                        try {
                            await get.delete({ tName: 'relation_emp_resource', emp_id: emp_id });
                            cb3(null, "1");
                        } catch (err) {
                            cb('error');
                        }
                    })()
                },
                updatePower_type: function (cb3) {
                    (async function () {
                        try {
                            await get.update({ tName: 'emp', emp_id: emp_id }, { power_type: 2 });
                            cb3(null, "2");
                        } catch (err) {
                            cb('error');
                        }
                    })()
                },
                insertResource: ['deleteUserResource', 'updatePower_type',
                    function (ret, cb3) {
                        async.each(resource_id_arr, function (resource_id, cb4) {
                            (async function () {
                                try {
                                    await get.insert({ tName: 'relation_emp_resource', emp_id: emp_id, resource_id: resource_id });
                                    cb4();
                                } catch (err) {
                                    cb('error');
                                }
                            })()
                        }, function (err) {
                            cb3(null, "3");
                        })
                    }]
            }, function (err, rst2) {
                cb2()
            })
        }, function (err) {
            cb('success');
        })
    },
    // use
    /**
     * 传入emp_id和权限的id，改变用户的权限
     * @param {JSON} body   {emp_id:xxx,resource_id:[x,y,x...]}
     * @returns {string} success || error
     */
    updateUserResource: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let resource_id_arr = body.resource_id
            await get.delete({ tName: 'relation_emp_resource', emp_id: emp_id });
            async.each(resource_id_arr, function (resource_id, cb2) {
                (async function () {
                    try {
                        await get.insert({ tName: 'relation_emp_resource', emp_id: emp_id, resource_id: resource_id });
                        cb2()
                    } catch (err) {
                        cb('error');
                    }
                })()
            }, function (err) {
                cb('success')
            })
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入数据库查询后返回的那种数据类型【Array】，
     * 返回：成功：true。失败：false
     */
    outputUsers: async function (results, callback) {
        let strArr = public.outputTitleArrUser;
        let data = [strArr];
        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            let keys = Object.keys(result);
            let arr = [];
            for (let j = 0; j < keys.length; j++) {
                let val;
                const k = keys[j];
                if (k == 'dep_id') {
                    val = await me.getDep({ dep_id: result[k] });
                    if (val.length != 0) {
                        arr.push(val[0].managerName);
                    } else {
                        arr.push('空');
                    }
                } else if (k == 'emp_id' || k == 'password') {
                    continue;
                } else if (k == 'gender') {
                    if (result[k] == 1) {
                        arr.push('男')
                    } else {
                        arr.push('女')
                    }
                } else if (k == 'type') {
                    val = await me.getRole({ role_id: result[k] });
                    if (val.length != 0) {
                        arr.push(val[0].name);
                    } else {
                        arr.push('空');
                    }
                } else if (k == 'registTime' || k == 'logTime' || k == 'submitTime') {
                    val = new Date(result[k]).toLocaleTimeString();
                    arr.push(val);
                } else if (k == 'power_type') {
                    if (result[k] == 1) {
                        arr.push('否')
                    } else {
                        arr.push('是')
                    }
                } else {
                    arr.push(result[k]);
                }
            }
            data.push(arr);
        }
        let buffer = xlsx.build([{ name: "sheet1", data: data }]);
        let timeStr = new Date().getTime()
        let pathStr = path.join(__dirname, "../public/" + excelFile + "/" + timeStr + ".xlsx");
        fs.writeFile(pathStr, buffer, 'binary', function (err) {
            if (err) {
                console.log(err);
                callback('false', null);
            } else {
                timer.deleteExcel(pathStr)
                callback('true', pathStr);
            }
        });
    }
}

module.exports = me;