
/*
* @author denzel
*/

var FastMsgModal =function(node,core,window) {

	var global = core.getGlobal();
	//TODO 模板/js/资源引用
	var Modal = require('../../util/modal/dialog.js');
	var loadFile = require('../../util/load.js')();
	var FastLayer = require('./fastLayer.js');

	var config = {};//封装数据
  //TODO 预加载对象
	var oShortcut;//快捷回复
	var oRightQuickLeft;//快捷回复左侧列表
	var oRightQuickRight;//快捷回复右侧回复列表
	var oShadowLayer;//快捷回复弹层

	var LocString = String(window.document.location.href);
	function getQueryStr(str) {
		var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
		if (tmp = rs) {
			return tmp[2];
		}
		return "";
	}
	config.id = getQueryStr("id");

	var parseDOM = function() {
		oShortcut = $(node).find('.js-panel-body .js-tab-pane#messagesuser .js-shortcut');
		oRightQuickLeft = $(node).find('.js-rightQuickLeft ul');
		oRightQuickRight = $(node).find('.js-rightQuickLRight ul');
		oShadowLayer = $('.zc-shadow-layer .modal-dialog');
	};
	//点击快捷回复进行回复
	var onRightRepToOut = function(){
		var $this = $(this);
		console.log($this);
	};
	//点击获取快捷回复
	var onTapGetRightRep = function(){
		var $this = $(this);
		var oLi =$(oRightQuickRight).find('li');
		$(oLi).removeClass('active');
		for(var i=0;i<oLi.length;i++){
			if($(oLi[i]).attr('gid')==$this.attr('gid')){
				$(oLi[i]).addClass('active');
			}
		}
	};
	//加载右侧快捷分组
	var onRightGroup = function(data){
		for(var i=0;i<data.length;i++){
			var oGLi = '<li class="oTapGetRightRep" gid="'
			+data[i]["groupId"]+
			'">'
			+data[i]["groupName"]+
			'</li>';
			if(data[i]['quickreply'].length>0){
				for(var j=0;j<data[i]['quickreply'].length;j++){
					var oRLi = '<li class="oRightRepToOut" style="word-wrap: break-word;" class="quickClick"  gid="'
					+data[i]["quickreply"][j]["groupId"]+
					'">'
					+data[i]["quickreply"][j]["value"]+
					'</li>';
					$(oRightQuickRight).append(oRLi);
				}
			}
			$(oRightQuickLeft).append(oGLi);
		}
	};
	//初始化数据
	var onloadHandler = function() {
		var getQuickListUrl = "reply/replyGrouplist.action";
		$.ajax({
					type:"post",
					cache:false,
					// asynce:false,
					data:{
						'userId':config.id
					},
					url:getQuickListUrl,
					dataType:"jsonp",
					success:function(data){
						config.fastData = data;
						if(!data)
						{
								$(node).find('.js-rightQuickLeft ul').html('');
								$(node).find('.js-rightQuickRight ul').html('');
								return ;
						}
							onRightGroup(data);
					}
				}).then(function(){
							FastLayer([node,oShadowLayer],core,config);
				});

	};
	// var dialog = new Modal({
	// 'title':'快捷回复',
	// 'footer':false
	// });
	// loadFile.load(global.baseUrl+'views/rightside/fastreply.html').then(function(value){
	// 	dialog.setInner(value);
	// });
	// dialog.show();
	//弹出快捷回复
	function onShortCutFun(){

	// 	var dialog = new Modal({
	// 	'title':'快捷回复',
	// 	'footer':false
	//  });
	//  loadFile.load(global.baseUrl+'views/rightside/fastreply.html').then(function(value){
	// 	dialog.setInner(value);
	//  });
	//  dialog.show();

	}
	var bindLitener = function() {
		$(window).on('core.onload',onloadHandler);//加载load事件
		$(oRightQuickLeft).on('click','li',onTapGetRightRep);
		$(oRightQuickRight).on('click','li',onRightRepToOut);
		$(oShortcut).on('click',onShortCutFun);//点击快捷回复
	};
	var initPlugsin = function() {
		// FastLayer([node,oShadowLayer],core,config);
	};
	var init = function() {
		parseDOM();
		bindLitener();
		initPlugsin();
	};
	$(document.body).on('core.onload',init());
};

module.exports = FastMsgModal;
