function bindEvents() {
    $(".canButton").each(function () {
        $(this).bind('mouseover', function () {
            $(this).css('background', 'green')
        })
        $(this).bind('mouseout', function () {
            if ($(this).attr('name') == 'head4') {
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






var types = "";
// 通过查询数据库返回的结果，把数据打印到对应的表格     ✔
function printTable(result, tableId) {
    result = JSON.parse(result);
    result = result.result;
    for (let i = 0; i < result.length; i++) {
        let data = result[i];
        let appli_id = getAny(data.appli_id)
        let channel_id = getAny(data.channel_id)
        // let product_id = data.product_id;
        if (i == 0) {
            types = getTypes()
        }
        let type = getType(data.type);
        let appliTime = timestampToTime(data.appliTime);
        let order_state = getOrderState(data.order_state);
        let product_id = getProduct(data.product_id);
        let userComment = getAny(data.userComment);
        let empComment = getAny(data.empComment);
        let orderFile = getAny(data.orderFile);
        let relation_state_id = data.relation_state_id;
        let trtd = $('<tr><td hidden><input type="text" name="order_id" value="' + data.order_id + '" style="width: 95%"></td>'
            + '<td><input type="text" name="appli_id" readonly="readonly" value="' + appli_id + '" style="width: 95%"></td>'
            + '<td><input type="text" name="channel_id" value="' + channel_id + '" readonly="readonly"></td>'
            + '<td><input type="text" name="product_id" value="' + product_id + '" readonly="readonly"></td>'
            + '<td><input type="text" name="type" value="' + type + '" readonly="readonly"></td>'
            + '<td><input type="text" name="appliTime" value="' + appliTime + '" readonly="readonly" style="width: 94%"></td>'
            + '<td><input type="text" name="userComment" value="' + userComment + '" readonly="readonly"></td>'
            + '<td><input type="text" name="empComment" value="' + empComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="orderFile" value="' + orderFile + '" style="width: 97%"></td>'
            + '<td><input type="text" name="order_state" value="' + order_state + '" style="width: 97%"><input type="text" value="' + 1 + '" hidden></td>'
            + '<td><input onclick="getOneOrders(this)" type="button" name="handle" value="详情" style="width: 50px">'
            + '<input class="class1" type="button" value="下载" onclick="getFile(this)" style="width: 50px"></td></tr>');
        trtd.appendTo(tableId)
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
// 通过id，获得具体的商品信息
function getProduct(product_id) {
    let text = "";
    $.ajax({
        url: "/users/getProduct",
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
// 将日期进行转换最终得到一个正确时区的日期     ✔
function timestampToTime(timestamp) {
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
    return Y + M + D + h + m;
}
// 从已经获取的所有类型中，判断是哪个类型并返回相应字符串    ✔
function getType(type) {
    var text = "";
    for (var i = 0; i < types.length; i++) {
        if (types[i].product_type_id == type) {
            text = types[i].name;
        }
    }
    return text;
}
// 对于数据库中为null的数据，直接在前端显示为空     ✔
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}
// 从数据库中取得当前所有的产品类型，并记录到当前网页   ✔
function getTypes() {
    var text = "";
    $.ajax({
        url: "/users/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result).data
        }
    })
    return text;
}




// id查询按钮
function deleteTb() {
    var val = $("#aid").val()
    // 清除表格除第一行的所有数据
    $("#table tr:gt(0)").empty();
    // $("#table tr").not(':eq(0)').empty()
    getOrders(val, $("#table"))
}
function getFile(t) {
    $(t).parent().parent().children().children().each(function () {
        if ($(this).attr('name') == 'orderFile') {
            let val = $(this).val();
            let arr = val.split(';');
            for (let i = 0; i < arr.length; i++) {
                if (arr[i]) {
                    download('第' + i + '个文件', '/' + userfile + '/' + arr[i]);
                    $("#hidde").empty()
                }
            }
        }
    })
}
function download(name, href) {
    $('<a href="' + href + '" download="' + name + '.jpg" id="clc">').appendTo($("#hidde"));
    document.getElementById("clc").click();
}
// 跳转当前测试1页面，即全部与筛选
function jump(num) {
    window.location.href = '/users/appli/ceshi' + num + '?menu=' + num;
}

function getOneOrders(t) {
    $("#b").hide();
    // 显示订单详细表格
    $("#table2").show()
    // 隐藏返回顶部按钮
    $("#bottom").attr("style", "display:none")
    $("#update2").show();
    var order_id = "";      // 订单id
    // var relation_state_id = "";      // 订单中的状态id
    var data = $(t).parent().parent();
    data.children().children().each(function () {
        var name = $(this).attr('name');
        var val = $(this).val();
        if (name == 'order_id') {
            $("#order_id").val(val);
        }
        // 遍历table2筛选表格中的所有input，如果此次的name字段与此次的name2字段相同，将值赋给此input
        $("#table2 input").each(function () {
            var name2 = $(this).attr('name')
            if (name == name2) {
                $(this).val(val);
                // 将所有的input框设置为只读
                $(this).attr('readonly', 'readonly')
                if (name2 == 'userComment') {
                    let text = set_br_n(val);
                    $(this).next().val(text);
                } else if (name2 == 'empComment') {
                    let text = set_br_n(val);
                    $(this).next().val(text);
                }
            }
        })
    })
}
// 点击编辑按钮触发事件
function text2() {
    // 为table2表格中的每一个input设置离开焦点触发事件
    $("#table2 input").each(function () {
        let name = $(this).attr('name');
        $(this).removeAttr('readonly');
        if (name == 'order_state') {
            $(this).prev().show();
            $(this).hide();
        } else if (name == 'orderFile') {
            $(this).attr('readonly', 'readonly');
        } else if (name == 'appli_id' || name == 'product_id' || name == 'type') {
            $(this).attr('disabled', 'disabled');
        } else if (name == 'userComment' || name == 'empComment') {
            $(this).next().removeAttr('readonly')
        }
        $(this).attr('onblur', 'submit(this)');
    })
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
// 输入完点出来然后触发input的blur事件
function getText(t) {
    let text = $(t).val();
    text = set_n_br(text);
    $(t).prev().val(text);
    $(t).prev().trigger('onblur');
}


// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
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
// 修改这个订单是否完成，的5个大状态
function setOrder_state(order_state, exist) {
    let flag = confirmAct('是否确认修改订单完成状态？');
    if (flag) {
        let order_id = $("#order_id").val();
        $.ajax({
            url: "/users/setOrder_state2",
            type: "post",
            data: {
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
    } else {
        a(name, val)
    }
    function a(name, val) {
        let text = '';
        $.ajax({
            url: "/users/updateOrder",
            type: "post",
            data: {
                name: [name, val],
                order_id: order_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result != 'success') {
                    alert('修改失败');
                } else {
                    if (name == 'empComment') {
                        let flag = confirmAct('是否将此信息反馈给用户？');
                        if (flag) {
                            sendMessage(order_id, 'comment')
                        }
                    }
                }
            }
        })
    }
}
// 获得所有订单     ✔
function getOrders(num, tableId) {
    $.ajax({
        url: "/users/getOrders",
        type: "post",
        data: {
            appli_id: num
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).result
            data = JSON.stringify(data)
            $("#allOrder").val(data)
            printTable(result, tableId);
        }
    })
}
// 导出excel文件    ✔
function output() {
    let val = $("#allOrder").val();
    $.ajax({
        url: "/users/writeExcel",
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
                window.location.href = '/' + excelFile  + '/'+ pt2;
            }
        }
    })
}