var userPermission_treeObj, userPermission_zTree,userPermission_zNodes,userPermission_addNode;
var setting = {
   edit: {
       drag: {
           autoExpandTrigger: true
        },
       enable: true,showRemoveBtn: true,showRenameBtn: false
   },
   check : {enable : true,nocheckInherit : true},
   data: {simpleData: {enable: true}},
   view: {
       addHoverDom: userPermission_addHoverDom,
       removeHoverDom: userPermission_removeHoverDom
   },
   callback: {
       beforeRemove: userPermission_beforeRemove,
       onClick: userPermission_onClick
   }
};  

$(function() {
   //获取权限列表并生成树
   $.get("/userPermission_json", function(data) {
       userPermission_zNodes = data;
       userPermission_treeObj = $.fn.zTree.init($("#userPermission_tree"), setting, userPermission_zNodes);
       userPermission_zTree = $.fn.zTree.getZTreeObj("userPermission_tree");
   });

   //初始化添加权限对话框
   $('#userPermission_add_form').bootstrapValidator({
   	threshold: 1,
       feedbackIcons: {
	    	valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
        },
      fields: {
          name: {validators: {notEmpty: {message: '此项不能为空'}}},
          iconClass: {validators: {notEmpty: {message: '此项必须选择'}}},
          //iconClass: {validators: {callback: {callback: function(value, validator) {return true;}}}}
          ismenu: {validators: {notEmpty: {message: '此项必须选择'}}},
          value: {validators: {callback: {callback: function(value, validator) {return true;}}}}
        }
	}).on('success.form.bv', function(e) {
        	$.post("/userPermission_add", $("#userPermission_add_form").serialize(), function(data) {
            if (data.status == 0) {
                var newNode = {
                    isParent : false,
                    id: data.js.id,
                    pId : data.js.pId,
                    sort : data.js.sort,
                    name: data.js.name,
                    value: data.js.value,
                    iconClass: data.js.iconClass,
                    ismenu: data.js.ismenu,
                    iconSkin: data.js.iconSkin
                	};

                if(userPermission_addNode) {
                    userPermission_treeObj.addNodes(userPermission_addNode, newNode);
                    userPermission_zNodes.push(newNode);
                } else {
                    userPermission_treeObj.addNodes(null, newNode);
                    userPermission_zNodes.push(newNode);
                	}

                $('#userPermission_add_dialog').dialog("close");
                $.onecloud.succShow(data.mess);
            } else if(data.status == 1) {
                $.onecloud.errorShow(data.mess);
            }else{
                $.onecloud.warnShow(data.mess);
            	}
       		});
    });
   $('#userPermission_add_dialog').dialog({
       autoOpen: false,
       width: 350,
       buttons: {
           "添加": function() {
                $("#userPermission_add_form").submit();
           },
           "关闭": function() {
                $(this).dialog("close");
           }
       }
	});

       
   $('#userPermission_up_form').bootstrapValidator({
   	threshold: 1,
       feedbackIcons: {
	    	valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
        },
      fields: {
          name: {validators: {notEmpty: {message: '此项不能为空'}}},
          iconClass: {validators: {notEmpty: {message: '此项必须选择'}}},
          //iconClass: {validators: {callback: {callback: function(value, validator) {return true;}}}}
          ismenu: {validators: {notEmpty: {message: '此项必须选择'}}},
          value: {validators: {callback: {callback: function(value, validator) {return true;}}}}
        }
	}).on('success.form.bv', function(e) {
       var tid = $("#userPermission_up_tid").val();
   	
       $.post("/userPermission_up", $("#userPermission_up_form").serialize(), function (data) {
           if (data.status == 0) {
               var node = userPermission_treeObj.getNodeByTId(tid);
               node.name = data.js.name;
               node.value = data.js.value;
               node.iconClass = data.js.iconClass;
               node.ismenu = data.js.ismenu;
               node.iconSkin = data.js.iconSkin;
               userPermission_treeObj.updateNode(node);
               userPermission_addHoverDom(0, node);

				 $('#userPermission_up_dialog').dialog("close");
               $.onecloud.succShow(data.mess);
           } else if(data.status == 1) {
               $.onecloud.errorShow(data.mess);
           }else{
               $.onecloud.warnShow(data.mess);
           }
      });
    });
    $('#userPermission_up_dialog').dialog({
       autoOpen: false,
       width: 350,
       buttons: {
           "修改": function() {
                $("#userPermission_up_form").submit();
           },
           "关闭": function() {
                $(this).dialog("close");
           }
       	}
  	 });
});

   function userPermission_format(state) {
       if (!state.id) return state.text; // optgroup<i class="icon-reorder"></i>
       return "<i class='"+state.text+"'></i>&nbsp;"+ state.text;
   }

   //为permission_tree添加增加，修改，删除按钮
   function userPermission_addHoverDom(treeId, treeNode) {
       if (treeNode.editNameFlag || $("#userPermission_addBtn_" + treeNode.id).length > 0)
           return;
		var sObj = $("#" + treeNode.tId + "_span");
       var addStr = "<span class=\"button add\" id='userPermission_addBtn_"+ treeNode.id + "' title='增加' onfocus='this.blur();'></span>" +
       				"<span class=\"button edit\" id='userPermission_editBtn_"+ treeNode.id + "' title='修改' onfocus='this.blur();'></span>";
       sObj.append(addStr);
       var addbtn = $("#userPermission_addBtn_" + treeNode.id);
       if (addbtn) {
           addbtn.bind("click", function() {
               $('#userPermission_add_form')[0].reset();
               $('#userPermission_add_dialog').dialog( "option", "title", "添加权限到《"+treeNode.name+"》下");
               $("#userPermission_add_pId").val(treeNode.id);
               userPermission_addNode = treeNode;
               $('#userPermission_add_dialog').dialog('open');
               
               $("#userPermission_add_iconClass").select2({
		           templateResult: userPermission_format,
		           templateSelection: userPermission_format,
		           placeholder: "必选",
		           escapeMarkup: function(m) { return m; }
		         });
		       
		        $("#userPermission_add_ismenu").select2({
		       	placeholder: "必选"
		         });
               $('#userPermission_add_form').data('bootstrapValidator').resetForm(false);
           });
       }
       
       var editbtn = $("#userPermission_editBtn_" + treeNode.id);
       if (editbtn) {
           editbtn.bind("click", function() {
           	$('#userPermission_up_form')[0].reset();
		       
		       $("#userPermission_up_id").val(treeNode.id);
		       $("#userPermission_up_tid").val(treeNode.tId);
		       $("#userPermission_up_name").val(treeNode.name);
		       $("#userPermission_up_value").val(treeNode.value);
		       
		       $('#userPermission_up_dialog').dialog( "option", "title", "修改权限《"+treeNode.name+"》");
              $('#userPermission_up_dialog').dialog('open');
		       
		       $("#userPermission_up_iconClass").select2({
		           templateResult: userPermission_format,
		           templateSelection: userPermission_format,
		           placeholder: "必选",
		           escapeMarkup: function(m) { return m; }
		        });
		       
		       $("#userPermission_up_ismenu").select2({
		       	placeholder: "必选"
		        });
		         
		       $("#userPermission_up_ismenu").select2("val", treeNode.ismenu);
		       $("#userPermission_up_iconClass").select2("val", treeNode.iconClass);
		       
              $('#userPermission_up_form').data('bootstrapValidator').resetForm(false);
           });
       }
   };


    //permission_tree点击节点动作
   function userPermission_onClick(event, treeId, treeNode){
       
   }


   //permission_tree删除操作后将其从树里去除
   function userPermission_removeHoverDom(treeId, treeNode) {
       $("#userPermission_addBtn_" + treeNode.id).unbind().remove();
       $("#userPermission_editBtn_" + treeNode.id).unbind().remove();
   };

   //permission_tree删除操作
   function userPermission_beforeRemove(treeId, treeNode) {
       var zTree = $.fn.zTree.getZTreeObj(treeId);
       zTree.selectNode(treeNode);
       if(treeNode.isParent) {
           $.onecloud.warnShow("存在子权限！");
           return false;
       }
       if(confirm("确认删除《" + treeNode.name + "》吗？")) {
           var params = {"sid": treeNode.id};
           $.post("/userPermission_del", params, function (data) {
               if (data.status == 0) {
                   $.onecloud.succShow(data.mess);
                   return true;
               } else if(data.status == 1) {
                   $.onecloud.errorShow(data.mess);
                   return false;
               }else{
                   $.onecloud.warnShow(data.mess);
                   return false;
               }
           });
       }else{
           return false;
       }
   }

   //根据ID获取树的节点
   function userPermission_findNodeById(id) {
       for(var i in userPermission_zNodes) {
           if(userPermission_zNodes[i].id == id) {
               return userPermission_zNodes[i];
           }
       }
       return null;
   }


   //打开添加权限对话框
   function userPermission_add_dialog_open() {
       $('#userPermission_add_form')[0].reset();
       $('#userPermission_add_dialog').dialog( "option", "title", "添加权限类");
       $("#userPermission_add_pId").val("0");
       userPermission_addNode = null;
       $('#userPermission_add_dialog').dialog('open');
       $("#userPermission_add_iconClass").select2({
           templateResult: userPermission_format,
           templateSelection: userPermission_format,
           placeholder: "必选",
           escapeMarkup: function(m) { return m; }
         });
       
        $("#userPermission_add_ismenu").select2({
       	placeholder: "必选"
         });
       $('#userPermission_add_form').data('bootstrapValidator').resetForm(false);
   };

   //全选和反选permission树
   var userPermission_check = false;
   function userPermission_checkAll() {
       if(userPermission_check) {
           userPermission_treeObj.checkAllNodes(false);
           userPermission_check = false;
       } else {
           userPermission_treeObj.checkAllNodes(true);
           userPermission_check = true;
       }
   }

   //修改权限的从属，属性，是否有效
   function userPermission_changeNodes() {
       var nodes = userPermission_treeObj.transformToArray(userPermission_treeObj.getNodes());
       var newNodes = new Array();
       var zNodes = new Array();
       $.each(nodes, function(key, node) {
           var newNode = {"id": node.id, "pid": -1 ,"check": -1, "sort": -1};
           if(key<userPermission_zNodes.length && node.id==userPermission_zNodes[key].id) {
               if(userPermission_zNodes[key].sort != key)
                   newNode.sort = key;
               if(node.pId!=userPermission_zNodes[key].pId) {
                   if(node.pId == null)
                       newNode.pid = 0;
                   else
                       newNode.pid = node.pId;
               }
               if(userPermission_zNodes[key].checked) {
                   if(!node.checked && !node.getCheckStatus().half) {
                       newNode.check = 0;
                   }
               } else {
                   if(node.checked || node.getCheckStatus().half) {
                       newNode.check = 1;
                   }
               }
           } else {
               var oldNode = userPermission_findNodeById(node.id);
               if(oldNode == null) {
                   newNode.sort = key;
                   newNode.pid = node.pId;
                   newNode.check = node.checked ? 0 : 1;
               } else {
                   if(oldNode.sort != key)
                       newNode.sort = key;
                   if(node.pId != oldNode.pId) {
                       if(node.pId == null)
                           newNode.pid = 0;
                       else
                           newNode.pid = node.pId;
                   }
                   if(oldNode.checked) {
                       if(!node.checked && !node.getCheckStatus().half) {
                           newNode.check = 0;
                       }
                   } else {
                       if(node.checked || node.getCheckStatus().half) {
                           newNode.check = 1;
                       }
                   }
               }
           }
           newNodes.push(newNode);
           zNodes.push({
               id: node.id,
               pId: node.pId,
               sort: key,
               checked: (node.checked||node.getCheckStatus().half),
               name: node.name,
               value: node.value,
               iconClass: node.iconClass,
               ismenu: node.ismenu,
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
           $.post("/userPermission_oc_up", params, function(data) {
               if (data.status == 0) {
                   userPermission_zNodes = zNodes;
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