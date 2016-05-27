/**
 *
 * @author daijm
 */
function uploadImg(uploadBtn,node,core,window) {//,oChat | uploadBtn上传图片按钮，oChat获取用户信息
    var that = {};
    var global = core.getGlobal();
    var AjaxUpload = require('../util/upload.js');
    var Alert = require('../util/modal/alert.js');
    var fileType = require('./fileType.json');
    //判断文件图标类型用于聊天窗体的显示
    var fileTypeIcon = require('./fileTypeIcon.json');
    //上传附件 插件
    //模板引擎
    var template = require('./template.js');
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
    //粘贴上传 将文件base64数据流通过Uint8Array上传
    var convertBase64ToBlob = function(data) {
        var contentType = data.substring(data.indexOf(":") + 1,data.indexOf(";"));
        var b64Data = data.substring(data.indexOf(",") + 1);
        var byteCharacters = atob(b64Data);
        var byteNumbers = new Array(byteCharacters.length);
        for(var i = 0;i < byteCharacters.length;i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        var blob = new Blob([byteArray], {
            type : contentType
        });
        return blob;
    };
    //粘贴上传
    var onFormDataPasteHandler = function(item,uid,cid) {
        var blob = item.getAsFile();
        if(blob) {
            //判断上传文件的扩展名是否符合上传标准
            if(blob.type == "image/png") {
                var oData = new FormData();
                var reader = new FileReader();
                reader.onload = function(evt) {
                    var file = evt.target.result;
                    var blob = convertBase64ToBlob(file);
                    oData.append("file",blob);
                    oData.append("type","paste");
                    oData.append("pid",global.pid);
                    oData.append("countTag",1);
                    oData.append("source",0);
                    //文件类型
                    var filetype = "image"
                    //文件名
                    var filename = "智齿科技"
                    //文件扩展名
                    var extension = ".png"
                    var dialog = new Alert({
                        'title' : '您确定要上传这张图吗',
                        'text' : '<img src="' + evt.target.result + '">',
                        'OK' : function() {
                                //上传
                                onAjaxUploadUpHandler(uid,cid,oData,extension,filename,filetype);
                        },
                        //'footer' : false

                    });
                    dialog.show();

                };

                reader.readAsDataURL(blob);
            }
        }
    };
    var onFormDataUpHandler = function(uid,cid) {
        //支持formData则使用formData上传
        if(FormData) {
            var oData = new FormData();
            var input = $uploadBtn[0];
            var files="";
            //获取文件扩展名
            var val = $uploadBtn.val();
            //拓展名
            var extension = val.substr(val.lastIndexOf("."));
            //文件名
            var filename=val.substring(val.lastIndexOf("\\")+1,val.lastIndexOf("."));
            //判断文件类型，To index.js
            var filetype=fileType[extension];
            //上传完成之后，文件类型显示的图标
            var fileIcon = fileTypeIcon[filetype];
            //判断上传文件的扩展名是否符合上传标准
            if(onjudgeFileExtensionHandler(extension,filename)){
                for(var i = 0;i < input.files.length;i++) {
                    var file = input.files[i];
                    files += file;
                    oData.append("file",file);
                }
                oData.append("type","msg");
                oData.append("pid",global.pid);
                oData.append("countTag",1);
                oData.append("source",0);
                //上传
                onAjaxUploadUpHandler(uid,cid,oData,extension,filename,filetype,fileIcon);
            }
            //清空文本域
            $uploadBtn.val("");
        } else {
            onIframeUploadUpHandler(uid,cid);
        }
    };
    var onAjaxUploadUpHandler=function(uid,cid,oData,extension,filename,filetype,fileIcon){
            $.ajax({
                url : "/chat/webchat/fileupload.action",
                type : "POST",
                data : oData,
                'dataType' : 'json',
                //告诉jQuery不要去处理发送的数据
                processData : false,
                contentType : false
            }).success(function(response) {
                var url = response.url;
                //通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                $(document.body).trigger('textarea.uploadImgUrl',[{
                    'uid' : uid,
                    'cid' : cid,
                    'url' : url,
                    //文件类型
                    'filetype':filetype,
                    //文件名
                    'filename':filename,
                    //文件扩展名
                    "extension":extension,
                    //上传完成之后，文件类型显示的图标
                    "fileIcon":fileIcon
                }]);

            }).fail(function(ret) {
                alert("上传失败");
            });
    };
    var onjudgeFileExtensionHandler = function(extension,filename) {//判断上传文件的扩展名
        
        var reg = /^(.jpg|.JPG|.png|.PNG|.gif|.GIF|.txt|.TXT|.DOC|.doc|.docx|.DOCX|.pdf|.PDF|.ppt|.PPT|.pptx|.PPTX|.xls|.XLS|.xlsx|.XLSX|.RAR|.rar|.zip|.ZIP|.mp3|.MP3|.mp4|.MP4|.wma|.WMA|.wmv|.WMV|.rmvb|.RMVB)$/;
        if(reg.test(extension)) {
            var conf = $.extend({
                "filename" : filename,
                "extension" : extension
            });
            var _html = doT.template(template.uploading)(conf);
            $node.find(".scrollBox").append(_html);
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
    var onIframeUploadUpHandler = function(uid,cid) {
        var $form = $node.find(".js-fileinfo");
        //需要上传的文件路径
        var val = $uploadBtn.val();
        //拓展名
        var extension = val.substr(val.lastIndexOf("."));
        //文件名
        var filename=val.substring(val.lastIndexOf("\\")+1,val.lastIndexOf("."));
        //判断文件类型，To index.js
        var filetype=fileType[extension];
        //上传完成之后，文件类型显示的图标
        var fileIcon = fileTypeIcon[filetype];
        //判断上传文件的扩展名是否符合上传标准
        if(onjudgeFileExtensionHandler(extension,filename)){
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
                    //文件类型
                    'filetype':filetype,
                    //文件名
                    'filename':filename,
                    //文件扩展名
                    "extension":extension,
                    //上传完成之后，文件类型显示的图标
                    "fileIcon":fileIcon
                }]);
            });
            $(document.body).append($iframe);
            $form.submit();
        }
        //上传完成,清空文本域
        $uploadBtn.val("");
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
