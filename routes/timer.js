var fs = require('fs')
var path = require('path')


// 全局变量

module.exports = {
    /**
     * 创建一个一次性的定时器，用来删除指定路径下的文件
     * 传入要删除的文件的具体路径+名字
     * @param {string} fileName
     */
    deleteExcel: function (fileName) {
        setTimeout(() => {
            // 判断文件路径是否存在，如果存在将这个路径删除掉
            deleteFile(fileName);
            // fs.unlinkSync(fileName)
        }, 60000);
    },
}
function deleteFile(imgAgoPath) {
    if (fs.existsSync(imgAgoPath)) {
        fs.unlinkSync(imgAgoPath)
    }
}