
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

	//TODO 处理对话页显示  此处只是页面显示 不影响页面重构 不需要使用模版
	var onVisitHandle = function(url,title){
		var regexUrl = /^(https?)/;
		if(url){
			if(!url.match(regexUrl))url='http://'+url;
		}
		var subTitle= title&&title.length>15?title.substr(0,15)+'..':title;
		//暂定成35个字符
		if(!url&&!title) return '未获取到';
		if(url&&!title) {
				var urlTitle = url.length>35?url.substr(0,35)+'..':url;
				return	'<a target="_black" style="font-size:14px;" href="'+url+'" title="'+url+'">'+urlTitle+'</a>';
		}
		if(!url&&title) {

				return  subTitle;
		}
		return '<a target="_black" style="font-size:14px;" href="'+url+'" title="'+title+'">'+subTitle+'</a>';

	};
	//初始化页面
	var initUserInfo = function(){
			var promise =  new Promise();
			//有数据再添加dom
			if(data){
				//客户资料背景清除
				$(node).html('').removeClass('showBg');
				loadFile.load(global.baseUrl+'views/rightside/profileUser.html').then(function(value){
					//对话页进行调整
					// data.userData['visitUrl']='baidu.com';
					// data.userData['visitTitle']='百度百度明天星百度百度明天星期三还是要上班期三还是要上班';
					//组装对话页
					console.log(data);
					data.userData["visit"] = onVisitHandle(data.userData['visitUrl'],data.userData['visitTitle']);
					var _html = doT.template(value)({
							'item':data.userData
					});
					$(node).append(_html);
					promise.resolve();
				});
				// console.log(data.userData);
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
		$(node).delegate('click','.js-userTnp',function(){
			// console.log('dd');
		});

	};
	var initConfig = function(){

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
