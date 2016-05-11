
/*
* @author denzel
*/

var FastMsgModal =function(node,core,config) {

	var global = core.getGlobal();
	//TODO 模板/js/资源引用
	var loadFile = require('../../util/load.js')();
	var FastLayer = require('./fastLayer.js');
	var Dialog = require('../../util/modal/dialog.js');
	var Promise = require('../../util/promise.js');

	var outer={};
	// var config = {};//封装数据
  //TODO 预加载对象
	var oShortcut;//快捷回复
	var oRightQuickLeft;//快捷回复左侧列表
	var oRightQuickRight;//快捷回复右侧回复列表
	var oShadowLayer;//快捷回复弹层

	// var LocString = String(window.document.location.href);
	// function getQueryStr(str) {
	// 	var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
	// 	if (tmp = rs) {
	// 		return tmp[2];
	// 	}
	// 	return "";
	// }
	// config.id = getQueryStr("id");

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
		loadFile.load(global.baseUrl+'views/rightside/fastreplyleft.html').then(function(value){
				var _html = doT.template(value)({
					'list':data
				});
				$(oRightQuickLeft).append(_html);
		});
		loadFile.load(global.baseUrl+'views/rightside/fastreplyright.html').then(function(value){
				var _html = doT.template(value)({
					'list':data
				});
				$(oRightQuickRight).append(_html);
		});
	};
	//初始化数据
	var initData = function(){
		var promise =  new Promise();
			var getQuickListUrl = "reply/replyGrouplist.action";
			$.ajax({
						type:"post",
						cache:false,
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
								loadFile.load(global.baseUrl+"views/rightside/fastreplylayer.html").then(function(value){

											var _html = doT.template(value)({
												'list':data
											});
											 outer.dialog = new Dialog({
												'title':'快捷回复',
												'footer':false
											});
											outer.dialog.setInner(_html);
											outer.shadowNode = outer.dialog.getOuter();
											promise.resolve();
								});
						}
					});
					return promise;
	};
	//弹出快捷回复
	function onShortCutFun(){
		FastLayer(outer.shadowNode,core,config);
		outer.dialog.show();
	}

	var bindLitener = function() {
		$(oRightQuickLeft).on('click','li',onTapGetRightRep);
		$(oRightQuickRight).on('click','li',onRightRepToOut);
		$(oShortcut).on('click',onShortCutFun);//点击快捷回复
		onRightGroup(config.fastData);
	};
	var init = function() {
		parseDOM();
		bindLitener();
	};
	initData().then(function(){
			init();
	});
};

module.exports = FastMsgModal;
