var focus_table = {
    Init: function () {
        $('#focus-table').bootstrapTable({
            method: 'get',
            url: '/focus_page_json',
            cache: false,
            striped: true,
            pagination: true,
            sidePagination: 'server',
            pageNumber: '1',
            pageSize: '10',
            pageList: '[10, 25, 50, 100]',
            search: true,
            showColumns: false,
            showRefresh: true,
            clickToSelect: true,
            queryParams: function(params) {
                return params;
            },
            columns: [
                {field: 'state',checkbox: true},
                {field: 'title',title: '主题',align: 'left',width:'20%',sortable: false},
	          	{field: 'remark',title: '描述',align: 'left',width:'45%',sortable: false},
	        	{field: 'createTime',title: '创建时间',align: 'left',width:'15%',sortable: false},
	        	{field: 'pictureType_name',title: '状态',align: 'left',width:'10%',sortable: false},
                {field: 'operate1',title: '操作',align: 'left',width:'10%',clickToSelect: false,
                			formatter: focus_table.formatter1,events: focus_table.events1}
            ]
        });
    },
    formatter1: function(value, row, index) {
    	return [
	        '<a class="up btn btn-xs btn-primary">设置</a>'
	    ].join('');
	},
	events1 : {
	    'click .up': function (e, value, row, index) {
	    	focus_up_dialog_open(row);
	    }
	}
};
   
   
    $(function() {
        //初始化修改对话框
        focus_table.Init();
        
        $("#focus_up_picture").uploadPreview({ Img: "focus_up_picture_preview", Width: 240, Height: 120 });
        
        $('#focus_up_dialog').dialog({
            autoOpen: false,
            width: 420,
            buttons: {
                "修改": function() {
                	$("#focus_up_form").ajaxSubmit({
			    	 	url: 'focus_up',
			            type:"post",  //提交方式
			            dataType:"json", //数据类型
			            success:function(data){ //提交成功的回调函数
			                if (data.status == 0) {
			                    $('#focus_up_dialog').dialog("close");
			                    $('#focus-table').bootstrapTable('refresh', {silent: true});
			                    $.onecloud.succShow(data.mess);
			                } else if(data.status == 1) {
			                    $.onecloud.errorShow(data.mess);
			                }else{
			                    $.onecloud.warnShow(data.mess);
			                }
			            }
			        });
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });
    });

    

    //打开修改对话框
    function focus_up_dialog_open(row) {
        $("#focus_up_id").val(row.id);
        $("#focus_up_url").val(row.url);
        
        if(row.picture != undefined && row.picture != null && row.picture.length != 0 ){
			$('#focus_up_picture_preview').attr('src', 'data:image/png;base64,' + row.picture);
		}else{
			$('#focus_up_picture_preview').attr('src', '/public/images/index/thumb.png');
		}
		
        $('#focus_up_dialog').dialog( "option", "title", "设置焦点图");
        $('#focus_up_dialog').dialog('open');
        
        $('#focus_up_picture_type').select2({
      		placeholder: "必选",
    	});
    	$("#focus_up_picture_type").select2("val", row.pictureType);
    };
    
