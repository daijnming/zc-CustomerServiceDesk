var conurl = apihost+"admin/connect.action"
var msgurl = apihost+"admin/msg.action"
var msgturl = apihost+"admin/msgt.action"
var getchaturl = apihost+"admin/getAdminChats.action"
var way = 1
var zhichichat
var puid
var pu
var cusRoleId
var cusRoleName
function connect(){
	$.ajax({
        type : "post",
        url : conurl,
        dataType : "JSONP",
        data : {
	   		'uid': myid,
	   		'way': way,
	   		'st':getQueryStr("st"),
	   		'lt':getQueryStr("lt"),
				//'token': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE0NjE3NzgzODQsImlzcyI6IjQyMjI5MzAyN0BxcS5jb20ifQ.TBeT66_J6j3N9t7MEr7jJfxDcUVOQS4IXUidrxZKA6o'
				 		'token': sessionStorage.getItem("temp-id")
		},
	    success : function (data){
	    	pu = data.pu;
	    	puid = data.puid;
	    	pid = data.pid;
	    	mylogo = data.face
	    	myname = data.name;
	    	isInvite = data.isInvite;
			//yy
			cusRoleId = data.cusRoleId;
			cusRoleName = data.cusRoleName?data.cusRoleName:'超级管理员';
			//connection_style
			$('#connection_style').html(cusRoleName);
	    	if(data.status==-1){
				onlineSuccess();
			}
	    	if(data.status==-2){
	    		window.onbeforeunload=null;
	    		document.write(" ");
	    		window.location.href="http://www.sobot.com/console/home/workOrder";
			}
			if(data.status==1){
				onlineSuccess();
				getchatList();
			}
			if(data.status==2){
				busySuccess();
				getchatList();
			}
	    	$(".conLoad").hide();
            //$("#messagesuser").height("100%");
			//$("#messagesuser").height(($("#messagesuser").outerHeight() - 80) + "px");
			//$("#homeuser").height(($("#messagesuser").outerHeight() - 20) + "px");
			if(way==0){
	    		zhichi();
	    	}
	    	if(way==1){
	    		startMsg();
	    	}
	    	startMsgT();
	    }
	 });
}

function startMsgT(){
//	setTimeout(startMsgT, 20000);
//	msgT();
	setInterval('msgT()', 10000);
}

function msgT(){
	$.ajax({
	      type : "post",
	      url : msgturl,
	      dataType : "jsonp",
	      data : {
		  		'uid':myid,
		  		'pid':pid,
	      },
				timeout: 10000,
				success : function (data){

					// status返回不是1 ++
					if (data.status !== 1) {
						window.errorCount = window.errorCount || 0;
						window.errorCount++;
					} else {
						window.errorCount = 0;
					}
				},
				error: function(err) {

					// 错误++
					window.errorCount = window.errorCount || 0;
					window.errorCount++;
				}
	  })
}


function startMsg(){
//	if(way==0){
//		setTimeout(startMsg, 30000);
//	}
//	if(way==1){
//		setTimeout(startMsg, 2000);
//	}
//	msg();
	setInterval('msg()', 2000);
}

function msg(){
	$.ajax({
	      type : "post",
	      url : msgurl,
	      dataType : "jsonp",
	      data : {
		  		'puid':puid,
		  		'uid':myid
	      },
	      success : function (data){
	    	  $.each(data, function(i) {
	    		  var msg = JSON.parse(data[i]);
	    		  msgListen(msg);

	    	  });
	  	  }
	  })
}

function zhichi(){
	if(way!=0) return;
	zhichichat =  new Zhichichat(pu);
	zhichichat.onopen = function () {
		 var data = JSON.stringify({
	            't': 0,
	            'u': puid
	     });
		 zhichichat.send(data);
    };
    zhichichat.onclose = function(evt){
		zhichi();
	};
	zhichichat.onerror = function(evt){
		zhichi();
	};
	zhichichat.onmessage = function (evt) {
		var data = JSON.parse(evt.data);
		msgListen(data)
	}
}

function msgListen (data) {
		var type = data.type;
		$('#chatonline').css({'overflow-x': 'hidden'});
		window.resizeChat1();
    if(type==102){
    	var uid = data.uid;
    	var utype = data.utype;
    	var hasUid = false;
        var cid = data.cid;
        $(".user").each(function(i){    //苹果可能转接出现两次用户
        	if($(this).attr("cid") == cid)
        	{
        		return;
        	}
        });
        var sName = data.uname;
        var uname = data.uname; //decodeURI(decodeURI(data.uname));
				var unameSummery;
        if(/.*[\u4e00-\u9fa5]+.*$/.test(uname))
        {
        	var textLength = 8;
        }
        else
        {
        	var textLength = 16;
        }

        //if(uname.length > textLength)
        //{
        //	uname = uname.substring(uname.length - textLength,uname.length) + '...';
        //}
        //if(utype != 1){
        //	//disNewMsg("【有新用户上线了.】");
        //    disNewMsg("新用户上线",uname + "上线了",uid);
        //
        // 	if(!windowSendMsg){
        //   	 $.amaran({
        //            content:{
        //   		 		icon:'fa fa-header',
        //   		 		size:"新用户上线",
        //   		 		file:'',
        //                message:uname + "上线了"
        //            },
        //            theme:'default error',
        //            position:'bottom right',
        //            inEffect:'slideRight',
        //            outEffect:'slideBottom'
        //        });
        //   	}
        //}
		//TODO Delete 04211454
        //var formIcon = ['<i class="fa fa-laptop"><span class="newIcon"></span></i>','<i class="fa fa-weixin"><span class="newIcon"></span></i>','<i class="fa fa-code"><span class="newIcon"></span></i>','<i class="fa fa-weibo"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>','<i class="fa fa-mobile"><span class="newIcon"></span></i>'];

        var re = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
        var newStr = '';

        for (var i = 0; i < uname.length; i++) {
					newStr = newStr + uname.substr(i, 1).replace(re, '');
				}
		if(newStr.length > textLength) {
			newStr = newStr.substring(0,textLength) + '...';
		}

		//如果转换就显示转接 接口
		if(data.isTransfer=='1') newStr+='[转接]';
		unameSummery = newStr;
		// uname = newStr;
		//移动到这里
		if(utype != 1){
			//disNewMsg("【有新用户上线了.】");
			//最后一个参数传1 为了区分新用户进来和来消息时的提示音效
			disNewMsg("新用户上线",uname + "上线了",uid,1);

			if(!windowSendMsg){
				$.amaran({
					content:{
						icon:'fa fa-header',
						size:"新用户上线",
						file:'',
						message:uname + "上线了"
					},
					theme:'default error',
					position:'bottom right',
					inEffect:'slideRight',
					outEffect:'slideBottom'
				});
			}
		}
		//for(var item in data){
		//	console.log(item+":"+data[item]);
		//}
				// 原始姓名 是否重名
        // if($(".leftScroll .user .uname:contains("+ uname +")").length > 0)

		if ($("[title*='" + uname +"']").length > 0)
        {
        	unameSummery = unameSummery + "-" + $("#users")[0].addNum;
        	$("#users")[0].addNum++;
        }
         if(data.chatType == 1)
        {
        	uname = uname + '<span style="color: #f90;">[转接]</span>';
        }
				// unameSummery  添加最后一条消息
		//if(data.lastMsg)data.lastMsg=data.lastMsg;else data.lastMsg='';






		var lastContent = '';
		if(data.lastMsg){
			if (data.lastMsg.indexOf('<img') !== -1){
				if(data.lastMsg.indexOf('webchat_img_upload') !== -1) {
					data.lastMsg = '[图片]';
				}
				else {
					data.lastMsg = '[富文本]';
				}
			}
			if(data.lastMsg.indexOf('<audio') !== -1){
				data.lastMsg = '[音频]';
			}
			lastContent = data.lastMsg.length > 8 ? data.lastMsg.toString().substr(0,8).trim()+'...':data.lastMsg.trim();
		}
		//TODO 根据最后一条类型添加颜色  0 最后一条为用户
		if(data.lastMsgSenderType==0)lastContent = '<span style="color:#ffad01">'+lastContent+'</span>';
		//TODO 判断 用户自定义头像
		var ZC_FaceUrl='';
		if(data['face']){
			data['face'] = decodeURIComponent(data['face']);
			ZC_FaceUrl = ZC_Extend.member.formIcon('')(data['face']);
		}else{
			ZC_FaceUrl = ZC_Extend.member.formIcon(data['usource']);
		}
        var newUser = "<li title='" + uname + "' id='user_"+uid+"' ><a href='javascript:;' class='user' cid='"+cid+"' name='"+sName+"' usource='"+data.usource+"' uid='"+uid+"'>"+ ZC_FaceUrl +"<span class='uname' >" + unameSummery + "</span><span class='lastMsg'>"+lastContent+"</span><span class='badge badge-red msg-count'></span><i class='user-del' onclick='userDel(this)'><span class='newIcon'></span></i><span class='ohide'>"+ sName +"</span></a></li>";

		if($("#user_"+ uid).length > 0)    //是否在列表中
		{
			if($("#user_"+ uid).parents("ul")[0] == $("#offlineUser")[0])   //是否在离线列表      如果在离线列表里
			{
				changeUserLi($("#user_"+ uid),false,uid);                              //改变状态     false 不等于leave 执行上线
				$("#chat_"+ uid).attr("cid",cid);
				$("#user_"+ uid).find(".user").attr("cid",cid);

                $("#chat_"+uid + " .panel-body").empty();//删除匹配的元素集合中所有的子节点。   //所有消息清空

				// 大数据延迟加载
				setTimeout(function(){
					disjson(("#chat_"+uid + " .panel-body"),uid,sName,$("#chat_"+uid),1,data.usource);        //获取历史记录    disjson()
				}, 300);
				setScroll($("#chat_"+ uid));
			}
			else
			{
				if($("#user_"+ uid).find(".user")[0].leaved)  //是否在在线列表但是出于离线状态
		        {
					//若由离线变为在线就把该聊天窗口给置为disabled=false
					var $txtArea = $('#chat_input_'+uid);
					$txtArea.removeAttr('disabled');
					$txtArea.attr('placeholder','请输入...');
					//TODO 开启可点击表情和发送图片
					$('#maskFace,#maskPhoto').css('display','none');
					$('#user_'+ uid).find('.fa.fa-laptop').css('background-color','#60adf6');
		        	var str = $("#user_"+ uid).find(".uname").html();            //北京市海淀区联通-6[离线]
					str = str.replace(/\[离线\]/g,"");                           //北京市海淀区联通-6
					$("#user_"+ uid).find(".uname").html(str);                     //北京市海淀区联通-6     赋值
		        	$("#user_"+ uid).find(".user")[0].leaved = false;              //
		        	$("#chat_"+ uid).attr("cid",cid);                               //chat 加cid
					$("#user_"+ uid).find(".user").attr("cid",cid);                //.user加cid
					$("#chat_"+uid + " .panel-body").empty();//删除匹配的元素集合中所有的子节点。   //所有消息清空

					// 大数据延迟加载
					setTimeout(function(){
						disjson(("#chat_"+uid + " .panel-body"),uid,sName,$("#chat_"+uid),1,data.usource);        //获取历史记录    disjson()
					}, 300);
					setScroll($("#chat_"+ uid));                                               //设置滚动条     setScroll()
		        }
			}
			uploadImg($("#chat_"+ uid).find(".upload"),$("#chat_"+ uid));
			return;
		}
		else     //不在的话加入在线列表
        {
        	if($("#users li").length == 0)   //加入用户标签
			{

				$("#users").append(newUser);

			}
			else
			{
				$("#users li:first-child").before(newUser);
			}
        }

		$(".user .uname").width($("#main_tab").width() - 60);
		if($("#users li").length == 1)
		{
				//$(".rightBox .nav li,.rightBox .tab-border .tab-pane").first().show();
				$("#goProfileuser").click();
				//$("#messagesuser").height("100%");
				//$("#messagesuser").height(($("#messagesuser").outerHeight() - 80) + "px");
				//$("#homeuser").height(($("#messagesuser").outerHeight() - 20) + "px");
		}
		//聊天窗口
		$chat_new = $("#chat").clone();
		$chat_new.attr("id","chat_"+uid);
		$chat_new.attr("uid",uid);
		$chat_new.attr("cid",cid);
		$chat_new.attr("source",data.usource);
		$chat_new.find('.scrollBoxParent').attr('data-panel-id',uid);

		$("#chatlist").append($chat_new);
		$chat_input = $chat_new.find(".msg-send-input");
		//yy点击按钮
		//$chat_sendBtn = $chat_new.find(".sendBtn");
		$chat_btnSend = $chat_new.find('#btnSend');
		 //dyy
    $("#homeuser .homeUserBox .robotHide1 .quickSendBtn").css('display','');
    if(data.usource==2){
        $chat_new.find(".face").parent().css('display','none');
        //$chat_new.find(".upload").parent().css('top','1px');
       /* $("#homeuser .homeUserBox .robotHide1 .quickSendBtn").css('display','none');*/
    }
    // //融云dyy
    if(data.usource==5){
    	//屏蔽发表情按钮
        $chat_new.find(".face").parent().css('display','none');
        //$chat_new.find(".upload").parent().css('top','1px');
        //只要有新的用户，就把id存到ronIdGroup里
        ronIdGroup[uid] = 1;

    }
		//历史记录分页事件
		setHisGet($chat_new.find(".scrollBox")[0],uid,data.usource);
		//历史记录分页事件
		setOtextCon($chat_input[0],cid);
		var chat_input_id = "chat_input_"+uid;
		$chat_input.attr("id",chat_input_id);
		placeholder($chat_input[0]);
		$chat_input.keypress(function (e) {
		    var key = e.which;
		    if (key == 13&&!e.shiftKey) {
		    	this.pressd = 0;

		    	sendMsg(this)
		    	return false;
		    }
		});

		$chat_btnSend.on('click',function(){
			var msg = $('#'+chat_input_id);
			sendMsg(msg)
		})
		//yy
		//$chat_sendBtn.on('click',function(){
		//	var msg = $('#'+chat_input_id);
		//	sendMsg(msg);
		//});
		// resizeChat();
		$chat_new.find('.face').qqFace({
			assign:'#'+chat_input_id,
			path : apihost+'chatres/common/emotes/pc/'
			//path : 'chatres/common/emoji/32/'
		});
		uploadImg($chat_new.find(".upload"),$chat_new);

		/*document.getElementById(""+chat_input_id+"").onpaste=function(ev){
			var oEvent = ev || event;
			paste_img(oEvent,cid);
		};*/
		if(data.tel && data.tel != null && data.tel != "undefined")
		{
			FsetCall(data.uid,data.tel,data.uname);
		}


		// 大数据延迟加载
		setTimeout(function(){
			disjson(("#chat_"+uid + " .panel-body"),uid,sName,$("#chat_"+uid),1,data.usource);   //获取历史记录
		}, 300)
		setScroll($("#chat_"+uid));
		/*if($("#users .user").size()==1){
			$("#user_"+uid+" .user").click();
		}*/

   	}
    if(type==103){
        var uid = data.uid;
    	var cid = data.cid;
        var name = data.uname;
        //disNewMsg("【您有新的消息。】");

    	var content = data.content;
		//获取来源
		var source = data.source;
    	//yy跟具不同的来源，换图
		//0 pc


		//TODO 用户头像测试
		//console.log(data);

		//data.senderFace = 'http://img.sobot.com/chatres/common/face/appType.png';
		var	logoUrl = data.senderFace? data.senderFace:ZC_Extend.member.userFace[source];
		//TODO Delete201604211535
        //var logoUrl = "http://img.sobot.com/chatres/common/face/pcType.png"
        //if(source == '0'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/pcType.png"
        //}
        ////1
        //if(source == '1'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/weixinType.png"
        //}
        ////2 app
        //if(source == '2'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/appType.png"
        //}
        ////3 weibo 未出图
        //if(source == '3'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/weiboType.png"
        //}
        ////4 h5
        //if(source == '4'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/moType.png"
        //}
        ////5 融云
        //if(source == '5'){
			//var logoUrl = "http://img.sobot.com/chatres/common/face/moType.png"
        //}
    	////var logoUrl = apihost+"chatres/common/face/user.png"

    	disNewMsg(name + " 的新消息:",content,uid);
//    	if(windowSendMsg){
//    	 $.amaran({
//             content:{
//                 icon:'fa fa-header',
//                 size:name + " 的新消息:",
//                 file:'',
//                 message:content
//             },
//             theme:'default error',
//             position:'right bottom',
//             inEffect:'slideRight',
//             outEffect:'slideBottom'
//         });
//
//    	}


    	$user = $("#user_"+uid+" .user");
    	if($user.hasClass("active")){
			//加入来源
    		showMsg(uid,name,logoUrl,content,true,source);
    	}
    	else{
    		$count = $("#user_"+uid+" .msg-count");
    		var count = $count.html();
    		if(count==""){
    			var oLast,hasLast;
    			var oNow = $user.parent('li').clone();
    			$("#users .msg-count").each(function(i){
					if($(this).html() != "")
					{
						hasLast = true;
						oLast = $(this).parent(".user").parent('li');
					}
				})
				if(hasLast)
				{
					$user.parent('li').remove();
					oLast.after(oNow);
				}
    			$count = $("#user_"+uid+" .msg-count");
					$count.html("1");
				 	$user = $count.parent();
    		}
    		else{
        		count = parseInt(count);
    			$count.html(count+1);
        	}
    		$unread = $("#chat_"+uid+" .unread_divider");
    		if($unread.length==0){
    			var unred = '<div  class="unread_divider">'
					+'<h1 role="separator" aria-hidden="true"></h1>'
					+'<span class="divider_label">待回复消息</span>'
				+'</div>';
				$chat = $("#chat_"+uid+" .scrollBox");
    			$chat.append(unred);
    			var scrollTop = $chat[0].scrollHeight;
    	    	$chat.parent(".scrollBoxParent").scrollTop(scrollTop);
    		}
    		showMsg(uid,name,logoUrl,content,true,source);
    	}

		if (content.indexOf('<img') !== -1){
			// 判断是否有表情
			//if (content.indexOf('webchat_img_face') !== -1) {
			//	content = '[表情]';
			//}
			 if(content.indexOf('webchat_img_upload') !== -1) {
				 content = '[图片]';
			 }
			else {
				content = '[富文本]';
			}
		}
		if(content.indexOf('<audio') !== -1){
			content = '[音频]';
		}

		content = content.length<9?content:content.substring(0,8) + '...';
		if(data.msgType=='0'){
			//获取用户信息显示最后一条消息 颜色 变化
			$user.find('.lastMsg').html('<span style="color:#ffad01">'+content+'</span>');
		}

    	var obj = $("#chat_"+ uid + " .userTextNow");    //正在输入隐藏
    	obj.hide();obj[0].showed = false;
    	$("#chat_"+ uid).find(".uesrDivNow").css("top","-40px");
    	//dyy
    	for(var name in ronIdGroup){
    		if(name == uid){
	    			 twemoji.parse(document.getElementById('chat_'+uid), {"size":16});
			    (function (img, metaKey, i) {
			      function copyToClipboard(e) {
			        /*prompt('Copy to clipboard via ' + metaKey + '+C and Enter', this.alt);*/
			      }
			      for (i = 0; i < img.length; img[i++].onclick = copyToClipboard) {}
			    }(
			      document.getElementsByTagName('img'),
			      /\b(?:Mac |i)OS\b/i.test(navigator.userAgent) ? 'Command' : 'Ctrl'
			    ));
	    	}
    	}
    	/* twemoji.parse(document.getElementById('hchat'), {"size":16});
			    (function (img, metaKey, i) {
			      function copyToClipboard(e) {
			        prompt('Copy to clipboard via ' + metaKey + '+C and Enter', this.alt);
			      }
			      for (i = 0; i < img.length; img[i++].onclick = copyToClipboard) {}
			    }(
			      document.getElementsByTagName('img'),
			      /\b(?:Mac |i)OS\b/i.test(navigator.userAgent) ? 'Command' : 'Ctrl'
			    ));*/


    }
    if(type==108){
    	disLeave(data.uid, data.t);
//    	$.amaran({
//			content:{
//			message:'有用户下线了!',
//			size:'您和用户 ' + data.uname + '的对话结束了。' ,
//			file:'',
//			icon:'fa fa-times'
//			},
//			theme:'default error',
//			position:'bottom right',
//			inEffect:'slideRight',
//			outEffect:'slideBottom'
//		});
    }
    if(type==109){
    	if(data.status==2){			//dyy原来单等(data.status=2)
    			window.onbeforeunload=null;
    			document.write(" ");
        		alert("有新窗打开,当前窗口被下线");
        		window.location.href = "http://www.sobot.com/console/login.jsp";
    	}

			if(data.status==1){			//dyy原来单等(data.status=2)
					window.onbeforeunload=null;
					document.write('');
					alert('暂时与服务器断开连接,点击确定重新加载页面');
					location.reload();
					return;
    	}
    }
    if(type==110){
    	if(data.count != 0)
    	{
    		$("#waitNum").show();
    		$("#waitNum").html("排队中<span style='padding-left: 7px;'>" + data.count + "</span>");
    		//$("#openOtherUser").html(data.count + " 人排队");
			$("#openOtherUser span").html("");
    	}
    	else if(data.count == 0)
    	{
    		$("#waitNum").hide();
    		$("#openOtherUser span").html("邀请新用户");
    	}

    }
    if(type == 111)
    {
    	var obj = $("#chat_"+ data.uid + " .userTextNow");
    	obj[0].showed = true;
    	obj.show();
    	$("#chat_"+ data.uid).find(".uesrDivNow").css("top","-70px");
    	obj.html("用户正在输入： " + data.content);
    	if(data.content == "")
    	{
    		obj.hide();
    	}
    }
    if(type == 112)//called
    {

    	FsetCall(data.uid,data.called,data.uname);
    }
	isUsers();
}
