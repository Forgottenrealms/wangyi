define(["jquery"], function($) {
    //构造函数
    function HeaderAndFooter() {
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
            })
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
        }
    });

    return new HeaderAndFooter();
});