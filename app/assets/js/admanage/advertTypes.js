    $(function() {
        //定义按钮事件
        $("#advertType_add").click(function() {
            advertType_add_dialog_open()
        });
        $("#advertType_up").click(function() {
            advertType_up_dialog_open()
        });
        $("#advertType_del").click(function() {
            advertType_del()
        });

        //初始化添加对话框
        $('#advertType_add_form').bootstrapValidator({
        	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	       	 	code: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
   		}).on('success.form.bv', function(e) {
            $.post("/advertType_add", $("#advertType_add_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#advertType_add_dialog').dialog("close");
                    $('#advertType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                }
           });
        });
        $('#advertType_add_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "添加": function() {
                	$("#advertType_add_form").submit();
                },
                "关闭": function() {
                 	$(this).dialog("close");
                }
            }
        });

        //初始化修改对话框
        $('#advertType_up_form').bootstrapValidator({
        	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	code: {validators: {notEmpty: {message: '此项不能为空'}}},
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
   		}).on('success.form.bv', function(e) {
            e.preventDefault();
            $.post("/advertType_up", $("#advertType_up_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#advertType_up_dialog').dialog("close");
                    $('#advertType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
             });
        });
        $('#advertType_up_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "修改": function() {
                    $("#advertType_up_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });

        //初始化advertType列表
        $('#advertType-table').bootstrapTable({
            method: 'get',
            url: '/advertType_page_json',
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
            toolbar: '#advertType-custom-toolbar',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {field: 'state',checkbox: true},
                {field: 'id',title: '编号',align: 'left',width:'20%',sortable: false},
                {field: 'code',title: '编码',align: 'left',width:'40%',sortable: false},
                {field: 'name',title: '名称',align: 'left',width:'40%',sortable: false}
            ]
        });
    });

    //打开添加对话框
    function advertType_add_dialog_open() {
        $('#advertType_add_form')[0].reset();
        $('#advertType_add_dialog').dialog( "option", "title", "添加广告类型");
        $('#advertType_add_dialog').dialog('open');
        $('#advertType_add_form').data('bootstrapValidator').resetForm(false);
    };

    //打开修改对话框
    function advertType_up_dialog_open() {
        var selection = $('#advertType-table').bootstrapTable('getSelections');
        if (selection.length === 1) {
            $.each(selection, function(key, row) {
                $("#advertType_id").val(row.id);
                $("#advertType_code").val(row.code);
                $("#advertType_name").val(row.name);
            });
            $('#advertType_up_dialog').dialog( "option", "title", "修改广告类型");
            $('#advertType_up_dialog').dialog('open');
            $('#advertType_up_form').data('bootstrapValidator').resetForm(false);
        } else {
            $.onecloud.warnShow("修改只能选一个类！");
        }
    };

    //删除
    function advertType_del() {
        var selection = $('#advertType-table').bootstrapTable('getSelections');
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
                $.post("/advertType_del", params, function(data) {
                    if (data.status == 0) {
                        $('#advertType-table').bootstrapTable('refresh', {silent: true});
                        $.onecloud.succShow(data.mess);
                    } else if(data.status == 1) {
                        $.onecloud.errorShow(data.mess);
                    }else{
                        $.onecloud.warnShow(data.mess);
                    }
                });
            }
        }
    };

