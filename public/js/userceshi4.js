function bindEvents() {
    $("input[type='button']").each(function () {
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



// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/user/ceshi' + num + '?menu=' + num;
}


// 先获取所有用户的id与姓名，再通过id进行判断
function getAllEmpName(emp_id, dep_id, type) {
    let text;
    $.ajax({
        url: "/users/getUser",
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

function getEmpName(iiuv) {
    let text = "";
    let allName = JSON.parse($("#allName").val());
    for (let i = 0; i < allName.length; i++) {
        if (parseInt(allName[i].iiuv) == iiuv && parseInt(allName[i].type) != 6) {
            text = allName[i].name;
            break;
        }
    }
    return text
}

// id查询
function deleteTb() {
    $("#table tr:gt(0)").empty()
    let username = $("#aid").val()
    $.ajax({
        url: "/users/getUser",
        type: "post",
        data: {
            username: username,
            type: 6
        },
        async: false,
        dataType: "text",
        success: function (result) {
            printTable(result);
        }
    })

}
// 查询所有用户级别的账户
function getUser6() {
    $.ajax({
        url: "/users/getUser6",
        type: "post",
        data: {
            type: 6
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            let totalPage = data[1];
            let totalNum = data[2];
            $("#totalPage").val(totalPage);
            $("#totalNum").val(totalNum)
        }
    })
}
function getSplitPage() {
    $("#table tr:gt(0)").empty();
    let limit = $("#pageNo").val();
    $.ajax({
        url: "/users/getUser6",
        type: "post",
        data: {
            type: 6,
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            printTable(data[0]);
            $("#pages").val(limit);
            $("#lstd span:first").html(limit);
            $("#lstd span:last").html($("#totalPage").val());
            splitPageCss()
        }
    })
}
function printTable(result) {
    let str = "";
    let str2 = "";
    let str3 = "";
    let str4 = "";
    let str5 = "";
    // 推荐码修改权限
    if (!r17) {
        str = 'readonly'
    } else {
        str = 'onblur="updateUser6(this)"'
    }
    // 推荐码可视
    if (!r18) {
        str2 = 'hidden';
    }
    // 注册时间
    if (!r19) {
        str3 = 'hidden';
    }
    // 上一次登录时间
    if (!r20) {
        str4 = 'hidden';
    }
    // 最后一次提交申请时间
    if (!r21) {
        str5 = 'hidden';
    }
    for (let i = 0; i < result.length; i++) {
        let data = result[i];
        let username = data.username;
        let name = data.name;

        let registTime = timestampToTime(data.registTime)
        let iiuv = getAny(data.iiuv)
        let buf_name = getEmpName(iiuv);
        // let appliInfo = "";     // 申请信息查看
        let logTime = timestampToTime(data.logTime)
        let submitTime = timestampToTime(data.submitTime);
        // let scoreChange = '';       // 积分变动
        let trtd = $('<tr><td hidden><input type="text" name="emp_id" value="' + data.emp_id + '" style="width: 95%"></td>'
            + '<td><input type="text" name="name" readonly value="' + name + '" style="width: 95%"></td>'
            + '<td><input type="text" name="username" readonly value="' + username + '" style="width: 95%"></td>'
            + '<td ' + str3 + '><input type="text" name="registTime" value="' + registTime + '" readonly ></td > '
            + '<td ' + str2 + '><input type="text" name="buf_name" readonly value="' + buf_name + '" style="width: 95%"></td>'
            + '<td ' + str2 + '><input type="text" name="iiuv" value="' + iiuv + '" ' + str + ' style="width: 94%"></td>'
            // + '<td><input type="text" name="appliInfo" value="' + appliInfo + '" readonly="readonly"></td>'
            + '<td ' + str4 + '><input type="text" name="logTime" value="' + logTime + '" readonly></td>'
            + '<td ' + str5 + '><input type="text" name="submitTime" value="' + submitTime + '" readonly></td></tr>');
        // + '<td><input type="text" name="scoreChange" value="' + scoreChange + '" readonly="readonly"></td>
        trtd.appendTo($("#table"))
    }
}
function printTbTr() {
    if (r19) {
        $('<td width="17%">注册时间</td>').appendTo($("#table tr"));
    }
    if (r18) {
        $('<td width="10%">业务名</td>').appendTo($("#table tr"));
        $('<td width="17%">推荐码</td>').appendTo($("#table tr"));
    }
    if (r20) {
        $('<td width="17%">上次登录时间</td>').appendTo($("#table tr"));
    }
    if (r21) {
        $('<td width="17%">最后提交时间</td>').appendTo($("#table tr"));
    }
}
// 修改用户的推荐码
function updateUser6(t) {
    let emp_id = $(t).parent().parent().children().children('input[name="emp_id"]').val();
    let iiuv = $(t).parent().parent().children().children('input[name="iiuv"]').val();
    if (iiuv > 100000 && iiuv < 1000000) {
        $.ajax({
            url: "/users/updateUser6",
            type: "post",
            data: {
                emp_id: emp_id,
                iiuv: iiuv
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('修改成功')
                } else if (result == 'nouser') {
                    alert('暂无与该推荐码对应的业务，修改失败')
                } else {
                    alert('修改失败');
                }
            }
        })
    } else {
        alert('推荐码不符合上传规则，请输入100000 - 1000000');
    }
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
// 对于数据库中为null的数据，直接在前端显示为空     ✔
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}