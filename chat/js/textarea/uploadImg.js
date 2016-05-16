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
            var oData = new FormData($node.find(".js-fileinfo"));
            oData.append("type","msg");
            oData.append("countTag","0");
            $.ajax({
                url : "/chat/webchat/fileupload.action",
                type : "POST",
                data : oData,
                processData : false,// 告诉jQuery不要去处理发送的数据
                contentType : false
            }).success(function(response) {
                var url = response.url;
                //console.log(url+"+"+uid);
                $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                    'uid' : uid,
                    'cid' : cid,
                    'url' : url
                }]);
            }).fail(function(ret) {
                console.log("fail")
            });

        } else {
            onAjaxUploadUpHandler(uid,cid);
        }
    };
    var onAjaxUploadUpHandler = function(uid,cid) {

        var uploadOption = {//上传附件
            action : "/chat/webchat/fileupload.action",
            name : "file",
            autoSubmit : true,
            data : {
                type : "msg",
                countTag : 0
            },
            responseType : "json",
            /*contentType:"application/x-www-form-urlencoded; charset=utf-8",*/
            onChange : function(file,extension) {//file文件名称，extension扩展名
                //if(source==0){

                if(!(extension && /^(jpg|JPG|png|PNG|gif|GIF|txt|TXT|DOC|doc|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX|xls|XLS|xlsx|XLSX|RAR|rar|zip|ZIP|mp3|MP3|mp4|MP4|wma|WMA|wmv|WMV|rmvb|RMVB)$/.test(extension))) {
                    $.amaran({
                        content : {
                            message : '格式不支持!',
                            size : '请上传正确的文件格式',
                            file : '',
                            icon : 'fa fa-times'
                        },
                        theme : 'default error',
                        position : 'bottom right',
                        inEffect : 'slideRight',
                        outEffect : 'slideBottom'
                    });
                    return false;
                }
                //}

            },
            onSubmit : function(file,extension,base64file) {
                var fileTypeReg = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;

                //uid = $("[class='user active']").attr('uid')
                // cid = $("[class='user active']").attr('cid');
                // usource = $("[class='user active']").attr('usource');

                // Global.map[$("[class='user active']").attr('uid')].count = Global.map[$("[class='user active']").attr('uid')].count || 0;

                //  if (fileTypeReg.test(file)) Global.map[$("[class='user active']").attr('uid')].count++;
                //  uploadOption.data.source = Global.usource;
                //  uploadOption.data.countTag = Global.map[uid].count;

                if(extension && /^(jpg|JPG|png|PNG|gif|GIF)$/.test(extension)) {
                    alert('上传成功');
                    //去除admin/
                    //var con = '<img src="img/upImgLoad.png" class="webchat_img_upload upNowImg">';

                    //showMsg(uid,"daijm","img/qqarclist/jianjiao.gif","",null,"<img src='img/appType.png'>",base64file);//显示气泡
                }
                //else
                //{console.log(2);
                //	var oMsgDom = '<div class="systeamTextBox systeamNowText"><p class="systeamText">正在上传 '+ file +'</p></div>';
                //	$node.find(".panel-body").append(oMsgDom);
                //$node.find('.scrollBoxParent').scrollTop(999999);
                //}
            },
            onComplete : function(file,response) {
                var countTag = 0,
                    res,
                    url,
                    size;
                if( typeof response == 'string') {
                    res = JSON.parse(response);
                    url = res.url;
                    console.log(url);
                    countTag = parseInt(res.countTag) - 1;
                } else {
                    url = response.url;
                }

                size = response.filesize;
                if(size == false) {
                    $.amaran({
                        content : {
                            message : '所传文件过大!',
                            size : '',
                            file : '',
                            icon : 'fa fa-times'
                        },
                        theme : 'default error',
                        position : 'bottom right',
                        inEffect : 'slideRight',
                        outEffect : 'slideBottom'
                    });
                    return;
                }
                alert('上传成功');
                $(document.body).trigger('textarea.uploadImgUrl',[{//通过textarea.uploadImgUrl事件将图片地址传到聊天窗体
                    'uid' : uid,
                    'cid' : cid,
                    'url' : url
                }]);

            }
        }
        new AjaxUpload($uploadBtn,uploadOption);

    };
    var bindLitener = function() {

    };

    var init = function() {
        parseDOM();
        bindLitener();
        onFormDataUpHandler();
    };
    init();

    that.onChangeHandler = onChangeHandler;
    return that;
}

module.exports = uploadImg;
