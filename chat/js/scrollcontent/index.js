function Content(node,core,window) {
    var loadFile = require('../util/load.js')();
    var Dialog = require('../util/modal/dialog.js');
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

            getOtherAdmin: 'admin/getOhterAdminList.action' ,
            userTransfer : 'admin/transfer.action' ,
            searchChat: 'admin/internalChat1.action'
        },

        tpl : {
            chatList : 'views/scrollcontent/list.html',
            chatItem : 'views/scrollcontent/item.html',
            chatItemByAdmin : 'views/scrollcontent/itemByAdmin.html',
            adminTable: 'views/scrollcontent/adminTable.html' ,
            userReadySend: 'views/scrollcontent/userReadySend.html'
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
        userId: 'fdf2f6e709f7457aae9b9bd5afcb1f57' ,
        cid: '2c24f755180b48408f658520c116d101',
        isStar : true,
        isBlack : true,
        isTransfer: true
    }

    // --------------------------- 推送函数 ---------------------------

    // 智能搜索事件
    var onSearchUserChat = function(data) {
      $(document.body).trigger('scrollcontent.onSearchUserChat', [data]);
    }

    // 暴露修改状态事件
    var onUpdateUserState = function(type, handleType) {
      $(document.body).trigger('scrollcontent.onUpdateUserState', [{
        type: type ,
        handleType: handleType
      }]);
    }

    // 推送转接事件
    var onTransfer = function(uid, uname) {
      $(document.body).trigger('scrollcontent.onTransfer', [{
        uid: uid ,
        userName: uname
      }]);
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

    var getAdminList = function(sender, callback) {
        $.ajax({
            'url' : API.http.getOtherAdmin,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                uid: sender
            }
        })
        .success(function(ret) {
            var dialog = new Dialog({
                'title' : '转接给新的客服',
                'footer' : false
            });

            // ret = [{"maxcount":2,"id":"d2d94e70e0884a47a734f6860b541e79","face":"http://img.sobot.com/console/common/face/admin.png","groupId":["61da00ab8aae43b6932ef83635b0912f"],"groupName":["100"],"count":0,"status":1,"uname":"10041n"}];

            dialog.show();

            loadFile.load(global.baseUrl + API.tpl.adminTable).then(function(tpl) {

                var _html;

                _html = doT.template(tpl)({
                    list : ret
                });

                dialog.setInner(_html);
                callback && callback(dialog);
            });
        });
    }

    // 转接
    var transfer = function(dialog) {

      $(dialog.getOuter()).find('.js-transfer-href').on('click', function(){
        var uid = $(this).attr('uid') ,
            uname = $(this).attr('uname');

        console.log({
            uid: userInfo.sender ,
            cid: userInfo.cid,
            joinUid: uid ,
            userId: userInfo.userId ,
            userName: uname
        });

        $.ajax({
            'url' : API.http.userTransfer,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                uid: userInfo.sender ,
                cid: userInfo.cid,
                joinUid: uid ,
                userId: userInfo.userId ,
                userName: uname
            }
        }).success(function(ret) {
            console.log(ret);

            if (ret.status === 1) onTransfer(uid, uname);
        });
      });
    }

    var sendSearchUserChat = function() {
      $rootNode.find('.formUser').on('click', function(){
        var chatText = $(this).val();
        searchUserChat(userInfo.sender, chatText, onSearchUserChat);
      });
    }

    // 智能搜索
    var searchUserChat = function(sender, requestText, callback) {
        $.ajax({
            'url' : API.http.searchChat,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                uid: sender ,
                requestText: requestText
            }
        }).success(function(ret) {
            console.log(ret);
            callback && callback(ret);
        });
    }
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

        onUpdateUserState(type, handleType);
    }

    var initUserState = function(data) {
        $rootNode.find('.js-addButton').children('a').addClass('hide');

        for (var k in data) {

          if (k === 'transfer') {

            if (data[k]) $rootNode.find('.js-addButton').children('.js-transfer').removeClass('hide');
          } else {
            $rootNode.find('.js-addButton').children('.js-' + k + '-' + (data[k] ? 'del' : 'add')).removeClass('hide');
          }
        }
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
        },

        111: function(data) {

        }
    }

    // 显示其他在线客服列表
    var showAdminList = function(data) {

    }

    // --------------------------- socket ---------------------------

    var userPushMessage = function(data) {
        parseChat[data.type] && parseChat[data.type](data);

        if (data.type === 111) {
          console.log(data);
          console.log(' 用户' + data.uname +'正在:' + data.description + ' :' + data.content);

          loadFile.load(global.baseUrl + API.tpl.userReadySend).then(function(tpl) {
              var _html;
              _html = doT.template(tpl)({
                  data : data
              });

              $rootNode.find('#chat').find('.js-user-ready-input').empty().append(_html);
          });
        } else {
          // 用户发送消息
          loadFile.load(global.baseUrl + API.tpl.chatItem).then(function(tpl) {
              var _html;
              _html = doT.template(tpl)({
                  data : data
              });

              $rootNode.find('#chat').find('.js-panel-body').append(_html);
          });
        }
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
            star : userInfo.isStar ,
            black : userInfo.isBlack ,
            transfer: userInfo.isTransfer
        });
    };

    var bindLitener = function() {
        $(document.body).on('core.onload',onloadHandler);
        $(document.body).on('core.receive',onReceive);

        // $(document.body).on('scrollcontent.updateUserState', updateUserState);
        // $(document.body).on('scrollcontent.transfer', onTransfer);
        // $(document.body).on('scrollcontent.searchUserChat', searchUserChat);

        // $(document.body).tr

        // 拉黑/星标
        $rootNode.find('.js-addButton').on('click','.js-goOut', function(event) {
            var $self = $(this) ,
                type = $self.attr('data-type') ,
                handleType = $self.attr('data-handle') ;

            if (!!!type && !!!handleType) {
              getAdminList(userInfo.sender, transfer);
            } else {
              updateUserState(type,handleType,updateHeaderTag);
            }
        })

        // 滚动加载分页
        $rootNode.find('#chat').find('.scrollBoxParent').scroll(function(e){

            if ($(this).scrollTop() === 0) getChatListByOnline('chat', parseTpl);
        });

        // // 请求其他在线客服列表
        // $rootNode.find('.js-transfer').on('click', function() {
        //     getAdminList(userInfo.sender, onTransfer);
        // });
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
