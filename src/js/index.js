require(["config"], function() {
    require(["jquery", "load"], function($) {
        /** 面向过程轮播图
        let 
            currIndex = 1,
            nextIndex = 2;
        
            function move() {
                $(`.slider-list li:nth-child(${currIndex})`).fadeOut(1000);
                $(`.slider-list li:nth-child(${nextIndex})`).fadeIn(1000);

                currIndex = nextIndex;
                nextIndex++;
                if(nextIndex > $(".slider-list li").length) {
                    nextIndex = 1;
                }
            }

            let timer = setInterval(move, 3000);

            $(".slider").on("mouseenter",()=>{
                clearInterval(timer);
            })
            $(".slider").on("mouseleave",()=>{
                timer = setInterval(move, 3000);
            }) */

        //面向对象轮播图
        const Slider = {
            lis: $("li", $(".slider-list")),    //所有轮播图片
            currIndex: 0,
            nextIndex: 1,
            circle: $("span", $(".pointer")),      //所有小圆点
            prev: $(".prev"),
            next: $(".next"),
            timer: null,        //给计时器一个初值

            move() {
                this.lis.eq(this.currIndex).fadeOut(400);
                this.lis.eq(this.nextIndex).fadeIn(400);

                this.circle.eq(this.currIndex).removeClass("current");
                this.circle.eq(this.nextIndex).addClass("current");

                this.currIndex = this.nextIndex;
                this.nextIndex++;
                if(this.nextIndex > this.lis.length - 1) {
                    this.nextIndex = 0;
                }
            },
            //自动播放
            autoPlay() {
                this.timer = setInterval(this.move.bind(this), 3000);      //注意this指向，划重点
            },

            addListener() {
                //鼠标滑入停止轮播，滑出继续
                $(".slider").hover(()=>{            //hover()方法第一个参数是鼠标滑入的回调函数，第二个参数是滑出的回调参数
                    clearInterval(this.timer);
                }, ()=>{
                    this.autoPlay();
                });
                //点击小圆点切换指定页面
                $(".pointer").on("mouseover", "span", (event)=>{
                    let src = $(event.target);
                    this.nextIndex = src.index();   //index()方法获取当前源在同类型元素中的下标
                    this.move();
                });
                //点击前后键切换页面
                $(".prev").on("click", ()=>{
                    this.nextIndex = this.currIndex - 1;
                    if(this.nextIndex < 0)
                        this.nextIndex = this.lis.length - 1;
                    this.move();
                });
                $(".next").on("click", ()=>{
                    this.move();
                });
            }
        };

        Slider.addListener();
        Slider.autoPlay();

        /*//点击跳转到列表页面传入数据：品牌类别和商家名字
        function Brands() {
            this.addListener();
        };

        $.extend(Brands.prototype, {
            addListener() {
                $("div.brand-down .b-d-left a").on("click", this.brandHandle);
                $("div.brand-down .b-d-right a").on("click", this.brandHandle);
            },
            //处理品牌数据
            brandHandle(event) {
                var src = $(event.target);
                const 
                    brand = src.parents("div.brand").find(".brand-up-header p a").text(),   //品牌
                    merchant = src.children("h4").text();   //品牌商家的名字
                console.log(brand, merchant)
                $.getJSON(`http://localhost:8080/html/html/list.html?brand=${brand}&merchant=${merchant}`);
            }
        });

        new Brands();

        // console.log($("div.brand .b-d-left a").parents("div.brand").find(".brand-up-header p a").text());
        // console.log($("div.brand .b-d-left a").children("h4").text())*/
    });
});