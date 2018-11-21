const db = require('./redis_conn.js');
const queryOrder = require('./../../db/mysql/queryOrder');
const queryEmp = require('./../db/../mysql/queryEmp');
const queryData = require('./../db/../mysql/queryData');

const async = require('async');
const copy = {};
const client = db.client


/**
 * 将mysql的product表的所有数据导入redis
 */
copy.product = async function (cb) {
    try {
        let obj = {};
        obj.arr = [];
        let ret = await queryOrder.getProduct(obj);
        async.each(ret, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('product', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制所有商品成功');
            cb('success');
        })
    } catch (err) {
        console.log(err);
        cb('error');
    }
}
/**
 * 将mysql商品表的所有聊天房间导入redis
 * 暂时不能用我没有这个查询方法
 */
copy.chatroom = async function (cb) {
    try {
        let data = await queryEmp.getChatroom();
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('chatroom', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制chatroom表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
};
/**
 * 将mysql管理前端data_business表的所有数据导入redis
 */
copy.data_business = async function (cb) {
    try {
        let data = await queryData.getbusiness({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('data_business', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制data_business表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的data_home_page的所有数据导入redis
 */
copy.data_home_page = async function (cb) {
    try {
        let data = await queryData.gethome_page({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('data_home_page', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制data_home_page表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的data_partner表的所有聊天房间导入redis
 */
copy.data_partner = async function (cb) {
    try {
        let data = await queryData.getpartner({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('data_partner', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制data_partner表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的data_zizhi表的所有资质导入redis
 */
copy.data_zizhi = async function (cb) {
    try {
        let data = await queryData.getzizhi({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('data_zizhi', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制data_zizhi表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的部门表的所有信息导入redis
 */
copy.dep = async function (cb) {
    try {
        let data = await queryEmp.getDep({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('dep', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制dep表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的detail_file_type表的所有数据导入redis
 */
copy.detail_file_type = async function (cb) {
    try {
        let data = await queryOrder.getDetailFileType();
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('detail_file_type', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制detail_file_type表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的emp表的所有数据导入redis
 */
copy.emp = async function (cb) {
    let obj = {};
    try {
        let data = await queryEmp.getEmp(obj);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('emp', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制emp表成功');
            cb('success');
        })
    } catch (err) {
        console.log(err);
        cb('error');
    }
}
/**
 * 将mysql的file_types_num表的所有数据导入redis
 */
copy.file_types_num = async function (cb) {
    try {
        let data = await queryOrder.getFile_typeNameId({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('file_types_num', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制file_types_num表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}



/**
 * 将mysql的flow表的所有数据导入redis
 */
copy.flow = async function (cb) {
    try {
        let data = await queryOrder.getFlowNameId({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('flow', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制flow表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的flow_detail表的所有数据导入redis
 */
copy.flow_detail = async function (cb) {
    try {
        let data = await queryOrder.getFlow({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('flow_detail', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制flow表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的message表的所有数据导入redis
 */
copy.message = async function (cb) {
    try {
        let data = await queryOrder.getAllMessage({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('message', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制message表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}


/**
 * 将mysql的order表的所有数据导入redis
 */
copy.order = async function (cb) {
    try {
        let data = await queryOrder.getOrder({}, []);
        async.each(data, function (rt, cb2) {
            let order_type = rt.order_type;
            let key;
            if (order_type == 1) {
                key = 'order1';
            } else if (order_type == 2) {
                key = 'order2';
            } else if (order_type == 3) {
                key = 'order3';
            }
            rt = JSON.stringify(rt);
            client.lpush(key, rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制order表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的product_type表的所有数据导入redis
 */
copy.product_type = async function (cb) {
    try {
        let data = await queryOrder.getProductType({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('product_type', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制product_type表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}

/**
 * 没有主键id
 * 将mysql的relation_emp_resource表的所有数据导入redis
 */
copy.relation_emp_resource = async function (cb) {
    try {
        let data = await queryEmp.getEmpResource({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_emp_resource', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_emp_resource表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 没有主键
 * 将mysql的relation_emp_role表的所有数据导入redis
 */
copy.relation_emp_role = async function (cb) {
    try {
        let data = await queryEmp.getRoleResource({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_emp_role', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_emp_role表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 没有主键
 * 将mysql的relation_file_type_detail表的所有数据导入redis
 */
copy.relation_file_type_detail = async function (cb) {
    try {
        let data = await queryOrder.getrelation_file_type_detail({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_file_type_detail', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_file_type_detail表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}

/**
 * 没有主键
 * 将mysql的relation_flow_detail表的所有数据导入redis
 */
copy.relation_flow_detail = async function (cb) {
    try {
        let data = await queryOrder.getRelationFlow({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_flow_detail', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_flow_detail表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的relation_order_state表的所有数据导入redis
 */
copy.relation_order_state = async function (cb) {
    try {
        let data = await queryOrder.getOrderState({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_order_state', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_order_state表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的relation_product_dep表的所有数据导入redis
 */
copy.relation_product_dep = async function (cb) {
    try {
        let data = await queryOrder.getOffByProduct_id({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_product_dep', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_product_dep表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的relation_role_resource表的所有数据导入redis
 */
copy.relation_role_resource = async function (cb) {
    try {
        let data = await queryEmp.getRoleResource({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_role_resource', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_role_resource表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的relation_state_flow表的所有数据导入redis
 */
copy.relation_state_flow = async function (cb) {
    try {
        let data = await queryOrder.getStateFlow({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('relation_state_flow', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制relation_state_flow表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的resource表的所有数据导入redis
 */
copy.resource = async function (cb) {
    try {
        let data = await queryEmp.getResource({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('resource', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制resource表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的role表的所有数据导入redis
 */
copy.role = async function (cb) {
    try {
        let data = await queryEmp.getRole({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('role', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制role表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的state_detail表的所有数据导入redis
 */
copy.state_detail = async function (cb) {
    try {
        let data = await queryOrder.getStateDetail({}, []);
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('state_detail', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制state_detail表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
/**
 * 将mysql的total_profit表的所有数据导入redis
 */
copy.total_profit = async function (cb) {
    try {
        let data = await queryOrder.getProfit();
        async.each(data, function (rt, cb2) {
            rt = JSON.stringify(rt);
            client.lpush('total_profit', rt, (err, ret) => {
                if (err) {
                    console.log(err);
                    cb('error');
                } else {
                    cb2()
                }
            })
        }, function (err) {
            console.log('复制total_profit表成功');
            cb('success');
        })
    } catch (err) {
        cb('error');
    }
}
function copyAll(callback) {
    async.auto([
        function (cb) {
            copy.chatroom((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('chatroom');
                }
            })
        },
        function (cb) {
            copy.data_business((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('data_business');
                }
            })
        },
        function (cb) {
            copy.data_home_page((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('data_home_page');
                }
            })
        },

        function (cb) {
            copy.data_partner((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('data_partner');
                }
            })
        },
        function (cb) {
            copy.data_zizhi((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('data_zizhi');
                }
            })
        },
        function (cb) {
            copy.dep((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('dep');
                }
            })
        },
        function (cb) {
            copy.detail_file_type((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('detail_file_type');
                }
            })
        },

        function (cb) {
            copy.emp((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('emp');
                }
            })
        },
        function (cb) {
            copy.file_types_num((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('file_types_num');
                }
            })
        },
        function (cb) {
            copy.flow((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('flow');
                }
            })
        },
        function (cb) {
            copy.flow_detail((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('flow_detail');
                }
            })
        },
        function (cb) {
            copy.message((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('message');
                }
            })
        },
        function (cb) {
            copy.order((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('order');
                }
            })
        },
        function (cb) {
            copy.product((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('product');
                }
            })
        },
        function (cb) {
            copy.product_type((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('product_type');
                }
            })
        },
        function (cb) {
            copy.relation_emp_resource((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_emp_resource');
                }
            })
        },
        function (cb) {
            copy.relation_emp_role((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_emp_role');
                }
            })
        },
        function (cb) {
            copy.relation_file_type_detail((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_file_type_detail');
                }
            })
        },
        function (cb) {
            copy.relation_flow_detail((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_flow_detail');
                }
            })
        },
        function (cb) {
            copy.relation_order_state((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_order_state');
                }
            })
        },
        function (cb) {
            copy.relation_product_dep((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_product_dep');
                }
            })
        },
        function (cb) {
            copy.relation_role_resource((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_role_resource');
                }
            })
        },
        function (cb) {
            copy.relation_state_flow((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('relation_state_flow');
                }
            })
        },
        function (cb) {
            copy.resource((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('resource');
                }
            })
        },
        function (cb) {
            copy.role((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('role');
                }
            })
        },
        function (cb) {
            copy.state_detail((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('state_detail');
                }
            })
        },
        function (cb) {
            copy.total_profit((ret) => {
                if (ret == 'success') {
                    cb();
                } else if (ret == 'error') {
                    callback('total_profit');
                }
            })
        },
    ], function (err, result) {
        if (err) {
            callback('error');
        } else {
            callback('success');
        }
    })
}
// copy.chatroom((ret) => {
//     console.log(ret);
// })
copyAll((ret) => {
    console.log(ret);
})
module.exports = copy;