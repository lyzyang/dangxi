var editor;
KindEditor.ready(function(K){
	editor = K.create('#info_add_content',{
		uploadJson : '/image_upload',
		fileManagerJson : '/image_manager',
		allowFileManager : true
	});
});
	
$(function() {
    
    $.ajax({
       url : "/infoType_json",
       async : false,
       type : "get",
       dataType : "json",
       success : function(data) {
            $('#info_add_type').select2({
	      		placeholder: "请选择",
	            data: data
	    	});
       }
    });
    
    var sid = $("#info_add_id").val();
    if(sid != undefined && sid != null && sid.length > 0){
    	$.get("/info_get",{"id":sid}, function(data) {
    		$('#info_add_title').val(data.title);
    		$('#info_add_remark').val(data.remark);
    		$("#info_add_type").select2("val", data.infoType_id);
    		editor.appendHtml(data.content);
    	});
    }
    
    $('#info_add_submit').on('click', function(e) {
    	var url;
    	var sid = $("#info_add_id").val();
    	if(sid == null || sid.length == 0){
    		url = "info_add";
    	}else{
    		url = "info_up";
    	}
    	
    	var params = {
    		"content":  editor.html()
    	};
    	$("#info_add_form").ajaxSubmit({
    	 	url: url,
            type:"post",  //提交方式
            dataType:"json", //数据类型
            data: params,
            success:function(data){ //提交成功的回调函数
                 if (data.status == 0) {
                 	var tabId = $("#info_add_tabId").val();
            		window.parent.closeInfoAddHtml(tabId);
	             } else if(data.status == 1) {
	             	window.parent.$.onecloud.errorShow(data.mess);
	             } else{
	             	window.parent.$.onecloud.warnShow(data.mess);
	            }
            }
         });
	 });
});