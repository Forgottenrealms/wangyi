require(["config"], function() {
    require(["jquery", "load", "cookie"], function($) {
        function Detail() {
            this.render();
            this.addListener();

            // 配置 cookie 自动在JS值与JSON值之间转换
            $.cookie.json = true;
        }

        $.extend(Detail.prototype, {
            //渲染商品详情
            render() {
                const querystring = location.search.slice(1).split("&");    //获取查询字符串
                let 
                    arr = querystring,
                    detail = {};
                $.each(arr, function(index, curr){
                    let 
                        a = curr.slice(0, curr.indexOf("=")),
                        b = decodeURIComponent(curr.slice(curr.indexOf("=") + 1));
                    detail[a] = b;
                });
                // console.log(detail)

                $("div.big-img img").attr({src: detail.img + "&text=" + detail.text});  //大图
                $("div.small-img a img").attr({src: detail.img + "&text=" + detail.text});  //小图
                $("div.m-d-r-detail .m-d-r-d-id").text(detail.id);  //商品id
                $("div.m-d-right h4 b").text(detail.title);    //商品名
                $("div.m-d-right p span").text(detail.desc);  //商品描述
                $("div.m-d-r-detail .m-d-r-d-price b").text(detail.price);  //商品价格
            },

            //监听加入购物车
            addListener() {
                $("#add-to-cart").on("click", this.addToCartHandle);
                $("div.change-number").on("click", "span", this.changeNumber);
                $(".change-number input").on("blur", this.inputNumber);
            },

            //输入数量
            inputNumber() {
                var number = $(".change-number input").val();

                if(number <= 0) {
                    $(".change-number input").val(1);
                    alert("最少选购数量为1")
                } else if(number >= 100) {
                    $(".change-number input").val(99);
                    alert("最大选购数量为99")
                }
            },
            //加减数量
            changeNumber(event) {
                var 
                    change = $(event.target),
                    number = $(".change-number input").val();
                
                if(change.is(".less")) {
                    number--;
                    if(number <= 0) {
                        number = 1;
                        alert("最少选购数量为1");
                    }
                    $(".change-number input").val(number);
                } else if(change.is(".more")) {
                    number++;
                    if(number >= 100) {
                        number = 99;
                        alert("最大选购数量为99");
                    }
                    $(".change-number input").val(number);
                }
            },
            //加入购物车处理
            addToCartHandle() {
                const currProduct = {
                    id: parseFloat($("div.m-d-r-detail .m-d-r-d-id").text()),
                    img: $("div.big-img img").attr("src"),
                    title: $("div.m-d-right h4 b").text(),
                    desc: $("div.m-d-right p span").text(),
                    price: parseFloat($("div.m-d-r-detail .m-d-r-d-price b").text()).toFixed(2),
                    amount: parseFloat($(".change-number input").val())
                };
                console.log(currProduct)
                const cart = $.cookie("cart") || [];
                //判断cookie中是否已经有该商品
                const has = cart.some(curr=>{
                    if(curr.id == currProduct.id) {
                        curr.amount += currProduct.amount;
                        return true;    //存在返回true
                    }
                    return false;       //不存在返回false
                });

                //如果cookie中不存在
                if(!has) {
                    cart.push(currProduct);
                }
                $.cookie("cart", cart, {expires: 7, path: "/"});
            }
        })
       
        new Detail();
    });
});