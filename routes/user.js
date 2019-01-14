/*
 * @Author: duzhuo
 * @Date: 2018-11-19 09:25:39
 * @LastEditors: duzhuo
 * @LastEditTime: 2019-01-11 17:45:24
 * @Description: 关于用户模块的路由。
 */
var express = require('express');
var log = require('../control/log');
var router = express.Router();
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var public = require("../public/public");
var path = public.path;

var mdEmp = require('../control/methodEmp');

router.get('/user*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = "user/" + ul.pathname.substring(1);
  let menu = qs.parse(ul.query).menu;
  req.session.menu = menu ? menu : req.session.menu;
  res.render(ulstr, { "username": req.session.username, "menu": req.session.menu })
})
/**
 * @description: 获得所有的角色名以及角色id,以及角色所对应的code码
 * @method: get
 * @returns: "{data:[{role_id:x,name:x,code:x,leavl:x}...]}"
 */
router.get('/getRoles', function (req, res, next) {
  mdEmp.getRole(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
/**
 * @description: 传入username，返回这个唯一用户名的角色信息以及推荐码
 * @method: post
 * @param {string} username 用户名
 * @returns： "{role:x, emp:x}""
 */
router.post('/getRole', function (req, res, next) {
  mdEmp.getRoleInfo(req, (ret) => {
    res.send(ret);
  })
})
/**
 * @description: 批量创建不同角色的账户
 * @method: post
 * @param {string} password 初始密码
 * @param {number} code 角色的code码
 * @param {number} num 创建账号的个数  
 * @returns: "{userArr:[x,x,x...]}""
 */
router.post('/createUsers', function (req, res, next) {
  mdEmp.createUser(req, (ret) => {
    res.send(ret)
  })
})
/**
 * 通过权限类型与角色类型查找复合条件的用户,返回分页的数据
 * @param {number} power_type 是个人权限2还是角色权限1
 * @param {number} type 角色的code，1、2、3、4、5、6
 * @param {number} limit 页数
 * @returns {string} "{'data':[emp1,emp2...]，totalPage:x, totalNum:x}"
 */

/**
 * @description: 通过权限类型与角色类型查找复合条件的用户,返回分页的数据
 * @method: post
 * @param {number} power_type 是个人权限2还是角色权限1
 * @param {number} type 角色的code，1、2、3、4、5、6
 * @param {number} limit 页数
 * @returns: "{'data':[emp1,emp2...]，totalPage:x, totalNum:x}"
 */
router.post('/selectUsers', function (req, res, next) {
  mdEmp.getEmpByType2(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 导出所有人信息为Excel表格,并返回此表格在服务器静态文件下的路径。
 * @method: post
 * @returns: "/folderName/fileName"比如public/img/a.jpg,返回/img/a.jpg
 */
router.post('/outputUser', function (req, res, next) {
  mdEmp.selectAndOutUsers(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 返回所有权限以及此用户所拥有的权限
 * @method: post
 * @param {number} id 用户的emp_id或角色的code
 * @param {string} type role/user 
 * @returns: {all:[x,x...],check:[x,x...]}
 */
router.post('/getResource', function (req, res, next) {
  mdEmp.getAllResourcesChecked(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 将所有人的权限恢复为原始的角色权限
 * @method: get
 * @returns: success/error
 */
router.get('/recoverAllreource', function (req, res, next) {
  mdEmp.recoverAllreource(null, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 将之前这个角色所对应的多个权限全部删除掉，然后对本次的权限进行设置
 * @method: post
 * @param {number} role_id 角色code码
 * @param {ArrayNumber}  resource_id [id1,id2...]
 * @returns: success || error
 */
router.post('/updateRoleResource', function (req, res, next) {
  mdEmp.updateRoleResource(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 将角色权限修改为单独权限，可以一次修改多个人，但他们的权限是相同的
 * @method: post
 * @param {ArrayNumber} emp_id [id1,id2...]
 * @param {ArrayNumber} resource_id [id1,id2...] 
 * @returns: success || error
 */
router.post('/updateRoleToUser', function (req, res, next) {
  mdEmp.updateRoleToUser(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 传入用户id,使用户对应权限为角色
 * @method: post
 * @param {number} emp_id  
 * @returns: success || error
 */
router.post('/recoverPower', function (req, res, next) {
  mdEmp.recoverPower(req, (ret) => {
    res.send(ret);
  })
})
/**
 * @description: 传入emp_id和多个权限的id，改变用户的权限
 * @method: post
 * @param {number} emp_id
 * @param {ArrayNumber} resource_id [id1,id2...] 
 * @returns: success || error
 */
router.post('/updateUserResource', function (req, res, next) {
  mdEmp.updateUserResource(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 通过用户id，获得他的权限
 * @method: post
 * @param {number} emp_id 
 * @returns: {all:[x,x...],check:[x,x...]}
 */
router.post('/getOneUserResource', function (req, res, next) {
  mdEmp.getOneUserResource(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 传入用户id，删除此用户
 * @method: post
 * @param {number} emp_id 
 * @returns: success || error
 */
router.post('/deleteUser', function (req, res, next) {
  mdEmp.deleteUser(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 获得复合条件的用户
 * @method: post
 * @param {string} username 用户名
 * @param {number} emp_id
 * @param {number} dep_id
 * @param {number} type 角色码
 * @returns: "{data:[x,x...]}""
 */
router.post('/getUser', function (req, res, next) {
  mdEmp.getEmp(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
/**
 * @description: 传入用户名与密码判断是否为合法用户
 * @method: post
 * @param {string} username
 * @param {string} password
 * @returns: 'isusers'-登录者为用户 || success || error
 */
router.post('/getUserByUserPass', function (req, res, next) {
  mdEmp.getUserByUserPass(req, (ret) => {
    res.send(ret)
  })
})
/**
 * @description: 传入要修改的信息，修改此用户的基本信息 
 * @method: post
 * @param {string} name 用户的姓名
 * @param {string} username 用户名
 * @param {string} tel 电话
 * @param {string} repassword 要修改的密码
 * @returns: success || error
 */
router.post('/updateUserInfo', function (req, res, next) {
  let exist = req.body.exist;
  mdEmp.updateUserInfo(req, (ret) => {
    if (exist && ret == 'success') {
      res.send(ret)
    }
  })
})
/**
 * @description: 修改用户所对应的推荐码 
 * @method: post
 * @param {number} emp_id
 * @param {string} iiuv 要修改的推荐码 
 * @returns: nouser-没有此推荐码对应的账户 || success || error
 */
router.post('/updateUser6', function (req, res, next) {
  mdEmp.updateUser6(req, (ret) => {
    res.send(ret)
  })
})































router.get('/' + public.excelFile + '/*', function (req, res, next) {
  res.download('.' + req.path)
})





router.get('/phone/pmain', function (req, res, next) {

  res.cookie("path", path);
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let username = ul.username;

  res.render('pmain', { 'username': username })
});
router.get('/phone/allOrders', function (req, res, next) {
  res.render('phone/allOrders', { 'menu': 'allOrders' })
});
router.get('/phone/screen', function (req, res, next) {
  res.render('phone/screen', { 'menu': 'screen' })
});


router.get('/css/*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  fs.createReadStream('./views/' + ulstr).pipe(res);
});
router.get('/js/*', (function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  fs.createReadStream('./views' + ulstr).pipe(res);
}))
module.exports = router;