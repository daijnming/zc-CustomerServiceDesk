/*
 * @author denzel
 */

var HomeUser = function(node,core,config) {

	var global = core.getGlobal();
	//TODO 预加载对象
	var homeuser,//智能回复
			robotDirectHideBtn,//直接回复
			relevantSearchHideBtn,//相关搜索
			robotAnswer,
			sugguestions,
			robotBack;//返回按钮

	var cnf={
		uid:''
	};//用户信息
  //TODO 模板/js/资源引用
	// var template = require('./template.js');

	var quickSearch=function(val){
	$(robotDirectHideBtn).hide();
	$(relevantSearchHideBtn).hide();
	$(robotAnswer).find('a')[0].innerHTML='';
	$(sugguestions).find('ul')[0].innerHTML='';
	var searchUrl = "admin/internalChat1.action";
	$.ajax({
		type:"post",
		url:searchUrl,
		dataType:"json",
		data:{
			uid:config.id,
			requestText:val
		},
		success:function(data){
				//yy
				disSearchWeb(data);
		}
	});
	function disSearchWeb(data)
	{
		if(data.answer !== "")
		{
			if(data.pid===null){
				data.pid=0;
			}
			$(robotAnswer).find('a').html(data.answer);
			$(robotAnswer).find('a').attr('answerType',data.answerType);
			$(robotAnswer).find('a').attr('docId',data.docId);
			$(robotAnswer).find('a').attr('pid',data.pid);
			$(robotAnswer).find('a').attr('questionId',data.questionId);
			//搜索结果 直接发送 按钮显示
			$(robotDirectHideBtn).show();
			$(robotDirectHideBtn).find('a').css('color','#f90');
		}else{
			//置灰直接发送
			$(robotDirectHideBtn).find('a').css('color','#ddd');
		}
		//yy如果没有 建议选项直接 return
		if(data.sugguestions === null)return;
		//yy如果有 显示 相关搜索
		$(relevantSearchHideBtn).show();
		$(sugguestions).find('ul').html('');
			var _template = require('./template.js');
			for(var i = 0 ; i < data.sugguestions.length ;i++)
			{
				var comf = $.extend({
					'num':(i+1),
					'question':(i+1)+'.'+data.sugguestions[i].question
				});
				var _html = doT.template(_template.sugguestionsItem)(comf);
				$(sugguestions).find('ul').append(_html);
			}
		}
	};
	var onLoadUserInfo = function(evn,data){
		cnf.uid = data?data.userData.uid:'';
		cnf.cid = data?data.data.cid:'';

		// console.log(data);
	};
	//智能回复
	var onChatSmartReply = function(e){
		//阻止默认事件
		// e.preventDefault();
		// e.stopPropageation();
		// console.log('aaa');
		var $this = $(this);
		var obj={},
			_answer = $(robotAnswer).find('a');
		//type=3 未搜索到智能回复答案 不进行发送
		if(_answer.html()===''||_answer.attr('answerType')==='3'||cnf.uid===''||cnf.cid==='')return;

		if($this.hasClass('quickSendBtn')){
			//直接发送
			obj.status='1';
			obj.msg = $(robotAnswer).find('a').html();
			obj.docid = $(robotAnswer).find('a').attr('docid');
		}else{
			//存到发送框
			obj.status='2';
			obj.txt = $this.text();//纯文本
			obj.msg = $this.html();//富文本
		}
		// console.log(obj.txt+':'+obj.msg);
		obj.uid = cnf.uid;
		obj.cid = cnf.cid;
		//TODO 调取外部接口 直接给用户发送智能回复答案
		$(document.body).trigger('rightside.onChatSmartReply',[{
				'data':obj
		}]);
	};
//相关搜索返回
var onBackAnswer = function(){
	quickSearch($(homeuser).find('input#quickSerch')[0].value);
	$(this).hide();
};
//相关搜索点击事件
var onSuggestions= function(){
	quickSearch($(this).attr('list'));
	setTimeout(function(){
		//返回按钮
		$(homeuser).find('.js-robotBackHideBtn').show();
	},100);
};
	//查询智能回复
	var onSerchContent = function(evn){
		var $this = $(this);
		// console.log(this.value)
		if($this.val().length === 0)return;
		if(evn.keyCode == 13)
		{
			quickSearch($this.val());
			$(homeuser).find('.js-robotBackHideBtn').hide();
		}
	};
	//用户tab保存切换保存智能搜索信息
	var onTabSwitch = function(evn,data){
		// console.log(data.data);
		quickSearch(data.data);
	};
	//聊天页面点击内容获取智能搜索答案
	var onGetReplyByChat = function(evn,data){
		// data.str data.uid
		//显示智能回复页面
		var homeNav = $(node).find('.js-panel-body .js-nav-tabs li#homeuser');
		var homeBody = $(node).find('.js-panel-body .js-tab-content');
		var oId = $(homeNav).attr('id');
		$(homeNav).addClass('active').siblings('li').removeClass('active');
		$(homeBody).find('.js-tab-pane').each(function(i,v){
			if($(v).attr('id') == oId.toString()){
				$(v).addClass('active in').siblings('div').removeClass('active in');
				$(v).find('input').val(data.str);
				quickSearch(data.str);
				return;
			}
		});
	};
	var parseDOM = function() {
    homeuser = $(node).find('.js-tab-pane#homeuser');
		robotDirectHideBtn = $(node).find('.js-homeUserBox .js-robotDirectHideBtn');
		relevantSearchHideBtn = $(node).find('.js-homeUserBox .js-relevantSearchHideBtn');
		robotAnswer = $(node).find('.js-robotAnswer');
		sugguestions = $(node).find('.js-robotSugguestions');
		robotBack = $(node).find('.js-robotBackHideBtn');
	};
  var onReceive = function(value,data) {

  };
	var onloadHandler = function(evt,data) {

	};
	var bindLitener = function() {
		$(document.body).on('leftside.onselected',onLoadUserInfo);//加载用户信息 点击左侧用户列表才会触发
		$(document.body).on('scrollcontent.onSearchUserChat',onGetReplyByChat);//点击聊天内容获取智能回复
		$(document.body).on('rightside.onTabSwitch',onTabSwitch);
		$(robotBack).on('click',onBackAnswer);
		$(homeuser).delegate('#quickSerch','keyup',onSerchContent);
		$(robotDirectHideBtn).delegate('a.quickSendBtn','click',onChatSmartReply);
		$(robotAnswer).delegate('a','click',onChatSmartReply);
		$(sugguestions).delegate('li','click',onSuggestions);



	};

	//点击聊天内容进行智能回复搜索
	var ISearchReplyOuter = function(obj){
		if(!obj)return;
	};
	//初始化接口
	var initInterface = function(){
			ISearchReplyOuter();
	};

	var init = function() {
		parseDOM();
		bindLitener();
		initInterface();
	};
	init();


};
module.exports = HomeUser;
