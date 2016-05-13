function Core(window) {
    var that = {};
    var token = '';
    var queryParam;
    var polling = require('./socket/json.js');
    var HearBeat = require("./socket/heartbeat.js");
    var messageTypeConfig = require('./messagetype.json');
    var Promise = require('../util/promise.js');
    var socket;
    var audioNewMessage,
        audioOnline;
    var defaultParams = {
        answer : "",
        answerType : "",
        cid : "",
        docId : "",
        pid : "",
        questionId : "",
        uid : ""
    };
    var global = {};
    var TYPE_EMOTION = 0,
        TYPE_IMAGE = 1,
        TYPE_TEXT = 2;
    var basicInfoHandler = function(value,promise) {
        token = value.token || window.sessionStorage.getItem('temp-id');
        promise.resolve({});
    };

    /**
     * 将url里面query字符串转换成对象
     */
    var getQueryParam = function() {
        var href = location.href;
        var queryString = href.substring(href.lastIndexOf("?") + 1);
        if(queryString.lastIndexOf("#") >= 0) {
            queryString = queryString.substring(0,queryString.lastIndexOf("#"));
        }
        var list = queryString.split("&");
        var param = {};
        for(var i = 0;i < list.length;i++) {
            var item = list[i];
            var key = item.substring(0,item.indexOf("="));
            var value = item.substring(item.indexOf("=") + 1);
            if(/^-?(\d+)(\.\d+)?$/.test(value)) {
                param[key] = Number(value);
            } else if(value === 'true') {
                param[key] = true;
            } else if(value === 'false') {
                param[key] = false;
            } else {
                param[key] = value;
            }
        }
        return param;
    };

    var getMessage = function() {
        socket.start();
    };

    var initBasicInfo = function() {
        Promise.when(function() {
            var promise = new Promise();
            $.ajax({
                'url' : 'getEnvironment',
                'data' : {
                },
                'dataType' : 'json'
            }).success(function(ret) {
                promise.resolve({
                    'token' : ret.token
                });
            }).fail(function(ret) {
                promise.reject({
                    'token' : null
                });
            });
            return promise;
        }).then(basicInfoHandler,basicInfoHandler).then(function(value,promise) {
            $.ajax({
                'url' : '/chat/admin/connect.action',
                'dataType' : 'json',
                'type' : 'get',
                'data' : {
                    'uid' : queryParam.id,
                    'way' : 1,
                    'st' : queryParam.st || 1,
                    'lt' : queryParam.lt || new Date().getTime(),
                    'token' : token
                }
            }).done(function(ret) {
                if(ret.status == 1 || ret.status == 2) {
                    for(var el in ret) {
                        global[el] = ret[el];
                    }
                    global.baseUrl = location.protocol + "//" + location.host + "/chat/";
                    $(".js-loading-layer").hide();
                    promise.resolve(ret);
                } else {
                    alert('登录失败');
                    window.close();
                    window.location.href = "/console/login";
                }
            });
        }).then(function(value,promise) {
            new HearBeat().start();
            $(document.body).trigger("core.onload",[global]);
            getMessage();
        });
    };

    var normalMessageAdapter = function(value) {
        var content = value.content;
        var reg = /src=['"](.*?)['"]/;
        if(content.indexOf("<img") >= 0) {
            if(content.indexOf("webchat_img_face") >= 0) {
                value.message_type = TYPE_EMOTION;
                value.desc = '[表情]';
            } else if(content.indexOf("webchat_img_upload") >= 0) {
                value.message_type = TYPE_IMAGE;
                value.desc = '[图片]';
            }
            if(reg.test(content)) {
                value.url = RegExp.$1;
            }
        } else if(content.indexOf("<audio") >= 0) {
        } else {
            value.message_type = TYPE_TEXT;
            value.desc = content;
        }
    };

    var systemMessageAdpater = function(value) {
        if(value.type === 102) {
            audioOnline.play();
        }
        value.description = messageTypeConfig[value.type];
    };
    var messageAdapter = function(list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var value = list[i];
            if(value.type === 103) {
                audioNewMessage.play();
                normalMessageAdapter(value);
            } else {
                systemMessageAdpater(value);
            }
        }
    };
    var getGlobal = function() {
        return global;
    };

    var parseDOM = function() {
    };

    var onsend = function(evt,data) {
        console.log(data);
        $.ajax({
            'url' : '/chat/admin/send1.action',
            'dataType' : 'json',
            'type' : "post",
            'data' : $.extend(defaultParams, {
                'answer' : data.answer,
                'cid' : data.cid,
                'uid' : global.id
            })
        });
    };
    var bindListener = function() {
        $(document.body).on("textarea.send",onsend);
        $(document.body).on("emergency.netclose", function() {
            alert('与服务器连接中断！');
            window.close();
            window.location.href = "/console/login";
        });
    };

    var socketFactory = function() {
        if(window.WebSocket && false) {

        } else {
            socket = new polling(global);
        }

        socket.on("receive", function(list) {
            messageAdapter(list);
            $(document.body).trigger('core.receive',[list]);
        });
    };

    var initPlugins = function() {
        queryParam = getQueryParam();
        for(var el in queryParam) {
            global[el] = queryParam[el];
        }
        initBasicInfo();
        socketFactory();
        audioNewMessage = $("#audio1")[0];
        audioOnline = $("#audio2")[0];
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();

    that.getQueryParam = getQueryParam;
    that.getGlobal = getGlobal;
    return that;
}

module.exports = Core;
