require(["config"], function() {
    require(["jquery", "load", "cookie", "zoom"], function($) {
        function Detail() {
            this.render();
            this.addListener();

            // 配置 cookie 自动在JS值与JSON值之间转换
            $.cookie.json = true;
        }

        $.extend(Detail.prototype, {
            //渲染商品详情
            render() {
                const _id = location.search.slice(location.search.lastIndexOf("=")+1);    //获取查询字符串

                $.getJSON("http://rap2api.taobao.org/app/mock/120044/api/brand/list", (data)=>{
                    const currPro = data.res_body.list[_id-1];
                    
                    $("div.m-d-r-detail .m-d-r-d-id").text(currPro.id);  //商品id
                    $("div.m-d-right h4 b").text(currPro.title);    //商品名
                    $("div.m-d-right p span").text(currPro.desc);  //商品描述
                    $("div.m-d-r-detail .m-d-r-d-price b").text(currPro.price);  //商品价格
                    $("div.m-header em").text(currPro.title);

                    //放大镜
                    $(".zoom-img").attr({src: currPro.imgs[0].middleImg, "data-zoom-image": currPro.imgs[0].bigImg});  //中图

                    $.each(currPro.imgs, (index, curr)=>{
                        $("div.small-img a").eq(index).attr({"data-image": curr.middleImg, "data-zoom-image": curr.bigImg});
                        $("img", $("div.small-img a").eq(index)).attr({src: curr.smallImg});  //小图
                    });
                    $(".zoom-img").elevateZoom({
						gallery:'gal1',
						cursor: 'pointer',
						galleryActiveClass: 'active'
                    }); 
                    
                    //给小图绑定滑入事件
                    $(".small-img a").hover((event)=>{
                        const src = $(event.target).parent("a");
                        // console.log(src)
                        const index = $(".small-img a").index(src);
                        // console.log(index)
                        $(".zoom-img").attr({src: currPro.imgs[index].middleImg, "data-zoom-image": currPro.imgs[index].bigImg});  //中图
                    },()=>{});
                });
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