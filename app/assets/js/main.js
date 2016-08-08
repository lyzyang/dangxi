
$(function() {

	//焦点图--begin
	$.ajax({
       url : "/focus_get",
       async : false,
       type : "get",
       dataType : "json",
       success : function(data) {
           $.each(data, function(k, v) {
		     	$("#focus_getByNum_1").append($('<li class="slide-item"><a href="#" onclick="get_item_info('+v.id+
		     		')"><img src="'+v.picture+'" alt="'+v.title+
		     		'"></a><div class="slide-txt"><div class="txt_bg"></div><a href="#">'+v.title+'</a></div></li>'));
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
    
    
    $.get("/info_getByType",{"typeId":1,"limit":10,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_1").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":2,"limit":2,"offset":0,"isPicture":1}, function(data) {
	    $.each(data.rows, function(k, v) {
	    	if(v.picture != undefined && v.picture != null && v.picture.length != 0 ){
	    		$("#info_getByType_2").append($('<div class="ays-item"><a href="#" onclick="get_item_info('+v.id+
	     			')"><div class="ays-item-pic fl"><img src="data:image/png;base64,'+v.picture+'" alt="'+v.title+
	     			'"/></div><div class="ays-item-txt fl"><h4><b>'+v.title+
	     			'：</b><strong>'+v.remark+'</strong></h4></div></a></div>'));
	    	}else{
	    		$("#info_getByType_2").append($('<div class="ays-item"><a href="#" onclick="get_item_info('+v.id+
	     			')"><div class="ays-item-pic fl"><img src="/public/images/main/slide'+k+'.jpg" alt="'+v.title+
	     			'"/></div><div class="ays-item-txt fl"><h4><b>'+v.title+
	     			'：</b><strong>'+v.remark+'</strong></h4></div></a></div>'));
	    	}
	    });
    });
    
    $.get("/info_getByType",{"typeId":3,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_3").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":4,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_4").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":5,"limit":5,"offset":0}, function(data) {
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_5").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    
    $.get("/fund_getStat",{"typeId":1}, function(data) {
    	var option1 = {
		    title: {text: '基金总览',subtext: '元'},
		    tooltip: {trigger: 'axis'},
		    xAxis: {type: 'value'},
		    yAxis: {
		        type: 'category',
		        data: ['总收入','总支出','总金额']
		    },
		    series: [{
		        name: '总共',type: 'bar',
		        data: [data.all_in, data.all_out, data.all_total]
		    }]
		};
    	echarts.init(document.getElementById('ftc1_1')).setOption(option1);
    	
    	
		var month_stat_xData = new Array();
		var month_stat_yData = new Array();
		$.each(data.month_stat, function(k, v) {
			month_stat_xData.push(v[0]);
			month_stat_yData.push(v[1]);
		});
    	var option2 = {
		    title : {text: '总金额月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_xData
	        }],
		    series : [{
	            name:'总金额',
	            type:'bar',
	            data:month_stat_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc1_2')).setOption(option2);
	    
	    
	    var month_stat_in_xData = new Array();
		var month_stat_in_yData = new Array();
		$.each(data.month_stat_in, function(k, v) {
			month_stat_in_xData.push(v[0]);
			month_stat_in_yData.push(v[1]);
		});
    	var option3 = {
		    title : {text: '收入月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_in_xData
	        }],
		    series : [{
	            name:'收入',
	            type:'bar',
	            data:month_stat_in_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc1_3')).setOption(option3);
	    
	    
	    var month_stat_out_xData = new Array();
		var month_stat_out_yData = new Array();
		$.each(data.month_stat_out, function(k, v) {
			month_stat_out_xData.push(v[0]);
			month_stat_out_yData.push(v[1]);
		});
    	var option4 = {
		    title : {text: '支出月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_out_xData
	        }],
		    series : [{
	            name:'支出',
	            type:'bar',
	            data:month_stat_out_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc1_4')).setOption(option4);
    });



    $.get("/fund_getStat",{"typeId":2}, function(data) {
    	var option1 = {
		    title: {text: '基金总览',subtext: '元'},
		    tooltip: {trigger: 'axis'},
		    xAxis: {type: 'value'},
		    yAxis: {
		        type: 'category',
		        data: ['总收入','总支出','总金额']
		    },
		    series: [{
		        name: '总共',type: 'bar',
		        data: [data.all_in, data.all_out, data.all_total]
		    }]
		};
    	echarts.init(document.getElementById('ftc2_1')).setOption(option1);
    	
    	
		var month_stat_xData = new Array();
		var month_stat_yData = new Array();
		$.each(data.month_stat, function(k, v) {
			month_stat_xData.push(v[0]);
			month_stat_yData.push(v[1]);
		});
    	var option2 = {
		    title : {text: '总金额月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_xData
	        }],
		    series : [{
	            name:'总金额',
	            type:'bar',
	            data:month_stat_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc2_2')).setOption(option2);
	    
	    
	    var month_stat_in_xData = new Array();
		var month_stat_in_yData = new Array();
		$.each(data.month_stat_in, function(k, v) {
			month_stat_in_xData.push(v[0]);
			month_stat_in_yData.push(v[1]);
		});
    	var option3 = {
		    title : {text: '收入月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_in_xData
	        }],
		    series : [{
	            name:'收入',
	            type:'bar',
	            data:month_stat_in_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc2_3')).setOption(option3);
	    
	    
	    var month_stat_out_xData = new Array();
		var month_stat_out_yData = new Array();
		$.each(data.month_stat_out, function(k, v) {
			month_stat_out_xData.push(v[0]);
			month_stat_out_yData.push(v[1]);
		});
    	var option4 = {
		    title : {text: '支出月度变化',subtext: '元'},
		    tooltip : {trigger: 'axis'},
		    yAxis : [{type : 'value'}],
		    xAxis : [{
	            type : 'category',
	            data : month_stat_out_xData
	        }],
		    series : [{
	            name:'支出',
	            type:'bar',
	            data:month_stat_out_yData
	        }]
		};
	    echarts.init(document.getElementById('ftc2_4')).setOption(option4);
    });
});


function fundTabOption(tabGroup,n){
	var oUl = document.getElementById(tabGroup);
	var oLi = oUl.getElementsByTagName('li');
	for(var i = 0; i<oLi.length; i++){
		k = i+1;
		if(k==n){
			$(oLi[i]).addClass('selected');
			document.getElementById(tabGroup+'_Content_'+k).style.display = 'block';
		}else{
			$(oLi[i]).removeClass('selected');
			document.getElementById(tabGroup+'_Content_'+k).style.display = 'none';
		}
	}
}


