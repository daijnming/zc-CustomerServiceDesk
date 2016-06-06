/**
 * @author Treagzhao
 */
function Offline(node,core,window) {
    var $node;
    var $ulOuter;
    var that = {};
    var USOURCE = require('./source.json');
    var Item = require('./chatItem.js');
    var CLASSNAME = ['','noStar','noBlack'];
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var normalMessageAdapter = require('../util/normatMessageAdapter.js');
    var prevCursor = 0;
    var HEADER_HEIGHT = 79,
        TABCONTAINER_HEIGHT = 41,
        RADIOBOX_HEIGHT = 47;
    var dataCache = {},
        chatItemList = {};
    var global = core.getGlobal();
    var urlList = ['/chat/admin/get_histroryUser.action','/chat/admin/query_marklist.action','/chat/admin/query_blacklist.action'];
    var parseDOM = function() {
        $node = $(node);
        $ulOuter = $node.find(".js-history-list");
    };

    var currentUid;

    var setCurrentUid = function(uid) {
        currentUid = uid;
    };

    var getCurrentUid = function() {
        return currentUid;
    };
    var dataAdapter = function(list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var item = list[i];
            item.source_type = USOURCE[item.source];
            item.content = item.lastMsg;
            normalMessageAdapter(item);
            if(item.source == 1) {
                item.imgUrl = "img/weixinType.png";
            }
            if(item.face && item.face.length) {
                item.source_type = 'face';
                item.imgUrl = item.face;
            }
            item.uid = item.id;
        }
    };

    var fetchData = function(index,from) {
        var url = urlList[index];
        var from = from || 'history';
        Promise.when(function() {
            var promise = new Promise();
            $.ajax({
                'url' : url,
                'type' : 'get',
                'dataType' : 'json',
                'data' : {
                    'uid' : global.id
                }
            }).success(function(ret) {
                dataAdapter(ret);
                for(var i = 0;i < ret.length;i++) {
                    var item = ret[i];
                    dataCache[item.uid] = item;
                }
                promise.resolve(ret);
            });
            return promise;
        }).then(function(list,promise) {
            loadFile.load(global.baseUrl + "views/leftside/chatlist.html").then(function(value) {
                var className = CLASSNAME[index];

                var _html = doT.template(value)({
                    'list' : list,
                    'type' : from,
                    'className' : className
                });
                $ulOuter.html(_html);
                for(var i = 0,
                    len = list.length;i < len;i++) {
                    var item = new Item(list[i],core,node,from,that);
                    chatItemList[list[i].uid] = item;
                }
                if(currentUid) {
                    setTimeout(function() {
                        chatItemList[currentUid].onclick();
                    },10);
                }
            });
        });
    };

    var onloadHandler = function() {
    };

    var labelItemClickHandler = function(e) {
        var $elm = $(e.currentTarget);
        $elm.addClass("active").siblings().removeClass("active");
        var index = $elm.index();
        var key = $elm.attr("data-key");
        fetchData(index,key);
    };

    var show = function() {
        $ulOuter.html('');
        $node.show();
        $node.find(".js-switch-label").eq(prevCursor).trigger("click");
    };

    var clearSeleted = function() {
        $node.find("li.user-list-item").removeClass("active");
        currentUid = null;
    };

    var onLeftSideItemClickHandler = function(evt,data) {
        if(data.data.from == 'online') {
            clearSeleted();
        } else {
            currentUid = data.data.uid;
        }
    };

    var hide = function() {
        $node.hide();
    };

    var onResize = function(height) {
        $node.css({
            'height' : height
        });
    };
    var bindListener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $(document.body).on("leftside.onselected",onLeftSideItemClickHandler);
        $node.delegate(".js-switch-label",'click',labelItemClickHandler);
    };

    var initPlugins = function() {
        $node.css({
            'height' : $(window).outerHeight() - (HEADER_HEIGHT + TABCONTAINER_HEIGHT + RADIOBOX_HEIGHT)
        });
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();
    that.show = show;
    that.hide = hide;
    that.onResize = onResize;
    that.getCurrentUid = getCurrentUid;
    that.setCurrentUid = setCurrentUid;
    return that;
};

module.exports = Offline;
