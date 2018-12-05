require(["config"], function() {
    require(["jquery", "load"], function($) {
        let 
            currIndex = 1,
            nextIndex = 2;
        
            function move() {
                $(`.slider-list li:nth-child(${currIndex})`).css({"display" : "none"}).fadeOut(400);
                $(`.slider-list li:nth-child(${nextIndex})`).css({"display" : "block"}).fadeIn(400);

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
            })
    });
});