//工具栏按钮
var familyMembers_admin_custom ={
    Init: function () {
    	
    	$('#familyMembers_admin_tree_life').select2({
      		placeholder: "请选择",
      		width: "130px"
    	});
    	
       //定义按钮事件
	    $("#familyMembers_admin_tree_search").click(function() {
			 var name = $('#familyMembers_admin_tree_name').val();
	        familyMembers_admin_tree_search(null,name);
	     });
	    $("#familyMembers_admin_tree_clear").click(function() {
	    	 $('#familyMembers_admin_tree_id').val("");
	        $("#familyMembers_admin_tree_name").val("");
	        $('#familyMembers_admin_tree_life').val(null).trigger('change');
	     });
	}
}

//重名选择栏
var familyMembers_admin_select_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_select_form').bootstrapValidator({
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
	        $.get("/familyMembers_get_life", $("#familyMembers_admin_select_form").serialize(), function(data) {
	        		var select_name = $('#familyMembers_admin_select option:selected').text();
	        		var sname = select_name.split('-');
	        		$('#familyMembers_admin_tree_name').val(sname[1]);
	        		console.log(sname[1]);
	            	if (data.type == 'tree') {
	                	$('#familyMembers_admin_select_dialog').dialog("close");
	                	familyMembers_admin_tree_init(sname[1],[data.data]);
	            	}else if(data.type == 'empty'){
	            		$('#familyMembers_admin_select_dialog').dialog("close");
	                	familyMembers_admin_tree_init();
	            	}else{
	            		$.onecloud.errorShow(data.mess);
	            	}
	          });
	    });
	    $('#familyMembers_admin_select_dialog').dialog({
	        autoOpen: false,
	        width: 350,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_select_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (data){
    	 $('#familyMembers_admin_select_form')[0].reset();
        $('#familyMembers_admin_select_dialog').dialog( "option", "title", "同名选择");
        $('#familyMembers_admin_select_dialog').dialog('open');
        $('#familyMembers_admin_select').select2({
      			placeholder: "请选择",
            	data: data
    	 });
    }
};

//双击树状节点后操作选择栏
var familyMembers_admin_do_select_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_do_select_form').bootstrapValidator({
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
				var fm_id = $('#familyMembers_admin_do_select_fm_id').val();
				var do_select = $('#familyMembers_admin_do_select').val();
            	if (do_select == '0') {
                	familyMembers_admin_up_dialog.Open(fm_id);
            	}else if(do_select == '1'){
            		familyMembers_admin_del(fm_id);
            	}else if(do_select == '2'){
            		familyMembers_admin_add_spouse_dialog.Open(fm_id);
            	}else if(do_select == '3'){
            		familyMembers_admin_up_spouse_dialog.Open(fm_id);
            	}else if(do_select == '4'){
            		familyMembers_admin_del_spouse_dialog.Open(fm_id);
            	}else if(do_select == '5'){
            		familyMembers_admin_add_children_dialog.Open(fm_id);
            	}else{
            		$.onecloud.errorShow("系统错误！");
            	}
            	$('#familyMembers_admin_do_select_dialog').dialog("close");
	    });
	    $('#familyMembers_admin_do_select_dialog').dialog({
	        autoOpen: false,
	        width: 350,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_do_select_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id,fm_sex) {
        $('#familyMembers_admin_do_select_form')[0].reset();
        $('#familyMembers_admin_do_select_dialog').dialog( "option", "title", "操作选择");
        $('#familyMembers_admin_do_select_dialog').dialog('open');
        
        $('#familyMembers_admin_do_select_fm_id').val(fm_id);
   		
   		 $('#familyMembers_admin_do_select').empty();
   		 $('#familyMembers_admin_do_select').append("<option></option>");
        if(fm_sex == '0'){
	        $('#familyMembers_admin_do_select').select2({
	      		placeholder: "请选择",
	      		data: [
	      			{"id":5,"text":"添加子女"},
		        	{"id":0,"text":"修改成员"},
		        	{"id":1,"text":"删除成员"},
		        	{"id":2,"text":"添加配偶"},
		        	{"id":3,"text":"修改配偶"},
		        	{"id":4,"text":"删除配偶"}
		         ]
	    	 });
        }else{
	        $('#familyMembers_admin_do_select').select2({
	      		placeholder: "请选择",
	      		data: [
		        	{"id":0,"text":"修改成员"},
		        	{"id":1,"text":"删除成员"},
		        	{"id":2,"text":"添加配偶"},
		        	{"id":3,"text":"修改配偶"},
		        	{"id":4,"text":"删除配偶"}
		         ]
	    	 });
         }
         
    	 $('#familyMembers_admin_do_select_form').data('bootstrapValidator').resetForm(false);
    }
};

//添加子女
var familyMembers_admin_add_children_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_add_children_form').bootstrapValidator({
	    	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	sex: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	residence: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	contact: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	remark: {validators: {callback: {callback: function(value, validator) {return true;}}}}
	        }
		}).on('success.form.bv', function(e) {
				$.post("/familyMembers_children_add", $("#familyMembers_admin_add_children_form").serialize(), function(data) {
	            	if (data.status == 0) {
                    $('#familyMembers_admin_add_children_dialog').dialog("close");
                    var sid = $('#familyMembers_admin_add_children_fm_id').val();//添加子女的父亲id
                    familyMembers_admin_tree_search(sid,null);
                    $.onecloud.succShow(data.mess);
                	} else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                	}else{
                    $.onecloud.warnShow(data.mess);
                   	}
	          });
	    });
	    $('#familyMembers_admin_add_children_dialog').dialog({
	        autoOpen: false,
	        width: 450,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_add_children_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id) {
        $('#familyMembers_admin_add_children_form')[0].reset();
        $('#familyMembers_admin_add_children_dialog').dialog( "option", "title", "添加配偶");
        $('#familyMembers_admin_add_children_dialog').dialog('open');
        
        $('#familyMembers_admin_add_children_fm_id').val(fm_id);
        $('#familyMembers_admin_add_children_sex').select2({
      			placeholder: "必选"
    	 });
    	 
    	 $('#familyMembers_admin_add_children_form').data('bootstrapValidator').resetForm(false);
    }
};


//修改成员
var familyMembers_admin_up_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_up_form').bootstrapValidator({
	    	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	sex: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	residence: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	contact: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	remark: {validators: {callback: {callback: function(value, validator) {return true;}}}}
	        }
		}).on('success.form.bv', function(e) {
				$.post("/familyMembers_up", $("#familyMembers_admin_up_form").serialize(), function(data) {
	            	if (data.status == 0) {
                    $('#familyMembers_admin_up_dialog').dialog("close");
                    var sid = $('#familyMembers_admin_tree_id').val();
                    familyMembers_admin_tree_search(sid,null);
                    $.onecloud.succShow(data.mess);
                	} else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                	}else{
                    $.onecloud.warnShow(data.mess);
                   	}
	          });
	    });
	    $('#familyMembers_admin_up_dialog').dialog({
	        autoOpen: false,
	        width: 450,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_up_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id) {
    		$.get("/familyMembers_get", {"sid": fm_id}, function(data) {
            	if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            	}else{
            		$('#familyMembers_admin_up_form')[0].reset();
    				$('#familyMembers_admin_up_dialog').dialog( "option", "title", "修改成员信息");
    				$('#familyMembers_admin_up_dialog').dialog('open');
			        
			       $('#familyMembers_admin_up_sex').select2({
			      		placeholder: "必选"
			    	});
			    	 
			       $('#familyMembers_admin_up_fm_id').val(fm_id);
			       $('#familyMembers_admin_up_name').val(data.name);
			       $('#familyMembers_admin_up_sex').val(data.sex).trigger('change');
			       $('#familyMembers_admin_up_residence').val(data.residence);
			       $('#familyMembers_admin_up_contact').val(data.contact);
			       $('#familyMembers_admin_up_remark').val(data.remark);
            		
		    	 	$('#familyMembers_admin_up_form').data('bootstrapValidator').resetForm(false);
               }
          });
    }
};


//删除成员
var familyMembers_admin_del = function(fm_id){
	if(confirm("是否删除？")) {
    	$.post("/familyMembers_del", {"sid": fm_id}, function(data) {
    	 	if (data.status == 0) {
            	$('#familyMembers_admin_tree_id').val(data.fm_id);
				$('#familyMembers_admin_tree_name').val(data.fm_name);
				familyMembers_admin_tree_search(data.fm_id,null);
            	$.onecloud.succShow(data.mess);
        	} else if(data.status == 1) {
            	$.onecloud.errorShow(data.mess);
        	}else{
            	$.onecloud.warnShow(data.mess);
        	}
      	});
    }
}


//添加配偶
var familyMembers_admin_add_spouse_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_add_spouse_form').bootstrapValidator({
	    	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	residence: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	statu: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
		}).on('success.form.bv', function(e) {
				$.post("/familyMembers_spouse_add", $("#familyMembers_admin_add_spouse_form").serialize(), function(data) {
	            	if (data.status == 0) {
                    $('#familyMembers_admin_add_spouse_dialog').dialog("close");
                    var sid = $('#familyMembers_admin_tree_id').val();
                    familyMembers_admin_tree_search(sid,null);
                    $.onecloud.succShow(data.mess);
                	} else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                	}else{
                    $.onecloud.warnShow(data.mess);
                   	}
	          });
	    });
	    $('#familyMembers_admin_add_spouse_dialog').dialog({
	        autoOpen: false,
	        width: 450,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_add_spouse_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id) {
        $('#familyMembers_admin_add_spouse_form')[0].reset();
        $('#familyMembers_admin_add_spouse_dialog').dialog( "option", "title", "添加配偶");
        $('#familyMembers_admin_add_spouse_dialog').dialog('open');
        
        $('#familyMembers_admin_add_spouse_fm_id').val(fm_id);
        $('#familyMembers_admin_add_spouse_statu').select2({
      			placeholder: "请选择"
    	 });
    	 
    	 $('#familyMembers_admin_add_spouse_form').data('bootstrapValidator').resetForm(false);
    }
};

//修改配偶
var familyMembers_admin_up_spouse_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_up_spouse_form').bootstrapValidator({
	    	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	residence: {validators: {callback: {callback: function(value, validator) {return true;}}}},
	        	statu: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
		}).on('success.form.bv', function(e) {
				$.post("/familyMembers_spouse_up", $("#familyMembers_admin_up_spouse_form").serialize(), function(data) {
	            	if (data.status == 0) {
                    $('#familyMembers_admin_up_spouse_dialog').dialog("close");
                    var sid = $('#familyMembers_admin_tree_id').val();
                    familyMembers_admin_tree_search(sid,null);
                    $.onecloud.succShow(data.mess);
                	} else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                	}else{
                    $.onecloud.warnShow(data.mess);
                   	}
	          });
	    });
	    $('#familyMembers_admin_up_spouse_dialog').dialog({
	        autoOpen: false,
	        width: 450,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_up_spouse_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id) {
        $.get("/familyMembers_get_spouse", {"sid": fm_id}, function(data) {
            	if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            	}else{
                if(data.length > 0){
                		$('#familyMembers_admin_up_spouse_form')[0].reset();
				       $('#familyMembers_admin_up_spouse_dialog').dialog( "option", "title", "修改配偶");
				       $('#familyMembers_admin_up_spouse_dialog').dialog('open');
				        
				       $('#familyMembers_admin_up_spouse_statu').select2({
				      		placeholder: "请选择"
				    	});
				    	 
				       $('#familyMembers_admin_up_spouse_fm_id').val(fm_id);
        
                		$('#familyMembers_admin_up_spouse_select').off("change");
                		$('#familyMembers_admin_up_spouse_select').select2({
			      			placeholder: "请选择",
			      			data: data
			    		}).on("change",function(e){
			    	 		var fm_spouse_id = $('#familyMembers_admin_up_spouse_select').val();
			    	 		$.each(data,function(k,v){
			    	 			if(v.id == fm_spouse_id){
			    	 				$('#familyMembers_admin_up_spouse_name').val(v.name);
			    	 				$('#familyMembers_admin_up_spouse_residence').val(v.residence);
			    	 				$("#familyMembers_admin_up_spouse_statu").select2("val",v.statu);
			    	 			}
			    	 		})
			    	 	});
			    	 	$('#familyMembers_admin_up_spouse_form').data('bootstrapValidator').resetForm(false);
                }else{
                		$.onecloud.warnShow("未添加配偶！");
                  }
               }
          });
    }
};


//删除配偶
var familyMembers_admin_del_spouse_dialog = {
    Init: function () {
        //初始化名字选择
	    $('#familyMembers_admin_del_spouse_form').bootstrapValidator({
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
				$.post("/familyMembers_spouse_del", $("#familyMembers_admin_del_spouse_form").serialize(), function(data) {
	            	if (data.status == 0) {
                    $('#familyMembers_admin_del_spouse_dialog').dialog("close");
                    var sid = $('#familyMembers_admin_tree_id').val();
                    familyMembers_admin_tree_search(sid,null);
                    $.onecloud.succShow(data.mess);
                	} else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                	}else{
                    $.onecloud.warnShow(data.mess);
                   	}
	          });
	    });
	    $('#familyMembers_admin_del_spouse_dialog').dialog({
	        autoOpen: false,
	        width: 450,
	        buttons: {
	            "确定": function() {
	            	$("#familyMembers_admin_del_spouse_form").submit();
	            },
	            "关闭": function() {
	             	$(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (fm_id) {
        $.get("/familyMembers_get_spouse", {"sid": fm_id}, function(data) {
            	if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            	}else{
                if(data.length > 0){
                		$('#familyMembers_admin_del_spouse_form')[0].reset();
				       $('#familyMembers_admin_del_spouse_dialog').dialog( "option", "title", "删除配偶");
				       $('#familyMembers_admin_del_spouse_dialog').dialog('open');
				        
				       $('#familyMembers_admin_del_spouse_fm_id').val(fm_id);
        
                		$('#familyMembers_admin_del_spouse_select').off("change");
                		$('#familyMembers_admin_del_spouse_select').select2({
			      			placeholder: "请选择",
			      			data: data
			    		});
			    	 	$('#familyMembers_admin_del_spouse_form').data('bootstrapValidator').resetForm(false);
                }else{
                		$.onecloud.warnShow("未添加配偶！");
                  }
               }
          });
    }
};


//查询树状图
var familyMembers_admin_tree_search = function(sid,name){
	  var ser = {
	  		"sid": sid,
	  		"name": name,
	  		"life": $('#familyMembers_admin_tree_life').val()
	  };
	  $.get("/familyMembers_get_life", ser, function(data) {
        	if (data.type == 'tree') {
        		var sname = $('#familyMembers_admin_tree_name').val();
            	familyMembers_admin_tree_init(sname,[data.data]);
        	}else if(data.type == 'empty'){
            	familyMembers_admin_tree_init();
        	}else if(data.type == 'select'){
        		 familyMembers_admin_select_dialog.Open(data.data);
        	}else{
        		$.onecloud.errorShow(data.mess);
        	}
      });
}

//更新树状图
var familyMembers_admin_tree_init = function(sname,data){
	var familyMembers_admin_tree_setting = {
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
	
	var familyMembers_admin_tree_chart = echarts.init(document.getElementById('familyMembers_admin_tree'));
	familyMembers_admin_tree_chart.setOption(familyMembers_admin_tree_setting);
   	familyMembers_admin_tree_chart.on('click', familyMembers_admin_tree_do_click);
	familyMembers_admin_tree_chart.on('dblclick', familyMembers_admin_tree_do_dblclick);
}                

//单击树状图节点事件
var familyMembers_admin_tree_timer = null;
var familyMembers_admin_tree_do_click = function(event){
　　clearTimeout(familyMembers_admin_tree_timer); // 这里加一句是为了兼容 Gecko 的浏览器 /
　　if(event.detail == 2)
　　   return ;

　　// 同上句的作用
　　familyMembers_admin_tree_timer = setTimeout(function(){
　　　　// click 事件的处理
		$('#familyMembers_admin_tree_id').val(event.data.id);
		$('#familyMembers_admin_tree_name').val(event.data.sname);
		familyMembers_admin_tree_search(event.data.id,null);
　　},300);
}

//双击树状图节点事件
var familyMembers_admin_tree_do_dblclick = function(event){
　　clearTimeout(familyMembers_admin_tree_timer);
 　 // dblclick 事件的处理
 	familyMembers_admin_do_select_dialog.Open(event.data.id,event.data.sex);
}


$(function() {
	familyMembers_admin_custom.Init();
	familyMembers_admin_select_dialog.Init();
	familyMembers_admin_do_select_dialog.Init();
	familyMembers_admin_add_children_dialog.Init();
	familyMembers_admin_up_dialog.Init();
	familyMembers_admin_add_spouse_dialog.Init();
	familyMembers_admin_up_spouse_dialog.Init();
	familyMembers_admin_del_spouse_dialog.Init();
	familyMembers_admin_tree_search(null,null);
});
                    