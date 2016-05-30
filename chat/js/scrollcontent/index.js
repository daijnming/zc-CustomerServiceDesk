 function Content(node,core,window) {
    var loadFile = require('../util/load.js')();
    var Dialog = require('../util/modal/dialog.js');
    var Alert = require('../util/modal/alert.js');
    var Face = require('../util/qqFace.js');
    var App = require('../util/app.js');
    var $rootNode;
    var global;
    // 保存用户对话消息缓存
    var userChatCache = {};
    var hasCallState = false;
    var imageUrl = 'http://img.sobot.com/chatres/common/face/';
    var imageUrl2 = 'http://img.sobot.com/console/common/face/';
    var systemImage = imageUrl2 + 'robot.png';
    var API = {
        http : {
            chatList : {
                'chat' : '/chat/admin/get_chatdetail.action',
                'hchat' : '/chat/admin/get_chatdetail.action'
            },

            status : {
                black : {
                    add : '/chat/admin/add_blacklist.action',
                    del : '/chat/admin/delete_blacklist.action'
                },
                   star : {
                    add : '/chat/admin/add_marklist.action',
                    del : '/chat/admin/delete_marklist.action'
                }
            },

            call: '/chat/admin/call.action',
            getOtherAdmin : '/chat/admin/getOhterAdminList.action',
            userTransfer : '/chat/admin/transfer.action',
            searchChat : '/chat/admin/internalChat1.action'
        },

        tpl : {
            chatList : 'views/scrollcontent/list.html',
            chatItem : 'views/scrollcontent/item.html',
            chatItemByAdmin : 'views/scrollcontent/itemByAdmin.html',
            adminTable : 'views/scrollcontent/adminTable.html',
            userReadySend : 'views/scrollcontent/userReadySend.html',
            call: 'views/scrollcontent/call.html',
            callTag: 'views/scrollcontent/callTag.html',
            callDialog: 'views/scrollcontent/callDialog.html'
        }
    };

    var userSourceMap = [
        imageUrl + 'pcType.png' ,
        imageUrl + 'weixinType.png' ,
        imageUrl + 'appType.png' ,
        imageUrl + 'weiboType.png' ,
        imageUrl + 'moType.png' ,
        imageUrl + 'moType.png'
    ];

    var userInfo = {};


    // --------------------------- 推送函数 ---------------------------

    // 智能搜索事件
    var onSearchUserChat = function(str) {
        $body.trigger('scrollcontent.onSearchUserChat',[{
          uid: userInfo.userId ,
          str: str
        }]);
    }
    // 暴露修改状态事件
    var onUpdateUserState = function(type,handleType) {
        $body.trigger('scrollcontent.onUpdateUserState',[{
            type : type,
            handleType : handleType ,
            userId: userInfo.userId
        }]);
    }
    // 推送转接事件
    var onTransfer = function(uid,uname, userId) {
        clearScrollContent();
        $body.trigger('scrollcontent.onTransfer',[{
            uid: userId ,
            userName : uname
        }]);
    }
    // --------------------------- http 请求 ---------------------------

    // 加载
    var getChatListByOnline = function(type,callback, pageNo, pageSize, userData, isRender, isScrollBottom, typeNo, appendList) {
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

        // 假如用户在缓存里
        if (userChatCache[userId] && userChatCache[userId].list) {

          if (pageNo) {
            $.ajax({
                'url' : API.http.chatList[type],
                'dataType' : 'json',
                'type' : 'get',
                'data' : {
                    t : userChatCache[userId].date || Date.parse(new Date()),
                    uid : userId,
                    pid : userData.pid,
                    pageNow : pageNo || 1,
                    pageSize : pageSize || 20
                }
            }).success(function(ret) {
              var appendList = [];
              var list = [];

              if (ret.data.length > 0) {
                ret.data.map(function(item) {
                    appendList.push({
                        action : 'dateline',
                        date : item.date
                    });

                    item.content.map(function(obj) {
                        obj.msg = obj.msg ? Face.analysis(obj.msg) : null;
                        appendList.push(obj);
                    });
                });

                list = appendList.concat(userChatCache[userId].list);
                userChatCache[userId].list = list;

                if (ret.data[0] && ret.data[0].content[0]) {
                  userChatCache[userId].date = ret.data[0].content[0].t;
                }

                if (isRender) parseList(type , userChatCache[userId], isScrollBottom, true, typeNo, appendList);
              } else {

              }
            });
          } else {
            if (isRender) parseList(type , userChatCache[userId], isScrollBottom, false , typeNo, appendList);
          }
        } else {

          if (!!!userChatCache[userId]) userChatCache[userId] = {}
          $.ajax({
              'url' : API.http.chatList[type],
              'dataType' : 'json',
              'type' : 'get',
              'data' : {
                  t : userChatCache[userId].date || Date.parse(new Date()),
                  uid : userId,
                  pid : userData.pid,
                  pageNow : pageNo || 1,
                  pageSize : pageSize || 20
              }
          }).success(function(ret) {

            if (ret.data[0] && ret.data[0].content[0]) {
              userChatCache[userId].date = ret.data[0].content[0].t;
            }
            callback && callback(type,ret, userId, isScrollBottom);
          })
        }
    };

    var callToUser = function() {

      if (hasCallState) {
        loadFile.load(global.baseUrl + API.tpl.callDialog).then(function(tpl) {

            var _html ,
                dialog = new Dialog({
                'title' : '请结束上一个语音会话',
                'footer' : false
            });

            _html = doT.template(tpl)({});

            dialog.setInner(_html);
            dialog.show();
        });
      } else {
        $.ajax({
            'url' : API.http.call,
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                sender: userInfo.sender ,
                cid: userInfo.cid ,
                receiver: userInfo.userId ,
                called: userChatCache[userInfo.userId].called
            }
        }).success(function(ret) {
            hasCallState = true;
            userChatCache[userInfo.userId].isCall = false;
            $rootNode.find('#chat').find('.uesrDivNow').hide();

            loadFile.load(global.baseUrl + API.tpl.callTag).then(function(tpl) {
                var _html;
                _html = doT.template(tpl)({
                    data : {
                      called: userChatCache[userInfo.userId].called,
                      uname: userChatCache[userInfo.userId].uname
                    }
                });

                $rootNode.find('#chat').find('.uesrDivNow').hide();
                $(document.body).find('.zc-c-call-tag').empty().append(_html);
                $(document.body).find('.zc-c-call-tag').show();
            });

        });
      }


    }

    // 改变用户状态
    var updateUserState = function(type,handleType,callback) {
      var func = function(){
        $.ajax({
            'url' : API.http.status[type][handleType],
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                sender : userInfo.sender,
                receiver : userInfo.userId
            }
        }).success(function(ret) {
            callback && callback(type,handleType);
        });
      }

      // 只有添加标记没有弹框 直接添加
      if (type === 'star' && handleType === 'add') {
        func();
      } else {

        var textModelMap = {
          star: {
            del: {
              title: '去除星标' ,
              content: '确定要取消标记这个用户吗？'
            }
          } ,

          black: {
            add: {
              title: '添加拉黑' ,
              content: '确定要拉黑这个用户吗？'
            },
            del: {
              title: '去除拉黑' ,
              content: '确定要取消拉黑这个用户吗？'
            }
          }
        }

        var model = textModelMap[type][handleType];
        var dialog = new Alert({
            'title' : model.title,
            'text' : model.content,
            'OK' : function() {
              func();
              dialog.hide();
            }
        });
        dialog.show();
      }
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

            ret.map(function(item) {
              item.statusClass = item.status === 1 ? 'glyphicon-ok-sign' : 'glyphicon-minus-sign';
            });

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

                if(ret.status === 1)
                    dialog.hide();
                    onTransfer(uid,uname, userInfo.userId);
            });
        });
    }
    var sendSearchUserChat = function() {
        $rootNode.on('click', '.msg_content', function() {
            var chatText = $(this).html();

            if (chatText.indexOf('webchat_img_upload') !== -1) {
              window.open($(this).find('.webchat_img_upload').attr('src'));
            } else {
              onSearchUserChat(chatText);
            }
        })
    }

    // --------------------------- dom操作 ---------------------------

    // 清理聊天主体页面
    var clearScrollContent = function(uid) {
      $rootNode.find('#chat').hide();
      userChatCache[userInfo.userId | uid] = undefined;
      $rootNode.find('.js-addButton').children('.js-goOut').addClass('hide');
      $rootNode.find('#chat').find('.js-panel-body').empty();
    }

    var parseTpl = function(type,ret, uid, isScrollBottom) {
        loadFile.load(global.baseUrl + API.tpl.chatList).then(function(tpl) {

            var list = [] ,
                _html ;



            ret.data.map(function(item) {
                list.push({
                    action : 'dateline',
                    date : item.date
                });

                item.content.map(function(obj) {
                    obj.msg = obj.msg ? Face.analysis(obj.msg) : null;
                    obj.msg = obj.msg ? App.getUrlRegex(obj.msg) : null;
                    list.push(obj);
                });
            });

            if (userInfo.unreadcount) {
              var count = 0;

              for (var i = list.length - 1;i > -1;i--) {

                  if (list[i].action === 5) {

                    if (count === userInfo.unreadcount) {
                      list.splice(i + 1, 0 , {
                        action: 'noReadLine'
                      })
                      break;
                    } else {
                      count++;
                    }
                  }
              }
            } else {

              for (var i = 0;i < list.length;i++) {

                if (list[i].action === 'noReadLine') list.splice(i, 1);
              }
            }

            var isCall = userChatCache[userInfo.userId].isCall;
            var called = userChatCache[userInfo.userId].called;
            var uname = userChatCache[userInfo.userId].uname;
            // var isCall = userChatCache[userInfo.userId].isCall;

            userChatCache[uid] = {
              list: list ,
              scrollTop: 0,
              pageNo: 1 ,
              isCall: isCall,
              called: called,
              uname: uname
            }

            _html = doT.template(tpl)({
              userSourceImage: userInfo.userSourceImage ,
              adminImage: global.face ,
              systemImage: systemImage ,
              list : list
            });

            $rootNode.find('#' + type).find('.js-panel-body').empty().html(_html);

            setTimeout(function() {

              if (isScrollBottom) {
                var lastImg = $rootNode.find('#' + type).find('.js-panel-body').find('.webchat_img_upload').last()[0];

                if (lastImg) {
                  lastImg.src = lastImg.src + '?r=' + (new Date());
                  lastImg.onload = function() {
                    $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                    // 获取当前窗口最低scrollTop
                    userChatCache[uid].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                  }
                } else {
                  $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);

                  // 获取当前窗口最低scrollTop
                  userChatCache[uid].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                }
              }
            }, 400);

            if (userChatCache[userInfo.userId].isCall) {
              callUser();
            } else {
              $rootNode.find('#chat').find('.uesrDivNow').hide();
            }
        });
    }

    var parseList = function(type, data, isScrollBottom, isToTop, typeNo, appendList) {

        if (appendList) {

          appendList.map(function(item) {
            item.msg = item.msg ? Face.analysis(item.msg) : null;
          })

          loadFile.load(global.baseUrl + API.tpl.chatItem).then(function(tpl) {
              var _html;

              var height = $rootNode.find('#' + type).find('.js-panel-body').parent()[0].scrollHeight;
              var scrollTop = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();

              _html = doT.template(tpl)({
                  userSourceImage: userInfo.userSourceImage ,
                  adminImage: global.face ,
                  systemImage: systemImage ,
                  list : appendList
              });
              if (isToTop) {
                $rootNode.find('#' + type).find('.js-panel-body').prepend(_html);
                $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop(10);
              } else {
                $rootNode.find('#' + type).find('.js-panel-body').append(_html);

                if (isScrollBottom) {
                  var img = $rootNode.find('#' + type).find('.js-panel-body').find('.webchat_img_upload').last()[0];

                  if (img) {
                    img.src = img.src + '?r=' + (new Date());
                    img.onload = function() {
                      $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                      userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                    }
                  } else {
                    $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                    userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                  }
                }
                else {

                  if ((height - scrollTop) > 700) {

                    if (typeNo === 103) $rootNode.find('#' + type).find('.zc-newchat-tag').show();
                  } else {
                    var img = $rootNode.find('#' + type).find('.js-panel-body').find('.webchat_img_upload').last()[0];

                    if (img) {
                      img.src = img.src + '?r=' + (new Date());
                      img.onload = function() {
                        $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                        userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                      }
                    } else {
                      $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                      userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                    }

                  }
                }
              }
          });
        } else {
          loadFile.load(global.baseUrl + API.tpl.chatList).then(function(tpl) {

              var _html;

              for (var i = 0;i < data.list.length;i++) {

                if (data.list[i].action === 'noReadLine') data.list.splice(i, 1);
              }

              if (userInfo.unreadcount) {
                var count = 0;

                for (var i = data.list.length - 1;i > -1;i--) {

                    if (data.list[i].action === 5) {

                      if (count === userInfo.unreadcount) {
                        data.list.splice(i + 1, 0 , {
                          action: 'noReadLine'
                        })
                        break;
                      } else {
                        count++;
                      }
                    }
                }
              }

              _html = doT.template(tpl)({
                userSourceImage: userInfo.userSourceImage ,
                adminImage: global.face ,
                systemImage: systemImage ,
                list : data.list
              });

              $rootNode.find('#' + type).find('.js-panel-body').empty().html(_html);

              setTimeout(function() {

                if (isScrollBottom) {
                  $rootNode.find('#' + type).find('.js-panel-body')[0].scrollIntoView(false);
                  userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#' + type).find('.js-panel-body').parent().scrollTop();
                }
              }, 400);
          });
        }

        if (userChatCache[userInfo.userId].isCall) {
          callUser();
        } else {
          $rootNode.find('#chat').find('.uesrDivNow').hide();
        }
    }

    var updateHeaderTag = function(type,handleType) {
        $rootNode.find('.js-addButton').children('[data-type="' + type + '"]').removeClass('hide');
        $rootNode.find('.js-addButton').children('.js-' + type + '-' + handleType).addClass('hide');

        // 如果是添加拉黑
        if (type === 'black' && handleType === 'add') clearScrollContent();

        adminPushMessageState({
          type: type ,
          handleType: handleType
        });
        // 加入聊天记录
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

        $rootNode.find('.js-addButton').children('.js-transfer').removeClass('hide');

        if (!userInfo.from) $rootNode.find('.js-addButton').children('.js-transfer').addClass('hide');
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

    var callUser = function() {
      loadFile.load(global.baseUrl + API.tpl.call).then(function(tpl) {
          var _html;
          _html = doT.template(tpl)({
              data : {
                called: userChatCache[userInfo.userId].called ,
                uname: userChatCache[userInfo.userId].uname ,
                ts: new Date().toTimeString().split(' ')[0]
              }
          });

          $rootNode.find('#chat').find('.uesrDivNow').empty().append(_html)
          $rootNode.find('#chat').find('.uesrDivNow').show();
      });
    }
    // --------------------------- socket ---------------------------

    // 加入到某一个user的chche内
    var userPushMessage = function(data) {
        parseChat[data.type] && parseChat[data.type](data);

        if (data[0].type === 111) {
          loadFile.load(global.baseUrl + API.tpl.userReadySend).then(function(tpl) {
              var _html;
              _html = doT.template(tpl)({
                  data : data[0]
              });

              $rootNode.find('#chat').find('.js-user-ready-input').show();
              $rootNode.find('#chat').find('.js-user-ready-input').empty().append(_html);

              setTimeout(function() {
                $rootNode.find('#chat').find('.js-user-ready-input').hide();
              }, 5000);
          });
        }
        else if(data[0].type === 108) {
          // clearScrollContent();
          var list = [];
          if (userChatCache[data[0].uid]) {
            userChatCache[data[0].uid].list.push({
              action: 10 ,
              offlineType: 5 ,
              ts: 'date ' + new Date(data[0].t).toTimeString().split(' ')[0]
            })

            list.push({
              action: 10 ,
              offlineType: 5 ,
              ts: 'date ' + new Date(data[0].t).toTimeString().split(' ')[0]
            });

            // 是否渲染 isRender
            var isRender = userInfo.userId === data[0].uid;
            getChatListByOnline('chat', parseList , null, null, data, isRender, false, data[0].type, list);
          }

        }
        else if(data[0].type === 112) {




          var userId = userInfo.userId = data[0].uid;
          var list = [];

          userChatCache[userId] = userChatCache[userId] || {};
          userChatCache[userId].isCall = true;
          userChatCache[userId].called = data[0].called;
          userChatCache[userId].uname = data[0].uname;

          if (userChatCache[data[0].uid]) {
            userChatCache[data[0].uid].list.push({
              action: 18 ,
              ts: data[0].ts
            })

            list.push({
              action: 18 ,
              ts: data[0].ts
            });

            // 是否渲染 isRender
            var isRender = userInfo.userId === data[0].uid;
            getChatListByOnline('chat', parseList , null, null, data, isRender, false, data[0].type, list);
          }


          callUser();
        }
        else {
          var list = [];

          if (userChatCache[data[0].uid]) {

            for (var i = 0;i < data.length;i++) {
              // userChatCache[data[0].uid].list.push(data[i]);
              // 聊天
              if (data[i].type === 103) {
                userChatCache[data[0].uid].list.push({
                  action: 5 ,
                  senderType: 0 ,
                  senderName: data[i].uname ,
                  msg: data[i].content ,
                  ts: data[i].ts
                })

                list.push({
                  action: 5 ,
                  senderType: 0 ,
                  senderName: data[i].uname ,
                  msg: data[i].content ,
                  ts: data[i].ts
                });
              }
            }

            // 是否渲染 isRender
            var isRender = userInfo.userId === data[0].uid;
            getChatListByOnline('chat', parseList , null, null, data, isRender, false, data[0].type, list);
          }
        }
    };

    var adminPushMessageState = function(data) {

      var messageMap = {
        star: {
          add: {
            action: 16
          } ,

          del: {
            action: 17
          }
        },

        black: {
          add: {} ,

          del: {
            action: 12
          }
        }
      }

      var model = messageMap[data.type][data.handleType];
      var list = [];
      model.ts = 'date ' + new Date().toTimeString().split(' ')[0];
      model.senderName = global.name;

      var data = {
        uid: userInfo.userId ,
        pid: userInfo.pid
      }

      userChatCache[userInfo.userId] = userChatCache[userInfo.userId] || {
        list: [],
        scrollTop: 0,
        pageNo: 1
      }

      list.push(model);

      userChatCache[userInfo.userId].list.push(model);

      getChatListByOnline('chat', parseList , null, null, data, true, true, null, list);
    }

    var adminPushMessage = function(data) {
      var list = [];

      userChatCache[data.uid] = userChatCache[data.uid] || {
        list: [],
        scrollTop: 0,
        pageNo: 1
      }

      userChatCache[data.uid].list.push({
        action: 5 ,
        senderType: 2 ,
        senderName: global.name ,
        msg: App.getUrlRegex(data.answer) ,
        ts: 'date ' + new Date().toTimeString().split(' ')[0]
      });

      list.push({
        action: 5 ,
        senderType: 2 ,
        senderName: global.name ,
        msg: App.getUrlRegex(data.answer) ,
        ts: 'date ' + new Date().toTimeString().split(' ')[0]
      });

      var isRender = userInfo.userId === data.uid;
      getChatListByOnline('chat', parseList , null, null, data, isRender, true, null, list);
      // }
    }

    var hideCallTag = function() {
      $(document.body).find('.zc-c-call-tag').hide();
      hasCallState = false;
    }
    // --------------------------- base ---------------------------

    var parseDOM = function() {
        $rootNode = $(node);
        $body = $(document.body);
    };

    var onReceive = function(value,data) {
        userPushMessage(data);
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
    };

    var bindLitener = function() {
        // --------------------------- 接收推送函数 ---------------------------
        $body.on('core.onload',onloadHandler);
        $body.on('core.receive',onReceive);
        $(window || document.body).on("resize", function() {

            $(document.body).find('.zc-c-call-tag').width($('.rightBox').width());
        });

        $body.on('textarea.send', function(ev) {
            adminPushMessage(arguments[1]);
        });

        $body.on("leftside.onhide", function() {
          console.log('leftside.onhide');
          clearScrollContent(arguments[1].uid);
        })

        $body.on("leftside.onselected", function() {
          var params = arguments[1] ,
              $chatContent = $rootNode.find('#chat');

          userInfo = {
            isStar: !!params.userData.ismark ,
            isBlack: !!params.userData.isblack ,
            isTransfer: !!params.userData.chatType ,
            cid: params.data.cid ,
            uid: global.id,
            pid: params.data.pid,
            sender : global.id,
            userId: params.data.uid,
            userSourceImage: userSourceMap[params.data.usource | params.data.source],
            from: params.data.from === 'online' ,
            unreadcount: params.unreadcount
          }

          $chatContent.show();
          $chatContent.find('.zc-newchat-tag , .js-user-ready-input').hide();
          $(window).resize();

          // 初始化历史记录
          getChatListByOnline('chat', parseTpl, null, null, {
            uid: params.data.uid ,
            pid: params.data.pid
          }, true, true);

          // 初始化用户状态
          initUserState({
              star: !!params.userData.ismark ,
              black: !!params.userData.isblack ,
              transfer: !!params.userData.chatType
          });
        });

        $body.on("leftside.onremove", function() {
          clearScrollContent(arguments[1].uid);
        });

        $body.on("rightside.onChatSmartReply", function() {
          var data = {
            answer: arguments[1].data.msg ,
            uid: userInfo.userId ,
            pid: userInfo.pid
          }

          if (arguments[1].data.status === "1") adminPushMessage(data);
        });


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
            var data = {
              uid: userInfo.userId ,
              pid: userInfo.pid
            };

            if ($(this).scrollTop() >= userChatCache[userInfo.userId].scrollBottom) {
              $rootNode.find('#chat').find('.zc-newchat-tag').hide();
            } else if ($(this).scrollTop() === 0) {
              userChatCache[userInfo.userId].pageNo++;

              getChatListByOnline('chat', parseTpl, userChatCache[userInfo.userId].pageNo, null, data, true, false);
            }
        });

        $rootNode.find('#chat').on('click', '.zc-newchat-tag', function() {
          $rootNode.find('#chat').find('.js-panel-body')[0].scrollIntoView(false);
          userChatCache[userInfo.userId].scrollBottom = $rootNode.find('#chat').find('.js-panel-body').parent().scrollTop();
          $rootNode.find('#chat').find('.zc-newchat-tag').hide();
        });

        $rootNode.find('#chat').on('click', '.callBtn', function() {
          callToUser();
        });

        $(document.body).on('click', '.zc-c-call-tag-exit-btn', function() {
          hideCallTag();
        })

        sendSearchUserChat();

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
