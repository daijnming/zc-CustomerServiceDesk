/*
* @author denzel
*/

function RightSide(node,core,window) {

  var LocString = String(window.document.location.href);
  //左侧用户点击保存右侧相应tab选项卡
  //{uid:xx,tabId:xx,tabData:{}}
  var switchTabBox=[];

  function getQueryStr(str) {
		var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
		if (tmp = rs) {
			return tmp[2];
		}
		return "";
	}
  var config ={
     version:'5.0' //chat项目重构 5.0版本
  };
  config.id = getQueryStr('id');
  //TODO 配置 api 说明

  var height = $(window).height();
  var newHeight = $(window).height() -50;
  //TODO 预加载对象
  var tabSwitchBtn,//右侧上方UL元素
      tabSwitchBody;//右侧对应内容展示区

  //TODO 模板/js/资源引用
	// var template = require('./template.js');
  var profileuser =  require('./profileuser/index.js');
  var messageUser =  require('./messagesuser/index.js');
  var homeuser = require('./homeuser/index.js');


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
    //智能回复得高度
    $("#homeuser").css('height',newHeight-52 +'px');
    $("#homeuser .homeUserBox").css('height',newHeight-52-40-52 +'px');
    //快捷回复，左，右侧列表
    $('.rightQuickLeft,.rightQuickRight').css('height',newHeight  -80 +'px');
    //iframe
    $("#clientSystem").css('height',newHeight-52 +'px');
    $("#clientSysIframe").css('height',newHeight-52 +'px');

    $('.js-tab-pane#profileuser').css('height',newHeight-100+'px');

	};
  //上方按钮点击事件
  var onTopWrapClick = function(evn){
    var $this =$(this);
    var oId = $this.find('a').attr('oData');
    // console.log(oId);
    $(tabSwitchBody).each(function(i,v){
      if($(v).attr('id') == oId.toString()){
        $(v).addClass('active in').siblings('div').removeClass('active in');
      }
    });

    $this.addClass('active').siblings('li').removeClass('active');
  };

  //绑定右侧tab标签页
  var onSwitchTabBox = function(data){

  };

  var initData = function(data,userData){
      // console.log(userData);
      //初始化用户数据 -- 客户资料
      profileuser($('.js-tab-pane#profileuser'),core,userData);


      onSwitchTabBox(userData);

      console.log(userData);
  };

  //初始化右侧选项卡
  var changeRightTabOuter = function(){

  };
	var bindListener = function() {
    $(window).on('core.onload',onloadHandler);
    $(tabSwitchBtn).on('click','li',onTopWrapClick);
    $(document.body).on('leftside.onselected',initData);
	};

	var initPlugsin = function() {
        messageUser(node,core,config);
        homeuser(node,core,config);
	};

  //初始化接口
  var initInterface = function(){

  };

	var init = function() {

    $('.js-tab-pane#profileuser').addClass('showBg');

		parseDOM();
		bindListener();
		initPlugsin();
    initData();
	};
	$(document.body).on("core.onload",function(evt){
      init();
  });
}

module.exports = RightSide;
