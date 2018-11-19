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
    $("#table").empty();
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
// 跳转当前测试1页面，即全部与筛选
function jump(num) {
    window.location.href = '/users/appli/ceshi' + num + '?menu=' + num;
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
            var typeStr = '<select id="type" style="width:100%; background:white"><option value="">所有类型</option>';
            for (var i = 0; i < type.length; i++) {
                if (i == type.length - 1) {
                    typeStr += '<option value="' + type[i].product_type_id + '">' + type[i].name + '</option></select>';
                } else {
                    typeStr += '<option value="' + type[i].product_type_id + '">' + type[i].name + '</option>'
                }
            }
            var depStr = '<select id="dep_id" style="width:100%; background:white"><option value="">所有部门</option>';
            for (var i = 0; i < dep.length; i++) {
                if (i == dep.length - 1) {
                    depStr += '<option value="' + dep[i].dep_id + '">' + dep[i].managerName + '</option></select>';
                } else {
                    depStr += '<option value="' + dep[i].dep_id + '">' + dep[i].managerName + '</option>'
                }
            }
            var stateStr = '<select id="order_state" style="width:100%; background:white">'
                + '<option value="">所有状态</option>'
                + '<option value="1">申请中</option>'
                + '<option value="2">审核中</option>'
                + '<option value="3">通过</option>'
                + '<option value="4">失败</option>'
                + '<option value="5">撤销</option></select>'
            var order_typeStr = '<select id="order_type" style="width:100%; background:white">'
                + '<option value="">所有类型</option>'
                + '<option value="1">申请订单</option>'
                + '<option value="2">询值订单</option>'
                + '<option value="3">推荐订单</option></select>'

            var img1 = '<img width="100%" height="23px" style="display:none" name="';
            var img2 = '" src="/images/true.jpg">';
            var trtd = $('<tr><td width="2%">' + img1 + 'appli_id' + img2 + '</td>' +
                '<td width="7%">订单编号</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'channel_id' + img2 + '</td>' +
                '<td width="7%">渠道编号</td>' +
                '<td width="9%">' + channelStr + '</td>' +
                '<td width="2%">' + img1 + 'business_id' + img2 + '</td>' +
                '<td width="7%">业务编号</td>' +
                '<td width="9%">' + businessStr + '</td>' +
                '<td width="2%">' + img1 + 'office_id' + img2 + '</td>' +
                '<td width="7%">内勤编号</td>' +
                '<td width="9%">' + officeStr + '</td>' +
                '<td width="2%">' + img1 + 'type' + img2 + '</td>' +
                '<td width="7%">产品类型</td>' +
                '<td width="9%">' + typeStr + '</td></tr>'

                + '<tr><td width="2%">' + img1 + 'relation_state_id' + img2 + '</td>' +
                '<td width="7%">申请状态</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'appliTime' + img2 + '</td>' +
                '<td width="7%">申请时间</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'orderFile' + img2 + '</td>' +
                '<td width="7%">订单文件</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'dep_id' + img2 + '</td>' +
                '<td width="7%">组别</td>' +
                '<td width="9%">' + depStr + '</td>' +
                '<td width="2%">' + img1 + 'empComment' + img2 + '</td>' +
                '<td width="7%">备注</td>' +
                '<td width="9%"></td></tr>' +
                '<tr><td width="2%" height="23px">' + img1 + 'order_state' + img2 + '</td>' +
                '<td width="7%">订单状态</td>' +
                '<td width="9%">' + stateStr + '</td>' +
                '<td width="2%" height="23px">' + img1 + 'clientName' + img2 + '</td>' +
                '<td width="7%">客户姓名</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'loanTime' + img2 + '</td>' +
                '<td width="7%">放款时间</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'money' + img2 + '</td>' +
                '<td width="7%">放款金额</td>' +
                '<td width="9%"></td>' +
                '<td width="2%">' + img1 + 'isNum' + img2 + '</td>' +
                '<td width="7%">是否询值</td>' +
                '<td width="9%">' + order_typeStr + '</td></tr>'
            )
            var trtd2 = $('<tr><td height="25px" width="7%">申请时间</td>' +
                '<td width="3%"><input type="radio" name="time" value="0"></td>' +
                '<td width="9%">指定时间</td>' +
                '<td width="9%"><input type="text" value="2000-01-01" name="time1" onblur="setTime(this)"></td>' +
                '<td width="5%">到</td>' +
                '<td width="9%"><input type="text" value="2000-01-01" name="time2" onblur="setTime(this)"></td>' +
                '<td width="3%"><input type="radio" name="time" checked="checked" value="1"></td>' +
                '<td width="7%">最近一周</td>' +
                '<td width="3%"><input type="radio" name="time" value="2"></td>' +
                '<td width="7%">最近一月</td>' +
                '<td width="3%"><input type="radio" name="time" value="3"></td>' +
                '<td width="7%">最近一季度</td></tr>' +
                '<tr><td colspan="5">申请时间</td><td><input type="radio" name="timeType" value="8" checked></td>' +
                '<td colspan="5">放款时间</td><td><input type="radio" name="timeType" value="9"></td></td></tr>'
            )
            trtd.appendTo($("#c"))
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
    var str = '<select id="' + head + '" style="width:100%; background:white">'
    if (head == 'office') {
        str += '<option value="">所有内勤</option>';
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
    $("#pageNo").val(1);
    var type = $("#type").val();
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
            role_type: role_type,
            userdep_id: userdep_id,
            busoff_id: busoff_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let names = getSelect();
            types = getTypes()
            let data = JSON.parse(result).result;
            let totalMoney = 0;
            for (let i = 0; i < data.length; i++) {
                let money = data[i].money
                if (money) {
                    totalMoney += money;
                }
            }

            $("#totalPage").val(Math.ceil(data.length / 10));
            $("#totalNum").val(data.length)
            getSplitPage()
            $("#totalOrder").val(data.length);
            $("#totalMoney").val(totalMoney);

        }
    })
}
function getSplitPage() {
    deleteTb()
    let limit = $("#pageNo").val();
    let order_type = $("#order_type").val();
    var type = $("#type").val()
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
            "limit": limit,
            role_type: role_type,
            userdep_id: userdep_id,
            busoff_id: busoff_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let names = getSelect();
            types = getTypes()
            result = JSON.parse(result).result;
            $("#data").val(JSON.stringify(result));
            $("#pages").val(limit);
            $("#lstd span:first").html(limit);
            $("#lstd span:last").html($("#totalPage").val());

            deleteTb()
            printTr(names)
            for (let i = 0; i < result.length; i++) {
                printTable(names, result[i])
            }
            splitPageCss();
        }
    })
}

function output(t) {
    $(t).prev().trigger("click");
    let val = $("#data").val();
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
// 获取到相应的部门信息     
function getDep(dep_id) {
    var text = "";
    if (dep_id) {
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
    } else {
        text = "暂无"
    }
    return text;
}
// 打印表格的第一行表头
function printTr(names) {
    let num = 100 / parseInt(names.length);
    let tr = '<tr>'
    for (let i = 0; i < names.length; i++) {
        let name = getTextStr(names[i]);
        if (names[i] != 'isNum') {
            tr += '<td width="' + num + '%">' + name + '</td>';
        }
    }
    tr += '</tr>';
    $(tr).appendTo($("#table"))
}
// 通过传过来的names的字母值，来输出对应的汉字
function getTextStr(date) {
    let text = "";
    switch (date) {
        case 'appli_id':
            text = '订单编号'
            break;
        case 'channel_id':
            text = '渠道编号'
            break;
        case 'business_id':
            text = '业务编号'
            break;
        case 'office_id':
            text = '内勤编号'
            break;
        case 'type':
            text = '产品类型'
            break;
        case 'relation_state_id':
            text = '申请状态'
            break;
        case 'money':
            text = '放款金额'
            break;
        case 'appliTime':
            text = '申请时间'
            break;
        case 'loanTime':
            text = '放款时间'
            break;
        case 'orderFile':
            text = '订单文件'
            break;
        case 'dep_id':
            text = '组别'
            break;
        case 'empComment':
            text = '备注'
            break;
        case 'order_state':
            text = '订单状态'
            break;
        case 'clientName':
            text = '客户姓名'
            break;
        default:
            break;
    }
    return text
}
// 动态打印表体数据
function printTable(names, rst) {
    let tr = '<tr>';
    for (let i = 0; i < names.length; i++) {
        let name = names[i];
        let val = rst[name];
        if (name == 'type') {
            val = getType(val);
        } else if (name == 'appliTime') {
            val = getTime(val);
        } else if (name == 'loanTime') {
            val = getTime(val);
        } else if (name == 'dep_id') {
            val = getDep(val)
        } else if (name == 'relation_state_id') {
            val = getOrderState(val)
        } else if (name == 'channel_id' || name == 'business_id' || name == 'office_id') {
            val = getEmpName(val);
        } else {
            val = getAny(val)
        }
        if (name != 'isNum') {
            tr += '<td><input type="text" readonly="readonly" value="' + val + '" style="width: 95%"></td>'
        }
    }
    tr += '</tr>';
    $(tr).appendTo($("#table"))
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