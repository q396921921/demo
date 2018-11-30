function bindEvents() {
    $(".canButton").each(function () {
        $(this).bind('mouseover', function () {
            $(this).css('background', 'green')
        })
        $(this).bind('mouseout', function () {
            if ($(this).attr('name') == 'head3') {
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




// 跳转当前测试1页面，即全部与筛选
function jump(num) {
    window.location.href = '/users/product/ceshi' + num + '?menu=' + num;
}
// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}

// 获得所有的流程id与名字
function getFlows() {
    $("#allFlows tr:gt(0)").empty()
    $.ajax({
        url: "/users/getFlow",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let trtd = '';
            for (let i = 0; i < result.length; i++) {
                trtd += '<tr><td><input type="text" name="flow_id" value="' + result[i].data.flow_id + '"></td>'
                    + '<td><input type="text" value="' + result[i].data.flow_name + '"></td>'
                    + '<td><input type="button" class="canButton" value="删除" style="width:50px" onclick="deleteFlow(this)"></td></tr>';
            }
            $(trtd).appendTo($("#allFlows"));
        }
    })
}
// 删除一个完整的流程
function deleteFlow(t) {
    let flag = confirmAct('确认要删除此流程吗？');
    if (flag) {
        let flow_id = $(t).parent().parent().children().children('input[name="flow_id"]').val();
        $.ajax({
            url: "/users/deleteFlow",
            type: "post",
            data: {
                flow_id: flow_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'orderFail') {
                    alert('尚有与此流程关联的订单，本次删除失败')
                } else if (result == 'error') {
                    alert('系统内部出现错误，删除此流程失败')
                } else if (result == 'productFail') {
                    alert('尚有与此流程关联的商品，本次删除失败')
                } else if (result == 'success') {
                    alert('删除流程成功');
                    location = location;
                }

            }
        })
    }
    return false
}
// 表单用ajax进行提交，然后后台进行修改
function submitForm(t) {
    $(t).parent().children('form').ajaxSubmit({
        type: 'post',
        async: false,
        dataType: "text",
        success: function (result) {
            console.log(result);
            if (result == 'success') {
                alert('创建成功')
            } else {
                alert('修改失败')
            }
        }
    })
    return false;
}
// 显示创建界面
function showCreate() {
    $("#create").show();
    $("#delete").hide();
}
// 显示删除界面
function showDelete() {
    $("#create").hide();
    $("#delete").show();
    getFlows();
}
// 获取当前行的索引，为leavl等级赋值
function setLeavlNum(t) {
    let rows = $(t).parent().parent().index();
    $(t).parent().next().next().children().val(rows);
}
// 添加一行流程
function insertFlow() {
    let trtd = '<tr><td>具体流程名:</td><td><input type="text" name="detail_flow_name" onfocus="setLeavlNum(this)"></td><td>级别</td>'
        + '<td><input type="text" name="flow_leavl" readonly></td></tr>';
    $(trtd).appendTo($("#createFlow"));
    let trtd2 = '<table class="createState"><tr>'
        + '<td><input type="button" value="添加一行" onclick="insertState(this)"></td><td colspan="2">创建具体状态</td>'
        + '<td><input type="button" value="删除一行" onclick="deleteState(this)"></td></tr>'
        + '<tr><td>具体状态名:</td><td><input type="text" name="detail_state_name" onfocus="setLeavlNum(this)"></td>'
        + '<td>级别</td><td><input type="text" name="state_leavl" readonly></td></tr></table>';
    $(trtd2).appendTo($("#formRight"))

}
// 删除一行流程
function deleteDetailFlow() {
    $("#createFlow tr:not(:first):not(:first):last").remove();
    $("#formRight table:not(:first):last").remove();
}

// 添加一行状态
function insertState(t) {
    let elt = $(t).parent().parent().parent()
    let trtd = '<tr><td>具体状态名:</td><td><input type="text" name="detail_state_name" onfocus="setLeavlNum(this)"></td>'
        + '<td>级别</td><td><input type="text" name="state_leavl" readonly></td></tr>';
    $(trtd).appendTo(elt);
}
// 删除一行状态
function deleteState(t) {
    let elt = $(t).parent().parent().parent().children('tr:not(:first):not(:first):last')
    elt.remove();
}