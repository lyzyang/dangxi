//工具栏按钮
var familyMembers_custom ={
    Init: function () {
    	
    	$('#familyMembers_tree_life').select2({
      		placeholder: "请选择",
      		width: "130px"
    	});
    	
       //定义按钮事件
	    $("#familyMembers_tree_search").click(function() {
	    	 var name = $('#familyMembers_tree_name').val()
	        familyMembers_tree_search(null,name);
	     });
	    $("#familyMembers_tree_clear").click(function() {
	    	 $('#familyMembers_tree_id').val("");
	        $("#familyMembers_tree_name").val("");
	        $('#familyMembers_tree_life').val(null).trigger('change');
	     });
	}
}

//重名选择栏
var familyMembers_select_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_select_form').bootstrapValidator({
	    	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	sid: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
		}).on('success.form.bv', function(e) {
	        $.get("/familyMembers_get_life", $("#familyMembers_select_form").serialize(), function(data) {
	        		var select_name = $('#familyMembers_select option:selected').text();
	        		var sname = select_name.split('-');
	        		$('#familyMembers_tree_name').val(sname[1]);
	        		
	            	if (data.type == 'tree') {
	                	$('#familyMembers_select_dialog').dialog("close");
	                	familyMembers_tree_init(sname[1],[data.data]);
	            	}else if(data.type == 'empty'){
	            		$('#familyMembers_select_dialog').dialog("close");
	                	familyMembers_tree_init();
	            	}else{
	            		$.onecloud.errorShow(data.mess);
	            	}
	          });
	    });
	    $('#familyMembers_select_dialog').dialog({
	        autoOpen: false,
	        width: 350,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_select_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (data){
    	 $('#familyMembers_select_form')[0].reset();
        $('#familyMembers_select_dialog').dialog( "option", "title", "同名选择");
        $('#familyMembers_select_dialog').dialog('open');
        $('#familyMembers_select').select2({
      			placeholder: "请选择",
            	data: data
    	 });
    }
};

//查询树状图
var familyMembers_tree_search = function(sid,name){
	  var ser = {
	  		"sid": sid,
	  		"name": name,
	  		"life": $('#familyMembers_tree_life').val()
	  };
	  $.get("/familyMembers_get_life", ser, function(data) {
        	if (data.type == 'tree') {
        		var sname = $('#familyMembers_tree_name').val();
            	familyMembers_tree_init(sname,[data.data]);
        	}else if(data.type == 'empty'){
            	familyMembers_tree_init();
        	}else if(data.type == 'select'){
        		 familyMembers_select_dialog.Open(data.data);
        	}else{
        		$.onecloud.errorShow(data.mess);
        	}
      });
}

//更新树状图
var familyMembers_tree_init = function(sname,data){
	var familyMembers_tree_setting = {
		title:{
			text: sname
		},
	    tooltip : {         // Option config. Can be overwrited by series or data
	        trigger: 'item',
	        //show: true,   //default true
	        showDelay: 0,
	        hideDelay: 50,
	        transitionDuration:0,
	        //backgroundColor : 'rgba(255,0,255,0.7)',
	        //borderColor : '#f50',
	        borderRadius : 8,
	        borderWidth: 2,
	        padding: 10,    // [5, 10, 15, 20]
	        position : function(p) {
	            // 位置回调
	            return [p[0] + 10, p[1] - 10];
	         },
	        textStyle : {
	            //color: 'yellow',
	            decoration: 'none',
	            fontFamily: 'Arial, 微软雅黑, 黑体',
	            fontSize: 15,
	            fontStyle: 'italic',
	            fontWeight: 'bold'
	         },
	        formatter: function (params,ticket,callback) {
	            var res = '姓名 : ' + params.data.name;
	            if(params.data.content != null){
		            $.each(params.data.content, function(k, v) {
	                	res += '<br/>' + k + ' : ' + v;
	              	});
		          }
	            return res;
	         }
	        //formatter: "Template formatter: <br/>{b}<br/>{a}:{c}<br/>{a1}:{c1}"
	        //formatter: "Series formatter: <br/>{a}<br/>{b}:{c}"
	    },
	    toolbox: {
	        show : true,
	        feature : {
	            mark : {show: false},
	            dataView : {show: false, readOnly: false},
	            restore : {show: false},
	            saveAsImage : {show: true}
	        }
	    },
	    calculable : false,
	    series : [
	        {
	            name:'族谱',
	            type:'tree',
	            orient: 'horizontal',  // vertical horizontal
	            rootLocation: {x: '3%', y: '40%'}, // 根节点位置  {x: 'center',y: 10}
	            layerPadding: 200,
	            nodePadding: 50,
	            symbol: 'circle',
	            symbolSize: 20,
	            roam : true,
	            itemStyle: {
	                	normal: {
	                		color: '#4883b4',
	                    	label: {
	                        show: true,
	                        position: 'right',
	                        brushType: 'stroke',
	                        borderWidth: 1,
	                        //borderColor: '#428bca',
	                        textStyle: {
	                            color: '#000',
	                            fontSize: 20,
	                            fontWeight:  'bolder'
	                        	}
	                    	},
	                 		lineStyle: {
	                        color: '#ccc',
	                        width: 2,
	                        type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
	                    	}
	                	},
	                	emphasis: {
	                		color: '#4883b4',
	                		borderWidth: 5,
	                    	label: {
	                        show: false
	                    	}
	                	}
	             },
	            data: data
	        }
	    ]
	};
	
	var familyMembers_tree_chart = echarts.init(document.getElementById('familyMembers_tree'));
	familyMembers_tree_chart.setOption(familyMembers_tree_setting);
   	familyMembers_tree_chart.on('click', familyMembers_tree_do_click);
}                

//单击树状图节点事件
var familyMembers_tree_do_click = function(event){
	$('#familyMembers_tree_id').val(event.data.id);
	$('#familyMembers_tree_name').val(event.data.sname);
	familyMembers_tree_search(event.data.id,null);
}



$(function() {
	familyMembers_custom.Init();
	familyMembers_select_dialog.Init();
	familyMembers_tree_search(null,null);
});
                    