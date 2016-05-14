/**
 *
 * @author Treagzhao
 */

function Item(data,core,outer,from) {
    var node,
        $node,
        $unRead,
        $lastMessage;
    var from = from || 'online';
    var global = core.getGlobal();
    var $body;
    var userDataCache = {};
    var baseUrl = global.baseUrl;
    var $ulOuter;
    var status = (from == 'history') ? 'offline' : 'online';
    var unReadCount = 0;
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var USOURCE = ['laptop','','','','mobile'];
    this.token = +new Date();

    var shake = function($elm) {
        var time = 10;
        for(var i = 0;i < 2;i++) {
            $elm.animate({
                'left' : 10
            });
        }
    };

    var onReceive = function(evt,list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var msg = list[i];
            if((msg.cid !== data.cid ) || msg.type != 103) {
                continue;
            }
            unReadCount++;
            var lastMessage = list.length > 0 ? list[list.length - 1] : null;
            if(unReadCount > 0) {
                $unRead.html(unReadCount).css({
                    'visibility' : 'visible'
                });
            } else {
                $unRead.css({
                    'visibility' : 'hidden'
                });
            }
            $lastMessage.html(!!lastMessage ? lastMessage.desc : '').addClass('orange');
        }
    };
    var onOffLine = function() {
        $node.find(".js-icon").addClass("offline");
        var $statusText = $node.find(".js-status");
        $statusText.css({
            'display' : 'inline-block'
        }).html('[离线]');
        status = 'offline';
    };
    var onRemove = function() {
        $.ajax({
            'url' : '/chat/admin/leave.action',
            'data' : {
                'cid' : data.cid,
                'uid' : global.id,
                'userId' : data.uid
            },
            'type' : 'post',
            'dataType' : "json"
        }).success(function(ret) {
            if(ret.status === 1) {
                $body.trigger("leftside.onremove",[{
                    'cid' : data.cid,
                    'uid' : data.uid
                }]);
                $node.animate({
                    'height' : 0
                },300, function() {
                    $node.remove();
                });
            }
        });
    };

    var insert = function(node) {
        if(!$ulOuter) {
            $ulOuter = $(outer).find("ul.js-users-list");
        }
        var children = $ulOuter.children();
        if(children.length == 0) {
            $ulOuter.append(node);
        } else {
            var elm = children[0];
            node.insertBefore(elm);
        }
    };

    var onOnline = function() {
        status = 'online';
        var $statusText = $node.find(".js-status");
        $node.find(".js-icon").removeClass("offline");
        $statusText.css({
            'display' : 'none'
        }).html('[离线]');
        insert($node);
    };

    var initNode = function() {
        var promise = new Promise();
        var elm = $(outer).find('li[data-uid="' + data.uid + '"]');
        if(elm.length > 0) {
            node = elm[0];
            $node = $(node);
            setTimeout(function() {
                promise.resolve();
            },0);
        } else {
            loadFile.load(global.baseUrl + "views/leftside/chatitem.html").then(function(value) {
                data['source_type'] = USOURCE[data.usource];
                var _html = doT.template(value)(data);
                $node = $(_html);
                insert($node);
                promise.resolve();
            });
        }
        return promise;
    };

    var getStatus = function() {
        return status;
    };

    var clearUnread = function() {
        unReadCount = 0;
        $unRead.html('').css({
            'visibility' : 'hidden'
        });
    };

    var onNodeClickHandler = function() {
        clearUnread();
        $node.addClass("active").siblings().removeClass("active");
        data.from = from;
        data.status = status;
        Promise.when(function() {
            var promise = new Promise();
            var uid = data.uid;
            if(userDataCache[uid]) {
                setTimeout(function() {
                    promise.resolve(userDataCache[uid]);
                },0);
            } else {
                $.ajax({
                    'url' : '/chat/admin/get_userinfo.action',
                    'dataType' : "json",
                    'data' : {
                        'sender' : global.id,
                        'uid' : data.uid
                    }
                }).success(function(ret) {
                    if(ret.retcode == 0) {
                        userDataCache[uid] = ret.data;
                        promise.resolve(ret.data);
                    }
                });
            }
            return promise;
        }).then(function(userData) {
            $(document.body).trigger("leftside.onselected",[{
                'data' : data,
                'userData' : userData
            }]);
        });

    };

    var onBlackListChange = function(evt,data) {
	console.log(data);
    	if(data.type == "black" && data.handleType == 'add'){
		onRemove();
	}
    };

    var onTransfer = function(evt,data) {
        var uid = data.uid;
        if(true) {
            alert();
            onRemove();
        }
    };
    var bindListener = function() {
        $body.on("scrollcontent.onUpdateUserState",onBlackListChange);
        $body.on("scrollcontent.onTransfer",onTransfer);
        $body.on("core.receive",onReceive);
        $node.on("click",onNodeClickHandler);

    };
    var parseDOM = function() {
        $body = $(document.body);
        $unRead = $node.find(".js-unread-count");
        $ulOuter = $(outer).find("ul.js-users-list");
        $lastMessage = $node.find(".js-last-message");

    };
    var init = function() {
        parseDOM();
        bindListener();
    };
    initNode().then(function() {
        init();
    });

    this.onOnline = onOnline;
    this.getStatus = getStatus;
    this.onRemove = onRemove;
    this.onOffLine = onOffLine;
}

module.exports = Item;
