const websocket = {};
const WebSocketServer = require('ws').Server;
const fs = require('fs')
const mdOrder = require('./routes/methodOrder');
const request = require('request');
const async = require('async');
const pathUrl = require('path');
const UUID = require('uuid');
const debug = require('debug')('app:server');
const log4js = require('log4js');
const log = require('./routes/log');

const public = require("./public/public");
const symbol = public.symbol;
const path = public.path2;

// 此方法开启长连接服务器，只需要在任意js文件调用即可
websocket.getSocketio = function (port) {
    var wss = new WebSocketServer(port);
    console.log(`端口为${port.port}的长连接服务器已开启`);
    var count = 1;
    useLog4jsConfig();
    let t1 = new Date();
    let hours = 23 - t1.getHours();
    let minute = 59 - t1.getMinutes();
    let second = 59 - t1.getSeconds();
    let milliseconds = 1000 - t1.getMilliseconds();
    let totalMillisecods = (hours * 60 * 60 + minute * 60 + second) * 1000;
    let resetTime = setInterval(function () {
        count = 1;
        useLog4jsConfig();
        clearInterval(resetTime)
        // 将订单编号尾部id重置为1
        setInterval(function () {
            count = 1;
            mdOrder.setCount({ "count": count }, (err, ret) => {
                if (ret != 'success') {
                    console.log('订单尾号赋值失败');
                    console.log('此时订单尾号值为:' + count);
                }
            })
            useLog4jsConfig();
        }, 86400000)
        // 同步redis到数据库
        setTimeout(() => {
            setInterval(function () {

            }, 86400000)
        }, 7200000);
    }, totalMillisecods)

    let fileUrl = pathUrl.join(__dirname, '/public/' + public.userfile)
    wss.on('connection', function (ws) {
        var wsState = true;
        console.log('用户连接成功');
        var imgCounts = 1;
        let order_arr = [];
        let filesPath = "";
        // 接收客户端传过来的消息的时候触发
        ws.on('message', function (message) {
            if (typeof (message) == 'string') {
                message = JSON.parse(message)
            }
            let event = message.event;
            if (event == 'dataOver') {
                let order_id = message.or_id;
                // 获取商品id，以此获得他所对应的流程
                let product_id = message.product_id;
                let order_type = message.order_type;
                message.orderFile = filesPath;
                request({ url: path + 'updateOrder', method: "post", body: message, json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // 如果返回success的话证明这个订单创建成功了，这个时候就要把所有的流程与状态在中间表创建好
                        if (body == 'success') {
                            if (order_type == 1) {
                                request({ url: path + 'createOrderFlow', method: "post", body: { product_id: product_id, order_id: order_id }, json: true }, (err, res, body) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        // // 如果返回success的话证明这个订单的状态创建好了
                                        // request({ url: public.otherpath + '/management/creatChatroom', method: "post", body: { order_id: order_id }, json: true }, (err, res, body) => {
                                        //     if (err) {
                                        //         console.log(err);

                                        //     } else {
                                        //         // 如果返回success的话证明这个订单的状态创建好了
                                        //         if (body == 'success') {
                                        //             console.log('创建聊天房间成功');
                                        //         }
                                        //     }
                                        // })
                                        console.log('我是申请订单');
                                        if (wsState) {
                                            ws.send(JSON.stringify({ 'event': 'orderOver' }));
                                        }
                                    }
                                })
                            } else if (order_type == 2) {
                                request({ url: public.otherpath + '/management/creatChatroom', method: "post", body: { order_id: order_id }, json: true }, (err, res, body) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        // 如果返回success的话证明这个订单的状态创建好了
                                        if (body == 'success') {
                                            console.log('创建聊天房间成功');
                                        }
                                    }
                                })
                                if (wsState) {
                                    ws.send(JSON.stringify({ 'event': 'orderOver' }));
                                }
                            } else {
                                if (wsState) {
                                    ws.send(JSON.stringify({ 'event': 'orderOver' }));
                                }
                            }
                        }
                    }
                })
            }
            if (event == 'imgs') {
                let data = message.data;
                let order_id = message.or_id;
                let tel = message.tel;
                async.each(data, function (val, cb) {
                    let arrr = Object.values(val);
                    let buf = new Uint8Array(arrr);

                    let userPath = pathUrl.join(fileUrl, symbol + tel);
                    let orderPath = pathUrl.join(userPath, symbol + order_id);
                    let ID = UUID.v1();
                    let filePath = pathUrl.join(orderPath, symbol + ID + '.jpg');
                    // 这里需要修改
                    let realPath = orderPath.split(public.userfile + symbol)[1];

                    filesPath += realPath + symbol + ID + '.jpg;';
                    if (fs.existsSync(userPath)) {
                        if (fs.existsSync(orderPath)) {
                            fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                                if (err) throw err
                                else {
                                    cb();
                                }
                            })
                        } else {
                            fs.mkdirSync(orderPath);
                            fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                                if (err) throw err
                                else {
                                    cb();
                                }
                            })
                        }
                    } else {
                        fs.mkdirSync(userPath);
                        fs.mkdirSync(orderPath);
                        fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                            if (err) throw err
                            else {
                                cb();
                            }
                        })
                    }
                }, function (err) {
                    if (wsState) {
                        ws.send(JSON.stringify({ 'event': 'imgOver' }))
                    }
                })
            }
            if (event == 'createOrder') {
                mdOrder.getTotal_profit("", (err, ret) => {
                    if (err) {
                        console.log(err);
                    } else {
                        count = ret[0].count
                        let order_type = message.order_type;
                        request({ url: path + 'createOrder', method: "post", body: { order_type: order_type, appli_id: count++ }, json: true }, (err, res, body) => {
                            if (err) {
                                console.log(err);
                            } else {
                                mdOrder.setCount({ "count": count }, (err, ret) => {
                                    if (ret != 'success') {
                                        debug('订单尾号赋值失败');
                                        debug('此时订单尾号值为:' + count);
                                    }
                                })
                                let order_id = body
                                let order_id_type = { order_id, order_type };
                                // 将订单id以及订单类型传入总数组中
                                order_arr.push(order_id_type);
                                if (wsState) {
                                    ws.send(JSON.stringify({ 'event': 'getOrder_id', 'order_id': order_id }));
                                }
                            }
                        })
                    }
                })
            }
        });

        // 用户断开连接的时候触发此事件
        ws.on('close', function (close) {
            wsState = false;
            console.log('长连接关闭了,创建了订单id', order_arr);
            if (order_arr.length != 0) {
                order_arr = JSON.stringify(order_arr);
                request({ url: path + 'deleteOrder', method: 'post', body: { order_arr: order_arr, count: count }, json: true }, (err, res, body) => { })
            }
        });
    });
}

function useLog4jsConfig() {
    log4js.configure({
        replaceConsole: true,
        appenders: {
            stdout: {//控制台输出
                type: 'stdout'
            },
            control: { //操作日志
                type: 'dateFile',
                filename: 'logs/controlLog/',
                pattern: 'control-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            },
            login: {
                type: 'dateFile',
                filename: 'logs/loginLog/',
                pattern: 'login-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            },
            err: {  //错误日志
                type: 'dateFile',
                filename: 'logs/errLog/',
                pattern: 'err-yyyy-MM-dd.log',
                alwaysIncludePattern: true
            }
        },
        categories: {
            default: { appenders: ['stdout', 'control'], level: 'info' },//appenders:采用的appender,取appenders项,level:设置级别
            err: { appenders: ['stdout', 'err'], level: 'error' },
            login: { appenders: ['stdout', 'login'], level: 'info' },
        }
    })
}
module.exports = websocket;