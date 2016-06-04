$(function() {
    //定义按钮动作
    $("#authorisedUser_add").click(function() {
        authorisedUser_add_dialog_open()
    });
    $("#authorisedUser_up").click(function() {
        authorisedUser_up_dialog_open()
    });
    $("#authorisedUser_del").click(function() {
        authorisedUser_del()
    });
     
    //初始化添加用户对话框
    $('#authorisedUser_add_form').bootstrapValidator({
    	threshold: 1,
       feedbackIcons: {
	    	valid: 'glyphicon glyphicon-ok',
	    	invalid: 'glyphicon glyphicon-remove',
	    	validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            user: {validators: {notEmpty: {message: '此项不能为空'}}},
            userName: {validators: {notEmpty: {message: '此项不能为空'}}},
            password: {validators: {callback: {callback: function(value, validator) {return true;}}}},
            email: {validators: {
	          	    	callback: {callback: function(value, validator) {return true;}},
	          			emailAddress: {message: '请填写合法邮箱'}
	          }},
            roles_name: {validators: {notEmpty: {message: '至少选一个角色'}}}
        }
	 }).on('success.form.bv', function(e) {
        $.post("/authorisedUser_add", $("#authorisedUser_add_form").serialize(), function(data) {
            if (data.status == 0) {
                $('#authorisedUser_add_dialog').dialog("close");
                $('#authorisedUser-table').bootstrapTable('refresh', {silent: true});
                $.onecloud.succShow(data.mess);
            } else if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            }else{
                $.onecloud.warnShow(data.mess);
                }
           });
    });
    $('#authorisedUser_add_dialog').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            "添加": function() {
                $("#authorisedUser_add_form").submit();
            },
            "关闭": function() {
                $(this).dialog("close");
            }
        }
    });

    //初始化修改用户对话框
    $('#authorisedUser_up_form').bootstrapValidator({
    	threshold: 1,
       feedbackIcons: {
	    	valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            user: {validators: {notEmpty: {message: '此项不能为空'}}},
            userName: {validators: {notEmpty: {message: '此项不能为空'}}},
            password: {validators: {callback: {callback: function(value, validator) {return true;}}}},
            email: {validators: {
	          	    	callback: {callback: function(value, validator) {return true;}},
	          			emailAddress: {message: '请填写合法邮箱'}
	          }},
            roles_name: {validators: {notEmpty: {message: '至少选一个角色'}}}
        }
	 }).on('success.form.bv', function(e) {
        $.post("/authorisedUser_up", $("#authorisedUser_up_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#authorisedUser_up_dialog').dialog("close");
                    $('#authorisedUser-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
           });
    });
    $('#authorisedUser_up_dialog').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            "修改": function() {
                $("#authorisedUser_up_form").submit();
            },
            "关闭": function() {
                $(this).dialog("close");
            }
        }
    });


    //初始化用户表格
    $('#authorisedUser-table').bootstrapTable({
        method: 'get',
        url: '/authorisedUser_page_json',
        cache: false,
        striped: true,
        pagination: true,
        sidePagination: 'server',
        pageNumber: '1',
        pageSize: '10',
        pageList: '[10, 25, 50, 100]',
        search: false,
        showColumns: false,
        showRefresh: true,
        clickToSelect: true,
        toolbar: '#authorisedUser-custom-toolbar',
        queryParams: function(params) {
           return params;
        },
        columns: [{field: 'state',checkbox: true},
            {field: 'user',title: '帐号',align: 'left',width:'20%',sortable: false},
            {field: 'userName',title: '名字',align: 'left',width:'20%',sortable: false},
            {field: 'email',title: '邮箱',align: 'left',width:'20%',sortable: false},
            {field: 'roleName',title: '管理',align: 'left',width:'40%',sortable: false},
        ]
    });
});


//打开添加哟用户对话框
function authorisedUser_add_dialog_open() {
    $('#authorisedUser_add_form')[0].reset();
    $('#authorisedUser_add_roles_id').val("");
    
    role_tree.Init('securityRole_json','authorisedUser_add_roles_id','authorisedUser_add_roles_name',
    	'authorisedUser_add_roles_panel','authorisedUser_add_roles_tree');
    	
    $('#authorisedUser_add_dialog').dialog( "option", "title", "添加用户");
    $('#authorisedUser_add_dialog').dialog('open');
    $('#authorisedUser_add_form').data('bootstrapValidator').resetForm(false);
};

//打开修改用户对话框
function authorisedUser_up_dialog_open() {
    //$('#authorisedUser_up_form')[0].reset();
    $('#authorisedUser_up_roles_id').val("");
    var selection = $('#authorisedUser-table').bootstrapTable('getSelections');
    if (selection.length === 1) {
        $.each(selection, function(key, row) {
            $("#authorisedUser_id").val(row.id);
            $("#authorisedUser_userName").val(row.userName);
            $("#authorisedUser_email").val(row.email);
            $("#authorisedUser_user").val(row.user);
            $("#authorisedUser_password").val("");
            
			role_tree.Init('securityRole_json','authorisedUser_up_roles_id','authorisedUser_up_roles_name',
    				'authorisedUser_up_roles_panel','authorisedUser_up_roles_tree');

			var treeObj = $.fn.zTree.getZTreeObj("authorisedUser_up_roles_tree");
        
        	var role = row.roleId.split(",");
            $.each(role, function(k, v) {
                treeObj.checkNode(treeObj.getNodeByParam("id", v), true);
            });
          
            $("#authorisedUser_up_roles_id").val(row.roleId);
            $("#authorisedUser_up_roles_name").val(row.roleName);
            
            $('#authorisedUser_up_dialog').dialog( "option", "title", "修改用户<"+row.userName+">");
        });
        $('#authorisedUser_up_dialog').dialog('open');
        $('#authorisedUser_up_form').data('bootstrapValidator').resetForm(false);
    } else {
        $.onecloud.warnShow("修改只能选一个项！");
    }
};

//删除用户
function authorisedUser_del() {
    var selection = $('#authorisedUser-table').bootstrapTable('getSelections');
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
            $.post("/authorisedUser_del", params, function(data) {
                if (data.status == 0) {
                    $('#authorisedUser-table').bootstrapTable('refresh', {silent: true});
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
