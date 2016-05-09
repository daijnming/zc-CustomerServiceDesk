function Content(node,core,window) {
    var loadFile = require('../util/load.js')();
    var $rootNode = $(node);
    var global;
    var API = {
      http: {
        onlineChatList: 'admin/get_chatdetail.action',
        historyChatList: 'admin/get_chatdetail.action',
        addBlack: 'admin/add_blacklist.action',
        delBlack: 'admin/delete_blacklist.action',
        addStar: 'admin/add_marklist.action',
        delStar: 'admin/delete_marklist.action',
        addTransfer: ''
      },

      tpl: {
        chatList: 'views/scrollcontent/index.html'
      }
    };
    var parseDOM = function() {

    };

    var newUserMessage = function(data) {
        // 用户发送消息
    };

    var onReceive = function(value,data) {
        switch(data.type) {
            case 103:
                newUserMessage(data);
                break;
        }
    };

    // 加载
    var getChatListByOnline = function() {

      $.ajax({
          'url' : API.http.onlineChatList,
          'dataType' : 'json',
          'type' : 'get',
          'data' : {
              t: '1462786697015' ,
              uid: 'fdf2f6e709f7457aae9b9bd5afcb1f57' ,
              pid: '088ad376b6514ed0a191067308c284fe' ,
              pageNow: 1 ,
              pageSize: 20
          }
      }).success(function(ret) {

        loadFile.load(global.baseUrl + API.tpl.chatList)
        .then(function(tpl) {

          var list = []
            , _html ;

          ret.data.map(function(item){

            item.content.map(function(obj){
              list.push(obj);
            });

            list.push({
              date: item.date
            });
          });

          _html = doT.template(tpl)({
            list: list
          });

          $rootNode.find('.js-online-panel-body').html(_html);
        });
      })
    };

    var loadTpl = function(data){

    }

    var getChatListByHistory = function() {

    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        getChatListByOnline();
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
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
