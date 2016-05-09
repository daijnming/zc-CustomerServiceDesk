function LeftSide(node,core,window) {
    var template = require('./template.js');
    var loadFile = require('../util/load.js')();
    var Item = require('./chatItem.js');
    var $node;
    var Alert = require('../util/modal/alert.js');
    var global;
    var USOURCE = ['laptop','','','','mobile'];
    var chatItemList = {};
    var parseDOM = function() {
        $node = $(node);
    };

    var newUserMessage = function(data) {
        var item = new Item(data,core,node);
        chatItemList[data.cid] = item;
    };

    var userOfflineMessage = function(data) {
        var cid = data.cid;
        if(chatItemList[cid]) {
            chatItemList[cid].onOffLine();
        }
    };
    var onReceive = function(value,data) {
        switch(data.type) {
            case 102:
                newUserMessage(data);
                break;
            case 108:
                userOfflineMessage(data);
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
                        chatItemList[item.cid] = new Item(item,core,node);
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
        var cid = $(elm).attr("data-cid");
        var dialog = new Alert({
            'title' : '提示',
            'text' : '请确认顾客的问题已经解答，是否结束对话？',
            'OK' : function() {
                chatItemList[cid].onRemove();
            }
        });
        dialog.show();
    };
    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        $(node).find("img.js-my-logo").attr("src",data.face);
        $(node).find(".js-customer-service").html(data.name);
        getDefaultChatList();
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $node.delegate(".js-remove",'click',removeBtnClickHandler);
    };

    var initPlugsin = function() {

    };

    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };

    init();

};

module.exports = LeftSide;
