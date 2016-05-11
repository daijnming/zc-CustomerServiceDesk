
/*
* @author denzel
*/

var ProfileUser = function(node,core,userData) {

// console.log(node);
// console.log(core);
	//TODO
	var global=core.getGlobal();//全局对象

	var data = userData;
	//加载模版
	var loadFile = require('../../util/load.js')();
	var Promise = require('../../util/promise.js');
	/**
	 * 获取字符串的特殊长度，一个汉字算单位一个长度，两个数字或字符算一个单位长度
	 * @param val
	 * @returns
	 */
	function getStringLengthForChinese(val) {
		var str = new String(val);
		var bytesCount = 0;
		for (var i = 0 ,n = str.length; i < n; i++) {
			var c = str.charCodeAt(i);
			if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {
				bytesCount += 1;
			} else {
				bytesCount += 2;
			}
		}
		return (bytesCount/2).toFixed(0);
	}
	//处理对话页显示
	var onVisitHandle = function(url,title){
		url = getStringLengthForChinese(url);
		title = getStringLengthForChinese(title);
		if(!url&&!title) return '未获取到';
		if(!url&&title) return title.length>35?title.substr(0,35)+'...':title;

	};
	//初始化页面
	var initUserInfo = function(){
			var promise =  new Promise();
			//有数据再添加dom
			if(data){
				loadFile.load(global.baseUrl+'views/rightside/profileUser.html').then(function(value){
					//对话页进行调整
					data.userData["visit"] = onVisitHandle(data.userData['visitUrl'],data.userData['visitTtitle']);
					var _html = doT.template(value)({
							'item':data.userData
					});
					$(node).append(_html);
					promise.resolve();
				});
				console.log(data.userData);
				// if($(node[0]).children().length <= 0){
				// 	$(node).append(_html);
				// }
			}
			return promise;
	};
	var parseDOM = function() {
    // someOne = $(node).find('.js-xx');
	};

  var onReceive = function(value,data) {

  };
	var onloadHandler = function(evt,data) {

	};
	var bindLitener = function() {
		// $(document.body).on("RightSide.onload",onloadHandler);
	};
	var initConfig = function(){

		console.log();

	};

	initUserInfo().then(function(){
		init();
	});
	var init = function() {
		initConfig();
		parseDOM();
		bindLitener();
	};
	// init();
};
module.exports = ProfileUser;
