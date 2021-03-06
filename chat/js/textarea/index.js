/**
 *
 * @author daijm
 */
function TextArea(node,core,window) {
    var global = core.getGlobal();
    var $faceGroupTarea;//表情选择按钮
    //var that = {};
    var loadFile = require('../util/load.js')();
    //表情
    var ZC_Face = require('../util/qqFace.js');
    //上传附件
    var uploadImg = require('./uploadImg.js');
    var inputCache = {};
    //模板引擎
    var template = require('./template.js');
    var apihost = "/chat/";
    var uploadFun;
    var $node,
        $uploadBtn;
    var currentCid,
        currentUid,
        answer,
        timer;
    //传给聊天的url
    var parseDOM = function() {
        $node = $(node);
        $uploadBtn = $node.find(".js-upload");
        //btn
        $sendMessage = $node.find(".js-sendMessage");
        $botTextBox = $node.find(".js-botTextBox");
        $faceGroupTarea = $node.find('#faceGroupTarea');
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
        if(currentUid) {
            inputCache[currentUid] = $sendMessage.val();
        }
        currentUid = data.data.uid;
        currentCid = data.data.cid;
        if(data.data.from == 'online') {
            //输入内容做缓存
            onTabSelectedSaveInner(currentUid);
            $botTextBox.show();
            $sendMessage.focus();
            botTextBoxPosition();
            //重新定义聊天体的高度
        } else if(data.data.from == 'history') {
            $botTextBox.hide();
            botTextBoxPosition();
            //重新定义聊天体的高度
        }
    };
    //更新cid;
    var oncidchangeHandler = function(evt,data) {
        currentCid = data;
    };
    //输入内容做缓存
    var onTabSelectedSaveInner = function(uid) {
        if(inputCache[uid]) {
            $sendMessage.val(inputCache[uid]);
        } else {
            $sendMessage.val('');
        }
    };
    var onImageUpload = function(evt,data) {
        onFileTypeHandler(data);
        //通过textarea.send事件将用户的数据传到显示台
        $(document.body).trigger('textarea.send',[{
            'answer' : answer,
            'uid' : data.uid,
            'cid' : data.cid,
            //时间戳
            'date' : +new Date()
        }]);
    };
    var onFileTypeHandler = function(data) {

        //先判断是否为图片
        if(isImage(data)) {
            //正在上传
            $node.find(".js-systeamTextBox" + data.date).remove();
            //
            var conf = $.extend({
                "url" : data.url,
                "filename" : data.filename,
                "extension" : data.extension,
                "fileIcon" : data.fileIcon
            });
            answer = doT.template(template.tranfiletype)(conf);
        }

    };
    var isImage = function(data) {
        //正在上传
        switch (data.filetype) {
            case "image":
                $node.find(".js-systeamTextBox" + data.date).remove();
                var conf = $.extend({
                    "url" : data.url
                });
                answer = doT.template(template.fileImage)(conf);
                return false;
                break;
            default:
                return true;
        }
    };
    var onbtnSendHandler = function(evt) {
        var str = $sendMessage.val();
        //ZC_Face.convertToEmoji($sendMessage.val());
        //判断输入框是否为空
        if(str.length == 0 || /^\s+$/g.test(str)) {
            $sendMessage.val("")
            return false;
        } else {
            //通过textarea.send事件将用户的数据传到显示台
            $(document.body).trigger('textarea.send',[{
                'answer' : str,
                'uid' : currentUid,
                'cid' : currentCid,
                'date' : +new Date()
            }]);
        }
        $sendMessage.val("");
        //清空待发送框
    };
    //智能回复
    var onIntelligencereplyHandler = function(evt,data) {
        if(data.data.status == "2") {

            $sendMessage.val(data.data.txt).focus();
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
            onbtnSendHandler()
            return false;
        }

    };
    //定位光标
    var gotoxyHandler = function(evt,data) {
        var src = data.answer;
        //将新表情追加到待发送框里
        var oTxt1 = document.getElementById("js-sendMessage");
        var cursurPosition = -1;
        if(oTxt1.selectionStart || oTxt1.selectionStart == 0) {//非IE浏览器
            cursurPosition = oTxt1.selectionStart;
        } else {//IE
            var range = document.selection.createRange();
            range.moveStart("character",-oTxt1.value.length);
            cursurPosition = range.text.length;
        }
        var currentSaytextBefore = $sendMessage.val().substring(0,cursurPosition);
        var currentSaytextAfter = $sendMessage.val().substring(cursurPosition);
        var currentSaytext = currentSaytextBefore + src + currentSaytextAfter;
        $($sendMessage).val(currentSaytext);
        //定位光标
        var pos = (currentSaytextBefore + src).length;
        if(oTxt1.setSelectionRange) {
            oTxt1.setSelectionRange(pos,pos);
            oTxt1.focus();
        } else if(oTxt1.createTextRange) {
            var range = oTxt1.createTextRange();
            range.collapse(true);
            range.moveEnd('character',pos);
            range.moveStart('character',pos);
            range.select();
        }
    };
    var onloadHandler = function(evt,data) {
        $node.find("img.js-my-logo").attr("src",data.face);
        $node.find(".js-customer-service").html(data.name);
        initFace();
    };
    var uploadFile = function() {
        uploadFun.onChangeHandler(currentUid,currentCid);
    };

    var onFilePaste = function(e) {
        var evt = e.originalEvent;
        for(var i = 0,
            len = evt.clipboardData.items.length;i < len;i++) {
            var item = evt.clipboardData.items[i];
            if(item.kind === 'file') {
                e.preventDefault();
                uploadFun.onFormDataPasteHandler(item,currentUid,currentCid);
            }
        }
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
    //用户正在输入
    var changeingInput = function(evt) {
        clearInterval(timer);
        timer = setTimeout(function(){
            //if($sendMessage.val() == "" && evt.keyCode != 13)
            $.ajax({
                url : '/chat/admin/input.action',
                type : 'post',
                dataType : "json",
                data : {
                    'uid' : global.id,
                    'cid' : currentCid
                },
                success:function(data) {
                    if(data.status == 1)
                    {
                        //this.pressd = 0;
                    }
                }
            });
        },500)
    }
    var isHiddenBotTextBox = function() {
        $botTextBox.hide();
    };
    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $(document.body).on('leftside.onselected',onSelected);
        //监听cid变化，及时更新cid;
        $(document.body).on('leftside.oncidchange',oncidchangeHandler);
        //监听历史用户、在线用户，控制输入框
        $(document.body).on("textarea.uploadImgUrl",onImageUpload);
        //定位光标
        $(document.body).on("textarea.gotoxy",gotoxyHandler);
        //监听快捷回复
        $(document.body).on('rightside.onSelectedByFastRelpy',onQuickreplyHandler);
        //监听智能回复
        $(document.body).on('rightside.onChatSmartReply',onIntelligencereplyHandler);
        //控制输入框的位置
        $(window || document.body).on("resize",botTextBoxPosition);
        //发送按钮
        $node.find(".js-btnSend").on("click",onbtnSendHandler);
        //回车发送
        $sendMessage.on("keydown",onEnterSendHandler);
        //粘贴上传(只能传截屏)
        $sendMessage.on("paste",onFilePaste);
        //正在输入
        $sendMessage.on("keydown",changeingInput);
        /*
         *
         qq表情
         */
        $node.find(".js-emotion").on("click",onEmotionClickHandler);
        $node.find(".icoLi").on("click",onEmotionIcoClickHandler);
        $node.find('.js-upload').on("change",uploadFile);

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
            path : global.scriptPath + "assets/images/qqarclist/",
            emojiPath : global.scriptPath + "assets/images/emoji/"
        }, function() {
            //cbk
        });
    };
    var onEmotionClickHandler = function() {
        //打开集合,默认qq表情为显示状态
        ZC_Face.show(global);
        ZC_Face.emojiShow(global);
        $($faceGroupTarea).css('display')=='block'?$(this).addClass('select'):$(this).removeClass('select');
    };
    var onEmotionIcoClickHandler = function() {
        //qq表情tab
        $(this).addClass("active").siblings().removeClass("active");
        $node.find('.groupChildren').hide();
        var dataId = $(this).attr("data-tab");
        $(dataId).show();
    };
    var initPlugsin = function() {//插件

        uploadFun = uploadImg($uploadBtn,node,core,window);
        //上传图片

        //qq表情滚动插件
        $node.find(".item").perfectScrollbar();
        isHiddenBotTextBox();
        botTextBoxPosition();

    };
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };

    init();

}

module.exports = TextArea;
