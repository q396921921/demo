function getOrderById() {
    var val = $("#aid").val()
    // 清除表格除第一行的所有数据
    $("#table tr:gt(0)").empty();
    getOrders(val, $("#table"))
}
function getEmpName(emp_id) {
    let text = "";
    if (emp_id && emp_id != "") {
        $.ajax({
            url: "/users/getEmpName",
            type: "post",
            data: {
                emp_id: emp_id,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                let data = JSON.parse(result).data[0].name;
                text = data;
            }
        })
    }
    return text;
}
function getAllProducts() {
    let text;
    $.ajax({
        url: "/users/getProductById",
        type: "post",
        data: {
            product_id: "",
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            text = data;
            $("#allPName").val(JSON.stringify(data));
        }
    })
    return text;
}
function getPName(product_id) {
    let text = "";
    let allPName = JSON.parse($("#allPName").val());
    for (let i = 0; i < allPName.length; i++) {
        if (parseInt(allPName[i].product_id) == product_id) {
            text = allPName[i].name;
            break;
        }
    }
    return text
}
function getFlows() {
    let text = "";
    $.ajax({
        url: "/users/getFlowByFlow_detail_id",
        type: "post",
        data: {
            flow_detail_id: ""
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            text = data;
            $("#allFlow").val(JSON.stringify(data));
        }
    })
    return text;
}
function getFlow(flow_detail_id) {
    let text = "";
    let allFlow = JSON.parse($("#allFlow").val());
    for (let i = 0; i < allFlow.length; i++) {
        if (parseInt(allFlow[i].flow_detail_id) == flow_detail_id) {
            text = allFlow[i].flow_name;
            break;
        }
    }
    return text
}
function printTable(result) {
    let table = '';
    for (let i = 0; i < result.length; i++) {
        let data = result[i];
        let appli_id = getAny(data.appli_id)
        let channel_id = getAny(data.channel_id)
        let business_id = getAny(data.business_id)
        let office_id = getAny(data.office_id)
        if (i == 0) {
            types = getTypes()
        }
        let type = getType(data.type);
        let appliTime = timestampToTime(data.appliTime);    // 申请时间
        let seeTime = timestampToTime(data.seeTime);        // 下户，见面时间
        let loanTime = timestampToTime(data.loanTime);      // 放贷时间
        // let flowState = data.flowState;
        let flow = getFlow(data.flowState);
        let order_state = getOrderState(data.order_state);
        let userComment = getAny(data.userComment);
        let empComment = getAny(data.empComment)
        let product_id = getPName(data.product_id)
        let orderFile = getAny(data.orderFile)
        let relation_state_id = data.relation_state_id;
        let state = getStates(relation_state_id);
        let money = getAny(data.money)
        let failReason = getAny(data.failReason);
        let clientName = getAny(data.clientName);
        let inmoney = getAny(data.inmoney);

        table += '<tr onclick="getOneOrder(this)"><td hidden><input type="text" name="order_id" value="' + data.order_id + '" style="width: 95%"></td>'
            + '<td hidden><input type="text" name="failReason" value="' + failReason + '" style="width: 95%"></td>'
            + '<td hidden><input type="text" name="appli_id" readonly="readonly" value="' + appli_id + '" style="width: 95%"></td>'
            + '<td hidden><input type="text" name="channel_id" value="' + channel_id + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="business_id" value="' + business_id + '" readonly="readonly" style="width: 94%"></td>'
            + '<td hidden><input type="text" name="office_id" value="' + office_id + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="type" value="' + type + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="inmoney" value="' + inmoney + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="flowState" value="' + flow + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="relation_state_id" value="' + state + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="appliTime" value="' + appliTime + '" readonly="readonly" style="width: 94%"></td>'
            + '<td hidden><input type="text" name="userComment" value="' + userComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="empComment" value="' + empComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="product_id" value="' + product_id + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="seeTime" value="' + seeTime + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="orderFile" value="' + orderFile + '"></td>'
            + '<td hidden><input type="text" name="order_state" value="' + order_state + '" style="width: 97%"><input type="text" value="' + 1 + '" hidden></td>'

            + '<td><input type="text" name="clientName" value="' + clientName + '" readonly="readonly" style="text-align:center;width:99%"></td>'
            + '<td><input type="text" name="money" value="' + money + '" readonly="readonly" style="text-align:center;width:99%"></td>'
            + '<td><input type="text" name="loanTime" value="' + loanTime + '" readonly="readonly" style="text-align:center;width:99%"></td></tr>'
    }
    $(table).appendTo($("#table1"))
}
// // 通过具体流程id获得具体流程信息
// function getFlow(flow_detail_id) {
//     let text = "";
//     if (flow_detail_id && flow_detail_id != "") {
//         $.ajax({
//             url: "/users/getFlowByFlow_detail_id",
//             type: "post",
//             data: {
//                 flow_detail_id: flow_detail_id
//             },
//             async: false,
//             dataType: "text",
//             success: function (result) {
//                 result = JSON.parse(result).data[0];
//                 text = result.flow_name;
//             }
//         })
//     }
//     return text;
// }
// 将日期进行转换最终得到一个正确时区的日期     ✔
function timestampToTime(timestamp) {
    let text;
    if (timestamp) {
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
        text = Y + M + D + h + m;
    } else {
        text = '';
    }
    return text;
}
// 得到实际订单状态，那5个成功失败的
function getOrderState(num) {
    let text = '';
    if (num == 1) {
        text = '申请中';
    } else if (num == 2) {
        text = '审核中';
    } else if (num == 3) {
        text = '通过';
    } else if (num == 4) {
        text = '失败';
    } else if (num == 5) {
        text = '撤销';
    }
    return text;
}
// // 通过id，获得具体的商品信息
// function getProduct(product_id) {
//     let text = "";
//     $.ajax({
//         url: "/users/getProductsByTypeId",
//         type: "post",
//         data: {
//             product_id: product_id
//         },
//         async: false,
//         dataType: "text",
//         success: function (result) {
//             result = JSON.parse(result).data[0];
//             text = result.name;
//         }
//     })
//     return text;
// }
function getOneOrder(t) {
    $(".tb").hide()
    $("#table2").show()
    $("#total").hide();
    let order_id = "";
    $(t).children().children('input').each(function () {
        let name1 = $(this).attr('name');
        let val1 = $(this).val();
        if (name1 == 'order_id') {
            order_id = $(this).val();
        }
        $("#table3 input").each(function () {
            let name2 = $(this).attr('name');
            if (name1 == name2) {
                $(this).attr('readonly', 'readonly');
                if (name2 == 'empComment') {
                    let text = set_br_n(val1);
                    $(this).next().val(text);
                    $(this).next().attr('readonly', 'readonly');
                } else if (name2 == 'userComment') {
                    let text = set_br_n(val1);
                    $(this).next().val(text);
                    $(this).next().attr('readonly', 'readonly');
                } else if (name2 == 'channel_id' || name2 == 'business_id' || name2 == 'office_id') {
                    let user_name = getEmpName(val1)
                    $(this).val(user_name);
                } else {
                    $(this).val(val1);
                }
            }
        })
    })
    printCircle(order_id);
}
function printCircle(order_id) {
    // 通过之前得到的订单id，
    var arr = getAllFlow(order_id);
    // 流程对应的时间（即订单状态中间表内的不同状态同一个小流程对应的时间）
    var arr2 = arr[0]
    // 流程对应的名字
    var arr3 = arr[1];
    // 当前流程的排序号
    var flowState = arr[2];
    let failReason = $("#failReason").val();
    var trtd1 = '<tr>';
    var trtd2 = '<tr>';
    var trtd3 = '<tr>';
    //  通过当前订单id，得到对应的流程id
    var flow_id = getState()
    // 输出这个订单对应的流程表格，默认是灰色的
    var exist = true;

    for (var i = 0; i < arr2.length; i++) {
        let val = arr2[i].flow_name
        let flow_detail_id = arr2[i].flow_detail_id;

        let time = timestampToTime(arr3[i].flow_time)
        let line1 = '<td height="20px;" width="80px;"><y class="line"></y></td>'
        let line2 = '<td height="20px;" width="80px;"><y class="line" style="background:blue"></y></td>'
        let line3 = '<td height="20px;" width="80px;"><y class="line" style="display:none"></y></td>';
        let circle1 = '<td height="100px;" width="100px;"><input type="hidden" name="' + flow_detail_id + '" value="' + val + '"><x class="circle" onclick="select(this)" ></x><input type="hidden" value="1"></td>'
        let circle2 = '<td height="100px;" width="100px;"><input type="hidden" name="' + flow_detail_id + ' value="' + val + '"><x class="circle" onclick="select(this)" style="background:blue;"></x><input type="hidden" value="1"></td>'
        let circle3 = '<td height="100px;" width="100px;"><input type="hidden" name="' + flow_detail_id + ' value="' + val + '"><x class="circle" onclick="select(this)" style="background:red;"></x><input type="hidden" value="1"></td>'
        // 流程名
        let tdtext1 = '<td colspan="2" style="text-align: left;">' + val + '</td>';
        // 日期
        let tdtext2 = '<td colspan="2" style="text-align: left;"><input disabled="disabled" class="fwtm" type="text" name="' + flow_detail_id + '" onblur="setFlow(this)" style="width: 110px;" value="' + time + '"/></td>';
        if (flowState == null) {
            circle2 = circle1;
            line2 = line1;
        }
        if (flowState == i) {
            if (failReason && failReason != "") {
                circle2 = circle3;
            }
        }
        // 用来判断线和圈是蓝还是灰还是红的
        if (flow_detail_id == flow_id) {
            exist = false;
            if (i == arr2.length - 1) {
                trtd1 += circle2 + line3;
                trtd2 += tdtext1 + '</tr>'
                trtd3 += tdtext2 + '</tr>'
            } else {
                trtd1 += circle2 + line1;
                trtd2 += tdtext1;
                trtd3 += tdtext2;
            }
        } else {
            if (exist) {
                if (i == arr2.length - 1) {
                    trtd1 += circle2 + line3;
                    trtd2 += tdtext1 + '</tr>'
                    trtd3 += tdtext2 + '</tr>'
                } else {
                    trtd1 += circle2 + line2;
                    trtd2 += tdtext1;
                    trtd3 += tdtext2;
                }
            } else {
                if (i == arr2.length - 1) {
                    trtd1 += circle1 + line3;
                    trtd2 += tdtext1 + '</tr>'
                    trtd3 += tdtext2 + '</tr>'
                } else {
                    trtd1 += circle1 + line1;
                    trtd2 += tdtext1;
                    trtd3 += tdtext2;
                }
            }
        }
    }
    $(trtd1 + trtd2 + trtd3).appendTo($("#table4"));
}
// 用来做详情页面的流程图，点亮的。得到订单当前所对应的流程     ✔
function getState() {
    let order_id = $("#order_id").val()
    var text = "";
    $.ajax({
        url: "/users/getState",
        type: "post",
        data: {
            order_id: order_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            text = result;
        }
    })
    return text;
}
// 请求后台数据库，然后得到具体有几步流程   ✔
function getAllFlow(order_id) {
    var text = "";
    $.ajax({
        url: "/users/getFlow",
        type: "post",
        data: {
            order_id: order_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).result
            var rst1 = result[0];   // 流程id
            $("#flow_id").val(rst1)
            var order_id = result[1];   // 订单id
            $("#order_id").val(order_id);
            var rst2 = result[2];   // 流程下的具体流程名字
            var rst3 = result[3];   // 流程对应的时间及失败原因
            var rst4 = result[4];   // 当前流程的排序号
            var arr = [];
            arr.push(rst2);
            arr.push(rst3);
            arr.push(rst4)
            text = arr;
        }
    })
    return text;
}

// 在没有点击流程的时候，出现的是只读的状态的信息   ✔
function select(t) {
    // 删除原表格的所有数据
    $("#table5").empty();
    $("#table6").empty();
    var text = "";
    var t2 = $(t).prev()
    var line = $(t).parent().prev().children();
    var flow_id = t2.attr("name");  // 流程id
    var order_id = $("#order_id").val()
    // var flow_id = $("#flow_id").val()
    // 打印状态表格的
    $.ajax({
        url: "/users/getStatess",
        type: "post",
        data: {
            order_id: order_id,
            flow_id: flow_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).result
            let arr1 = result[0];   // 这个流程下对应的状态，订单状态中间表的信息
            let arr2 = result[1];   // 这个流程下对应的名字
            let flow_name = result[2];  // 当前流程的名字
            text = result;
            var trtd = "";
            var trtd2 = "";
            // 动态打印当前流程对应的多个状态，并打印当前流程
            var read = $("#read").val()

            let textfile = "";
            for (let i = 0; i < arr1.length; i++) {
                var state_detail_id = arr1[i].state_detail_id;

                let failReason = $("#failReason").val();
                failReason = set_br_n(failReason);

                var state_time = arr1[i].state_time;
                var time = timestampToTime(state_time)
                var input = "";
                textfile = '<h3>失败原因</h3><br><textarea name="failReason" cols="30" rows="10">' + failReason + '</textarea><br><input style="margin-top:5px" type="button" class="canButton" value="修改" onclick="setFailReason(this)">';
                // 判断是否为详情状态
                if (read == 1) {
                    input = '<td height="20px" width="30%">' + arr2[i].state_name + ':</td><td width="70%"><input disabled="disabled" type="text" style="width: 150px;" value="' + time + '" "/></td></tr>';
                    textfile = '<h3>失败原因</h3><br><textarea readonly name="failReason" cols="30" rows="10">' + failReason + '</textarea><br><input style="margin-top:5px" type="button" class="canButton" hidden value="修改" onclick="setFailReason(this)">';
                } else {
                    if (i == result.length - 1) {
                        var num = $(t).next().val();
                        var name = t2.attr('name')
                        var val = t2.val();
                        if (num == 1) {
                            line.css('background', 'blue')
                            $(t).css('background', 'blue')
                            $(t).next().val(2);
                        } else {
                            line.css('background', 'gray')
                            $(t).css('background', 'gray')
                            $(t).next().val(1);
                        }
                    }
                    input = '<td height="20px" width="30%">' + arr2[i].state_name + ':</td><td width="70%"><input onblur="setState(this)" name="' + arr1[i].state_detail_id + '" type="text" value="' + time + '" "/></td></tr>'
                }
                if (i == 0) {
                    trtd += '<tr>' + input;
                } else {
                    trtd += '<tr>' + input;
                }
            }
            $(trtd).appendTo($("#table5"));
            // 打印失败原因
            $(textfile).appendTo($("#table6"));
        }
    })
    return text;
}

// 文本框给后台传值时，给其中的换行进行替换
function set_n_br(text) {
    text = text.replace(/\n/g, '&br');
    return text;
}
// 文本框接收值时，给其中的特殊换行替换
function set_br_n(text) {
    text = text.replace(/&br/g, '\n');
    return text;
}