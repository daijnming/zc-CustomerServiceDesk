/**
 * @author Treagzhao
 */
function Transfer(core) {
    var Dialog = require('../util/modal/dialog.js');
    var _self = this;
    var global = core.getGlobal();
    var loadFile = require('../util/load.js')();
    var dateUtil = require("../util/date.js");
    var $outer;
    var $ulOuter;
    var sortType = 1,
        sortKey = 'uname',
        keyword = "";
    Dialog.call(this, {
        'title' : '转接给新的客服',
        'footer' : false,
        'width' : 855
    });
    var columns = [{
        'name' : '客服姓名',
        'key' : 'uname'

    },{
        'name' : '客服昵称',
        'key' : 'nickname'
    },{
        'name' : '接待状态',
        'key' : 'status'
    },{
        'name' : '所属分组',
        'key' : 'group'
    },{
        'name' : '操作',
        'key' : "operate",
        'hiden' : true
    }];

    var fetchData = function(value,promise) {
        var promise = promise || new Promise();
        $.ajax({
            'url' : '/chat/admin/getOhterAdminList.action',
            'data' : {
                'uid' : global.id,
                'orderName' : sortKey,
                'order' : sortKey,
                'keyword' : keyword
            },
            'dataType' : 'json',
            'type' : 'get'
        }).success(function(ret) {
            loadFile.load(global.baseUrl + 'views/scrollcontent/transferlist.html').then(function(html) {
                console.log(ret);
                var _html = doT.template(html)({
                    'list' : ret
                });
                $ulOuter.html(_html);
            });
        }).fail(function(ret,err) {
            console.log(ret,err);
        });
        return promise;
    };
    var getDefaultParam = function() {
        if(window.localStorage) {
            sortType = (window.localStorage.sortType) || sortType;
            sortKey = window.localStorage.sortKey || sortKey;
        }
    };
    var parseDOM = function() {
        $outer = $(_self.getOuter());
        $ulOuter = $outer.find(".js-list-detail");
    };

    var bindListener = function() {
    };

    var initPlugins = function() {
        loadFile.load(global.baseUrl + 'views/scrollcontent/transferouter.html').then(function(html,promise) {
            var _html = doT.template(html)({
                'columns' : columns,
                'sortKey' : sortKey,
                'sortType' : sortType,
                'dateStr' : dateUtil.formatTime(new Date())
            });
            _self.setInner(_html);
            _self.show();
            setTimeout(function() {
                promise.resolve({});
            },0);
            parseDOM();
            bindListener();
            return promise;
        }).then(fetchData);
        getDefaultParam();
    };

    var init = function() {
        initPlugins();
    };

    init();
};

module.exports = Transfer;
