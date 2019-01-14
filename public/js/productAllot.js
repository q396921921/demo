function bindEvents() {
    $(".canButton").each(function () {
        $(this).bind('mouseover', function () {
            $(this).css('background', 'green')
        })
        $(this).bind('mouseout', function () {
            if ($(this).attr('name') == 'head5') {
                $(this).css('background', '#97C65E')
            } else {
                $(this).css('background', '');
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

// ok
// 删除表格的除第一行的所有数据     ✔
function deleteTb() {
    // 清除表格除第一行的所有数据
    $("#table tbody").empty();
    let product_id = $("#aid").val();
    $.ajax({
        url: "/product/getProduct",
        type: "post",
        data: {
            product_id: product_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            printProducts(result);
        }
    })
}
// 跳转当前测试1页面，即全部与筛选      ✔
function jump(text) {
    window.location.href = '/product/product' + text + '?menu=' + text;
}

// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
// 表单用ajax进行提交，然后后台进行修改
function submitForm() {
    $("#detail form").ajaxSubmit({
        type: 'post',
        async: false,
        dataType: "text",
        success: function (result) {
            if (result == 'success') {
                alert('修改成功')
            } else {
                alert('修改失败')
            }
        }
    })
    return false;
}
// ok
// 商品的删除按钮
function deletePt(t) {
    let flag = confirmAct('是否确认删除此商品对应的内勤');
    if (flag) {
        let product_id = $(t).parent().parent().children().children('input[name="product_id"]').val();
        $.ajax({
            url: "/product/deleteOffPro",
            type: "post",
            data: {
                product_id: product_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除成功')
                }
                location = location;
            }
        })
    }
};
// 商品的详情按钮
function detailPt(t) {
    $("#t3 tr:gt(0)").empty();
    let product_id = $(t).parent().parent().children().children('input[name="product_id"]').val();
    $("#product_id").val(product_id);
    $("#b").hide();
    $("#update").show();
    $("#update").children().each(function () {
        $(this).hide();
    })
    $("#t3").show();
    $.ajax({
        url: "/product/getRelation_product_dep",
        type: "post",
        data: {
            product_id: product_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            let trtd = "";
            for (let i = 0; i < result.length; i++) {
                let ret = result[i];
                let dep_id = ret.dep_id;
                let off_id = ret.off_id;
                let dep_emp_id = ret.dep_emp_id;
                let dep_name = getDepName(dep_id);
                let offName = getEmpName(off_id);
                let busName = getEmpName(dep_emp_id);
                trtd += '<tr><td><input type="text" value="' + dep_name + '"></td><td><input type="text" value="' + offName + '"></td>'
                    + '<td><input type="text" value="' + busName + '"></td></tr>'
            }
            $(trtd).appendTo($("#t3"));
        }
    })
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
// ok
function getAllEmpName(emp_id) {
    let text;
    $.ajax({
        url: "/user/getUser",
        type: "post",
        data: {
            emp_id: emp_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            text = data;
            $("#allName").val(JSON.stringify(data));
        }
    })
    return text;
}
function getDepName(dep_id) {
    let text = "";
    let allDep = JSON.parse($("#allDep").val());
    for (let i = 0; i < allDep.length; i++) {
        if (parseInt(allDep[i].dep_id) == dep_id) {
            text = allDep[i].managerName;
            break;
        }
    }
    return text
}
// ok
function getAllDeps(dep_id) {
    let text;
    $.ajax({
        url: "/dep/getDep",
        type: "post",
        data: {
            dep_id: dep_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            text = data;
            $("#allDep").val(JSON.stringify(data));
        }
    })
    return text;
}

function update(t) {
    let product_id = $(t).parent().parent().children().children('input[name="product_id"]').val();
    $("#product_id").val(product_id);
    $("#b").hide();
    $("#update").show();
    getAllDep();
    getOffEmp();
    $("#t3").hide();
}
// ok
function reUpdate() {
    let product_id = $("#product_id").val();
    let off_id = $("#t2").val();
    let dep_id = $("#t1").val();
    let emp_id_arr = [];
    $("#t4 input:checked").each(function () {
        let emp_id = $(this).next().val();
        emp_id_arr.push(emp_id);
    })
    if (product_id && off_id && dep_id) {
        $.ajax({
            url: "/product/allotProduct",
            type: "post",
            data: {
                product_id: product_id,
                off_id: off_id,
                dep_id: dep_id,
                emp_id_arr: emp_id_arr
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('分配成功')
                }
            }
        })
    } else {
        alert('内勤或者部门为空');
    }
}

// 当内勤有值时，将部门按钮变为可以选择
function showT1(t) {
    $(t).next().next().removeAttr('disabled');
}
// 当内勤没有值时，将部门按钮变为不可选择
function hideT1(t) {
    $(t).parent().next().next().attr('disabled', 'disabled');
}

// ok
// 获得所有的部门
function getAllDep() {
    $("#t1").empty();
    $.ajax({
        url: "/dep/getDep",
        type: "post",
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let select = '<option value="">------请选择对应部门------</option>';
            for (let i = 0; i < data.length; i++) {
                let dep_id = data[i].dep_id;
                let managerName = data[i].managerName;
                if (!managerName) {
                    managerName = "暂无名字";
                }
                select += '<option value="' + dep_id + '" onclick="getDepEmps(this)">' + managerName + '</option>'
            }
            $(select).appendTo($("#t1"));
        }
    })
}
// ok
// 获得部门中所对应的业务与经理
function getDepEmps(t) {
    $("#t4").empty();
    let dep_id = $(t).val();
    let product_id = $("#product_id").val();
    let off_id = $("#t2").val();
    $.ajax({
        url: "/user/getUser",
        type: "post",
        data: {
            dep_id: dep_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let empCheck = getProEmps(product_id, dep_id, off_id);
            let trtd = '<tr><td><input type="button" value="全选" style="width:49%" onclick="checkAll()"><input type="button" value="反选" style="width:49%" onclick="unCheck()"></td>'
                + '<td >业务姓名</td></tr>';
            for (let i = 0; i < data.length; i++) {
                let dep_emp_id = data[i].emp_id;
                let name = data[i].name;
                if (!name) {
                    name = "暂无名字";
                }
                let checked = ''
                for (let j = 0; j < empCheck.length; j++) {
                    let emp = empCheck[j].data;
                    let emp_id = emp.dep_emp_id;
                    if (dep_emp_id == emp_id) {
                        checked = 'checked="checked"';
                    }
                }
                trtd += '<tr><td><input type="checkbox" ' + checked + '><input hidden type="text" name="emp_id" value="' + dep_emp_id + '"></td><td><input name="" type="text" value="' + name + '"></td></tr>'
            }
            $(trtd).appendTo($("#t4"))
        }
    })
}
// 全选
function checkAll() {
    $("#t4 input[type='checkbox']").prop('checked', 'checked')
}
// 全部选
function unCheck() {
    $("#t4 input[type='checkbox']").removeProp('checked')
}
// ok
function getProEmps(product_id, dep_id, off_id) {
    let text = "";
    $.ajax({
        url: "/product/getRelation_product_dep",
        type: "post",
        data: {
            product_id: product_id,
            dep_id: dep_id,
            off_id: off_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result).data;
        }
    })
    return text;
}
// ok
// 获得所有的内勤
function getOffEmp() {
    $("#t2").empty();
    $.ajax({
        url: "/user/getUser",
        type: "post",
        async: false,
        data: {
            type: 4,
        },
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let select = '<option value="" onclick="hideT1(this)">------请选择对应内勤------</option>';
            for (let i = 0; i < data.length; i++) {
                let emp_id = data[i].emp_id;
                let name = data[i].name;
                if (!name) {
                    name = "暂无姓名";
                }
                select += '<option value="' + emp_id + '">' + name + '</option>'
            }
            $(select).appendTo($("#t2"))
        }
    })
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
// ok
// 从数据库中取得当前所有的产品类型，并记录到当前网页
function getTypes() {
    $.ajax({
        url: "/product/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let select = "";
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].product_type_id + '">' + result[i].name + '</option>';
            }
            $(select).appendTo($("#types"));
        }
    })
}
// ok
// 筛选全部商品         ✔
function getScreenProduct() {
    let limit = 1;
    let product_type_id = $("#types").val();
    $.ajax({
        url: "/product/getLimitProduct",
        type: "post",
        data: {
            product_type_id: product_type_id,
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            let totalPage = data[1];
            let totalNum = data[2];
            $("#totalPage").val(totalPage);
            $("#totalNum").val(totalNum)
            getSplitPage()
        }
    })
}
// ok
function getSplitPage() {
    let limit = $("#pageNo").val();
    let product_type_id = $("#types").val();
    $.ajax({
        url: "/product/getLimitProduct",
        type: "post",
        data: {
            product_type_id: product_type_id,
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            $("#pages").val(limit);
            $("#lstd span:first").html(limit);
            $("#lstd span:last").html($("#totalPage").val());
            printProducts(data[0])
        }
    })
}
// 将得到的商品信息打印到表格       ✔
function printProducts(result) {
    $("#table tr:gt(0)").empty();
    let trtd = "";
    for (let i = 0; i < result.length; i++) {
        let product_id = result[i].product_id;
        let name = result[i].name;
        let product_detail = result[i].product_detail;
        trtd += '<tr><td><input type="text" readonly name="product_id" value="' + product_id + '"></td>' +
            '<td><input type="text" readonly name="name" value="' + name + '"></td>' +
            '<td><input type="text" readonly name="product_detail" value="' + name + '"></td>' +
            '<td><input type="button" value="详情" style="width:30%" onclick="detailPt(this)">' +
            '<input type="button" value="分配" style="width:30%" onclick="update(this)">' +
            '<input type="button" value="删除" style="width:30%" onclick="deletePt(this)"></td></tr>'
    }
    $(trtd).appendTo($("#table tbody"))
}