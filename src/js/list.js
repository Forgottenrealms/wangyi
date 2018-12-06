require(["config"], function() {
    require(["jquery", "template", "load"], function($, template) {
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
                    console.log(html)
                    $(".m-list").append(html);
                });
            }
        })
        new List();
    });
});