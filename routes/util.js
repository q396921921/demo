var util = {
    /**
     * 将二者拼装在一起，condi默认为and如果需要修改，请在前端上传
     * @param {JSON} obj 默认当前表的的查询条件tName与condi(and);
     * @param {JSON} body 前端传过来的查询条件
     * @returns {JSON} obj 拼接后的值
     */
    spliceCode: function (obj, body) {
        for (const k in body) {
            if (body.hasOwnProperty(k)) {
                const val = body[k];
                if (val && val != "") {
                    obj[k] = val;
                }
            }
        }
        return obj;
    },
    /**
     * 判断文件路径是否存在，如果存在将这个路径删除掉
     * @param {String} imgAgoPath 要删除的图片路径
     * @param {String} folder 要删除图片所在文件夹
     */
    deleteFile: function (imgAgoPath, folder) {
        let pathStr = path.join(__dirname, '../public/' + folder + '/' + imgAgoPath);
        if (fs.existsSync(pathStr)) {
            fs.unlinkSync(pathStr)
        }
    },
    /**
     * 传入两个json对象，将其合并为一个
     * @param {JSON} jsonbject1
     * @param {JSON} jsonbject2
     * @returns {JSON} obj
     */
    concat: function (jsonbject1, jsonbject2) {
        var resultJsonObject = {};
        for (var attr in jsonbject1) {
            resultJsonObject[attr] = jsonbject1[attr];
        }
        for (var attr in jsonbject2) {
            resultJsonObject[attr] = jsonbject2[attr];
        }
        return resultJsonObject;
    },
    /**
     * 将从redis拿到的结果去掉row字段，
     * @param {Array} data 
     * @returns {Array} arr 
     */
    getData: function (data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            const val = data[i];
            arr.push(val.data);
        }
        return arr;
    },
    /**
     * 按不同的表进行分页
     * @param {JSON} obj tname表名与页数
     * @param {Array} arr 要分页的数据
     * @returns {Array} [arr,totalPage,totalNum] 去掉row字段的arr，最大页数，总记录数
     */
    splitPage: function (obj, arr) {
        let tName = obj.tName;
        let limit = Number(obj.limit) - 1;
        let totalNum = arr.length;
        let nums = 10;
        if (tName == 'order1' || tName == 'order3' || tName == 'order2') {
            nums = 20;
        } else if (tName == 'emp' || tName == 'product') {
            nums = 15;
        } else { // 此为筛选的返回数
            nums = 10;
        }
        let totalPage = Math.ceil(totalNum / nums);
        let arr2 = [];
        for (let i = (limit * nums); i < totalNum; i++) {
            if (i == nums * (limit + 1)) {
                break;
            } else if (i == totalNum - 1) {
                arr2.push(arr[i].data);
                break;
            }
            arr2.push(arr[i].data);
        }
        return [arr2, totalPage, totalNum];
    },
    /**
     * 根据传入的key，来相对应的对数组中的所有json对象排序
     * @param {Array} arr redis返回来的没有去处row的结果
     * @param {string} key 要排序的字段
     * @param {String} sort 排序规则 asc(从小到大)desc从大到小
     * @returns {Array} [json1,json2,...] 
     */
    sortArr: function (arr, key, sort) {
        var i = arr.length, j;
        var tempExchangVal;
        if (sort == 'asc') {
            while (i > 0) {
                for (j = 0; j < i - 1; j++) {
                    if (arr[j].data[key] > arr[j + 1].data[key]) {
                        tempExchangVal = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = tempExchangVal;
                    }
                }
                i--;
            }
        } else if (sort == 'desc') {
            while (i > 0) {
                for (j = 0; j < i - 1; j++) {
                    if (arr[j].data[key] < arr[j + 1].data[key]) {
                        tempExchangVal = arr[j];
                        arr[j] = arr[j + 1];
                        arr[j + 1] = tempExchangVal;
                    }
                }
                i--;
            }
        }
        return arr;
    },

}

module.exports = util;