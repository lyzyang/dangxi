var info_table = {
    Init: function () {
        //初始化fault列表
	    $('#info-table').bootstrapTable({
	        method: 'get',
	        url: '/info_page_json',
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
	        toolbar: '#info-custom-toolbar',
	        queryParams: function(params) {
	        	params.search = $("#info_search_sel").val();
	          return params;
	         },
	        columns: [
	        	{field: 'state',checkbox: true},
	        	{field: 'title',title: '主题',align: 'left',width:'15%',sortable: false},
	          	{field: 'remark',title: '描述',align: 'left',width:'35%',sortable: false,cellStyle:bootstrap_table_cellStyle},
	          	{field: 'infoType_type',title: '分类',align: 'left',width:'10%',sortable: false},
	          	{field: 'user_userName',title: '创建人',align: 'left',width:'10%',sortable: false},
	        	{field: 'createTime',title: '创建时间',align: 'left',width:'15%',sortable: false,cellStyle:bootstrap_table_cellStyle},
	            {field: 'opete',title: '操作',align: 'left',width:'15%',sortable: false,
			    	formatter: info_table.formatter,events: info_table.events}
	        ]
	    });
    },
    formatter: function(value, row, index) {
    	return [
	        '<a class="see btn btn-xs btn-primary" title="详细"><i class="icon-search"></i></a>'
	    ].join('');
	},
	events : {
	    'click .see': function (e, value, row, index) {
	    	info_see_dialog_open(row);
	    }
	}
};
  

$(function() {
    info_table.Init();
});



