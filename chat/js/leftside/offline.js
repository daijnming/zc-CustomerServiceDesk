/**
 * @author Treagzhao
 */
function Offline(node,core,window) {
    var $node;
    var $ulOuter;
    var that = {};
    var USOURCE = require('./source.json');
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var prevCursor = 0;
    var global = core.getGlobal();
    var urlList = ['/chat/admin/get_histroryUser.action'];
    var parseDOM = function() {
        $node = $(node);
        $ulOuter = $node.find(".js-history-list");
    };

    var dataAdapter = function(list) {
        for(var i = 0,
            len = list.length;i < len;i++) {
            var item = list[i];
            item.source_type = USOURCE[item.source];
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
                promise.resolve(ret);
            });
            return promise;
        }).then(function(list,promise) {
            for(var i = 0;i < list.length;i++) {
                var item = list[i];
            }
            loadFile.load(global.baseUrl + "views/leftside/chatlist.html").then(function(value) {
                var _html = doT.template(value)({
                    'list' : list,
                    'type' : 'history'
                });
                $ulOuter.html(_html);
            });
        });
    };
    var labelItemClickHandler = function(e) {
        var $elm = $(e.currentTarget);
        $elm.addClass("active").siblings().removeClass("active");
        var index = $elm.index();

    };

    var show = function() {
        $node.show();
    };

    var hide = function() {
        $node.hide();
    };

    var bindListener = function() {
        $node.delegate(".js-switch-label",'click',labelItemClickHandler);
    };

    var initPlugins = function() {
        fetchData(prevCursor);
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();
    that.show = show;
    that.hide = hide;
    return that;
};

module.exports = Offline;
