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


// 跳转当前测试1页面，即管理与创建
function jump(text) {
    window.location.href = '/user/user' + text + '?menu=' + text;
}



// 提交当前页面数据     ✔
function submit() {
    var result = true;
    $(".ipt").each(function () {
        let val = $(this).val();
        if (val.trim() == "") {
            result = false;
        }
    })
    if (result) {
        let password = $("#password").val();
        let num = $("#num").val()
        let code = $("#roles").val()
        $.ajax({
            url: "/user/createUsers",
            type: "post",
            data: {
                password: password,
                num: num,
                code: code
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'error') {
                    alert('创建账户失败')
                } else {
                    alert('创建账户成功');
                    result = JSON.parse(result).userArr;
                    let text = "";
                    for (let i = 0; i < result.length; i++) {
                        let username = result[i].username;
                        let password = result[i].password;
                        let iiuv = result[i].iiuv;
                        text += '<span style="margin-left:5px">user:' + username + ' pass:' + password + ' iiuv:' + iiuv + ' /</span>'
                    }
                    $("#userInfo").empty();
                    $(text).appendTo($("#userInfo"));
                    $("#userInfo").show();
                }
            }
        })

    } else {
        alert('数据有误，提交失败')
    }
}
// 校验两次密码是否一致     ✔
function verifg(t) {
    let password = $("#password").val();
    let repassword = $(t).val();
    if (password != repassword) {
        $(t).next().next().attr('style', 'color:red')
        $(t).next().next().show()
        $("#creatButton").attr('disabled', 'disabled');
    } else {
        $(t).next().next().attr('style', 'display:none')
        $("#creatButton").removeAttr('disabled');
    }
}
// ok
// 通过传入用户名获得当前用户的角色，并判断是否为管理账户，如果是将框框打钩     ✔
function getRole(username) {
    $.ajax({
        url: "/user/getRole",
        type: "post",
        data: {
            username: username
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result);
            let role = result.role;
            let emp = result.emp;
            $("#role1").val(role.name)
            if (role.code == 1) {
                $("#one").attr('checked', 'checked')
            }
            if (emp.length != 0) {
                $("#iiuv").val(emp[0].iiuv)
            }
        }
    })
}
// ok
// 获得所有的角色   ✔
function getRoles() {
    let roles = $("#roles")
    $.ajax({
        url: "/user/getRoles",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            let option = '<option value="">----请选择----</option>';
            for (let i = 0; i < result.length; i++) {
                if (result[i].code == '6' || result[i].code == '1') {
                    continue;
                } else {
                    option += '<option value="' + result[i].code + '">' + result[i].name + '</option>'
                }
            }
            $(option).appendTo(roles)
        }
    })
}