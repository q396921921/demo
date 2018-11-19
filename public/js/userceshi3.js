function bindEvents() {
    $("input[type='button']").each(function () {
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



// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/user/ceshi' + num + '?menu=' + num;
}




// 校验输入的密码是否和数据库中的一致
function reverifg(username, password) {
    let flag = true;
    $.ajax({
        url: "/users/getUserByUserPass",
        type: "post",
        data: {
            username: username,
            password: password
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'success') {

            } else {
                flag = false;
            }
        }
    })
    return flag;
}
// 校验手机号的正确性
function checkMobile(str) {
    let flag = false;
    var re = /^1\d{10}$/
    if (re.test(str)) {
        flag = true;
    } else {
        alert("手机号格式错误！");
    }
    return flag;
}
// // 校验身份证号的正确性
// function checkIdCard(card) {
//     let flag = true;
//     var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
//     if (reg.test(card) === false) {
//         alert("身份证输入不合法");
//         flag = false;
//     }
//     return flag;
// }
// 提交当前页面数据     ✔
function submit() {
    let username = $("#username1").val()
    let name = $('#name').val()
    let password = $("#password1").val();
    let repassword = $("#password2").val();
    let repassword2 = $("#password3").val();
    let tel = $("#tel").val();
    // let idCard = $("#idCard").val();
    // , "idCard": idCard
    let jsBody = { "tel": tel }
    let keys = Object.keys(jsBody);
    let rlt2 = true;
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let val = jsBody[key];
        if (key == 'tel') {
            let flag = checkMobile(val);
            if (!flag) {
                rlt2 = false;
                break;
            }
        }
        // else if (key == 'idCard') {
        //     let flag = checkIdCard(val);
        //     if (!flag) {
        //         rlt2 = false;
        //         break;
        //     }
        // }
    }
    if (rlt2) {
        // 如果用户输入了原始密码或者确认密码不为空
        if (password && password != "" || repassword != "") {
            let flag = reverifg(username, password);
            if (flag) {
                if (repassword == repassword2) {
                    submitForm(name, repassword, username, tel, true);
                }else {
                    alert('两次密码输入不一致，请重新输入')
                }
            } else {
                alert('原始密码错误，提交失败')
            }
        } else {
            submitForm(name, repassword, username, tel, false)
        }
    }
}
// 提交表达当中的所有数据
function submitForm(name, repassword, username, tel, exist) {
    $.ajax({
        url: "/users/updateUserInfo",
        type: "post",
        data: {
            name: name,
            repassword: repassword,
            username: username,
            tel: tel,
            exist: exist
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'success') {
                alert('修改信息成功')
                if (exist) {
                    window.location.href = '/users/login';
                }
            } else {
                alert('修改信息失败')
            }
        }
    })
}
// 通过传入用户名获得当前用户的角色，并判断是否为管理账户，如果是将框框打钩     ✔
function getRole(username) {
    $.ajax({
        url: "/users/getRole",
        type: "post",
        data: {
            username: username
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            $("#role1").val(result[0].name)
            $("#username2").val(result[0].name)
            if (result[0].code == 1) {
                $("#one").attr('checked', 'checked');
                $("#iiuv").attr('readonly', 'readonly');
                $("#name").attr('readonly', 'readonly');
                $("#tel").attr('readonly', 'readonly');
                $("#idCard").attr('readonly', 'readonly');
                $("#password1").attr('readonly', 'readonly');
                $("#password2").attr('readonly', 'readonly');
                $("#saveButton").hide();

            }
            if (result[1]) {
                let user = result[1][0]
                $("#iiuv").val(user.iiuv)
                $("#name").val(user.name);
                $("#tel").val(user.tel);
                $("#idCard").val(user.idCard)
            }
        }
    })
}