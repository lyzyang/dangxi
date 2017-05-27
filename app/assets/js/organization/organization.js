var organization_info = {
    tooltip : {
        trigger: 'item',
        formatter: "{b}: {c}"
    },
    toolbox: {
        show : true,
        feature : {
            mark : {show: true},
            dataView : {show: true, readOnly: false},
            restore : {show: true},
            saveAsImage : {show: true}
        }
    },
    calculable : false,

    series : [
        {
            name:'树图',
            type:'tree',
            orient: 'vertical',  // vertical horizontal
            rootLocation: {x: 'center', y: '10%'}, // 根节点位置  {x: 'center',y: 10}
            nodePadding: 20,
            symbol: 'circle',
            symbolSize: 40,
            itemStyle: {
                normal: {
                    label: {
                        show: true,
                        position: 'inside',
                        textStyle: {
                            color: '#cc9999',
                            fontSize: 15,
                            fontWeight:  'bolder'
                        }
                    },
                    lineStyle: {
                        color: '#000',
                        width: 1,
                        type: 'broken' // 'curve'|'broken'|'solid'|'dotted'|'dashed'
                    }
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
            data: [
                {
                name: '手机',
                		children: [
                        {name: '小米',
                        		children: [
                                {name: '小米1'},
                                {name: '小米2'},
                                {name: '小米3'}
                           		]
                        	},
                        {name: '苹果'},
                        {name: '华为'},
                        {name: '联想'}
                		]
                }
            ]
        }
    ]
};

echarts.init(document.getElementById('organization_info')).setOption(organization_info);
                    