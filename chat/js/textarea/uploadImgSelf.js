function uploadImg(uploadBtn,node,core,window){//,oChat | uploadBtn上传图片按钮，oChat获取用户信息
	 
	var showMsg=require('./showMsg.js');//会话气泡
	var uid="daijm";
	var form = ' ';
	var workOrderCus = 'workOrderCus';
	var float = 'fr';
	var angle = 'angleRight';
	var margin = 'mr';
	function sendForm() {
		var oOutput =  $node.find("output");
	
		var msg = '<div class="msg '+workOrderCus+'">'
			+ '<div class="msg_user '+float+'"><img src="'+logoUrl+'" class="msg_user_img"></div>'
			+ '<div class="msgContBox '+float+'"><span class="msg_name">'+name+'</span>'
			+ '<span class="msg_time ' + margin + '">' + name + '</span>'
			+ '<span class="msg_time" style="margin-left: 0px;">'+dt+'</span>'
			+ '<div style="clear:both;"></div>'
			+ '<div class="msgBg ' + float + '" style="display: inline-flex;margin: 0px;">'+'<i class="'+angle+'"></i>'+'<div class="msg_content '+ form +'" >'+source+'</div></div></div>'
			+ '</div>';
		

		$chat = $("#chat_"+uid+" .scrollBox");
		$chat.append(msg);
	    var oData = new FormData(document.forms.namedItem("fileinfo"));
	    oData.append("CustomField", "This is some extra data");
	 
		  var oReq = new XMLHttpRequest();
		  oReq.open("POST","http://test.sobot.com/chat/webchat/fileupload.action", true);
		  oReq.onload = function(oEvent) {
		    if (oReq.status == 200) {alert("上传成功");
		      oOutput.innerHTML = "Uploaded!";
		    } else {alert("上传失败");
		      oOutput.innerHTML = "Error " + oReq.status + " occurred uploading your file.<br \/>";
		    }
		  };
		 
		  oReq.send(oData);
	}
}
module.exports = uploadImg;
