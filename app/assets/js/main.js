
$(function() {

	//焦点图--begin
	$.ajax({
       url : "/focus_get",
       async : false,
       type : "get",
       dataType : "json",
       success : function(data) {
           $.each(data, function(k, v) {
		     	$("#focus_getByNum_1").append(
		     		$('<li class="slide-item"><a href="#" onclick="get_item_info('+v.id+')"><img src="'+v.picture+'" alt="'+v.title+'"></a><div class="slide-txt"><div class="txt_bg"></div><a href="#">'+v.title+'</a></div></li>')
		     	);
		     });
		    $("#slide").Slide();
       }
    });
    //焦点图--end

    
    $.get("/info_getByType",{"typeId":1,"limit":10,"offset":0}, function(data) {
    	$("#header_info_getByTypeName_1").html("<i class='icon tb-news'></i>"+data.infoTypeName);
    	$("#info_getByTypeName_1").html(data.infoTypeName);
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_1").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":2,"limit":2,"offset":0,"isPicture":1}, function(data) {
    	$("#header_info_getByTypeName_2").html("<i class='icon tb-data'></i>"+data.infoTypeName);
    	$("#info_getByTypeName_2").html(data.infoTypeName);
	    $.each(data.rows, function(k, v) {
	    	if(v.picture != undefined && v.picture != null && v.picture.length != 0 ){
	    		$("#info_getByType_2").append($('<div class="ays-item"><a href="#" onclick="get_item_info('+v.id+
	     			')"><div class="ays-item-pic fl"><img src="'+v.picture+'" alt="'+v.title+
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
    	$("#header_info_getByTypeName_3").html("<i class='icon tb-forum'></i>"+data.infoTypeName);
    	$("#info_getByTypeName_3").html(data.infoTypeName);
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_3").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":4,"limit":5,"offset":0}, function(data) {
    	$("#header_info_getByTypeName_4").html("<i class='icon tb-energy'></i>"+data.infoTypeName);
    	$("#info_getByTypeName_4").html(data.infoTypeName);
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_4").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    $.get("/info_getByType",{"typeId":5,"limit":5,"offset":0}, function(data) {
    	$("#header_info_getByTypeName_5").html("<i class='icon tb-prodcuct'></i>"+data.infoTypeName);
    	$("#info_getByTypeName_5").html(data.infoTypeName);
	    $.each(data.rows, function(k, v) {
	     	$("#info_getByType_5").append($('<li><a href="#" onclick="get_item_info('+v.id+')"><i class="square"></i><strong>'+
	     		v.title+'</strong></a></li>'));
	    });
    });
    
    
    $.get("/fund_getStat",{"typeId":1}, function(data) {
    	$("#header_fund_getByTypeName_1").html("<i class='icon tb-activity'></i>"+data.fundTypeName);
    	$("#fund_getStatName_1").html(data.fundTypeName);
    	
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
    	$("#header_fund_getByTypeName_2").html("<i class='icon tb-electric'></i>"+data.fundTypeName);
    	$("#fund_getStatName_2").html(data.fundTypeName);
    	
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


