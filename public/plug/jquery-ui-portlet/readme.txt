

增加参数
columns: [{
	width: 100,//如果有proportion，这个宽度变为最小宽度，如果没有就是固定宽度
	minWidth: 100,//可以不填，由width代替
	proportion: 0.2,//占剩余宽度的比例，范围0~1，1为100%
	portlets: [{
		isRefresh: true,//是否需要刷新按钮
		isToggle: true,//是否需要最小化按钮
		isClose: true,//是否需要关闭按钮
	}]
}]