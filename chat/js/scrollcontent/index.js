function Content(node,core,window) {
    var loadFile = require('../util/load.js')();
    var $rootNode;
    var global;
    // 保存用户对话消息缓存
    var chatCache = {};
    var API = {
        http : {
            chatList : {
                'chat' : 'admin/get_chatdetail.action',
                'hchat' : 'admin/get_chatdetail.action'
            },

            status : {
                black : {
                    add : 'admin/add_blacklist.action',
                    del : 'admin/delete_blacklist.action'
                },

                star : {
                    add : 'admin/add_marklist.action',
                    del : 'admin/delete_marklist.action'
                }
            },

            addTransfer : ''
        },

        tpl : {
            chatList : 'views/scrollcontent/list.html',
            chatItem : 'views/scrollcontent/item.html',
            chatItemByAdmin : 'views/scrollcontent/itemByAdmin.html'
        }
    };

    var userSourceMap = {
        0 : 'http://img.sobot.com/chatres/common/face/pcType.png',
        1 : 'http://img.sobot.com/chatres/common/face/weixinType.png',
        2 : 'http://img.sobot.com/chatres/common/face/appType.png',
        3 : 'http://img.sobot.com/chatres/common/face/weiboType.png',
        4 : 'http://img.sobot.com/chatres/common/face/moType.png',
        5 : 'http://img.sobot.com/chatres/common/face/moType.png'
    }

    var userInfo = {
        uid : '088ad376b6514ed0a191067308c284fe000025',
        pid : '088ad376b6514ed0a191067308c284fe',
        sender : 'mTLX96VS13KSmF6VqxK9KBtavHt7fYVcV6Ekx3YuXvcoNskGFZk2xQ==',
        isStar : true,
        isBlack : true
    }

    // --------------------------- http 请求 ---------------------------

    // 加载
    var getChatListByOnline = function(type,callback, pageNo, pageSize) {

        if( typeof arguments[0] === 'function') {
            callback = arguments[0];
            type = 'chat';
        }

        $.ajax({
            'url' : API.http.chatList[type],
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                t : '1462871390676',
                uid : userInfo.uid,
                pid : userInfo.pid,
                pageNow : pageNo || 1,
                pageSize : pageSize || 20
            }
        }).success(function(ret) {
            callback && callback(type,ret);
        })
    };

    // 改变用户状态
    var updateUserState = function(type,handleType,callback) {
        $.ajax({
            'url' : API.http.status[type][handleType],
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                sender : userInfo.sender,
                receiver : userInfo.uid
            }
        }).success(function(ret) {
            console.log(ret);
            callback && callback(type,handleType);
        });
    }

    // 转接
    var onTransfer = function() {

    }

    // 智能搜索
    // --------------------------- dom操作 ---------------------------

    var parseTpl = function(type,ret) {
        loadFile.load(global.baseUrl + API.tpl.chatList).then(function(tpl) {

            var list = [],
                _html;

            ret.data.map(function(item) {
                list.push({
                    action : 'dateline',
                    date : item.date
                });

                item.content.map(function(obj) {
                    // obj.userHeadImage = userSourceMap[obj.source];
                    list.push(obj);
                });
            });

            _html = doT.template(tpl)({
                list : list
            });

            $rootNode.find('#' + type).find('.js-panel-body').html(_html);
        });
    }
    var updateHeaderTag = function(type,handleType) {
        $rootNode.find('.js-addButton').children('[data-type="' + type + '"]').removeClass('hide');
        $rootNode.find('.js-addButton').children('.js-' + type + '-' + handleType).addClass('hide');
    }
    var initUserState = function(data) {
        $rootNode.find('.js-addButton').children('a').addClass('hide');

        for(var k in data)
        $rootNode.find('.js-addButton').children('.js-' + k + '-' + (data[k] ? 'del' : 'add')).removeClass('hide');
    }
    var parseChat = {
        102 : function(data) {
            data.userHeadImage = userSourceMap[data.source];
            data.t = new Date(data.t).toLocaleString().split(' ')[1];
        },

        103 : function(data) {
            data.userHeadImage = userSourceMap[data.source];
            data.ts = data.ts.split(' ')[1];
        },

        108 : function(data) {
            data.t = new Date(data.t).toLocaleString().split(' ')[1];
        }
    }

    // --------------------------- socket ---------------------------

    var userPushMessage = function(data) {
        parseChat[data.type] && parseChat[data.type](data);
        // 用户发送消息
        loadFile.load(global.baseUrl + API.tpl.chatItem).then(function(tpl) {
            var _html;
            _html = doT.template(tpl)({
                data : data
            });

            $rootNode.find('#chat').find('.js-panel-body').append(_html);
        });
    };

    var adminPushMessage = function(data) {

        // 客服发送消息
        loadFile.load(global.baseUrl + API.tpl.chatItem).then(function(tpl) {
            var _html;
            _html = doT.template(tpl)({
                data : data
            });

            $rootNode.find('#chat').find('.js-panel-body').append(_html);
        });
    }
    // --------------------------- base ---------------------------

    var parseDOM = function() {
        $rootNode = $(node);
    };

    var onReceive = function(value,data) {
        userPushMessage(data[0]);
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();

        // 初始化历史记录
        getChatListByOnline('chat', parseTpl);

        // 初始化用户状态
        initUserState({
            star : userInfo.isStar,
            black : userInfo.isBlack ,
        });
    };

    var bindLitener = function() {
        $(document.body).on('core.onload',onloadHandler);
        $(document.body).on('core.receive',onReceive);

        $(document.body).on('scrollcontent.updateUserState', updateUserState);
        $(document.body).on('scrollcontent.transfer', onTransfer);
        //$(document.body).on('scrollcontent.searchUserChat', searchUserChat);

        // 拉黑/星标
        $rootNode.find('.js-addButton').on('click','.js-goOut', function(event) {
            var $self = $(this) ,
                type = $self.attr('data-type') ,
                handleType = $self.attr('data-handle') ;
            updateUserState(type,handleType,updateHeaderTag);
        })

        // 滚动加载分页
        $rootNode.find('#chat').find('.scrollBoxParent').scroll(function(e){

            if ($(this).scrollTop() === 0) getChatListByOnline('chat', parseTpl);
        });
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

module.exports = Content;
