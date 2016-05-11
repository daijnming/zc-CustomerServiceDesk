function TextArea(node,core,window) {
    var loadFile = require('../util/load.js')();
    var global = core.getGlobal();
    var baseUrl = global.baseUrl;
    var uid = "daijm";
    var showMsg = require('./showMsg.js');
    //会话气泡
    var ZC_Face = require('../util/qqFace.js');
    //表情
    var AjaxUpload = require('../util/upload.js');
    //上传附件
    var $node;
    console.log(showMsg);
    //var apihost = "http://test.sobot.com/chat/";
    //var sendurl = apihost+"admin/send1.action"
    var parseDOM = function() {
        $node = $(node);
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
        $node.find(".js-emotion").click(function() {
            //打开集合,默认qq表情为显示状态
            $node.find("#faceGroup").show();
            $node.find("#emojiGroup").hide();
            ZC_Face.show();
            ZC_Face.emojiShow();
        });
        $node.find(".btnSend").click(function() {//发送btn
            var str = $node.find(".js-sendMessage").val();
            str = ZC_Face.analysis(str);
            //str已做表情处理
            $node.find(".js-sendMessage").val("");
            //清空待发送框
            showMsg(uid,"daijm","img/qqarclist/jianjiao.gif",str,null,null,null);
            //显示气泡
        })
        $node.find(".icoLi").click(function() {
            $(this).addClass("active").siblings().removeClass("active");
            $node.find('.groupChildren').hide();
            var dataId = $(this).attr("data-src");
            $(dataId).show();
        })
    };

    var initPlugsin = function() {//插件
        global = core.getGlobal();
        initFace();
        uploadFile();
    };

    var initFace = function() {
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
            saytext : ".js-sendMessage",
            Group : "#faceGroupTarea",
            faceGroup : "#faceGroup",
            emojiGroup : "#emojiGroup",
            showId : ".panel-body",
            emotion : ".js-emotion",
            sub_btn : ".btnSend",
            path : "img/qqarclist/",
            emojiPath : "img/emoji/"
        }, function() {
            //cbk
        });

        //$node.find('.face').perfectScrollbar();//加载滚动条
    };
    var uploadFile = function() {
        var uploadBtn = $node.find(".jsUpload");
        //btn

        uploadImg(uploadBtn);
        //对准btn

        function uploadImg(uploadBtn) {

            var uploadOption = {//上传附件
                action : /*apihost+*/"webchat/fileupload.action",
                name : "file",
                autoSubmit : true,
                data : {
                    type : "msg",
                    countTag : 0
                },
                responseType : "JSONP",
                contentType : "application/x-www-form-urlencoded; charset=utf-8",
                onChange : function(file,extension) {//file文件名称，

                    //if(source==0){
                    if(!(extension && /^(jpg|JPG|png|PNG|gif|GIF|txt|TXT|DOC|doc|docx|DOCX|pdf|PDF|ppt|PPT|pptx|PPTX|xls|XLS|xlsx|XLSX|RAR|rar|zip|ZIP)$/.test(extension))) {//|mp3|MP3|mp4|MP4|wma|WMA|wmv|WMV|rmvb|RMVB
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
                    /*}else{
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
                     }*/

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
                        console.log(1);
                        //去除admin/
                        //var con = '<img src="img/upImgLoad.png" class="webchat_img_upload upNowImg">';

                        showMsg(uid,"daijm","img/qqarclist/jianjiao.gif","",null,"<img src='img/appType.png'>",base64file);
                        //显示气泡
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

                    //imgCallBack(uid, url, cid, countTag);

                }
            }
            /*
             *uploadBtn 附件按钮
             *uploadOption 上传参数
             */
            new AjaxUpload(uploadBtn,uploadOption);
        }

    };
    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };
    init();
}

module.exports = TextArea;
