
var info_tool = {
    Init: function () {
    	$.get("/infoType_json", function(data) {
          $('#info_search_infoType').select2({
          		placeholder: "请选择",
                width: "130px",
                data: data
        	});
        });
    	
	 	$("#info_add").click(function() {
			openInfoAddHtml();
        });
        
        $("#info_up").click(function() {
            var selection = $('#info-table').bootstrapTable('getSelections');
	        if (selection.length === 1) {
	            $.each(selection, function(key, row) {
	                openInfoAddHtml(row.id,row.title);
	            });
	        } else {
	            $.onecloud.warnShow("修改只能选一个类！");
	        }
        });
  
        $("#info_del").click(function() {
            var selection = $('#info-table').bootstrapTable('getSelections');
            if (selection.length === 0) {
                $.onecloud.warnShow("至少选一个！");
            } else {
                if(confirm("是否删除？")) {
                    var id_array, params;
                    id_array = [];
                    $.each(selection, function(key, item) {
                        id_array.push(item.id);
                    });
                    params = {
                        "id_array": id_array.toString()
                    };
                    $.post("/info_del", params, function(data) {
                        if (data.status == 0) {
                            $('#info-table').bootstrapTable('refresh', {silent: true});
                            $.onecloud.succShow(data.mess);
                        } else if(data.status == 1) {
                            $.onecloud.errorShow(data.mess);
                        }else{
                            $.onecloud.warnShow(data.mess);
                        }
                    });
                }
            }
        });
        
        $("#info_open").click(function() {
	    	var selection = $('#info-table').bootstrapTable('getSelections');
            if (selection.length === 0) {
                $.onecloud.warnShow("至少选一个！");
            } else {
                if(confirm("是否显示？")) {
                    var id_array, params;
                    id_array = [];
                    $.each(selection, function(key, item) {
                        id_array.push(item.id);
                    });
                    params = {
                        "id_array": id_array.toString()
                    };
                    $.post("/info_open", params, function(data) {
                        if (data.status == 0) {
                            $('#info-table').bootstrapTable('refresh', {silent: true});
                            $.onecloud.succShow(data.mess);
                        } else if(data.status == 1) {
                            $.onecloud.errorShow(data.mess);
                        }else{
                            $.onecloud.warnShow(data.mess);
                        }
                    });
                }
            }
	    });
	    
	    $("#info_close").click(function() {
	    	var selection = $('#info-table').bootstrapTable('getSelections');
            if (selection.length === 0) {
                $.onecloud.warnShow("至少选一个！");
            } else {
                if(confirm("是否隐藏？")) {
                    var id_array, params;
                    id_array = [];
                    $.each(selection, function(key, item) {
                        id_array.push(item.id);
                    });
                    params = {
                        "id_array": id_array.toString()
                    };
                    $.post("/info_close", params, function(data) {
                        if (data.status == 0) {
                            $('#info-table').bootstrapTable('refresh', {silent: true});
                            $.onecloud.succShow(data.mess);
                        } else if(data.status == 1) {
                            $.onecloud.errorShow(data.mess);
                        }else{
                            $.onecloud.warnShow(data.mess);
                        }
                    });
                }
            }
	    });
			 	
        //查找info方法
        $("#info_sel").click(function() {
        	$('#info-table').bootstrapTable('reload');
        });
		
		$("#info_clear").click(function() {
			$("#info_search_infoType").select2("val",null);
		    $("#info_search_sel").val("");
        });
	 	
    }
};

var info_table = {
    Init: function () {
        //初始化fault列表
	    $('#info-table').bootstrapTable({
	        method: 'get',
	        url: '/info_page_json',
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
	        toolbar: '#info-custom-toolbar',
	        queryParams: function(params) {
	        	params.infoType_id = $("#info_search_infoType").val();
	        	params.search = $("#info_search_sel").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'title',title: '主题',align: 'left',width:'25%',sortable: false},
	          	{field: 'remark',title: '描述',align: 'left',width:'30%',sortable: false,cellStyle:bootstrap_table_cellStyle},
	          	{field: 'infoType_name',title: '分类',align: 'left',width:'10%',sortable: false},
	          	{field: 'type_name',title: '状态',align: 'left',width:'10%',sortable: false},
	        	{field: 'createTime',title: '创建时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'picture_type',title: '焦点图',align: 'left',width:'10%',sortable: false}
	        ]
	    });
    }
};
  

$(function() {
	info_tool.Init();
    info_table.Init();
});


function openInfoAddHtml(info_id,info_title){
	var infoAddTabId = "infoAddTabId";//一定要string类型
	var title = "";
	if(info_id == undefined || info_id == null){
		var id = $("#info_tool_id").val();
		infoAddTabId = infoAddTabId + id;
		title = "发布新信息"+id;
		
		var nid = (id-0)+1;
	 	$("#info_tool_id").val(nid);
	 	info_id = "";
	}else{
		infoAddTabId = infoAddTabId + info_id;
		title = "修改"+info_title;
	}
	
	if(oneTabPanel.exists(infoAddTabId)) {
		$.onecloud.opened();
		oneTabPanel.show(infoAddTabId);
	} else {
		$.onecloud.opening();
		oneTabPanel.addTab({
			id: infoAddTabId,
			title: title,
			html: '<iframe src="/infoAdd_html?id='+info_id+'"  width="100%" height="100%" frameborder="0";"></iframe>',
		});
		$.onecloud.succShow('打开成功');
	}
}

