/**
 * @author Treagzhao
 */
function Transfer(core,userInfo,callback) {
    var Dialog = require('../util/modal/dialog.js');
    var Toast = require('../util/modal/toast.js');
    var Promise = require('../util/promise.js');
    var _self = this;
    var global = core.getGlobal();
    var loadFile = require('../util/load.js')();
    var dateUtil = require("../util/date.js");
    var $outer;
    var loadingTemplate = '<li class="blank"><img src="img/static/loading.gif" /></li>';
    var $ulOuter,
        $refreshTime,
        $clearBtn;
    var timer;
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

    var columnKeyClickHandler = function(e) {
        var elm = e.currentTarget;
        var key = $(elm).attr("data-type");
        var hiden = $(elm).attr("data-hiden");
        if(hiden === 'true') {
            return;
        }
        if(key !== sortKey) {
            sortKey = key;
            sortType = 1;
        } else {
            sortType = (sortType + 1) % 2;
            if(sortType == 0)
                sortType == 2;
        }
        $outer.find(".sort").removeClass("up").removeClass("down");
        var $sort = $(elm).find(".sort");
        $sort.addClass((sortType == 1 ) ? 'up' : 'down');
        fetchData();
    };

    var searchIconClickHandler = function(e) {
        var $elm = $(this);
        var input = $outer.find("input");
        keyword = input.val();
        fetchData();
    };

    var fetchData = function(value,promise) {
        var promise = promise || new Promise();
        $ulOuter.html(loadingTemplate);
        $.ajax({
            'url' : '/chat/admin/getOhterAdminList.action',
            'data' : {
                'uid' : global.id,
                'orderName' : sortKey,
                'order' : sortType,
                'keyword' : keyword
            },
            'dataType' : 'json',
            'type' : 'get'
        }).success(function(ret) {
            loadFile.load(global.baseUrl + 'views/scrollcontent/transferlist.html').then(function(html) {
                $refreshTime.text(dateUtil.formatTime(new Date()));
                var _html = doT.template(html)({
                    'list' : ret,
                    'keyword' : keyword
                });
                $ulOuter.html(_html);
            });
        }).fail(function(ret,err) {
        });
        return promise;
    };

    var inputKeyUpHandler = function(evt) {
        if(evt.keyCode == 13) {
            evt.preventDefault();
            keyword = $outer.find("input").val();
            fetchData();
        }
    };
    var inputChangeHandler = function(e) {
        var $elm = $(this);
        if($elm.val().length > 0) {
            $clearBtn.show();
        } else {
            $clearBtn.hide();
        }
        clearTimeout(timer);
        timer = setTimeout(function() {
            keyword = $elm.val();
            fetchData();
        },500);
    };

    var getDefaultParam = function() {
        if(window.localStorage) {
            sortType = (window.localStorage.sortType) || sortType;
            sortKey = window.localStorage.sortKey || sortKey;
        }
    };

    var clearBtnClickhandler = function() {
        $(this).hide();
        $outer.find("input").val('');
        keyword = '';
        fetchData();
    };

    var parseDOM = function() {
        $outer = $(_self.getOuter());
        $refreshTime = $outer.find(".js-refresh-time");
        $ulOuter = $outer.find(".js-list-detail");
        $clearBtn = $outer.find(".js-clear-btn");
    };

    var transferBtnClickHandler = function(e) {
        var elm = e.currentTarget;
        var uname = $(elm).attr("data-uname");
        var joinId = $(elm).attr("data-uid");
        if($(elm).hasClass("disabled")) {
            return;
        }
        $(elm).addClass("disabled").html('转接中...');
        $.ajax({
            'url' : '/chat/admin/transfer.action',
            'data' : {
                'uid' : global.id,
                'cid' : userInfo.cid,
                "joinUid" : joinId,
                'userId' : userInfo.userId
            },
            'dataType' : 'json',
            'type' : "POST"
        }).success(function(ret) {
            if(ret.status == 1) {
                $(elm).text("已转接");
                setTimeout(function() {
                    _self.hide();
                },500);
                callback && callback(joinId,uname,userInfo.userId);

            } else if(ret.status == 2) {
                //用户已经离线
                $(elm).text('用户已离线');
                new Toast(core, {
                    'icon' : 'alert',
                    'text' : '用户已离线，无法转接'
                });
                setTimeout(function() {
                    _self.hide();
                },2000);
            } else if(ret.status == 3) {
                //客服已经离线
                $(elm).text('客服已离线');
            }
        }).fail(function(ret) {
        });
    };
    var bindListener = function() {
        $outer.delegate(".js-transfer-btn","click",transferBtnClickHandler);
        $outer.delegate(".js-column-key",'click',columnKeyClickHandler);
        $outer.find(".js-refresh-btn").on("click",fetchData);
        $outer.find("input").on("input propertychange",inputChangeHandler);
        $outer.find("input").on("keyup",inputKeyUpHandler);
        $clearBtn.on("click",clearBtnClickhandler);
        $outer.find(".js-search-icon").on("click",searchIconClickHandler);
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
