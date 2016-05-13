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
        $refreshTime,
        $refreshBtn,
        $tableOuter,
        $input;
    var urlList = ['/chat/admin/queryUser.action',''];
    var TEMPLATELIST = ['views/leftside/queueitem.html'];
    var totalPage,
        currentPage = 1;
    this.token = +new Date();

    var onTabClickHandler = function(e) {
        var elm = e.currentTarget;
        currentPage = 1;
        var index = $(elm).attr("data-index");
    };

    var initContent = function(data,promise) {
        var html = data.html;
        var ret = data.data;
        ret.isInvite = global.isInvite;
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
        loadFile.load(global.baseUrl + TEMPLATELIST[currentTab]).then(getQueryUsers).then(function(ret,promise) {
            totalPage = ret.data.countPage;
            $totalpage.html(totalPage);
            $currentPage.html(currentPage);
            $refreshTime.html(dateTimeUtil.getTime(new Date()));
            var _html = doT.template(ret.html)({
                'list' : ret.data.list
            });
            $tableOuter.html(_html);
        });
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
        fetchData();
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
        $refreshBtn = $node.find(".js-refresh-btn");
        $tableOuter = $node.find(".js-table-outer");
        $refreshTime = $node.find(".js-refresh-time");
    };

    var onInviteBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        if($(elm).hasClass("disabled")) {
            return;
        }
        var uid = $(elm).attr("data-uid");
        $.ajax({
            'url' : '/chat/admin/invite.action',
            'dataType' : 'json',
            'type' : "post",
            'data' : {
                'uid' : global.id,
                'userId' : uid
            }
        }).done(function(ret) {
            if(ret.status == 1) {
                $(elm).html('已邀请').addClass('disabled').css({
                    'color' : '#808080'
                });
            }
        });

    };

    var onPageBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var type = $(elm).attr("data-type");
        if(type == 'prev') {
            currentPage = currentPage <= 1 ? 1 : currentPage - 1;
        } else if(type == 'next') {
            currentPage = currentPage >= totalPage - 1 ? totalPage : currentPage + 1;
        }
        fetchData();
    };
    var bindListener = function() {
        $node.delegate(".js-page-btn",'click',onPageBtnClickHandler);
        $pageJump.on("click",pageJumpBtnClickHandler);
        $node.delegate(".js-invite-btn","click",onInviteBtnClickHandler);
        $node.delegate(".js-queue-tab","click",onTabClickHandler);
        $refreshBtn.on("click", function() {
            fetchData();
        });
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
