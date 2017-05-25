/**
 * Created by 81964 on 2017/5/8.
 */
var express = require("express");
//创建一个路由对象
var router = express.Router();
//分类模板
var Category = require("../models/category.js");
var Content = require("../models/content.js");
var data;
//处理网站里面的通用数据
router.use(function (req, res, next) {
    data = {
        //用户信息
        userInfo: req.userInfo,
        //分类信息
        categories: []
    };
    //在数据库里面读取分类信息
    Category.find().then(function (categories) {
        data.categories = categories;
        next();
    });
});
//首页
router.get('/', function (req, res, next) {
    //客户端请求后返回页面
    //声明一个对象，里面包含页面上所用的数据

    //点击导航栏过滤分类内容
    data.category = req.query.category || "";
    //总数据量
    data.count = 0;
    //每页条数
    data.limit = 3;
    /*当前页数*/
    data.page = Number(req.query.page || 1);
    //总页数
    data.pages = 0;
    data.contents = "";
    var where = {};
    //判断点击的分类是否有提交来的id
    if (data.category) {
        where.category = data.category;
    }
    //内容的总条数
    Content.where(where).count().then(function (count) {
        data.count = count;
        //计算总页数
        data.pages = Math.ceil(data.count / data.limit);
        /*设置当前的范围*/
        data.page = Math.min(data.page, data.pages);
        data.page = Math.max(data.page, 1);
        var skip = (data.page - 1) * data.limit;
        //where()查询时的条件
        return Content.where(where).find().sort({addTime: -1}).limit(data.limit).skip(skip)
            .populate(['category', 'user'])
    }).then(function (contents) {
        data.contents = contents;
        //console.log(data);
        res.render("main/index.html", data)
    })
});
router.get("/view", function (req, res) {
    var contentId = req.query.contentId;
    Content.findOne({
        _id: contentId
    }).then(function (content) {
        //console.log(content)
        //处理阅读量
        content.views++;
        content.save();
        data.contents = content;
        res.render("main/views.html",data)
    })
});
//将路由返回，一个模块运行后的返回值就是module.exports对象
module.exports = router;