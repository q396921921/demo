

// 邵石服务器的路径
const otherpath = 'https://oh2.daotongkeji.com'
const uploadFolde = 'upload';
const userfile = 'userfile';
const excelFile = 'excelFile';

var symbol = '\\';  // 这个是决定window系统\\与linux下的/的;

const port = '1238';
var http = 'http://192.168.1.238:' + port + '/';

const platform = 'window';
// const platform = 'linux';
if (platform == 'linux') {
    symbol = '/';
    http = 'https://oh5.daotongkeji.com/';
}
const all = {
    otherpath: otherpath,
    
    // 服务器端口
    httpport: port,
    // 针对websocket长连接监听的端口
    wsport: { port: 1237 },
    // 修改后台导出文件存储位置的

    symbol: symbol,

    // // excelFile读取文件路径
    // excelFileCreate: 'public' + symbol + excelFile,
    // excelFile创建文件路径
    excelFile: excelFile,

    // // 后台修改前台图片的存储路径
    // uploadFoldeCreate: 'public' + symbol + uploadFolde,
    // 后台修改前台图片的存储路径
    uploadFolde: uploadFolde,

    // // 用户上传的文件的存储路径
    // userfileCreate: 'public' + symbol + userfile,
    // 用户上传文件以后用来读取的路径
    userfile: userfile,


    // 这个是导出excel订单文件的标题
    outputTitleArrOrder: ['订单id', '商品', '申请流程', '申请状态', '订单编号', '渠道id', '业务id', '内勤id', '客户姓名', '商品类型', '申请金额', '放款金额', '申请时间', '放款时间', '下户时间', '失败原因', '用户备注', '员工备注', '订单文件', '订单状态', '银行名字', '银行卡号', '收款人'],
    // 这个是导出excel账户文件的标题
    outputTitleArrUser: ['部门', '账户名', '电话', '姓名', '性别', '权限级别', '推荐码', '身份证号', '对应业务员', '对应内勤', '注册时间', '最后一次登录时间', '最后一次提交申请时间', '是否单独权限'],
};

module.exports = all;