/**
 * @author Treagzhao
 */
function Queue(core,window) {
    var global = core.getGlobal();
    var Dialog = require('../util/modal/dialog.js');
    var loadFile = require('../util/load.js')();
    var Promise = require('../util/promise.js');
    var dateTimeUtil = require('../util/datetime.js');
    var dialog;
    var currentTab = 0;
    var prevPage = 1;
    var $node,
        $totalpage,
        $currentPage,
        $pageJump,
        $input;
    var urlList = ['/chat/admin/queryUser.action',''];
    var TEMPLATELIST = ['views/leftside/queuelist.html'];
    var totalPage,
        currentPage = 1;
    this.token = +new Date();

    var initContent = function(data,promise) {
        var html = data.html;
        var ret = data.data;
        totalPage = ret.countPage;
        ret.currentTime = dateTimeUtil.getTime(new Date());
        var _html = doT.template(html)(ret);
        dialog.setInner(_html);
        dialog.show();
        $node = $(dialog.getOuter());
        parseDOM();
        bindListener();
    };

    var fetchData = function() {
        loadFile.load(global.baseUrl + TEMPLATELIST[currentTab]).then(getQueryUsers);
    };
    var pageJumpBtnClickHandler = function() {
        var value = $input.val();
        var num = +value;
        if(value.length == 0 || isNaN(num)) {
            return;
        };
        if(num <= 0) {
            num = 1;
        } else if(num >= totalPage) {
            num = totalPage;
        }
        $input.val(num);
        currentPage = num;
    };

    var getQueryUsers = function(value,promise) {
        var promise = promise || new Promise();
        var html = value;
        $.ajax({
            'url' : urlList[currentTab],
            'dataType' : 'json',
            'type' : 'get',
            'data' : {
                'uid' : global.id,
                'status' : 3,
                'pageNow' : currentPage
            }
        }).success(function(ret) {
            ret.currentPage = currentPage;
            promise.resolve({
                'data' : ret,
                'html' : html
            });
        });

        return promise;
    };

    var parseDOM = function() {
        $currentPage = $node.find(".js-current-page");
        $totalpage = $node.find(".js-all-count-page");
        $pageJump = $node.find(".js-page-jump-btn");
        $input = $node.find(".js-input");

    };

    var onPageBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var type = $(elm).attr("data-type");
        if(type == 'prev') {
            currentPage = currentPage <= 1 ? 0 : currentPage - 1;
        } else if(type == 'next') {
            currentPage = currentPage >= totalPage - 1 ? totalPage : currentPage + 1;
        }
    };
    var bindListener = function() {
        $node.delegate(".js-page-btn",'click',onPageBtnClickHandler);
        $pageJump.on("click",pageJumpBtnClickHandler);
    };

    var initPlugins = function() {
        dialog = new Dialog({
            'title' : '选择排队用户',
            'footer' : false
        });
        loadFile.load(global.baseUrl + "views/leftside/queuelist.html").then(function(value,promise) {
            return getQueryUsers(value,promise);
        }).then(initContent);
    };

    var init = function() {
        initPlugins();
    };
    init();
}

module.exports = Queue;
