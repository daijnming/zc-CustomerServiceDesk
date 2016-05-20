function LeftSide(node,core,window) {
    var that = {};
    var template = require('./template.js');
    var loadFile = require('../util/load.js')();
    var Queue = require('./queue.js');
    var online,
        offline;
    var URLLIST = ['','/chat/admin/online.action','/chat/admin/busy.action'];
    var STATUSIMAGELIST = ['','img/online.png','img/busy.png'];
    var Online = require('./online.js');
    var Offline = require('./offline.js');
    var $node,
        $statusBtn,
        $statusMenu,
        $statusImage,
        $inviteBtn,
        $waitOuter;
    var Alert = require('../util/modal/alert.js');
    var global;
    var parseDOM = function() {
        $node = $(node);
        $statusBtn = $node.find(".js-menuDropdown");
        $statusMenu = $node.find(".js-status-menu");
        $statusImage = $node.find(".js-status-image");
        $waitOuter = $node.find(".js-wait-outer");
        $inviteBtn = $node.find(".js-invite-btn");
    };

    var inviteBtnClickHandler = function() {
        new Queue(core,window);
    };

    var initQueueInfo = function() {
        $.ajax({
            'url' : '/chat/admin/getAdminChats.action',
            'type' : 'get',
            'dataType' : 'json',
            'data' : {
                'uid' : global.id
            }
        }).success(function(ret) {
            onQueueLengthChanged({
                'count' : ret.waitSize
            });
        });
    };
    var tabItemClickHandler = function(e) {
        var $elm = $(e.currentTarget);
        var index = $elm.index();
        $elm.addClass("active").siblings().removeClass("active");
        if(index == 0) {
            online.show();
            offline.hide();
        } else {
            online.hide();
            offline.show();
        }
    };

    var onStatusItemClickHandler = function(e) {
        var elm = e.currentTarget;
        var status = $(elm).attr("data-status");
        $statusMenu.removeClass("active");
        var url = URLLIST[status];
        if(status <= 2 && status > 0) {
            $.ajax({
                'url' : url,
                'type' : 'POST',
                'dataType' : 'json',
                'data' : {
                    'uid' : global.id
                }
            }).success(function(ret) {
                $statusImage.attr("src",STATUSIMAGELIST[status]);
            });
        } else {
            var dialog = new Alert({
                'title' : '提示',
                'text' : '请确定是否要下线？',
                'OK' : function() {
                    $.ajax({
                        'url' : '/chat/admin/out.action',
                        'type' : 'post',
                        'dataType' : 'json',
                        'data' : {
                            'uid' : global.id
                        }
                    }).success(function(ret) {
                        if(ret.status == 1) {
                            $(window).unbind("beforeunload");
                            window.location.href = "/console/login";
                        }
                    });
                }
            });
            dialog.show();
        }
    };

    var onQueueLengthChanged = function(data) {
        loadFile.load(global.baseUrl + "views/leftside/queuelength.html").then(function(value) {
            var _html = doT.template(value)(data);
            $waitOuter.html(_html);
        });
    };
    var onReceive = function(value,list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var msg = list[i];
            switch(msg.type) {
                case 110:
                    onQueueLengthChanged(msg);
                    break;
            }
        }
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        initQueueInfo();
        $statusImage.attr("src",STATUSIMAGELIST[global.status]);
        $(node).find("img.js-my-logo").attr("src",data.face);
        $(node).find(".js-customer-service").html(data.name);
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $(document.body).on("click", function() {
            $statusMenu.removeClass("active");
        });
        $node.delegate(".js-tab-item",'click',tabItemClickHandler);
        $statusBtn.on("click", function(e) {
            e.stopPropagation();
            $statusMenu.toggleClass("active");
        });
        $node.delegate(".js-status",'click',onStatusItemClickHandler);
        $inviteBtn.on("click",inviteBtnClickHandler);
    };

    var initPlugsin = function() {
        online = Online($node.find(".js-chatonline")[0],core,window);
        offline = Offline($node.find(".js-history-outer")[0],core,window);
    };

    var init = function() {
        parseDOM();
        bindLitener();
        initPlugsin();
    };

    init();
    return that;
};

module.exports = LeftSide;
