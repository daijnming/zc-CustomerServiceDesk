
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
			sugguestions;

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
		dataType:"JSONP",
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
	//点击智能回复答案 进行回复
	var onSendAnswer = function(){
		var $this = $(this);
		$(document.body).trigger('rightside.onselectedmsg',[{
			'data':$($this[0]).text()
		}]);
	};

//文本点击禁止
$(homeuser).on('click','.js-robotBackHideBtn',function(){
	quickSearch($(homeuser).find('input#quickSerch')[0].value);
	$(this).hide();
});
//相关搜索点击事件
$(sugguestions).on('click','li',function(ev) {
	quickSearch($(this).attr('list'));
	setTimeout(function(){
		//返回按钮
		$(homeuser).find('.js-robotBackHideBtn').show();
	},100);
});
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
	//直接发送按钮
	var onDirectSendBtn = function(){
		var $this = $(this);
		var _answer = $(robotAnswer).find('a');
		//type=3 未搜索到智能回复答案 不进行发送
		if(_answer.html()===''||_answer.attr('answerType')==='3')return;
		//TODO 调取外部接口 直接给用户发送智能回复答案
			// console.log($(robotAnswer).find('a').html());
			$(document.body).trigger('rightside.directsendreply',[{
					'data':$(robotAnswer).find('a').html()
			}]);
	};

	var parseDOM = function() {
    oHomeuser = $(node).find('.js-tab-pane#homeuser');
		robotDirectHideBtn = $(node).find('.js-homeUserBox .js-robotDirectHideBtn');
		relevantSearchHideBtn = $(node).find('.js-homeUserBox .js-relevantSearchHideBtn');
		robotAnswer = $(node).find('.js-robotAnswer');
		sugguestions = $(node).find('.js-robotSugguestions');
	};
  var onReceive = function(value,data) {

  };
	var onloadHandler = function(evt,data) {

	};
	var bindLitener = function() {
			$(oHomeuser).delegate('#quickSerch','keyup',onSerchContent);
			$(robotDirectHideBtn).delegate('a.quickSendBtn','click',onDirectSendBtn);
			$(robotAnswer).delegate('a','click',onSendAnswer);

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
