// function RightSide(node,core,window) {
//
//   var that = this;
//
//   var fun = function(){
//     alert('aa');
//   };
//   var init = function(){
//     fun();
//   };
//   init();
//
// }
// module.exports = RightSide;

// (function(win){
//
//   //TODO 对象，参数 配置
//   var config ={
//     //chat项目 重构 5.0版本
//     version:'5.0',
//     //对象元素
//     doms:{
//       goProfileuser:'#goProfileuser',
//       goMessage:'#goMessage',
//       gotoQuick:'#gotoQuick',
//       clientSystems:'#clientSystems',
//       tabBtn:'#main-container #min-wrapper #main-content .container-fluid #chatlist .right .rightBox .panel-body .nav-tabs'
//     }
//   };
//
//   //TODO 初始化右侧点击事件
//   $(config.doms.tabBtn).on('click','li',function(obj){
//     console.log(obj);
//   });
//
//   var init = function(){
//   };
//   //TODO 初始化
//   init();
//
//
//
// })(window);

function RightSide(node,core,window) {

  var tabBtn;//右侧上方UL元素
  var config ={
    //chat项目重构 5.0版本
    version:'5.0'
  };
	var template = require('./template.js');
	var parseDOM = function() {
    tabBtn = $(node).find('.panel-body ul');
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
    // alert();
	};
  //上方按钮点击事件
  var onTopWrapClick = function(obj){
    console.log(obj);
  };
	var bindLitener = function() {
		// $(document.body).on("RightSide.onload",onloadHandler);
		// $(document.body).on("RightSide.receive",onReceive);
    $(tabBtn).on('click','li',onTopWrapClick);
	};

	var initPlugsin = function() {

	};

	var init = function() {
		parseDOM();
		bindLitener();
		initPlugsin();
	};

	init();
}

module.exports = RightSide;
