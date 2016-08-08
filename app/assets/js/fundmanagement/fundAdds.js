var editor;
KindEditor.ready(function(K){
	editor = K.create('#fund_add_content',{
		uploadJson : '/image_upload',
        fileManagerJson : '/image_manager',
		allowFileManager : false
	});
});
	
$(function() {

	$.ajax({
       url : "/fundType_json",
       async : false,
       type : "get",
       dataType : "json",
       success : function(data) {
            $('#fund_add_fundType').select2({
	      		placeholder: "必选",
	            data: data
	    	});
       }
    });
    
    $('#fund_add_type').select2({
  		placeholder: "必择",
	});
	
	$("#fund_add_useTime").val(window.parent.$.onecloud.dateToString(new Date()));
   
    var sid = $("#fund_add_id").val();
    if(sid != undefined && sid != null && sid.length > 0){
    	$.get("/fund_get",{"id":sid}, function(data) {
    		$('#fund_add_title').val(data.title);
    		$("#fund_add_fundType").select2("val", data.fundType_id);
    		$("#fund_add_type").select2("val", data.type);
    		$('#fund_add_amount').val(data.amount);
    		$('#fund_add_useTime').val(data.useTime);
    		
    		editor.appendHtml(data.content);
    	});
    }
    
    $('#fund_add_submit').on('click', function(e) {
    	var url;
    	var sid = $("#fund_add_id").val();
    	if(sid == null || sid.length == 0){
    		url = "fund_add";
    	}else{
    		url = "fund_up";
    	}
    	
    	var params = {
    		"content":  editor.html()
    	};
    	$("#fund_add_form").ajaxSubmit({
    	 	url: url,
            type:"post",  //提交方式
            dataType:"json", //数据类型
            data: params,
            success:function(data){ //提交成功的回调函数
                 if (data.status == 0) {
                 	var tabId = $("#fund_add_tabId").val();
            		window.parent.closeFundAddHtml(tabId);
	             } else if(data.status == 1) {
	             	window.parent.$.onecloud.errorShow(data.mess);
	             } else{
	             	window.parent.$.onecloud.warnShow(data.mess);
	            }
            }
         });
	 });
});