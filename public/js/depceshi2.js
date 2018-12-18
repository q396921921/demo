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


// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/dep/ceshi' + num + '?menu=' + num;
}


// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
function deleteDep(t) {
    let dep_id = "";
    $(t).parent().parent().children().children().each(function () {
        let name = $(this).attr('name');
        let val = $(this).val();
        if (name == 'dep_id') {
            dep_id = val;
        }
    })
    let flag = confirmAct('您确认要删除此部门吗？');
    if (flag) {
        $.ajax({
            url: "/users/deleteDep",
            type: "post",
            data: {
                dep_id: dep_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'error') {
                    alert('删除失败')
                } else if (result == 'empExist') {
                    alert('该部门下仍有员工，删除失败')
                } else {
                    alert('删除成功');
                    location = location;
                }

            }
        })
    }
}

// 分配员工按钮
function allotEmp(t) {
    $('#detailDep').hide();
    $("#allotEmp").show();
    $("#b").hide();
    getAllManager();
    getAllEmpNotAllot();
    $(t).parent().parent().children().children().each(function () {
        let name = $(this).attr('name');
        let val = $(this).val();
        if (name == 'dep_id') {
            $("#dep_id").val(val)
        } else if (name == 'managerName') {
            $("#manager input[name='managerName']").val(val);
        } else if (name == 'manager_id') {
            $("#manager_id").val(val);
        } else if (name == 'manager2_id') {
            $("#manager2_id").val(val);
        } else if (name == 'manager3_id') {
            $("#manager3_id").val(val);
        }
    })
}
// 获得部门的详细信息，即所有员工。详情按钮
function detailDep(t) {
    $('#detailDep').show();
    $("#allotEmp").hide();
    $("#b").hide();
    let dep_id = "";
    let managerName = "";
    let manager_id = "";
    let manager2_id = "";
    let manager3_id = "";
    let manager_name = "";
    let manager2_name = "";
    let manager3_name = "";
    $(t).parent().parent().children().children().each(function () {
        let name = $(this).attr('name');
        let val = $(this).val();
        if (name == 'dep_id') {
            dep_id = val;
            $("#dep_id").val(val);
        } else if (name == 'managerName') {
            managerName = val;
        } else if (name == 'manager_id') {
            manager_id = val;
        } else if (name == 'manager2_id') {
            manager2_id = val;
        } else if (name == 'manager3_id') {
            manager3_id = val;
        } else if (name == 'manager_name') {
            manager_name = val;
        } else if (name == 'manager2_name') {
            manager2_name = val;
        } else if (name == 'manager3_name') {
            manager3_name = val;
        }
    })
    $.ajax({
        url: "/users/getUser",
        type: "post",
        data: {
            dep_id: dep_id,
            type: 5
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let trtd = '';
            let checkbox = '<tr><td><input type="checkbox">';
            let a = $("#detailDep input[name='manager_id']");
            let b = $("#detailDep input[name='manager2_id']");
            let c = $("#detailDep input[name='manager3_id']");

            a.val(manager_name);
            b.val(manager2_name);
            c.val(manager3_name);

            a.next().val(manager_id);
            b.next().val(manager2_id);
            c.next().val(manager3_id);
            // if (manager_id != 'null') (
            //     trtd += '<tr><td><input type="checkbox"><input hidden type="text" value="' + manager_id + '"></td>'
            //     + '<td><input type="text" name="emp_id" value="' + manager_id + '"></td>'
            //     + '<td><input type="text" name="name" value="' + manager_name + '"></td>'
            //     + '<td><input type="text" value="正经理"></tr>'
            // )
            // if (manager2_id != 'null') {
            //     trtd += '<tr><td><input type="checkbox"><input hidden type="text" value="' + manager2_id + '"></td>'
            //         + '<td><input type="text" name="emp_id" value="' + manager2_id + '"></td>'
            //         + '<td><input type="text" name="name" value="' + manager2_name + '"></td>'
            //         + '<td><input type="text" value="副经理"></tr>'
            // }
            for (let i = 0; i < data.length; i++) {
                let emp_id = data[i].emp_id;
                let name = data[i].name;
                name = getAny(name);
                trtd += checkbox + '<input hidden type="text" value="' + emp_id + '"></td>'
                    + '<td><input type="text" name="emp_id" value="' + emp_id + '"></td>'
                    + '<td><input type="text" name="name" value="' + name + '"></td>'
                    + '<td><input type="text" value="员工"></tr>'
            }
            $("#detailDep > span").html(managerName)
            $(trtd).appendTo($("#detailDep table"))
        }
    })
}
// 从部门中删除被选中的员工
function deleteEmp() {
    let emp_id_arr = [];
    $("#detailDep input[type='checkbox']").each(function () {
        let check = $(this).prop('checked');
        if (check) {
            emp_id_arr.push($(this).next().val());
        }
    })
    if (emp_id_arr.length != 0) {
        let flag = confirmAct('是否确认删除员工');
        if (flag) {
            $.ajax({
                url: "/users/deleteDepUser",
                type: "post",
                data: {
                    dep_id: $("#dep_id").val(),
                    emp_id_arr: emp_id_arr,
                },
                async: false,
                dataType: "text",
                success: function (result) {
                    if (result != 'success') {
                        alert('删除失败')
                    } else {
                        alert('删除成功');
                        location = location;
                    }
                }
            })
        }
    } else {
        alert('选择员工为0，不能提交')
    }
    return emp_id_arr;
}
// 获得被checkbox选中的员工,然后分配到部门
function getAllCheck() {
    let emp_id_arr = [];
    $("#emp input[type='checkbox']").each(function () {
        let check = $(this).prop('checked');
        if (check) {
            emp_id_arr.push($(this).next().val());
        }
    })
    if (emp_id_arr.length != 0) {
        let flag = confirmAct('是否确认分配员工');
        if (flag) {
            let dep_id = $("#dep_id").val();
            $.ajax({
                url: "/users/allotUser",
                type: "post",
                data: {
                    emp_id_arr: emp_id_arr,
                    dep_id: dep_id
                },
                async: false,
                dataType: "text",
                success: function (result) {
                    if (result == 'error') {
                        alert('分配失败')
                    } else {
                        alert('分配成功');
                        location = location;
                    }

                }
            })
        }
    } else {
        alert('选择员工为0，不能提交')
    }
    return emp_id_arr;
}

// 获得所有未被分配的员工
function getAllEmpNotAllot() {
    $.ajax({
        url: "/users/getAllEmpNotAllot",
        type: "post",
        data: {
            type: 5
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let trtd = '';
            let checkbox = '<tr><td><input type="checkbox">';
            for (let i = 0; i < data.length; i++) {
                let emp_id = data[i].emp_id;
                let name = data[i].name;
                name = getAny(name);
                trtd += checkbox + '<input hidden type="text" value="' + emp_id + '"></td><td><input type="text" name="emp_id" value="' + emp_id + '"></td><td><input type="text" name="name" value="' + name + '"></td></tr>'
            }
            $(trtd).appendTo($("#emp"))
        }
    })
}
// 获得所有的经理账户
function getAllManager() {
    $.ajax({
        url: "/users/getUser",
        type: "post",
        data: {
            type: 3
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let select = '';
            for (let i = 0; i < data.length; i++) {
                select += '<option value="' + data[i].emp_id + '">' + data[i].name + '</option>';
            }
            $(select).appendTo($("#manager_id"))
            $(select).appendTo($("#manager2_id"))
            $(select).appendTo($("#manager3_id"))
        }
    })
    return name;
}
// 获得所有的部门
function getAllDep() {
    $.ajax({
        url: "/users/getDep",
        type: "post",
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let trtd = "";
            for (let i = 0; i < data.length; i++) {
                let dep_id = data[i].dep_id;

                let manager_id = data[i].manager_id;
                let manager_name = getManagerName(manager_id);
                manager_name = getAny(manager_name);
                let manager2_id = data[i].manager2_id;
                let manager2_name = getManagerName(manager2_id);
                manager2_name = getAny(manager2_name);
                let manager3_id = data[i].manager3_id;
                let manager3_name = getManagerName(manager3_id);
                manager3_name = getAny(manager3_name);

                let managerName = data[i].managerName;
                trtd += '<tr><td hidden><input type="text" name="dep_id" value="' + dep_id + '"></td>'
                    + '<td><input type="text" name="managerName" readonly value="' + managerName + '"></td>'
                    + '<td><input type="text" name="manager_name" readonly value="' + manager_name + '"></td>'
                    + '<td><input type="text" name="manager2_name" readonly value="' + manager2_name + '"></td>'
                    + '<td><input type="text" name="manager3_name" readonly value="' + manager3_name + '"></td>'
                    + '<td hidden><input type="text" name="manager_id" value="' + manager_id + '"></td>'
                    + '<td hidden><input type="text" name="manager2_id" value="' + manager2_id + '"></td>'
                    + '<td hidden><input type="text" name="manager3_id" value="' + manager3_id + '"></td>'
                    + '<td><input class="canButton" type="button" value="详情" onclick="detailDep(this)" style="width:30%">'
                    + '<input class="canButton" type="button" value="分配" onclick="allotEmp(this)" style="width:30%">'
                    + '<input class="canButton" type="button" value="删除" onclick="deleteDep(this)" style="width:30%"></td></tr>'
            }
            $(trtd).appendTo($("#dep"))
        }
    })
}
// 通过emp_id获得此用户的名字
function getManagerName(emp_id) {
    let name = "";
    if (emp_id && emp_id != "") {
        $.ajax({
            url: "/users/getUser",
            type: "post",
            data: {
                emp_id: emp_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                let data = JSON.parse(result).data[0];
                name = data.name;
            }
        })
    } else {
        name = '暂无';
    }
    return name;
}
// 对于数据库中为null的数据，直接在前端显示为空     ✔
function getAny(data) {
    if (!data) {
        data = "";
    }
    return data;
}
function deleteManager(t) {
    let flag = confirmAct('确认要删除该经理吗？')
    if (flag) {
        let name = $(t).prev().prev().attr('name');
        let emp_id = $(t).prev().val();
        let dep_id = $("#dep_id").val();
        $.ajax({
            url: "/users/deleteManager",
            type: "post",
            data: {
                name: name,
                emp_id: emp_id,
                dep_id: dep_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除成功')
                    location = location
                } else {
                    alert('删除失败')
                }
            }
        })
    }
}
function allotManager(t) {
    let flag = confirmAct('确认要更改经理吗？')
    if (flag) {
        let emp_id = $(t).val();
        let dep_id = $("#dep_id").val();
        let name = $(t).attr('name');
        $.ajax({
            url: "/users/allotManager",
            type: "post",
            data: {
                name: name,
                emp_id: emp_id,
                dep_id: dep_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('分配成功')
                    location = location
                } else if (result == 'userexist') {
                    alert('该账户已存在于其他部门，本次分配失败')
                }
            }
        })
    }
}