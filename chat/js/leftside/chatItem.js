/**
 *
 * @author Treagzhao
 */

function Item(data,core,outer,from,manager) {
    var from = from || 'online';
    var node,
        $node,
        $unRead,
        $lastMessage,
        $userName;
    var TYPE_EMOTION = 0,
        TYPE_IMAGE = 1,
        TYPE_TEXT = 2,
        AUDIO = 3,
        RICH_TEXT = 4;
    var isReady = false;
    var unReadList = require('./unreadlist.js');
    var from = from || 'online';
    var global = core.getGlobal();
    var $body,
        $imageFace;
    var messageAdapter = require('../util/normatMessageAdapter.js');
    var userDataCache = {};
    var baseUrl = global.baseUrl;
    var $ulOuter;
    var status = (from == 'history' || from == 'blacklist' || from == 'star') ? 'offline' : 'online';
    var unReadCount = 0;
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var Alert = require('../util/modal/alert.js');
    var USOURCE = require('./source.json');
    this.token = +new Date();

    var shake = function($elm) {
        var time = 10;
        for(var i = 0;i < 2;i++) {
            $elm.animate({
                'left' : 10
            });
        }
    };

    var showLastMessage = function(lastMessage) {
        if(lastMessage && lastMessage.cid == data.cid) {
            if(lastMessage.message_type == TYPE_EMOTION) {
                $lastMessage.html(lastMessage.desc).addClass("orange");
            } else {
                var str = (lastMessage.desc);
                var temp = $('<div></div>');
                temp.html(str);
                str = temp.html();
                $lastMessage.text(str).addClass("orange");
            }
        }
    };
    var onReceive = function(evt,list) {
        var arr = [];
        for(var i = 0;i < list.length;i++) {
            if(list[i].type == 103)
                arr.push(list[i]);
        }
        var lastMessage = arr.length > 0 ? arr[arr.length - 1] : null;
        if(data.uid !== manager.getCurrentUid()) {
            for(var i = 0,
                len = list.length;i < len;i++) {
                var msg = list[i];
                if((msg.cid !== data.cid ) || msg.type != 103) {
                    continue;
                }
                unReadCount++;
            }
            var unReadText = (unReadCount > 99) ? "99+" : unReadCount;
            if(unReadCount > 0) {
                $unRead.html(unReadText).css({
                    'visibility' : 'visible'
                });
            } else {
                $unRead.css({
                    'visibility' : 'hidden'
                });
            }
        }

        showLastMessage(lastMessage);
    };
    var onOffLine = function() {
        var $parent = $node.parent();
        var offlineList = $parent.find("li.offline");
        var firstOffline = offlineList.length > 0 ? offlineList[0] : null;
        $node.find(".js-icon").addClass("offline");
        $node.addClass("offline");
        var $statusText = $node.find(".js-user-status");
        $statusText.css({
            'display' : 'inline-block'
        }).html('[离线]');
        status = 'offline';
        if(firstOffline) {
            $node.insertBefore(firstOffline);
        } else {
            $node.parent().append($node);
        }

    };

    var hide = function() {
        $body.trigger("leftside.onhide",[{
            'cid' : data.cid,
            'uid' : data.uid
        }]);
        $node.animate({
            'height' : 0
        },300, function() {
            $node.remove();
        });
        if(manager.getCurrentUid() == data.uid) {
            manager.setCurrentUid(null);
        }
    };

    var onRemove = function() {
        if(status == 'online') {
            var dialog = new Alert({
                'title' : '结束对话',
                'text' : '请确认顾客的问题已经解答，是否结束对话？',
                'OK' : function() {
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
                        if(manager.getCurrentUid() == data.uid) {
                            manager.setCurrentUid(null);
                        }
                        $body.trigger("leftside.onremove",[{
                            'cid' : data.cid,
                            'uid' : data.uid
                        }]);
                        if(ret.status === 1) {
                            hide();
                        }
                    });
                }
            });
            dialog.show();

        } else {
            hide();
        }
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

    var onOnline = function(cid) {
        status = 'online';
        data.cid = cid;
        $body.trigger("leftside.cidchange", {
            'cid' : data.cid,
            "uid" : data.uid
        });
        var $statusText = $node.find(".js-user-status");
        $node.find(".js-icon").removeClass("offline");
        $node.removeClass("offline");
        $statusText.css({
            'display' : 'none'
        });
        if(data.isTransfer == 1) {
            $statusText.html('[转接]');
        } else {
            $statusText.html('');
        }
        if($node.index() !== 0) {
            insert($node);
        }
        if(manager.getCurrentUid() == data.uid) {
            $body.trigger("leftside.oncidchange",[data.cid]);
        }
    };

    var initFace = function() {
        var url = data.face;
        var img = new Image();
        img.onload = function() {
            $imageFace.attr("src",url).css({
                'display' : 'inline-block'
            });
        };
        img.src = url;
    };

    var getCacheList = function(value,promise) {
        var list = unReadList.getList(data.uid);
        if(!list) {
            return;
        }
        var arr = [];
        for(var i = 0;i < list.length;i++) {
            if(list[i].type == 103) {
                arr.push(list[i]);
            }
        }
        var lastMessage = arr.length > 0 ? arr[arr.length - 1] : null;
        showLastMessage(lastMessage);
        $unRead.html(arr.length).css({
            'visibility' : 'visible'
        });
    };

    var initNode = function() {
        var promise = new Promise();
        console.log(data.cid,data.uid);
        var elm = $(outer).find('li[data-uid="' + data.uid + '"]');
        if(elm.length > 0) {
            node = elm[0];
            $node = $(node);
            $userName = $node.find(".js-user-name");
            if(!$imageFace) {
                $imageFace = $node.find(".js-image-face");
            }
            initFace();
            setTimeout(function() {
                isReady = true;
                promise.resolve();
            },0);
        } else {
            loadFile.load(global.baseUrl + "views/leftside/chatitem.html").then(function(value) {
                data['source_type'] = USOURCE[data.usource];
                if(data.usource == 1) {
                    data.imgUrl = "img/weixinType.png";
                }
                if(data.face && data.face.length) {
                    data.source_type = 'face';
                    data.imgUrl = data.face;
                }
                var _html = doT.template(value)(data);
                $node = $(_html);
                if(!$imageFace) {
                    $imageFace = $node.find(".js-image-face");
                }
                initFace();
                insert($node);
                $userName = $node.find(".js-user-name");
                isReady = true;
                promise.resolve();
            });
        }
        return promise;
    };

    var getReady = function() {
        return isReady;
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
    var getUserData = function() {
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
    };

    var onNodeClickHandler = function(e) {
        var $target = $(e.target);
        if($target.hasClass("js-remove")) {
            return;
        }
        //记录未读数，聊天列表需要显示
        var unreadTemp = unReadCount;
        clearUnread();
        $node.addClass("active").siblings().removeClass("active");
        data.from = from;
        data.status = status;
        Promise.when(getUserData).then(function(userData) {
            if(data.uid === manager.getCurrentUid())
                return;
            $(document.body).trigger("leftside.onselected",[{
                'data' : data,
                'userData' : userData,
                'unreadcount' : unreadTemp,
                'status' : status
            }]);
        });

    };

    var onclick = function() {
        $node.trigger('click');
    };
    var onProfileUserInfo = function(evt,ret) {
        if(ret.data.uid == data.uid && ret.data.name) {
            var name = ret.data.name;
            $userName.html(name);
            delete userDataCache[data.uid];
        }
    };

    var onUserStatusChange = function(evt,ret) {
        delete userDataCache[data.uid];
        if(from == 'online' && ret.type == "black" && ret.handleType == 'add' && ret.userId === data.uid) {
            hide();
        }
        if(ret.type == 'black' && ret.handleType == 'del' && ret.userId === data.uid && from === 'blacklist') {
            hide();
        }
        if(ret.type == "star" && from == 'star' && ret.handleType == 'del' && ret.userId === data.uid) {
            hide();
        }
        if(ret.type == 'star') {
            getUserData();
        }
    };

    var onServerSend = function(evt,ret) {
        if(ret.uid == data.uid) {
            messageAdapter(ret);
            if(ret.message_type == TYPE_EMOTION) {
                $lastMessage.html(ret.desc).removeClass("orange");
            } else {
                $lastMessage.text(ret.desc).removeClass("orange");
            }
        }
    };

    var onChatSmartReplay = function(evt,ret) {
        if(ret.data.status == 1 && ret.data.cid == data.cid) {
            var content = ret.data.msg.indexOf("<") >= 0 ? "[富文本]" : ret.data.msg;
            $lastMessage.text(content);
        }
    };
    var onTransfer = function(evt,ret) {
        if(ret.uid != data.uid) {
            return;
        }
        manager.setCurrentUid(undefined);
        if(true) {
            hide();
        }
    };
    var bindListener = function() {
        $body.on("scrollcontent.onUpdateUserState",onUserStatusChange);
        $body.on("scrollcontent.onTransfer",onTransfer);

        $body.on("rightside.onChatSmartReply",onChatSmartReplay);
        $body.on("textarea.send",onServerSend);
        $node.on("click",onNodeClickHandler);
        $body.on("rightside.onProfileUserInfo",onProfileUserInfo);

    };
    var parseDOM = function() {
        $unRead = $node.find(".js-unread-count");
        $ulOuter = $(outer).find("ul.js-users-list");
        $lastMessage = $node.find(".js-last-message");
    };

    var initPlugins = function() {

    };

    var bindStaticListener = function() {
        $body = $(document.body);
        $body.on("core.receive", function(evt,list) {
            setTimeout(function() {
                onReceive(evt,list);
            },1);
        });
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };
    initNode().then(function(value,promise) {
        init();
        setTimeout(promise.resolve,0);
        return promise;
    }).then(getCacheList);
    bindStaticListener();

    this.onOnline = onOnline;
    this.getStatus = getStatus;
    this.onclick = onclick;
    this.onRemove = onRemove;
    this.getReady = getReady;
    this.onOffLine = onOffLine;
}

module.exports = Item;
