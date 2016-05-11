function TextArea(node,core,window){
	var loadFile = require('../util/load.js')();
	var global = core.getGlobal();
	var baseUrl = global.baseUrl;
	var uid="daijm";
	var showMsg=require('./showMsg.js');//会话气泡
	var ZC_Face=require('../util/qqFace.js');//表情
	var uploadImg=require('./uploadImg.js');//上传附件
	var $node;
	var apihost = "http://test.sobot.com/chat/";
	//var sendurl = apihost+"admin/send1.action"
    var parseDOM = function() {
    	$node=$(node);
    };
    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $node.find(".js-users-list").append(li);
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
                loadFile.load(baseUrl + 'views/leftside/chatlist.html').then(function(value) {
                    var _html = doT.template(value)({
                        'list' : ret.userList
                    });
                    $node.find(".js-users-list").html(_html);
                });
            } else {
                var height = $node.outerHeight();
                $node.find(".js-chatonline").addClass("noOnline");
            }
        });

        /*function send1(cid,content,sucessCallback,answerType,docId,pid,questionId){
			$.ajax({
			        type : "post",
			        url : sendurl,
			        dataType : "JSONP",
			        data : {
			            //'uid':myid,
				   		'cid':cid,
			            'answer' : content,
			            'answerType':answerType,
				   		'docId':docId,
			            'pid' : pid,
			            'questionId' : questionId
			        },
					success : function (data){
						if(data.status==1){
							if(sucessCallback){
								sucessCallback()
							}
						}
				    }
			});
		}*/
    };

    var onloadHandler = function(evt,data) {
        
        $node.find("img.js-my-logo").attr("src",data.face);
        $node.find(".js-customer-service").html(data.name);
        getDefaultChatList();
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);

        /*
		*qq表情
        */
	  	  $node.find(".js-emotion").on("click",function(){
		  	//打开集合,默认qq表情为显示状态
		  	$node.find("#faceGroup").show();
		  	$node.find("#emojiGroup").hide();
		 	ZC_Face.show();
		 	ZC_Face.emojiShow();
		  });
		  $node.find(".btnSend").on("click",function(){//发送btn
				var str = $node.find(".js-sendMessage").val();
				str=ZC_Face.analysis(str);//str已做表情处理
				$node.find(".js-sendMessage").val("");//清空待发送框
				showMsg(uid,"daijm","img/qqarclist/jianjiao.gif",str,null,null,null);//显示气泡
			 })
		  $node.find(".icoLi").on("click",function(){
		  	$(this).addClass("active").siblings().removeClass("active");
		  	$node.find('.groupChildren').hide();
		  	var dataId=$(this).attr("data-src");
		  	$(dataId).show();
		  })


    };

    var initPlugsin = function() {//插件
		global = core.getGlobal();
		initFace();
		uploadFile();
    };

	var initFace = function(){
		/*
		*saytext 待发送内容框
		*group 大表情集合
		*faceGroup表情集合
		*emojiGroup emoji表情集合
		*showId	聊天窗体
		*emotion 表情集合按钮
		*sub_btn 提交按钮
		*path 表情集合路径
		*emojiPath emoji表情集合路径
		*/
		ZC_Face.initConfig({
		 	saytext:".js-sendMessage",
		 	Group:"#faceGroupTarea",
		 	faceGroup:"#faceGroup",
		 	emojiGroup:"#emojiGroup",
		 	showId:".panel-body",
		 	emotion:".js-emotion",
		 	sub_btn:".btnSend",
		 	path:"img/qqarclist/",
		 	emojiPath:"img/emoji/"
		},function(){
			//cbk
		});
		 
		//$node.find('.face').perfectScrollbar();//加载滚动条
	};
	var uploadFile=function(){
		var uploadBtn=$node.find(".jsUpload");//btn
	  	//聊天窗口
		//$chat_new = $("#chat").clone();
		uploadImg(uploadBtn/*,$chat_new*/,node,core,window);//uploadBtn对准btn
		
	};
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };
    init();
}

module.exports = TextArea;
 