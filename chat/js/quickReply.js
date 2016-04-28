//快捷回复
$("#shortcut").click(function(){
	var oHtml = '<div class="quickBox"><div class="quickLeft col-md-4"><a href="javascript:;" class="quickBtn addGroupBtn"><i class="fa fa-plus"></i>添加新分组</a></div><div class="quickRight col-md-8"><ul class="reply"></ul></div></div>'
	bootbox.dialog({
		size:"large",
		title:"快捷回复",
		message:oHtml
	});


	var oRun = new quickReply();
	oRun.load();
	oRun.disRun();
	//弹出框加滚动条
	//左侧加滚动条
	$('.quickLeft').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});
	//右侧加滚动条
	$('.quickRight').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});

	// 显示滚动条
	setTimeout(function(){
		$(".quickLeft , .quickRight").css({'overflow': 'auto'});
		$(".quickLeft , .quickRight").height('300px');
		// $(".quickRight").css({'overflow': 'auto'});
		// $(".quickRight").height('300px');
	},100);
});
function quickReply()
{

	    //oLeftDom = '<p class="quickList parentQuick"><input type="text" value="	" placeholder="新分组" class="groupInput"><a href="javascript:;" class="groupSave">保存</a><a href="javascript:;" class="groupDelet">删除</a></p>',
		//oRightDom = '<p class="quickList"><input type="text" value="" placeholder="新回复" class="quickInput"><a href="javascript:;" class="quickSave">保存</a><a href="javascript:;" class="quickCancel">删除</a></p>',


	var oLeftDom = '<p class="quickList parentQuick"><input type="text" value="	" placeholder="新分组" maxlength="20" class="groupInput"><a href="javascript:;" class="groupDelet"  style="float: right;">删除</a></p>',
		oRightDom = '<p class="quickList rightQuick"><input type="text" value="" placeholder="新回复" class="quickInput"><a href="javascript:;" class="quickCancel"  style="float: right;">删除</a></p>',
		replyDom = '<li class="replyList addNewQuick"><a href="javascript:;" class="quickBtn"><i class="fa fa-plus"></i>添加新回复</a></li>';
	var This = this;
		This.companyId = pid;
		This.inputText="";
		This.leftfocus=false;
		This.load = function(right)
		{
			var getQuickListUrl = apihost+"reply/replyGrouplist.action";
			$.ajax({
				type:"post",
				cache:false,
				data:{
					'userId':myid
				},
				url:getQuickListUrl,
				dataType:"jsonp",
				success:function(data){
					if(!data)
					{
						//This.load();
						if(right){
							$('#messagesuser .rightQuick .rightQuickRight ul').html("");
							$('#messagesuser .rightQuick .rightQuickLeft ul').html("");
						}
						console.log("加载快速回复失败。" + getQuickListUrl);
						return ;
					}
					if(right)   //刚进入页面
					{
						This.loadRight(data);
					}
					else
					{
						This.disJson(data);
					}

				}
			})
		};
		This.loadRight = function(data)
		{
			$('#messagesuser .rightQuick').html(' ');
			$('#messagesuser .rightQuick').html('<div class="col-md-4 col-xs-4 rightQuickLeft"><ul></ul></div><div class="col-md-8 col-xs-8 rightQuickRight"><ul></ul></div>');

			for(var i = 0 ; i < data.length ; i++)
			{
				var rightLeftDom = '<li groupId="'+ data[i].groupId +'" class="rightLeftBtn">'+ data[i].groupName +'</li>';
				$('#messagesuser .rightQuick .rightQuickLeft ul').append(rightLeftDom);
				$('#messagesuser .rightQuick .rightQuickRight ul').append('<li groupId="'+ data[i].groupId +'"></li>');
				for(var j = 0 ;j < data[i].quickreply.length ; j++)
				{
					var RightListDom = '<a href="javascript:;" class="quickClick" style="word-wrap: break-word;" >'+ data[i].quickreply[j].value +'</a>';
					$('#messagesuser .rightQuick .rightQuickRight ul li[groupId="'+ data[i].groupId +'"]').append(RightListDom);
				}
			}
			This.rightQuick();
			//$('.rightQuick').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});
			//$('.scrollBox').scrollTop(999999);
			//左侧加滚动条
			$('.rightQuickLeft').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});
			//右侧加滚动条
			$('.rightQuickRight').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});

		};
		//右侧静态事件
		This.rightQuick = function()
		{
			$('#messagesuser .rightQuickLeft').on('click','.rightLeftBtn',function(){
				var oIn = $(this).index();
				$('#messagesuser .rightQuickLeft ul li').removeClass('active');
				$(this).addClass('active');

				$(".rightQuickRight").css({'overflow-y': 'auto'});
				$(".rightQuickRight").height('100%');
				$(".rightQuickRight").css({'overflow': 'hidden'});

				$('#messagesuser .rightQuickRight ul li').hide();
				$($('#messagesuser .rightQuickRight ul li')[oIn]).show();
				$(".rightQuickLeft").height($(".rightQuickRight").height() + 'px');
			});
			$(".rightQuickLeft").height('1px');
			$(".rightQuickRight").height('1px');
			//快捷回复选择语句
			$('#messagesuser .rightQuickRight').on('click','.quickClick',function(ev){
				var ocid = $('#left-navigation .mainNav .leftScroll li .active').attr('cid');
				if(ocid)
				{
					var oSobj = $('#chatlist .chat[cid="'+ ocid+'"] .botTextBox textarea');
					var oSatr = oSobj.val();
					oSobj.val(oSatr + ' ' + $(this).html());
					oSobj.val(oSobj.val().replace("请输入..",""));
					oSobj.focusEnd();
				}

			});
		}
		This.disJson = function(data)
		{
			$(".quickBox .quickList,.quickBox .replyList").remove();
			This.companyId = data[0].companyId;
			for(var i = 0 ; i < data.length ; i++)
			{
				var dataLeftDom = '<p class="quickList parentQuick" groupId="'+ data[i].groupId +'"><input type="text" value="'+ data[i].groupName +'" class="groupInput" maxlength="20"><a href="javascript:;" style="float: right;" class="groupDelet">删除</a></p>';

				//var dataLeftDom = '<p class="quickList parentQuick" groupId="'+ data[i].groupId +'"><input type="text" value="'+ data[i].groupName +'" class="groupInput"><a href="javascript:;" class="groupSave">保存</a><a href="javascript:;" class="groupDelet">删除</a></p>';
				$('.quickLeft .quickBtn').before(dataLeftDom);
				var replyLiDom = '<li class="replyList" groupId="'+ data[i].groupId +'"><a href="javascript:;" class="quickBtn"><i class="fa fa-plus"></i>添加新回复</a></li>';
				$('.quickBox .quickRight .reply').append(replyLiDom);
				for(var j = 0 ;j < data[i].quickreply.length ; j++)
				{
//					var dataRightDom = '<p class="quickList rightQuick"><input type="text" value="'+ data[i].quickreply[j].value +'" class="quickInput" quickId="'+ data[i].quickreply[j].id +'" groupId="'+ data[i].quickreply[j].groupId +'"><a href="javascript:;" class="quickSave">保存</a><a href="javascript:;" class="quickCancel">删除</a></p>';
					var dataRightDom = '<p class="quickList rightQuick"><input type="text" value="'+ data[i].quickreply[j].value +'" class="quickInput" quickId="'+ data[i].quickreply[j].id +'" groupId="'+ data[i].quickreply[j].groupId +'"><a href="javascript:;" style="float: right;" class="quickCancel">删除</a></p>';
					$('.quickBox .quickRight .reply .replyList[groupId="'+ data[i].groupId +'"]').find('.quickBtn').before(dataRightDom);
				}
			}
			This.leftfocus=false;
		};

		This.disRun = function(){
			/////事件处理部分
			$('.quickLeft .addGroupBtn').click(function(){
				if(This.leftfocus){
					setTimeout(function(){
						$('.quickLeft .addGroupBtn').click();
					},300)

				}else{
					$(this).before(oLeftDom);
					$('.quickRight .reply').append(replyDom);
					$('.quickRight .reply .replyList').hide();
					//$(this).hide();
					var newDom=$(this).prev();
					newDom.addClass("quickActive");
					newDom.find("input.groupInput").focus();
				}
				//$('.quickRight .reply .replyList:last').show();
			});
			$('.quickRight').on('click','.quickBtn',function(){
				//$(this).hide();
				$(this).before(oRightDom);
				var newDom=$(this).prev();
				//newDom.addClass("quickActive");

				newDom.find("input.quickInput").focus();
			});

			$('.quickLeft').on('click','.parentQuick',function(ev){
					// console.log(ev.target.tagName);
					//if(ev.target.className == 'groupInput' || ev.target.tagName == 'A')  editor yhw
			    if(ev.target.tagName == 'A')
					{
						return;
					}
					else {
						var hasFocus =  $(this).find("input.groupInput").is(':focus');
						if(!hasFocus){
						//$('.quickLeft .quickList').find('a').hide();
							$('.quickBox .quickList').find('a').hide();
						 $(this).find('a').show();
						}
					}
					var oIndex = $(this).index();
					$(".quickLeft").css({'overflow': 'auto'});

					$('.quickLeft .quickList').removeClass('quickActive');
					$(this).addClass('quickActive');
					$('.quickRight .replyList').hide();
					if($(this).attr("groupid"))
					{
						$($('.quickRight .replyList')[oIndex]).show();
					}

					$(".bootbox .quickLeft").height($(".bootbox .quickRight").height() + 'px');
			});

			$('.quickRight').on('click','.rightQuick',function(ev){
				//if(ev.target.className == 'groupInput' || ev.target.tagName == 'A')  editor yhw
			    if(ev.target.tagName == 'A')
				{
					return;
				}
				else
				{
					var hasFocus =  $(this).find("input.quickInput").is(':focus');
					if(!hasFocus){
					$('.quickRight .quickList').find('a').hide();
					 $(this).find('a').show();
					}
				}

	 	});

		  $('.quickBox').on("focus","input",function(ev){

			    $('.quickBox .quickList').find('a').hide();
			    This.inputText=$(this).val();
			    if($(this).parent().hasClass("parentQuick")){
			    	This.leftfocus=true;
			    }
					//$(this).nextAll().show();
			});
			//$('.quickRight').on("blur","input",function(ev){
				//$(this).nextAll().hide();
			//});



			//修改分组名,新增分组
			$('.quickLeft').on( "keypress",  "input",(function (e) {
			    var key = e.which;
			    if (key == 13&&!e.shiftKey) {

			    	//SavequickLeftInput(this);
			    	$(this).blur();
			    	return false;
			    }
			}));


			$('.quickLeft').on("blur","input",function(ev){
				var obj=this;
				if($(obj).val().replace(/(^\s*)|(\s*$)/g,"")==""||$(obj).val()==null||$(obj).val()==undefined){
					var oGroupId =$(obj).parent('.parentQuick').attr('groupid');
					//
					if(oGroupId)							//修改分组名
					{
						$(obj).val(This.inputText);

					}else{

						$(obj).parent('.parentQuick').remove();
					}
					This.leftfocus=false;
					return;
				}
				SavequickLeftInput(obj);
			});


			function SavequickLeftInput(obj){
         		var $this = $(obj);
				var oGroupId = $this.parent('.parentQuick').attr('groupid');
				var groupName = $(obj).val().replace(/(^\s*)|(\s*$)/g,"");
				//$this.html("正在保存...");.siblings('.groupInput')
				if(oGroupId)							//修改分组名
				{
					var upGroupNameUrl = apihost+'reply/updreplyGroup.action';   //?groupId='+ oGroupId +'&&groupName=' + groupName;
					$.ajax({
						type:"post",
						url:upGroupNameUrl,
						data:{
							'groupId':oGroupId,
							'groupName':groupName,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								//$('.quickLeft .addGroupBtn').show();
							//	$this.html("保存");
								//$this.hide();
								 $(obj).val(groupName);
								$this.nextAll().hide()
								This.load(true);
								This.leftfocus=false;
							}
						}
					})
				}
				else						//新增分组
				{
					 var addGroupUrl = apihost+'reply/addreplyGroup.action';//?groupName='+ groupName +'&&userId='+ myid +'&&companyId=' + This.companyId;
					 $.ajax({
						type:"post",
						url:addGroupUrl,
						data:{
							'groupName':groupName,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								$this.nextAll().hide()
								This.load(true);
								This.load();
								setTimeout(function(){
									$('.reply .replyList:last').show();
								},500)

							}
						}
					})
				}




             }
			//删除分组
			$('.quickLeft').on('click','.groupDelet',function(){
				var $this = $(this);
				var oIndex = $this.parent('.parentQuick').index();
				if($this.parent('.parentQuick').attr('groupid'))
				{
					var groupDeletUrl = apihost+'reply/delreplyGroup.action';
				$.ajax({
						type:"post",
						url:groupDeletUrl,
						data:{
							'groupId':$this.parent('.parentQuick').attr('groupid'),
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								$this.parent('.parentQuick').remove();
								$($('.quickRight .reply .replyList').get(oIndex)).remove();
								//console.log('删除分组成功');
								This.load(true);
							}
						}
					})
				}
				else
				{
					$this.parent('.parentQuick').remove();
				}
				$('.quickLeft .addGroupBtn').show();
			});

			//添加修改快速回复

			$('.quickRight').on( "keypress",  "input",(function (e) {
			    var key = e.which;
			    if (key == 13&&!e.shiftKey) {

			    	//SavequickRightInput(this)
			    	$(this).blur();
			    	return false;
			    }
			}));
			$('.quickRight').on("blur","input",function(ev){
				//$('.quickRight').on('click','.quickSave',function(){
				var obj=this;
		       if($(obj).val().replace(/(^\s*)|(\s*$)/g,"")==""||$(obj).val()==null||$(obj).val()==undefined){

		   			var oQuickid =$(obj).attr('quickid');
		   			//
					if(oQuickid)							//修改分组名
					{
						$(obj).val(This.inputText);
					}else{

						$(obj).parent('.quickList').remove();
					}



					return;
				}
				SavequickRightInput(this)
		    });

			function SavequickRightInput(Obj){

				var $this = $(Obj);
				var oInde = $this.parents(".replyList").index();

				var oGroupId = $($('.quickLeft .parentQuick')[oInde]).attr('groupid');
				var oText = $this.val().replace(/(^\s*)|(\s*$)/g,"");
				var oQuickid = $this.attr('quickid');
			   //$this.html("正在保存...");
				if(oQuickid)								//修改
				{
					var changeQuickUrl = apihost+'quick/updquickReply.action';//?id='+ oQuickid +'&&value='+ oText;
					$.ajax({
						type:"post",
						url:changeQuickUrl,
						data:{
							'id':oQuickid,
							'value':oText,
							'userId':myid

						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								//$this.html("保存");
								$this.
								$this.nextAll().hide();
								This.load(true);
								//$this.parents('.reply').find('.quickBtn').show();
							}
						}
					})
				}
				else										//添加
				{
					var addQuickUrl = apihost+'quick/addquickReply.action';//?groupId='+ oGroupId +'&&value='+ oText;
					$.ajax({
						type:"post",
						url:addQuickUrl,
						data:{
							'groupId':oGroupId,
							'value':oText,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								//$this.html("保存");
								//$this.hide();
								$this.attr("quickId",data.id);
								$this.attr("groupId",oGroupId);
								$this.nextAll().hide();
								This.load(true);
								//$this.parents('.reply').find('.quickBtn').show();
							}
						}
					})
				}

			}

			$('.quickRight').on('click','.quickSave',function(){
				var $this = $(this);
				var oInde = $this.parents(".replyList").index();

				var oGroupId = $($('.quickLeft .parentQuick')[oInde]).attr('groupid');
				var oText = $this.siblings('.quickInput').val();
				var oQuickid = $this.siblings('.quickInput').attr('quickid');
				$this.html("正在保存...");
				if(oQuickid)								//修改
				{
					var changeQuickUrl = apihost+'quick/updquickReply.action';//?id='+ oQuickid +'&&value='+ oText;
					$.ajax({
						type:"post",
						url:changeQuickUrl,
						data:{
							'id':oQuickid,
							'value':oText,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								$this.html("保存");
								$this.hide();
								$this.nextAll().hide();
								This.load(true);
								$this.parents('.reply').find('.quickBtn').show();
							}
						}
					})
				}
				else										//添加
				{
					var addQuickUrl = apihost+'quick/addquickReply.action';//?groupId='+ oGroupId +'&&value='+ oText;
					$.ajax({
						type:"post",
						url:addQuickUrl,
						data:{
							'groupId':oGroupId,
							'value':oText,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								$this.html("保存");
								$this.hide();
								$this.nextAll().hide();
								This.load(true);
								$this.parents('.reply').find('.quickBtn').show();
							}
						}
					})
				}
			});
			//删除快速回复
			$('.quickRight').on('click','.quickCancel',function(){
				var $this = $(this);
				var oQuickId = $this.siblings('.quickInput').attr('quickid');
				var delQuickUrl = apihost+'quick/delquickReply.action'//?id='+ oQuickId;
				$.ajax({
						type:"post",
						url:delQuickUrl,
						data:{
							'id':oQuickId,
							'userId':myid
						},
						dataType:"jsonp",
						success:function(data){
							if(data.status)
							{
								$this.parent('.quickList').remove();
								This.load(true);
							}
						}
					})
			});
		};
}
(new quickReply()).load(true);
//快捷回复结束
//$(".rightQuick").height($(window).height() - 76 + 'px');
