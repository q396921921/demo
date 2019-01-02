var express = require('express');
var log = require('./log');
var router = express.Router();
var fs = require('fs');
var url = require('url')
var qs = require('querystring');
var path1 = require('path');
var momoent = require('moment');
var public = require("./../public/public");
var UUID = require('uuid');
var path = public.path;

var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path1.join(__dirname, "../public/" + public.uploadFolde));
  },
  filename: function (req, file, cb) {
    var name = file.mimetype.split('/')[1];
    var ID = UUID.v1();
    cb(null, ID + '.' + name);
  }
})
var upload = multer({ storage: storage });
router.use(upload.array('file', 50));


var mdOrder = require('./methodOrder');
var mdEmp = require('./methodEmp');
var mdData = require('./methodData');

var log = require('./log');


router.get('/favicon.ico', function (req, res, next) {
  res.send('');
})
router.get('/getProssesId', function (req, res, next) {
  // process.exit();
  res.send(process.pid + "");
})
router.get('/login', function (req, res, next) {
  res.render('login', { "mes": "" })
})
// 通过账户名与密码判断用户是否合法
// 如果合法判断是否已经有其他用户登录此账户，有就将之前的session删除，使账户失效
router.post('/log', function (req, res, next) {
  let username = req.body.username;
  mdEmp.getUserByUserPass(req, (ret) => {
    if (ret.indexOf("error") != -1) {
      res.render('login', { "mes": '您所输入的用户名或者密码错误' });
    } else if (ret.indexOf("isusers") != -1) {
      res.render('login', { "mes": '用户账户无法登录后台管理系统' });
    } else {
      let sessionStore = req.sessionStore.sessions;

      let keys = Object.keys(sessionStore);

      let flag = false;
      let length = keys.length;
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let session = JSON.parse(sessionStore[key]);
        let uname = session.username;
        if (uname == username) {
          flag = true;
          delete eval(sessionStore)[key];   // 根据键的名字，清除此键与其所对应的值
          console.log('账户已经在其他地方登录,清除前一个登录的账户');
          break;
        }
      }
      req.session.username = username;
      res.render('main', { "username": username });
    }
  })
})
// 每个请求都会进入到这里，并且将当前的session的生存时间刷新
router.all('/*', function (req, res, next) {
  let username = req.session.username;
  if (username) {
    let sessionStore = req.sessionStore.sessions;
    req.session._garbage = Date();
    req.session.touch();
    next();
  } else {
    res.render('login', { mes: '您的登录已经失效' });
  }
});
// 注销用户，并清除当前缓存的session
router.get('/outUser', function (req, res, next) {
  req.session.username = null;
  let sessionStore = req.sessionStore.sessions;
  res.render('login', { "mes": '您的账户已经注销' });
})


router.get('/upload/*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  res.sendfile("." + ulstr)
})

router.get('/main', function (req, res, next) {
  let ul = url.parse(req.url)
  ul = qs.parse(ul.query)
  let state = ul.state;
  let menu = ul.menu;
  // 设置此次要访问的菜单
  req.session.menu = menu;
  req.session.state = state;

  res.render('main', { "username": req.session.username, "path": path });
})
router.get('/iframe', function (req, res, next) {
  let state = req.session.state;
  let menu = req.session.menu;
  if (!state || !menu) {
    state = 4;
    menu = 1;
  }
  let username = req.session.username;
  res.render('iframe', { "state": state, "menu": menu, "username": username })
});

router.get('/appli/ceshi*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let menu = ul.menu;
  req.session.menu = menu;
  res.render(ulstr, { "username": req.session.username, "menu": menu })
});
// use
router.post('/getOrders', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getOrders(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.post('/getFlow_detail', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getFlow_detail(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.get('/getType', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getProduct_type(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.post('/getStates', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getStates(req);
      res.send(data);
    } catch (err) {
      res.send('error');
    }
  })()
})
// use专门的返回流程
router.post('/getFlows', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getFlows(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
router.post('/deleteOrder', function (req, res, next) {
  mdOrder.deleteOrder(req, (ret) => {
    res.send(ret)
  });
})
// use
router.post('/getState', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getOrder(req);
      res.send(data[0].flowState + "");
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.post('/getStatess', function (req, res, next) {
  mdOrder.getStatess(req, (ret) => {
    res.send(ret);
  });
})
// use
router.post('/setFailReason', function (req, res, next) {
  mdOrder.setFailReason(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/updateProfit', function (req, res, next) {
  mdOrder.updateProfit(req, (ret) => {
    res.send(ret);
  })
})
router.get('/getTotal_profit', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getTotal_profit(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.post('/setState', function (req, res, next) {
  let body = req.body;
  mdOrder.setState(body, (ret) => {
    res.send(ret)
  });
})
// use
router.post('/setFlow', function (req, res, next) {
  mdOrder.setFlowTime(req, (ret) => {
    res.send(ret)
  });
})
// use
router.post('/updateOrder', function (req, res, next) {
  mdOrder.updateOneOrder(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/setOrder_state2', function (req, res, next) {
  mdOrder.setOrder_state(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(ret2)
    }
  })
})
// use
router.post('/setRefund_state', function (req, res, next) {
  mdOrder.setRefund_state(req, (ret) => {
    res.send(ret)
  })
})



router.post('/getScreen', function (req, res, next) {
  mdOrder.screenOrder(req, (ret) => {
    res.send(ret)
  })
})
router.get('/public/images/true.jpg', (req, res, next) => {
  res.sendfile('public/images/true.jpg')
})
router.post('/screen', function (req, res, next) {
  mdOrder.screen(req, (ret) => {
    res.send(ret)
  });
})
// use
router.post('/getDep', function (req, res, next) {
  mdEmp.getDep(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
router.post('/writeExcel', function (req, res, next) {
  let body = req.body;
  let data = body.data;
  mdOrder.writeExcel(JSON.parse(data), (flag, pathStr) => {
    if (flag == 'true') {
      res.send(pathStr)
    } else {
      res.send('error')
    }
  })
})



//////////////////////�˻�������ҳ
router.get('/user/ceshi*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let menu = ul.menu;
  req.session.menu = menu;
  res.render(ulstr, { "username": req.session.username, "menu": menu })
})
// use
router.get('/getRoles', function (req, res, next) {
  mdEmp.getRole(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.post('/getRole', function (req, res, next) {
  mdEmp.getRoleInfo(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/createUsers', function (req, res, next) {
  mdEmp.createUser(req, (ret) => {
    res.send(ret)
  })
})




// ///////�˻�,������ҳ
router.post('/selectUsers', function (req, res, next) {
  mdEmp.getEmpByType2(req, (ret) => {
    res.send(ret)
  })
})
router.post('/outputUser', function (req, res, next) {
  mdEmp.selectAndOutUsers(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/getResource', function (req, res, next) {
  mdEmp.getAllResourcesChecked(req, (ret) => {
    res.send(ret)
  })
})
router.get('/recoverAllreource', function (req, res, next) {
  mdEmp.recoverAllreource(null, (ret) => {
    res.send(ret)
  })
})
router.post('/updateRoleResource', function (req, res, next) {
  mdEmp.updateRoleResource(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/updateRoleToUser', function (req, res, next) {
  mdEmp.updateRoleToUser(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/recoverPower', function (req, res, next) {
  mdEmp.recoverPower(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/updateUserResource', function (req, res, next) {
  mdEmp.updateUserResource(req, (ret) => {
    res.send(ret)
  })
})
router.post('/getOneUserResource', function (req, res, next) {
  mdEmp.getOneUserResource(req, (ret) => {
    res.send(ret)
  })
})
router.post('/deleteUser', function (req, res, next) {
  mdEmp.deleteUser(req, (ret) => {
    res.send(ret)
  })
})



// ///////�˻�,�޸���Ϣ��ҳ
router.post('/getUser', function (req, res, next) {
  mdEmp.getEmp(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
router.post('/getUserByUserPass', function (req, res, next) {
  mdEmp.getUserByUserPass(req, (ret) => {
    res.send(ret)
  })
})
router.post('/updateUserInfo', function (req, res, next) {
  let exist = req.body.exist;
  mdEmp.updateUserInfo(req, (ret) => {
    if (exist && ret == 'success') {

    }
    res.send(ret)
  })
})
router.post('/updateUser6', function (req, res, next) {
  mdEmp.updateUser6(req, (ret) => {
    res.send(ret)
  })
})
router.post('/getUser6', function (req, res, next) {
  mdEmp.getEmpByType2(req, (ret) => {
    res.send(ret)
  })
})



// 新闻
router.post('/insertNew', function (req, res, next) {
  mdData.insertNew(req, (ret) => {
    res.send(ret)
  })
})
router.post('/getNews', function (req, res, next) {
  mdData.getNewsSplit(req, (ret) => {
    res.send(ret)
  })
})
router.post('/updateNew', function (req, res, next) {
  mdData.updateNew(req, (ret) => {
    res.send(ret);
  })
})
router.post('/deleteNew', function (req, res, next) {
  let body = req.body;
  mdData.deleteNew(req, (ret) => {
    res.send(ret);
  })
})

// 获得所有的数据(实际增长量)
router.post('/getAllData', function (req, res, next) {
  mdData.getAllData(req, (ret) => {
    res.send(ret);
  })
})
// 获得增长基数与指数
router.get('/getDataAB', function (req, res, next) {
  mdData.getDataAB("", (ret) => {
    res.send(ret);
  })
})
// 修改增长基数与指数
router.post('/updateDataAB', function (req, res, next) {
  mdData.updateDataAB(req, (ret) => {
    res.send(ret);
  })
})






router.get('/other/ceshi*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let menu = ul.menu;
  req.session.menu = menu;

  res.render(ulstr, { "username": req.session.username, "menu": menu })
});
// use
router.get('/getzizhiInfo', function (req, res, next) {
  mdData.getData_zizhi(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.get('/gethome_page', function (req, res, next) {
  mdData.get_home_page(req, (ret) => {
    res.send(ret)
  })
})
// use
router.get('/getbusiness', function (req, res, next) {
  mdData.getData_business(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.post('/getPartnerBankOrOrgan', function (req, res, next) {
  mdData.getData_partner(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})


router.post('/updateData', function (req, res, next) {
  let database = req.body.database;
  if (database == 'zizhi') {
    mdData.updatezizhi(req, (ret) => {
      res.send(ret);
    })
  } else if (database == 'home_page') {
    mdData.updatehome_page(req, (ret) => {
      res.send(ret);
    })
  } else if (database == 'business') {
    mdData.updatebusinessAndPartner(req, (ret) => {
      res.send(ret);
    })
  } else if (database == 'partner') {
    mdData.updatepartnerDetail(req, (ret) => {
      res.send(ret);
    })
  }
})











router.get('/product/ceshi*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let menu = ul.menu;
  req.session.menu = menu;

  res.render(ulstr, { "username": req.session.username, "menu": menu })
});
// use
router.post('/getProduct', function (req, res, next) {
  (async function () {
    try {
      let data = await mdOrder.getProduct(req);
      res.send(JSON.stringify({ data: data }));
    } catch (err) {
      res.send('error');
    }
  })()
})
// use
router.post('/getLimitProduct', function (req, res, next) {
  mdOrder.getLimitProduct(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/getSortFlowState', function (req, res, next) {
  mdOrder.getSortFlowState(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.post('/getDetailFile_types', function (req, res, next) {
  mdOrder.getDetailFile_types(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.get('/getFlow', function (req, res, next) {
  mdOrder.getFlow(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.get('/getFile_types_num', function (req, res, next) {
  mdOrder.getFile_types_num(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
router.get('/getDetail_file_type', function (req, res, next) {
  mdOrder.getDetail_file_type(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})

router.post('/updateProductInfo', function (req, res, next) {
  mdOrder.updateProductInfo(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/insertProduct', function (req, res, next) {
  mdOrder.insertProduct(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/insertProductType', function (req, res, next) {
  mdOrder.insertProductType(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/createFlow', function (req, res, next) {
  mdOrder.createFlow(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/deleteFlow', function (req, res, next) {
  mdOrder.deleteFlow(req, (ret) => {
    res.send(ret);
  })
})
router.post('/deleteProduct', function (req, res, next) {
  mdOrder.deleteProduct(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/createFileType', function (req, res, next) {
  mdOrder.insertFileType(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/createDetailFileType', function (req, res, next) {
  mdOrder.insertDetailFileType(req, (ret) => {
    res.send(ret);
  })

})
// use
router.post('/deleteFileType', function (req, res, next) {
  mdOrder.deleteFileType(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/deleteDetailFileType', function (req, res, next) {
  mdOrder.deleteDetailFileType(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/updateFileType', function (req, res, next) {
  mdOrder.updateFileType(req, (ret) => {
    res.send(ret);
  })
})
// use
// 分配给内勤商品
router.post('/allotProduct', function (req, res, next) {
  mdOrder.allotProduct(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/getRelation_product_dep', function (req, res, next) {
  mdOrder.getRelation_product_dep(req, (ret, ret2) => {
    if (ret) {
      res.send(ret);
    } else {
      res.send(JSON.stringify({ 'data': ret2 }))
    }
  })
})
// use
// 删除这个商品对应的内勤
router.post('/deleteOffPro', function (req, res, next) {
  mdOrder.deleteOffPro(req, (ret) => {
    res.send(ret);
  })
})





router.get('/dep/ceshi*', function (req, res, next) {
  let ul = url.parse(req.url)
  let ulstr = ul.pathname
  ulstr = ulstr.substring(1);
  ul = qs.parse(ul.query)
  let menu = ul.menu;
  req.session.menu = menu;

  res.render(ulstr, { "username": req.session.username, "menu": menu })
});
// use
router.post('/createDep', function (req, res, next) {
  mdEmp.createDep(req, (ret) => {
    res.send(ret);
  })
})
// use
router.post('/getAllEmpNotAllot', function (req, res, next) {
  mdEmp.getAllEmpNotAllot(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/allotUser', function (req, res, next) {
  mdEmp.allotUser(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/allotManager', function (req, res, next) {
  mdEmp.allotManager(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/deleteDepUser', function (req, res, next) {
  mdEmp.deleteDepUser(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/deleteManager', function (req, res, next) {
  mdEmp.deleteManager(req, (ret) => {
    res.send(ret)
  })
})
// use
router.post('/deleteDep', function (req, res, next) {
  mdEmp.deleteDep(req, (ret) => {
    res.send(ret)
  })
})





router.get('/' + public.userfile + '/*', function (req, res, next) {
  res.download('.' + req.path)
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