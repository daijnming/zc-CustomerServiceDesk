function Core(window) {
    //alert('注意！这是新版页面！');
    var that = {};
    var token = '';
    var queryParam;
    var polling = require('./socket/json.js');
    var WebSocket = require('./socket/websocket.js');
    var HearBeat = require("./socket/heartbeat.js");
    var normalMessageAdapter = require('../util/normatMessageAdapter.js');
    var messageTypeConfig = require('./messagetype.json');
    var Promise = require('../util/promise.js');
    var notificationPermission;
    var messageCache = {};
    var $body;
    var socket,
        Notification = window.Notification || window.webkitNotifications;
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
    var basicInfoHandler = function(value,promise) {
        token = value.token || window.sessionStorage.getItem('temp-id');
        promise.resolve({
            'success' : !!value.token
        });
    };
    /**
     * @category 消息的去重，排序
     */
    var messageFilter = function(list) {
        var arr = [];
        for(var i = 0,
            len = list.length;i < len;i++) {
            var item = list[i];
            if(!messageCache[item.msgId]) {
                arr.push(item);
                messageCache[item.msgId] = 1;
            }
        }
        arr = arr.sort(function(a,b) {
            return a.t > b.t;
        });
        return arr;
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
                    var path = location.href.indexOf("admins_new") < 0 ? "admins/" : "admins_new/";
                    global.baseUrl = location.protocol + "//" + location.host + "/chat/" + ((!value.success) ? path : '');
                    if(location.href.indexOf("www.sobot.com") >= 0) {
                        global.socketBase = "";
                    } else {
                        global.socketBase = "ws://test.sobot.com/webchat";
                    }
                    if(!value.success) {
                        global.scriptPath = "//static.sobot.com/chat/admins/";
                    } else {
                        global.scriptPath = global.baseUrl;
                    }
                    $(".js-loading-layer").hide();
                    promise.resolve(ret);
                } else {
                    alert('当前窗口登录失效，请重新登录');
                    $(window).unbind("beforeunload");
                    window.close();
                    window.location.href = "/console/login";
                }
            });
        }).then(function(value,promise) {
            new HearBeat(that).start();
            $body.trigger("core.onload",[global]);
            getMessage();
        });
    };

    var systemMessageAdpater = function(value) {
        if(value.type === 102) {
            audioOnline.play();
            createNotification(value,102);
        }
        value.description = messageTypeConfig[value.type];

    };

    var createNotification = function(data,type) {
        var title = type == 103 ? '用户' + data.uname + '发送了一条消息' : '新用户上线了！';
        var desc = type == 103 ? data.desc : data.uname;
        var temp = $("<div></div>");
        temp.html(desc);
        desc = temp.html();
        var noti = new Notification(title, {
            'body' : desc,
            'icon' : 'assets/images/logo.png',
            'tag' : '1'
        });
        noti.onclick = (function(id,noti) {
            return function() {
                window.focus();
                noti.close();
                $body.trigger('notification.click',[id]);
            };
        })(data.uid,noti);
        setTimeout(function() {
            noti.close();
        },300 * 1000);
    };

    var messageAdapter = function(list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var value = list[i];
            if(value.type === 103) {
                audioNewMessage.play();
                normalMessageAdapter(value);
                createNotification(value,103);
            } else if(value.type == 109 && value.status == 2) {
                alert('另外一个窗口已经登录，您被强迫下线！');
                $(window).unbind("beforeunload");
                window.close();
                window.location.href = "/console/login/";
            } else {
                systemMessageAdpater(value);
            }
        }
    };
    var getGlobal = function() {
        return global;
    };

    var parseDOM = function() {
        $body = $(document.body);
    };

    var bindListener = function() {
        $body.on("emergency.netclose", function() {
            alert('与服务器连接中断！');
            $(window).unbind("beforeunload");
            window.close();
            window.location.href = "/console/login";
        });
        $(window).on("blur", function() {
        });
        $(window).on("beforeunload", function() {
            return '';
        });
    };

    var socketFactory = function() {
        if(window.WebSocket && false) {
            socket = new WebSocket(global);
        } else {
            socket = new polling(global);
        }

        socket.on("receive", function(list) {
            list = messageFilter(list);
            messageAdapter(list);
            $body.trigger('core.receive',[list]);
        });
    };

    var initNotification = function() {
        if(Notification && Notification.permission !== 'granted') {
            Notification.requestPermission(function() {
                notificationPermission = Notification.requestPermission();
            });
        } else {
        }
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
        initNotification();
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
