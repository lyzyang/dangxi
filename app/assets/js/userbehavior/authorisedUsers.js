$(function() {
    //定义按钮动作
    $("#user_admin_add").click(function() {
        user_admin_add_dialog_open()
    });
    $("#user_admin_up").click(function() {
        user_admin_up_dialog_open()
    });
    $("#user_admin_del").click(function() {
        user_admin_del()
    });
     
    //初始化添加用户对话框
    $('#user_admin_add_form').bootstrapValidator({
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
        $.post("/user_admin_add", $("#user_admin_add_form").serialize(), function(data) {
            if (data.status == 0) {
                $('#user_admin_add_dialog').dialog("close");
                $('#user_admin-table').bootstrapTable('refresh', {silent: true});
                $.onecloud.succShow(data.mess);
            } else if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            }else{
                $.onecloud.warnShow(data.mess);
                }
           });
    });
    $('#user_admin_add_dialog').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            "添加": function() {
                $("#user_admin_add_form").submit();
            },
            "关闭": function() {
                $(this).dialog("close");
            }
        }
    });

    //初始化修改用户对话框
    $('#user_admin_up_form').bootstrapValidator({
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
        $.post("/user_admin_up", $("#user_admin_up_form").serialize(), function(data) {
                if (data.status == 0) {
                    $('#user_admin_up_dialog').dialog("close");
                    $('#user_admin-table').bootstrapTable('refresh', {silent: true});
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                  }
           });
    });
    $('#user_admin_up_dialog').dialog({
        autoOpen: false,
        width: 300,
        buttons: {
            "修改": function() {
                $("#user_admin_up_form").submit();
            },
            "关闭": function() {
                $(this).dialog("close");
            }
        }
    });


    //初始化用户表格
    $('#user_admin-table').bootstrapTable({
        method: 'get',
        url: '/user_admin_page_json',
        cache: false,
        striped: true,
        pagination: true,
        sidePagination: 'client',
        pageSize: '10',
        pageList: '[10, 25, 50, 100]',
        search: true,
        showColumns: true,
        showRefresh: true,
        clickToSelect: true,
        toolbar: '#user_admin-custom-toolbar',
        queryParams: function(params) {
           return params;
        },
        columns: [{field: 'state',checkbox: true},
            {field: 'userName',title: '名字',align: 'left',width:'20%',sortable: true},
            {field: 'user',title: '帐号',align: 'left',width:'20%',sortable: true},
            {field: 'email',title: '邮箱',align: 'left',width:'20%',sortable: true},
            {field: 'roleName',title: '管理',align: 'left',width:'40%',sortable: true},
        ]
    });
});


//打开添加哟用户对话框
function user_admin_add_dialog_open() {
    $('#user_admin_add_form')[0].reset();
    $('#user_admin_add_roles_id').val("");
    
    role_tree.Init('user_admin_role_json','user_admin_add_roles_id','user_admin_add_roles_name',
    	'user_admin_add_roles_panel','user_admin_add_roles_tree');
    	
    $('#user_admin_add_dialog').dialog( "option", "title", "添加用户");
    $('#user_admin_add_dialog').dialog('open');
    $('#user_admin_add_form').data('bootstrapValidator').resetForm(false);
};

//打开修改用户对话框
function user_admin_up_dialog_open() {
    //$('#user_admin_up_form')[0].reset();
    $('#user_admin_up_roles_id').val("");
    var selection = $('#user_admin-table').bootstrapTable('getSelections');
    if (selection.length === 1) {
        $.each(selection, function(key, row) {
            $("#user_admin_id").val(row.id);
            $("#user_admin_userName").val(row.userName);
            $("#user_admin_email").val(row.email);
            $("#user_admin_user").val(row.user);
            $("#user_admin_password").val("");
            
			  role_tree.Init('user_admin_role_json','user_admin_up_roles_id','user_admin_up_roles_name',
    				'user_admin_up_roles_panel','user_admin_up_roles_tree');

			 var treeObj = $.fn.zTree.getZTreeObj("user_admin_up_roles_tree");
            var params = {"user_id": row.id}
            $.get("/UserRole_json", params , function(data) {
                var roles_id = "";
                $.each(data.roles, function(k, role) {
                    roles_id = roles_id + role.id +',';
                    treeObj.checkNode(treeObj.getNodeByParam("id", role.id), true);
                  });
                roles_id = roles_id.substring(0,roles_id.length-1);
                $("#user_admin_up_roles_id").val(roles_id);
                $("#user_admin_up_roles_name").val(row.roleName);
            });
            $('#user_admin_up_dialog').dialog( "option", "title", "修改用户<"+row.userName+">");
        });
        $('#user_admin_up_dialog').dialog('open');
        $('#user_admin_up_form').data('bootstrapValidator').resetForm(false);
    } else {
        $.onecloud.warnShow("修改只能选一个项！");
    }
};

//删除用户
function user_admin_del() {
    var selection = $('#user_admin-table').bootstrapTable('getSelections');
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
            $.post("/user_admin_del", params, function(data) {
                if (data.status == 0) {
                    $('#user_admin-table').bootstrapTable('refresh', {silent: true});
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
