
	function showMsg(uid,name,logoUrl,content,formUser,source, base64file){
	
		//alert(base64file);
		if(content!=null){
			content = content.replace(/&amp;/g,'&');//转义&
		}
		if((content==""||content==null)&&(base64file==null||base64file=="")){
			//alert("你啥也没传");
			return;
		}
		
		///TODO 发送和接收都会调用
		var form = ' ';
		var workOrderCus = 'workOrderCus';
		var fr = 'fr';
		var angle = 'angleRight';
		var margin = 'mr';
		if(formUser)
		{
			form = "formUser";
			workOrderCus = 'userCus';
			fl = "fl";
			margin = 'ml';
			angle ="angleLeft";
		}
		//在聊天过程中  根据id 去改变最后一条显示消息
		var listMsgLib=content;
		if (content.indexOf('<img') !== -1){
			// 判断是否有表情
			//if (content.indexOf('webchat_img_face') !== -1) {
			//	content = '[表情]';
			//}
			if(content.indexOf('webchat_img_upload') !== -1) {
				listMsgLib = '[图片]';
			}
			else {
				listMsgLib = '[富文本]';
			}
		}
		if(content.indexOf('<audio') !== -1){
			listMsgLib = '[音频]';
		}
		//content = ZC_Extend.getUrlRegex(content);
		listMsgLib = listMsgLib.length>8?listMsgLib.toString().substr(0,8).trim() +'...':listMsgLib;

		//根据最后一条类型添加颜色

 

		$('#users #user_'+uid).find('.lastMsg').html(listMsgLib);

		//var dt = new Date().format('hh:mm:ss');
		var dt ="2016/05/10 11:22:33";
		if(workOrderCus=='userCus'){
 
		}
		logoUrl = decodeURIComponent(logoUrl);//编码后的 URI 进行解码


		var msg = '<div class="msg '+workOrderCus+'">'
				+ '<div class="msg_user '+fr+'"><img src="'+logoUrl+'" class="msg_user_img"></div>'
				+ '<div class="msgContBox '+fr+'"><span class="msg_name">'+name+'</span>'
					//[~]需求修改
//				+ '<span class="msg_time ' + margin + '">' + name.substring(0, 8) + '</span>'
				+ '<span class="msg_time ' + margin + '">' + name + '</span>'
				+ '<span class="msg_time" style="margin-left: 0px;">'+dt+'</span>'
				+ '<div style="clear:both;"></div>'
				+ '<div class="msgBg ' + fr + '" style="display: inline-flex;margin: 0px;">'+'<i class="'+angle+'"></i>'+'<div class="msg_content '+ form +'" >'+content+'</div></div></div>'
				+ '</div>';
		if(source!=null){//如果附件不为空则重新拼接msg
			var msg = '<div class="msg '+workOrderCus+'">'
				+ '<div class="msg_user '+fr+'"><img src="'+logoUrl+'" class="msg_user_img"></div>'
				+ '<div class="msgContBox '+fr+'"><span class="msg_name">'+name+'</span>'
					//[~]需求修改
//				+ '<span class="msg_time ' + margin + '">' + name.substring(0, 8) + '</span>'
				+ '<span class="msg_time ' + margin + '">' + name + '</span>'
				+ '<span class="msg_time" style="margin-left: 0px;">'+dt+'</span>'
				+ '<div style="clear:both;"></div>'
				+ '<div class="msgBg ' + fr + '" style="display: inline-flex;margin: 0px;">'+'<i class="'+angle+'"></i>'+'<div class="msg_content '+ form +'" >'+source+'</div></div></div>'
				+ '</div>';
		}

		$chat = $("#chat_"+uid+" .scrollBox");
		$chat.append(msg);

		var dom = $chat.children().last().find('.upNowImg');

		if (base64file) checkFile(base64file, dom);
		//setScroll($("#chat_"+uid));

		// 保存预览图片dom
		$chat.children().last();



		// files:base64文件流
		// dom: 对应的dom
		function checkFile(files, dom){
		    var file = files[0],
		        reader = new FileReader();

		    // 如果是字符串 直接赋值
		    if (typeof files === 'string') {
		        dom[0].src = files;
		        return false;
		    }

		    if(!/image\/\w+/.test(file.type)){
		     // console.log('不是图片');
		      return false;
		    }
		    // onload是异步操作
		    reader.onload = function(e){
		        //console.log(e.target.result)
		        //console.log(dom)
		        //dom[0].src = e.target.result;
		    }

		    reader.readAsDataURL(file);
		}
		/*Date.prototype.format = function(format) {
			var o = {
				"M+" : this.getMonth() + 1, // month
				"d+" : this.getDate(), // day
				"h+" : this.getHours(), // hour
				"m+" : this.getMinutes(), // minute
				"s+" : this.getSeconds(), // second
				"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
				"S" : this.getMilliseconds()
				// millisecond
			}
			if (/(y+)/.test(format)) {
				format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4
						- RegExp.$1.length));
			}
			for (var k in o) {
				if (new RegExp("(" + k + ")").test(format)) {
					format = format.replace(RegExp.$1, RegExp.$1.length == 1  ? o[k]  : ("00" + o[k]).substr(("" + o[k]).length));
				}
			}
			return format;
		}*/

		////滚动条
		/*function setScroll(obj){
			$(obj).find('.scrollBoxParent').niceScroll({cursorwidth:"10px",mousescrollstep:"100",scrollspeed:"200"});
			setScrollWidth(obj);
			setTimeout(function(){
				$(obj).find('.scrollBoxParent').scrollTop(99999);
			},500)
		}*/
			 
	}
	//module.exports = showMsg;