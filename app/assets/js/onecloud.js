//自定义函数
(function($) {
	var isArray = function(arr) {
		return Object.prototype.toString.apply(arr) === "[object Array]";
	};
	var listToTree = function(list, setting) {
		if(list==null || !isArray(list) || list.length==0) {
			return list;
		}
		var defaults = {
			key: "id",
			parentKey: "pId",
			childKey: "children"
		}
		var options = $.extend({}, defaults, setting);
		var key = options.key;
		var parentKey = options.parentKey;
		var childKey = options.childKey;
		var tree = [];
		var idMap = [];
		for (i=0; i<list.length; i++) {
			idMap[list[i][key]] = list[i];
		}
		for (i=0; i<list.length; i++) {
			//以下情况为根节点：父节点不存在、自己指向自己、循环指向
			if (idMap[list[i][parentKey]] && list[i][key] != list[i][parentKey] &&
					list[i][key] != idMap[list[i][parentKey]][parentKey]) {
				if (!idMap[list[i][parentKey]][childKey]) {
					idMap[list[i][parentKey]][childKey] = [];
				}
				idMap[list[i][parentKey]][childKey].push(list[i]);
			} else {
				tree.push(list[i]);
			}
		}
		return tree;
	};
	/**
	 * 格式化输出时间 2012-12-12 12:12:12
	 */
	var dateToString = function (date) {
		if(typeof date === "number") {
			date = new Date(date);
		}
		return date.getFullYear() + "-" + addZero(date.getMonth()+1) + "-" + addZero(date.getDate()) + " " +
			addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
	};
	var addZero = function(num) {//转换成字符时，加0补足两位数
		if(num < 10) {
			return "0" + num;
		} else {
			return num;
		}
	};
	/**
	 * 将时间从字符串格式:"2012-12-09 12:40:00.00" 转换为Date类型
	 * reuturn 不合法返回null
	 */
	var stringToDate = function (str) {
		if(str==null || str.length<12) {
			return null;
		}
		var d = str.split(" ");
		if(d.length != 2) {
			return null;
		}
		var dd = d[0].split("-").concat(d[1].split(":"));
		if(dd.length != 6) {
			return null;
		}
		//月份范围是0~11,所以实际月份要减一
		var date = new Date(dd[0],dd[1]-1,dd[2],dd[3],dd[4],dd[5]);
		if(date == "Invalid Date") {
			return null;
		}
		return date;
	};
	var oneTime = 0;//延迟时间
	var oneTimeout;//计时器
	var oneCount = 1;//计数器
	var oneText = "";//上次的提示内容
	/**
	 * 信息提示
	 * @param text 提示内容
	 * @param type 提示方式 succ info warn error
	 * @param action 提示动作 open 只打开 show 打开然后关闭
	 * @param seconds 关闭秒数 默认s/i=3.6 wd=4.2
	 * 例：
	 *	showMess("更改中...", "info", "open");
	 *  showMess("输入有误！", "warning", "show", 5);
	 */
	var showMess = function(text, type, action, seconds) {
		switch(type) {
			case "succ":;
			case "info":
				seconds = seconds? seconds*1000: 3600;
				break;
			default:
				seconds = seconds? seconds*1000: 4200;
		}
		$onePrompt.removeClass().addClass("one-prompt one-prompt-"+type);
		$onePromptText.html(text);
		if($onePrompt.is(":visible") && oneText==text) {
			oneCount ++;
			$onePromptBadge.html(oneCount).show();
		} else {
			oneCount = 1;
			oneText = text;
			$onePromptBadge.hide();
		}
		clearTimeout(oneTimeout);
		oneTime = 0;
		switch(action) {
			case "open":
				$onePrompt.show();
				break;
			case "show":
				$onePrompt.show();
				oneTime = seconds;
				timeoutClose();
				break;
			default: $onePrompt.hide();
		}
	};
	/**
	 * 设置关闭定时器
	 */
	var timeoutClose = function() {
		oneTimeout = setTimeout(function() {
			$onePrompt.hide();
			$onePromptButton.hide();
		}, oneTime);
	};
	/**
	 * 改变信息提示的动作
	 * @param action => pause forcestop start
	 */
	var changeMess = function(action) {
		switch(action) {
			case "pause"://暂停
				clearTimeout(oneTimeout);
				break;
			case "close"://关闭
				clearTimeout(oneTimeout);
				oneTime = 0;
				break;
			case "start"://继续
				if(oneTime != 0) {
					timeoutClose();
				}
				break;
		}
	};
	/**
	 * 转换单位和保留小数点
	 */
	var converValue = function(value, conver, smallnumber, toNum) {
		if(value == null) {
			return null;
		}
		value *= 1;//如果不是数字转成数字
		if(conver!=null && conver!="") {
			value = eval(conver.replace(/num/g, value));//单位换算
		}
		if(typeof smallnumber == "number") {
			value = value.toFixed(smallnumber);//保留小数点
		}
		if(toNum) {
			return value * 1;
		}
		return value;
	};
	var userAgent = navigator.userAgent;
	
	/**
	 * 无刷新表单提交
	 */
	var submitNum = 0;
	var submit = function(url, params, callback) {
		submitNum ++;
		if(url == null) return;
		var iframe = $('<iframe name="index_download_iframe' + submitNum + '" style="display:none"></iframe>').appendTo('body');
		var form = $('<form style="display:none;" target="index_download_iframe' + submitNum + '"></form>').appendTo('body');
		iframe[0].onload = function() {
			var _callback;
			if(params != null) {
				if(callback == null) {
					if(typeof(params) === 'function') {
						_callback = params;
					}
				} else if(typeof(callback) === 'function') {
					_callback = callback;
				}
			}
			if(_callback) {
				var data = iframe.contents().find('body').html();
				//firefox浏览器会增加一个<pre>，要去掉
				if(/^</.test(data)) data = $(data).html();
				try {
					data = $.parseJSON(data);
				} catch(e) {}
				_callback(data);
			}
			iframe.remove();
			iframe = null;
			form.remove();
			form = null;
		};
		//遇到文件下载时，5分钟后自动回收资源
		setTimeout(function() {
			if(iframe) iframe.remove();
			if(form) form.remove();
		}, 5*60*1000);
		form.prop('action', url).empty();
		if(params == null) {
			form.submit();
			return;
		}
		if(callback == null) {
			if(typeof(params) !== 'function') {
				$.each(params, function(k, v) {
					form.append($('<input name="' + k + '">').val(v));
				});
			}
		} else {
			$.each(params, function(k, v) {
				form.append($('<input name="' + k + '">').val(v));
			});
		}
		form.submit();
	};
	$.onecloud = {
		isArray: isArray,
		listToTree: listToTree,//{id,name,pId} => {id,name,children{id,name}}
		dateToString: dateToString,//Date => 2012-12-12 12:12:12
		stringToDate: stringToDate,//2012-12-12 12:12:12 => Date
		showMess: showMess,//{mess,type,action,time} => {"...","info","open",3.2}
		infoOpen: function(mess) {showMess(mess, "info", "open");},//只打开，不关闭
		infoShow: function(mess, seconds) {showMess(mess, "info", "show", seconds);},//打开然后关闭
		succOpen: function(mess) {showMess(mess, "succ", "open");},
		succShow: function(mess, seconds) {showMess(mess, "succ", "show", seconds);},
		warnOpen: function(mess) {showMess(mess, "warn", "open");},
		warnShow: function(mess, seconds) {showMess(mess, "warn", "show", seconds);},
		errorOpen: function(mess) {showMess(mess, "error", "open");},
		errorShow: function(mess, seconds) {showMess(mess, "error", "show", seconds);},
		adding: function() {showMess("添加中...", "info", "open");},
		addSucc: function() {showMess("添加成功！", "succ", "show");},
		changing: function() {showMess("更改中...", "info", "open");},
		changeSucc: function() {showMess("更改成功！", "succ", "show");},
		deleting: function() {showMess("删除中...", "info", "open");},
		deleteSucc: function() {showMess("删除成功！", "succ", "show");},
		opening: function() {showMess("打开中...", "info", "open");},
		opened: function() {showMess("已经打开！", "info", "show", 2);},
		openSucc: function() {showMess("打开成功！", "succ", "show");},
		openCancel: function() {showMess("取消打开！", "succ", "show", 2);},
		reading: function() {showMess("读取中...", "info", "open");},
		readSucc: function() {showMess("读取成功！", "succ", "show");},
		noExists: function() {showMess("不存在！", "warn", "show");},
		changeMess: changeMess,
		converValue: converValue,
		isIE: userAgent.indexOf('MSIE') >= 0,
		isChrome: userAgent.indexOf('Chrome/') >= 0,
		isFirefox: userAgent.indexOf('Firefox/') >= 0,
		submit: submit,
	};
})(jQuery);

var $onePrompt, $onePromptText, $onePromptBadge, $onePromptButton;//提示框
$(function() {
	$onePrompt = $("#onePrompt");
	$onePromptText = $("#onePromptText");
	$onePromptBadge = $("#onePromptBadge");
	$onePromptButton = $("#onePromptButton");
	$(document).ajaxError(function(event,xhr,opt,exc) {
		$.onecloud.errorOpen("系统错误=>" + opt.url + ": " + xhr.status + " " + xhr.statusText);
		$onePromptButton.show();
	});
	$.ajaxSetup({
    	cache: false
    });
	$onePrompt.click(function() {
		$onePromptButton.show();
		$.onecloud.changeMess("close");
	}).mouseenter(function() {
		$.onecloud.changeMess("pause");
	}).mouseleave(function() {
		$.onecloud.changeMess("start");
	});
	$onePromptButton.click(function(e) {
		e.preventDefault();
		e.stopPropagation();
		$onePrompt.hide();
		$onePromptButton.hide();
	});
	 //判断浏览器
    $.browser = {
    	msie: false,
    	firefox: false,
    	chrome: false,
    	safari: false,
    	version: 0,
    };
    var agent = navigator.userAgent.toLowerCase();
    var index = agent.indexOf('msie');
    if(index >= 0) {
    	$.browser.msie = true;
    	var version = parseInt(agent.substr(index + 5, 5));
    	if(!isNaN(version)){$.browser.version = version;}
    } else {
    	index = agent.indexOf('firefox');
    	if(index >= 0) {
    		$.browser.firefox = true;
    		var version = parseInt(agent.substr(index + 8, 5));
        	if(!isNaN(version)){$.browser.version = version;}
    	} else {
    		index = agent.indexOf('chrome');
        	if(index >= 0) {
        		$.browser.chrome = true;
        		var version = parseInt(agent.substr(index + 7, 5));
        		if(!isNaN(version)){$.browser.version = version;}
        	} else {
        		index = agent.indexOf('safari');
            	if(index >= 0) {
            		$.browser.safari = true;
            		index = agent.indexOf('version');
            		var version = parseInt(agent.substr(index + 8, 5));
            		if(!isNaN(version)){$.browser.version = version;}
            	} else {
            		index = agent.indexOf('Trident');//IE 11
                	if(index >= 0) {
                		$.browser.msie = true;
                		index = agent.indexOf('rv');
                		var version = parseInt(agent.substr(index + 3, 5));
                		if(!isNaN(version)){$.browser.version = version;}
                	}
        		}
        	}
    	}
    }
    //
});


/**
 * 在dialog基础上加上最大化按钮
 * 只需更改初始化: $('div').sdialog(); 其他方法的使用和原来dialog一样，也可以全部用sdialog代替
 * 增加方法: afterMaximize, afterRestore(null, ui) 最大化之后的动作，参数和resizeStop方法类似
 */
(function($) {
	function maxDialog(dom) {
		var options = dom.dialog('option');
		var data = {
			oldWidth: options.width,
			oldHeight: options.height,
			oldPosition: {
				my: options.position.my,
				at: options.position.at
			},
		};
		dom.data('sdialog', data);
		dom.dialog("option", {width:$(window).width()-7,height:$(window).height(),position:{my:"left top",at:"left top",of: window}});
	}
	function minDialog(dom) {
		var data = dom.data('sdialog');
		if(data == null) return;
		dom.dialog("option", {width:data.oldWidth,height:data.oldHeight,position:{my:data.oldPosition.my,at:data.oldPosition.at,of: window}});
	}
	$.fn.sdialog = function(param1, param2, param3) {
		var useMethod = false;
		if(typeof(param1) == 'string') {
			useMethod = true;
		}
		return this.each(function(k, v) {
			var dom = $(v);
			dom.dialog(param1, param2, param3);
			if(useMethod) return;
			var max = $('<span class="icon-resize-full dialog-max-button" title="maximize"></span>');
			var min = $('<span class="icon-resize-small dialog-min-button" title="restore"></span>').hide();
			max.click(function() {
				maxDialog(dom);
				max.hide();
				min.show();
				if(param1.afterMaximize != null) {
					var parent = dom.parent();
					var option = {
						position: {
							left: 0,
							top: 0
						}, size: {
							width: parent.width(),
							height: parent.height(),
						},
					};
					param1.afterMaximize(null, option);
				}
			});
			min.click(function() {
				minDialog(dom);
				min.hide();
				max.show();
				if(param1.afterRestore != null) {
					var parent = dom.parent();
					var option = {
						position: {
							left: parent.offset().left,
							top: parent.offset().top
						}, size: {
							width: parent.width(),
							height: parent.height(),
						},
					};
					param1.afterRestore(null, option);
				}
			});
			dom.prev().children('button:first').before(max).before(min);
		});
	};
	$(function() {
		$('head').append('<style>.dialog-max-button,.dialog-min-button{font-size:14px;opacity:0.25;position:absolute;top:8px;right:30px;cursor:pointer;}' +
			'.dialog-max-button:hover,.dialog-min-button:hover{opacity:0.9;}</style>');
	});
})(jQuery);


