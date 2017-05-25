/**
 * Created by 81964 on 2017/5/5.
 */
/*
应用程序的启动文件*/

/*加载express模块*/
var express = require("express");
//加载模板处理模块
var swig = require("swig");
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser，用来处理post提交过来的数据
var bodyparser = require("body-parser");
//加载coolies保存用户登录状态
var Cookies = require("cookies");
//引入数据库模型
var User = require("./models/user.js");
//在开发过程中需要取消模板缓存机制
swig.setDefaults({cache:false});

//创建app应用
var app = express();
//设置body-parser
app.use(bodyparser.urlencoded({extended:true}));
//静态文件的托管
//当用户访问的路径以/public开头的话，则处理为静态文件
app.use('/public',express.static(__dirname+'/public'));
/*配置应用模板*/
//定义当前模板的引擎
//第一个参数为模板引擎的名字，第二个参数解析模板内容
app.engine('html',swig.renderFile);
//设置模板存放的目录，第一次参数为views，第二个参数为模板路径
app.set('views','./views');
//注册使用的模板引擎，第二个参数为模板名字
app.set('views engine','html');

//设置cookise
app.use(function (req, res, next) {
    req.cookies = new Cookies(req, res);
    //由于在站内访问任何一个页面时都需要用户信息，所以建立一个全局变量
    //解析用户登录的cookie
    req.userInfo={};
    if(req.cookies.get("userInfo")){
        try{
            req.userInfo = JSON.parse(req.cookies.get("userInfo"));
            //获取当前用户的登录信息
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
                next();
            })
        }catch(e){
            next();
        }
    }else{
        next();
    }

});
//模块划分
//后台管理
app.use("/admin",require('./routers/admin'));
app.use("/api",require('./routers/api'));
app.use("/",require('./routers/main'));


//连接数据库
mongoose.connect("mongodb://localhost:27017/Blog",function(err){
    if(err){
        console.log("数据库连接失败！")
    }else{
        console.log("数据库连接成功了！");
        /*监听http请求*/
        app.listen(8081);
    }
});
/*
 *首页的路由绑定
 * req:request对象
 * res：response对象
 * next：将控制权交给下一个执行的路由函数
 **/

/*app.get("/",function(req,res,next){
 // res.send("<h1>欢迎光临我的博客</h1>")
 //读取views目录下的指定文件，解析返回给客户端
 //第一个参数：表示模板的文件相对于view的相对位置
 //第二个参数：传递给模板的使用数据
 res.render("index",{});
 });*/

/*//给css进行请求解析
 app.get("/main.css",function(req,res,next){
 //该诉别人以文本格式解读
 res.setHeader("content-type","text/css");
 res.send("body{background-color:green;}")
 });*/



