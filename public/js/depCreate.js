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
    window.location.href = '/dep/dep' + text + '?menu=' + text;
}

// 二次确认框
function confirmAct(text) {
    if (confirm(text)) {
        return true;
    }
    return false;
}
// ok
function createDep() {
    let managerName = $("#managerName").val();
    let flag = confirmAct('确认要创建部门吗？')
    if (flag) {
        $.ajax({
            url: "/dep/createDep",
            type: "post",
            data: {
                managerName: managerName
            },
            async: false,
            dataType: "text",
            success: function (result) {
                if ('success') {
                    alert('创建成功')
                } else {
                    alert('创建失败')
                }
                location = location
            }
        })
    }
}