/**
 * @author Treagzhao
 */
function Queue(core,window) {
    var global = core.getGlobal();
    var Dialog = require('../util/modal/dialog.js');
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var dialog;
    var prevPage = 1;
    var $node,
        $totalpage,
        $currentPage;
    var totalPage,
        currentPage;
    this.token = +new Date();

    var initContent = function(data,promise) {
        var html = data.html;
        var ret = data.data;
        var _html = doT.template(html)(ret);
        dialog.setInner();
    };

    var getQueryUsers = function() {
        var promise = new Promise();
        loadFile.load(global.baseUrl + "views/leftside/queuelist.html").then(function(value) {
            $.ajax({
                'url' : '/chat/admin/queryUser.action',
                'dataType' : 'json',
                'type' : 'get',
                'data' : {
                    'uid' : global.id,
                    'status' : 3,
                    'pageNow' : prevPage
                }
            }).success(function(ret) {
                promise.resolve({
                    'data' : ret,
                    'html' : value
                });
            });
        });
        return promise;
    };

    var parseDOM = function() {
        $currentPage = $node.find(".js-current-page");
        $totalpage = $node.find(".js-all-count-page");
    };

    var bindListener = function() {
    };

    var initPlugins = function() {
        dialog = new Dialog({
            'title' : '选择排队用户',
            'footer' : false
        });
        $node = $(dialog.getOuter());
        getQueryUsers().then(initContent);
    };

    var init = function() {
        bindListener();
        initPlugins();
    };

    init();
}

module.exports = Queue;
