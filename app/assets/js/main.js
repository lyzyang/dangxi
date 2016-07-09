
$(function() {

	//焦点图--begin
	$.ajax({
       url : "/focus_getByNum",
       async : false,
       type : "get",
       data : {"limit":5},
       dataType : "json",
       success : function(data) {
           $.each(data, function(k, v) {
		     	$("#focus_getByNum_1").append($('<li class="slide-item"><a href="/info_get?id='+v.id+
		     		'" target="blank"><img src="data:image/png;base64,'+v.picture+'" alt="'+v.title+
		     		'"></a><div class="slide-txt"><div class="txt_bg"></div><a href="/info_get?id='+
		     		v.id+'" target="_blank">'+v.title+'</a></div></li>'));
		   });
       }
    });
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
    $("#slide").Slide();
    //焦点图--end
    
    //点击更多
    $(".more").click(function() {
    	var params = {
    		"offset":0,
    		"limit":10
    	};
		$.get("/more",params, function(data) {
		   $(".container").html(data);
	    });
    });
    
    $.get("/info_getByType",{"typeId":1,"limit":10,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_1").append($('<li><a href="/info_get?id='+v.id+'"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":2,"limit":2,"offset":0,"isPicture":1}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_2").append($('<div class="ays-item"><a href="/info_get?id='+v.id+
	     	'"><div class="ays-item-pic fl"><img src="data:image/png;base64,'+v.picture+'" alt="'+v.title+
	     	'"/></div><div class="ays-item-txt fl"><h4><b>'+v.title+
	     	'：</b><strong>'+v.remark+'</strong></h4></div></a></div>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":3,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_3").append($('<li><a href="/info_get?id='+v.id+'"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":4,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_4").append($('<li><a href="/info_get?id='+v.id+'"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":5,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_5").append($('<li><a href="/info_get?id='+v.id+'"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    
    //$.get("/fund_getByType",{"typeId":1,"limit":5}, function(data) {
	//    $.each(data, function(k, v) {
	//     	$("#fund_getByType_1").append($('<li><a href="/fund_get?id='+v.id+'"><i class="square"></i><strong>'+
	//     		v.title+'</strong></a></li>'));
	//    });
    //});
     //$.get("/fund_getByType",{"typeId":2,"limit":5}, function(data) {
	//    $.each(data, function(k, v) {
	//     	$("#fund_getByType_2").append($('<li><a href="/fund_get?id='+v.id+'"><i class="square"></i><strong>'+
	//     		v.title+'</strong></a></li>'));
	//    });
   // });
    var myChart1 = echarts.init(document.getElementById('fund_getByType_1'));
    var myChart2 = echarts.init(document.getElementById('fund_getByType_2'));
    var option = {
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    myChart1.setOption(option);
    myChart2.setOption(option);
    
   
    
});


