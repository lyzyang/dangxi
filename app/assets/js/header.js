
$(function() {
	get_main();
});

//主体内容
function get_main(){
	$.get("/main", function(data) {
	   $("#main_container").html(data);
    });
}

//更多页面
function get_more_info(infoTypeId,advertSetId){
	var params = {
		"infoTypeId":infoTypeId,
		"advertSetId":advertSetId
	};
	$.get("/more_info", params, function(data) {
	   $("#main_container").html(data);
    });
}

//详细内容
function get_item_info(infoId){
	var params = {
		"infoId":infoId
	};
	$.get("/item_info", params, function(data) {
	   $("#main_container").html(data);
    });
}

//更多页面
function get_more_fund(fundTypeId,advertSetId){
	var params = {
		"fundTypeId":fundTypeId,
		"advertSetId":advertSetId
	};
	$.get("/more_fund", params, function(data) {
	   $("#main_container").html(data);
    });
}

//详细内容
function get_item_fund(fundId){
	var params = {
		"fundId":fundId
	};
	$.get("/item_fund", params, function(data) {
	   $("#main_container").html(data);
    });
}
    
  
function get_organization(){
	//$.get("/organization_info",  function(data) {
	//   $("#main_container").html(data);
    //});
} 
   
function get_genealogy(){
	$.get("/seeFamilyMembers_html",  function(data) {
	   $("#main_container").html(data);
    });
} 
    
    
    
//设为首页
function SetHome(obj,url){
    try{
        obj.style.behavior='url(#default#homepage)';
        obj.setHomePage(url);
    }catch(e){
        if(window.netscape){
            try{
                netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
            }catch(e){
                alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入'about:config'并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
            }
        }else{
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【"+url+"】设置为首页。");
        }
    }
}
                     
//收藏本站
function AddFavorite(title, url) {
    try {
        window.external.addFavorite(url, title);
    }
    catch (e) {
        try {
            window.sidebar.addPanel(title, url, "");
        }
        catch (e) {
            alert("抱歉，您所使用的浏览器无法完成此操作。\n\n加入收藏失败，请使用Ctrl+D进行添加");
        }
    }
}


(function($) {
	$.fn.extend({
		"slideUp":function(value){
			var docthis = this;
			//默认参数
			value=$.extend({
				 "li_h":"30",
				 "time":2000,
				 "movetime":1000
			},value);
			
			//向上滑动动画
			function autoani(){
				$("li:first",docthis).animate({"margin-top":-value.li_h},value.movetime,function(){
					$(this).css("margin-top",0).appendTo(".line");
				});
			}
			
			//自动间隔时间向上滑动
			var anifun = setInterval(autoani,value.time);
			
			//悬停时停止滑动，离开时继续执行
			$(docthis).children("li").hover(function(){
				clearInterval(anifun);			//清除自动滑动动画
			},function(){
				anifun = setInterval(autoani,value.time);	//继续执行动画
			});
		}	
	});

    $.fn.Slide = function(options) {
        var defaults = {
            item: "slide-item",
            nav: "slide-nav",
            nowClass: "nownav",
            loading: "slide-loading"
          },
        options = options || {};
        options = $.extend(defaults, options);
        var cont = $(this),
        item = cont.find("." + options.item),
        nav = cont.find("." + options.nav),
        curr = options.nowClass,
        len = item.length,
        width = item.width(),
        html = "",
        index = order = 0,
        timer = null,
        lw = "-" + width + "px",
        rw = width + "px",
        newtimer,
        ld = cont.find("." + options.loading);
        item.each(function(i) {
            $(this).css({
                left: i === index ? 0 : (i > index ? width + 'px': '-' + width + 'px')
            });
            html += '<a href="javascript:">' + (i + 1) + '</a>';
        });
        $("#slide").hover(function() {
            $('#next').fadeIn();
            $('#prev').fadeIn();
        },
        function() {
            $('#next').fadeOut();
            $('#prev').fadeOut();
        });
        nav.html(html);
        var navitem = nav.find("a");
        navitem.eq(index).addClass(curr);
        function anim(index, dir) {
            loading();
            if (order === len - 1 && dir === 'next') {
                item.eq(order).stop(true, false).animate({
                    left: lw
                });
                item.eq(index).css({
                    left: rw
                }).stop(true, false).animate({
                    left: 0
                });
            } else if (order === 0 && dir === 'prev') {
                item.eq(0).stop(true, false).animate({
                    left: rw
                });
                item.eq(index).css({
                    left: lw
                }).stop(true, false).animate({
                    left: 0
                });
            } else {
                item.eq(order).stop(true, false).animate({
                    left: index > order ? lw: rw
                });
                item.eq(index).stop(true, false).css({
                    left: index > order ? rw: lw
                }).animate({
                    left: 0
                });
            }
            order = index;
            navitem.removeClass(curr).eq(index).addClass(curr);
        }
        function next() {
            index = order >= len - 1 ? 0 : order + 1;
            _stop();
            ld.stop(true, true).animate({
                "width": 0
            },
            0);
            anim(index, 'next');
            timer = setInterval(next, 5000);
        }
        function prev() {
            index = order <= 0 ? len - 1 : order - 1;
            _stop();
            ld.stop(true, true).animate({
                "width": 0
            },
            0);
            anim(index, 'prev');
            timer = setInterval(next, 5000);
        }
        function auto() {
            loading();
            timer = setInterval(next, 5000);
        }
        function _stop() {
            clearInterval(timer);
        }
        function loading() {
            ld.css({
                
            });
            ld.animate({
                "width": "100%"
            },
            5000).animate({
                "width": 0
            },
            0);
        }
        return this.each(function() {
            auto();
            navitem.hover(function() {
                _stop();
                var i = navitem.index(this);
                if (/nownav/.test($(this).attr('class'))) {
                    return false;
                }
                if (newtimer) clearTimeout(newtimer);
                newtimer = setTimeout(function() {
                    _stop();
                    ld.stop(true, true).animate({
                        "width": 0
                    },
                    0);
                    anim(i, this);
                },
                250);
            },
            auto);
            $('#next').on('click', next);
            $('#prev').on('click', prev);
        });
    };
})(jQuery);
