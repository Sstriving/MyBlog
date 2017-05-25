/**
 * Created by 81964 on 2017/5/9.
 */
$(function(){
    $(".title-li").each(function(index){
        $(".title-li").eq(index).hover(function(){
            $(this).addClass("li-hover1");
        },function(){
            $(this).removeClass("li-hover1");
        })
    });
    //登录与注册的页面切换
    //点击登录
    $(".colMint2").click(function(){
        $(".deng").show();
        $(".zhuce").hide();
    });
    //点击注册
    $(".colMint1").click(function(){$(".deng").hide();$(".zhuce").show();
    });
    //注册功能，通过ajax提交请求
    $(".register").click(function(){
        $.ajax({
            url:"/api/user/register",
            type:"post",
            data:{
                username:$("#username").val(),
                password:$("#password").val(),
                repassword:$("#repassword").val()
            },
            dataType:"json",
            success:function(result){
                $(".sgin").html(result.message);
                //注册成功后跳转到登录页面
                if(result.code==0){
                    setTimeout(function(){
                        $(".deng").show();
                        $(".zhuce").hide();
                    },500)
                }
            }
        })
    });
    //登录功能
    $(".enter").click(function() {
        $.ajax({
            url: "/api/user/login",
            type: "post",
            data: {
                username: $("#username-deng").val(),
                password: $("#password-deng").val()
            },
            dataType: "json",
            success: function (result) {
                $(".sgin").html(result.message);
                //注册成功后跳转到登录页面
                if (result.code == 0) {
                    //登录成功以后刷新页面
                    window.location.reload();
                }
            },
            error:function(err){
                alert(JSON.stringify(err.statusText));
            }
        })
    });
    //点击退出登录状态
    $("#logout").click(function(){
        $.ajax({
            url:"/api/user/logout",
            success:function(result){
                if (result.code == 0) {
                    //登录成功以后刷新页面
                    window.location.reload();
                }
            }
        })
    })
})