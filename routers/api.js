/**
 * Created by 81964 on 2017/5/8.
 */
var express = require("express");
//创建一个路由对象
var router = express.Router();
//将定义好的模型引入
var User = require("../models/user.js");
var Content = require("../models/content.js");
//统一返回的数据格式
var responseData;
//初始化返回数据
router.use(function (req, res, next) {
    responseData = {
        code: "0",
        message: ""
    };
    next()
});
//注册的路由
router.post('/user/register', function (req, res, next) {

    //req.body获取到post提交的数据
    var username = req.body.username;
    var password = req.body.password;
    var repassword = req.body.repassword;

    if (username == "") {
        responseData.code = "1";
        responseData.message = "用户名不能为空";
        //向前端返回JSON数据
        res.json(responseData);
        return
    }
    if (password == "") {
        responseData.code = "2";
        responseData.message = "密码不能为空";
        //向前端返回JSON数据
        res.json(responseData);
        return
    }
    if (password != repassword) {
        responseData.code = "3";
        responseData.message = "两次密码不一致";
        //向前端返回JSON数据
        res.json(responseData);
        return
    }
    //在数据库中查询数据数据是否存在
    User.findOne({
        username: username
    }).then(function (userInfo) {
        //检查用户名是否存在
        if (userInfo) {
            responseData.code = "4";
            responseData.message = "用户已存在";
            res.json(responseData);
            return
        }
        //如果不存在则：
        //定义一个新对象
        var user = new User({
            username: username,
            password: password
        });
        //将数据保存到数据库中
        return user.save();
    }).then(function (newUserInfo) {
        responseData.message = "注册成功";
        //向前端返回JSON数据
        res.json(responseData);
    })

});
//登录的路由
router.post('/user/login', function (req, res) {
    //req.body获取到post提交的数据
    var username = req.body.username;
    var password = req.body.password;

    //信息验证
    if (username == "" || password == "") {
        responseData.code = "1";
        responseData.message = "用户名或者密码不能为空";
        //向前端返回JSON数据
        res.json(responseData);
        return;
    }
    //查询数据库用户名和密码是否正确，如果正确则登录成功
    User.findOne({
        username: username,
        password: password
    }).then(function (userInfo) {
        //console.log(userInfo);
        //userInfo为用户提交的信息
        if (!userInfo) {
            responseData.code = "2";
            responseData.message = "用户名或密码错误";
            res.json(responseData);
            return
        }
        else {
            //登录成功
            responseData.code = "0";
            responseData.message = "登录成功";
            responseData.userInfo = {
                _id:userInfo._id,
                username:userInfo.username
            };

            //将cookie保存
            req.cookies.set('userInfo',JSON.stringify({
                _id:userInfo._id,
                username:userInfo.username
            }));
            res.json(responseData);
            return
        }
    })
});
//每次进入一篇文章，获取一次评论信息
router.get("/comment",function(req,res){
    var contentId = req.query.contentid;

    Content.findOne({
        _id:contentId
    }).then(function(contents){
        responseData.data = contents;
        res.json(responseData);
    })
})
//评论提交的路由
router.post("/comment/post",function(req,res){
    var contentId = req.body.contentid;
    var username = req.userInfo.username;
    //定义一个评论的结构
    var comment = {
        //用户
        username: req.userInfo.username,
        //评论时间
        postTime: new Date().toLocaleString(),
        //评论内容
        content: req.body.content||""
    };
    if(comment.content==""){
        responseData.message="内容不能为空";
        res.json(responseData)
        return
    }else{
        //查找当前博客的id
        Content.findOne({
            _id:contentId
        }).then(function(contents){
            //将评论信息添加到具体的内容中
            contents.comments.push(comment);
            return contents.save();
        }).then(function(newContent){
            responseData.data = newContent;
            responseData.username=username;
            responseData.message = "发表评论成功！";
            res.json(responseData)
        })
    }

});
//退出的路由
router.get('/user/logout',function(req,res){
    //点击退出之后，清除cookie信息
    req.cookies.set('userInfo',null);
    res.json(responseData);
});

//将路由返回，一个模块运行后的返回值就是module.exports对象
module.exports = router;