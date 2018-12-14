require(["config"], function() {
    require(["jquery", "load", "cookie"], function($) {
        // 登录
        function Login() {
            $.cookie.json = true;
            this.addListener();
        }

        $.extend(Login.prototype, {
            addListener() {
                //点击邮箱注册跳转到注册页面
                $("div.links").on("click", ".email-regis", this.switchToRes);
                //登录处理
                $("#btn-login").on("click", this.loginHandle);
                //聚焦隐藏警告框
                $("#login-form").on("focus","input" , this.alertHiddenHandle);
            },
            //切换到注册页面
            switchToRes() {
                $(".login-box").addClass("hidden").next(".register-box").removeClass("hidden");
            },
            //聚焦隐藏警告框
            alertHiddenHandle() {
                $(".login-error").addClass("hidden");
            },
            // 登录处理
            loginHandle() {
                const data = $("#login-form").serialize();

                $.post("http://127.0.0.1/wangyi/api/login.php", data, (res)=>{
                    if(res.res_body.status === 1) {
                        $.cookie("loginUser", res.res_body.info.email, {path:"/"});
                        // console.log($.cookie("loginUser"));
                        location = "/html/index.html";
                    } else {
                        $(".login-error").removeClass("hidden");
                    }
                }, "json");

                return false;   //阻止表单默认提交和事件冒泡
            }
        });

        new Login();

        // 注册
        function Register() {
            this.addListener();
        }

        $.extend(Register.prototype, {
            //注册事件监听
            addListener() {
                //点击立即登录切换到登录界面
                $(".login").on("click", ".login-now", this.switchToLogin);
                //注册事件
                $("#btn-register").on("click", this.registerHandle);
                //聚焦隐藏警告框
                $("#register-form").on("focus","input" , this.alertHiddenHandle);
            },
            //切换到登录页面
            switchToLogin() {
                $(".login-box").removeClass("hidden").next(".register-box").addClass("hidden");
            },
            //聚焦隐藏警告框
            alertHiddenHandle() {
                $(".register-error").addClass("hidden");
            },
            //注册处理
            registerHandle() {
                // console.log("提交了")
                //获取注册信息
                const data = $("#register-form").serialize();
                // console.log(data);
                //post发送数据
                $.post("http://127.0.0.1/wangyi/api/register.php", data, (res)=>{
                    if(res.res_body.status === 1) {
                        $(".login-box").removeClass("hidden").next(".register-box").addClass("hidden");
                    } else {
                        $(".register-error").removeClass("hidden");
                        $(".register").attr({style: "height: 300px"});
                    }
                }, "json");

                return false;   //阻止表单默认提交和事件冒泡
            }
        });

        new Register();
    })
});