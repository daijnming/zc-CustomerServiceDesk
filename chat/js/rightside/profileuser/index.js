/*
 * @author denzel.gou
 */

var ProfileUser = function(node,core,userData) {
	//TODO
	var global=core.getGlobal();//全局对象
	var data = userData,
			config ={},
	 		regExUserInfo=[];//保存用户验证信息
	//加载模版
	var loadFile = require('../../util/load.js')();
	var Promise = require('../../util/promise.js');
	String.prototype.visualLength = function(){
		var ruler = $('.aChat');
		ruler.text(this);
		return ruler[0].offsetWidth;
	};

	//TODO 处理对话页显示  此处只是页面显示 不影响页面重构 不需要使用模版
	var onVisitHandle = function(url,title){
		if(!url&&!title) return '-';
		var regexUrl = /^(https?)/;
		if(url){
			if(!url.match(regexUrl))url='http://'+url;
		}
		if(url&&!title) {
				return	'<a target="_black" class="js-aChat aChat" style="font-size:14px;" href="'+url+'" title="'+url+'">'+url+'</a>';
		}
		if(!url&&title) {
				return  title;
		}
		return '<a target="_black" class="js-aChat aChat" style="font-size:14px;" href="'+url+'" title="'+title+'">'+title+'</a>';
	};
	//初始化页面
	var initUserInfo = function(){
			var promise =  new Promise();
			//有数据再添加dom
			if(data){
				//客户资料背景清除
				$(node).html('').parents('.js-panel-body').removeClass('showBg');
				loadFile.load(global.baseUrl+'views/rightside/profileUser.html').then(function(value){
					//组装对话页
					// console.log(data);
					data.userData["visit"] = onVisitHandle(data.userData['visitUrl'],data.userData['visitTitle']);
					if(typeof data.userData['params']==='string'){
						data.userData['params'] = $.parseJSON($('<div>'+data.userData['params']+'</div>').html()) ;
					}
					var _html = doT.template(value)({
							'item':data
					});
					$(node).append(_html);
					//显示性别
					$(node).find('#sex').val(data.userData['sex']);
					promise.resolve();
				});
			}
			return promise;
	};

	//保存客户资料字段值
	var onTextSaveData = function(val,obj){
		var oUrl = 'admin/modify_userinfo.action',
				sendData = {},
				type = $(obj).attr('otype'),
				reviceData={};//通知左侧用户列表
				sendData.uid=config.uid;
				sendData.sender = config.url_id;
				if(type)sendData[type] = val;
				$.ajax({
				type:'post',
				url:oUrl,
				data:sendData,
				dataType:'json',
				success:function(data){
					//去掉两端空格显示
					$(obj).val(val);
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
					//判断值是否有改变 没改变就不提接口
					if(oFieldRegex.This.inputText == val){
						isSubmit=false;
					}else{
						//正则匹配
						for(var i=0;i<_cur.length;i++){
							var item = _cur[i];
							if(!item.regex.test(val)){
								_boo=false;
								//加警告框
								$this.addClass('warm');
								//重新赋值
								$this.val(oFieldRegex.This.inputText);
								var $span = $this.siblings('.js-tip');
								$span.find('.js-alerticon').text(item.alert);
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
							$this.siblings('.js-tip').removeClass('show').find('.js-alerticon').text('');
							$this.removeClass('warm');
							isSubmit = true;
						}
					}
					//保存 提接口
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
		var val=$(this).find('option:selected').val();
			onTextSaveData(val,$(this)[0]);
	};
	//对话页 url显示
	var onSessionUrl = function(){
		var ruler = $('.aChat');
		if(ruler.length>0){
			var chatWarpW = $('.js-chatWarp').width();
			var aChatW = $('.js-aChat').text($('.js-aChat').text())[0].offsetWidth
			if(aChatW >= chatWarpW){
				$('.js-chatWarpi').addClass('show');
			}else{
				$('.js-chatWarpi').removeClass('show');
			}
		}
	};
	//日期控件
	var onDatePicker = function(){
		$(node).find('#dp').datepicker().on('changeDate',function(ev){
			var _date = ev.date;
			var _y,_m,_d;
			_y = _date.getFullYear();
			_m = _date.getMonth()+1 < 10?'0'+ (Number( _date.getMonth())+1):_date.getMonth()+1;
			_d = _date.getDate()<10? '0'+_date.getDate():_date.getDate();
			var _bir = _y+'-'+_m+'-'+_d
			onTextSaveData(_bir,$(this)[0]);
		});
	};
	var bindLitener = function() {
		$(node).delegate('.js-userTnp','blur',oFieldRegex.onTextBlurRegex);
		$(node).delegate('.js-userTnp','focus',oFieldRegex.onTextFocusRegex);
		$(node).delegate('#sex','change',onSelected);
	};
	var initPlugsin = function(){
		onSessionUrl();
		onDatePicker();
	};
	var initConfig = function(){

		config.uid = data.data.uid;//用户id
		config.url_id = global.id;//url地址栏id

		regExUserInfo = {
			uname:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'},
				{'regex':/\w{0,100}/,'alert':'最大输入100字符，请重新输入'}],
			realname:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'},
				{'regex':/\w{0,32}/,'alert':'最大输入32字符，请重新输入'}],
			tel:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[0-9\-#*]*$/,'alert':'只允许数字、“#”、“*”、“-”'},
				{'regex':/^[0-9\-#*]{8,30}$/,'alert':'最大输入30字符，请重新输入'}],
			birthday:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[1-2][0-9]{3}\-(([0-2]{1}[0-9]{1})|(3[0-1]{1}))(\-([0-2]{1}[0-9]{1})|(3[0-1]{1}))$/,'alert':'只允许数字、“-”'}],
			email:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-zA-Z0-9]*)(?:[a-zA-Z0-9](?!-))(?:\.(?!-)))+[a-zA-Z]{2,}$/,'alert':'只允许字母、数字或下划线'},
				{'regex':/^[a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-zA-Z0-9]*)(?:[a-zA-Z0-9](?!-))(?:\.(?!-)))+[a-zA-Z]{2,60}$/,'alert':'最大输入限制60字符，请重新输入'}
			],
			qq:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'},
				{'regex':/[1-9][0-9]{4,29}/,'alert':'输入5-30位数字，请重新输入'}],
			weixin:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'}],
			weibo:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'},
				{'regex':/\w{4,24}/,'alert':'输入4-24位字符，请重新输入'}],
			remark:[
				{'regex':/\S/,alert:'格式错误，不允许为空'},
				{'regex':/^[^<>//]*$/,'alert':'格式错误，请重新输入'},
				{'regex':/\w{0,200}/,'alert':'最大输入限制200字符，请重新输入'}]
		};
	};
	initUserInfo().then(function(){
		init();
	});
	var init = function() {
		initConfig();
		bindLitener();
		initPlugsin();
	};
};
module.exports = ProfileUser;
