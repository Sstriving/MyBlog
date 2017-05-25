/**
 * Created by 81964 on 2017/5/9.
 */
    //数据库模型
var mongoose = require('mongoose');
//将数据库里面的表结构保存到变量中
var usersSchema = require("../schemas/users.js");
//创建一个模型
module.exports = mongoose.model("User",usersSchema);