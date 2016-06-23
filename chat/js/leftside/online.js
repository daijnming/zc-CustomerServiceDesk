/**
 * @author Treagzhao
 */
function Online(node,core,window) {
    var $node,
        $body;
    var that = {};
    var chatItemList = {};
    var unreadList = require('./unreadlist.js');
    var global;
    var USOURCE = require('./source.json');
    var Item = require('./chatItem.js');
    var normalMessageAdapter = require('../util/normatMessageAdapter.js');
    var Alert = require('../util/modal/alert.js');
    var loadFile = require('../util/load.js')();
    var currentUid;
    var checkOnlineListLength = function() {
        var count = 0;
        for(var el in chatItemList) {
            count++;
        }
        if(count == 0) {
            $node.addClass("noOnline");
        } else {
            $node.removeClass("noOnline");
        }
    };
    var clearSeleted = function() {
        $node.find("li.user-list-item").removeClass("active");
        currentUid = null;
    };
    var setCurrentUid = function(uid) {
        currentUid = uid;
    };

    var onItemHide = function(evt,data) {
        delete chatItemList[data.uid];
    };

    var getCurrentUid = function() {
        return currentUid;
    };

    var onChatItemListLengthChange = function(evt,data) {
        delete chatItemList[data.uid];
        checkOnlineListLength();
    };

    var newUserMessage = function(data) {
        var uid = data.uid;
        if(data.isTransfer === undefined) {
            data.isTransfer = data.chatType;
        }
        if(chatItemList[uid] && chatItemList[uid].getStatus() == 'offline') {
            chatItemList[uid].onOnline(data.cid);
        } else {
            var item = new Item(data,core,node,null,that);
            chatItemList[data.uid] = item;
        }
        checkOnlineListLength();
    };

    var hide = function() {
        $node.hide();
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
                loadFile.load(global.baseUrl + 'views/leftside/chatlist.html').then(function(value) {
                    for(var i = 0,
                        len = ret.userList.length;i < len;i++) {
                        var item = ret.userList[i];
                        item.content = item.lastMsg;
                        normalMessageAdapter(item);
                        if(item.isTransfer === undefined) {
                            item.isTransfer = item.chatType;
                        }
                        if(item.usource == 1) {
                            //微信
                            item.imgUrl = "img/weixinType.png";
                        }
                        if(item.face && item.face.length) {
                            item.source_type = 'face';
                            item.imgUrl = item.face;
                        }
                        item.source_type = USOURCE[item.usource];
                        if(item.face && item.face.length) {
                            item.source_type = 'face';
                        }
                    }
                    var _html = doT.template(value)({
                        'list' : ret.userList,
                        'type' : 'online'
                    });
                    $(node).find(".js-users-list").html(_html);
                    for(var i = 0,
                        len = ret.userList.length;i < len;i++) {
                        var item = ret.userList[i];
                        chatItemList[item.uid] = new Item(item,core,node,null,that);
                    }
                });
            } else {
                var height = $(node).outerHeight();
                $node.addClass("noOnline");
            }
        });
    };

    var onLeftSideSelected = function(evt,data) {
        if(data.data.from == 'online') {
            currentUid = data.data.uid;
        } else {
            clearSeleted();
        }
    };
    var removeBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var uid = $(elm).attr("data-uid");
        if(!chatItemList[uid])
            return;
        currentUid = uid;
        chatItemList[uid].onRemove();

    };

    /**
     * 发送丢用户的错误日志
     */
    var lostUserLog = function(data) {
        $.ajax({
            'url' : '/chat/admin/log.action',
            'type' : "post",
            'data' : {
                'msg' : data.msgId,
                'pid' : global.pid,
                'uid' : global.myid,
                'puid' : global.puid,
                'code' : '02',
                "detail" : "推送消息时，页面没有这个用户"
            }
        });
    };

    var exceptionHandler = function(msg) {
        var cache = {};
        for(var el in msg) {
            cache[el] = msg[el];
        }
        cache.type = 102;
        newUserMessage(cache);
        unreadList.push(msg.uid,msg);
    };
    var onReceive = function(value,list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var data = list[i];
            switch(data.type) {
                case 102:
                    if(!chatItemList[data.uid]) {
                        newUserMessage(data);
                    } else if(chatItemList[data.uid].getStatus() === 'offline') {
                        newUserMessage(data);
                    }
                    break;
                case 108:
                    userOfflineMessage(data);
                    break;
                case 103:
                    if(!chatItemList[data.uid]) {
                        exceptionHandler(data);
                        lostUserLog(data);
                    } else if(!chatItemList[data.uid].getReady()) {
                        unreadList.push(data.uid,data);
                    }
                    break;
            }
        }
    };
    var onRemoveItem = function(cid) {
    };

    var show = function() {
        $node.show();
    };

    var onNotificationClickHandler = function(evt,id) {
        if(id !== currentUid) {
            $node.find('li[data-uid="' + id + '"]').trigger("click");
        }
    };
    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        getDefaultChatList();
        loadFile.load(global.baseUrl + "views/leftside/chatitem.html");
    };
    var userOfflineMessage = function(data) {
        var uid = data.uid;
        if(chatItemList[uid]) {
            chatItemList[uid].onOffLine();
        }
    };
    var bindListener = function() {
        $body.on("core.onload",onloadHandler);
        $body.on("core.receive",onReceive);
        $body.on("notification.click",onNotificationClickHandler);
        $body.on("leftside.onselected",onLeftSideSelected);
        $body.on("leftside.onhide",onItemHide);
        $body.on("leftside.onremove",onChatItemListLengthChange);
        $node.delegate(".js-remove",'click',removeBtnClickHandler);

    };
    var parseDOM = function() {
        $node = $(node);
        $body = $(document.body);
    };

    var onResize = function(height) {
        $node.css({
            'height' : height
        });
    };

    var initPlugins = function() {
    };
    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();
    that.hide = hide;
    that.onResize = onResize;
    that.getCurrentUid = getCurrentUid;
    that.setCurrentUid = setCurrentUid;
    that.show = show;
    that.onRemoveItem = onRemoveItem;
    return that;
};

module.exports = Online;
