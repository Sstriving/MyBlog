/**
 * Created by 81964 on 2017/5/15.
 */
var mongoose = require('mongoose');

//新建表结构,并将其返回出去
module.exports = new mongoose.Schema({
    //内容表结构
    //分类为一个关联字段
    category:{
        //类型
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'Category'
    },
    //作者
    user:{
        type:mongoose.Schema.Types.ObjectId,
        //引用
        ref:'User'
    },
    //时间
    addTime:{
        type:Date,
        default:new Date()
    },
    //阅读量
    views:{
        type:Number,
        default:0
    },
    title:String,
    describe:{
        type:String,
        default:""
    },
    content:{
        type:String,
        default:""
    },
    comments:{
        type:Array,
        default:[]
    }
});