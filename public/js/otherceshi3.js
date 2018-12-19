// 获得资质表的信息,并将其打印到当前页面中
function getAllUsers() {
    let flag = true;
    let title = $("#title").val();
    let text = $('#text').val();
    if (!title || title == "") {
        flag = false;
        alert('公告标题不能为空');
    } else if (!text || text == "") {
        flag = false;
        alert('公告内容不能为空');
    }
    if (flag) {
        $("#person").show();
        $("#message").hide();
        $.ajax({
            url: "/users/getUser6",
            type: "post",
            data: {
                type: 6
            },
            async: false,
            dataType: "text",
            success: function (result) {
                result = JSON.parse(result).data
                let trtd = "";
                for (let i = 0; i < result.length; i++) {
                    let username = result[i].username;
                    let tel = result[i].tel;
                    trtd += '<tr><td><input type="checkbox"></td>'
                        + '<td>' + username + '<input type="text" value="' + tel + '" hidden></td></tr>';
                }
                $(trtd).appendTo($("#person table"));
            }
        })
    }
}


// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href =  '/users/other/ceshi' + num + '?menu=' + num;
}


// 确认发送按钮
function reSend() {
    let title = $("#title").val();
    let text = $('#text').val();
    let flag = confirmAct('是否确认发送公告？');
    if(flag) {
        $.ajax({
                url: "/users/sendMessage",
                type: "post",
                data: {
                    title: title,
                    text:text
                },
                async: false,
                dataType: "text",
                success: function (result) {
                    result = JSON.parse(result).data
                    
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
// 全选与全不选事件
function checkAll(t) {
    let flag = true;
    let num = 1;
    let table = $(t).parent().parent().parent();
    table.children().children().children('input[type="checkbox"]').each(function () {
        if (flag) {
            if ($(this).prop('checked') == true) {
                num = 1;
                flag = false;
            } else {
                num = 2;
                flag = false;
            }
        }
        if (num == 1) {
            $(this).removeProp('checked', 'checked');
        } else {
            $(this).prop('checked', 'checked');
        }
    })
}
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