
/*
* @author denzel
* by 05.06.2016
*/

(function(node) {

	//TODO api addr
	var apihost = "";
	var Modal = require('../../util/modal/dialog.js');
	console.log('aaaa')
	var dialog = new Modal({
		'title':'aaaa'
	});
	dialog.setInner();
	//dialog.show();
  //TODO 预加载对象
	var oShortcut;//快捷回复
	var oShadowRep;//快捷回复弹窗
	var oShadowLayer;
	var oRightQuickLeft;//快捷回复左侧列表
	var oRightQuickRight;//快捷回复右侧回复列表

	/***/
	var oLeftUl;
	var oRightUl;
	var oLeftInput ;
	var oRightInput ;
	var oAddNewRep ;//添加新分组
	var oAddNewGroup;//添加新回复

  //TODO 模板/js/资源引用
	var Modal = require('./template.js');

	var LocString = String(window.document.location.href);
	function getQueryStr(str) {
		var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString), tmp;
		if (tmp = rs) {
			return tmp[2];
		}
		return "";
	}
	var id = getQueryStr("id");

	var parseDOM = function() {
		oShortcut = $(node).find('.js-panel-body .js-tab-pane#messagesuser .js-shortcut');
		oShadowRep = Modal.zcShadowLayer;
		oShadowLayer = '.js-zc-short-shadow';
		oRightQuickLeft = $(node).find('.js-rightQuickLeft ul');
		oRightQuickRight = $(node).find('.js-rightQuickLRight ul');
		$(document.body).append(oShadowRep);
		oLeftUl = $(node).find('.js-leftContent ul');
		oRightUl = $(node).find('.js-rightContent ul');
		oLeftInput = $(oLeftUl).find('input');
		oRightInput = $(oRightUl).find('input');
		oAddNewRep = $(node).find('.js-addNewRep');
		oAddNewGroup = $(node).find('.js-addNewGroup');
	};
	var mask = {
		show:function(){

			$(oShadowLayer).animate({
					'opacity' : 0.9
			},100, function() {
				$(oShadowLayer).css('display','block');
			});
		},
		hide:function(){
			$(oShadowLayer).animate({
					'opacity' : 0
			},100, function() {
				$(oShadowLayer).css('display','none');
			});
		}
	};
  // var onReceive = function(value,data) {
	//
  // };

	var onloadHandler = function(evt,data) {
		var That = this;
		That.load = function(did){

			var getQuickListUrl = apihost+"reply/replyGrouplist.action";
			$.ajax({
						type:"post",
						cache:false,
						data:{
							'userId':id
						},
						url:getQuickListUrl,
						dataType:"jsonp",
						success:function(data){
							console.log(data);
							if(!data)
							{
								if(did){
									$(node).find('.js-rightQuickLeft ul').html('');
									$(node).find('.js-rightQuickRight ul').html('');
								}
								return ;
							}
							if(did)   //刚进入页面
							{
								That.loadRightGroup(data);
								That.loadShadowLayer(data,That);
							}
						}
					});
		};
		//加载右侧快捷分组
		That.loadRightGroup=function(data){
				for(var i=0;i<data.length;i++){
					var oGLi = '<li onclick="loadRightRep(this)" gid="'+data[i]["groupId"]+'">'+data[i]["groupName"]+'</li>';
					if(data[i]['quickreply'].length>0){
						for(var j=0;j<data[i]['quickreply'].length;j++){
							var oRLi = '<li onclick="loadRightRepToOut(this)" style="word-wrap: break-word;" class="quickClick"  gid="'+data[i]["quickreply"][j]["groupId"]+'">'+data[i]["quickreply"][j]["value"]+'</li>';
							$(oRightQuickRight).append(oRLi);
						}
					}
					$(oRightQuickLeft).append(oGLi);
				}
		};
		//点击获取快捷分组回复列表
		That.loadRightRep=function(obj){
					console.log(obj);
					var oLi =$(oRightQuickRight).find('li');
					$(oLi).removeClass('active');
					for(var i=0;i<oLi.length;i++){
						if($(oLi[i]).attr('gid')==$(obj).attr('gid')){
							$(oLi[i]).addClass('active');
						}
					}
		};
		//点击回复进行输出
		That.loadRightRepToOut =function(obj){
				console.log(obj);
		};
		//加载弹出层快捷回复数据
		That.loadShadowLayer = function(data,That){
			for(var i=0;i<data.length;i++){
				var oGLi =	'<li class="detalBar" gid="'+data[i]["groupId"]+'"><input type="text"  value="'+data[i]["groupName"]+'" ><span class="delLeftGroup">删除</span><span class="upLeftGroup" >置顶</span></li>';
				if(data[i]['quickreply'].length>0){
					for(var j=0;j<data[i]['quickreply'].length;j++){
						  var oRLi =  '<li class="detalBar hide" gid="'+data[i]["quickreply"][j]["groupId"]+'"><input type="text"  value="'+data[i]["quickreply"][j]["value"]+'" ><span onclick="onDetalDel(this)">删除</span><span onclick="onDetalUp(this)">置顶</span></li>';
						$(oRightUl).append(oRLi);
					}
				}
				$(oLeftUl).append(oGLi);
			}
			//TODO 左侧鼠标移动 背景
			$(oLeftUl).on('mouseover','li',function(){
					$(this).addClass('active').siblings('li').removeClass('active');
					$(this).find('input').addClass('active').parent('li').siblings('li').find('input').removeClass('active');
			})
			//鼠标移出 背景
			.on('mouseleave','li',function(){
					$(this).removeClass('active');
					$(this).find('input').removeClass('active').blur();
			})
			//鼠标点击事件
			.on('click','li',function(){
			 $(this).addClass('activeLine').siblings('li').removeClass('activeLine');
				$(this).find('input').addClass('activeLine').parent('li').siblings('li').find('input').removeClass('activeLine');
				//清空右侧回复
				var oLi =$(oRightUl).find('li');
				$(oLi).removeClass('show');
				for(var i=0;i<oLi.length;i++){
					if($(oLi[i]).attr('gid')==$(this).attr('gid')){
						$(oLi[i]).addClass('show');
						$(oLi[i]).find('input').removeClass('hide');
					}
				}
			});
			//TODO 右侧鼠标移动
			$(oRightUl).on('mouseover','li',function(){
					$(this).addClass('active').siblings('li').removeClass('active');
					$(this).find('input').addClass('active').parent('li').siblings('li').find('input').removeClass('active');
			})
			//鼠标移出 背景
			.on('mouseleave','li',function(){
					$(this).removeClass('active');
					$(this).find('input').removeClass('active').blur();
			});
			//删除快捷回复组
			$(oLeftUl).on('click','.delLeftGroup',function(){
				console.log(this);
			})
			//置顶快捷回复组
			.on('click','.upLeftGroup',function(){
				var oLi = $(this).parent('li');
				var oUl = $(this).parent('li').parent('ul');
				$(oUl).prepend(oLi);
			})
			//修改分组名
			.on('keypress','input',function(e){
				var key = e.which;
					if (key == 13&&!e.shiftKey) {
						$(this).blur();
						console.log('e');
						return false;
					}
			})
			.on('blur','input',function(e){
				var obj=this;
				console.log(That.inputText);
				if($(obj).val().replace(/(^\s*)|(\s*$)/g,"")==""||$(obj).val()==null||$(obj).val()==undefined){
					var oGroupId =$(obj).parent('li.detalBar').attr('gid');
					//
					if(oGroupId)							//修改分组名
					{
						$(obj).val(That.inputText);

					}else{

						$(obj).parent('li.detalBar').remove();
					}
					This.leftfocus=false;
					return;
				}
			//	SavequickLeftInput(obj);
			});
		};
		That.load(true);
	};

	var bindLitener = function() {
		$(window).on('load',onloadHandler);//加载load事件
		$(oShortcut).on('click',onShortCutFun);//点击快捷回复
		$(oShadowLayer).on('click',onShadowFun);//点击空白处
	};

	var onAddNewGroup = function(){
		var oListInput = $(oLeftUl).find('li')[$(oLeftUl).find('li').length-1];
		console.log(oListInput);
		if($(oLeftUl).find('li').length > 0){
			if(!$(oListInput).find('input').val()){
				$(oListInput).remove();
			}else{
				var oHtml = '<li class="detalBar"><input type="text" placeholder="请输入..." ><span onclick="onDel(this)">删除</span><span onclick="onUp(this)">置顶</span></li>';
				$(oLeftUl).append(oHtml);
				$(oLeftUl).find('input').focus();
			}
		}else{
			var oHtml = '<li class="detalBar"><input type="text" placeholder="请输入..." ><span onclick="onDel(this)">删除</span><span onclick="onUp(this)">置顶</span></li>';
			$(oLeftUl).append(oHtml);
			$(oLeftUl).find('input').focus();
		}
	};
	var onAddNewRep = function(){

	};
	var onGetRightRep = function(that){
			console.log(that);
	};
	//弹出快捷回复
	function onShortCutFun(){
			mask.show();
			$(oAddNewGroup).on('click',onAddNewGroup);
			$(oAddNewRep).on('click',onAddNewRep);

	}

	function onShadowFun(evn){
		if(evn.target.className.toLowerCase()=='js-zc-short-shadow zc-short-shadow') mask.hide();
	}


	var initPlugsin = function() {

	};
	var init = function() {
		parseDOM();
		bindLitener();
		initPlugsin();
	};
	init();


})($('body'));
