/*
* @author denzel
* by 05.06.2016
*/

function RightSide(node,core,window) {

  //TODO 配置 api 说明
  var config ={
     version:'5.0' //chat项目重构 5.0版本
  };
  var height = $(window).height();
  var newHeight = $(window).height() -50;

  //TODO 预加载对象
  var tabSwitchBtn,//右侧上方UL元素
      tabSwitchBody;//右侧对应内容展示区

  //TODO 模板/js/资源引用
	// var template = require('./template.js');
  var profileuser =  require('./profileuser/index.js');
  var messageUser =  require('./messagesuser/index.js');


	var parseDOM = function() {
    tabSwitchBtn = $(node).find('.js-panel-body ul.js-nav-tabs');
    tabSwitchBody = $(node).find('.js-panel-body .js-tab-content .js-tab-pane');
	};

  var newUserMessage = function(data) {
    var _html = doT.template(template.listItem)(data);
    var li = $(_html);
    $(node).find(".js-users-list").append(li);
  };
  var onReceive = function(value,data) {
    console.log(Object.prototype.toString.call(data));
    if(data.type == 102) {
      newUserMessage(data);
    }
  };

	var onloadHandler = function(evt,data) {
		//$(node).find("img.js-my-logo").attr("src",data.face);
		//$(node).find(".js-customer-service").html(data.name);
    //智能回复得高度
    $("#homeuser").css('height',newHeight-52 +'px');
    $("#homeuser .homeUserBox").css('height',newHeight-52-40-52 +'px');
    //快捷回复，左，右侧列表
    $('.rightQuickLeft,.rightQuickRight').css('height',newHeight  -80 +'px');
    //iframe
    $("#clientSystem").css('height',newHeight-52 +'px');
    $("#clientSysIframe").css('height',newHeight-52 +'px');

	};
  //上方按钮点击事件
  var onTopWrapClick = function(evn){
    var that = this;
    var oId = $(that).find('a').attr('oData');
    console.log(oId);
    $(tabSwitchBody).each(function(i,v){
      if($(v).attr('id') == oId.toString()){
        $(v).addClass('active in').siblings('div').removeClass('active in');
      }
    });

    $(that).addClass('active').siblings('li').removeClass('active');
  };
	var bindLitener = function() {
		// $(document.body).on("RightSide.onload",onloadHandler);
		// $(document.body).on("RightSide.receive",onReceive);
    $(window).on('core.onload',onloadHandler);
    $(tabSwitchBtn).on('click','li',onTopWrapClick);
	};

	var initPlugsin = function() {
        messageUser(node,core,window);
	};

	var init = function() {
		parseDOM();
		bindLitener();
		initPlugsin();
	};

	$(document.body).on("core.onload",function(evt){
      init();
  });
}

module.exports = RightSide;
