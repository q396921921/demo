const log4js = require('log4js');
const util = require('./util');
const sympol = require('../public/public');
/**
 * ip: client request ip
 * status: 200/304/404...
 * router: client request router
 * inData: input data
 * outData: output data
 * err: error
 */
const log = {
    // controlObj: { ip: "", router: "xx", userAgent: "", username: "", inData: "", outData: "", control: "" },
    // errObj: { ip: "", router: "xx", username: "", inData: "", errFun: "" },
    // logObj: { ip: "", username: "" },
    /**
     * this log can record user's controls
     * @param {JSON} val 
     */
    controlLog: async function (req, oth) {
        (async function () {
            try {
                let username = req.session.username ? req.session.username : req.body.username;
                let name = await require('./methodEmp').getEmp({ body: { username: username } });
                if (name.length != 0) {
                    name = name[0].name;
                } else {
                    name = " ";
                }
                let val = { ip: req.ip, router: req.originalUrl, name: name, inData: req.body };
                val.outData = oth.outData;
                val.control = oth.control;
                val = JSON.stringify(val);
                log4js.getLogger().info(val)
            } catch (err) {
                console.log(err);
            }
        })()
    },
    /**
     * this is the error log 
     * input JSON object format data, example: {ip:"",status:"",router:"xx",inData:"",outData:"",err:""}
     * @param {JSON} val 
     */
    errLog: function (req) {
        (async function () {
            try {
                let errInfo = util.stackInfo();
                let name = await require('./methodEmp').getEmp({ body: { username: req.body.username } });
                name = name[0].name;
                let val = JSON.stringify({ ip: req.ip, router: req.originalUrl, name: name, inData: req.body, path: errInfo.path, line: errInfo.line, file: errInfo.file });
                log4js.getLogger('err').error(val)
            } catch (err) {
                console.log(err);
            }
        })()
    },
    /**
     * this log can record user's login behavior
     * @param {JSON} val 
     */
    loginLog: function (val) {
        val = JSON.stringify(val);
        log4js.getLogger('login').info(val);
    }
}
module.exports = log;