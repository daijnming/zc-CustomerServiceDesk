/**
 * @author Treagzhao
 */
function Online(node,core,window) {
    var $node,
        $body;
    var that = {};
    var chatItemList = {};
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

    var setCurrentUid = function(uid) {
        currentUid = uid;
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
            chatItemList[uid].onOnline();
        } else {
            var item = new Item(data,core,node,null,that);
            chatItemList[data.uid] = item;
        }
        checkOnlineListLength();
    };

    var hide = function() {
        $node.hide();
        $node.find("li.user-list-item").removeClass("active");
        currentUid = null;
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
                        item.source_type = USOURCE[item.usource];
                        if(item.face && item.face.length) {
                            item.source_type = 'face';
                        }
                    }
                    var _html = doT.template(value)({
                        'list' : ret.userList
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
        currentUid = data.data.uid;
    };
    var removeBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var uid = $(elm).attr("data-uid");
        if(!chatItemList[uid])
            return;
        var dialog = new Alert({
            'title' : '提示',
            'text' : '请确认顾客的问题已经解答，是否结束对话？',
            'OK' : function() {
                chatItemList[uid].onRemove();
            }
        });
        dialog.show();
    };

    var onReceive = function(value,list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var data = list[i];
            switch(data.type) {
                case 102:
                    newUserMessage(data);
                    break;
                case 108:
                    userOfflineMessage(data);
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
        $body.on("leftside.onremove",onChatItemListLengthChange);
        $node.delegate(".js-remove",'click',removeBtnClickHandler);

    };
    var parseDOM = function() {
        $node = $(node);
        $body = $(document.body);
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
    that.getCurrentUid = getCurrentUid;
    that.setCurrentUid = setCurrentUid;
    that.show = show;
    that.onRemoveItem = onRemoveItem;
    return that;
};

module.exports = Online;
