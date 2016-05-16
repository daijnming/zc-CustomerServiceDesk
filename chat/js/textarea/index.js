<<<<<<< HEAD

function TextArea(node,core,window){
    //var that = {};
	var loadFile = require('../util/load.js')();
	var showMsg=require('./showMsg.js');//会话气泡
	var ZC_Face=require('../util/qqFace.js');//表情
	var uploadImg=require('./uploadImg.js');//上传附件
	var apihost = "http://test.sobot.com/chat/";
    var global,uploadFun;
    var $node, $uploadBtn;
    var currentCid,currentUid;
    //定义所有模块都能访问到的变量值,传参
   // var getCurrentUserInfo = function(){
         
        //return {
        //    'uid':'currentUid',
        //    'cid':currentCid
        //};
    //};

    var parseDOM = function() {
        $node = $(node);
        $uploadBtn=$node.find(".js-upload");//btn
        $sendMessage=$node.find(".js-sendMessage");
        $botTextBox=$node.find(".js-botTextBox");
    };
    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $node.find(".js-users-list").append(li);
=======
function TextArea(node,core,window) {
    var loadFile = require('../util/load.js')();
    var showMsg = require('./showMsg.js');
    //会话气泡
    var ZC_Face = require('../util/qqFace.js');
    //表情
    var uploadImg = require('./uploadImg.js');
    //上传附件
    var apihost = "http://test.sobot.com/chat/";
    var global;
    var $node;

    var parseDOM = function() {
        $node = $(node);
        $sendMessage = $node.find(".js-sendMessage");
>>>>>>> e519f61ab278445a9e3745298573c854677b5847
    };

    var onReceive = function(value,data) {

    };
<<<<<<< HEAD
    var onSelected = function(evt,data){
         currentUid=data.data.uid;
         currentCid=data.data.cid; 

        if(data.data.from=='online'){
            $botTextBox.show();
            botTextBoxPosition();//重新定义聊天体的高度
        }else if(data.data.from=='history'){
            $botTextBox.hide();
            botTextBoxPosition();//重新定义聊天体的高度
        }
    };

    var onbtnSendHandler=function(){
       
=======
    var onSelected = function(evt,data) {
        global.uid = data.data.uid;
        global.cid = data.data.cid;
        if(data.data.from == 'online') {
            $node.find(".js-botTextBox").show();
        } else if(data.data.from == 'history') {
            $node.find(".js-botTextBox").hide();
        }
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
    var onbtnSendHandler = function() {

>>>>>>> e519f61ab278445a9e3745298573c854677b5847
        var str = $sendMessage.val();
        str = ZC_Face.analysis(str);
        //str已做表情处理
        $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到显示台
<<<<<<< HEAD
            'answer':str,
            'uid':currentUid,
            'cid':currentCid
=======
            'answer' : str,
            'uid' : global.uid,
            'cid' : global.cid
>>>>>>> e519f61ab278445a9e3745298573c854677b5847
        }]);

        $sendMessage.val("");
        //清空待发送框
        //showMsg(uid,"daijm","img/qqarclist/jianjiao.gif",str,null,null,null);//显示气泡
    };
    var onIntelligencereplyHandler = function(evt,data) {//智能回复
        $sendMessage.val(data.data)
    }
<<<<<<< HEAD
    var onQuickreplyHandler=function(evn,data){//快捷回复
        $sendMessage.val(data.data)
    };
    var onEnterSendHandler=function(evt){
            //监听文本框回车
            if(evt.keyCode == 13){
                if($sendMessage.val()==""){
                    return false;
                }else{
                    onbtnSendHandler()
                }
=======
    var onEnterSendHandler = function(evt) {
        //监听文本框回车
        if(evt.keyCode == 13) {
            if($sendMessage.val() == "") {
                return false;
            } else {
                onbtnSendHandler()
>>>>>>> e519f61ab278445a9e3745298573c854677b5847
            }
        }

    };
    var onloadHandler = function(evt,data) {
        $node.find("img.js-my-logo").attr("src",data.face);
        $node.find(".js-customer-service").html(data.name);
    };
<<<<<<< HEAD
    var uploadFile=function(){
       uploadFun.onChangeHandler(currentUid,currentCid);
        
    };
    
    var botTextBoxPosition=function(){
            var botTextBoxHeight=$botTextBox.height();
            var status=1;
           
            if($node.find(".js-botTextBox").css("display")=="block"){status=2}
             switch (status) {
                case 1:
                    $('.scrollBoxParent').height(($(window).height() - (50 + 52 ))+'px');//聊天体默认高度
                    break;
                case 2:
                    $('.scrollBoxParent').height(($(window).height() - (50 + 52 + botTextBoxHeight))+'px');
                    break;    
            }
            

            
            $botTextBox.css("bottom","-230px")
    };
    var isHiddenBotTextBox=function(){
         $botTextBox.hide();
=======

    var onQuickreplyHandler = function(evn,data) {
        $sendMessage.val(data.data)
>>>>>>> e519f61ab278445a9e3745298573c854677b5847
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
<<<<<<< HEAD
        *
        qq表情
        */
        $node.find(".js-emotion").on("click",onEmotionClickHandler);
        $node.find(".icoLi").on("click",onEmotionIcoClickHandler);
        $node.find('.js-upload').on("change",uploadFile);//使用formData上传附件
=======
         *
         qq表情
         */
        $node.find(".js-emotion").on("click",onEmotionClickHandler);
        $node.find(".icoLi").on("click",onEmotionIcoClickHandler);

    };

    var initPlugsin = function() {//插件
        global = core.getGlobal();
        initFace();
        uploadFile();
        //console.log(perfectScrollbar);
        //$node.find(".item").perfectScrollbar();

>>>>>>> e519f61ab278445a9e3745298573c854677b5847
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
            path : apihost+"chatres/common/emotes/qqarclist/",
            emojiPath : apihost+"chatres/common/emotes/emoji/"
        }, function() {
            //cbk
        });

        $node.find('#faceGroup').perfectScrollbar();
        //加载滚动条
    };
<<<<<<< HEAD
    var onEmotionClickHandler = function(){
        //打开集合,默认qq表情为显示状态
        $node.find("#faceGroup").show();
        $node.find("#emojiGroup").hide();
        $node.find(".icoLi").removeClass("active");
        $node.find(".firsticoLi").addClass("active");
        ZC_Face.show();
        ZC_Face.emojiShow();
    };
    var onEmotionIcoClickHandler = function(){
        //qq表情tab
        $(this).addClass("active").siblings().removeClass("active");
        $node.find('.groupChildren').hide();
        var dataId=$(this).attr("data-src");
        $(dataId).show();
    };
    var initPlugsin = function() {//插件
        uploadFun = uploadImg($uploadBtn,node,core,window); //上传图片
        // that.getCurrentUserInfo = getCurrentUserInfo;
        initFace();
        //console.log(perfectScrollbar);
        //$node.find(".item").perfectScrollbar();
       
=======

    var uploadFile = function() {
        var uploadBtn = $node.find(".js-upload");
        //btn
        //聊天窗口
        //$chat_new = $("#chat").clone();
        uploadImg(uploadBtn/*,$chat_new*/,node,core,window);
        //uploadBtn对准btn

    };
    var botTextBoxPosition = function() {
        console.log(1)
        $('.scrollBoxParent').height(($(window).height() - (50 + 52 + 230)) + 'px');
        $(".js-botTextBox").css("bottom","-230px")
>>>>>>> e519f61ab278445a9e3745298573c854677b5847
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
