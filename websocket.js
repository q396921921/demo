var websocket = {};
var WebSocketServer = require('ws').Server;
var fs = require('fs')
var mdOrder = require('./routes/methodOrder');
var request = require('request');
var async = require('async');
var pathUrl = require('path');
var UUID = require('uuid');
var debug = require('debug')('app:server');

var public = require("./public/public");
var symbol = public.symbol;

// 此方法开启长连接服务器，只需要在任意js文件调用即可
websocket.getSocketio = function (port) {
    var wss = new WebSocketServer(port);
    console.log(`端口为${port.port}的长连接服务器已开启`);
    var count = 1;
    mdOrder.getProfit((ret) => {
        count = JSON.parse(ret).data[0].count
    })
    let t1 = new Date();
    let hours = 23 - t1.getHours();
    let minute = 59 - t1.getMinutes();
    let second = 59 - t1.getSeconds();
    let milliseconds = 1000 - t1.getMilliseconds();
    let totalMillisecods = (hours * 60 * 60 + minute * 60 + second) * 1000;
    let resetTime = setInterval(function () {
        count = 1;
        clearInterval(resetTime)
        setInterval(function () {
            count = 1;
            mdOrder.setCount({ "count": count }, (err, ret) => {
                if (ret != 'success') {
                    console.log('订单尾号赋值失败');
                    console.log('此时订单尾号值为:' + count);
                }
            })
        }, 86400000)
    }, totalMillisecods)

    let fileUrl = pathUrl.join(__dirname, '/public/' + public.userfile)
    wss.on('connection', function (ws) {
        console.log('用户连接成功');
        var arr = [];
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
                request({ url: '/head/updateOrder', method: "post", body: message, json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // 如果返回success的话证明这个订单创建成功了，这个时候就要把所有的流程与状态在中间表创建好
                        if (body == 'success') {
                            if (order_type == 1) {
                                request({ url: '/head/createOrderFlow', method: "post", body: { product_id: product_id, order_id: order_id }, json: true }, (err, res, body) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        // 如果返回success的话证明这个订单的状态创建好了
                                        request({ url: 'https://oh2.daotongkeji.com/management/creatChatroom', method: "post", body: { order_id: order_id }, json: true }, (err, res, body) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                // 如果返回success的话证明这个订单的状态创建好了
                                                if (body == 'success') {
                                                    console.log('创建聊天房间成功');
                                                }
                                            }
                                        })
                                        ws.send(JSON.stringify({ 'event': 'orderOver' }));
                                    }
                                })
                            } else if (order_type == 2) {
                                request({ url: 'https://oh2.daotongkeji.com/management/creatChatroom', method: "post", body: { order_id: order_id }, json: true }, (err, res, body) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        // 如果返回success的话证明这个订单的状态创建好了
                                        if (body == 'success') {
                                            console.log('创建聊天房间成功');
                                        }
                                    }
                                })
                                ws.send(JSON.stringify({ 'event': 'orderOver' }));
                            } else {
                                ws.send(JSON.stringify({ 'event': 'orderOver' }));
                            }
                        }
                    }
                })
            }

            if (event == 'imgOver') {
                let order_id = message.or_id;
                let tel = message.tel;
                var buf = {
                    type: 'Buffer',
                    data: arr
                }
                arr = [];
                buf = new Buffer(buf);
                let userPath = pathUrl.join(fileUrl, symbol + tel);
                let orderPath = pathUrl.join(userPath, symbol + order_id);
                let ID = UUID.v1();
                let filePath = pathUrl.join(orderPath, symbol + ID + '.jpg');
                // 这里需要修改
                let realPath = orderPath.split(public.userfile + symbol)[1];

                filesPath += realPath + symbol + ID + '.jpg;';

                // 如果存在这个用户的文件夹，不创建否则创建。
                if (fs.existsSync(userPath)) {
                    if (fs.existsSync(orderPath)) {
                        fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                            if (err) throw err
                            else {
                                debug('传完一张图片');
                                ws.send(JSON.stringify({ 'imgOver': 1 }))
                            }
                        })
                    } else {
                        fs.mkdirSync(orderPath);
                        fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                            if (err) throw err
                            else {
                                debug('传完一张图片');
                                ws.send(JSON.stringify({ 'imgOver': 1 }))
                            }
                        })
                    }
                } else {
                    fs.mkdirSync(userPath);
                    fs.mkdirSync(orderPath);
                    fs.writeFile(filePath, buf, { encoding: 'utf8' }, (err) => {
                        if (err) throw err
                        else {
                            debug('传完一张图片');
                            ws.send(JSON.stringify({ 'imgOver': 1 }))
                        }
                    })
                }
            }
            if (event == 'imgs') {
                let data = message.data;
                // let aaa = data.replace('[', '');
                // aaa = aaa.replace(']', '')
                // aaa = aaa.replace(/"/g, '')
                // aaa = aaa.split(',');
                // let b = [];
                // for (let i = 0; i < aaa.length; i++) {
                //     b.push(parseInt(aaa[i]))
                // }
                arr = arr.concat(data);
            }
            if (event == 'createOrder') {
                let order_type = message.order_type;
                request({ url: '/head/createOrder', method: "post", body: { order_type: order_type, appli_id: count++ }, json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        mdOrder.setCount({ "count": count }, (err, ret) => {
                            if (ret != 'success') {
                                debug('订单尾号赋值失败');
                                debug('此时订单尾号值为:' + count);
                            }
                        })
                        let order_id = body.data
                        let order_id_type = { order_id, order_type };
                        // 将订单id以及订单类型传入总数组中
                        order_arr.push(order_id_type);
                        ws.send(JSON.stringify({ 'event': 'getOrder_id', 'order_id': order_id }));
                    }
                })
            }
        });

        // 用户断开连接的时候触发此事件
        ws.on('close', function (close) {
            debug('我关闭了');
            if (order_arr.length != 0) {
                order_arr = JSON.stringify(order_arr);
                request({ url: '/head/deleteOrder', method: 'post', body: { order_arr: order_arr }, json: true }, (err, res, body) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (body != 'error') {
                            count = count - parseInt(body);
                            mdOrder.setCount({ "count": count }, (err, ret) => {
                                if (ret != 'success') {
                                    console.log('订单尾号赋值失败');
                                    console.log('此时订单尾号值为:' + count);
                                }
                            })
                        }
                    }
                })
            }
        });
    });
}

module.exports = websocket;