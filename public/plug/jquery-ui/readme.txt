
本项目中只用到dialog slider spinner部件
到官网下载时，去掉全部，然后在Widgets中选择这些部件，Interactions加上Sortable，UI Core会自动选择所需的，Effects则不要
下载下来后，只覆盖js，因为和bootstrap结合，所以css样式文件不更改


#########  jquery-ui.css  ###############
1328
/* @update 防止bootstrap设置合模式使jqueryUI长度计算错误 */
.ui-dialog, .ui-dialog-content {
	-webkit-box-sizing: content-box;
	-moz-box-sizing: content-box;
	box-sizing: content-box;
}

1356
padding: 5px;/* @update更改边距，太宽了*/

1367
top: 60%;/*＠update调整位置*/

1414
padding: 2px 15px;/* @update更改边距，太宽了*/

1479
/* ui-dialog-buttonset UI primary @update 增加样式 */
.ui-dialog-buttonset .ui-button.ui-button-primary {
    color: #ffffff;
    background-color: #428bca;
    border-color: #357ebd;
}
.ui-dialog-buttonset .ui-button.ui-button-primary.ui-state-hover{
    color: #ffffff;
    background-color: #3276b1;
    border-color: #285e8e;
}

1249
margin: 0 15px 0 0;/*@update 减少spinner的上下宽度*/

