
let r1, r2, r3, r4, r5, r6, r7, r8, r9, r10, r11, r12, r13, r14, r15, r16, r17, r18, r19, r20, r21, r22, r23, r24, r25, r26, r27, r28, r29, r30
    , r31;
// r1=true, r2=true, r3=true, r4=true, r5=true, r6=true, r7=true, r8=true, r9=true, r10=true, r11=true, r12=true, r13=true, r14=true, r15=true, r16=true, r17=true, r18=true, r19=true, r20=true, r21=true, r22=true, r23=true, r24=true, r25=true, r26=true, r27=true, r28=true, r29=true, r30
// =true, r31=true;
let role_type;
let userdep_id;
let busoff_id;
let emp_id;


function getEmp() {
    $.ajax({
        url: "/users/getUser",
        type: "post",
        data: {
            "username": username,
        },
        async: false,
        dataType: "text",
        success: function (result) {
            let data = JSON.parse(result).data[0]
            emp_id = data.emp_id;
            busoff_id = emp_id;
            let type = data.type
            let power_type = data.power_type;
            userdep_id = data.dep_id;
            role_type = type;
            if (power_type == 1) {
                getPowerResource(type, 'role');
            } else if (power_type == 2) {
                getPowerResource(emp_id, 'user');
            }
        }
    })
}

// 获得所有权限
function getPowerResource(id, type) {
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
            result = JSON.parse(result).data;
            let resources = result[1];
            if (resources.length != 0) {
                // 遍历所有已经拥有的权限
                for (let i = 0; i < resources.length; i++) {
                    let r_id = resources[i].resource_id;
                    // 如果这个已拥有权限的resource_id = 几，那么就证明他拥有这个权限
                    // 银行功能
                    switch (r_id) {
                        case 1:
                            r1 = true;
                            break;
                        case 2:
                            r2 = true;
                            break;
                        case 3:
                            r3 = true;
                            break;
                        case 4:
                            r4 = true;
                            break;
                        case 5:
                            r5 = true;
                            break;
                        case 6:
                            r6 = true;
                            break;
                        case 7:
                            r7 = true;
                            break;
                        case 8:
                            r8 = true;
                            break;
                        case 9:
                            r9 = true;
                            break;
                        case 10:
                            r10 = true;
                            break;
                        case 11:
                            r11 = true;
                            break;
                        case 12:
                            r12 = true;
                            break;
                        case 13:
                            r13 = true;
                            break;
                        case 14:
                            r14 = true;
                            break;
                        case 15:
                            r15 = true;
                            break;
                        case 16:
                            r16 = true;
                            break;
                        case 17:
                            r17 = true;
                            break;
                        case 18:
                            r18 = true;
                            break;
                        case 19:
                            r19 = true;
                            break;
                        case 20:
                            r20 = true;
                            break;
                        case 21:
                            r21 = true;
                            break;
                        case 22:
                            r22 = true;
                            break;
                        case 23:
                            r23 = true;
                            break;
                        case 24:
                            r24 = true;
                            break;
                        case 25:
                            r25 = true;
                            break;
                        case 26:
                            r26 = true;
                            break;
                        case 27:
                            r27 = true;
                            break;
                        case 28:
                            r28 = true;
                            break;
                        case 29:
                            r29 = true;
                            break;
                        case 30:
                            r30 = true;
                            break;
                        case 31:
                            r31 = true;
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    })
}

// 
function userExistHide() {
    if (r16) {
        $('<li id="li1"><input type="button" value="创建" name="head1" onclick="jump(1)"></li>').appendTo($("#a ul"));
    }
    if (r22) {
        $('<li id="li4"><input type="button" value="信息查看" name="head4" onclick="jump(4)"></li>').appendTo($("#a ul"));
    }
    if (r30) {
        $('<li id="li2"><input type="button" value="管理" name="head2" onclick="jump(2)"></li>').appendTo($("#a ul"));
    }
}