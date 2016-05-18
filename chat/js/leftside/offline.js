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
    var prevCursor = 0;
    var dataCache = {},
        chatItemList = {};
    var global = core.getGlobal();
    var urlList = ['/chat/admin/get_histroryUser.action','/chat/admin/query_marklist.action','/chat/admin/query_blacklist.action'];
    var parseDOM = function() {
        $node = $(node);
        $ulOuter = $node.find(".js-history-list");
    };

    var currentUid;

    var getCurrentUid = function() {
        return currentUid;
    };
    var dataAdapter = function(list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var item = list[i];

            item.source_type = USOURCE[item.source];
            console.log(item.source_type);
            if(item.source == 1) {
                item.imgUrl = "img/weixinType.png";
            }
            item.uid = item.id;
        }
    };

    var fetchData = function(index) {
        var url = urlList[index];
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
            console.log(list);
            loadFile.load(global.baseUrl + "views/leftside/chatlist.html").then(function(value) {
                var className = CLASSNAME[index];
                var _html = doT.template(value)({
                    'list' : list,
                    'type' : 'history',
                    'className' : className
                });
                $ulOuter.html(_html);
                for(var i = 0,
                    len = list.length;i < len;i++) {
                    var item = new Item(list[i],core,node,'history',that);
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
        fetchData(index);
    };

    var show = function() {
        $node.show();
        $node.find(".js-switch-label").eq(prevCursor).trigger("click");
        //fetchData(prevCursor);
    };

    var hide = function() {
        $node.hide();
    };

    var bindListener = function() {
        $(document.body).on("core.onload",onloadHandler);
        $node.delegate(".js-switch-label",'click',labelItemClickHandler);
    };

    var initPlugins = function() {
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();
    that.show = show;
    that.hide = hide;
    that.getCurrentUid = getCurrentUid;
    return that;
};

module.exports = Offline;
