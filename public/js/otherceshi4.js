
// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href =  '/users/other/ceshi' + num + '?menu=' + num;
}


// 提交创建一条新闻所需要的所有信息
function ajaxSubmit(t) {
    $(t).parent().ajaxSubmit({
        type: 'post',
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result);
            let loans = data.loans;
            let deals = data.deals;
            let calls = data.calls;
            let emps = data.emps;
            $("#loans").html(loans);
            $("#deals").html(deals);
            $("#calls").html(calls);
            $("#emps").html(emps);
            let flag = true;
            $('table input').each(function () {
                let val = Number($(this).val());
                if (isNaN(val)) {
                    flag = false;
                }
            })
            if (flag) {
                let total_loan = getNum($('#loanA').val(), loans, $('#loanB').val());
                let total_deal = getNum($('#dealA').val(), deals, $('#dealB').val());
                let total_call = getNum($('#callA').val(), calls, $('#callB').val());
                let total_emp = getNum($('#empA').val(), emps, $('#empB').val());
                $("#total_loan").html(total_loan);
                $("#total_deal").html(total_deal);
                $("#total_call").html(total_call);
                $("#total_emp").html(total_emp);
            } else {
                alert('某基数或者指数不为数字')
            }
        }
    })
}
// 计算返回的虚拟值
function getNum(A, N, B) {
    A = Number(A);
    N = Number(N);
    B = Number(B);
    return A + N * B;
}

function getDataAB() {
    $.ajax({
        url: "/users/getDataAB",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let loanA = data.loanA;
            let loanB = data.loanB;
            let dealA = data.dealA;
            let dealB = data.dealB;
            let callA = data.callA;
            let callB = data.callB;
            let empA = data.empA;
            let empB = data.empB;
            $("#loanA").val(loanA);
            $("#loanB").val(loanB);
            $("#dealA").val(dealA);
            $("#dealB").val(dealB);
            $("#callA").val(callA);
            $("#callB").val(callB);
            $("#empA").val(empA);
            $("#empB").val(empB);
        }
    })
}

// 提交创建一条新闻所需要的所有信息
function updateDataAB(t) {
    let flag = confirmAct('是否确认修改数据?');
    if (flag) {
        $(t).prev().ajaxSubmit({
            type: 'post',
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('修改成功');
                } else {
                    alert('修改失败');
                }
            }
        })
    }
}
// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
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