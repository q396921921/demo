var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var queryEmp = require('./../db_mysql/queryEmp')
var otherEmp = require('./../db_mysql/otherEmp')
var async = require('async')
var momoent = require('moment');
var xlsx = require('node-xlsx');
var path = require('path');
var timer = require('./timer');
var debug = require('debug')('app:server');
var public = require('./../public/public');
var excelFile = public.excelFileCreate;

module.exports = {
    /**
     * 删除部门正或副经理
     * 传入正或副经理部门表对应的字段，以及账户id，以及部门id
     */
    deleteManager: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let dep_id = body.dep_id;
            let name = body.name;
            if (name == 'manager_id') {
                await otherEmp.allotManager(1, [null, dep_id]);
            } else if (name == 'manager2_id') {
                await otherEmp.allotManager(2, [null, dep_id]);
            } else if (name == 'manager3_id') {
                await otherEmp.allotManager(3, [null, dep_id]);
            }
            await otherEmp.deleteDepUser([emp_id]);
            cb('success');
        } catch (err) {
            cb('error')
        }
    },
    /**
     * 传入部门id并删除此部门
     */
    deleteDep: async function (body, cb) {
        try {
            let obj = {};
            let dep_id = body.dep_id;
            obj.data = { dep_id: dep_id };
            obj.arr[dep_id];
            let ret = await queryEmp.getEmp(obj);
            if (ret.length != 0) {
                cb('empExist')
            } else {
                await otherEmp.deleteDep([dep_id]);
                cb('success')
            }
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入账户id的数组，与部门id，将此账户从部门中删除
     */
    deleteDepUser: async function (body, cb) {
        let emp_id_arr = body.emp_id_arr;
        async.each(emp_id_arr, function (emp_id, cb2) {
            (async function () {
                try {
                    await otherEmp.deleteDepUser([emp_id]);
                    cb2();
                } catch (err) {
                    cb('error');
                }
            })()
        }, function (err) {
            cb('success');
        })
    },
    /**
     * 传入账户id，正副经理字段，以及部门id。
     * 为部门分配经理
     */
    allotManager: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let dep_id = body.dep_id;
            let name = body.name;
            let num = null;
            let ret = await queryEmp.getDep({ dep_id: dep_id }, [dep_id]);
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
            let ret2 = await queryEmp.getAllEmpNotAllot({ emp_id, emp_id }, [emp_id]);
            if (ret2.length == 0) {
                cb('userexist');
            } else {
                await otherEmp.allotUser([dep_id, emp_id]);
                await otherEmp.allotManager(num, [emp_id, dep_id]);
                cb('success');
            }
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入部门id，与员工id
     * 将相应的员工分配到相应的部门
     */
    allotUser: async function (body, cb) {
        let dep_id = body.dep_id;
        let emp_id_arr = body.emp_id_arr;
        async.each(emp_id_arr, function (emp_id, cb2) {
            (async function () {
                try {
                    let ret = await queryEmp.getAllEmpNotAllot({ emp_id, emp_id }, [emp_id]);
                    if (ret.length == 0) {
                        cb('userexist');
                    } else {
                        await otherEmp.allotUser([dep_id, emp_id]);
                        cb2();
                    }
                } catch (err) {
                    cb('error');
                }
            })()
        }, function (err) {
            cb('success');
        })
    },
    /**
     * 无须传入数据，获得未被分配的员工
     */
    getAllEmpNotAllot: async function (body, cb) {
        try {
            let type = body.type;
            let ret = await queryEmp.getAllEmpNotAllot({ type: type }, [type]);
            cb(JSON.stringify({ "data": ret }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 获取所有部门
     */
    getAllDep: async function (body, cb) {
        try {
            let ret = await queryEmp.getDep({}, []);
            cb(JSON.stringify({ data: ret }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入部门名字，创建一个部门
     */
    createDep: async function (body, cb) {
        try {
            let managerName = body.managerName;
            await otherEmp.createDep([managerName]);
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入用户id
     * 删除此账户
     */
    deleteUser: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            await otherEmp.deleteEmpResource([emp_id]);
            await otherEmp.deleteUser([emp_id]);
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入用户id
     * 使用户对应权限为角色
     */
    recoverPower: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            await otherEmp.deleteEmpResource([emp_id]);
            await otherEmp.recoverPower([emp_id]);
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 通过emp_id或username获得用户
     */
    getEmp: async function (body, cb) {
        try {
            let obj = {};
            let emp_id = body.emp_id;
            let username = body.username;
            let type = body.type;
            let dep_id = body.dep_id;
            obj.data = { dep_id: dep_id, emp_id: emp_id, username: username, type: type };
            obj.arr = [dep_id, emp_id, username, type];
            let ret = await queryEmp.getEmp(obj);
            cb(JSON.stringify({ data: ret }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * {username:xx,password:xx}
     * 返回成功或失败
     */
    getUserByUserPass: async function (body, cb) {
        try {
            let obj = {};
            let username = body.username;
            let password = body.password;
            obj.data = { username: username, password: password };
            obj.arr = [username, password];
            if (password && password != "" && username && username != "") {
                let ret = await queryEmp.getEmp(obj);
                if (ret.length != 0) {
                    cb(JSON.stringify({ "data": ret[0] }))
                } else {
                    cb('error')
                }
            } else {
                cb('error')
            }
        } catch (err) {
            console.log(err);
            cb('error');
        }
    },
    /**
     * 
     * @param {JSON} body 
     * @param {callback} cb
     * 通过传入emp_id单独得到用户的名字 
     */
    getEmpName: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let type = body.type;
            let ret = await queryEmp.getEmpIdAndName({ emp_id: emp_id, type: type }, [emp_id, type]);
            cb(JSON.stringify({ "data": ret }));
        } catch (err) {
            cb('error');
        }
    },
    // 通过emp_id修改用户的信息
    updateUser6: async function (body, cb) {
        try {
            let obj = {};
            let emp_id = body.emp_id;
            let iiuv = body.iiuv;
            obj.data = { "iiuv": iiuv, "type": 5 };
            obj.arr = [iiuv, 5];
            let ret = await queryEmp.getEmp(obj);
            if (ret.length == 1) {
                await otherEmp.updateUser6([iiuv, emp_id]);
                cb('success')
            } else {
                cb('nouser')
            }
        } catch (err) {
            cb('error');
        }
    },
    // 修改账户的基本信息
    updateUserInfo: async function (body, cb) {
        try {
            let name = body.name;
            let repassword = body.repassword;
            let username = body.username;
            let tel = body.tel;
            let idCard = body.idCard;
            await otherEmp.updateUserInfo([name, tel, idCard, tel, username], repassword);
            cb('success')
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入null
     * 返回所有角色
     */
    getRoles: async function (body, cb) {
        try {
            let ret = await queryEmp.getRole({}, []);
            cb(JSON.stringify({ data: ret }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * 传入json对象dep_id:xxx（部门id）
     * 返回相应的部门信息
     */
    getDep: async function (body, cb) {
        try {
            let dep_id = body.dep_id;
            let ret = await queryEmp.getDep({ "dep_id": dep_id }, [dep_id]);
            cb(JSON.stringify({ result: ret }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * @param {JSON} body   {username:xxx}
     * @param {Function} cb (data)
     * 返回这个唯一用户名的角色信息以及推荐码
     * {data:[{},{},{}...,iiuv]}
     */
    getRole: async function (body, cb) {
        try {
            let obj = {};
            let username = body.username;
            obj.data = { username: username };
            obj.arr = [username];
            let rslt = await queryEmp.getEmp(obj);
            let code = rslt[0].type;
            let rst = await queryEmp.getRole({ code: code }, [code]);
            rst.push(rslt)
            cb(JSON.stringify({ data: rst }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * @param {JSON} body   {password:xxx, num:xx, code:xxx}
     * 成功返回success,失败返回error
     * 
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
                    let rt = await otherEmp.getBigIIUV();
                    let keys = Object.keys(rt[0]);
                    let biggerIIUV = rt[0][keys[0]];
                    if (biggerIIUV > bigIIUV) {
                        bigIIUV = biggerIIUV;
                    }
                    while (true) {
                        let obj = {};
                        obj.data = { username: username };
                        obj.arr = [username];
                        let rslt = await queryEmp.getEmp(obj);
                        if (rslt.length > 0) {
                            username = Math.floor(Math.random() * 100000 + 100000);
                            if (username > 1000000) {
                                username = username - 100000;
                            }
                            break;
                        } else {
                            // 如果没有，创建这个用户
                            await otherEmp.insertUser5([username, password, username, code, ++bigIIUV, new Date()]);
                            userArr.push({ "username": username, "password": password, "iiuv": bigIIUV });
                            break;
                        }
                    }
                }
                callback(JSON.stringify({ 'userArr': userArr }));
            } else {
                for (let i = 0; i < nums.length; i++) {
                    const num = nums[i];
                    while (true) {
                        let ralt = await queryEmp.getEmp({ "username": username }, [username]);
                        if (rslt.length > 0) {
                            username = Math.floor(Math.random() * 100000 + 100000);
                            if (username > 1000000) {
                                username = username - 100000;
                            }
                            break;
                        } else {
                            // 如果没有，创建这个用户
                            await otherEmp.insertUser([username, password, username, code, new Date()]);
                            userArr.push({ "username": username, "password": password, "iiuv": '' });
                            break;
                        }
                    }
                }
                callback(JSON.stringify({ 'userArr': userArr }));
            }
        } catch (err) {
            callback('error');
        }
    },
    /**
     * 通过权限类型与角色类型查找用户
     * @param {JSON} body   {power_type:xx,type:xx}
     */
    getEmpByType2: async function (body, cb) {
        try {
            let obj = {};
            let power_type = body.power_type;
            let limit = body.limit;
            let type = body.type;
            obj.data = { "power_type": power_type, "type": type };
            obj.arr = [power_type, type];
            obj.limit = limit;
            let rslt = await queryEmp.getEmp(obj);
            cb(JSON.stringify({ data: rslt }));
        } catch (err) {
            cb('error');
        }
    },
    /**
     * @param {JSON} body   {role_id:xx}
     * 返回所有权限以及此角色所拥有的权限
     */
    getAllResourcesChecked: async function (body, cb) {
        try {
            let id = body.id;
            let type = body.type
            let rslt = await queryEmp.getResource({}, []);
            let arr = [];
            if (type == 'role') {
                let rslt2 = await queryEmp.getRoleResource({ "role_id": id }, [id]);
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            } else if (type == 'user') {
                let rslt2 = await queryEmp.getEmpResource({ emp_id: id }, [id]);
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            }
        } catch (err) {
            cb('error')
        }
    },
    /**
     * 将所有人的power_type的值变为1，即对应角色权限
     * null
     * 返回sucess或者rror
     */
    recoverAllreource: async function (body, cb) {
        try {
            await otherEmp.deleteALlEmpResource([]);
            await otherEmp.recoverAllreource([1]);
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
        this.getEmpByType2(body, (ret) => {
            ret = JSON.parse(ret).data
            this.outputUsers(ret, (flag, data) => {
                if (flag == 'true') {
                    cb(data)
                } else {
                    cb('error')
                }
            })
        })
    },
    /**
     * @param {JSON} body
     * {role_id:xx, resource_id:[x,y,z...]}
     */
    updateRoleResource: async function (body, cb) {
        try {
            let role_id = body.role_id;
            let resource_id_arr = body.resource_id
            await otherEmp.deleteRoleResource([role_id]);
            async.each(resource_id_arr, function (resource_id, cb2) {
                (async function () {
                    await otherEmp.insertRoleResource([role_id, resource_id]);
                    cb2();
                })()
            }, function (err) {
                cb('success')
            })
        } catch (err) {
            cb('error');
        }
    },
    // 通过用户id，获得他的权限
    getOneUserResource: async function (body, cb) {
        try {
            let obj = {};
            let emp_id = body.emp_id;
            obj.data = { "emp_id": emp_id };
            obj.arr = [emp_id];
            let rslt = await queryEmp.getResource({}, []);
            let ret = await queryEmp.getEmp(obj);
            let power_type = ret[0].power_type;
            let type = ret[0].type;
            let arr = [];
            if (power_type == 1) {
                let rslt2 = await queryEmp.getRoleResource({ "role_id": type }, [type]);
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            } else {
                let rslt2 = await queryEmp.getEmpResource({ emp_id: emp_id }, [emp_id]);
                arr.push(rslt)
                arr.push(rslt2);
                cb(JSON.stringify({ data: arr }))
            }
        } catch (err) {
            cb('error');
        }
    },
    /**
     * @param {JSON}   body     {emp_id:[x,y,z...],resource_id:[x,y,z...]}
     */
    updateRoleToUser: async function (body, cb) {
        let emp_id_arr = body.emp_id;
        let resource_id_arr = body.resource_id
        async.each(emp_id_arr, function (emp_id, cb2) {
            async.auto({
                deleteUserResource: function (cb3) {
                    (async function () {
                        try {
                            await otherEmp.deleteUserResource([emp_id]);
                            cb3(null, "1");
                        } catch (err) {
                            cb('error');
                        }
                    })()
                },
                updatePower_type: function (cb3) {
                    (async function () {
                        try {
                            await otherEmp.updateUserPower_type([2, emp_id]);
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
                                    await otherEmp.insertUserResource([emp_id, resource_id]);
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
    /**
     * @param {JSON} body   {emp_id:xxx,resource_id:[x,y,x...]}
     */
    updateUserResource: async function (body, cb) {
        try {
            let emp_id = body.emp_id;
            let resource_id_arr = body.resource_id
            await otherEmp.deleteUserResource([emp_id]);
            async.each(resource_id_arr, function (resource_id, cb2) {
                (async function () {
                    try {
                        await otherEmp.insertUserResource([emp_id, resource_id]);
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
        async.eachSeries(results, function (result, cb) {
            let keys = Object.keys(result);
            let arr = [];
            async.eachSeries(keys, function (k, cb2) {
                if (k == 'dep_id') {
                    getDep(result[k], (rt) => {
                        arr.push(rt);
                        cb2()
                    })
                } else if (k == 'emp_id' || k == 'password') {
                    cb2()
                } else if (k == 'gender') {
                    if (result[k] == 1) {
                        arr.push('男')
                    } else {
                        arr.push('女')
                    }
                    cb2()
                } else if (k == 'type') {
                    getRole(result[k], (rt) => {
                        arr.push(rt)
                        cb2()
                    })
                } else if (k == 'bus_id') {
                    getUser({ bus_id: result[k] }, (rt) => {
                        arr.push(rt)
                        cb2()
                    })
                } else if (k == 'off_id') {
                    getUser({ off_id: result[k] }, (rt) => {
                        arr.push(rt)
                        cb2()
                    })
                } else if (k == 'registTime' || k == 'logTime' || k == 'submitTime') {
                    let time = Date.parse(new Date(result[k]));
                    getTime(time, (rt) => {
                        arr.push(rt)
                        cb2()
                    })
                } else if (k == 'power_type') {
                    if (result[k] == 1) {
                        arr.push('否')
                    } else {
                        arr.push('是')
                    }
                    cb2('over')
                } else {
                    arr.push(result[k])
                    cb2()
                }
            }, function (err) {
                data.push(arr);
                cb()
            })
        }, function (err, rst) {
            let buffer = xlsx.build([{ name: "sheet1", data: data }]);
            let timeStr = new Date().getTime()
            let pathStr = path.join(__dirname, '../excelFile/' + timeStr + '.xlsx');
            fs.writeFile(pathStr, buffer, 'binary', function (err) {
                if (err) {
                    callback('false', null);
                }
                else {
                    timer.deleteExcel(pathStr)
                    callback('true', pathStr);
                }
            });
        })
    }
}

// 处理账户信息导出excel的方法
async function getDep(dep_id, cb) {
    try {
        if (dep_id) {
            let rst = await queryEmp.getDep({ "dep_id": dep_id }, [dep_id]);
            cb(rst[0].managerName);
        } else {
            cb('无')
        }
    } catch (err) {
        cb('error');
    }
}
// 获取对应的角色名字
async function getRole(role_id, cb) {
    try {
        if (role_id) {
            let rst = await queryEmp.getRole({ "role_id": role_id }, [role_id]);
            if (rst.length != 0) {
                cb(rst[0].name);
            } else {
                cb('无')
            }
        } else {
            cb('无')
        }
    } catch (err) {
        cb('error');
    }
}
// 获得默认的内勤或者业务的名字
async function getUser(body, cb) {
    try {
        let obj = {};
        let buf_id = body.buf_id;
        let off_id = body.off_id;
        obj.data = { "buf_id": buf_id, "off_id": off_id };
        obj.arr = [buf_id, off_id];
        let rst = await queryEmp.getEmp(obj);
        if (rst.length > 1) {
            cb('暂无')
        } else {
            cb(rst[0].name);
        }
    } catch (err) {
        cb('error');
    }
}

function getTime(timestamp, cb) {
    var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate();
    if (D < 10) {
        D = '0' + D + ' '
    } else {
        D = D + ' '
    }
    h = date.getHours();
    if (h < 10) {
        h = '0' + h + ':'
    } else {
        h = h + ':'
    }
    m = date.getMinutes();
    if (m < 10) {
        m = '0' + m;
    }
    cb(Y + M + D + h + m)
}