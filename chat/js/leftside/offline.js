/**
 * @author Treagzhao
 */
function Offline(node,core,window) {
    var $node;
    var $ulOuter,
        $ulParent;
    var that = {};
    var USOURCE = require('./source.json');
    var Item = require('./chatItem.js');
    var CLASSNAME = ['','noStar','noBlack'];
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var normalMessageAdapter = require('../util/normatMessageAdapter.js');
    var prevCursor = 0;
    var pageNow = 1,
    //用来标记是不是已经滚动到最底部
        end = false;
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
        $ulParent = $ulOuter.parent();
    };

    var onParentScroll = function(evt) {
        if(end)
            return;
        var scrollTop = $ulParent.scrollTop();
        var outerHeight = $ulParent.outerHeight();
        var innerHeight = $ulOuter.outerHeight();
        var dis = Math.abs((scrollTop + outerHeight) - innerHeight);
        if(dis < 1) {
            pageNow++;
            fetchData(currentIndex,currentKey,true);
        }
    };
    var currentUid,
        currentKey,
        currentIndex;

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

    var fetchData = function(index,from,append) {
        var append = append === true;
        var url = urlList[index];
        var from = from || 'history';
        currentKey = from;
        currentIndex = index;
        Promise.when(function() {
            var promise = new Promise();
            $.ajax({
                'url' : url,
                'type' : 'get',
                'dataType' : 'json',
                'data' : {
                    'uid' : global.id,
                    'pageNow' : pageNow
                }
            }).success(function(ret) {
                dataAdapter(ret);
                if(ret.length == 0) {
                    end = true;
                }
                for(var i = 0;i < ret.length;i++) {
                    var item = ret[i];
                    dataCache[item.uid] = item;
                }
                promise.resolve(ret);
            });
            return promise;
        }).then(function(list,promise) {
            loadFile.load(global.baseUrl + "views/leftside/chatlist.html").then(function(value) {
                for(var el in chatItemList) {
                    chatItemList[el].destroy();
                }
                if(!append) {
                    var className = CLASSNAME[index];
                    var _html = doT.template(value)({
                        'list' : list,
                        'type' : from,
                        'className' : className
                    });
                    $ulOuter.html(_html);
                }
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
                //FIXME 为空时定位空背景图片
                var h = $('#left-navigation').height();
                var listH =  $ulOuter.height();
                var aListH = h/2 -(h-listH) - 32.5;//32.5 背景图/2
                $ulOuter.find('li.fullscreen').css('background-position','center '+aListH+'px');
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
        pageNow = 1;
        end = false;
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
        $ulParent.on("scroll",onParentScroll);
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
