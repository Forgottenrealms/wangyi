define(["jquery", "cookie"], function($) {
    //构造函数
    function HeaderAndFooter() {
        $.cookie.json = true;
        this.init();
    }

    //扩展原型
    $.extend(HeaderAndFooter.prototype, {
        //初始化
        init() {
            this.loadHeader();
            this.loadFooter();
        },

        //加载头部
        loadHeader() {
            $.get("/html/html/include/header.html", (data)=> {
                $("header").html(data);
                //页面渲染完毕，执行交互操作
                this.headerHandle();
                this.cartHandle();  //加载购物车数据
                this.addListener(); //退出登录监听
            })
        },

        //加载尾部
        loadFooter() {
            $("footer").load("/html/html/include/footer.html");
        },

        //头部页面交互
        headerHandle() { 
            //键盘弹起获取提示建议
            $(".bottom-search-right :text").on("keyup", this.suggestHandle);
            //点击建议，将建议的文本填入输入框
            //事件委派
            $(".suggest").on("click", "div", (event)=>{
                // console.log("点击了")
                // console.log($(event.target).text())
                $(".bottom-search-right :text").val($(event.target).text());
                $(".suggest").hide();
            });
            //点击购物车图标跳转到购物车页面
            $("#btn-cart").on("click", ()=>{
                location.href = "/html/html/cart.html";
            })
            //滑动到一定距离导航条固定
            $(window).scroll( function() {
                if($(window).scrollTop() > 180) {
                    $(".bottom-list").css({
                        "position": "fixed",
                        "top": 0
                    });
                } else {
                    $(".bottom-list").attr({style: ""});
                }
            } );

            //用户登录显示用户邮箱
            const user = $.cookie("loginUser");
            // console.log(user);
            if(user) {
                $(".header-login").addClass("hidden").next(".userShow").removeClass("hidden");
                $(".userShow span").text(user);
            } else {
                $(".header-login").removeClass("hidden").next(".userShow").addClass("hidden");
            }
        },
        //搜索提示
        suggestHandle(event) {
            const   
                word = $(event.target).val(),
                url = `https://suggest.taobao.com/sug?code=utf-8&q=${word}&callback=?`;
            $.getJSON(url, (data)=>{
                // console.log(data)
                let html = "";
                data.result.forEach((curr)=>{
                    html += `<div style="text-align: left">${curr[0]}</div>`;
                })
                $(".suggest").html(html);
                //先显示隐藏的div
                $(".suggest").show();
            });
        },
        //购物车数据
        cartHandle() {
            const cart = $.cookie("cart") || [];
            let sum = 0;
            $.each(cart, (index, curr)=>{
                sum += curr.amount;
            });
            
            if(sum > 99) {
                $("#btn-cart span").text("99+");
                return;
            }
            $("#btn-cart span").text(sum);
        },
        //退出登录监听
        addListener() {
            $(".userShow a:last").on("click", this.quitLogin);
        },
        quitLogin() {
            $.removeCookie("loginUser", {path: "/"});
            $(".header-login").removeClass("hidden").next(".userShow").addClass("hidden");
        }
    });

    return new HeaderAndFooter();
});