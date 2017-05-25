/**
 * Created by 81964 on 2017/5/15.
 */
var mongoose = require('mongoose');
//将数据库里面的表结构保存到变量中
var contentSchema = require("../schemas/contents.js");
//创建一个模型
module.exports = mongoose.model("Content",contentSchema);