function Content(node,core,window) {
    var loadFile = require('../util/load.js')();
    var Dialog = require('../util/modal/dialog.js');
    var $rootNode;
    var global;
    // 保存用户对话消息缓存
    var userChatCache = {};
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

            getOtherAdmin : 'admin/getOhterAdminList.action',
            userTransfer : 'admin/transfer.action',
            searchChat : 'admin/internalChat1.action'
        },

        tpl : {
            chatList : 'views/scrollcontent/list.html',
            chatItem : 'views/scrollcontent/item.html',
            chatItemByAdmin : 'views/scrollcontent/itemByAdmin.html',
            adminTable : 'views/scrollcontent/adminTable.html',
            userReadySend : 'views/scrollcontent/userReadySend.html'
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

    var userInfo = {};

    // --------------------------- 接收推送函数 ---------------------------

    $(document.body).on('textarea.send', function(ev) {
        var data = arguments[1];
        // userChatCache[data.uid].list.push({
        //
        // })
        console.log(arguments);
        // 插入客服输入内容
        adminPushMessage(arguments[1]);
        // $(document.body).trigger('textarea.send',[{//通过textarea.send事件将用户的数据传到显示台
        //     'answer':str,
        //     'uid':global.uid,
        //     'cid':global.cid
        // }]);
    });

    $(document.body).on("leftside.onselected", function() {
      console.log(arguments);

      var params = arguments[1];

      userInfo = {
        isStar: !!params.userData.ismark ,
        isBlack: !!params.userData.isblack ,
        isTransfer: !!params.userData.chatType ,
        cid: params.data.cid ,
        uid: global.id,
        sender : global.id,
        userId: params.data.uid
      }

      // 初始化历史记录
      getChatListByOnline('chat', parseTpl, null, null, {
        uid: params.data.uid ,
        pid: params.data.pid
      }, true, true);

      // parseList('chat', userChatCache[params.data.uid]);

      // 初始化用户状态
      initUserState({
          // star : userInfo.isStar ,
          // black : userInfo.isBlack ,
          // transfer: userInfo.isTransfer
          star: !!params.userData.ismark ,
          black: !!params.userData.isblack ,
          transfer: !!params.userData.chatType ,
      });
    });

    // --------------------------- 推送函数 ---------------------------

    // 智能搜索事件
    var onSearchUserChat = function(data) {
        $(document.body).trigger('scrollcontent.onSearchUserChat',[data]);
    }
    // 暴露修改状态事件
    var onUpdateUserState = function(type,handleType) {
        $(document.body).trigger('scrollcontent.onUpdateUserState',[{
            type : type,
            handleType : handleType
        }]);
    }
    // 推送转接事件
    var onTransfer = function(uid,uname) {
        $(document.body).trigger('scrollcontent.onTransfer',[{
            uid : uid,
            userName : uname
        }]);
    }
    // --------------------------- http 请求 ---------------------------

    // 加载
    var getChatListByOnline = function(type,callback, pageNo, pageSize, userData, isRender, isScrollBottom) {
        var userId;
        if( typeof arguments[0] === 'function') {
            callback = arguments[0];
            type = 'chat';
        }


        if ($.isArray(userData)) {
          userId = userData[0].uid;
        } else {
          userId = userData.uid;
        }
        console.log(userId);
        // 假如用户在缓存里
        if (userChatCache[userId]) {
          console.log('加入用户缓存后');
          console.log(userChatCache);

          if (isRender) parseList(type , userChatCache[userId], isScrollBottom);
        } else {
          $.ajax({
              'url' : API.http.chatList[type],
              'dataType' : 'json',
              'type' : 'get',
              'data' : {
                  t : '1462871390676',
                  uid : userId,
                  pid : userData.pid,
                  pageNow : pageNo || 1,
                  pageSize : pageSize || 20
              }
          }).success(function(ret) {
              callback && callback(type,ret, userId, isScrollBottom);
          })
        }
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
    var getAdminList = function(sender,callback) {
        $.ajax({
            'url' : API.http.getOtherAdmin,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                uid : sender
            }
        }).success(function(ret) {
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

        $(dialog.getOuter()).find('.js-transfer-href').on('click', function() {
            var uid = $(this).attr('uid'),
                uname = $(this).attr('uname');

            console.log({
                uid : userInfo.sender,
                cid : userInfo.cid,
                joinUid : uid,
                userId : userInfo.userId,
                userName : uname
            });

            $.ajax({
                'url' : API.http.userTransfer,
                'dataType' : 'json',
                'type' : 'get',
                'data' : {
                    uid : userInfo.sender,
                    cid : userInfo.cid,
                    joinUid : uid,
                    userId : userInfo.userId,
                    userName : uname
                }
            }).success(function(ret) {
                console.log(ret);

                if(ret.status === 1)
                    onTransfer(uid,uname);
            });
        });
    }
    var sendSearchUserChat = function() {
        $rootNode.find('.formUser').on('click', function() {
            var chatText = $(this).val();
            searchUserChat(userInfo.sender,chatText,onSearchUserChat);
        });
    }
    // 智能搜索
    var searchUserChat = function(sender,requestText,callback) {
        $.ajax({
            'url' : API.http.searchChat,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                uid : sender,
                requestText : requestText
            }
        }).success(function(ret) {
            console.log(ret);
            callback && callback(ret);
        });
    }
    // --------------------------- dom操作 ---------------------------

    var parseTpl = function(type,ret, uid, isScrollBottom) {

        console.log(uid);
        // console.log(type, ret);
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

            // console.log(list);

            // console.log('首次加载历史记录到缓存');
            // userChatCache[uid].list = list;
            // console.log('缓存添加新用户')
            userChatCache[uid] = {
              list: list ,
              scrollTop: 0
            }
            // console.log('缓存');
            // console.log(userChatCache)

            _html = doT.template(tpl)({
                list : list
            });

            $rootNode.find('#' + type).find('.js-panel-body').empty().html(_html);
            if (isScrollBottom) $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
        });
    }

    var parseList = function(type, data, isScrollBottom) {
        loadFile.load(global.baseUrl + API.tpl.chatList).then(function(tpl) {

            var _html;

            _html = doT.template(tpl)({
                list : data.list
            });

            $rootNode.find('#' + type).find('.js-panel-body').html(_html);
            if (isScrollBottom) $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
        });
    }

    var updateHeaderTag = function(type,handleType) {
        $rootNode.find('.js-addButton').children('[data-type="' + type + '"]').removeClass('hide');
        $rootNode.find('.js-addButton').children('.js-' + type + '-' + handleType).addClass('hide');
        onUpdateUserState(type,handleType);
    }
    var initUserState = function(data) {
        $rootNode.find('.js-addButton').children('a').addClass('hide');

        for(var k in data) {

            if(k === 'transfer') {

                if(data[k])
                    $rootNode.find('.js-addButton').children('.js-transfer').removeClass('hide');
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

        111 : function(data) {

        }
    }

    // 显示其他在线客服列表
    var showAdminList = function(data) {

    }
    // --------------------------- socket ---------------------------

    // 加入到某一个user的chche内
    var userPushMessage = function(data) {
        parseChat[data.type] && parseChat[data.type](data);

        if (data[0].type === 111) {
          console.log(data);
          console.log(' 用户' + data.uname +'正在:' + data.description + ' :' + data.content);

          loadFile.load(global.baseUrl + API.tpl.userReadySend).then(function(tpl) {
              var _html;
              _html = doT.template(tpl)({
                  data : data[0]
              });
              $rootNode.find('#chat').find('.js-user-ready-input').empty().append(_html);
          });
        } else {


          if (userChatCache[data[0].uid]) {
            // console.log('用户发送消息 ');
            // console.log(data)
            // console.log('准备加入用户缓存');
            for (var i = 0;i < data.length;i++) {
              // userChatCache[data[0].uid].list.push(data[i]);

              console.log(data[i].type);
              // 聊天
              if (data[i].type === 103) {
                userChatCache[data[0].uid].list.push({
                  action: 5 ,
                  senderType: 0 ,
                  senderName: data[i].uname ,
                  msg: data[i].content ,
                  ts: data[i].ts
                })
              }


            }

            console.log('userInfo.userId => ' + userInfo.userId);
            console.log('data[0].uid => ' + data[0].uid);
            var isRender = userInfo.userId === data[0].uid;
            // 是否渲染 isRender
            getChatListByOnline('chat', parseList , null, null, data, isRender);
          }

          // 用户发送消息
          // loadFile.load(global.baseUrl + API.tpl.chatItem).then(function(tpl) {
          //     var _html;
          //     _html = doT.template(tpl)({
          //         list : data
          //     });
          //     // userChatCache.push
          //     $rootNode.find('#chat').find('.js-panel-body').append(_html);
          // });
        }
    };

    var adminPushMessage = function(data) {

      if (userChatCache[data.uid]) {
        userChatCache[data.uid].list.push({
          action: 5 ,
          senderType: 2 ,
          senderName: global.name ,
          msg: data.answer ,
          ts: 'date ' + new Date().toTimeString().split(' ')[0]
        });
        // for (var i = 0;i < data.length;i++) {
        //   // userChatCache[data[0].uid].list.push(data[i]);
        //
        //   console.log(data[i].type);
        //   // 聊天
        //   if (data[i].type === 103) {
        //     userChatCache[data[0].uid].list.push({
        //       action: 5 ,
        //       senderType: 0 ,
        //       senderName: data[i].uname ,
        //       msg: data[i].content ,
        //       ts: data[i].ts
        //     })
        //   }
        //
        //
        // }
        console.log('userInfo.userId => ' + userInfo.userId);
        console.log('data.uid => ' + data.uid);
        var isRender = userInfo.userId === data.uid;
        getChatListByOnline('chat', parseList , null, null, data, isRender);
      }
    }
    // --------------------------- base ---------------------------

    var parseDOM = function() {
        $rootNode = $(node);
    };

    var onReceive = function(value,data) {
        console.log(data);

        // if (data[0].type === 102) {
        //
        // }

        userPushMessage(data);
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
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
            var $self = $(this),
                type = $self.attr('data-type'),
                handleType = $self.attr('data-handle');

            if(!!!type && !!!handleType) {
                getAdminList(userInfo.sender,transfer);
            } else {
                updateUserState(type,handleType,updateHeaderTag);
            }
        })
        // 滚动加载分页
        $rootNode.find('#chat').find('.scrollBoxParent').scroll(function(e) {

            if($(this).scrollTop() === 0)
                getChatListByOnline('chat',parseTpl);
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
