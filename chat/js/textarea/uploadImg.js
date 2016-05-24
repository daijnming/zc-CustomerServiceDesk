function uploadImg(uploadBtn,node,core,window) {//,oChat | uploadBtn上传图片按钮，oChat获取用户信息
    var that = {};
    var global = core.getGlobal();
    var AjaxUpload = require('../util/upload.js');
    var Alert = require('../util/modal/alert.js');
    //文件扩展名
    //文件名
    var filetype,
        filename;
    
    var extension;
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

    var onChangeHandler = function(evt,uid,cid) {
        onFormDataUpHandler(uid,cid);
    };

    var onFormDataPasteHandler = function(item,uid,cid) {
        var blob = item.getAsFile();
        if(blob) {
            var reader = new FileReader();
            reader.onload = function(evt) {
                var str = evt.target.result;
                var formData = new FormData();
                formData.append("image",str);
                $.ajax({
                    'url' : '/',
                    'type' : 'post'
                });
            };
            reader.readAsDataURL(blob);
        }
    };

    var onFormDataUpHandler = function(uid,cid) {
        //支持formData则使用formData上传
        if(FormData) {
            var oData = new FormData();
            var input = $uploadBtn[0];
            //判断上传文件的扩展名是否符合上传标准
            if(onjudgeFileExtensionHandler()){
                for(var i = 0;i < input.files.length;i++) {
                    var file = input.files[i];
                    oData.append("file",file);
                }
                oData.append("type","msg");
                oData.append("pid",global.pid);
                oData.append("countTag",1);
                oData.append("source",0);
                $.ajax({
                    url : "/chat/webchat/fileupload.action",
                    type : "POST",
                    data : oData,
                    'dataType' : 'json',
                    processData : false,// 告诉jQuery不要去处理发送的数据
                    contentType : false
                }).success(function(response) {
                    var url = response.url;
                    $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                        'uid' : uid,
                        'cid' : cid,
                        'url' : url,
                        'filetype':filetype,//文件类型
                        'filename':filename//文件名
                    }]);

                }).fail(function(ret) {
                });
            }
            $uploadBtn.val("");
            //清空文本域

        } else {
            onAjaxUploadUpHandler(uid,cid);
        }
    };

    var onAjaxUploadUpHandler = function(uid,cid) {
        var $form = $node.find(".js-fileinfo");

        if(onjudgeFileExtensionHandler()) {
            var id = 'iframe' + +new Date();
            $form.attr("target",id);
            $form.attr("action","/chat/webchat/fileupload.action");
            var $iframe = $('<iframe id="' + id + '" style="display:none;" name="' + id + '"></iframe>');
            //iframe加载完成
            $iframe.on("load", function() {
                var iframe = $iframe[0];
                var pre = iframe.contentWindow.document.body.getElementsByTagName("pre")[0];
                var obj = JSON.parse(pre.innerHTML);
                $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                    'uid' : uid,
                    'cid' : cid,
                    'url' : obj.url,
                    'filetype':filetype,//文件类型
                    'filename':filename//文件名
                }]);
            });
            $(document.body).append($iframe);
            $form.submit();
        }
        $uploadBtn.val("");
        //上传完成,清空文本域
    };
    var onjudgeFileExtensionHandler = function() {//判断上传文件的扩展名
        //获取文件扩展名
        var val = $uploadBtn.val();
        //拓展名
        extension = val.substr(val.lastIndexOf("."));
        //文件名
        filename=val.substring(val.lastIndexOf("\\")+1,val.lastIndexOf("."));
        var reg = /^(.jpg|.JPG|.png|.PNG|.gif|.GIF|.txt|.TXT|.DOC|.doc|.docx|.DOCX|.pdf|.PDF|.ppt|.PPT|.pptx|.PPTX|.xls|.XLS|.xlsx|.XLSX|.RAR|.rar|.zip|.ZIP|.mp3|.MP3|.mp4|.MP4|.wma|.WMA|.wmv|.WMV|.rmvb|.RMVB)$/;
        if(reg.test(extension)) {
                switch (extension)//正在上传
                {
                case ".txt":
                case ".TXT":
                  filetype=".txt";
                  break;
                case ".DOC":
                case ".doc":
                case ".docx":
                case ".DOCX":
                  filetype=".doc";
                  break;
                case ".pdf":
                case ".PDF":
                  filetype=".pdf";
                  break;
                case ".ppt":
                case ".PPT":
                case ".PPTX":
                case ".pptx":
                  filetype=".ppt";
                  break;
                case ".xls":
                case ".XLS":
                case ".xlsx":
                case ".XLSX":
                  filetype=".xls";
                  break;
                case ".RAR":
                case ".rar":
                case ".zip":
                case ".ZIP":
                  filetype=".rar";
                  break;
                case ".mp3":
                case ".MP3":
                case ".mp4":
                case ".MP4":
                case ".wma":
                case ".WMA":
                case ".WMV":
                case ".wmv":
                case ".rmvb":
                case ".RMVB":
                  filetype=".player";
                  break;
                default:
                  filetype="image";

                }
            $node.find(".scrollBox").append('<div class="systeamTextBox systeamNowText"><p class="systeamText">正在上传 '+filename+filetype+'</p></div>');
            return true;
        } else {
          
            var dialog = new Alert({
                'title' : '提示',
                'text' : '上传格式不正确',
                'OK' : function() {

                },
                'footer' : false

            });
            dialog.show();
            return false;
        };
    };
    var bindLitener = function() {

    };

    var init = function() {
        parseDOM();
        bindLitener();
        // onFormDataUpHandler();
    };
    init();

    that.onFormDataPasteHandler = onFormDataPasteHandler;
    that.onChangeHandler = onChangeHandler;
    return that;
}

module.exports = uploadImg;
