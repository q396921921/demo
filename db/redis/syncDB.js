// sync to mysql db
const dbRedis = require('./redis_conn.js');
// mysql
const queryOrder = require('./../../db/mysql/queryOrder');
const queryEmp = require('./../db/../mysql/queryEmp');
const queryData = require('./../db/../mysql/queryData');
const pool = require('../mysql/pool');
const promise = require('bluebird');
// redis
const mo = require('./../../routes/methodOrder');
const me = require('./../../routes/methodEmp');
const md = require('./../../routes/methodData');
const ms = require('./../../routes/methodSS');

const async = require('async');
const client = dbRedis.client;
const sync = {};
sync.product = async function (cb) {
    try {
        let mysql = await queryOrder.getProduct({ mysql: "", arr: [] });
        let redis = await mo.getProduct("");
        await syncData(mysql, redis, 'product_id', 'product');
    } catch (err) {
        cb('error');
    }
}
sync.chatroom = async function (cb) {
    try {
        let mysql = await queryEmp.getChatroom();
        let redis = await ms.getChatroom("");
        await syncData(mysql, redis, 'chat_id', 'chatroom');
    } catch (err) {
        cb('error');
    }
}
sync.data_business = async function (cb) {
    try {
        let mysql = await queryData.getbusiness({}, []);
        let redis = await md.getData_business("");
        await syncData(mysql, redis, 'bus_id', 'data_business');
    } catch (err) {
        cb('error');
    }
}
sync.data_home_page = async function (cb) {
    try {
        let mysql = await queryData.gethome_page({}, []);
        let redis = await md.getData_home_page("");
        await syncData(mysql, redis, 'home_id', 'data_home_page');
    } catch (err) {
        cb('error');
    }
}
sync.data_partner = async function (cb) {
    try {
        let mysql = await queryData.getpartner({}, []);
        let redis = await md.getData_partner("");
        await syncData(mysql, redis, 'partner_id', 'data_partner');
    } catch (err) {
        cb('error');
    }
}
sync.data_zizhi = async function (cb) {
    try {
        let mysql = await queryData.getzizhi({}, []);
        let redis = await md.getData_zizhi("");
        await syncData(mysql, redis, 'zizhi_id', 'data_zizhi');
    } catch (err) {
        cb('error');
    }
}
sync.dep = async function (cb) {
    try {
        let mysql = await queryEmp.getDep({}, []);
        let redis = await me.getDep("");
        await syncData(mysql, redis, 'dep_id', 'dep');
    } catch (err) {
        cb('error');
    }
}
sync.detail_file_type = async function (cb) {
    try {
        let mysql = await queryOrder.getDetailFileType();
        let redis = await mo.getDetail_file_type("");
        await syncData(mysql, redis, 'detail_file_type_id', 'detail_file_type');
    } catch (err) {
        cb('error');
    }
}
sync.emp = async function (cb) {
    try {
        let mysql = await queryEmp.getEmp(obj);
        let redis = await me.getEmp("");
        await syncData(mysql, redis, 'emp_id', 'emp');
    } catch (err) {
        cb('error');
    }
}
sync.file_types_num = async function (cb) {
    try {
        let mysql = await queryOrder.getFile_typeNameId({}, []);
        let redis = await mo.getFile_types_num("");
        await syncData(mysql, redis, 'file_type_id', 'file_types_num');
    } catch (err) {
        cb('error');
    }
}
sync.flow = async function (cb) {
    try {
        let mysql = await queryOrder.getFlowNameId({}, []);
        let redis = await mo.getFlow("");
        await syncData(mysql, redis, 'flow_id', 'flow');
    } catch (err) {
        cb('error');
    }
}
sync.flow_detail = async function (cb) {
    try {
        let mysql = await queryOrder.getFlow({}, []);
        let redis = await mo.getFlow_detail("");
        await syncData(mysql, redis, 'flow_detail_id', 'flow_detail');
    } catch (err) {
        cb('error');
    }
}
sync.message = async function (cb) {
    try {
        let mysql = await queryOrder.getAllMessage({}, []);
        let redis = await ms.getMessage("");
        await syncData(mysql, redis, 'mes_id', 'message');
    } catch (err) {
        cb('error');
    }
}
sync.news = async function (cb) {
    try {
        let mysql = await queryData.getNews({}, []);
        let redis = await md.getNews("");
        await syncData(mysql, redis, 'new_id', 'news');
    } catch (err) {
        cb('error'); 
    }
}
// xxxxxxxxxxxxx
sync.product = async function (cb) {
    try {
        let mysql = await queryOrder.getOrder({}, []);
        let redis = await mo.getProduct("");
        await syncData(mysql, redis, 'product_id', 'product');
    } catch (err) {
        cb('error');
    }
}
sync.product_type = async function (cb) {
    try {
        let mysql = await queryOrder.getProductType({}, []);
        let redis = await mo.getProduct_type("");
        await syncData(mysql, redis, 'product_type_id', 'product_type');
    } catch (err) {
        cb('error');
    }
}
sync.relation_emp_resource = async function (cb) {
    try {
        let mysql = await queryEmp.getEmpResource({}, []);
        let redis = await me.getRelation_emp_resource("");
        await syncData(mysql, redis, 'id', 'relation_emp_resource');
    } catch (err) {
        cb('error');
    }
}

sync.relation_emp_role = async function (cb) {
    try {
        let mysql = await queryEmp.getRoleResource({}, []);
        let redis = await me.getRelation_emp_role("");
        await syncData(mysql, redis, 'id', 'relation_emp_role');
    } catch (err) {
        cb('error');
    }
}
sync.relation_file_type_detail = async function (cb) {
    try {
        let mysql = await queryOrder.getrelation_file_type_detail({}, []);
        let redis = await mo.getRelation_file_type_detail("");
        await syncData(mysql, redis, 'id', 'relation_file_type_detail');
    } catch (err) {
        cb('error');
    }
}
sync.relation_flow_detail = async function (cb) {
    try {
        let mysql = await queryOrder.getRelationFlow({}, []);
        let redis = await mo.getRelation_flow_detail("");
        await syncData(mysql, redis, 'id', 'relation_flow_detail');
    } catch (err) {
        cb('error');
    }
}
sync.relation_order_state = async function (cb) {
    try {
        let mysql = await queryOrder.getOrderState({}, []);
        let redis = await mo.getRelation_order_state("");
        await syncData(mysql, redis, 'relation_state_id', 'relation_order_state');
    } catch (err) {
        cb('error');
    }
}
sync.relation_product_dep = async function (cb) {
    try {
        let mysql = await queryOrder.getOffByProduct_id({}, []);
        let redis = await mo.getRelation_product_dep("");
        await syncData(mysql, redis, 'id', 'relation_product_dep');
    } catch (err) {
        cb('error');
    }
}
sync.relation_role_resource = async function (cb) {
    try {
        let mysql = await queryEmp.getRoleResource({}, []);
        let redis = await me.getRelation_role_resource("");
        await syncData(mysql, redis, 'id', 'relation_role_resource');
    } catch (err) {
        cb('error');
    }
}
sync.relation_state_flow = async function (cb) {
    try {
        let mysql = await queryOrder.getStateFlow({}, []);
        let redis = await mo.getRelation_state_flow("");
        await syncData(mysql, redis, 'id', 'relation_state_flow');
    } catch (err) {
        cb('error');
    }
}
sync.resource = async function (cb) {
    try {
        let mysql = await queryEmp.getResource({}, []);
        let redis = await me.getResource("");
        await syncData(mysql, redis, 'resource_id', 'resource');
    } catch (err) {
        cb('error');
    }
}
sync.role = async function (cb) {
    try {
        let mysql = await queryEmp.getRole({}, []);
        let redis = await me.getRole("");
        await syncData(mysql, redis, 'role_id', 'role');
    } catch (err) {
        cb('error');
    }
}
sync.state_detail = async function (cb) {
    try {
        let mysql = await queryOrder.getStateDetail({}, []);
        let redis = await mo.getState_detail("");
        await syncData(mysql, redis, 'state_detail_id', 'state_detail');
    } catch (err) {
        cb('error');
    }
}
sync.total_profit = async function (cb) {
    try {
        let mysql = await queryOrder.getProfit();
        let redis = await mo.getTotal_profit("");
        await syncData(mysql, redis, 'id', 'total_profit');
    } catch (err) {
        cb('error');
    }
}


var syncData = promise.promisify(async function (mysql, redis, IdName, tName, cb) {
    try {
        if (redis) {
            let count = 0;
            async.eachSeries(redis, function (rds, cb2) {
                (async function () {
                    count = await judge(mysql, rds, count, IdName, tName);
                    cb2();
                })()
            }, function (err) {
                cb(null, 'success');
            })
        } else {
            cb(null, 'success');
        }
    } catch (err) {
        cb('error');
    }
})
// repet this function
var judge = promise.promisify(async function (mysql, rds, count, IdName, tName, cb) {
    try {
        let Id1 = rds[IdName];
        let keys = Object.keys(rds);
        let vals = Object.values(rds);
        if (mysql.length >= (count + 1)) {
            // update or not change
            let Id2 = mysql[count][IdName];
            if (Id1 === Id2) {
                if (JSON.stringify(rds) === JSON.stringify(mysql[count])) {
                    cb(null, ++count);

                } else {
                    let ret = await update(keys, vals, IdName, tName);
                    cb(null, ++count);
                }
            } else {
                // delete this mysql mysql and insert
                if (Id1 > Id2) {
                    let arr = [Id2];
                    let sql = "delete from " + tName + ' where ' + IdName + '=?';
                    let ret = await db(sql, arr);
                    count++;
                    judge(mysql, rds, count, IdName, tName, cb);
                } else {
                    let ret = await insert(keys, vals, tName);
                    cb(null, count);
                }
            }
        } else {
            // insert
            let ret = await insert(keys, vals, tName);
            cb(null, ++count);
        }
    } catch (err) {
        cb('error');
    }
})
var update = promise.promisify(async function (keys, vals, IdName, tName, cb) {
    try {
        let set = "";
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (i != keys.length - 1) {
                set += ' ' + k + '=?,';
            } else {
                set += ' ' + k + '=?';
            }
        }
        let arr = vals.concat([Id1]);
        let sql = 'update ' + tName + ' set' + set + ' where ' + IdName + '=?';
        let ret = await db(sql, arr);
        cb(null, ret);
    } catch (err) {
        cb('error');
    }
})
var insert = promise.promisify(async function (keys, vals, tName, cb) {
    try {
        let circle1 = "";
        let circle2 = "";
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (i != keys.length - 1) {
                circle1 += k + ',';
                circle2 += '?,';
            } else {
                circle1 += k;
                circle2 += '?';
            }
        }
        let sql = "insert into " + tName + "(" + circle1 + ") values (" + circle2 + ")";
        let ret = await db(sql, vals);
        cb(null, ret)
    } catch (err) {
        cb('error');
    }
})
const db = promise.promisify(function (sql, arr, cb) {
    pool.getConn(sql, arr, (err, ret) => {
        if (err) {
            cb('error');
        } else {
            cb(null, ret);
        }
    })
})

module.exports = sync;