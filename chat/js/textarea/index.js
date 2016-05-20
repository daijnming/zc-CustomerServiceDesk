function TextArea(node,core,window) {
    //var that = {};
    var loadFile = require('../util/load.js')();
    var ZC_Face = require('../util/qqFace.js');
    //表情
    var uploadImg = require('./uploadImg.js');
    //上传附件
    var apihost = "/chat/";
    var global,
        uploadFun;
    var $node,
        $uploadBtn;
    var currentCid,
        currentUid;
    //定义所有模块都能访问到的变量值,传参
    // var getCurrentUserInfo = function(){

    //return {
    //    'uid':'currentUid',
    //    'cid':currentCid
    //};
    //};

    var parseDOM = function() {
        $node = $(node);
        $uploadBtn = $node.find(".js-upload");
        //btn
        $sendMessage = $node.find(".js-sendMessage");
        $botTextBox = $node.find(".js-botTextBox");
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
    var onSelected = function(evt,data) {
        currentUid = data.data.uid;
        currentCid = data.data.cid;

        if(data.data.from == 'online') {
            $botTextBox.show();
            botTextBoxPosition();
            //重新定义聊天体的高度
        } else if(data.data.from == 'history') {
            $botTextBox.hide();
            botTextBoxPosition();
            //重新定义聊天体的高度
        }
    };

    var onImageUpload = function(evt,data) {
        $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到显示台
            'answer' : '<img class="webchat_img_upload upNowImg" src="' + data.url + '" />',
            'uid' : currentUid,
            'cid' : currentCid,
            'date': +new Date()//时间戳
        }]);
    };

    var onbtnSendHandler = function(evt) {
        var str = $sendMessage.val();

           /*if(/^\n+$/g.test(str)||/^\r+$/g.test(str)){
            alert();
                $sendMessage.val("")
            }*/
        if(str.length == 0 || /^\s+$/g.test(str)) {//判断输入框是否为空
                $sendMessage.val("")
                return false;
        } else {
               $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到显示台
                    'answer' : str,
                    'uid' : currentUid,
                    'cid' : currentCid,
                    'date': +new Date()
                }]);
        }
        $sendMessage.val("");
        //清空待发送框
    };
    //智能回复
    var onIntelligencereplyHandler = function(evt,data) {
        if(data.data.status=="2"){
            $sendMessage.val(data.data.msg).focus();
        }
        
    }
    //快捷回复
    var onQuickreplyHandler = function(evn,data) {
        $sendMessage.val(data.data).focus();
    };
    var onEnterSendHandler = function(evt) {
        //监听文本框回车
        //\n\r回车符,,,e.shiftKey是否按住shift键
        var str = $sendMessage.val();
        if(evt.keyCode == 13) {
            //有回车符，清空结束
            if(/^\n+$/g.test(str)||/^\r+$/g.test(str)){
                $sendMessage.val("")
                return false;
            }else{
                onbtnSendHandler()
                $sendMessage.val("")
            }
        }
       
    };
    var onloadHandler = function(evt,data) {
        $node.find("img.js-my-logo").attr("src",data.face);
        $node.find(".js-customer-service").html(data.name);
    };
    var uploadFile = function() {
        uploadFun.onChangeHandler(currentUid,currentCid);

    };

    var botTextBoxPosition = function() {
        var botTextBoxHeight = $botTextBox.height();
        var status = 1;

        if($node.find(".js-botTextBox").css("display") == "block") {
            status = 2;
        }
        switch (status) {
            case 1:
                $('.scrollBoxParent').height(($(window).height() - (50 + 52 )) + 'px');
                //聊天体默认高度
                break;
            case 2:
                $('.scrollBoxParent').height(($(window).height() - (50 + 52 + botTextBoxHeight)) + 'px');
                break;
        }
        $botTextBox.css("bottom","-232px")
    };
    var isHiddenBotTextBox = function() {
        $botTextBox.hide();
    };
    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $(document.body).on('leftside.onselected',onSelected);
        $(document.body).on("textarea.uploadImgUrl",onImageUpload);
        //监听历史用户、在线用户，控制输入框
        $(document.body).on('rightside.onSelectedByFastRelpy',onQuickreplyHandler);
        //监听快捷回复
        $(document.body).on('rightside.onChatSmartReply',onIntelligencereplyHandler);
        //监听智能回复
        $(window || document.body).on("resize",botTextBoxPosition);
        //控制输入框的位置
        $node.find(".js-btnSend").on("click",onbtnSendHandler);
        //发送按钮
        $sendMessage.on("keydown",onEnterSendHandler);
        /*
         *
         qq表情
         */
        $node.find(".js-emotion").on("click",onEmotionClickHandler);
        $node.find(".icoLi").on("click",onEmotionIcoClickHandler);
        $node.find('.js-upload').on("change",uploadFile);
        //使用formData上传附件
    };
    var initFace = function() {
        /*
         *saytext 待发送内容框
         *group 大表情集合
         *faceGroup表情集合
         *emojiGroup emoji表情集合
         *showId    聊天窗体
         *emotion 表情集合按钮
         *sub_btn 提交按钮
         *path 表情集合路径
         *emojiPath emoji表情集合路径
         */
        ZC_Face.initConfig({
            saytext : ".js-sendMessage",
            Group : "#faceGroupTarea",
            faceGroup : "#faceGroup",
            emojiGroup : "#emojiGroup",
            //showId : ".panel-body",
            emotion : ".js-emotion",
            //sub_btn : ".js-btnSend",
            path : "chatres/common/emotes/qqarclist/",
            emojiPath : "chatres/common/emotes/emoji/"
        }, function() {
            //cbk
        });
        //$node.find('#faceGroup').perfectScrollbar();//加载滚动条
    };
    var onEmotionClickHandler = function() {
        //打开集合,默认qq表情为显示状态
        $node.find("#faceGroup").show();
        $node.find("#emojiGroup").hide();
        $node.find(".icoLi").removeClass("active");
        $node.find(".firsticoLi").addClass("active");
        ZC_Face.show();
        ZC_Face.emojiShow();

    };
    var onEmotionIcoClickHandler = function() {
        //qq表情tab
        $(this).addClass("active").siblings().removeClass("active");
        $node.find('.groupChildren').hide();
        var dataId = $(this).attr("data-src");
        $(dataId).show();
    };
    var initPlugsin = function() {//插件

        uploadFun = uploadImg($uploadBtn,node,core,window);
        //上传图片
        initFace();
        $node.find(".item").perfectScrollbar();
        isHiddenBotTextBox();
        botTextBoxPosition();
        //qq表情滚动插件
    };
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };

    init();

}

module.exports = TextArea;
