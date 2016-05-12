
/*
* @author denzel.gou
*/

var ProfileUser = function(node,core,userData) {
	//TODO
	var global=core.getGlobal();//全局对象

	var data = userData,
			config ={};
	var regExUserInfo=[];//保存用户验证信息
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
					//组装对话页
					// console.log(data);
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

	//保存客户资料字段值
	var onTextSaveData = function(val,obj){

		var oUrl = 'admin/modify_userinfo.action',
				sendData = {},
				type = $(obj).attr('otype');
				sendData.uid=config.uid;
				sendData.sender = config.url_id;
				if(type)sendData[type] = val;
				$.ajax({
				type:'post',
				url:oUrl,
				data:sendData,
				dataType:'JSONP',
				success:function(data){
					//如果编辑的是姓名字段 则要传值给左侧栏显示
					if($(obj).hasClass('userNameDyy'))
					{
						$(document.body).trigger('rightside.onGetName',[{
								'name':val
						}]);
					}
				}
			});

	};
	//编辑客户资料字段值
	var onTextRegexData = function(){
			var $this =$($(this)[0]);
			var isSubmit = false;//是否通过验证提交用户资料字段
			if($this){
				var val = $this.val().trim().replace(/[ ]/g,'');
				// console.log(regExUserInfo[$this.attr('otype')].regex);
				var regex = regExUserInfo[$this.attr('otype')].regex;
				(function(regex,val,$this){
						console.log('dd');
						if(!val&&!regex.test(val)){
							$this.siblings('span.tip').show();
							isSubmit = false;
						}else {
							$this.siblings('span.tip').hide();
							isSubmit = true;
						}

						//保存
						if(isSubmit)
							onTextSaveData(val,$this);
				})(regex,val,$this);
			}
	};
	var parseDOM = function() {
    // someOne = $(node).find('.js-xx');
	};

  var onReceive = function(value,data) {

  };
	var onloadHandler = function(evt,data) {

	};

	var bindLitener = function() {
		$(node).delegate('.js-userTnp','blur',onTextRegexData);
	};

	var initConfig = function(){

		config.uid = data.data.uid;//用户id
		config.url_id = global.id;//url地址栏id

		regExUserInfo = {
			nick:{'regex':/(\w{0,28})/},
			uname:{'regex':/(\w{0,28})/},
			tel:{'regex':'/^\d{8,13}$/'},
			email:{'regex':/^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-z0-9-]*)(?:[a-z0-9](?!-))(?:\.(?!-)))+[a-z]{2,}$/},
			qq:{'regex':/[1-9][0-9]{4,15}/},
			weixin:{'regex':/\w{5,28}/},
			weibo:{'regex':/\w{5,28}/},
			remark:{'regex':/\w{5,28}/}
		};
	};

	initUserInfo().then(function(){
		init();
	});
	var init = function() {
		initConfig();
		parseDOM();
		bindLitener();
	};
};
module.exports = ProfileUser;
