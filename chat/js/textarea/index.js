function TextArea(node,core,window){
	var loadFile = require('../util/load.js')();
	var ZC_Face=require('../util/qqFace.js');
	var upload=require('../util/upload.js');
	var global;
    var parseDOM = function() {

    };
    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $(node).find(".js-users-list").append(li);
    };
    var onReceive = function(value,data) {
        switch(data.type) {
            case 102:
                newUserMessage(data);
                break;
        }
    };

    var getDefaultChatList = function() {
        $.ajax({
            'url' : '/chat/admin/getAdminChats.action',
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                'uid' : global.id
            }
        }).success(function(ret) {
            if(ret.userList.length > 0) {
                loadFile.load(global.baseUrl + 'views/leftside/chatlist.html').then(function(value) {
                    var _html = doT.template(value)({
                        'list' : ret.userList
                    });
                    $(node).find(".js-users-list").html(_html);
                });
            } else {
                var height = $(node).outerHeight();
                $(node).find(".js-chatonline").addClass("noOnline");
            }
        });
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        $(node).find("img.js-my-logo").attr("src",data.face);
        $(node).find(".js-customer-service").html(data.name);
        getDefaultChatList();
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
    };

    var initPlugsin = function() {//插件
				initFace();
				uploadFile();
    };

	var initFace = function(){
		/*
			saytext 待发送内容框
			group 大表情集合
			faceGroup表情集合
			emojiGroup emoji表情集合
			showId	聊天窗体
			emotion 表情集合按钮
			sub_btn 提交按钮
			path 表情集合路径
			emojiPath emoji表情集合路径

		*/
		ZC_Face.initConfig({
		 	saytext:".sendMessage",
		 	Group:"#faceGroupTarea",
		 	faceGroup:"#faceGroup",
		 	emojiGroup:"#emojiGroup",
		 	showId:".panel-body",
		 	emotion:".js-emotion",
		 	sub_btn:".btnSend",
		 	path:"img/qqarclist/",
		 	emojiPath:"img/emoji/"
		},function(){
			  $(".js-emotion").click(function(){
			  	//打开集合,默认qq表情为显示状态
			  	$("#faceGroup").show();
			  	$("#emojiGroup").hide();
			 	ZC_Face.show();
			 	ZC_Face.emojiShow();
			  });
			  $(".btnSend").click(function(){//提交
					var str = $(".sendMessage").val();
					str=ZC_Face.analysis(str);
					$(".panel-body").append(str);
					//$(".sendMessage").val("");//清空待发送框
				 })
			  $(".icoLi").click(function(){
			  	$(this).addClass("active").siblings().removeClass("active");
			  	$('.groupChildren').hide();
			  	var dataId=$(this).attr("data-src");
			  	$(dataId).show();
			  })

		});
		// $('#faceBox').perfectScrollbar();//加载滚动条
		// $('#emojiBox').perfectScrollbar();//加载滚动条
	};
	var uploadFile=function(){console.log(111);
		var uploadBtn=$(".js-upload");//btn
	 	$(uploadBtn).click(function(){
			uploadImg(uploadBtn);
	 		function uploadImg(uploadBtn){

				var uploadOption = {
			        action: apihost+"webchat/fileupload.action",
			        name: "file",
			        autoSubmit: true,
			        data:{
			          type: "msg",
			          countTag: 0
			        },
			        responseType:"JSONP",
			        contentType:"application/x-www-form-urlencoded; charset=utf-8",
			        onChange: function (file, extension){
			        	if(source==0){
				        	if (!(extension && /^(jpg|JPG|png|PNG|gif|GIF|txt|TXT|DOC|doc|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX|xls|XLS|xlsx|XLSX|RAR|rar|zip|ZIP)$/.test(extension))) {
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
			        	}else{
			        		if (!(extension && /^(jpg|JPG|png|PNG|gif|GIF)$/.test(extension))) {
				        		 $.amaran({
				        	            content:{
				        	                message:'图片格式不支持!',
				        	                size:'请上传jpg/png/gif格式图片',
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
			        	}
			        },
			        onSubmit: function (file, extension, base64file){

			        },
			        onComplete: function (file,response) {

			          
			        }
			      }
			     new AjaxUpload(uploadBtn, uploadOption);
			}
	 	})

	}
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };
    init();
}

module.exports = TextArea;
/*function LeftSide(node,core,window) {
    var template = require('./template.js');
    var loadFile = require('../util/load.js')();
    var global;
    var parseDOM = function() {

    };

    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $(node).find(".js-users-list").append(li);
    };
    var onReceive = function(value,data) {
        switch(data.type) {
            case 102:
                newUserMessage(data);
                break;
        }
    };

    var getDefaultChatList = function() {
        $.ajax({
            'url' : '/chat/admin/getAdminChats.action',
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                'uid' : global.id
            }
        }).success(function(ret) {
            if(ret.userList.length > 0) {
                loadFile.load(global.baseUrl + 'views/leftside/chatlist.html').then(function(value) {
                    var _html = doT.template(value)({
                        'list' : ret.userList
                    });
                    $(node).find(".js-users-list").html(_html);
                });
            } else {
                var height = $(node).outerHeight();
                $(node).find(".js-chatonline").addClass("noOnline");
            }
        });
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        $(node).find("img.js-my-logo").attr("src",data.face);
        $(node).find(".js-customer-service").html(data.name);
        getDefaultChatList();
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
    };

    var initPlugsin = function() {//插件
				initFace();
    };

	var initFace = function(){
	ZC_Face.initConfig({
	 	saytext:".sendMessage",
	 	Group:"#Group",
	 	faceGroup:"#faceGroup",
	 	emojiGroup:"#emojiGroup",
	 	showId:".panel-body",
	 	emotion:".js-emotion",
	 	sub_btn:".btnSend",
	 	path:"img/qqarclist/",
	 	emojiPath:"img/emoji/"
	},function(){
		
		  $(".js-emotion").bind("click",function(){
		  	//打开集合,默认qq表情为显示状态
		  	$("#faceGroup").show();
		  	$("#emojiGroup").hide();
		 	ZC_Face.show();
		 	ZC_Face.emojiShow();
		  });
		  $(".btnSend").bind("click",function(){//提交
		var str = $("#saytext").val();
		str=ZC_Face.analysis(str);
		//str=ZC_Face.emojiAnalysis(str);
		$("#show").append(str);
		$("#saytext").val("");//清空待发送框
	 })
		  $(".icoLi").click(function(){
		  	$(this).addClass("active").siblings().removeClass("active");
		  	$('.groupChildren').hide();
		  	var dataId=$(this).attr("data-src");
		  	$(dataId).show();
		  })

	})
	}

    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };

    init();

};

module.exports = LeftSide;*/