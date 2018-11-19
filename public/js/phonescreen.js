function bindEvents() {
    $(".canButton").each(function () {
        $(this).bind('mouseover', function () {
            $(this).css('background', 'green')
        })
        $(this).bind('mouseout', function () {
            if ($(this).attr('name') == 'head2') {
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





// 用来存储查询到的所有产品类型的变量
var types = "";
// 获得实际表达
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}
// 删除表格的除第一行的所有数据
function deleteTb() {
    // 清除表格除第一行的所有数据
    $("#table1 tr:gt(0)").empty();
}
// 遍历types变量,通过对应的id,得到对应的类型值
function getType(type) {
    var text = "";
    for (var i = 0; i < types.length; i++) {
        if (types[i].product_type_id == type) {
            text = types[i].name;
            break;
        }
    }
    return text;
}
// 从数据库中取得当前所有的产品类型，并记录到当前网页
function getTypes() {
    var text = "";
    $.ajax({
        url: "/users/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result)
        }
    })
    return text;
}
// 获得审核状态的实际表达
function getStates(state_id) {
    var text = "";
    if (state_id) {
        $.ajax({
            url: "/users/getStates",
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
    }
    return text
}
// 获取所有的筛选条件信息
function getScreen() {
    $.ajax({
        url: "/users/getScreen",
        type: "post",
        data: {
            role_type: role_type,
            userdep_id: userdep_id,
            emp_id: emp_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result);
            var type = result.type;
            var channelStr = getId('channel', result.channel);
            var businessStr = getId('business', result.business);
            var officeStr = getId('office', result.office);
            var dep = result.dep;
            var typeStr = '<select id="type" style="background:white"><option value="">所有类型</option>';
            for (var i = 0; i < type.length; i++) {
                if (i == type.length - 1) {
                    typeStr += '<option value="' + type[i].product_type_id + '">' + type[i].name + '</option></select>';
                } else {
                    typeStr += '<option value="' + type[i].product_type_id + '">' + type[i].name + '</option>'
                }
            }
            var depStr = '<select id="dep_id" style="background:white"><option value="">所有部门</option>';
            for (var i = 0; i < dep.length; i++) {
                if (i == dep.length - 1) {
                    depStr += '<option value="' + dep[i].dep_id + '">' + dep[i].managerName + '</option></select>';
                } else {
                    depStr += '<option value="' + dep[i].dep_id + '">' + dep[i].managerName + '</option>'
                }
            }
            var stateStr = '<select id="order_state" style="background:white">'
                + '<option value="">所有状态</option>'
                + '<option value="1">申请中</option>'
                + '<option value="2">审核中</option>'
                + '<option value="3">通过</option>'
                + '<option value="4">失败</option>'
                + '<option value="5">撤销</option></select>'
            var order_typeStr = '<select id="order_type" style="background:white">'
                + '<option value="">所有类型</option>'
                + '<option value="1">申请订单</option>'
                + '<option value="2">询值订单</option>'
                + '<option value="3">推荐订单</option></select>'

            let trtd = '<tr><td>渠道编号:' + channelStr + '</td>' +
                '<td>业务编号:' + businessStr + '</td></tr>' +
                '<tr><td>内勤编号:' + officeStr + '</td>' +
                '<td>产品类型:' + typeStr + '</td></tr>' +
                '<tr><td>组&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;别:' + depStr + '</td>' +
                '<td>订单状态:' + stateStr + '</td></tr>' +
                '<tr><td>是否询值:' + order_typeStr + '</td></tr>';

            var trtd2 = $('<tr><td width="50%">申请时间:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="time" value="0">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>' +
                '<tr><td width="50%">指定时间:<input type="text" value="2018-05-03" name="time1" onblur="setTime(this)" style="width:43%"></td>' +
                '<td width="50%">到:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="text" value="2018-06-03" name="time2" onblur="setTime(this)" style="width:43%"></td></tr>' +
                '<tr><td width="50%">最近一周:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="time" checked="checked" value="1">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
                '<td width=50%">最近一月:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="time" value="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>' +
                '<tr><td width="50%">最近一季度:&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="time" value="3">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></tr>' +
                '<tr><td width="50%">申请时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="timeType" value="8" checked>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
                '<td width="50%">放款时间&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="timeType" value="9">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td></td></tr></tr>')
            $(trtd).appendTo($("#c"))
            trtd2.appendTo($("#d"))
        }
    })
}
function setTime(t) {
    if ($(t).attr("name") == "time1") {
        $("#time1").val($(t).val())
    } else {
        $("#time2").val($(t).val())
    }
}
// 返回相应的用于动态添加html元素的字符串
function getId(head, data) {
    var str = '<select id="' + head + '" style=" background:white">'
    if (head == 'office') {
        str += '<option value="">所有内勤</option>';
        str += '<option value=0>无内勤</option>';
    } else if (head == 'channel') {
        str += '<option value="">所有渠道</option>';
    } else if (head == 'business') {
        str += '<option value="">所有业务</option>';
    }
    for (var i = 0; i < data.length; i++) {
        if (i == data.length) {
            str += '<option value="' + data[i].emp_id + '">' + data[i].name + '</option></select>';
        } else {
            str += '<option value="' + data[i].emp_id + '">' + data[i].name + '</option>'
        }
    }
    return str;
}
// 通过订单编号查询
function getOrderById() {
    deleteTb();
    let val = $("#aid").val();
    $.ajax({
        url: "/users/getOrders",
        type: "post",
        data: {
            appli_id: val,
            type: 1
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let names = getSelect();
            types = getTypes()
            result = JSON.parse(result).result
            $("#data").val(result);
            deleteTb()
            printTr(names)
            for (let i = 0; i < result.length; i++) {
                printTable(names, result[i])
            }
        }
    })
}
// 点击统计按钮触发的事件
function getScreenOrders() {
    limit = 1;
    var type = $("#type").val()
    let order_type = $("#order_type").val();
    var channel_id = $("#channel").val();
    var business_id = $("#business").val();
    var office_id = $("#office").val();
    var dep_id = $("#dep_id").val();
    var order_state = $("#order_state").val();
    var timeType = $('input[name="timeType"]:checked').val();
    var time1 = $("#time1").val()
    var time2 = $("#time2").val()
    $.ajax({
        url: "/users/screen",
        type: "post",
        data: {
            'order_type': order_type,
            "type": type,
            "channel_id": channel_id,
            "business_id": business_id,
            "office_id": office_id,
            "dep_id": dep_id,
            "order_state": order_state,
            "time1": time1,
            "time2": time2,
            "timeType": timeType,
            "role_type": role_type,
            "userdep_id": userdep_id,
            "busoff_id": busoff_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let names = getSelect();
            types = getTypes()
            result = JSON.parse(result).result
            $("#data").val(JSON.stringify(result));
            deleteTb();
            let totalMoney = 0;
            for (let i = 0; i < result.length; i++) {
                let money = result[i].money
                if (money) {
                    totalMoney += money;
                }
            }
            $("#totalOrder").val(result.length);
            $("#totalMoney").val(totalMoney);
            getSplitScreenOrders();
        }
    })
}
// 分页触发的事件
function getSplitScreenOrders() {
    var type = $("#type").val()
    let order_type = $("#order_type").val();
    var channel_id = $("#channel").val();
    var business_id = $("#business").val();
    var office_id = $("#office").val();
    var dep_id = $("#dep_id").val();
    var order_state = $("#order_state").val();
    var timeType = $('input[name="timeType"]:checked').val();
    var time1 = $("#time1").val()
    var time2 = $("#time2").val()
    $.ajax({
        url: "/users/screen",
        type: "post",
        data: {
            'order_type': order_type,
            "type": type,
            "channel_id": channel_id,
            "business_id": business_id,
            "office_id": office_id,
            "dep_id": dep_id,
            "order_state": order_state,
            "time1": time1,
            "time2": time2,
            "timeType": timeType,
            "role_type": role_type,
            "userdep_id": userdep_id,
            "busoff_id": busoff_id,
            "limit": limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).result
            if (result.length == 0) {
                $("#text").show();
                setTimeout(function () {
                    $("#text").hide();
                }, 1000)
                return false;
            } else {
                $("#data").val(JSON.stringify(result));
                printTable(result);
                limit++;
                return false;
            }
        }
    })
}
// 获取到相应的部门信息     
function getDep(dep_id) {
    var text = "";
    $.ajax({
        url: "/users/getDep",
        type: "post",
        data: {
            dep_id: dep_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result).result[0].managerName;
        }
    })
    return text;
}

// 获得被选择了的表头
function getSelect() {
    var names = [];
    $("img").each(function () {
        var name = $(this).attr('name')
        if ($(this).css('display') != 'none') {
            names.push(name);
        }
    })
    return names;
}
// 获得当前时间
function getNowTime() {
    var timestamp = new Date().getTime();
    return getTime(timestamp)
}
// 通过传入时间戳获得对应的格式化时间（字符串）
function getTime(timestamp) {
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