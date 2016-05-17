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
				var urlTitle = url.length>25?url.substr(0,25)+'..':url;
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
					//显示性别
					$(node).find('#sex').val(data.userData['sex']);
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
				type = $(obj).attr('otype'),
				reviceData={};//通知有左侧用户列表
				sendData.uid=config.uid;
				sendData.sender = config.url_id;
				if(type)sendData[type] = val;
				$.ajax({
				type:'post',
				url:oUrl,
				data:sendData,
				dataType:'json',
				success:function(data){
					reviceData.status=true;
					reviceData.uid = config.uid;
					//如果编辑的是姓名字段 则要传值给左侧栏显示
					if($(obj).hasClass('userNameDyy'))
					{
						reviceData.name=val;
					}else{
						reviceData.name='';
					}
					$(document.body).trigger('rightside.onProfileUserInfo',[{
							'data':reviceData
					}]);
				}
			});

	};

	var oFieldRegex={
	 	This:this,
		onTextBlurRegex:function(){
			var $this =$($(this)[0]);
			var isSubmit = false;//是否通过验证提交用户资料字段
			if($this){
				var val = $this.val().trim().replace(/[ ]/g,'');
				var _cur = regExUserInfo[$this.attr('otype')];
				(function(_cur,val,$this){
					var _boo=true;
					//正则匹配
					for(var i=0;i<_cur.length;i++){
						var item = _cur[i];
						if(!item.regex.test(val)){
							_boo=false;
							//加警告框
							$this.addClass('warm');
							//重新赋值
							$this.val(oFieldRegex.This.inputText);
							var $span = $this.siblings('span.tip');
							$span.find('.alerticon').text(item.alert);
							var top = $this.offset().top-68;
							var left= 63;
							$span.css({
								left:left+'px',
								top:top+'px'
							}).addClass('show').on('click',function(){
								$(this).removeClass('show');
								$this.removeClass('warm');
							});
							break;
						}
					}
					if(_boo){
						$this.siblings('span.tip').removeClass('show').find('.alerticon').text('');
						$this.removeClass('warm');
						isSubmit = true;
					}
						//保存
						if(isSubmit)
							onTextSaveData(val,$this);
				})(_cur,val,$this);
			}
		},
		onTextFocusRegex:function(){
			oFieldRegex.This.inputText = $(this).val();
			$(this).select();
		}
	};
	var onSelected = function(){
			var val = $(this).find('option:selected').val();
			onTextSaveData(val,$(this)[0]);
	};
	var parseDOM = function() {
    // someOne = $(node).find('.js-xx');
	};

  var onReceive = function(value,data) {

  };
	var onloadHandler = function(evt,data) {

	};
	var bindLitener = function() {
		$(node).delegate('.js-userTnp','blur',oFieldRegex.onTextBlurRegex);
		$(node).delegate('.js-userTnp','focus',oFieldRegex.onTextFocusRegex);
		$(node).delegate('#sex','change',onSelected);
		$(node).find('#dp').datepicker();
	};

	var initConfig = function(){

		config.uid = data.data.uid;//用户id
		config.url_id = global.id;//url地址栏id

		regExUserInfo = {
			nick:[{'regex':/\S/,alert:'不允许为空'},{'regex':/\w{5,28}/,'alert':'长度错误'}],
			uname:[{'regex':/\w{5,28}/,'alert':'格式错误'}],
			tel:[{'regex':/^[0-9]{8,13}$/,'alert':'格式错误'}],
			birthday:[{'regex':/^[1-2][0-9]{3}\-(([0-2]{1}[0-9]{1})|(3[0-1]{1}))(\-([0-2]{1}[0-9]{1})|(3[0-1]{1}))*$/,'alert':'格式错误'}],
			email:[{'regex':/^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-zA-Z0-9]*)(?:[a-zA-Z0-9](?!-))(?:\.(?!-)))+[a-zA-Z]{2,}$/,'alert':'格式错误'}],
			qq:[{'regex':/[1-9][0-9]{4,13}/,'alert':'格式错误'}],
			weixin:[{'regex':/\w{5,28}/,'alert':'格式错误'}],
			weibo:[{'regex':/\w{5,28}/,'alert':'格式错误'}],
			remark:[{'regex':/\w{0,200}/,'alert':'格式错误'}]
		};
	};
	initUserInfo().then(function(){
		init();
		//console.log(data);
	});
	var init = function() {
		initConfig();
		parseDOM();
		bindLitener();
	};
};
module.exports = ProfileUser;
