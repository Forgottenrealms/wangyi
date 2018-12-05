require.config({
    baseUrl: "/",   //webserver根目录
    paths: {    //模块短名称路径配置
        jquery: "lib/jquery/jquery-1.12.4.min",  //jQuery短名称
        load: "js/loadHeaderAndFooter",  //加载头部和底部页面短名称
		template: "lib/art-template/template-web", // art-template
		cookie: "lib/jquery-plugins/jquery.cookie", // cookie插件
    }
});