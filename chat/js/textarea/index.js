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

    var onbtnSendHandler = function() {

        var str = $sendMessage.val();
        str = ZC_Face.analysis(str);
        //str已做表情处理
        $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到显示台
            'answer' : str,
            'uid' : currentUid,
            'cid' : currentCid
        }]);
        $sendMessage.val("");//清空待发送框
        //清空待发送框
        //showMsg(uid,"daijm","img/qqarclist/jianjiao.gif",str,null,null,null);//显示气泡
    };
    var onIntelligencereplyHandler = function(evt,data) {//智能回复
        $sendMessage.val(data.data)
    }
    var onQuickreplyHandler = function(evn,data) {//快捷回复
        $sendMessage.val(data.data)
    };
    var onEnterSendHandler = function(evt) {
        //监听文本框回车
        if(evt.keyCode == 13) {
            if($sendMessage.val() == "") {
                return false;
            } else {
                onbtnSendHandler()
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
            status = 2
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

        $botTextBox.css("bottom","-230px")
    };
    var isHiddenBotTextBox = function() {
        $botTextBox.hide();
    };
    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $(document.body).on('leftside.onselected',onSelected);
        //监听历史用户、在线用户，控制输入框
        $(document.body).on('rightside.onSelectedByFastRelpy',onQuickreplyHandler);
        //监听快捷回复
        $(document.body).on('rightside.onselectedmsg',onIntelligencereplyHandler);
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
            emojiPath :"chatres/common/emotes/emoji/"
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
        // that.getCurrentUserInfo = getCurrentUserInfo;
        initFace();
        //console.log(perfectScrollbar);
        //$node.find(".item").perfectScrollbar();
    };
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
        isHiddenBotTextBox();
        botTextBoxPosition();

    };
    init();

}

module.exports = TextArea;
