

// 跳转当前测试1页面，即管理与创建
function jump(num) {
    window.location.href = '/users/other/ceshi' + num + '?menu=' + num;
}


// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
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


function getSplitPage() {
    $("#select table tr:gt(0)").empty();
    let limit = $("#pageNo").val();
    $.ajax({
        url: "/users/getNews",
        type: "post",
        data: {
            limit: limit
        },
        async: false,
        dataType: "text",
        success: function (result) {
            result = JSON.parse(result).data
            result = result[0];
            $("#pages").val(limit);
            $("#lstd span:first").html(limit);
            $("#lstd span:last").html($("#totalPage").val());
            splitPageCss()
            for (let i = 0; i < result.length; i++) {
                let ret = result[i];
                let new_id = ret.new_id;
                let title = JSON.parse(ret.title).info;
                let time = new Date(+new Date(ret.time) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '').split(' 00:00:00')[0];
                let str = "<tr><td hidden><input type='hidden' name='new_id' value='" + new_id + "'></td>"
                    + "<td height='20px'><input style='width:99%;height:99%;text-align:center;' type='text' name='title' value='" + title + "'></td>"
                    + "<td height='20px'><input style='width:99%;height:99%;text-align:center;' type='text' name='time' value='" + time + "'></td>"
                    + "<td hidden><input type='hidden' name='ret' value='" + JSON.stringify(ret) + "'></td>"
                    + "<td height='20px'><input type='button' value='查看' onclick='selectNew(this)'>"
                    + "<input type='button' value='修改' onclick='updateNew(this)'>"
                    + "<input type='button' value='删除' onclick='daleteNew(this)'></td></tr>"
                $(str).appendTo($("#select").children());
            }
        }
    })
}




// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
// 删除新闻
function daleteNew(t) {
    let flag = confirmAct('是否确认删除此新闻？');
    if (flag) {
        let dom = $(t).parent().parent().children().children('input[name="new_id"]');
        let new_id = dom.val();
        $.ajax({
            url: "/users/deleteNew",
            type: "post",
            data: {
                new_id: new_id
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if (result == 'success') {
                    alert('操作成功');
                    dom.parent().parent().remove();
                } else {
                    alert('操作失败')
                }
            }
        })
    }
}
// 修改一条新闻
function updateNew(t) {
    let title, time, title2, newsData, imgPath, imgPath2, ret;
    $(t).parent().parent().children().children().each(function () {
        let name = $(this).attr('name');
        switch (name) {
            case 'new_id':
                $("#new_id").val($(this).val());
                break;
            case 'time':
                time = $(this).val();
                break;
            case 'ret':
                ret = JSON.parse($(this).val());
            default:
                break;
        }
    })
    imgPath = ret.imgPath
    imgPath2 = ret.imgPath2; // 标题图片
    imgDisplay(imgPath, imgPath2);
    title = JSON.parse(ret.title);
    title2 = JSON.parse(ret.title2);
    newsData = JSON.parse(ret.newsData);
    setNewsData("update", title, time, title2, newsData);
}
// 查看一条新闻
function selectNew(t) {
    let new_id, title, time, title2, newsData, imgPath, imgPath2, ret;
    $(t).parent().parent().children().children().each(function () {
        let name = $(this).attr('name');
        switch (name) {
            case 'new_id':
                new_id = $(this).val();
                break;
            case 'time':
                time = $(this).val();
                break;
            case 'ret':
                ret = JSON.parse($(this).val());
            default:
                break;
        }
    })
    imgPath = ret.imgPath;  // 内容图片
    imgPath2 = ret.imgPath2; // 标题图片
    imgDisplay(imgPath, imgPath2);
    $("div img").each(function () {
        $(this).prop("onclick", null).off("click");
    })
    title = JSON.parse(ret.title);
    title2 = JSON.parse(ret.title2);
    newsData = JSON.parse(ret.newsData);
    setNewsData("select", title, time, title2, newsData);
}
function imgDisplay(imgPath, imgPath2) {
    imgPath = imgPath.split(';');
    if (imgPath2) {
        imgPath2 = imgPath2.split(';');
    }
    let count = 0;
    $("div img").each(function () {
        if (count <= 2) {
            if (imgPath2) {
                for (let i = 0; i < imgPath2.length; i++) {
                    const src = imgPath2[i];
                    if (i == count) {
                        $(this).attr('src', '/upload/' + src);
                    }
                }
            }
        } else if (count > 2) {
            for (let i = 0; i < imgPath.length; i++) {
                const src = imgPath[i];
                if ((i + 3) == count) {
                    $(this).attr('src', '/upload/' + src);
                }
            }
        }
        count++;
    })
}
function setNewsData(tag, title, time, title2, newsData) {
    $("#split").hide();
    if (tag == 'insert') {
        $("#insert").show();
        $("#select").hide();
        $("#create").next().hide();
    } else if (tag == 'select') {
        $("#create").hide();
        $("#create").prev().hide();
        $("#create").next().hide();
        $("#insert").show();
        $("#select").hide();
        // 将所有的东西变为不可编辑状态
        $("#t2").children().children().children().children().each(function () {
            let tagName = $(this).prop('tagName');
            if (tagName == 'INPUT' || tagName == 'TEXTAREA') {
                $(this).attr('disabled', 'disabled');
            }
        })
    } else if (tag == 'update') {
        $("#create").hide();
        $("#insert").show();
        $("#select").hide();
    }
    if (title && time && title2 && newsData) {
        this.title = title;
        this.time = time;
        this.title2 = title2;
        this.newsData = newsData;
    } else {
        this.title = {
            title_size: 36,  // 默认标题文字大小15
            title_weight: 'bold',  // 默认标题文字加粗
            title_color: '#646464',  // 默认标题文字色号
            title_height: 1.6,  // 默认标题行间距
        }
        this.time = new Date().toLocaleDateString().replace('/', "-").replace('/', '-');
        this.title2 = {
            title2_size: 25,
            title2_weight: '',
            title2_color: '#646464',
            title2_height: 2.4,
        }
        this.newsData = {
            info_size: 18,
            info_color: '#646464',
            info_height: 1.6
        }
    }
    setStyle('title', this.title);
    setStyle('title2', this.title2);
    setStyle('newsData', this.newsData);
    setStyle('time', this.time);
}
// 查找的
function getAllNews(new_id) {
    $.ajax({
        url: "/users/getNews",
        type: "post",
        data: "",
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data;
            let totalPage = data[1];
            let totalNum = data[2];
            $("#totalPage").val(totalPage);
            $("#totalNum").val(totalNum);
        }
    })
}


// 创建的
// 传入不同的标签以及dom对象，将默认的值改变
function styleChange(tag, t) {
    let name = $(t).attr('name');
    let val = $(t).val();
    if (tag == 'title') {
        title[name] = val;
        setStyle(tag, title);
    } else if (tag == 'title2') {
        title2[name] = val;
        setStyle(tag, title2);
    } else if (tag == 'newsData') {
        newsData[name] = val;
        setStyle(tag, newsData);
    } else if (tag == 'time') {
        time = val;
    }
}
// 将新的默认对象的值赋给对应的内容
function setStyle(tag, obj) {
    if (tag == 'title') {
        if (obj.title_weight) {
            $("#titleBold").attr('checked', 'checked');
        } else {
            $("#titleBold").next().attr('checked', 'checked');
        }
        $("#title").attr('style',
            'font-size:' + obj.title_size +
            'px;font-weight:' + obj.title_weight +
            ';color:' + obj.title_color +
            ';line-height:' + obj.title_height);
        $("#title").val(obj.info);
    } else if (tag == 'title2') {
        if (obj.title2_weight) {
            $("#title2Bold").attr('checked', 'checked');
        } else {
            $("#title2Bold").next().attr('checked', 'checked');
        }
        $("#title2").attr('style',
            'font-size:' + obj.title2_size +
            'px;font-weight:' + obj.title2_weight +
            ';color:' + obj.title2_color +
            ';line-height:' + obj.title2_height);
        $("#title2").val(obj.info);
    } else if (tag == 'newsData') {
        $("#newsData").attr('style',
            'font-size:' + obj.info_size +
            'px;color:' + obj.info_color +
            ';line-height:' + obj.info_height);
        $("#newsData").val(obj.info);
    } else if (tag == 'time') {
        $("#time").val(obj);
    }
}

// 在textarea中加入一个图片标识。
function insertImg() {
    $("#newsData").insertContent("<picture>")
    // $("#info").insertText('<input type="file" name="file" onchange="change(this)" hidden>' +
    //     '<img src="x" width="200px" height="120px" onclick = "uploadImg(this)">');
}

// 提交创建一条新闻所需要的所有信息
function ajaxSubmit(tag, t) {
    if (tag == 'update') {
        $(t).parent().next().attr('action', '/users/updateNew');
    } else if (tag == 'insert') {
        $(t).parent().next().attr('action', '/users/insertNew');
    }
    title.info = $("#title").val();
    title2.info = $("#title2").val();
    newsData.info = $("#newsData").val();
    time = $("#time").val();
    $(t).parent().next().ajaxSubmit({
        type: 'post',
        async: false,
        data: {
            new_id: $("#new_id").val(),
            title: title,
            title2: title2,
            newsData: newsData,
            time: time
        },
        dataType: "text",
        success: function (result) {
            if (result == 'success') {
                alert('操作成功')
            } else {
                alert('操作失败')
            }
        }
    })
}

// 在textarea中指定光标处添加代码
$.fn.extend({
    insertContent: function (myValue, t) {
        var $t = $(this)[0];
        if (document.selection) {
            this.focus();
            var sel = document.selection.createRange();
            sel.text = myValue;
            this.focus();
            sel.moveStart('character', -l);
            var wee = sel.text.length;
            if (arguments.length == 2) {
                var l = $t.value.length;
                sel.moveEnd("character", wee + t);
                t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
                sel.select();
            }
        } else if ($t.selectionStart
            || $t.selectionStart == '0') {
            var startPos = $t.selectionStart;
            var endPos = $t.selectionEnd;
            var scrollTop = $t.scrollTop;
            $t.value = $t.value.substring(0, startPos)
                + myValue
                + $t.value.substring(endPos, $t.value.length);
            this.focus();
            $t.selectionStart = startPos + myValue.length;
            $t.selectionEnd = startPos + myValue.length;
            $t.scrollTop = scrollTop;
            if (arguments.length == 2) {
                $t.setSelectionRange(startPos - t,
                    $t.selectionEnd + t);
                this.focus();
            }
        } else {
            this.value += myValue;
            this.focus();
        }
    }
})



// 点击图片触发图片触发<input type="file">的上传文件事件,然后他的值改变时触发onchange事件
function uploadImg(t) {
    $(t).prev().trigger('click');
}
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
        //图片路径设置为读取的图片
        img.attr('src', e.target.result);
    };
    reader.readAsDataURL(file);
}
// // 在光标指定位置添加代码
// $.fn.insertText = function (text) {
//     var obj = $(this)[0];
//     var range, node;
//     if (!obj.hasfocus) {
//         obj.focus();
//     }

//     if (document.selection && document.selection.createRange) {
//         this.focus();
//         document.selection.createRange().pasteHTML(text);
//         this.focus();
//     } else if (window.getSelection && window.getSelection().getRangeAt) {
//         range = window.getSelection().getRangeAt(0);
//         range.collapse(false);
//         node = range.createContextualFragment(text);
//         var c = node.lastChild;
//         range.insertNode(node);
//         if (c) {
//             range.setEndAfter(c);
//             range.setStartAfter(c)
//         }
//         var j = window.getSelection();
//         j.removeAllRanges();
//         j.addRange(range);
//         this.focus();
//     }
// }