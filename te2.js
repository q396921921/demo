var db = require('./te');
const Promise = require('bluebird')


// 查询数据库后，返回的结果
let bb = Promise.promisify(function (client, cb) {
    client.hget('product_type_id:1', 'name', (err, ret) => {
        if (err) {
            cb(err);
        } else {
            cb(null, ret);
        }
    })
})
// 调用那些promise对象的方法（尽量将多个访问数据库的方法封装为promise方法），这样可以更方便得到我们需要的值，并且代码美观。
async function getCon() {
    try {
        let client = await db.getCon(null);
        let num = await bb(client)
        console.log(num);
    } catch (err) {
        console.log(err)
    }
}
getCon();

// db.getCon(null).then((client) => {
//     client.hget('product_type_id:1', 'name', (err, ret) => {
//         console.log(ret);
//         client.quit();
//     })
// })


// 传统的解决异步回调地狱的方法     创建promise对象，resolve返回数据，reject返回错误，
// 当该方法得到数据之后，才会用resolve返回。然使用.then()方法获得数据。

// 现在的解决异步回调地狱的方法     同样是创建promise对象，也是在该方法得到数据之后，才会用resolve返回，
// 但现在可以创建async为前戳的方法，然后内部用await调用这些返回promise对象的方法。这些方法会等resolve返回
// 值之后，才会去执行下一行代码，但在等待过程中，其他的代码运行不会受影响，仍然是异步的不用担心会都被阻塞在此
// 然后就得到了我们需要的值，通过try{}catch(err){}去捕捉其中的错误;












var db = {};
/**
 * 获得一个redis连接
 */
// db.getCon = function () {
//     return new Promise(function (resolve, reject) {
//         const db_client = db2.createClient(option);
//         db_client.on('error', function (err) {
//             console.log('连接出现错误');
//             console.log(err);
//             if (err) {
//                 reject('error')
//             }
//         })
//         db_client.on('connect', function () {
//             console.log('Redis连接成功');
//             resolve(db_client);
//         })
//     })
// }
db.getCon = Promise.promisify(function (data, cb) {
    const db_client = db2.createClient(option);
    db_client.on('error', function (err) {
        console.log('连接出现错误');
        console.log(err);
        if (err) {
            cb('error', null)
        }
    })
    db_client.on('connect', function () {
        console.log('Redis连接成功');
        cb(null, db_client);
    })
})


try {
    // 在内部不能再嵌套其他回调函数，无法捕捉其错误
} catch (err) {
    
}


module.exports = db;