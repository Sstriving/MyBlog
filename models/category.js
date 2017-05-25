/**
 * Created by 81964 on 2017/5/17.
 */
//数据库模型
// 分类的模型
var mongoose = require('mongoose');
//将数据库里面的表结构保存到变量中
var categorysSchema = require("../schemas/categorys.js");
//创建一个模型
module.exports = mongoose.model("Category",categorysSchema);