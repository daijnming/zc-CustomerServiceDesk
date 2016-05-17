function uploadImg(uploadBtn,node,core,window) {//,oChat | uploadBtn上传图片按钮，oChat获取用户信息
    var that = {};
    var AjaxUpload = require('../util/upload.js');
    //上传附件 插件
    //var showMsg=require('./showMsg.js');//会话气泡
    //console.log("43d1dd:"+textarea)

    //for (var i in textarea){
    //console.log(textarea[i]);
    //}
    //var uid = oChat.attr("uid");
    //var cid = oChat.attr("cid");
    //var source = oChat.attr("source");
    /*if($('#chat_input_'+ uid).attr("imgUpload") == "yes")//解决粘贴图片事件重复
    {
    return
    }

    Global.map = Global.map || {};
    Global.map[uid] = Global.map[uid] || {};*/
    //var apihost = "http://test.sobot.com/chat/";
    var parseDOM = function() {
        $node = $(node);
        $uploadBtn = $node.find(".js-upload");
    };

    /*
     *uploadBtn 附件按钮
     *uploadOption 上传参数
     */

    var onChangeHandler = function(uid,cid) {
        onFormDataUpHandler(uid,cid);
    };

    var onFormDataUpHandler = function(uid,cid) {

        if(FormData) {//支持formData则使用formData上传
            var oData = new FormData();
            var input = $uploadBtn[0];
            for(var i = 0;i < input.files.length;i++) {
                var file = input.files[i];
                oData.append(file.name,file);
            }
            $.ajax({
                url : "/chat/webchat/fileupload.action",
                type : "POST",
                data : oData,
                processData : false,// 告诉jQuery不要去处理发送的数据
                contentType : false
            }).success(function(response) {
                var url = response.url;
                $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                    'uid' : uid,
                    'cid' : cid,
                    'url' : url
                }]);
                  $uploadBtn.val("");//上传完成,清空文本域
            }).fail(function(ret) {
                console.log("fail")
            });

        } else {
            onAjaxUploadUpHandler(uid,cid);
        }
    };
    var onAjaxUploadUpHandler = function(uid,cid) {
        var $form = $node.find(".js-fileinfo");
        var id = 'iframe' + +new Date();
        $form.attr("target",id);
        $form.attr("action","/chat/webchat/fileupload.action");
        var $iframe = $('<iframe id="' + id + '" style="display:none;" name="' + id + '"></iframe>');
        $iframe.on("load", function() {
            var iframe = $iframe[0];
            var pre = iframe.contentWindow.document.body.getElementsByTagName("pre")[0];
            var obj = JSON.parse(pre.innerHTML);
            $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                'uid' : uid,
                'cid' : cid,
                'url' : obj.url
            }]);
        });
        $(document.body).append($iframe);
        $form.submit();
        $uploadBtn.val("");//上传完成,清空文本域
    };
    var bindLitener = function() {

    };

    var init = function() {
        parseDOM();
        bindLitener();
        // onFormDataUpHandler();
    };
    init();

    that.onChangeHandler = onChangeHandler;
    return that;
}

module.exports = uploadImg;
