function uploadImg(uploadBtn,node,core,window){//,oChat | uploadBtn上传图片按钮，oChat获取用户信息
	var AjaxUpload=require('../util/upload.js');//上传附件 插件
	//var showMsg=require('./showMsg.js');//会话气泡
	var uid="daijm";
	//var uid = oChat.attr("uid");
	//var cid = oChat.attr("cid");
	//var source = oChat.attr("source");
	/*if($('#chat_input_'+ uid).attr("imgUpload") == "yes")//解决粘贴图片事件重复
	{
		return
	}

    Global.map = Global.map || {};
    Global.map[uid] = Global.map[uid] || {};*/
    var apihost = "http://test.sobot.com/chat/";
	 var parseDOM = function() {
        $node = $(node);
    };

	/*
	*uploadBtn 附件按钮
	*uploadOption 上传参数
	*/
	var onFormDataUpHandler=function(){
		if(FormData){//支持formData则使用formData上传
			var oData = new FormData($node.find(".js-fileinfo"));
				oData.append("type", "msg");
				oData.append("countTag", "0");
				/*$.ajax({
				  url: apihost+"webchat/fileupload.action",
				  type: "POST",
				  data: oData,
				  processData: false,  // 告诉jQuery不要去处理发送的数据
				  contentType: false,   // 告诉jQuery不要去设置Content-Type请求头
				  success: function(response) {
						//var url = response.url ,
						//		con = '<img src="img/upImgLoad.png" class="webchat_img_upload upNowImg">';
						//showMsg(uid, myname, mylogo, con, null, null, response.url);
						//imgCallBack(uid,url,cid);
					}
				});*/
		}else{
			onAjaxUploadUpHandler();
		}
	};
	var onAjaxUploadUpHandler=function(){
		var uploadBtn=$node.find(".js-upload");
		var uploadOption = {//上传附件
	        action: apihost+"webchat/fileupload.action",
	        name: "file",
	        autoSubmit: true, 
	        data:{
	          type: "msg",
	          countTag: 0
	        },
	        responseType:"JSONP",
	        contentType:"application/x-www-form-urlencoded; charset=utf-8",
	        onChange: function (file, extension){//file文件名称，extension扩展名
	        	//if(source==0){
		        	if (!(extension && /^(jpg|JPG|png|PNG|gif|GIF|txt|TXT|DOC|doc|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX|xls|XLS|xlsx|XLSX|RAR|rar|zip|ZIP|mp3|MP3|mp4|MP4|wma|WMA|wmv|WMV|rmvb|RMVB)$/.test(extension))) {
		        		 $.amaran({
		        	            content:{
		        	                message:'格式不支持!',
		        	                size:'请上传正确的文件格式',
		        	                file:'',
		        	                icon:'fa fa-times'
		        	            },
		        	            theme:'default error',
		        	            position:'bottom right',
		        	            inEffect:'slideRight',
		        	            outEffect:'slideBottom'
		        	       });
		                return false;
		            }
	        	//}
		    
	    
		    },
		    onSubmit: function (file, extension, base64file){
		    	var fileTypeReg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
			 
		          //uid = $("[class='user active']").attr('uid')
		         // cid = $("[class='user active']").attr('cid');
		         // usource = $("[class='user active']").attr('usource');

		         // Global.map[$("[class='user active']").attr('uid')].count = Global.map[$("[class='user active']").attr('uid')].count || 0;

		        //  if (fileTypeReg.test(file)) Global.map[$("[class='user active']").attr('uid')].count++;
		        //  uploadOption.data.source = Global.usource;
		        //  uploadOption.data.countTag = Global.map[uid].count;

		        	if(extension && /^(jpg|JPG|png|PNG|gif|GIF)$/.test(extension))
		        	{
						//去除admin/
		        		//var con = '<img src="img/upImgLoad.png" class="webchat_img_upload upNowImg">';
		        		 
		        	showMsg(uid,"daijm","img/qqarclist/jianjiao.gif","",null,"<img src='img/appType.png'>",base64file);//显示气泡
		        	}
		        	//else
		        	//{console.log(2);
		        	//	var oMsgDom = '<div class="systeamTextBox systeamNowText"><p class="systeamText">正在上传 '+ file +'</p></div>';
		        	//	$node.find(".panel-body").append(oMsgDom);
		        		//$node.find('.scrollBoxParent').scrollTop(999999);
		        	//}
		    },
		    onComplete: function (file,response) {
				 var countTag = 0,
		              res,
		              url, 
		              size;

		    		if (typeof response == 'string') {
		                res = JSON.parse(response);
		                url = res.url;
		    		    countTag = parseInt(res.countTag) - 1;
		    		}else{
		    			url = response.url;
		    		}


		        	size = response.filesize;
		        	if (size==false) {
		        		 $.amaran({ 
		     	            content:{
		     	                message:'所传文件过大!',
		     	                size:'',
		     	                file:'',
		     	                icon:'fa fa-times'
		     	            },
		     	            theme:'default error',
		     	            position:'bottom right',
		     	            inEffect:'slideRight',
		     	            outEffect:'slideBottom'
		     	       });
		        		 return;
		        	 }

		        	 //imgCallBack(uid, url, cid, countTag);
		      
		    } 
	    
		}
		new AjaxUpload(uploadBtn, uploadOption);

	};
	var bindLitener = function() {
        $node.find('.js-upload').on("click",onFormDataUpHandler);//使用formData上传附件
      	
    };

	var imgCallBack=function(uid,url,cid){

		// 当前对话用户的标签
		var obj = $('.mainNav #users .active')
		// ,
		// 		uid = Global.uid || uid,
		// 		cid = Global.cid || cid; 

		var resulturl = url.substr(url.lastIndexOf('\.')+1,url.length);
		var resultName = url.substr(url.lastIndexOf('\/')+1,url.length);
		var content = null;
		var msg = null;

		if(resulturl=="jpg"||resulturl=="JPG"||resulturl=="png"||resulturl=="PNG"||resulturl=="gif"||resulturl=="GIF")
		{
			msg = "<img src='"+url+"' class='webchat_img_upload'/>";
			var oImg = document.createElement("img");
			oImg.src = url;
			// 方便出现异常远程调试
			//console.log('图片onload中...');

			oImg.onload = function() {
				$("[data-panel-id='" + uid + "']").scrollTop(999999);
			}

		}else{
			var icon = "icon_default.png";;
			if(resulturl=="txt"||resulturl=="TXT"){
				icon = "icon_txt.gif";
			}
			if(resulturl=="doc"||resulturl=="DOC"||resulturl=="DOCX"||resulturl=="docx"){
				icon = "icon_doc.gif";
			}
			if(resulturl=="ppt"||resulturl=="PPT"||resulturl=="PPTX"||resulturl=="pptx"){
				icon = "icon_ppt.gif";
			}
			if(resulturl=="zip"||resulturl=="ZIP"||resulturl=="rar"||resulturl=="RAR"){
				icon = "icon_rar.gif";
			}
			if(resulturl=="pdf"||resulturl=="PDF"){
				icon = "icon_pdf.gif";
			}
			if(resulturl=="xls"||resulturl=="XLS"||resulturl=="XLSX"||resulturl=="xlsx"){
				icon = "icon_xls.gif";
			}
			content= "<img style='vertical-align: middle; margin-right: 2px;' src='http://img.sobot.com/yun/attachment/fileTypeImages/"+icon+"'><a style='font-size:10px;' target='_black' href='"+url+"'>"+resultName+"</a>";
			msg = "<img style='vertical-align: middle; margin-right: 2px;' src='http://img.sobot.com/yun/attachment/fileTypeImages/"+icon+"'><a  style='font-size:10px;' target='_black' href= '"+url+"'>"+resultName+"</a>";

			$("#chat_"+uid+" .systeamNowText").remove();
			//showMsg(uid,myname,mylogo,content);
		}

		//send(cid,msg);
		//$unread = $("#chat_"+uid+" .unread_divider");
		//$unread.remove();
	}
	var init = function() {
        parseDOM();
        bindLitener();
       
    };
}
module.exports = uploadImg;
