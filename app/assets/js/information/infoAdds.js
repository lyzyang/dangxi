var editor;
KindEditor.ready(function(K){
	editor = K.create('#info_add_content',{
		allowFileManager : true
	});
});
	
$(function() {
	$.get("/infoType_json", function(data) {
      $('#info_add_type').select2({
      		placeholder: "请选择",
            data: data
    	});
    });
    
    var sid = $("#info_add_id").val();
    if(sid != undefined && sid != null && sid.length > 0){
    	$.get("/info_get",{"id":sid}, function(data) {
    		$('#info_add_title').val(row.title);
    		$('#info_add_remark').val(row.remark);
    		$("#info_add_type").select2("val", row.type);
    		$('#info_add_content').val(row.content);
    		$('#info_add_picture').val(row.picture);
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
    	
		$("#info_add_form").ajaxSubmit({
            type:"post",  //提交方式
            dataType:"json", //数据类型
            url: url,
            success:function(data){ //提交成功的回调函数
                if (data.status == 0) {
	                $.onecloud.succShow(data.mess);
	            } else if(data.status == 1) {
	                $.onecloud.errorShow(data.mess);
	            }else{
	                $.onecloud.warnShow(data.mess);
	              }
              }
         });
	 });
});