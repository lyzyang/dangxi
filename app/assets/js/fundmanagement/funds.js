var fund_table_tool ={
    Init: function () {
    	$.get("/fundType_json", function(data) {
          $('#fund_search_fundType').select2({
          		placeholder: "请选择",
                width: "130px",
                data: data
        	});
        });
        
        $('#fund_search_type').select2({
      		placeholder: "请选择",
            width: "130px"
    	});
    
	    $("#fund_add").click(function() {
	         openFundAddHtml();
	    });
	    $("#fund_up").click(function() {
	        var selection = $('#fund-table').bootstrapTable('getSelections');
		    if (selection.length === 1) {
		       $.each(selection, function(key, row) {
		            openFundAddHtml(row.id,row.title);
		        });
		    } else {
		        $.onecloud.warnShow("修改只能选一个！");
		    }
	    });
	    $("#fund_del").click(function() {
	    	var selection = $('#fund-table').bootstrapTable('getSelections');
        	var id_array = [];
        	if (selection.length > 0) {
	            $.each(selection, function(key, item) {
	               id_array.push(item.id);
	            });
	            fund_del(id_array.toString());
        	} else {
		        $.onecloud.warnShow("至少选一个！");
		    }
	    });
	    
	    $("#fund_sel").click(function() {
	        $('#fund-table').bootstrapTable('refresh', {silent: true});
	     });
	     
	    $("#fund_clear").click(function() {
		     $("#fund_search_type").select2("val",null);
		     $("#fund_search_sel").val("");
	    });
    }
}


var fund_table = {
    Init: function () {
        //初始化fund列表
	    $('#fund-table').bootstrapTable({
	        method: 'get',
	        url: '/fund_page_json',
	        cache: false,
	        striped: true,
	        pagination: true,
	        sidePagination: 'server',
	        pageNumber: '1',
	        pageSize: '10',
	        pageList: '[10, 25, 50, 1000]',
	        search: false,
	        showColumns: false,
	        showRefresh: false,
	        clickToSelect: true,
	        toolbar: '#fund-custom-toolbar',
	        queryParams: function(params) {
	        	params.fundType_id = $("#fund_search_fundType").val();
	        	params.type = $("#fund_search_type").val();
	        	params.search = $("#fund_search_sel").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'title',title: '主题',align: 'left',width:'40%',sortable: false},
	        	//{field: 'remark',title: '说明',align: 'left',width:'35%',sortable: false,cellStyle:bootstrap_table_cellStyle},
	        	{field: 'fundType_name',title: '类型',align: 'left',width:'15%',sortable: false},
	        	{field: 'type_name',title: '状态',align: 'left',width:'10%',sortable: false},
	        	{field: 'amount',title: '金额(元)',align: 'left',width:'15%',sortable: false},
	        	{field: 'useTime',title: '时间',align: 'left',width:'20%',sortable: false}
	        ]
	    });
    }
};

//删除操作
function fund_del(id_array) {
  if(confirm("是否删除？")) {
      var params = {
          "id_array": id_array
      };
      
      $.post("fund_del", params, function(data) {
          	if(data.status == 0) {
              $('#fund-table').bootstrapTable('refresh', {silent: true});
              $.onecloud.succShow(data.mess);
          	}else if(data.status == 1) {
              $.onecloud.errorShow(data.mess);
          	}else{
              $.onecloud.warnShow(data.mess);
          	}
       });
  }
};


$(function() {
	fund_table_tool.Init();
	fund_table.Init();
});



function openFundAddHtml(fund_id,fund_title){
	var fundAddTabId = "fundAddTabId";//一定要string类型
	var title = "";
	if(fund_id == undefined || fund_id == null){
		var id = $("#fund_tool_id").val();
		fundAddTabId = fundAddTabId + id;
		title = "发布新基金信息"+id;
		
		var nid = (id-0)+1;
	 	$("#fund_tool_id").val(nid);
	 	fund_id = "";
	}else{
		fundAddTabId = fundAddTabId + fund_id;
		title = "修改"+fund_title;
	}
	
	if(oneTabPanel.exists(fundAddTabId)) {
		$.onecloud.opened();
		oneTabPanel.show(fundAddTabId);
	} else {
		$.onecloud.opening();
		oneTabPanel.addTab({
			id: fundAddTabId,
			title: title,
			html: '<iframe src="/fundAdd_html?id='+fund_id+'&tabId='+fundAddTabId+'"  width="100%" height="100%" frameborder="0";"></iframe>',
		});
		$.onecloud.succShow('打开成功');
	}
}


function closeFundAddHtml(fundAddTabId){
	if(oneTabPanel.exists(fundAddTabId)) {
		oneTabPanel.kill(fundAddTabId);
		$.onecloud.succShow('添加成功');
		$('#fund-table').bootstrapTable('refresh', {silent: true});
	}
}