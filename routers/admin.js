/**
 * Created by 81964 on 2017/5/8.
 */
//管理员模块
var express = require("express");
//引入用户信息的数据库模型
var User = require("../models/user.js");
//分类的数据库模型
var Category = require("../models/category.js");
//内容的数据库模型
var Content = require("../models/content.js");
//创建一个路由对象
var router = express.Router();

//只有管理员才能进入后台管理
router.use(function (req, res, next) {
    if (!(req.userInfo.isAdmin)) {
        res.send("对不起，只有管理员才能进入后台管理！")
    }
    next();
});
//首页的路由
router.get('/', function (req, res, next) {
    res.render("admin/index.html", {
        userInfo: req.userInfo
    })
});
//用户管理
router.get('/user', function (req, res, next) {
    //在数据库里面查询用户信息
    //limit();限制获取数据的条数
    //skip();忽略数据的条数
    /*每页数据条数*/
    var url = "/user";
    var limit = 5;
    /*当前页数*/
    var page = Number(req.query.page || 1);
    //总页数
    var pages = 0;
    //查询数据库中共有多少条数据
    User.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);
        /*设置当前的范围*/
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        User.find().limit(limit).skip(skip).then(function (userlist) {
            res.render("admin/user_index.html", {
                userInfo: req.userInfo,
                users: userlist,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                url: url
            })
        })
    })
});    //分类管理的路由
router.get("/category", function (req, res, next) {
    var url = "/category";
    var limit = 5;
    /*当前页数*/
    var page = Number(req.query.page || 1);
    //总页数
    var pages = 0;
    //查询数据库中共有多少条数据
    Category.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);
        /*设置当前的范围*/
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        //sort({_id:-1}).以id为条件进行排序，-1位降序
        Category.find().sort({_id: -1}).limit(limit).skip(skip).then(function (categories) {
            res.render("admin/category_index.html", {
                userInfo: req.userInfo,
                categories: categories,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                url: url
            })
        })
    })
})
//分类添加
router.get("/category/add", function (req, res, next) {
    res.render("admin/category_add.html", {
        userInfo: req.userInfo
    })
})
//分类的保存
router.post("/category/add", function (req, res, next) {
    //req.body可以获取到post提交来的数据
    var name = req.body.name || "";
    if (name == "") {
        //返回错误信息
        res.render("admin/error.html", {
            userInfo: req.userInfo,
            message: "名称不能为空"
        });
        return
    }
    //查询数据库中是否有该分类
    Category.findOne({
        name: name
    }).then(function (rs) {
        if (rs) {
            //数据库中已经存在该分类了
            res.render("admin/error.html", {
                userInfo: req.userInfo,
                message: "分类名称已存在"
            });
            //返回一个错误承诺，让下面的then方法不在执行
            return Promise.reject("sorry");
        } else {
            //数据库中不存在该分类
            //新建一个对象保存在数据库中
            return new Category({
                name: name
            }).save();
        }
    }).then(function (newCategory) {
        //保存成功提示
        res.render("admin/success.html", {
            userInfo: req.userInfo,
            message: "分类保存成功",
            url: "/admin/category"
        })
    })
});
/*分类的修改*/
router.get("/category/exit", function (req, res) {
    //获取要修改的分类信息
    var id = req.query.id || "";
    Category.findOne({
        _id: id
    }).then(function (category) {
        if (!category) {
            res.render("admin/error.html", {
                userInfo: req.userInfo,
                message: "该分类不存在"
            });
        } else {
            res.render("admin/category_exit.html", {
                userInfo: req.userInfo,
                category: category
            })
        }
    })
});
/*分类的修改保存*/

router.post("/category/exit", function (req, res) {
    //获取要修改的分类信息id
    var id = req.query.id || "";
    //接受post提交过来的数据
    var name = req.body.name || "";
    //数据库中查找这个id
    Category.findOne({
        _id: id
    }).then(function (category) {
        //如果不存在
        if (!category) {
            res.render("admin/error.html", {
                userInfo: req.userInfo,
                message: "该分类不存在"
            });
            return Promise.reject();
        } else {
            //当用户没有做任何修改提交的时候
            if (name == category.name) {
                res.render("admin/success.html", {
                    userInfo: req.userInfo,
                    message: "修改成功",
                    url: "/admin/category"
                });
                return Promise.reject();
            } else {
                //判断要修改的分类名称是否已经存在
                //去数据库中查询有没有一个id不一致，但名字和post发过来一致的数据
                return Category.findOne({
                    _id: {$ne: id},
                    name: name
                })
            }
        }
    }).then(function (sameCategory) {
        //如果数据库中已经存在post提交过来的分类
        if (sameCategory) {
            res.render("admin/error.html", {
                userInfo: req.userInfo,
                message: "该分类已存在"
            });
            return Promise.reject();
        } else {
            //如果不存在，则更新数据库中的数据
            return Category.update({
                _id: id
            }, {
                name: name
            })
        }
    }).then(function () {
        //提示修改成功
        res.render("admin/success.html", {
            userInfo: req.userInfo,
            message: "修改成功",
            url: "/admin/category"
        });
    })
});
/*分类的删除*/
router.get("/category/delete", function (req, res) {
    var id = req.query.id || "";
    Category.findOne({
        _id: id
    }).then(function (category) {
        res.render("admin/category_delete.html", {
            userInfo: req.userInfo,
            category: category
        })
    })
});
router.post("/category/delete", function (req, res) {
    var id = req.query.id || "";
    //数据库的删除操作
    Category.remove({
        _id: id
    }).then(function () {
        res.render("admin/success.html", {
            userInfo: req.userInfo,
            message: "删除成功",
            url: "/admin/category"
        });
    })
});
//内容管理
router.get("/content", function (req, res) {
    var url = "/content";
    var limit = 5;
    /*当前页数*/
    var page = Number(req.query.page || 1);
    //总页数
    var pages = 0;
    //查询数据库中共有多少条数据
    Content.count().then(function (count) {
        //总页数
        pages = Math.ceil(count / limit);
        /*设置当前的范围*/
        page = Math.min(page, pages);
        page = Math.max(page, 1);
        var skip = (page - 1) * limit;
        //sort({_id:-1}).以id为条件进行排序，-1位降序
        //populate("")关联的表结构
        Content.find().sort({addTime: -1}).limit(limit).skip(skip).populate(['category','user']).then(function (contents) {
            res.render("admin/content_index.html", {
                userInfo: req.userInfo,
                contents: contents,
                page: page,
                pages: pages,
                limit: limit,
                count: count,
                url: url
            })
        })
    })
});
//内容添加
router.get("/content/add", function (req, res) {
    Category.find().sort({_id: -1}).then(function (categories) {
        res.render("admin/content_add.html", {
            userInfo: req.userInfo,
            categories: categories
        })
    })
});
//内容添加的保存
router.post("/content/add", function (req, res) {
    //console.log(req.body)
    //检测提交的内容是否正确
    if (req.body.category == "") {
        res.render("admin/error.html", {
            userInfo: req.userInfo,
            message: "添加的分类不能空"
        });
        return
    }
    if (req.body.title == "") {
        res.render("admin/error.html", {
            userInfo: req.userInfo,
            message: "添加的标题不能空"
        });
        return
    }
    //验证通过则保存内容到数据库
    new Content({
        category: req.body.catagory,
        title: req.body.title,
        user:req.userInfo._id.toString(),
        describe: req.body.describe,
        content: req.body.content
    }).save().then(function (rs) {
            res.render("admin/success.html", {
                userInfo: req.userInfo,
                message: "内容保存成功",
                url: "/admin/content"
            });
        })
});
//内容修改
router.get("/content/exit",function(req,res){
    var id = req.query.id || "";
    var categories = [];
    Category.find().then(function(rs){
        categories = rs;
        return Content.findOne({
            _id: id
        }).populate('category').then(function (content) {
            if (!content) {
                res.render("admin/error.html", {
                    userInfo: req.userInfo,
                    message: "该分类不存在"
                });
                return Promise.reject();
            } else {
                res.render("admin/content_exit.html", {
                    userInfo: req.userInfo,
                    content:content,
                    categories:categories
                })
            }
        })
    });

});
//修改内容后保存
router.post("/content/exit",function(req,res){
    var id = req.query.id || "";
    //console.log(req.body);

    Content.update({
        _id: id
    }, {
        category:req.body.category,
        title: req.body.title,
        describe:req.body.describe,
        content:req.body.content
    }).then(function(){
        res.render("admin/success.html",{
            userInfo:req.userInfo,
            message:"修改成功",
            url:"/admin/content/exit?id="+id
        })
    })
});
//内容的删除
router.get("/content/delete",function(req,res){
    var id = req.query.id || "";
    Content.remove({
        _id: id
    }).then(function () {
        res.render("admin/success.html", {
            userInfo: req.userInfo,
            message: "删除成功",
            url: "/admin/content"
        });
    })
});
//将路由返回，一个模块运行后的返回值就是module.exports对象
module.exports = router;