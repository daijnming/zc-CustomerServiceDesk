/**
 *
 * @author Treagzhao
 */

function Item(data,core,outer) {
    var node,
        $node,
        $unRead,
        $lastMessage;
    var global = core.getGlobal();
    var $body;
    var baseUrl = global.baseUrl;
    var $ulOuter;
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

    var onReceive = function(value) {
    };
    var onOffLine = function() {
        $node.find(".js-icon").addClass("offline");
        var $statusText = $node.find(".js-status");
        $statusText.css({
            'display' : 'inline-block'
        }).html('[离线]');
        shake($statusText);
    };
    var onRemove = function() {
        $.ajax({
            'url' : '/chat/admin/leave.action',
            'data' : {
                'cid' : data.cid,
                'uid' : global.id,
                'userid' : data.uid
            },
            'type' : 'post',
            'dataType' : "json"
        }).success(function(ret) {
            if(ret.status === 1) {
                $node.animate({
                    'height' : 0
                },300, function() {
                    $node.remove();
                });
            }
        });
    };

    var initNode = function() {
        var promise = new Promise();
        var elm = $(outer).find('li[data-cid="' + data.cid + '"]');
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
                if(!$ulOuter) {
                    $ulOuter = $(outer).find("ul.js-users-list");
                }
                var children = $ulOuter.children();
                if(children.length == 0) {
                    $ulOuter.append($node);
                } else {
                    var elm = children[0];
                    $node.insertBefore(elm);
                }
                promise.resolve();
            });
        }
        return promise;
    };

    var clearUnread = function() {
        unReadCount = 0;
        $unRead.html('').css({
            'visibility' : 'hidden'
        });
    };
    var bindListener = function() {
        $body.on("core.receive", function(evt,list) {
            for(var i = 0,
                len = list.length;i < len;i++) {
                var msg = list[i];
                if(msg.cid !== data.cid) {
                    return;
                }
                unReadCount++;
            }
            var lastMessage = list.length > 0 ? list[list.length - 1] : null;
            $unRead.html(unReadCount).css({
                'visibility' : 'visible'
            });
            $lastMessage.html(!!lastMessage ? lastMessage.desc : '').addClass('orange');
        });
        $node.on("click", function() {
            clearUnread();
            $node.addClass("active").siblings().removeClass("active");
            $(document.body).trigger("leftside.onselected",[data]);
        });
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

    this.onRemove = onRemove;
    this.onOffLine = onOffLine;
};

module.exports = Item;