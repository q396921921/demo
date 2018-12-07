// 获得资质表的信息,并将其打印到当前页面中
function getzizhiInfo() {
    $.ajax({
        url: "/users/getzizhiInfo",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data[0];
            let zizhi_id = result.zizhi_id;
            let text = result.text;
            let imgPath = result.imgPath;
            $("#zizhi").children().children().each(function () {
                let name = $(this).attr('name');
                let elt = $(this)
                if (name == 'database_id') {
                    elt.val(zizhi_id)
                } else if (name == 'text') {
                    elt.val(text)
                } else if (name == 'img') {
                    let url = '/' + uploadFolde + '/' + imgPath;
                    elt.attr('src', url);
                }
            })
        }
    })
}

// 获得首页表的信息,并将其打印到当前页面中
function gethome_page() {
    $.ajax({
        url: "/users/gethome_page",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data;
            for (let i = 0; i < result.length; i++) {

                let home_id = result[i].home_id;
                let product = result[i].product;
                let home_page_num = '#home_page' + i;
                // 为两张表中的home_id都赋值
                $(home_page_num + ' input[name="database_id"]').each(function () {
                    $(this).val(home_id)
                })
                if (product) {
                    let text = product.product_detail;
                    let imgPath = product.imgPath;
                    let product_id = product.product_id;
                    let product_type_id = product.product_type_id;
                    $(home_page_num + ' h2:first-child').next().next().trigger('click');
                    $(home_page_num).children().each(function () {
                        if ($(this).prop('className') == 'homeProduct') {
                            $(this).children().children().each(function () {
                                let name = $(this).attr('name');
                                let elt = $(this);
                                if (name == 'product_id') {
                                    elt.val(product_id)
                                } else if (name == 's1') {
                                    elt.children().each(function () {
                                        if ($(this).val() == product_type_id) {
                                            elt.val(product_type_id);
                                            $(this).trigger('click')
                                        }
                                    })
                                } else if (name == 's2') {
                                    elt.val(product_id);
                                }
                            })
                        }
                    })
                    $(home_page_num + ' h2:first-child').next().next().attr('checked', 'checked');
                } else {
                    let text = result[i].text;
                    let imgPath = result[i].imgPath;
                    let imgPath2 = result[i].imgPath2;
                    // 选择广告还是商品
                    $(home_page_num + ' h2:first-child').next().attr('checked', 'checked');
                    $(home_page_num).children().each(function () {
                        if ($(this).prop('className') == 'homePage') {
                            $(this).children().children().each(function () {
                                let name = $(this).attr('name');
                                let elt = $(this);
                                if (name == 'text') {
                                    elt.val(text)
                                } else if (name == 'img') {
                                    let url = '/' + uploadFolde + '/' + imgPath;
                                    elt.attr('src', url);
                                } else if (name == 'img2') {
                                    let url = '/' + uploadFolde + '/' + imgPath2;
                                    elt.attr('src', url);
                                }
                            })
                        }
                    })
                }
            }
        }
    })
}

// 商品按钮，获取商品类别，并隐藏广告
function types(t) {
    let s;
    $(t).parent().children().each(function () {
        if ($(this).prop('className') == 'homeProduct') {
            $(this).show();
            $(this).children().children().each(function () {
                if ($(this).attr('name') == 's1') {
                    s = $(this);
                }
            })
        } else if ($(this).prop('className') == 'homePage') {
            $(this).attr('style', 'display:none')
        }
    })
    s.empty()
    s.next().empty();
    $('<option value="">----请选择----</option>').appendTo(s.next())
    $.ajax({
        url: "/users/getType",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            text = JSON.parse(result).data
            let opt = '<option value="">----请选择类别----</option>';
            for (let i = 0; i < text.length; i++) {
                opt += '<option onclick="getProducts(this)" value="' + text[i].product_type_id + '">' + text[i].name + '</option>';
            }
            $(opt).appendTo(s)
        }
    })
}

// 获取不同类别的商品
function getProducts(t) {
    let s = $(t).parent().next();
    s.empty()
    let product_type_id = $(t).val();
    $.ajax({
        url: "/users/getProduct",
        type: "post",
        data: {
            product_type_id: product_type_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let text = JSON.parse(result).data
            let opt = '<option value="">----请选择----</option>';
            for (let i = 0; i < text.length; i++) {
                opt += '<option onclick="setProduct_id(this)" value="' + text[i].product_id + '">' + text[i].name + '</option>';
            }
            $(opt).appendTo(s)
        }
    })
}
// 为所选择的商品隐藏的product_id赋值
function setProduct_id(t) {
    let product_id = $(t).parent().val();
    $(t).parent().parent().children().each(function () {
        if ($(this).attr('name') == 'product_id') {
            $(this).val(product_id)
        }
    })
}

// 隐藏商品选择，显示广告
function hiddenProduct(t) {
    $(t).parent().children().each(function () {
        if ($(this).prop('className') == 'homeProduct') {
            $(this).attr('style', 'display:none')
        } else if ($(this).prop('className') == 'homePage') {
            $(this).show();
        }
    })
}
// 获得业务合作伙伴表信息
function getBusiness() {
    $.ajax({
        url: "/users/getbusiness",
        type: "get",
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            for (let i = 0; i < data.length; i++) {
                let bus_id = data[i].bus_id;
                let name = data[i].bus_name;
                if (bus_id == 1) {
                    // 为提交表单时业务id赋值
                    $('#business0 input[name="database_id"]').val(bus_id);
                    $('#business0 input[name="name"]').val(name);
                    // 默认触发银行按钮 
                    $('#business0 form').prev().prev().trigger('click');
                    // 默认选中银行单选按钮
                    $('#business0 form').prev().prev().attr('checked', 'checked');
                } else {

                    $('#business1 input[type="radio"]').each(function () {
                        let radio_num = $(this).val()
                        if (radio_num == bus_id) {
                            $(this).next().html(name);
                        }
                        if (radio_num == 2 && bus_id == 2) {
                            $(this).trigger('click');
                            $("#business1 input[name='name']").val(name);
                            $("#business1 input[name='database_id']").val(bus_id)
                            $(this).attr('checked', 'checked');
                        }
                    })
                }
            }
        }
    })
}
// 合作伙伴2的单选按钮点击事件
function getPartnerInfo2(t) {
    $("#business1 input[name='name']").val($(t).next().html());
    $("#business1 input[name='database_id']").val($(t).val())
    let twoLine = 1;
    let bus_id = $(t).val()
    $.ajax({
        url: "/users/getPartnerBankOrOrgan",
        type: "post",
        data: {
            twoLine: twoLine,
            bus_id: bus_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            let count1 = 0;
            let count2 = 0;
            $('#business1 img').each(function () {
                $(this).attr('name', data[count1].partner_id);
                count1++;
            })
            $('#business1 input[name="small_text"]').each(function () {
                $(this).prev().val(data[count2].partner_id)
                $(this).val(data[count2].small_text)
                count2++;
            })
            for (let i = 0; i < data.length; i++) {
                let partner_id = data[i].partner_id;
                let bank_imgPath = data[i].bank_imgPath;
                let small_text = data[i].small_text;
                $('#business1 img').each(function () {
                    if ($(this).attr('name') == partner_id) {
                        let url = '/' + uploadFolde + '/' + bank_imgPath;
                        $(this).attr('src', url);
                    }
                })
            }
        }
    })
}

// 合作伙伴1的单选按钮点击事件，获得房贷业务的机构还是银行
function getPartnerInfo1(t) {
    let twoLine = $(t).val();
    // let bus_id = $('#business0 input[name="database_id"]').val();
    let bus_id = 1;
    $.ajax({
        url: "/users/getPartnerBankOrOrgan",
        type: "post",
        data: {
            twoLine: twoLine,
            bus_id: bus_id
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data
            let count1 = 0;
            let count2 = 0;
            $('#business0 img').each(function () {
                $(this).attr('name', data[count1].partner_id);
                count1++;
            })
            $('#business0 input[name="small_text"]').each(function () {
                $(this).prev().val(data[count2].partner_id)
                $(this).val(data[count2].small_text)
                count2++;
            })
            for (let i = 0; i < data.length; i++) {
                let partner_id = data[i].partner_id;
                let bank_imgPath = data[i].bank_imgPath;
                let small_text = data[i].small_text;
                $('#business0 img').each(function () {
                    if ($(this).attr('name') == partner_id) {
                        let url = '/' + uploadFolde + '/' + bank_imgPath;
                        $(this).attr('src', url);
                    }
                })
            }
        }
    })
}
// 获取银行表的id，修改其中的详细图片，详细标题，详细内容
function getPartnerDetail(t) {
    let partner_id = $(t).prev().prev().val();
    $.ajax({
        url: "/users/getPartnerBankOrOrgan",
        type: "post",
        data: {
            partner_id: partner_id
        },
        success: function (result) {
            let data = JSON.parse(result).data[0]
            let partner_id = data.partner_id;
            let name1 = data.name;
            let big_text = data.big_text;
            let imgPath = data.imgPath;
            $("#partner ").children().children().each(function () {
                let name = $(this).attr('name');
                let elt = $(this)
                if (name == 'database_id') {
                    elt.val(partner_id)
                } else if (name == 'text') {
                    elt.val(big_text)
                } else if (name == 'name') {
                    elt.val(name1);
                } else if (name == 'img') {
                    let url = '/' + uploadFolde + '/' + imgPath;
                    elt.attr('src', url);
                }
            })
        }
    })
}

// 表单用ajax进行提交，然后后台进行修改
function submitForm(t) {
    $(t).parent().ajaxSubmit({
        type: 'post',
        async: false,
        dataType: "text",
        success: function (result) {
            console.log(result);
            if (result == 'success') {
                alert('修改成功')
            } else {
                alert('修改失败')
            }
        }
    })
    return false;
}


// 点击图片触发图片触发<input type="file">的上传文件事件,然后他的值改变时触发onchange事件
function uploadImg(t) {
    $(t).prev().trigger('click');
}

// 选择好图片文件之后实现预览功能，即触发此事件,传入的是<input type="file">的this值
function change(fileDom) {
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
        //获取图片dom属性，也就是上传图片显示在的 img 的dom对象
        var img = $(fileDom).next();
        var isUpdate = $(fileDom).next().next();
        if (isUpdate.attr('name') == 'isUpdate') {
            isUpdate.val(1);
        }
        // 将改变了的图片标记为1
        if (typeof (img.parent().parent().attr('id')) != 'undefined') {
            if (img.parent().parent().attr('id').substring(0, 8) == 'business') {
                img.next().val(1);
            }
        }
        //图片路径设置为读取的图片
        img.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
}

// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/other/ceshi' + num + '?menu=' + num;
}



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