/**
 * @author Treagzhao
 */
function Online(node,core,window) {
    var $node;
    var that = {};
    var chatItemList = {};
    var global;
    var USOURCE = ['laptop','','','','mobile'];
    var Item = require('./chatItem.js');
    var Alert = require('../util/modal/alert.js');
    var loadFile = require('../util/load.js')();
    var newUserMessage = function(data) {
        var uid = data.uid;
        console.log(chatItemList[uid]);
        var item = new Item(data,core,node);
        chatItemList[data.uid] = item;
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
                        item.source_type = USOURCE[item.usource];
                    }
                    var _html = doT.template(value)({
                        'list' : ret.userList
                    });
                    $(node).find(".js-users-list").html(_html);
                    for(var i = 0,
                        len = ret.userList.length;i < len;i++) {
                        var item = ret.userList[i];
                        chatItemList[item.uid] = new Item(item,core,node);
                    }
                });
            } else {
                var height = $(node).outerHeight();
                $(node).find(".js-chatonline").addClass("noOnline");
            }
        });
    };

    var removeBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var uid = $(elm).attr("data-uid");
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
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $node.delegate(".js-remove",'click',removeBtnClickHandler);
    };
    var parseDOM = function() {
        $node = $(node);
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
    return that;
};

module.exports = Online;
