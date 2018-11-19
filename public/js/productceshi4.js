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




// 跳转当前测试1页面，即全部与筛选
function jump(num) {
    window.location.href = '/users/product/ceshi' + num + '?menu=' + num;
}

function showType() {
    $("#allTypes").show();
    $("#allDetailTypes").hide();
    getFile_type();
}
function showDetailType() {
    $("#allTypes").hide();
    $("#allDetailTypes").show();
    getDetailFileTypes();
}


// 为材料表分配材料 ✔
function updateFileType() {
    let file_type_id = $("#select").val();
    let detail_file_type_id = [];
    if (file_type_id && file_type_id != "") {
        $("#updateFileType input[type='checkbox']").each(function () {
            if ($(this).is(':checked')) {
                let id = $(this).parent().next().children('input[name="detail_file_type_id"]').val();
                detail_file_type_id.push(id);
            }
        })
        $.ajax({
            url: "/users/updateFileType",
            type: "post",
            data: {
                file_type_id: file_type_id,
                detail_file_type_id: detail_file_type_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('分配成功')
                } else if (result == 'error') {
                    alert('分配失败')
                }

            }
        })

    } else {
        alert('材料名字不能为空')
    }
}
// 删除二次确认按钮✔
function confirmAct(t) {
    if (confirm(t)) {
        return true;
    }
    return false;
}



// 获得所有的具体材料名字用于给删除页面进行删除的   ✔
function getDetailFileTypes() {
    $("#allDetailTypes tr:gt(0)").empty()
    $.ajax({
        url: "/users/getDetailFileType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let trtd = "";
            for (let i = 0; i < result.length; i++) {
                let detail_file_type_id = result[i].detail_file_type_id;
                let name = result[i].name;
                trtd += '<tr><td><input type="text" name="detail_file_type_id" value="' + detail_file_type_id + '"></td>'
                    + '<td><input type="text" value="' + name + '"></td>'
                    + '<td><input type="button" value="删除" style="width:50px" onclick="deleteDetailType(this)"></td></tr>';

            }
            $(trtd).appendTo($("#allDetailTypes"));
        }
    })
}
// 删除一个具体的材料       ✔
function deleteDetailType(t) {
    let flag = confirmAct('是否确认删除此具体材料？');
    if (flag) {
        let detail_file_type_id = $(t).parent().parent().children().children('input[name="detail_file_type_id"]').val();
        $.ajax({
            url: "/users/deleteDetailFileType",
            type: "post",
            data: {
                detail_file_type_id: detail_file_type_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除此具体材料成功')
                } else if (result == 'error') {
                    alert('系统内部出现错误，删除此材料失败')
                } else if (result == 'fileFail') {
                    alert('尚有材料与此有关联，本次删除失败')
                }
                getDetailFileTypes();
            }
        })
    }
}
// 删除一个材料       ✔
function deleteFileType(t) {
    let flag = confirmAct('是否确认删除此材料？');
    if (flag) {
        let file_type_id = $(t).parent().parent().children().children('input[name="file_type_id"]').val();
        $.ajax({
            url: "/users/deleteFileType",
            type: "post",
            data: {
                file_type_id: file_type_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除此材料成功')
                } else if (result == 'error') {
                    alert('系统内部出现错误，删除此材料失败')
                } else if (result == 'productFail') {
                    alert('尚有与此材料关联的商品，本次删除失败')
                }
                getFile_type();
            }
        })
    }
}
// 获得所有的具体材料名字   ✔
function getDetailFileType() {
    $("#updateFileType tr:gt(0)").empty()
    $.ajax({
        url: "/users/getDetailFileType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let trtd = "";
            for (let i = 0; i < result.length; i++) {
                trtd += '<tr><td><input type="checkbox"></td><td><input type="text" name="detail_file_type_id" value="' + result[i].detail_file_type_id + '" hidden>'
                    + '<input type="text" value="' + result[i].name + '"></td>'

            }
            $(trtd).appendTo($("#updateFileType"));
        }
    })
}
// 获得所有的流程id与名字   ✔
function getFile_type() {
    let text = "";
    $("#allTypes tr:gt(0)").empty()
    $.ajax({
        url: "/users/getFile_typeNameId",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            text = result;
            let trtd = '';
            for (let i = 0; i < result.length; i++) {
                trtd += '<tr><td><input type="text" name="file_type_id" value="' + result[i].file_type_id + '"></td>'
                    + '<td><input type="text" value="' + result[i].name + '"></td>'
                    + '<td><input type="button" value="删除" style="width:50px" onclick="deleteFileType(this)"></td></tr>';
            }
            $(trtd).appendTo($("#allTypes"));
        }
    })
    return text;
}
// 将当前选中的流程的类型选中   ✔
function setDetailChecked(file_type_id) {
    $("#updateFileType input[type='checkbox']").each(function () {
        $(this).removeAttr('checked');
    })
    $.ajax({
        url: "/users/getDetailFile_types",
        type: "post",
        data: {
            file_type_id: file_type_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            $("#updateFileType input[name='detail_file_type_id']").each(function () {
                let id = $(this).val();
                for (let i = 0; i < result.length; i++) {
                    let id2 = result[i].detail_file_type_id;
                    if (id == id2) {
                        $(this).parent().prev().children().prop('checked', 'checked');
                    }
                }
            })
        }
    })
}
// 将所有的材料表名字打印到复选框   ✔
function printSelect() {
    $("#select").empty();
    let result = getFile_type();
    let select = '<option value="">-----请选择材料名-----</option>';
    for (let i = 0; i < result.length; i++) {
        select += '<option value="' + result[i].file_type_id + '" onclick="setDetailChecked(this.value)">' + result[i].name + '</option>'
    }
    $(select).appendTo($("#select"))
}
// 通过文本框，给input赋值  ✔
function setText(t) {
    let text = $(t).val();
    text = text.replace(/\n/g, '&br');
    $(t).prev().val(text);
}
// 表单用ajax进行提交，然后后台进行修改 ✔
function submitForm(t) {
    let form = "";
    if (t == 'file_type') {
        form = $("#formLeft form")
        let text = $("#formLeft form input[name='bus_name']").val();
        if (text && text != "") {
            subt(form);
        } else {
            alert('创建材料名字为空')
        }
    } else if (t == 'detail_file_type') {
        form = $("#formRight form");
        let flag = true;
        $(".partner input").each(function () {
            if ($(this).val() && $(this).val() != "") {
            } else {
                flag = false;
            }
        })
        if (flag) {
            subt(form);
        } else {
            alert('具体材料内容或名字为空')
        }

    }
    function subt(formName) {
        formName.ajaxSubmit({
            type: 'post',
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('创建成功')
                } else {
                    alert('创建失败')
                }
            }
        })
    }
    return false;
}
// 显示创建界面
function showCreate() {
    $("#create").show();
    $("#delete").hide();
    $("#update").hide();
}
// 显示分配界面
function showUpdate() {
    $("#create").hide();
    $("#update").show();
    $("#delete").hide();
    getDetailFileType();
    printSelect();
}
// 显示删除界面
function showDelete() {
    $("#create").hide();
    $("#update").hide();
    $("#delete").show();
    getFile_type();
}
// 添加一行流程
function insertType() {
    let trtd2 = '<table class="partner" cellpadding="0" cellspacing="0">'
        + '<tr><td>具体类型名:</td><td><input type="text" name="name"></td></tr>'
        + '<tr><td>内容</td><td><input type="text" name="text" hidden>'
        + '<textarea cols="30" rows="3" style="width: 99%;" onblur="setText(this)"></textarea></td></tr></table>';
    $(trtd2).appendTo($("#formRight form"))

}
// 删除一行流程
function deleteType() {
    $("#formRight table:not(:first):last").remove();
}