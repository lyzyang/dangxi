var securityRole_treeObj, securityRole_zTree,securityRole_zNodes,securityRole_addNode;
var setting = {
    edit: {
        enable: true,showRemoveBtn: true,showRenameBtn: false,
        drag: {
           prev: true,
           inner: false,
           next: true
        }
    },
    check : {enable : false,nocheckInherit : true},
    data: {simpleData: {enable: true}},
    view: {
    	addHoverDom: securityRole_addHoverDom,
    	removeHoverDom: securityRole_removeHoverDom
     },
    callback: {
        beforeRemove: securityRole_beforeRemove,
        onClick: securityRole_onClick
    }
};


var dep_permission_treeObj,dep_permission_zTree
var dep_permission_zNodes = [];

var dep_pc_treeObj,dep_pc_zTree
var dep_pc_zNodes = [];

$(function() {
        //获取角色列表并生成树
        $.get("/securityRole_json",function(data) {
            securityRole_zNodes = data;
            securityRole_treeObj = $.fn.zTree.init($("#securityRole_tree"), setting, securityRole_zNodes);
            securityRole_zTree = $.fn.zTree.getZTreeObj("securityRole_tree");
            securityRole_treeObj.expandAll(true);
        });

        //初始化添加角色对话框
        $('#securityRole_add_form').bootstrapValidator({
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
            $.post("/securityRole_add", $("#securityRole_add_form").serialize(), function(data) {
                if (data.status == 0) {
                    var newNode = {
                        isParent : false,
                        id: data.js.id,
                        pId : data.js.pId,
                        sort : data.js.sort,
                        name: data.js.name,
                        dropInner: data.js.dropInner,
                        dropRoot: data.js.dropRoot,
                        iconSkin: data.js.iconSkin
                    	};
                    	if(securityRole_addNode) {
                        securityRole_treeObj.addNodes(securityRole_addNode, newNode);
                        securityRole_zNodes.push(newNode);
                    	} else {
                        securityRole_treeObj.addNodes(null, newNode);
                        securityRole_zNodes.push(newNode);
                    	}

                    $('#securityRole_add_dialog').dialog("close");
                    $.onecloud.succShow(data.mess);
                } else if(data.status == 1) {
                    $.onecloud.errorShow(data.mess);
                }else{
                    $.onecloud.warnShow(data.mess);
                }
            });
        });
        $('#securityRole_add_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "添加": function() {
                    $("#securityRole_add_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });

		
		$('#securityRole_up_form').bootstrapValidator({
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
            var tid = $("#securityRole_up_tid").val();
            $.post("/securityRole_up", $("#securityRole_up_form").serialize(), function(data) {
	            if (data.status == 0) {
	                var node = securityRole_treeObj.getNodeByTId(tid);
	                node.name = data.js.name;
	                node.dropInner = data.js.dropInner;
	                node.dropRoot = data.js.dropRoot;
	                node.iconSkin = data.js.iconSkin;
	                securityRole_treeObj.updateNode(node);
	                
	                $('#securityRole_up_dialog').dialog("close");
	                $.onecloud.succShow(data.mess);
	            } else if(data.status == 1) {
	                $.onecloud.errorShow(data.mess);
	            }else{
	                $.onecloud.warnShow(data.mess);
	              }
	          });
        });
        $('#securityRole_up_dialog').dialog({
            autoOpen: false,
            width: 300,
            buttons: {
                "修改": function() {
                    $("#securityRole_up_form").submit();
                },
                "关闭": function() {
                    $(this).dialog("close");
                }
            }
        });

        //获取有效的权限列表并生成树
        var dep_permission_setting = {
            check : {enable : true,nocheckInherit : true},
            data: {simpleData: {enable: true}},
            callback: {
		        onClick: dep_permission_onClick
		    }
          };
        $.get("/securityRole_permissions_json", function(data) {
            dep_permission_zNodes = data;
            dep_permission_treeObj = $.fn.zTree.init($("#dep_permission_tree"), dep_permission_setting, dep_permission_zNodes);
            dep_permission_zTree = $.fn.zTree.getZTreeObj("dep_permission_tree");
            dep_permission_treeObj.expandAll(true);
          });

});

	
//为securityRole_tree添加增加，修改，删除按钮
function securityRole_addHoverDom(treeId, treeNode) {
   if (treeNode.editNameFlag || $("#securityRole_editBtn_" + treeNode.id).length > 0)
       return;
	var sObj = $("#" + treeNode.tId + "_span");
   var addStr = "<span class=\"button edit\" id='securityRole_editBtn_"+ treeNode.id + "' title='修改' onfocus='this.blur();'></span>";
   sObj.append(addStr);
   
   var editbtn = $("#securityRole_editBtn_" + treeNode.id);
   if (editbtn) {
       editbtn.bind("click", function() {
       	$('#securityRole_up_form')[0].reset();
       	$("#securityRole_up_id").val(treeNode.id);
    		$("#securityRole_up_tid").val(treeNode.tId);
    		$("#securityRole_up_name").val(treeNode.name);
    		
    		$('#securityRole_up_dialog').dialog( "option", "title", "修改管理组《"+treeNode.name+"》");
          $('#securityRole_up_dialog').dialog('open');
          
			$('#securityRole_up_form').data('bootstrapValidator').resetForm(false);
       });
   }
};

//role_tree删除操作后将其从树里去除
function securityRole_removeHoverDom(treeId, treeNode) {
    $("#securityRole_editBtn_" + treeNode.id).unbind().remove();
};

//role_tree删除操作
function securityRole_beforeRemove(treeId, treeNode) {
    if(confirm("确认删除《" + treeNode.name + "》吗？")) {
       var params = {"sid": treeNode.id};
       var st;
       $.ajax({
           url : "/securityRole_del",
           async : false,
           type : "post",
           dataType : "json",
           data : params,
           success : function(data) {
               if (data.status == 0) {
                   $.onecloud.succShow(data.mess);
                   st = true;
               } else if(data.status == 1) {
                   $.onecloud.errorShow(data.mess);
                   st = false;
               }else{
                   $.onecloud.warnShow(data.mess);
                   st = false;
               }
           }
       });
      return st;
    }else{
    	return false;
    }
}

//点击role树节点，获取该节点role的权限和菜单
function securityRole_onClick(event, treeId, treeNode) {
    $("#dep_permission_role_id").val(treeNode.id);
    $("#dep_pc_role_id").val(treeNode.id);
    dep_permission_treeObj.checkAllNodes(false);
    dep_pc_treeObj.checkAllNodes(false);
    var node = securityRole_findNodeById(treeNode.id);

    var params = {"sid": node.id};
    $.get("/securityRole_has_permissions", params, function(data) {
        $.each(data.permissions, function(k, permission) {
            dep_permission_treeObj.checkNode(dep_permission_treeObj.getNodeByParam("id", permission.id), true);
          });
     });
    
}

//根据ID获取树的节点
function securityRole_findNodeById(id) {
    for(var i in securityRole_zNodes) {
        if(securityRole_zNodes[i].id == id) {
            return securityRole_zNodes[i];
        }
    }
    return null;
}

//打开添加角色对话框
function securityRole_add_dialog_open() {
    $('#securityRole_add_form')[0].reset();
    $('#securityRole_add_dialog').dialog( "option", "title", "添加");
    $("#securityRole_add_pId").val("0");
    securityRole_addNode = null;
    $('#securityRole_add_dialog').dialog('open');
    $('#securityRole_add_form').data('bootstrapValidator').resetForm(false);
};


//全选和反选role树
var securityRole_check = false;
function securityRole_checkAll() {
    if(securityRole_check) {
        securityRole_treeObj.checkAllNodes(false);
        securityRole_check = false;
    } else {
        securityRole_treeObj.checkAllNodes(true);
        securityRole_check = true;
    }
}

//修改角色的从属，属性，是否有效
function securityRole_changeNodes() {
    var nodes = securityRole_treeObj.transformToArray(securityRole_treeObj.getNodes());
    var newNodes = new Array();
    var zNodes = new Array();
    $.each(nodes, function(key, node) {
        var newNode = {"id": node.id, "pid": -1 ,"check": -1, "sort": -1};
        newNode.sort = securityRole_zNodes[key].sort;

        newNodes.push(newNode);
        zNodes.push({
            id: node.id,
            pId: node.pId,
            sort: securityRole_zNodes[key].sort,
            checked: node.checked,
            name: node.name,
            dropInner: node.dropInner,
            dropRoot: node.dropRoot,
            iconSkin: node.iconSkin
        });
    });
    var str = "";
    $.each(newNodes, function(key, val) {
        if(val.pid!=-1 || val.check!=-1 || val.sort!=-1) {
            str = str  + val.id + "_" + val.pid + "_" + val.check + "_" + val.sort + "&";
        }
    });
    var params = {"str": str};
    if(str != "") {
        $.post("/securityRole_oc_up", params, function(data) {
            if (data.status == 0) {
                $.onecloud.succShow(data.mess);
            } else if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            }else{
                $.onecloud.warnShow(data.mess);
            }
        });
    } else {
        $.onecloud.succShow("更新成功！");
    }
}

function dep_permission_onClick(e, treeId, treeNode) {
	dep_permission_zTree.checkNode(treeNode, !treeNode.checked, true, true);
	return false;
}
	
//更改role所拥有的权限
function dep_permission_change(){
    var role_id = $("#dep_permission_role_id").val();
    if(role_id == '' || role_id == null || role_id == undefined){
    	$.onecloud.warnShow("请先选择管理组");
    	return;
    }
    var node = securityRole_findNodeById(role_id);

    var nodes = dep_permission_treeObj.transformToArray(dep_permission_treeObj.getNodes());
    var newNodes = new Array();
    $.each(nodes, function(key, node) {
        if(node.checked) {
            newNodes.push(node);
        }
    });
    var str = "";
    $.each(newNodes, function(key, val) {
        str = str  + val.id + "&";
    });

    var params = {"sid": role_id,"str": str};
    $.post("/securityRole_perm_up", params, function (data) {
        if (data.status == 0) {
            $.onecloud.succShow(data.mess);
        } else if(data.status == 1) {
            $.onecloud.errorShow(data.mess);
        }else{
            $.onecloud.warnShow(data.mess);
        }
    });
}

//折叠或折叠dep_permission_tree
var dep_permission_exp = true;
function dep_permission_expall(){
    if(dep_permission_exp) {
        dep_permission_treeObj.expandAll(false);
        dep_permission_exp = false;
    } else {
        dep_permission_treeObj.expandAll(true);
        dep_permission_exp = true;
    }
}

//全选或反选dep_permission_tree
var dep_permission_check = false;
function dep_permission_chkall(){
    if(dep_permission_check) {
        dep_permission_treeObj.checkAllNodes(false);
        dep_permission_check = false;
    } else {
        dep_permission_treeObj.checkAllNodes(true);
        dep_permission_check = true;
    }
}

