/**
 * Created by 81964 on 2017/5/23.
 */
$(function () {
    //每页显示的条数
    var limit = 5;
    //评论的当前页
    var page =1;
    //总页数
    var pages = 0;
    //定义一个全局的评论数据
    var comments=[];
    //点击提交评论
    $("#comment").click(function () {
        $.ajax({
            type: "post",
            url: "/api/comment/post",
            data: {
                content: $("#text").val(),
                contentid: $("#contentid").val()
            },
            success: function (responseData) {
                $("#text").val('');
                //reverse()让数组反序
                $(".message").html(responseData.message);
                comments=responseData.data.comments.reverse();
                showComment();
            }
        })
    });
    $.ajax({
        url: "/api/comment",
        data: {
            contentid: $("#contentid").val()
        },
        success: function (responseData) {
            $("#text").val('');
            //reverse()让数组反序
            comments = responseData.data.comments.reverse();
            showComment();
        }
    });
    //点击事件的委托
    $(".page-comment").delegate("a","click",function(){
        if($(this).parent().hasClass("pageUp")){
            page--;
        }else{
            page++;
        }
        showComment()
    });
    //前台展示评论内容
    function showComment() {
        //计算评论的总页数
        pages = Math.ceil(comments.length / limit);
        var start = Math.max(0,(page - 1) * limit);
        var end=0;
        if(comments.length==1){
            end=1;
        }else{
            end=Math.min(page*limit,comments.length);
        }


        if (page <= 1) {
            page = 1;
            $(".page-comment li").eq(0).html("<span>没有上一页了</span>")
        } else {
            $(".page-comment li").eq(0).html("<a href='javascript:;'>上一页</a>")
        }
        if (page >= pages) {
            page = pages;
            $(".page-comment li").eq(2).html("<span>没有下一页了</span>")
        } else {
            $(".page-comment li").eq(2).html("<a href='javascript:;'>下一页</a>")
        }
        if(comments.length==0){
            $(".page-comment li").eq(1).html("<strong>还没有留言</strong>");
        }else{
            $(".page-comment li").eq(1).html("<strong>" + page + "/" + pages + "</strong>");
        }
        $("#commentNum").html("一共" + comments.length + "条评论");
        var html = "";
        for (var i = start; i < end; i++) {
            html += "<li class='li-comment'><p><span class='comment-username'>" + comments[i].username + ":" + "</span><span class='postTime'>" + comments[i].postTime + "</span></p>" +
                "<p class='content-com'>" + comments[i].content + "</p></li>"
        }
        $("#commentNow").html(html);
    }

});