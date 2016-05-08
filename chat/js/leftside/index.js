function LeftSide(node,core,window) {
    var template = require('./template.js');
    var loadFile = require('../util/load.js')();
    var global;
    var parseDOM = function() {

    };

    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $(node).find(".js-users-list").append(li);
    };
    var onReceive = function(value,data) {
        switch(data.type) {
            case 102:
                newUserMessage(data);
                break;
        }
    };

    var getDefaultChatList = function() {
        console.log(global);
        $.ajax({
            'url' : '/chat/admin/getAdminChats.action',
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                'uid' : global.id
            }
        }).success(function(ret) {
            console.log(ret);
            loadFile.load(global.baseUrl + 'views/leftside/chatlist.html').then(function(value) {
                var _html = doT.template(value)({
                    'list' : ret.userList
                });
                $(node).find(".js-users-list").html(_html);
            });
        });
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
