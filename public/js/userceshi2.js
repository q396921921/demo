function bindEvents() {
    $("input").each(function () {
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


// 图片勾勾的选择
function imgShow(t) {
    var ts = $(t).children();
    ts.each(function () {
        let tagName = $(this).get(0).tagName
        if (tagName == 'IMG') {
            if ($(this).css('display') == "none") {
                $(this).show()
                existUpdate()
            } else {
                $(this).css('display', 'none')
                existUpdate()
            }
        }
    })
}
// 通过判断对勾是否大于1来决定修改按钮是否可用
function existUpdate() {
    if ($("#update").val() == '2') {
        let count = 0;
        $("#table img").each(function () {
            if ($(this).css('display') != "none") {
                count++;
                if (count > 1) {
                    $('#resources').attr('disabled', true)
                } else {
                    $('#resources').removeAttr('disabled')
                }
            }
        })
    }
}

// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/user/ceshi' + num + '?menu=' + num;
}


// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
// 将所有用户的权限对应角色
function recoverAllreource() {
    let flag = confirmAct('确认要恢复所有账户权限吗？')
    if (flag) {
        $.ajax({
            url: "/users/recoverAllreource",
            type: "get",
            async: false,
            dataType: "text",
            success: function (result) {
                if ('success') {
                    alert('恢复成功')
                } else {
                    alert('恢复失败')
                }
                location = location
            }
        })
    }
}
// 确认修改按钮 ✔
function reUpdate() {
    let power_type = $("#update").val();
    let role_id = $("#roles").val()
    if (power_type == 0) {
        updateRoleResource(role_id)
    } else if (power_type == 1) {
        updateRoleToUser()
    } else {
        updateUserResource()
    }
    jump(2);
}
// 只是修改角色权限     ✔
function updateRoleResource(role_id) {
    let resource_id = getResourceId()
    $.ajax({
        url: "/users/updateRoleResource",
        type: "post",
        data: {
            role_id: role_id,
            resource_id: resource_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if ('success') {
                alert('修改角色权限成功')
            } else {
                alert('修改角色权限失败')
            }
            // result = JSON.parse(result).data[0];
        }
    })
}
// 将角色权限修改为单独权限     ✔
function updateRoleToUser() {
    let resource_id = getResourceId();
    let emp_id = getEmpId();
    $.ajax({
        url: "/users/updateRoleToUser",
        type: "post",
        data: {
            resource_id: resource_id,
            emp_id: emp_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if ('success') {
                alert('修改角色权限成功')
            } else {
                alert('修改角色权限失败')
            }
        }
    })

}
// 修改个人权限
function updateUserResource() {
    let resource_id = getResourceId();
    let emp_id = getEmpId()[0];
    $.ajax({
        url: "/users/updateUserResource",
        type: "post",
        data: {
            resource_id: resource_id,
            emp_id: emp_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if ('success') {
                alert('修改角色权限成功')
            } else {
                alert('修改角色权限失败')
            }
        }
    })
}
// 获取当前所有被选择了的账户的id   ✔
function getEmpId() {
    let arr = [];
    $("#table img").each(function () {
        let check = $(this).css('display')
        if (check == 'inline') {
            let emp_id = $(this).next().val();
            arr.push(emp_id);
        }
    })
    return arr;
}
// 获取当前所有被点击了的权限的id   ✔
function getResourceId() {
    let arr = [];
    $("#t1 img").each(function () {
        let check = $(this).css('display')
        if (check == 'inline') {
            let resource_id = $(this).parent().next().children().attr('name');
            arr.push(resource_id);
        }
    })
    $("#t2 img").each(function () {
        let check = $(this).css('display')
        if (check == 'inline') {
            let resource_id = $(this).parent().next().children().attr('name');
            arr.push(resource_id);
        }
    })
    $("#t3 img").each(function () {
        let check = $(this).css('display')
        if (check == 'inline') {
            let resource_id = $(this).parent().next().children().attr('name');
            arr.push(resource_id);
        }
    })
    return arr;
}
// 获得当前登录用户名的角色 ✔
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
            result = JSON.parse(result).data[0];
            if (result.role_id == 1) {
                $("#allResources").show()
            }
        }
    })
}
// 跳转到修改权限的页面     ✔
function update() {
    $("#bigger").attr('style', 'display:none');
    $("#small").removeAttr('style', 'display');
    let power_type = $("#update").val();
    let roles = $("#roles").val();
    let emp_id = getEmpId()[0];

    if (power_type == 2) {
        // 打印个人对应的权限
        getResource(emp_id, 'user')
    } else {
        // 打印角色对应权限
        getResource(roles, 'role')
    }
}
// 动态打印所有角色或者单个用户对应的权限   ✔
function getResource(id, type) {
    $.ajax({
        url: "/users/getResource",
        type: "post",
        data: {
            id: id,
            type: type
        },
        async: false,
        dataType: "text",
        success: function (result) {
            abc(result, '')
        }
    })
}
// 将得到的权限资源打印出来
function abc(result, buttonType) {
    $("#t1 tr:gt(0)").empty()
    $("#t2 tr:gt(0)").empty()
    $("#t3 tr:gt(0)").empty()
    result = JSON.parse(result).data;
    resource = result[0];
    resource2 = result[1];
    let t1 = "";
    let t2 = "";
    let t3 = "";
    let img1 = '<img width="100%" height="23px" style="display:none" src="/images/true.jpg">';
    let img2 = '<img width="100%" height="23px" src="/images/true.jpg">';
    for (let i = 0; i < resource.length; i++) {
        let img = img1;
        let resource_id = resource[i].resource_id;
        let name = resource[i].name;
        let type = resource[i].type;
        for (let j = 0; j < resource2.length; j++) {
            if (resource_id == resource2[j].resource_id) {
                img = img2;
            }
        }
        let imgClick = '<tr><td onclick="imgShow(this)">' + img + '</td>';
        let imgNotClick = '<tr><td>' + img + '</td>';
        let imgText = imgClick;
        if (buttonType == 'notClick') {
            imgText = imgNotClick;
        }
        if (type == 1) {
            t1 += imgText + '<td><input type="text" class="t1" value="' + name + '" name="' + resource_id + '"></td></tr>';
        } else if (type == 2) {
            t2 += imgText + '<td><input type="text" class="t2" value="' + name + '" name="' + resource_id + '"></td></tr>';
        } else {
            t3 += imgText + '<td><input type="text" class="t3" value="' + name + '" name="' + resource_id + '"></td></tr>';
        }
    }
    $(t1).appendTo($('#t1'))
    $(t2).appendTo($('#t2'))
    $(t3).appendTo($('#t3'))
}
// 统计并导出   ✔
function output() {
    let update = $("#update").val();
    let roles = $("#roles").val();
    $.ajax({
        url: "/users/outputUser",
        type: "post",
        data: {
            power_type: update,
            type: roles
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'error') {
                alert('导出账户失败')
            } else {
                let pt2 = result.split(excelFile + symbol)[1];
                window.location.href = '/' + excelFile + '/' + pt2;
            }
        }
    })
}
// 点击操作，获取这一行账户的详情   
function detail(t) {
    $("#bigger").attr('style', 'display:none');
    $("#small").removeAttr('style', 'display');
    $("#small .canButton").attr('style', 'display:none')
    $.ajax({
        url: "/users/getOneUserResource",
        type: "post",
        data: {
            emp_id: t,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            abc(result, 'notClick')
        }
    })
}
// 确认按钮     ✔
function selectUsers(t) {
    let update = $("#update").val();
    let roles = $("#roles").val();
    if (update == 0) {

    } else {
        $.ajax({
            url: "/users/selectUsers",
            type: "post",
            data: {
                power_type: update,
                type: roles,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                let data = JSON.parse(result).data;
                $("#totalPage").val(Math.ceil(data.length / 15));
                $("#totalNum").val(data.length)
                getSplitPage();
            }
        })
    }
}
function printTable(result) {
    let update = $("#update").val();
    let trtd = ''
    let caozuo = "";
    for (let i = 0; i < result.length; i++) {
        if (update == 1) {
            caozuo = '<input type="button" value="详情" style="width:49%" onclick="detail(' + result[i].emp_id + ')">'
                + '<input type="button" value="删除" style="width:49%" onclick="deleteUser(' + result[i].emp_id + ')">';
        } else if (update == 2) {
            caozuo = '<input type="button" value="详情" style="width:32%" onclick="detail(' + result[i].emp_id + ')">'
                + '<input type="button" value="恢复权限" style="width:32%" onclick="recoverPower(' + result[i].emp_id + ')">'
                + '<input type="button" value="删除" style="width:32%" onclick="deleteUser(' + result[i].emp_id + ')">';
        }
        trtd += '<tr>' +
            '<td width="5%" height="23px" onclick="imgShow(this)"><img width="100%" height="23px" style="display:none" src="/images/true.jpg">' +
            '<input type="text" hidden value="' + result[i].emp_id + '"></td>' +
            '<td><input type="text" name="username" readonly value="' + getAny(result[i].username) + '"></td>' +
            '<td><input type="text" name="name" readonly value="' + getAny(result[i].name) + '"></td>' +
            '<td><input type="text" name="iiuv" readonly value="' + getAny(result[i].iiuv) + '"></td>' +
            '<td>' + caozuo + '</td></tr>'
    }
    $(trtd).appendTo($("#table"))
}
// 通过id删除这个账户
function deleteUser(emp_id) {
    let flag = confirmAct('确认要删除此账户吗？');
    if (flag) {
        $.ajax({
            url: "/users/deleteUser",
            type: "post",
            data: {
                emp_id: emp_id,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除成功');
                } else {
                    alert('删除失败')
                }
                location = location
            }
        })
    }
}

// 通过id恢复用户对应的角色权限
function recoverPower(emp_id) {
    confirmAct('确认要恢复此账户权限吗？')
    $.ajax({
        url: "/users/recoverPower",
        type: "post",
        data: {
            emp_id: emp_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'success') {
                alert('恢复成功');
            } else {
                alert('恢复失败')
            }
            location = location
        }
    })
}
// 对于数据库中为null的数据，直接在前端显示为空     ✔
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}
// 获得所有的角色   ✔
function getRoles() {
    let roles = $("#roles")
    $.ajax({
        url: "/users/getRoles",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            let option = '';
            for (let i = 0; i < result.length; i++) {
                // if (result[i].code == '1') {
                //     continue;
                // } else {
                option += '<option value="' + result[i].code + '">' + result[i].name + '</option>'
                // }
            }
            $(option).appendTo(roles)
        }
    })
}
// 分页
function getSplitPage() {
    $("#table tr:gt(0)").empty();
    let limit = $("#pageNo").val();
    let update = $("#update").val();
    let roles = $("#roles").val();
    if (update == 0) {

    } else {
        $.ajax({
            url: "/users/selectUsers",
            type: "post",
            data: {
                power_type: update,
                type: roles,
                limit: limit,
            },
            async: false,
            dataType: "text",
            success: function (result) {
                $("#table tr:gt(0)").empty()
                result = JSON.parse(result).data;
                printTable(result);

                $("#pages").val(limit);
                $("#lstd span:first").html(limit);
                $("#lstd span:last").html($("#totalPage").val());
                splitPageCss()
            }
        })
    }
}