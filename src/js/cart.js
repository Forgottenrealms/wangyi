require(["config"], function() {
    require(["jquery", "template", "cookie", "load"], function($, template) {
        function Cart() {
            // 配置 cookie 自动在JS值与JSON值之间转换
            $.cookie.json = true;

            this.render();
        }

        $.extend(Cart.prototype, {
            //渲染购物车数据
            render() {
                const cart = $.cookie("cart");
                // console.log(cart)
                // console.log(typeof cart)
                const html = template("cart-template", {"cart": cart});

                $("div.products").html(html);
            }
        });

        new Cart();
    });
});