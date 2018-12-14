require(["config"], function() {
    require(["jquery", "template", "load", "cookie"], function($, template) {
        function Payment() {
            this.render();
            this.addListener();
            // 配置 cookie 自动在JS值与JSON值之间转换
            $.cookie.json = true;
        }

        $.extend(Payment.prototype, {
            render() {
                //渲染商品数据
                const payPro = $.cookie("payPro");
                const html = template("payment-template", {payPro: payPro});
                // console.log(payPro)
                // console.log(html)
                $(".list-content").append(html);    //商品详情

                let totalMoney = 0;
                $.each(payPro, (index, curr)=>{
                    console.log(curr.subtotal)
                    totalMoney += Number(curr.subtotal);
                })
                console.log(totalMoney)
                $(".pay .right p:first span b").text(totalMoney.toFixed(2)); //合计
                $(".pay .right p:eq(2) span b").text(totalMoney.toFixed(2)); //应付总额

                //渲染收货地址
                const 
                    url1 = "http://route.showapi.com/1149-1?showapi_appid=81239&showapi_sign=ff653291cfc7477db2982b431114b5be&level=1&page=1",
                    url2 = "http://route.showapi.com/1149-1?showapi_appid=81239&showapi_sign=ff653291cfc7477db2982b431114b5be&level=1&page=2";

                    function promiseAjax(url) {
                        return new Promise(function(resolve, reject) {
                            $.ajax({
                                type: "get",
                                url,
                                dataType: "json",
                                success: function(data){resolve(data)},
                                error: function(err){reject(err);}
                            })
                        })
                    }

                Promise.all([promiseAjax(url1), promiseAjax(url2)]).then(function(array) {
                    // console.log(array)
                    let html = "<option value='-1'>请选择</option>";
                    $.each(array[0].showapi_res_body.data.concat(array[1].showapi_res_body.data), (index, curr)=>{
                        html += `<option value="${curr.id}">${curr.areaName}</option>`;
                    });
                    $("#province").html(html);
                });
            },
            //同步请求ajax数据
            // promiseAjax(url) {
            //     return new Promise(function(resolve, reject) {
            //         $.ajax({
            //             type: "get",
            //             url,
            //             dataType: "json",
            //             success: function(data){resolve(data)},
            //             error: function(err){reject(err);}
            //         })
            //     })
            // },
            addListener() {
                $("#province").on("change", this.loadCity);
                $("#city").on("change", this.loadCounty);
            },
            loadCity() {
                function promiseAjax(url) {
                    return new Promise(function(resolve, reject) {
                        $.ajax({
                            type: "get",
                            url,
                            dataType: "json",
                            success: function(data){resolve(data)},
                            error: function(err){reject(err);}
                        })
                    })
                }

                const 
                    provinceId = $("#province").val(),
                    url1 = `http://route.showapi.com/1149-2?showapi_appid=81239&showapi_sign=ff653291cfc7477db2982b431114b5be&parentId=${provinceId}`;
                    
                //如果选择了省份
                if(provinceId != -1) {
                    Promise.all([promiseAjax(url1)]).then(function(array) {
                        console.log(array)
                        let html = "<option value='-1'>请选择</option>";
                        $.each(array[0].showapi_res_body.data, (index, curr)=>{
                            html += `<option value="${curr.id}">${curr.areaName}</option>`;
                        });
                        $("#city").html(html);
                    });
                }
            },
            loadCounty() {
                function promiseAjax(url) {
                    return new Promise(function(resolve, reject) {
                        $.ajax({
                            type: "get",
                            url,
                            dataType: "json",
                            success: function(data){resolve(data)},
                            error: function(err){reject(err);}
                        })
                    })
                }

                const 
                    cityId = $("#city").val(),
                    url2 = `http://route.showapi.com/1149-2?showapi_appid=81239&showapi_sign=ff653291cfc7477db2982b431114b5be&parentId=${cityId}`;

                //如果选择了城市
                if(cityId != -1) {
                    Promise.all([promiseAjax(url2)]).then(function(array) {
                        // console.log(array)
                        let html = "<option value='-1'>请选择</option>";
                        $.each(array[0].showapi_res_body.data, (index, curr)=>{
                            html += `<option value="${curr.id}">${curr.areaName}</option>`;
                        });
                        $("#county").html(html);
                    });
                }
            }
        });

        new Payment();
    });
});