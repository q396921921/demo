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





function getDepUserIdName() {
    let cha_slt;
    if (role_type == 1) {
        cha_slt = getAllEmpName("", "", 6);
    } else if (role_type == 2) {
        cha_slt = getAllEmpName("", "", 6);
    } else if (role_type == 3) {
        cha_slt = getAllEmpName("", userdep_id, 6);
    } else if (role_type == 4) {
        cha_slt = getAllEmpName("", userdep_id, 6);
    } else if (role_type == 5) {
        cha_slt = getAllEmpName("", "", 6);
    }
    setChaSelt(cha_slt)
}
// 为渠道赋上select选项值
function setChaSelt(cha_slt) {
    let slt1 = '';
    for (let i = 0; i < cha_slt.length; i++) {
        let opt = '<option onclick="updc_id(this)" value="' + cha_slt[i].emp_id + '">' + cha_slt[i].name + '</option>';
        slt1 += opt;
    }
    $(slt1).appendTo($("#channel_name"));
}



var types = "";
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

        let channel_name = getEmpName(data.channel_id)
        if (i == 0) {
            types = getTypes()
        }
        let type = getType(data.type);
        let appliTime = timestampToTime(data.appliTime);
        let clientName = getAny(data.clientName);
        let order_state = getOrderState(data.order_state);
        let product_id = getProduct(data.product_id);
        let money = getAny(data.money);
        let userComment = getAny(data.userComment);
        let empComment = getAny(data.empComment);
        let orderFile = getAny(data.orderFile);
        let order_type = getOrder_type(data.order_type);

        let commend1 = getProduct(data.commend1);
        let commend2 = getProduct(data.commend2);
        let commend3 = getProduct(data.commend3);
        let commend4 = getProduct(data.commend4);

        let downloadStr = "";
        if (r26) {
            downloadStr = '<input class="class1" type="button" value="下载" onclick="getFile(this)" style="width: 50px">';
        }
        trtd += '<tr><td hidden><input type="text" name="order_id" value="' + data.order_id + '" style="width: 95%"></td>'
            + '<td><input type="text" name="appli_id" readonly="readonly" value="' + appli_id + '" style="width: 95%"></td>'

            + '<td hidden><input type="text" name="channel_id" value="' + channel_id + '" readonly="readonly"></td>'
            + '<td><input type="text" name="channel_name" value="' + channel_name + '" readonly="readonly"></td>'

            + '<td><input type="text" name="clientName" value="' + clientName + '" readonly="readonly" style="width: 94%"></td>'
            + '<td><input hidden type="text" name="product_type_id" value="' + data.type + '" hidden"><input type="text" name="type" value="' + type + '" readonly="readonly"></td>'
            + '<td><input type="text" name="appliTime" value="' + appliTime + '" readonly="readonly" style="width: 94%"></td>'
            + '<td><input type="text" name="money" value="' + money + '" readonly="readonly"></td>'
            + '<td><input type="text" name="userComment" value="' + userComment + '" readonly="readonly"></td>'
            + '<td><input type="text" name="empComment" value="' + empComment + '" readonly="readonly"></td>'
            + '<td hidden><input type="text" name="orderFile" value="' + orderFile + '" style="width: 97%"></td>'

            + '<td hidden><input type="text" name="commend1" value="' + commend1 + '" style="width: 97%"></td>'
            + '<td hidden><input type="text" name="commend2" value="' + commend2 + '" style="width: 97%"></td>'
            + '<td hidden><input type="text" name="commend3" value="' + commend3 + '" style="width: 97%"></td>'
            + '<td hidden><input type="text" name="commend4" value="' + commend4 + '" style="width: 97%"></td>'

            + '<td><input type="text" name="order_state" value="' + order_state + '" style="width: 97%"><input type="text" value="' + 1 + '" hidden></td>'
            + '<td><input onclick="getOneOrders(this)" type="button" name="handle" value="详情" style="width: 50px">'
            + downloadStr + deleteKey + '</td></tr>';
    }
    $(trtd).appendTo(tableId)
}
function deleteOrders(t) {
    let order_id = $(t).parent().parent().children().children("input[name='order_id']").val();
    let flag = confirmAct('您确认要删除此订单吗');
    if (flag) {
        $.ajax({
            url: "/users/deleteOrder",
            type: "post",
            data: {
                order_id: order_id
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
function getOrder_type(order_type) {
    if (order_type == 2) {
        return '询值';
    } else if (order_type == 3) {
        return '推荐';
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
    if (product_id) {
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
    }
    return text;
}

// 通过类型id，获得相关的商品
function getTypeProduct(product_type_id) {
    let text = "";
    if (product_type_id) {
        $.ajax({
            url: "/users/getProduct",
            type: "post",
            data: {
                product_type_id: product_type_id,
                isNum: 0,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                text = JSON.parse(result).data;
            }
        })
    }
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
    // 清除表格除第一行的所有数据.
    $("#table tr:gt(0)").empty();
    getSplitPage(val, $("#table"))
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
    $("#split").hide();
    // 显示订单详细表格
    $("#table2").show()
    // 隐藏返回顶部按钮
    $("#bottom").attr("style", "display:none");
    $("#update2").show();
    var order_id = "";      // 订单id
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
                if (name2 == 'product_type_id') {
                    $(this).val(val);
                }

                switch (name2) {
                    case 'userComment':
                        if (r14) {
                            let text = set_br_n(val);
                            $(this).next().val(text);
                        }
                        break;
                    case 'empComment':
                        if (r14) {
                            let text = set_br_n(val);
                            $(this).next().val(text);
                        }
                        break;
                    case 'appli_id':
                        if (!r2) {
                            $(this).val('');
                        }
                        break;
                    case 'channel_id':
                        if (r4) {
                            $(this).val(val);
                            $(this).prev().val(val);
                        }
                        break;
                    case 'order_state':
                        let order_str = $(this).val();
                        if (order_str == '申请中') {
                            setOrder_state(2, true);
                        }
                        break;
                    default:
                        break;
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

        switch (name) {
            // 申请状态权限
            case 'order_state':
                if (r10) {
                    $(this).prev().show();
                    $(this).hide();
                }
                break;
            case 'type':
                $(this).attr('disabled', 'disabled');
                break;
            // 订单下载权限
            case 'orderFile':
                if (!r26) {
                    $(this).attr('disabled', 'disabled');
                } else {
                    $(this).attr('readonly', 'readonly');
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
            // 申请时间修改权限
            case 'appliTime':
                if (!r13) {
                    $(this).attr('disabled', 'disabled');
                }
                break;
            case 'clientName':
                // $(this).attr('disabled', 'disabled');
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
            case 'product_type_id':
                if ($(this).next().attr('name') == 'product_id') {
                    if ($("#order_type").val() == '询值') {
                        let product_type_id = $(this).val();
                        let data = getTypeProduct(product_type_id);
                        let select = '';
                        for (let i = 0; i < data.length; i++) {
                            select += '<option value="' + data[i].product_id + '" onclick="setProduct_type_id(this)">' + data[i].name + '</option>'
                        }
                        let t = $(this).prev();
                        $(select).appendTo(t);
                        t.show();
                        $(this).hide();
                        $(this).next().hide();
                    } else {
                        $(this).next().attr('disabled', 'disabled')
                    }
                } else {
                    if ($("#order_type").val() == '询值') {
                    } else {
                        let product_type_id = $(this).val();
                        let data = getTypeProduct(product_type_id);
                        let select = '';
                        for (let i = 0; i < data.length; i++) {
                            select += '<option value="' + data[i].product_id + '" onclick="setProduct_type_id(this)">' + data[i].name + '</option>'
                        }
                        let t = $(this).prev();
                        $(select).appendTo(t);
                        t.show();
                        $(this).hide();
                        $(this).next().hide();
                    }
                }
                break;
            default:
                break;
        }
        $(this).attr('onblur', 'submit(this)');
    })
}
function setProduct_type_id(t) {
    let product_id = $(t).val();
    $(t).parent().next().next().val(product_id);
    $(t).parent().next().next().trigger('onblur');
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
            url: "/users/setOrder_state2",
            type: "post",
            data: {
                order_type: 3,
                order_state: order_state,
                order_id: order_id,
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
                            sendMessage(order_id, 'xunzhi')
                        }
                    } else if (order_state == 4) {
                        let flag = confirmAct('是否确认将此订单状态通知给用户？');
                        if (flag) {
                            sendMessage(order_id, 'xunzhi')
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
    } else if (name.includes('commend')) {
        let flag = confirmAct('是否推荐此商品给用户？');
        if (flag) {
            sendMessage(order_id, 'tuijian');
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
    } else if ($(t).parent().next().attr('name') == 'type') {
        let flag = confirmAct('是否确认修改商品类型？');
        if (flag) {
            name = $(t).parent().next().attr('name')
            val = $(t).val();
            a(name, val);
        }
    } else if (name.includes('commend')) {
        let flag = confirmAct('是否推荐此商品给用户？');
        if (flag) {
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
                order_type:3,
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
function getSplitPage(num, tableId) {
    $("#table tr:gt(0)").empty();
    let limit = $("#pageNo").val();
    $.ajax({
        url: "/users/getOrders",
        type: "post",
        data: {
            order_type: 3,
            appli_id: num,
            role_type: role_type,
            userdep_id: userdep_id,
            busoff_id: busoff_id,
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            let ret = data[0];
            let totalPage = data[1];
            let totalNum = data[2];
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
                window.location.href = '/' + excelFile + '/' + pt2;
            }
        }
    })
}
function getAllProducts() {
    let text;
    $.ajax({
        url: "/users/getProduct",
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
// 先获取所有用户的id与姓名，再通过id进行判断
function getAllEmpName(emp_id, dep_id, type) {
    let text;
    $.ajax({
        url: "/users/getEmpName",
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