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
    var userSize = [0,0];
    var $node,
        $totalpage,
        $currentPage,
        $pageJump,
        $countSize,
        $refreshTime,
        $waitSize,
        $visitSize,
        $refreshBtn,
        $tableOuter,
        $input;
    var urlList = ['/chat/admin/queryUser.action','/chat/admin/queryVisitUser.action'];

    var TEMPLATELIST = ['views/leftside/queueitem.html','views/leftside/visitqueue.html'];
    var totalPage,
        currentPage = 1;
    this.token = +new Date();

    var onTabClickHandler = function(e) {
        var elm = e.currentTarget;
        var index = $(elm).attr("data-index");
        currentPage = 1;
        currentTab = index;
        $(elm).addClass("active").siblings().removeClass("active");
        fetchData();
    };

    var initContent = function(data,promise) {
        var html = data.html;
        var ret = data.data;
        ret.isInvite = global.isInvite;
        userSize[currentTab] = ret.waitSize;
        totalPage = ret.countPage;
        ret.currentTime = dateTimeUtil.getTime(new Date());
        var _html = doT.template(html)(ret);
        dialog.setInner(_html);
        dialog.show();
        $node = $(dialog.getOuter());
        parseDOM();
        bindListener();
        setTimeout(promise.resolve,0);
        return promise;
    };

    var fetchData = function() {
        loadFile.load(global.baseUrl + TEMPLATELIST[currentTab]).then(getQueryUsers).then(function(ret,promise) {
            totalPage = ret.data.countPage;
            var arr = ['waitSize','visitSize'];
            var btns = [$waitSize,$visitSize];
            var key = ret.data[arr[currentTab]];
            if( typeof key === 'number') {
                btns[currentTab].html(key);
                userSize[currentTab] = key;
                $countSize.text(key);
            }
            $totalpage.html(totalPage);
            $currentPage.html(totalPage == 0 ? 0 : currentPage);
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
        $waitSize = $node.find(".js-wait-size");
        $visitSize = $node.find(".js-visit-size");
        $countSize = $node.find(".js-count-size");
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
        }).success(function(ret) {
            if(ret.status == 1) {
                userSize[currentTab];
                $node.find(".js-size-btn").eq(currentTab).html(--userSize[currentTab]);
                $(elm).html('已邀请').addClass('disabled').css({
                    'color' : '#808080'
                });
            }
        }).fail(function(ret,err) {
            $(elm).html('失败').addClass('disabled').css({
                'color' : '#808080'
            });
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
            'title' : '邀请会话',
            'footer' : false
        });
        loadFile.load(global.baseUrl + "views/leftside/queuelist.html").then(function(value,promise) {
            return getQueryUsers(value,promise);
        }).then(initContent).then(function() {
            $.ajax({
                'url' : urlList[1],
                'dataType' : 'json',
                'data' : {
                    'uid' : global.id,
                    'status' : 1,
                    'pageNow' : 1
                },
                'type' : "post"
            }).success(function(ret) {
                userSize[1] = ret.visitSize;
                $node.find(".js-size-btn").eq(1).html(ret.visitSize);
            });
        });
    };

    var init = function() {
        initPlugins();
    };
    init();
}

module.exports = Queue;
