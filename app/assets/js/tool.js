//机组下拉树
var pointclass_tree = {
    Init: function (idObj_id,nameObj_id,panelObj_id,treeObj_id,select) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	$.ajax({
           url : "/pointclass_sub_json",
           async : false,
           type : "get",
           dataType : "json",
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	          		data: {simpleData: {enable: true}},
	          		callback: {
	            		onClick: pointclass_tree.onClick,
	                	onCheck: pointclass_tree.onCheck
	            	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
	        	
	        	var pt_treeObj_id = treeObj_id.replace("pointclass_tree","pointtag_tree");
	        	if($('#'+pt_treeObj_id).length != 0){
	        		var obj = $.fn.zTree.getZTreeObj(pt_treeObj_id);
	        		if(obj != null) obj.destroy();
		        }
	        	
		    	if(select && data.length > 0){
		    		$.each(data, function(key, row) {
		    			if(row.nocheck){
		    				return true;
		    			}
			          $('#'+idObj_id).val(row.id);
						$('#'+nameObj_id).val(row.all_name);
						
						var treeObj = $.fn.zTree.getZTreeObj(treeObj_id);
				       treeObj.checkNode(treeObj.getNodeByParam("id", row.id), true); 
				       
				       var pt_idObj_id = treeObj_id.replace("pointclass_tree","pointtag_id");
				       var pt_nameObj_id = treeObj_id.replace("pointclass_tree","pointtag_name");
				       var pt_panelObj_id = treeObj_id.replace("pointclass_tree","pointtag_panel");
				       var pt_treeObj_id = treeObj_id.replace("pointclass_tree","pointtag_tree");
						 
				       if($('#'+pt_treeObj_id).length != 0){
				        	pointtag_tree.Init(row.id,pt_idObj_id,pt_nameObj_id,pt_panelObj_id,pt_treeObj_id);
				        }
						return false;          
			        });
		    	}
            }
       });
                 
       $('#'+nameObj_id).click(function(){
        	pointclass_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
        });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
    	 var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        pointclass_tree.hideMenu(nameObj_id,panelObj_id);
        
        var pt_idObj_id = treeId.replace("pointclass_tree","pointtag_id");
        var pt_nameObj_id = treeId.replace("pointclass_tree","pointtag_name");
        var pt_panelObj_id = treeId.replace("pointclass_tree","pointtag_panel");
        var pt_treeObj_id = treeId.replace("pointclass_tree","pointtag_tree");
		 
        if($('#'+pt_treeObj_id).length != 0){
        	 pointtag_tree.Init(id,pt_idObj_id,pt_nameObj_id,pt_panelObj_id,pt_treeObj_id);
         }
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,pointclass_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",pointclass_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			pointclass_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}


//点标签树
var pointtag_tree = {
    Init: function (id,idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	$.ajax({
           url : "/pointtag_json",
           async : false,
           type : "get",
           dataType : "json",
           data : {"pointclass_id":id},
           success : function(data) {
              var setting = {
	            	check : {enable : true,chkboxType: { "Y": "", "N": "" }},
	            	data: {simpleData: {enable: true}},
	            	callback: {
	            		onClick: pointtag_tree.onClick,
	                	onCheck: pointtag_tree.onCheck
	               	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
       
      $('#'+nameObj_id).click(function(){
        	pointtag_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
       });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
        var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,pointtag_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",pointtag_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			pointtag_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}



//角色下拉树
var role_tree = {
    Init: function (url,idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	$.ajax({
           url : url,
           async : false,
           type : "get",
           dataType : "json",
           success : function(data) {
	           var setting = {
			        check: {enable: true},
			        data: {simpleData: {enable: true}},
			        callback: {
			           onClick: role_tree.onClick,
				        onCheck: role_tree.onCheck
			         }
			    };
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
                    
       $('#'+nameObj_id).click(function(){
        	role_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
        });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
    	 var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        var role_form_id = treeId.replace("roles_tree","form");
        $("#"+role_form_id).data('bootstrapValidator')
    		.updateStatus('roles_name', 'NOT_VALIDATED', null).validateField('roles_name');
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
       
       var dialogOffset = nameObj.offset();
       var oneLayoutCenterOffset = $("#oneLayoutCenter").offset();
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:dialogOffset.left-oneLayoutCenterOffset.left-2, top:dialogOffset.top-oneLayoutCenterOffset.top-2}).slideDown("fast");
	   	$("body").bind("mousedown",obj,role_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",role_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			role_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}


var device_tree_all = {
    Init: function (idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	
    	$.ajax({
           url : "/device_json",
           async : false,
           type : "get",
           data: {"types":"0,1"},
           dataType : "json",
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	          		data: {simpleData: {enable: true}},
	          		callback: {
	            		onClick: device_tree_all.onClick,
	                	onCheck: device_tree_all.onCheck
	            	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
                    
       $('#'+nameObj_id).click(function(){
        	device_tree_all.showMenu(nameObj_id,panelObj_id,treeObj_id);
        });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
    	 var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        device_tree_all.hideMenu(nameObj_id,panelObj_id);
        
        var dm_idObj_id = treeId.replace("device_tree","fault_id");
        var dm_nameObj_id = treeId.replace("device_tree","fault_name");
        var dm_panelObj_id = treeId.replace("device_tree","fault_panel");
        var dm_treeObj_id = treeId.replace("device_tree","fault_tree");
        var dm_tableObj_id = treeId.replace("device_tree","fault_feature_table");
    		
        if($('#'+dm_treeObj_id).length != 0){
        	 fault_tree.Init(id,dm_idObj_id,dm_nameObj_id,dm_panelObj_id,dm_treeObj_id,dm_tableObj_id);
         }
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,device_tree_all.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",device_tree_all.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			device_tree_all.hideMenu(nameObj_id,panelObj_id);
		}
	}
}


//设备下拉树
var device_tree = {
    Init: function (idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	
    	$.ajax({
           url : "/device_json",
           async : false,
           type : "get",
           data: {"types":"0"},
           dataType : "json",
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	          		data: {simpleData: {enable: true}},
	          		callback: {
	            		onClick: device_tree.onClick,
	                	onCheck: device_tree.onCheck
	            	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
	        	
	        	var dp_treeObj_id = treeObj_id.replace("device_tree","device_parts_tree");
	        	if($('#'+dp_treeObj_id).length != 0){
	        		var obj = $.fn.zTree.getZTreeObj(dp_treeObj_id);
	        		if(obj != null) obj.destroy();
		        }
		         
		       var dm_treeObj_id = treeObj_id.replace("device_tree","device_model_tree");
		       if($('#'+dm_treeObj_id).length != 0){
		        	var obj = $.fn.zTree.getZTreeObj(dm_treeObj_id);
		        	if(obj != null) obj.destroy();
		        }
            }
       });
                    
       $('#'+nameObj_id).click(function(){
        	device_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
        });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
    	 var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        device_tree.hideMenu(nameObj_id,panelObj_id);
        
        var dp_idObj_id = treeId.replace("device_tree","device_parts_id");
        var dp_nameObj_id = treeId.replace("device_tree","device_parts_name");
        var dp_panelObj_id = treeId.replace("device_tree","device_parts_panel");
        var dp_treeObj_id = treeId.replace("device_tree","device_parts_tree");
    		
        if($('#'+dp_treeObj_id).length != 0){
        	 device_parts_tree.Init(id,dp_idObj_id,dp_nameObj_id,dp_panelObj_id,dp_treeObj_id);
         }
         
        var dm_idObj_id = treeId.replace("device_tree","device_model_id");
        var dm_nameObj_id = treeId.replace("device_tree","device_model_name");
        var dm_panelObj_id = treeId.replace("device_tree","device_model_panel");
        var dm_treeObj_id = treeId.replace("device_tree","device_model_tree");
    		
        if($('#'+dm_treeObj_id).length != 0){
        	 device_model_tree.Init(id,dm_idObj_id,dm_nameObj_id,dm_panelObj_id,dm_treeObj_id);
         }
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,device_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",device_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			device_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}


//点标签树
var device_model_tree = {
    Init: function (id,idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	$.ajax({
           url : "/device_json",
           async : false,
           type : "get",
           dataType : "json",
           data : {"device_id":id,"types":"2"},
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	            	data: {simpleData: {enable: true}},
	            	callback: {
	            		onClick: device_model_tree.onClick,
	                	onCheck: device_model_tree.onCheck
	               	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
       
      $('#'+nameObj_id).click(function(){
        	device_model_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
       });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
        var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        device_model_tree.hideMenu(nameObj_id,panelObj_id);
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,device_model_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",device_model_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			device_model_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}

//点标签树
var device_parts_tree = {
    Init: function (id,idObj_id,nameObj_id,panelObj_id,treeObj_id) {
    	$('#'+idObj_id).val('');
    	$('#'+nameObj_id).val('');
    	
    	var ft_idObj_id = treeObj_id.replace("device_parts_tree","fault_id");
       var ft_nameObj_id = treeObj_id.replace("device_parts_tree","fault_name");
       var ft_panelObj_id = treeObj_id.replace("device_parts_tree","fault_panel");
       var ft_treeObj_id = treeObj_id.replace("device_parts_tree","fault_tree");
    	var ft_tableObj_id = treeObj_id.replace("device_parts_tree","fault_feature_table");
    	
       if($('#'+ft_treeObj_id).length != 0){
        	 fault_tree.Init(null,ft_idObj_id,ft_nameObj_id,ft_panelObj_id,ft_treeObj_id,ft_tableObj_id);
        }
         
    	$.ajax({
           url : "/device_json",
           async : false,
           type : "get",
           dataType : "json",
           data : {"device_id":id,"types":"1"},
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	            	data: {simpleData: {enable: true}},
	            	callback: {
	            		onClick: device_parts_tree.onClick,
	                	onCheck: device_parts_tree.onCheck
	               	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
       
      $('#'+nameObj_id).click(function(){
        	device_parts_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
       });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
        var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        device_parts_tree.hideMenu(nameObj_id,panelObj_id);
        
        var dm_idObj_id = treeId.replace("device_parts_tree","fault_id");
        var dm_nameObj_id = treeId.replace("device_parts_tree","fault_name");
        var dm_panelObj_id = treeId.replace("device_parts_tree","fault_panel");
        var dm_treeObj_id = treeId.replace("device_parts_tree","fault_tree");
        var dm_tableObj_id = treeId.replace("device_parts_tree","fault_feature_table");
    		
        if($('#'+dm_treeObj_id).length != 0){
        	 fault_tree.Init(id,dm_idObj_id,dm_nameObj_id,dm_panelObj_id,dm_treeObj_id,dm_tableObj_id);
         }
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,device_parts_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",device_parts_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			device_parts_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}



//点标签树
var fault_tree = {
    Init: function (id,idObj_id,nameObj_id,panelObj_id,treeObj_id,tableObj_id) {
    	 $('#'+idObj_id).val('');
	    $('#'+nameObj_id).val('');
	    if($('#'+tableObj_id).length != 0){
	    	$('#'+tableObj_id).bootstrapTable('destroy');
	     }
        if(id == null || id.length == 0){
    		$.fn.zTree.destroy(treeObj_id);
    		return;
    	 }
	    	
    	$.ajax({
           url : "/fault_json",
           async : false,
           type : "get",
           dataType : "json",
           data : {"device_id":id},
           success : function(data) {
              var setting = {
	            	check: {
	                enable: true,
	                chkStyle: "radio",
	                radioType: "all"
	            	},
	            	data: {simpleData: {enable: true}},
	            	callback: {
	            		onClick: fault_tree.onClick,
	                	onCheck: fault_tree.onCheck
	               	}
	          	};
	        	$.fn.zTree.init($('#'+treeObj_id), setting, data).expandAll(true);
            }
       });
       
      $('#'+nameObj_id).click(function(){
        	fault_tree.showMenu(nameObj_id,panelObj_id,treeObj_id);
       });
    },
	onClick: function(e, treeId, treeNode){
		$.fn.zTree.getZTreeObj(treeId).checkNode(treeNode, !treeNode.checked, null, true);
		return false;
	},
    onCheck: function (e, treeId, treeNode) {
        var idObj_id = treeId.replace("tree","id");
    	 var nameObj_id = treeId.replace("tree","name");
    	 var panelObj_id = treeId.replace("tree","panel");
        var nodes = $.fn.zTree.getZTreeObj(treeId).getCheckedNodes(true);
        if(nodes.length == 0) {
        	$('#'+idObj_id).val("");
        	$('#'+nameObj_id).val("");
        	return;
         }
        var v = "", id = "";
        for (var i=0, l=nodes.length; i<l; i++) {
            id+= nodes[i].id + ",";

            var pnode = nodes[i].getParentNode();
            while(pnode != null){
            	v = pnode.name + "-" + v;
              pnode = pnode.getParentNode();
              }
            v += nodes[i].name + ",";
         }
        if (v.length > 0 ){
            v = v.substring(0, v.length-1);
            id = id.substring(0, id.length-1);
         }
        $('#'+idObj_id).val(id);
        $('#'+nameObj_id).val(v);
        
        fault_tree.hideMenu(nameObj_id,panelObj_id);
        
        var f_tableObj_id = treeId.replace("fault_tree","fault_feature_table");
        if($('#'+f_tableObj_id).length != 0){
        		$('#'+f_tableObj_id).bootstrapTable('destroy');
	        	$('#'+f_tableObj_id).bootstrapTable({
		           method: 'get',
		           url: '/dgrule_feature_json',
		           cache: false,
		           striped: true,
		           pagination: false,
		           search: false,
		           showColumns: false,
		           showRefresh: false,
		           clickToSelect: false,
		           queryParams: function(params) {
		               params.fault_id = id;
		               return params;
		           },
		           columns: [
		               {field: 'name',title: '特征',align: 'left',width:'20%',sortable: false},
		               {field: 'remark',title: '描述',align: 'left',width:'70%',sortable: false,cellStyle:bootstrap_table_cellStyle},
		               {field: 'weight',title: '权重',align: 'left',width:'10%',sortable: false},
		           ]
		       });
         }
    },
   	showMenu: function (nameObj_id,panelObj_id,treeObj_id) {
		var obj = {"nameObj_id": nameObj_id, "panelObj_id": panelObj_id, "treeObj_id": treeObj_id};
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
		var treeObj = $('#'+treeObj_id);
	   	treeObj.css({width:nameObj.css('width') ,border:'1px solid #66afe9', background:nameObj.css('background')})
	   	treeObj.css({borderTop: '0px'});
	   	nameObj.css({'background-color':'#fff','borderBottom':'0px'});
	   	panelObj.css({left:nameObj.position().left-1, top:nameObj.position().top+28}).slideDown("fast");
	   	$("body").bind("mousedown",obj,fault_tree.onBodyDown);
	},
	hideMenu: function (nameObj_id,panelObj_id) {
		var nameObj = $('#'+nameObj_id);
		var panelObj = $('#'+panelObj_id);
	    nameObj.attr("style",{'borderBottom':'0px'});
	    nameObj.css({'background-color':'#fff'});
	    panelObj.fadeOut("fast");
	    $("body").unbind("mousedown",fault_tree.onBodyDown);
	},
	onBodyDown: function (event){
		var nameObj_id = event.data.nameObj_id;
		var panelObj_id = event.data.panelObj_id;
		var treeObj_id = event.data.treeObj_id;
	
		if(event.target.id != nameObj_id && event.target.id.indexOf(treeObj_id) == -1 && event.target.id.indexOf(panelObj_id) == -1){
			fault_tree.hideMenu(nameObj_id,panelObj_id);
		}
	}
}



//隐藏过长表格内容
var bootstrap_table_cellStyle = function(row,value,index) {
    return {
        classes:'cellStyle'
	};
}

//换行过长字符表格内容
var bootstrap_table_cellStyleString = function(row,value,index) {
    return {
        classes:'cellStyleString'
	};
}

//通用详细信息查看
var one_detail_seeDialog = {
    Init: function () {
    	$('#one_detail_seeDialog').dialog({
	       autoOpen: false,
	       title: "详细信息",
	       width: 400,
	       height: 300,
	       buttons: {
	           "关闭": function() {
	                $(this).dialog("close");
	           }
	        }
	    });
    },
	Open: function(data){
		$('#one_detail_text').val(data);
		$('#one_detail_seeDialog').dialog('open');
	}
}

/**
 * 快速选择时间
 */
function flash_settime(select,begintime,endtime) {
	var dom = $('#'+select);
	var range = dom.val();
	//dom.val(1);
	var date = new Date();
	if(endtime)
		$('#'+endtime).val($.onecloud.dateToString(date));
	if(isNaN(range)) {
		if(range == "month") {
			date.setMonth(date.getMonth() - 1);
		} else if(range == "year") {
			date.setFullYear(date.getFullYear() - 1);
		} else if(range == "start"){
			//date = new Date('2016/1/1 00:00:00').getTime();
		}
	} else {
		date = new Date(date.getTime() - range*1000);
	}
	if(begintime)
		$('#'+begintime).val($.onecloud.dateToString(date));
}


//哈希实现
function HashMap(){  
    //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
  
    /** 
    * 判断Map是否为空 
    */  
    this.isEmpty = function(){  
        return length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    this.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    this.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    this.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    this.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    this.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    this.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    this.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    this.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    this.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
}  


var formatJson = function(json, options) {
	var reg = null,
		formatted = '',
		pad = 0,
		PADDING = '    '; // one can also use '\t' or a different number of spaces
	// optional settings
	options = options || {};
	// remove newline where '{' or '[' follows ':'
	options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
	// use a space after a colon
	options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
 
	// begin formatting...
	if (typeof json !== 'string') {
		// make sure we start with the JSON as a string
		json = JSON.stringify(json);
	} else {
		// is already a string, so parse and re-stringify in order to remove extra whitespace
		json = JSON.parse(json);
		json = JSON.stringify(json);
	}
 
	// add newline before and after curly braces
	reg = /([\{\}])/g;
	json = json.replace(reg, '\r\n$1\r\n');
 
	// add newline before and after square brackets
	reg = /([\[\]])/g;
	json = json.replace(reg, '\r\n$1\r\n');
 
	// add newline after comma
	reg = /(\,)/g;
	json = json.replace(reg, '$1\r\n');
 
	// remove multiple newlines
	reg = /(\r\n\r\n)/g;
	json = json.replace(reg, '\r\n');
 
	// remove newlines before commas
	reg = /\r\n\,/g;
	json = json.replace(reg, ',');
 
	// optional formatting...
	if (!options.newlineAfterColonIfBeforeBraceOrBracket) {			
		reg = /\:\r\n\{/g;
		json = json.replace(reg, ':{');
		reg = /\:\r\n\[/g;
		json = json.replace(reg, ':[');
	}
	if (options.spaceAfterColon) {			
		reg = /\:/g;
		json = json.replace(reg, ':');
	}
 
	$.each(json.split('\r\n'), function(index, node) {
		var i = 0,
			indent = 0,
			padding = '';
 
		if (node.match(/\{$/) || node.match(/\[$/)) {
			indent = 1;
		} else if (node.match(/\}/) || node.match(/\]/)) {
			if (pad !== 0) {
				pad -= 1;
			}
		} else {
			indent = 0;
		}
 
		for (i = 0; i < pad; i++) {
			padding += PADDING;
		}
 
		formatted += padding + node + '\r\n';
		pad += indent;
	});
	return formatted;
};