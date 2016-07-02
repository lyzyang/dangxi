    $(function() {
        //定义按钮事件
        $("#fundType_add").click(function() {
            fundType_add_dialog_open()
        });
        $("#fundType_up").click(function() {
            fundType_up_dialog_open()
        });
        $("#fundType_del").click(function() {
            fundType_del()
        });

        //初始化添加对话框
        $('#fundType_add_form').bootstrapValidator({
        	threshold: 1,
	       feedbackIcons: {
		    	valid: 'glyphicon glyphicon-ok',
    			invalid: 'glyphicon glyphicon-remove',
    			validating: 'glyphicon glyphicon-refresh'
	        },
	        fields: {
	        	sid: {validators: {
          	    	notEmpty: {message: '此项不能为空'},
          			numeric: {message: '请填写数字'}
          		}},
	        	name: {validators: {notEmpty: {message: '此项不能为空'}}}
	        }
   		}).on('success.form.bv', function(e) {
            $.post("/fundType_add", $("#fundType_add_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#fundType_add_dialog').dialog("close");
                    $('#fundType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                }
           });
        });
        $('#fundType_add_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "添加": function() {
                	$("#fundType_add_form").submit();
                },
                "关闭": function() {
                 	$(this).dialog("close");
                }
            }
        });

        //初始化修改对话框
        $('#fundType_up_form').bootstrapValidator({
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
            $.post("/fundType_up", $("#fundType_up_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#fundType_up_dialog').dialog("close");
                    $('#fundType-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
             });
        });
        $('#fundType_up_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "修改": function() {
                    $("#fundType_up_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });

        //初始化fundType列表
        $('#fundType-table').bootstrapTable({
            method: 'get',
            url: '/fundType_page_json',
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
            toolbar: '#fundType-custom-toolbar',
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
    function fundType_add_dialog_open() {
        $('#fundType_add_form')[0].reset();
        $('#fundType_add_dialog').dialog( "option", "title", "添加基金类型");
        $('#fundType_add_dialog').dialog('open');
        $('#fundType_add_form').data('bootstrapValidator').resetForm(false);
    };

    //打开修改对话框
    function fundType_up_dialog_open() {
        var selection = $('#fundType-table').bootstrapTable('getSelections');
        if (selection.length === 1) {
            $.each(selection, function(key, row) {
                $("#fundType_id").val(row.id);
                $("#fundType_name").val(row.name);
            });
            $('#fundType_up_dialog').dialog( "option", "title", "修改基金类型");
            $('#fundType_up_dialog').dialog('open');
            $('#fundType_up_form').data('bootstrapValidator').resetForm(false);
        } else {
            $.onecloud.warnShow("修改只能选一个类！");
        }
    };

    //删除
    function fundType_del() {
        var selection = $('#fundType-table').bootstrapTable('getSelections');
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
                $.post("/fundType_del", params, function(data) {
                    if (data.status == 0) {
                        $('#fundType-table').bootstrapTable('refresh', {silent: true});
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

