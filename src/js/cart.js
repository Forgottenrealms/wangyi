require(["config"], function() {
    require(["jquery", "template", "cookie", "load"], function($, template) {
        function Cart() {
            this.cart = [];
            this.payPro = [];
            // 配置 cookie 自动在JS值与JSON值之间转换
            $.cookie.json = true;

            this.render();
            this.addListener();
        }

        $.extend(Cart.prototype, {
            //渲染购物车数据
            render() {
                //查看用户是否登录
                const userlogin = $.cookie("loginUser");
                if(userlogin) {
                    $("span.btn-login").attr({style: "visibility: hidden;"});
                } else {
                    $("span.btn-login").attr({style: "visibility: visible;"});
                }

                const cart = this.cart = $.cookie("cart") || [];
                //购物车为空
                if(cart.length === 0) {
                    $(".empty-cart").removeClass("hidden").next(".products").addClass("hidden"); 
                    return;     //如果购物车为空，结束函数执行，避免再执行渲染操作
                } else {
                    $(".empty-cart").addClass("hidden").next(".products").removeClass("hidden");
                }
                //不为空，渲染模板
                const html = template("cart-template", {"cart": cart});
                $("div.products").html(html);
            },

            //添加事件监听
            addListener() {
                //继续逛和登录
                $(".empty-cart").on("click", ".btn-shopping", $.proxy(this.goShopping, this));
                $(".empty-cart").on("click", ".btn-login", $.proxy(this.goLogin, this));
                //删除商品
                $(".product-oprate").on("click", ".remove-pro", $.proxy(this.removeProduct, this));
                //数量加减
                $(".product-number").on("click", ".less, .more", $.proxy(this.changeNumber, this));
                //修改数量
                $(".product-number").on("blur", "input", $.proxy(this.changeNumber, this));
                //全选
                $(".check-all .check").on("click", $.proxy(this.checkAll,this));
                //已选
                $(".pay .check").on("click", $.proxy(this.checkSome,this));
                //部分选中
                $(".products").on("click", ".choice-box input", $.proxy(this.checkPart, this));
                //合计
                $(".m-cart").on("click", ".less, .more, .checked-all, .checked-part, .checked-some", $.proxy(this.calcTotalMoney,this));
                //下单
                $(".pay-alipay").on("click", $.proxy(this.payment,this));
            },


            //继续逛
            goShopping() {
                location.href = "/html/index.html";
            },
            goLogin() {
                location.href = "/html/html/loginAndRegister.html";
            },
            //删除单个商品
            removeProduct(event) {
                const 
                    src = $(event.target),
                    parent = src.parents(".single-product"),  //要删除的商品行
                    id = $(".product-id", parent).text();     //要删除的商品id
                //删除cookie
                this.cart = this.cart.filter(curr=>curr.id!=id);
                // console.log(this.cart)
                $.cookie("cart", this.cart, {expires: 7, path: "/"});
                //移除节点
                parent.remove();

                this.calcTotalMoney();

                //购物车为空
                const cart = this.cart = $.cookie("cart") || [];
                if(cart.length === 0) {
                    $(".empty-cart").removeClass("hidden").next(".products").addClass("hidden"); 
                    return;     //如果购物车为空，结束函数执行
                }
            },
            //修改商品数量
            changeNumber(event) {
                const 
                    src = $(event.target),
                    parent = src.parents(".single-product"),  //要修改的商品行
                    id = $(".product-id", parent).text();     //要修改的商品id

                const product = this.cart.filter(curr=>curr.id == id)[0];  //在数组中要修改的商品

                if(src.is(".less")) {
                    if(product.amount <= 1) {
                        alert("商品数量最少为1");
                        return;
                    }
                    product.amount--;
                } else if(src.is(".more")) {
                    if(product.amount >= 99) {
                        alert("商品数量最多为99");
                        return;
                    }
                    product.amount++;
                } else if(src.is("input")) {
                    const 
                        reg = /^[1-9]\d{0,1}$/,
                        number = src.val();
                        console.log(number)
                    if(!reg.test(number)) {
                        $(".product-number input").val(product.amount);
                        alert("商品数量最少为1件，最多为99件");
                        return;
                    }
                    product.amount = Number(number);
                }

                $.cookie("cart", this.cart, {expires: 7, path: "/"});
                $(".product-number input", parent).val(product.amount);     //数量
                $(".product-calc span", parent).text(product.amount * product.price);
            },
            //全选
            checkAll(event) {
                const 
                    src = $(event.target),
                    status = src.prop("checked");
                $(".products .choice-box input").prop("checked", status);
                $(".pay .check").prop("checked", status);

                //渲染选中商品数
                const checkedNumber = $(".products .single-product input:checked").length;
                $(".pay .pay-check span").text(checkedNumber);
            },
            //已选
            checkSome(event) {
                const 
                    src = $(event.target),
                    status = src.prop("checked");
                    // console.log(src)
                    // console.log(status)
                $(".products .choice-box input").prop("checked", status);
                $(".check-all .check").prop("checked", status);

                //渲染选中商品数
                const checkedNumber = $(".products .single-product input:checked").length;
                $(".pay .pay-check span").text(checkedNumber);
            },
            //部分选中
            checkPart() {
                const checkedNumber = $(".products .single-product input:checked").length;
                $(".check-all .check").prop("checked", checkedNumber === this.cart.length);
                $(".pay .check").prop("checked", checkedNumber === this.cart.length);

                //渲染选中商品数
                $(".pay .pay-check span").text(checkedNumber);
            },
            //合计
            calcTotalMoney() {
                let sum = 0;
                $(".checked-part:checked").parents(".single-product").each((index, curr)=>{
					sum += Number($(curr).find(".product-calc span").text());
                });
                $(".pay-count span").text(sum.toFixed(2));  //应付总额
                $(".pay-clac p:first span").text(sum.toFixed(2));   //商品合计
            },
            //下单
            payment() {
                const checkedPro = $(".products .single-product input:checked").parents(".single-product");    //选中商品
                // console.log(checkedPro);
                $.each(checkedPro, (index, curr)=>{
                    const single_pro = {
                        title : $(".product-info p", curr).text(),
                        img : $(".product-img img", curr).attr("src"),
                        price : $(".product-price span", curr).text(),
                        number : $(".product-number input", curr).val(),
                        subtotal : $(".product-calc span", curr).text()
                    };
                    this.payPro.push(single_pro);
                });
                // console.log(this.payPro)
                $.cookie("payPro", this.payPro, {expires: 7, path: "/"});
                // console.log($.cookie("payPro"))
                location.href = "/html/html/payment.html";
            }
        });

        new Cart();
    });
});