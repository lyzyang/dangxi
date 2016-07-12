var advertSet_table = {
    Init: function () {
        $('#advertSet-table').bootstrapTable({
            method: 'get',
            url: '/advertSet_page_json',
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
                {field: 'name',title: '名称',align: 'left',width:'20%',sortable: false},
                {field: 'picture_type',title: '广告图',align: 'left',width:'15%',sortable: false},
                {field: 'url',title: '链接',align: 'left',width:'55%',sortable: false},
                {field: 'operate1',title: '操作',align: 'left',width:'10%',clickToSelect: false,
                			formatter: advertSet_table.formatter1,events: advertSet_table.events1}
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
	    	advertSet_up_dialog_open(row);
	    }
	}
};
   
   
    $(function() {
        //初始化修改对话框
        advertSet_table.Init();
        
        $('#advertSet_up_picture_exit').on('click', function(e) {
	    	$('#advertSet_up_picture').val('');
	    	$('#advertSet_up_picture_isexit').val('1');
	    	$('#advertSet_up_picture_preview').attr('src', '/public/images/index/thumb.png');
		});
	
        $("#advertSet_up_picture").uploadPreview({ Img: "advertSet_up_picture_preview", Width: 240, Height: 120 });
        
        $('#advertSet_up_dialog').dialog({
            autoOpen: false,
            width: 420,
            buttons: {
                "修改": function() {
                	$("#advertSet_up_form").ajaxSubmit({
			    	 	url: 'advertSet_up',
			            type:"post",  //提交方式
			            dataType:"json", //数据类型
			            success:function(data){ //提交成功的回调函数
			                if (data.status == 0) {
			                    $('#advertSet_up_dialog').dialog("close");
			                    $('#advertSet-table').bootstrapTable('refresh', {silent: true});
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
    function advertSet_up_dialog_open(row) {
        $("#advertSet_up_id").val(row.id);
        $("#advertSet_up_url").val(row.url);
        $("#advertSet_up_picture").val('');
        
        if(row.picture != undefined && row.picture != null && row.picture.length != 0 ){
			$('#advertSet_up_picture_preview').attr('src', 'data:image/png;base64,' + row.picture);
		}else{
			$('#advertSet_up_picture_preview').attr('src', '/public/images/index/thumb.png');
		}
		
        $('#advertSet_up_dialog').dialog( "option", "title", "设置广告");
        $('#advertSet_up_dialog').dialog('open');
    };
    
