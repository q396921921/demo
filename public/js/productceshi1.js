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





// 删除表格的除第一行的所有数据     ✔
function deleteTb() {
    // 清除表格除第一行的所有数据
    $("#table tbody").empty();
    let product_id = $("#aid").val();
    $.ajax({
        url: "/users/getProductById",
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
// 从数据库中取得当前所有的产品类型，并记录到当前网页
function getTypes() {
    $.ajax({
        url: "/users/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result)
            let select = "";
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].product_type_id + '" onclick="setPageNo_1()">' + result[i].name + '</option>';
            }
            $(select).appendTo($("#types"));
        }
    })
}
// 跳转当前测试1页面，即全部与筛选      ✔
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
// 商品的删除按钮
function deletePt(t) {
    let flag = confirmAct('是否确认删除此商品');
    if (flag) {
        let product_id = $(t).parent().parent().children().children('input[name="product_id"]').val();
        $.ajax({
            url: "/users/deleteProduct",
            type: "post",
            data: {
                product_id: product_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('删除成功')
                } else if (result == 'error') {
                    alert('系统内部出现错误，删除此商品失败')
                } else if (result == 'orderFail') {
                    alert('尚有与此商品关联的订单，本次删除失败')
                }
                location = location;
            }
        })
    }
};
// 点击图片触发图片触发上传文件事件         公共的图片事件！！！！！！！
function uploadImg(t) {
    if (t.attr('id') == 'imgDemo1') {
        $("form input[name='imgDemo1']").prev().trigger('click');
    } else if (t.attr('id') == 'imgDemo2') {
        $("form input[name='imgDemo2']").prev().trigger('click');
    } else if (t.attr('id') == 'imgDemo3') {
        $("form input[name='imgDemo3']").prev().trigger('click');
    }
};
// 编辑按钮，将所有input变为可以修改的
function updatePt(t) {
    detailPt(t);
    $("#reUpdate").show();
    $("#imgFrame").children().each(function () {
        $(this).click(function () {
            uploadImg($(this));
        })
    })
    $("#detail input").each(function () {
        let name = $(this).attr('name');
        if (name != 'product_id') {
            $(this).removeAttr('readonly');
        }
        if (name == 'flow_id') {
            $(this).hide();
            $(this).next().show();
        } else if (name == 'file_type_id') {
            $(this).hide();
            $(this).next().show();
        } else if (name == 'isNum') {
            $(this).prev().removeAttr('disabled');
        } else if (name == 'isBourse') {
            $(this).prev().removeAttr('disabled');
        } else if (name == 'putaway') {
            $(this).prev().removeAttr('disabled');
        } else if (name == 'product_detail') {
            $(this).next().removeAttr('readonly');
            // 为商品详细设置，文本框。使其输入长文本消息
            $(this).next().blur(function () {
                let text = $(this).val();
                $(this).prev().val(text.replace(/\n/g, '&br'));
            })
        } else if (name == 'product_intro') {
            $(this).next().removeAttr('readonly');
            // 为商品详细设置，文本框。使其输入长文本消息
            $(this).next().blur(function () {
                let text = $(this).val();
                $(this).prev().val(text.replace(/\n/g, '&br'));
            })
        }
    })
};
// 选择好图片文件之后实现预览功能           公共的图片预览事件！！！！！！！
function change(fileDom) {
    $(fileDom).prev().val(1);
    let id = $(fileDom).next().attr('name');
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
        // var img = document.getElementById("img12");
        var img = $("#" + id);
        //图片路径设置为读取的图片
        img.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
}
// 获得所有的流程id与名字
function getFlows(t) {
    $.ajax({
        url: "/users/getFlowNameId",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let select = "";
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].data.flow_id + '">' + result[i].data.flow_name + '</option>'
            }
            $(select).appendTo($(t).next());
        }
    })
}
// 获得所有的文件类型id与名字
function getFile_type(t) {
    $.ajax({
        url: "/users/getFile_typeNameId",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let select = "";
            for (let i = 0; i < result.length; i++) {
                select += '<option value="' + result[i].data.file_type_id + '">' + result[i].name + '</option>'
            }
            $(select).appendTo($(t).next());
        }
    })
}
// 通过商品的流程id获得对应的所有流程以及状态
function getSortFlowState(t) {
    let flow_id = $(t).val()
    $(t).prev().val(flow_id);
    $("#flow_state tr:gt(0)").empty()
    $.ajax({
        url: "/users/getSortFlowState",
        type: "post",
        data: {
            flow_id: flow_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let flows = result[0];
            let states = result[1];
            let trtd = "";
            for (let i = 0; i < flows.length; i++) {
                let num1 = i + 1;
                trtd += '<tr><td>' + num1 + '. ' + flows[i].flow_name + '</td>';
                for (let j = 0; j < states[i].length; j++) {
                    let num = j + 1;
                    if (states[i].length == 1) {
                        trtd += '<td>' + num + '.' + states[i][j].state_name + '</td></tr>';
                    } else {
                        if (j == states[i].length - 1) {
                            trtd += num + '.' + states[i][j].state_name + '</td></tr>';
                        } else {
                            trtd += '<td>' + num + '.' + states[i][j].state_name + ',  ';
                        }
                    }
                }
            }
            $(trtd).appendTo($("#flow_state"))

        }
    })
}
// 传入具体的文件类型数表id，查询出对应的数据条数，以及名字，id
function getDetailFile_types(t) {
    let file_type_id = $(t).val();
    $(t).prev().val(file_type_id)
    $("#file_type tr:gt(0)").empty();
    $.ajax({
        url: "/users/getDetailFile_types",
        type: "post",
        data: {
            file_type_id: file_type_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            let trtd = "";
            for (let i = 0; i < result.length; i++) {
                let num = i % 2;
                let num2 = i + 1;
                if (num == 0) {
                    trtd += '<tr><td>' + num2 + '. ' + result[i].name + '</td>';
                } else {
                    trtd += '<td>' + num2 + '. ' + result[i].name + '</td></tr>';
                }
            }
            $(trtd).appendTo($("#file_type"));
        }
    })
}
// 商品的详情按钮
function detailPt(t) {
    $("#b").hide()
    $("#detail").show()
    $(t).parent().parent().children().children().each(function () {
        let attrName = $(this).attr('name');
        if (attrName == 'product_id') {
            $.ajax({
                url: "/users/getProductById",
                type: "post",
                data: {
                    product_id: $(this).val()
                },
                async: false,
                dataType: "text",
                success: function (result) {
                    result = JSON.parse(result).data[0];
                    let product_id = result.product_id;
                    let name = result.name;
                    let product_detail = result.product_detail;
                    let imgPath = result.imgPath;
                    let imgPath2 = result.imgPath2;
                    let imgPathSmall = result.imgPathSmall;
                    let flow_id = result.flow_id;
                    let threeText = result.threeText;
                    let isNum = result.isNum;
                    let isBourse = result.isBourse;
                    let putaway = result.putaway;
                    let product_intro = result.product_intro;
                    let file_type_id = result.file_type_id;
                    $('#detail input').each(function () {
                        let name1 = $(this).attr('name');
                        if (name1 == 'product_id') {
                            $(this).val(product_id)
                        } else if (name1 == 'name') {
                            $(this).val(name)
                        } else if (name1 == 'threeText') {
                            $(this).val(threeText)
                        } else if (name1 == 'isNum') {
                            $(this).val(isNum);
                            $(this).prev().val(isNum)
                        } else if (name1 == 'isBourse') {
                            $(this).val(isBourse);
                            $(this).prev().val(isBourse)
                        } else if (name1 == 'putaway') {
                            $(this).val(putaway);
                            $(this).prev().val(putaway)
                        } else if (name1 == 'product_intro') {
                            $(this).val(product_intro)
                            if (product_intro) {
                                $(this).next().val(product_intro.replace(/&br/g, '\r\n'));
                            } else {
                                $(this).next().val('');
                            }
                        } else if (name1 == 'product_detail') {
                            $(this).val(product_detail);
                            if (product_detail) {
                                $(this).next().val(product_detail.replace(/&br/g, '\r\n'));
                            } else {
                                $(this).next().val('');
                            }
                        } else if (name1 == 'flow_id') {
                            $(this).val(flow_id)
                            getFlows($(this));
                            $(this).next().val(flow_id);
                            $(this).next().trigger('onchange');
                        } else if (name1 == 'file_type_id') {
                            $(this).val(file_type_id);
                            getFile_type($(this));
                            $(this).next().val(file_type_id);
                            $(this).next().trigger('onchange');
                        }
                    })
                    let url1 = '/' + uploadFolde + '/' + imgPathSmall;
                    $("#imgDemo1").attr('src', url1);
                    // 商品详图第一张
                    let url2 = '/' + uploadFolde + '/' + imgPath;
                    $("#imgDemo2").attr('src', url2);
                    // 商品详图第二张
                    let url3 = '/' + uploadFolde + '/' + imgPath2;
                    $("#imgDemo3").attr('src', url3);
                }
            })
        }
    })
}
function setData(t) {
    let data = $(t).parent().val();
    $(t).parent().next().val(data);
}
// 筛选全部商品         ✔
function getScreenProduct() {
    let product_type_id = $("#types").val();
    $.ajax({
        url: "/users/getProductsByTypeId",
        type: "post",
        data: {
            product_type_id: product_type_id,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            $("#totalPage").val(Math.ceil(data.length / 15));
            $("#totalNum").val(data.length)
            getSplitPage()
        }
    })
}
function getSplitPage() {
    let limit = $("#pageNo").val();
    let product_type_id = $("#types").val();
    $.ajax({
        url: "/users/getProductsByTypeId",
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
            printProducts(data)
        }
    })
}
// 将得到的商品信息打印到表格       ✔
function printProducts(result) {
    $("#table tr:gt(0)").empty();
    let trtd = "";
    splitPageCss()
    for (let i = 0; i < result.length; i++) {
        let product_id = result[i].product_id;
        let name = result[i].name;
        let putaway = result[i].putaway;
        if (putaway == 0) {
            putaway = '下架';
        } else {
            putaway = '上架';
        }
        let product_detail = result[i].product_detail;
        trtd += '<tr><td><input type="text" readonly name="product_id" value="' + product_id + '"></td>' +
            '<td><input type="text" readonly name="name" value="' + name + '"></td>' +
            '<td><input type="text" readonly name="product_detail" value="' + name + '"></td>' +
            '<td><input type="text" readonly name="putaway" value="' + putaway + '"></td>' +
            '<td><input type="button" value="详情" style="width:30%" onclick="detailPt(this)">' +
            '<input type="button" value="编辑" style="width:30%" onclick="updatePt(this)">' +
            '<input type="button" value="删除" style="width:30%" onclick="deletePt(this)"></td></tr>'
    }
    $(trtd).appendTo($("#table tbody"))
}