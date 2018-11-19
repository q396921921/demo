function firClick() {
    $("#pageNo").val(1);
    getSplitPage("", $("#table"))
}
function preClick() {
    let pageNo = parseInt($("#pageNo").val());
    let flag = checkPage(pageNo - 1);
    if (flag) {
        $("#pageNo").val(pageNo - 1);
        getSplitPage("", $("#table"))
    }
}
function nextClick() {
    let pageNo = parseInt($("#pageNo").val());
    let flag = checkPage(pageNo + 1);
    if (flag) {
        $("#pageNo").val(pageNo + 1);
        getSplitPage("", $("#table"))
    }
}
function lastClick() {
    let totalPage = parseInt($("#totalPage").val());
    $("#pageNo").val(totalPage);
    getSplitPage("", $("#table"))
}
function checkPage(pp) {
    let flag = true;
    var reg = /^\d{0,}$/;
    if (!reg.test(pp) || pp == '') {
        flag = false;
    }
    return flag;
}
function tpageNoClick() {
    let totalPage = parseInt($("#totalPage").val());
    var pp = $("#pages").val();
    var reg = /^\d{0,}$/;
    if (!reg.test(pp) || pp == '') {
        alert("请输入1到" + totalPage + "数字");
    } else {
        var p = parseInt($("#pages").val());
        if (p > totalPage || p < 1) {
            alert("请输入1到" + totalPage + "数字");
        } else {
            $("#pageNo").val(pp);
            getSplitPage("", $("#table"), pp)
        }
    }
}
function splitPageCss() {
    let pageNo = $("#pageNo").val();
    let totalPage = $("#totalPage").val();
    if (totalPage == 1 && pageNo == 1) {
        $("#fir").hide();
        $("#pre").hide();
        $("#next").hide();
        $("#last").hide();
    } else if (pageNo == 1 && totalPage > pageNo) {
        $("#fir").hide();
        $("#pre").hide();
        $("#next").show();
        $("#last").show();
    } else if (pageNo > 1 && totalPage > pageNo) {
        $("#fir").show();
        $("#pre").show();
        $("#next").show();
        $("#last").show();
    } else if (pageNo > 1 && totalPage == pageNo) {
        $("#fir").show();
        $("#pre").show();
        $("#next").hide();
        $("#last").hide();
    }
}