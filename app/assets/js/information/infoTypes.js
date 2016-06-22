    $(function() {
        //定义按钮事件
        $("#infoType_add").click(function() {
            infoType_add_dialog_open()
        });
        $("#infoType_up").click(function() {
            infoType_up_dialog_open()
        });
        $("#infoType_del").click(function() {
            infoType_del()
        });

        //初始化添加对话框
        $('#infoType_add_form').bootstrapValidator({
        	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
   		}).on('success.form.bv', function(e) {
            $.post("/infoType_add", $("#infoType_add_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#infoType_add_dialog').dialog("close");
                    $('#infoType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
              });
        });
        $('#infoType_add_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "添加": function() {
                	$("#infoType_add_form").submit();
                },
                "关闭": function() {
                 	$(this).dialog("close");
                }
            }
        });

        //初始化修改对话框
        $('#infoType_up_form').bootstrapValidator({
        	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
   		}).on('success.form.bv', function(e) {
            e.preventDefault();
            $.post("/infoType_up", $("#infoType_up_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#infoType_up_dialog').dialog("close");
                    $('#infoType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
             });
        });
        $('#infoType_up_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "修改": function() {
                    $("#infoType_up_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });

        //初始化infoType列表
        $('#infoType-table').bootstrapTable({
            method: 'get',
            url: '/infoType_page_json',
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
            toolbar: '#infoType-custom-toolbar',
            queryParams: function(params) {
                return params;
            },
            columns: [
                {field: 'state',checkbox: true},
                {field: 'id',title: '编号',align: 'left',width:'30%',sortable: false},
                {field: 'name',title: '名称',align: 'left',width:'70%',sortable: false}
            ]
        });
    });

    //打开添加对话框
    function infoType_add_dialog_open() {
        $('#infoType_add_form')[0].reset();
        $('#infoType_add_dialog').dialog( "option", "title", "添加同步类型");
        $('#infoType_add_dialog').dialog('open');
        $('#infoType_add_form').data('bootstrapValidator').resetForm(false);
    };

    //打开修改对话框
    function infoType_up_dialog_open() {
        var selection = $('#infoType-table').bootstrapTable('getSelections');
        if (selection.length === 1) {
            $.each(selection, function(key, row) {
                $("#infoType_id").val(row.id);
                $("#infoType_name").val(row.name);
                $("#infoType_method").val(row.method);
            });
            $('#infoType_up_dialog').dialog( "option", "title", "修改同步类型");
            $('#infoType_up_dialog').dialog('open');
            $('#infoType_up_form').data('bootstrapValidator').resetForm(false);
        } else {
            $.onecloud.warnShow("修改只能选一个类！");
        }
    };

    //删除
    function infoType_del() {
        var selection = $('#infoType-table').bootstrapTable('getSelections');
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
                $.post("/infoType_del", params, function(data) {
                    if (data.status == 0) {
                        $('#infoType-table').bootstrapTable('refresh', {silent: true});
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

