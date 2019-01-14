var express = require('express');
var router = express.Router();
const url = require('url');
const qs = require('qs');
const UUID = require('uuid');
const path1 = require('path');
const mdEmp = require('../control/methodEmp');

const multer = require('multer');
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
            res.redirect('main', 200, { "username": username });
        }
    })
})
// 注销用户，并清除当前缓存的session
router.get('/outUser', function (req, res, next) {
    req.session.username = null;
    // let sessionStore = req.sessionStore.sessions;
    res.render('login', { "mes": '您的账户已经注销' });
})
// 每个请求都会进入到这里，并且将当前的session的生存时间刷新
router.use('/*', function (req, res, next) {
    let username = req.session.username;
    if (username) {
        req.session._garbage = Date();
        req.session.touch();
        next();
    } else {
        res.redirect('/login', 200, { mes: '您的登录已经失效' });
    }
})
// 通过state的值，管理左面的大模块
router.get('/main', function (req, res, next) {
    let ul = url.parse(req.url)
    ul = qs.parse(ul.query)
    let state = ul.state;
    let menu = ul.menu;
    // 设置此次要访问的菜单
    req.session.menu = menu;
    req.session.state = state;
    res.render('main', { "username": req.session.username });
})
router.get('/iframe', function (req, res, next) {
    let state = req.session.state;
    let menu = req.session.menu;
    if (!state || !menu) {
        state = 'order';
        menu = 'Appli';
    }
    res.render('iframe', { "state": state, "menu": menu, "username": req.session.username })
});
router.get('/upload/*', function (req, res, next) {
    let ul = url.parse(req.url);
    let ulstr = ul.pathname;
    res.sendfile("." + ulstr)
})
module.exports = router;