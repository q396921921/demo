function bindEvents() {
    $(".canButton").each(function () {
        $(this).bind('mouseover', function () {
            $(this).css('background', 'green')
        })
        $(this).bind('mouseout', function () {
            if ($(this).attr('name') == 'head1') {
                $(this).css('background', '#97C65E')
            } else {
                $(this).css('background', '')
            }
        })
        $(this).bind('click', function () {
            $(this).css('color', 'purple')
        })
    })
}
// 鼠标放上去后，按钮背景会变色，证明可以点击
function changeGroundGreen(t) {
    $(this).css('background', 'green')
}
// 鼠标点击后变为紫色
function changeFontColor(t) {
    $(this).css('color', 'purple')
}
// 鼠标离开后背景变为原来的颜色
function removeGround(t) {
    $(t).css('background', '')
}




function getDepUserIdName() {
    let cha_slt;
    let bus_slt;
    let off_slt;
    if (role_type == 1) {
        cha_slt = getAllEmpName("", "", 6);
        bus_slt = getAllEmpName("", userdep_id, "");
        off_slt = getAllEmpName("", "", 4);
    } else if (role_type == 2) {
        cha_slt = getAllEmpName("", "", 6);
        bus_slt = getAllEmpName("", userdep_id, "");
        off_slt = getAllEmpName("", "", 4);
    } else if (role_type == 3) {
        cha_slt = getAllEmpName("", userdep_id, 6);
        bus_slt = getAllEmpName("", userdep_id, "");
        off_slt = getAllEmpName("", "", 4);
    } else if (role_type == 4) {
        cha_slt = getAllEmpName("", userdep_id, 6);
        bus_slt = getAllEmpName("", "", -1);
        off_slt = getAllEmpName(emp_id, "", 4);
    } else if (role_type == 5) {
        cha_slt = getAllEmpName("", "", 6);
        bus_slt = getAllEmpName(emp_id, "", 5);
        off_slt = getAllEmpName(emp_id, "", -1);
    }
    setChaSelt(cha_slt)
    setBusSelt(bus_slt);
    setOffSelt(off_slt);
}
// ok
// 为渠道赋上select选项值
function setChaSelt(cha_slt) {
    let slt1 = '';
    for (let i = 0; i < cha_slt.length; i++) {
        let opt = '<option onclick="updc_id(this)" value="' + cha_slt[i].emp_id + '">' + cha_slt[i].name + '</option>';
        slt1 += opt;
    }
    $(slt1).appendTo($("#channel_name"));
}
// ok
// 为业务赋上select选项值
function setBusSelt(bus_slt) {
    let slt1 = '';
    for (let i = 0; i < bus_slt.length; i++) {
        let opt = '<option onclick="updc_id(this)" value="' + bus_slt[i].emp_id + '">' + bus_slt[i].name + '</option>';
        slt1 += opt;
    }
    $(slt1).appendTo($("#business_name"));
}
// ok
// 为内勤赋上select选项值
function setOffSelt(off_slt) {
    let slt2 = '';
    for (let i = 0; i < off_slt.length; i++) {
        let opt = '<option onclick="updc_id(this)" value="' + off_slt[i].emp_id + '">' + off_slt[i].name + '</option>';
        slt2 += opt;
    }
    $(slt2).appendTo($("#office_name"));
}

// 修改流程对应的时间   ✔
function setFlow(t) {
    let flag = confirmAct('是否确认修改此流程时间？');
    var flow_time = $(t).val()
    var flow_detail_id = $(t).attr('name')

    var order_id = $("#order_id").val()
    if (flag) {
        $.ajax({
            url: "/order/setFlow",
            type: "post",
            data: {
                flow_detail_id: flow_detail_id,
                flow_time: flow_time,
                order_id: order_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('修改状态失败')
                }
                let flag2 = confirmAct('是否将此订单状态的更新通知给用户？');
                if (flag2) {
                    sendMessage(order_id, 'publicFlow');
                }
            }
        })
    }
}
// 发送通知
function sendMessage(order_id, tag) {
    $.ajax({
        url: otherpath + "/management/RealTimeInform",
        type: "post",
        data: {
            orderId: order_id,
            tag: tag
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).result;
            if (result != 'success') {
                alert('通知失败')
            }
        }
    })
}
// ok
// 在没有点击流程的时候，出现的是只读的状态的信息   ✔
function select(t) {
    // 删除原表格的所有数据
    $("#table4").empty();
    var text = "";
    var t2 = $(t).prev()
    var line = $(t).parent().prev().children();
    var flow_id = t2.attr("name");  // 流程id
    var order_id = $("#order_id").val()
    // var flow_id = $("#flow_id").val()
    // 打印状态表格的
    $.ajax({
        url: "/order/getStatess",
        type: "post",
        data: {
            order_id: order_id,
            flow_id: flow_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let arr1 = result.orderState;   // 这个流程下对应的状态，订单状态中间表的信息
            let arr2 = result.states;   // 这个流程下对应的名字
            // let flow_name = result.flow_name;  // 当前流程的名字
            text = result;
            var trtd = "";
            var trtd2 = "";
            // 动态打印当前流程对应的多个状态，并打印当前流程
            var read = $("#read").val()
            for (let i = 0; i < arr1.length; i++) {
                var state_detail_id = arr1[i].state_detail_id;


                var state_time = arr1[i].state_time;
                var time = timestampToTime(state_time)
                var input = "";
                let hidden = '';
                if (arr2[i].state_name == 0 || !arr2[i].state_name) {
                    hidden = ' hidden '
                }
                // 判断是否为详情状态
                if (read == 1) {
                    input = '<td height="20px" width="30%"' + hidden + '>' + arr2[i].state_name + ':</td><td width="70%" ' + hidden + '><input disabled="disabled" type="text" style="width: 150px;" value="' + time + '" "/></td></tr>';
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
                    input = '<td height="20px" width="30%" ' + hidden + '>' + arr2[i].state_name + ':</td><td width="70%" ' + hidden + '><input onblur="setState(this)" name="' + arr1[i].state_detail_id + '" type="text" value="' + time + '" "/></td></tr>'
                }
                if (i == 0) {
                    trtd += '<tr>' + input;
                } else {
                    trtd += '<tr>' + input;
                }
            }
            $(trtd).appendTo($("#table4"));
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

// ok
// // 设置失败原因     ✔
function setFailReason(t) {
    let flag = confirmAct('是否确定为此订单添加失败原因？');
    if (flag) {
        var failReason = $(t).prev().prev().val()
        failReason = set_n_br(failReason);
        var order_id = $("#order_id").val()
        $.ajax({
            url: "/order/setFailReason",
            type: "post",
            data: {
                order_id: order_id,
                failReason: failReason
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('添加失败原因失败')
                } else {
                    if (failReason) {
                        let flag2 = confirmAct('是否确定将此订单失败原因通知与客户？');
                        if (flag2) {
                            sendMessage(order_id, 'fail');
                        }
                    }
                }
            }
        })
    }
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
// 当时间框失去焦点时触发的事件     ✔
function setState(t) {
    let flag1 = confirmAct('是否确认修改此状态时间？');
    var state_detail_id = $(t).attr('name');
    var order_id = $('#order_id').val();
    var time = $(t).val();
    var flag = validDate(time);
    if (flag1) {
        if (flag) {
            $.ajax({
                url: "/order/setState",
                type: "post",
                data: {
                    state_detail_id: state_detail_id,
                    order_id: order_id,
                    time: time
                },
                async: false,
                dataType: "text",
                success: function (result) {
                    if (result != 'success') {
                        alert('修改状态失败')
                    }
                    let flag2 = confirmAct('是否将此订单状态的更新通知给用户？');
                    if (flag2) {
                        sendMessage(order_id, 'publicState');
                    }
                }
            })
        }
    }
}
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
// 点击详情按钮触发的事件
function text() {
    $("#table3 .circle").each(function () {
        // 将其修改为可写状态
        $("#read").val(2);
        var read = $("#read").val();
        // 点击了详情之后，流程时间变为可编辑状态
        if (read == '2') {
            $('.fwtm').each(function () {
                $(this).removeAttr('disabled');
                $(this).next().show();
            })
        }
        // 并且将之前的table4表格中的数据删除掉
        $("#table4").empty();
    })
}
// 点击编辑按钮触发事件
function text2() {
    // 为table2表格中的每一个input设置离开焦点触发事件
    $("#table2 input").each(function () {
        let name = $(this).attr('name');
        $(this).removeAttr('readonly');
        switch (name) {
            // 申请状态与流程状态权限
            case 'order_state':
                if (r10) {
                    $(this).prev().show();
                    $(this).hide();
                }
                break;
            case 'refund':
                if (!r27) {
                    $(this).attr('disabled', 'disabled');
                } else {
                    $(this).prev().show();
                    $(this).hide();
                }
                break;
            // 订单下载权限
            case 'orderFile':
                if (!r26) {
                    $(this).attr('disabled', 'disabled');
                } else {
                    $(this).attr('readonly', 'readonly');
                }
                break;
            // 放款时间修改权限
            case 'loanTime':
                if (!r29) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            // 下户时间修改权限
            case 'seeTime':
                if (!r28) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            // 订单编号修改权限
            case 'appli_id':
                if (!r3) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            // 订单渠道修改权限
            case 'channel_id':
                if (r5) {
                    $(this).prev().removeAttr('disabled');
                }
                break;
            // 订单业务修改权限
            case 'business_id':
                if (r7) {
                    $(this).prev().removeAttr('disabled');
                }
                break;
            // 订单内勤修改权限
            case 'office_id':
                if (r9) {
                    $(this).prev().removeAttr('disabled');
                }
                break;
            // 产品类型修改权限
            case 'type':
                if (r12) {
                    $(this).prev().removeAttr('disabled');
                }
                break;
            // 申请时间修改权限
            case 'appliTime':
                if (!r13) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            case 'product_id':
                $(this).attr('disabled', 'disabled');
                break;
            case 'userComment':
                if (!r15) {
                    $(this).next().attr('disabled', 'disabled')
                } else {
                    $(this).next().removeAttr('readonly')
                }
                break;
            case 'empComment':
                if (!r15) {
                    $(this).next().attr('disabled', 'disabled')
                } else {
                    $(this).next().removeAttr('readonly')
                }
                break;
            case 'bank_name':
                if (!r25) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            case 'bank_id':
                if (!r25) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            case 'card_name':
                if (!r25) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            default:
                break;
        }
        $(this).attr('onblur', 'submit(this)');
    })
}
// ok
// 请求后台数据库，然后得到具体有几步流程   ✔
function getAllFlow(order_id) {
    var text = "";
    $.ajax({
        url: "/order/getFlows",
        type: "post",
        data: {
            order_id: order_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            var flow_id = result.flow_id;   // 流程id
            $("#flow_id").val(flow_id)
            var order_id = result.order_id;   // 订单id
            $("#order_id").val(order_id);
            var rst2 = result.flows;   // 流程下的具体流程名字
            var rst3 = result.arr2;   // 流程对应的时间及失败原因
            var rst4 = result.count2;   // 当前流程的排序号
            var arr = [];
            arr.push(rst2);
            arr.push(rst3);
            arr.push(rst4)
            text = arr;
        }
    })
    return text;
}
// 清楚表格除第一行之外的所有数据并重新获取所有数据再动态打印到表格中   ✔
function deleteTb() {
    var val = $("#aid").val()
    // 清除表格除第一行的所有数据
    $("#table tr:gt(0)").empty();
    $("#pageNo").val(1);
    getSplitPage(val, $("#table"))
}
// ok
// 获得所有订单     ✔
function getSplitPage(num, tableId) {
    $("#table tr:gt(0)").empty();
    let limit = $("#pageNo").val();
    $.ajax({
        url: "/order/getSplitOrders",
        type: "post",
        data: {
            appli_id: num,
            order_type: 1,
            role_type: role_type,
            userdep_id: userdep_id,
            busoff_id: busoff_id,
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result);
            let ret = data.data;
            let totalPage = data.totalPage;
            let totalNum = data.totalNum;
            $("#totalPage").val(totalPage);
            $("#totalNum").val(totalNum);
            dataStr = JSON.stringify(ret)
            $("#allOrder").val(dataStr);

            printTable(ret, tableId);

            $("#pages").val(limit);
            $("#lstd span:first").html(limit);
            $("#lstd span:last").html($("#totalPage").val());
            splitPageCss()
        }
    })
}
// ok
// 先获取所有用户的id与姓名，再通过id进行判断
function getAllEmpName(emp_id, dep_id, type) {
    let text;
    $.ajax({
        url: "/user/getUser",
        type: "post",
        data: {
            emp_id: emp_id,
            dep_id: dep_id,
            type: type
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            text = data;
            if (!emp_id && !dep_id && !type) {
                $("#allName").val(JSON.stringify(data));
            }
        }
    })
    return text;
}
// ok
function getAllProducts() {
    let text;
    $.ajax({
        url: "/product/getProduct",
        type: "post",
        data: {
            product_id: "",
            isNum: 0
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
// ok
function getFlows() {
    let text = "";
    $.ajax({
        url: "/order/getFlow_detail",
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
// ok
// 遍历所有的具体流程，然后得到对应流程的name名字
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
// ok
// 遍历所有商品，然后得到对应商品的name名字
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
// ok
// 遍历所有用户，然后得到对应用户的name名字
function getEmpName(emp_id) {
    let text = "";
    let allName = JSON.parse($("#allName").val());
    for (let i = 0; i < allName.length; i++) {
        if (parseInt(allName[i].emp_id) == emp_id) {
            text = allName[i].name;
            break;
        }
    }
    return text
}
// ok
// 通过查询数据库返回的结果，把数据打印到对应的表格     ✔
function printTable(result, tableId) {
    let trtd = '';
    let deleteKey = '';
    if (r31) {
        deleteKey = '<input onclick="deleteOrders(this)" type="button" name="handle" value="删除" style="width: 50px">';
    }
    for (let i = 0; i < result.length; i++) {
        let data = result[i];
        let appli_id = getAny(data.appli_id)
        let channel_id = getAny(data.channel_id)
        let channel_name = getEmpName(data.channel_id);

        let business_id = getAny(data.business_id);
        let business_name = getEmpName(data.business_id);

        let office_id = getAny(data.office_id)
        let office_name = getEmpName(data.office_id);

        let type = data.type;
        let appliTime = timestampToTime(data.appliTime);    // 申请时间
        let seeTime = timestampToTime(data.seeTime);        // 下户，见面时间
        let loanTime = timestampToTime(data.loanTime);      // 放贷时间
        let flowState = data.flowState;
        let flow = getFlow(flowState);
        let order_state = getOrderState(data.order_state);
        let userComment = getAny(data.userComment);
        let empComment = getAny(data.empComment);
        let product_id = getPName(data.product_id)
        let orderFile = getAny(data.orderFile)
        let relation_state_id = data.relation_state_id;
        let state = getStates(relation_state_id);
        let money = getAny(data.money)
        let failReason = getAny(data.failReason);
        let clientName = getAny(data.clientName);
        let inmoney = getAny(data.inmoney);

        let bank_name = getAny(data.bank_name);
        let bank_id = getAny(data.bank_id);
        let card_name = getAny(data.card_name);
        let refund = getRefund(data.refund);

        $("#failReason").val(failReason);
        trtd += '<tr>'
            + '<td hidden><input type="text" name="order_id" value="' + data.order_id + '" style="width: 95%"></td>'
            + '<td hidden><input type="text" name="failReason" value="' + failReason + '" style="width: 95%"></td>'
            + '<td hidden><input type="text" name="appli_id" readonly="readonly" value="' + appli_id + '" style="width: 95%"></td>'
            + '<td><input type="text" name="product_id" value="' + product_id + '" readonly="readonly"></td>'

            + '<td hidden><input type="text" name="channel_id" value="' + channel_id + '" readonly="readonly"></td>'
            + '<td><input type="text" name="channel_name" value="' + channel_name + '" readonly="readonly"></td>'

            + '<td hidden><input type="text" name="business_id" value="' + business_id + '" readonly="readonly" style="width: 94%"></td>'
            + '<td><input type="text" name="business_name" value="' + business_name + '" readonly="readonly" style="width: 94%"></td>'

            + '<td hidden><input type="text" name="office_id" value="' + office_id + '" readonly="readonly"></td>'
            + '<td><input type="text" name="office_name" value="' + office_name + '" readonly="readonly"></td>'

            + '<td><input type="text" name="clientName" value="' + clientName + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="type" value="' + type + '" readonly="readonly"></td>'
            + '<td><input type="text" name="inmoney" value="' + inmoney + '" readonly="readonly"></td>'
            + '<td><input type="text" name="money" value="' + money + '" readonly="readonly"></td>'
            + '<td><input type="text" name="flowState" value="' + flow + '" readonly="readonly"></td>'
            + '<td><input type="text" name="relation_state_id" value="' + state + '" readonly="readonly"></td>'
            + '<td><input type="text" name="appliTime" value="' + appliTime + '" readonly="readonly" style="width: 94%"></td>'
            + '<td hidden><input type="text" name="userComment" value="' + userComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="empComment" value="' + empComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="seeTime" value="' + seeTime + '" readonly="readonly"></td>'

            + '<td hidden><input type="text" name="bank_name" value="' + bank_name + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="bank_id" value="' + bank_id + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="card_name" value="' + card_name + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="refund" value="' + refund + '" readonly="readonly"></td>'

            + '<td><input type="text" name="loanTime" value="' + loanTime + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="orderFile" value="' + orderFile + '"></td>'
            + '<td><input type="text" name="order_state" value="' + order_state + '" style="width: 97%"><input type="text" value="' + 1 + '" hidden></td>'
            + '<td><input type="hidden" value="' + data.order_id + '"><input onclick="getOneOrders(getPrevVal(this))" type="button" name="handle" value="详情" style="width: 50px">'
            + deleteKey + '</td></tr>';
    }
    $(trtd).appendTo(tableId)
}
function getPrevVal(obj) {
    let val = $(obj).prev().val();
    return val;
}
function getRefund(num) {
    let text = "";
    if (num == 0) {
        text = '未还款';
    } else if (num == 1) {
        text = '已还款'
    }
    return text;
}
function deleteOrders(t) {
    let order_id = $(t).parent().parent().children().children("input[name='order_id']").val();
    let flag = confirmAct('您确认要删除此订单吗');
    if (flag) {
        $.ajax({
            url: "/order/deleteOrder",
            type: "post",
            data: {
                order_id: order_id,
                order_type: 1
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    $(t).parent().parent().remove()
                    alert('删除成功')
                } else {
                    alert('删除失败');
                }
            }
        })
    }
}
function getOneOrders(order_id) {
    window.location.href = `/order/order/orderDetail?order_id=${order_id}`;
}
function writeTime(t) {
    let time = timestampToTime(new Date());
    $(t).prev().val(time)
    $(t).prev().trigger('onblur');
}
// ok
// 通过id，获得具体的商品信息
function getProduct(product_id) {
    let text = "";
    $.ajax({
        url: "/product/getProduct",
        type: "post",
        data: {
            product_id: product_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data[0];
            text = result.name;
        }
    })
    return text;
}

function updc_id(t) {
    let flag = confirmAct('是否确认修改当前账户');
    if (flag) {
        let user_id = $(t).val();
        $(t).parent().next().val(user_id);
        $(t).parent().next().trigger('onblur');
    }
}
// ok
// 对于数据库中为null的数据，直接在前端显示为空     ✔
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}
// 修改类型
function writeTypes(type_id) {
    $("#types").empty();
    let text = getTypes();
    let select = '<option value="">----请选择----</option>'
    for (let i = 0; i < text.length; i++) {
        select += '<option value="' + text[i].product_type_id + '" onclick="setOrder_type(this.value)">' + text[i].name + '</option>'
    }
    $(select).appendTo($("#types"));
    $("#types").val(type_id)
}
function setOrder_type(type_id) {
    $("#types").next().val(type_id);
    $("#types").next().trigger('onblur');
}
// ok
// 从数据库中取得当前所有的产品类型，并记录到当前网页   ✔
function getTypes() {
    var text = "";
    $.ajax({
        url: "/product/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result).data
        }
    })
    return text;
}
// ok
// 获得审核状态的实际表达       ✔
function getStates(state_id) {
    var text = "";
    if (state_id) {
        $.ajax({
            url: "/order/getStates",
            type: "post",
            data: {
                state_id: state_id,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                text = result
            }
        })
    } else {
        text = ""
    }
    return text
}
// 跳转到申请管理页面即全部与筛选/统计      ✔
function jump(text) {
    window.location.href = '/order/order' + text + '?menu=' + text;
}

// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
// 修改这个订单是否完成，的5个大状态
function setOrder_state(order_state, exist) {
    if (exist) {
        abc();
    } else {
        let flag = confirmAct('是否确认修改订单完成状态？');
        if (flag) {
            abc();
        }
    }
    function abc() {
        let order_id = $("#order_id").val();
        $.ajax({
            url: "/order/setOrder_state2",
            type: "post",
            data: {
                order_type: 1,
                order_state: order_state,
                order_id: order_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('修改失败')
                } else {
                    if (order_state == 3) {
                        let flag = confirmAct('是否确认将此订单状态通知给用户？');
                        if (flag) {
                            sendMessage(order_id, 'success')
                        }
                    } else if (order_state == 4) {
                        let flag = confirmAct('是否确认将此订单状态通知给用户？');
                        if (flag) {
                            sendMessage(order_id, 'fail')
                        }
                    }
                }
            }
        })
    }
}
// 修改这个订单是否完成，的5个大状态
function setRefund_state(refund, exist) {
    let flag = confirmAct('是否确认修改还款状态吗？');
    if (flag) {
        let order_id = $("#order_id").val();
        $.ajax({
            url: "/order/setRefund_state",
            type: "post",
            data: {
                refund: refund,
                order_id: order_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('修改失败')
                }
            }
        })
    }
}

function getThisOrderInfo(order_id) {
    $.ajax({
        url: "/order/getOrders",
        type: "post",
        data: {
            order_id: order_id,
            role_type: role_type,
            userdep_id: userdep_id,
            order_type: 1
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data[0];
            result = JSON.stringify(result);
            $("#allOrder").val(result);
        }
    })
}
// 得到利润 ✔
function getProfit() {
    $.ajax({
        url: "/order/getTotal_profit",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            let profit = JSON.parse(result).data[0].profit;
            $("#profit").val(profit)
        }
    })
}
// 修改总利润   ✔
function updateProfit(t) {
    let profit = $(t).val()
    $.ajax({
        url: "/order/updateProfit",
        type: "post",
        data: {
            "profit": profit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'success') {
                alert('设置总利润成功')
            } else {
                alert('设置总利润失败')
            }
        }
    })
}
// ok
// 导出excel文件    ✔
function output() {
    let val = $("#allOrder").val();
    $.ajax({
        url: "/order/writeExcel",
        type: "post",
        data: {
            "data": val
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'error') {
                alert('导出失败')
            } else {
                let pt2 = result.split(excelFile + symbol)[1];
                window.location.href = '/' + excelFile + '/' + pt2;
            }
        }
    })
}
// 修改订单基本信息的 ✔
function submit(t) {
    var name = $(t).attr('name');
    var val = $(t).val();
    var order_id = $("#order_id").val()
    if (name == 'appliTime' || name == 'seeTime' || name == 'loanTime') {
        var flag = validDate(val);
        if (flag) {
            a(name, val)
        }
    } else if ($(t).parent().next().attr('name') == 'type') {
        let flag = confirmAct('是否确认修改商品类型？');
        if (flag) {
            name = $(t).parent().next().attr('name')
            val = $(t).val();
            a(name, val);
        }
    } else if (name == 'orderFile') {
        let flag = confirmAct('是否确认下载此订单相关文件？');
        if (flag) {
            var arr = val.split(';');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    download('第' + i + '个文件', '/' + userfile + '/' + arr[i]);
                    $("#hidde").empty();
                }
                if (i == arr.length - 1) {
                    alert('下载订单文件成功')
                }
            }
        }
    } else {
        a(name, val)
    }
    function download(name, href) {
        $('<a href="' + href + '" download="' + name + '.jpg" id="clc">').appendTo($("#hidde"));
        document.getElementById("clc").click();
    }
    function a(name, val) {
        let text = '';
        $.ajax({
            url: "/order/updateOrder",
            type: "post",
            data: {
                order_type: 1,
                name: [name, val],
                order_id: order_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('修改失败');
                } else {
                    if (name == 'seeTime') {
                        let flag = confirmAct('是否发送短信通知于用户')
                        if (flag) {
                            sendEmail(order_id)
                        }
                    }
                }
            }
        })
    }
}
// 发送下户的短信
function sendEmail(order_id) {
    if (name == 'seeTime') {
        $.ajax({
            url: otherpath + "/management/noteInformation",
            type: "post",
            data: {
                orderId: order_id,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                let code = JSON.parse(result).code;
                if (code == 200) {
                    alert('通知发送成功')
                } else {
                    alert('通知发送失败')
                }
            }
        })
    }
}
function validDate(data) {
    var dateFormat = "[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}";
    var reg = new RegExp(dateFormat);
    if (!reg.test(data)) {
        alert('输入日期格式错误，日期格式为xxxx-xx-xx xx:xx，请您重新输入')
        return false
    } else {
        return true;
    }
}
// 输入完点出来然后触发input的blur事件
function getText(t) {
    let text = $(t).val();
    text = set_n_br(text);
    $(t).prev().val(text);
    $(t).prev().trigger('onblur');
}