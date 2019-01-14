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





// 删除表格的除第一行的所有数据
function deleteTb() {
    // 清除表格除第一行的所有数据
    $("#table").empty();
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
            let select = '<option value="">----------请选择商品类型----------</option>';
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].product_type_id + '">' + result[i].name + '</option>';
            }
            $(select).appendTo($("#types"));
        }
    })
}
// 跳转当前测试1页面，即全部与筛选      ✔
function jump(text) {
    window.location.href = '/product/product' + text + '?menu=' + text;
}

// 表单用ajax进行提交，然后后台进行修改
function submitForm2() {
    let product_type_name = $("#product_type_name").val();
    if (product_type_name == "" || !product_type_name) {
        alert('商品类型不能为空，请重新填写')
    } else {
        $("#b form:first").ajaxSubmit({
            type: 'post',
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('创建类型成功')
                } else {
                    alert('创建类型失败')
                }
            }
        })
    }
    return false;
}

// 表单用ajax进行提交，然后后台进行修改
function submitForm() {
    let product_name = $("#product_name").val();
    let product_intro = $("#product_intro").val();
    let isNum = $("#isNum").val();
    let isBourse = $("#isBourse").val();
    let type = $("#types").prev().val();
    if (product_name == "" || !product_name) {
        alert('商品名不能为空，请重新填写')
    } else if (type == "" || !type) {
        alert('商品类型不能为空，请重新填写')
    } else if (isNum == "" || !isNum) {
        alert('是否询值不能为空，请重新填写')
    } else if (isBourse == "" || !isBourse) {
        alert('是否交易所不能为空，请重新填写')
    } else if (putaway == "" || !putaway) {
        alert('是否上架不能为空，请重新填写')
    } else {
        $("#b form:last").ajaxSubmit({
            type: 'post',
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('创建商品成功')
                } else {
                    alert('创建商品失败')
                }
            }
        })
    }
    return false;
}
// 通过文本框，给input赋值
function setProduct_detail(t) {
    let text = $(t).val();
    text = text.replace(/\n/g, '&br');
    $(t).prev().val(text);
}
// 当select框选择，值改变了之后，触发为input赋值事件
function changeSetNum(t) {
    let val = $(t).val();
    $(t).prev().val(val);
}
// 点击图片触发图片触发上传文件事件         公共的图片事件！！！！！！！
function uploadImg(t) {
    $(t).prev().trigger('click');
};
// 选择好图片文件之后实现预览功能           公共的图片预览事件！！！！！！！
function change(fileDom) {
    $(fileDom).prev().val(1);
    //判断是否支持FileReader
    if (window.FileReader) {
        var reader = new FileReader();
    } else {
        alert("您的设备不支持图片预览功能，如需该功能请升级您的设备！");
    }

    //获取文件
    var file = fileDom.files[0];
    var imageType = /^image\//;
    //是否是图片
    if (!imageType.test(file.type)) {
        alert("请选择图片！");
        return;
    }
    //读取完成
    reader.onload = function (e) {
        //获取图片dom
        var img = $(fileDom).next();
        //图片路径设置为读取的图片
        img.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
}
// ok
// 获得所有的流程id与名字
function getFlows() {
    $.ajax({
        url: "/product/getFlow",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let select = '<option value="">----------请选择商品流程----------</option>';
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].flow_id + '">' + result[i].flow_name + '</option>'
            }
            $(select).appendTo($("#flow_id"));
        }
    })
}
// ok
// 获得所有的文件类型id与名字
function getFile_type() {
    $.ajax({
        url: "/product/getFile_types_num",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let select = '<option value="">----------请选择申请材料----------</option>';
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].file_type_id + '">' + result[i].name + '</option>'
            }
            $(select).appendTo($("#file_type_id"));
        }
    })
}