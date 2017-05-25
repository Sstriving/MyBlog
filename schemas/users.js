/**
 * Created by 81964 on 2017/5/8.
 */
    //数据库
var mongoose = require('mongoose');

//新建表结构,并将其返回出去
module.exports = new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{
        type:Boolean,
        default:false
    }
});