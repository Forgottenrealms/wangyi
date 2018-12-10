require(["config"], function() {
    require(["jquery", "template", "load"], function($, template) {
        //模板引擎渲染数据
        function List() {
            this.render();
        }
        // 扩展原型
        $.extend(List.prototype, {
            render() {
                //加载并渲染数据
                $.getJSON("http://rap2api.taobao.org/app/mock/120044/api/brand/list", (data)=>{
                    // console.log(data.res_body.list)
                    const html = template("brand-template", {brand: data.res_body.list});
                    // console.log(html)
                    $(".m-list").append(html);
                });
            }
        })
        new List();


        //更改列表页面中的品牌名字
        const querystring = location.search.slice(1).split("&");    //获取查询字符串
        let 
            arr = querystring,
            brands = {};
        $.each(arr, function(index, curr){
            let 
                a = curr.slice(0, curr.indexOf("=")),
                b = decodeURIComponent(curr.slice(curr.indexOf("=") + 1));
            brands[a] = b;
        });

        $("div.m-header a b").text(brands.brand);
        $("div.m-header i").text(brands.merchant);
        $(".m-b-c-center h4").text(brands.merchant);
        $(".m-result h4 span").text('"' + brands.merchant + '"');
    });
});