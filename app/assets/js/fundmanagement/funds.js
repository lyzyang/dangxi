var fund_table_tool ={
    Init: function () {
    	$.get("/fundType_json", function(data) {
          $('#fund_search_fundType').select2({
          		placeholder: "请选择",
                width: "130px",
                data: data
        	});
        });
        
        $('#fund_search_type').select2({
      		placeholder: "请选择",
            width: "130px"
    	});
    
	    $("#fund_add").click(function() {
	         fund_add_dialog.Open();
	    });
	    $("#fund_up").click(function() {
	        var selection = $('#fund-table').bootstrapTable('getSelections');
		    if (selection.length === 1) {
		       $.each(selection, function(key, row) {
		            fund_up_dialog.Open(row);
		        });
		    } else {
		        $.onecloud.warnShow("修改只能选一个！");
		    }
	    });
	    $("#fund_del").click(function() {
	    	var selection = $('#fund-table').bootstrapTable('getSelections');
        	var id_array = [];
        	if (selection.length > 0) {
	            $.each(selection, function(key, item) {
	               id_array.push(item.id);
	            });
	            fund_del(id_array.toString());
        	} else {
		        $.onecloud.warnShow("至少选一个！");
		    }
	    });
	    
	    $("#fund_sel").click(function() {
	        $('#fund-table').bootstrapTable('refresh', {silent: true});
	     });
	     
	    $("#fund_clear").click(function() {
		     $("#fund_search_type").select2("val",null);
		     $("#fund_search_sel").val("");
	    });
    }
}


var fund_table = {
    Init: function () {
        //初始化fund列表
	    $('#fund-table').bootstrapTable({
	        method: 'get',
	        url: '/fund_page_json',
	        cache: false,
	        striped: true,
	        pagination: true,
	        sidePagination: 'server',
	        pageNumber: '1',
	        pageSize: '10',
	        pageList: '[10, 25, 50, 1000]',
	        search: false,
	        showColumns: false,
	        showRefresh: false,
	        clickToSelect: true,
	        toolbar: '#fund-custom-toolbar',
	        queryParams: function(params) {
	        	params.fundType_id = $("#fund_search_fundType").val();
	        	params.type = $("#fund_search_type").val();
	        	params.search = $("#fund_search_sel").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'fundType_name',title: '类型',align: 'left',width:'15%',sortable: false},
	        	{field: 'type_name',title: '状态',align: 'left',width:'10%',sortable: false},
	        	{field: 'amount',title: '金额',align: 'left',width:'15%',sortable: false},
	        	{field: 'remark',title: '说明',align: 'left',width:'25%',sortable: false},
	        	{field: 'info_title',title: '关联信息',align: 'left',width:'35%',sortable: false}
	        ]
	    });
    }
};


var fund_add_dialog = {
    Init: function () {
    	/**
	     * 初始化fund_add_dialog
	     */
	    $('#fund_add_form').bootstrapValidator({
	 		threshold: 1,
	        feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	       fields: {
	        	fundType_id: {validators: {notEmpty: {message: '此项必须选择'}}},
	        	type: {validators: {notEmpty: {message: '此项必须选择'}}},
	        	amount: {validators: {
          	    	notEmpty: {message: '此项不能为空'},
          			numeric: {message: '请填写数字'}
          		}},
          		remark: {validators: {callback: {callback: function(value, validator) {return true;}}}},
          		info_title: {validators: {callback: {callback: function(value, validator) {return true;}}}}
	        }
		}).on('success.form.bv', function(e) {
			$.post("/fund_add", $("#fund_add_form").serialize(), function(data) {
                 if (data.status == 0) {
                	$('#fund_add_dialog').dialog("close");
                	$('#fund-table').bootstrapTable('refresh', {silent: true});
                	$.onecloud.succShow(data.mess);
	             } else if(data.status == 1) {
	                $.onecloud.errorShow(data.mess);
	             } else{
	                $.onecloud.warnShow(data.mess);
	             }
            });
	    });
	    $('#fund_add_dialog').dialog({
	        autoOpen: false,
	        width: 400,
	        buttons: {
	        	"确定": function() {
	            	$("#fund_add_form").submit();
	            },
	            "关闭": function() {
	                $(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function () {
   		$('#fund_add_form')[0].reset();
   		
   		$("#fund_add_info_id").val();
   		
      	$('#fund_add_dialog').dialog( "option", "title", "添加故障");
      	$('#fund_add_dialog').dialog('open');
      	
      	$.get("/fundType_json", function(data) {
          $('#fund_add_fundType').select2({
          		placeholder: "必选",
                data: data
        	});
        });
        
        $('#fund_add_type').select2({
      		placeholder: "必择",
    	});
    	
      	$('#fund_add_form').data('bootstrapValidator').resetForm(false);
    }
};

var fund_up_dialog = {
    Init: function () {
        /**
	     * 初始化fund_up_dialog
	     */
	    $('#fund_up_form').bootstrapValidator({
	 		threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
				invalid: 'glyphicon glyphicon-remove',
				validating: 'glyphicon glyphicon-refresh'
	        },
	       fields: {
	        	fundType_id: {validators: {notEmpty: {message: '此项必须选择'}}},
	        	type: {validators: {notEmpty: {message: '此项必须选择'}}},
	        	amount: {validators: {
          	    	notEmpty: {message: '此项不能为空'},
          			numeric: {message: '请填写数字'}
          		}},
          		remark: {validators: {callback: {callback: function(value, validator) {return true;}}}},
          		info_title: {validators: {callback: {callback: function(value, validator) {return true;}}}}
	        }
		}).on('success.form.bv', function(e) {
			$.post("/fund_up", $("#fund_up_form").serialize(), function(data) {
                 if (data.status == 0) {
	            	$('#fund_up_dialog').dialog("close");
	            	$('#fund-table').bootstrapTable('refresh', {silent: true});
	            	$.onecloud.succShow(data.mess);
	             } else if(data.status == 1) {
	                $.onecloud.errorShow(data.mess);
	             } else{
	                $.onecloud.warnShow(data.mess);
	             }
            });
	    });
	    $('#fund_up_dialog').dialog({
	        autoOpen: false,
	        width: 400,
	        buttons: {
	        	"确定": function() {
	            	$("#fund_up_form").submit();
	            },
	            "关闭": function() {
	                $(this).dialog("close");
	            }
	        }
	    });
    },
    Open: function (row) {
         $('#fund_up_form')[0].reset();
   		
   		 $("#fund_up_id").val(row.id);
   		 $("#fund_up_amount").val(row.amount);
   		 $("#fund_up_remark").val(row.remark);
   		 $("#fund_up_info_id").val(row.info_id);
   		 $("#fund_up_info_title").val(row.info_title);
   		
      	$('#fund_up_dialog').dialog( "option", "title", "修改故障");
      	$('#fund_up_dialog').dialog('open');
      	
      	$.ajax({
	       url : "/fundType_json",
	       async : false,
	       type : "get",
	       dataType : "json",
	       success : function(data) {
	           	$('#fund_up_fundType').select2({
	          		placeholder: "必选",
	                data: data
	        	});
	       }
	    });
        $("#fund_up_fundType").select2("val", row.fundType_id);
        
        $('#fund_up_type').select2({
      		placeholder: "必择",
    	});
    	$("#fund_up_type").select2("val", row.type);
    	
      	$('#fund_up_form').data('bootstrapValidator').resetForm(false);
    }
};


var fund_add_info_dialog = {
    Init: function () {
    
    	$.get("/infoType_json", function(data) {
          $('#fund_add_info_search_infoType').select2({
          		placeholder: "请选择",
                width: "130px",
                data: data
        	});
        });
        
	    $("#fund_add_info").click(function() {
			fund_add_info_dialog.Open();
		});
	    $("#fund_add_info_dialog").dialog({
			autoOpen: false,
			width: 800,
			minWidth: 650,
			height: 500,
			minHeight: 400,
			//resizable: false,
			buttons: {
				"选择": function() {
					 var selection = $('#fund-add-info-table').bootstrapTable('getSelections');
					 if (selection.length == 1) {
				        $.each(selection, function(key, row) {
	            			$("#fund_add_info_id").val(row.id);
			          		$("#fund_add_info_name").val(row.title);
				        });
						$("#fund_add_info_dialog").dialog("close");
				    } else {
				        $.onecloud.warnShow("只能选一个！");
				    }
				},
				"关闭": function() {
					$(this).dialog("close");
				}
			}
		});
    },
    Open: function () {
      	$('#fund_add_info_dialog').dialog( "option", "title", "选择信息");
      	$('#fund_add_info_dialog').dialog('open');
      	
      	$('#fund-add-info-table').bootstrapTable('destroy');
      	$('#fund-add-info-table').bootstrapTable({
	        method: 'get',
	        url: '/info_page_json',
	        cache: false,
	        striped: true,
	        pagination: true,
	        sidePagination: 'server',
	        pageNumber: '1',
	        pageSize: '5',
	        pageList: '[5,10, 25, 50, 1000]',
	        search: true,
	        showColumns: false,
	        showRefresh: true,
	        clickToSelect: true,
	        toolbar: '#fund-add-info-custom-toolbar',
	        queryParams: function(params) {
	          params.infoType_id = $("#fund_add_info_search_infoType").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'title',title: '主题',align: 'left',width:'15%',sortable: false},
	          	{field: 'remark',title: '描述',align: 'left',width:'40%',sortable: false},
	          	{field: 'infoType_name',title: '分类',align: 'left',width:'10%',sortable: false},
	        	{field: 'createTime',title: '创建时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'lastUpdateTime',title: '最后修改时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'type_name',title: '状态',align: 'left',width:'5%',sortable: false}
	        ]
	    });
    }
};

var fund_up_info_dialog = {
    Init: function () {
    	$.get("/infoType_json", function(data) {
          $('#fund_up_info_search_infoType').select2({
          		placeholder: "请选择",
                width: "130px",
                data: data
        	});
        });
        
	    $("#fund_up_info").click(function() {
			fund_up_info_dialog.Open();
		});
	    $("#fund_up_info_dialog").dialog({
			autoOpen: false,
			width: 800,
			minWidth: 650,
			height: 500,
			minHeight: 400,
			//resizable: false,
			buttons: {
				"选择": function() {
					 var selection = $('#fund-up-info-table').bootstrapTable('getSelections');
					 if (selection.length == 1) {
				        $.each(selection, function(key, row) {
	            			$("#fund_up_info_id").val(row.id);
			          		$("#fund_up_info_name").val(row.title);
				        });
						$("#fund_up_info_dialog").dialog("close");
				    } else {
				        $.onecloud.warnShow("只能选一个！");
				    }
				},
				"关闭": function() {
					$(this).dialog("close");
				}
			}
		});
    },
    Open: function () {
      	$('#fund_up_info_dialog').dialog( "option", "title", "选择信息");
      	$('#fund_up_info_dialog').dialog('open');
      	
      	$('#fund-up-info-table').bootstrapTable('destroy');
      	$('#fund-up-info-table').bootstrapTable({
	        method: 'get',
	        url: '/info_page_json',
	        cache: false,
	        striped: true,
	        pagination: true,
	        sidePagination: 'server',
	        pageNumber: '1',
	        pageSize: '5',
	        pageList: '[5,10, 25, 50, 1000]',
	        search: true,
	        showColumns: false,
	        showRefresh: true,
	        clickToSelect: true,
	        toolbar: '#fund-up-info-custom-toolbar',
	        queryParams: function(params) {
	          params.infoType_id = $("#fund_up_info_search_infoType").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'title',title: '主题',align: 'left',width:'15%',sortable: false},
	          	{field: 'remark',title: '描述',align: 'left',width:'40%',sortable: false},
	          	{field: 'infoType_name',title: '分类',align: 'left',width:'10%',sortable: false},
	        	{field: 'createTime',title: '创建时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'lastUpdateTime',title: '最后修改时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'type_name',title: '状态',align: 'left',width:'5%',sortable: false}
	        ]
	    });
    }
};


//删除操作
function fund_del(id_array) {
  if(confirm("是否删除？")) {
      var params = {
          "id_array": id_array
       };
      
      $.post("fund_del", params, function(data) {
          	if(data.status == 0) {
              $('#fund-table').bootstrapTable('refresh', {silent: true});
              $.onecloud.succShow(data.mess);
          	}else if(data.status == 1) {
              $.onecloud.errorShow(data.mess);
          	}else{
              $.onecloud.warnShow(data.mess);
          	}
       });
  }
};


$(function() {
	fund_add_dialog.Init();
	fund_up_dialog.Init();
	fund_add_info_dialog.Init();
	fund_up_info_dialog.Init();
	    	
	fund_table_tool.Init();
	fund_table.Init();
	   
});

