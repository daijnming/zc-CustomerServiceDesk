function LeftSide(node,core,window) {
    var that = {};
    var template = require('./template.js');
    var loadFile = require('../util/load.js')();
    var online;
    var URLLIST = ['','/chat/admin/online.action','/chat/admin/busy.action'];
    var STATUSIMAGELIST = ['','img/online.png','img/busy.png'];
    var Online = require('./online.js');
    var $node,
        $statusBtn,
        $statusMenu,
        $statusImage;
    var Alert = require('../util/modal/alert.js');
    var global;
    var parseDOM = function() {
        $node = $(node);
        $statusBtn = $node.find(".js-menuDropdown");
        $statusMenu = $node.find(".js-status-menu");
        $statusImage = $node.find(".js-status-image");
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
        }
    };

    var onReceive = function(value,list) {
    };

    var onloadHandler = function(evt,data) {
        global = core.getGlobal();
        $statusImage.attr("src",STATUSIMAGELIST[global.status]);
        $(node).find("img.js-my-logo").attr("src",data.face);
        $(node).find(".js-customer-service").html(data.name);
    };

    var bindLitener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("core.receive",onReceive);
        $statusBtn.on("click", function() {
            $statusMenu.toggleClass("active");
        });
        $node.delegate(".js-status",'click',onStatusItemClickHandler);
    };

    var initPlugsin = function() {
        online = Online($node.find(".js-chatonline")[0],core,window);
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
