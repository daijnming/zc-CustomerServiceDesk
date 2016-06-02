/*
 * @author denzel
 */

function RightSide(node,core,window) {
    var global = core.getGlobal();
    var config = {
        version : '5.0',//chat项目重构 5.0版本
        isShowBg : true //是否有用户在线 用于判断用户资料字段是否显示
    };
    config.id = global.id;
    //url_id

    var tapLastUserData;
    //最后一次点击用户列表事件

    //左侧用户点击保存右侧相应tab选项卡
    var switchPreferenceLibrary = [],//存储用户偏好设置
        switchDefaultLibrary = {};
    //存储模块默认设置

    var height = $(window).height(),
        newHeight = $(window).height() - 50;

    //TODO 预加载对象
    var tabSwitchNav,//右侧上方UL元素
        tabSwitchBody,//右侧对应内容展示区
        tabInput;
    //智能回复搜索框

    //TODO 模板/js/资源引用
    var profileuser = require('./profileuser/index.js');
    var messageUser = require('./messagesuser/index.js');
    var homeuser = require('./homeuser/index.js');
    var client = require('./clientsystems/index.js');

    var newUserMessage = function(data) {
        var _html = doT.template(template.listItem)(data);
        var li = $(_html);
        $(node).find(".js-users-list").append(li);
    };
    var onReceive = function(value,data) {
        if(data.type == 102) {
            newUserMessage(data);
        }
    };

    var onloadHandler = function(evt,data) {
        //用户资料
        $(node).find('.js-tab-pane-profileuser').css('height',newHeight - 52 + 'px');
        //快捷回复
        $(node).find('.js-rightQuickLeft').css('height',newHeight - 80 - 52 + 'px');
        $(node).find('.js-rightQuickRight').css('height',newHeight - 80 - 52 + 'px');
        //智能回复得高度
        $(node).find('.js-tab-pane-homeuser .js-homeUserBox').css('height',newHeight - 52 - 40 - 52 + 'px');
        //iframe
        $(node).find('.js-clientSysIframe').css('height',newHeight - 52 + 'px');
    };
    //tab切换
    var onSetSwitchTab = function(obj,val) {
        var $this = $(obj);
        if($this.attr('id') == 'profileuser') {
            if(config.isShowBg) {
                $(node).find('.js-panel-body').addClass('showBg');
            } else {
                $(node).find('.js-panel-body').removeClass('showBg');
            }
        } else {
            $(node).find('.js-panel-body').removeClass('showBg');
        }
        //自定义iframe 隐藏菜单
        if($this.attr('id') != 'clientSystem') {
            $(node).find('.js-dropdown-menu').removeClass('show').animate({
                'margin-top' : -200
            },500);
        }
        var oId = $this.attr('id');
        $(tabSwitchBody).find('.js-tab-pane').each(function(i,v) {
            if($(v).attr('id') == oId.toString()) {
                $(v).addClass('active in').siblings('div').removeClass('active in');
            }
        });
        $this.addClass('active').siblings('li').removeClass('active');
        //智能回复赋值
        var oInput = $(tabSwitchBody).find('.js-tab-pane#homeuser .js-searchBot input');
        $(oInput).val(val);
    };

    //设置用户偏好设置
    var setPreferenceInfo = function() {
        var curTabId = $(this).attr('id'),//当前点击的id
            _val = '';
        if(tapLastUserData) {
            for(var i = 0;i < switchPreferenceLibrary.length;i++) {
                var _tmp = switchPreferenceLibrary[i];
                if(_tmp['uid'] == tapLastUserData.uid) {
                    //设置id
                    var oInput = $(tabSwitchBody).find('.js-tab-pane#homeuser .js-searchBot input');
                    _tmp['item']['zIndex'] = curTabId;
                    _val = $(oInput).val();
                    _tmp['item']['homeuser'] = _val;
                }
            }
        }
        onSetSwitchTab($(this),_val);
    };
    //获取用户偏好设置
    var getPreferenceInfo = function(uid) {
        var that,
            oInput = $(tabSwitchBody).find('.js-tab-pane#homeuser .js-searchBot input'),
            _val = $(oInput).val();

        for(var i = 0;i < switchPreferenceLibrary.length;i++) {
            var item = switchPreferenceLibrary[i];
            if(item['uid'] == uid) {
                _val = item['item']['homeuser'];
                $(tabSwitchNav).find('.js-menu').each(function(i,o) {
                    if($(o).attr('id') == item['item']['zIndex']) {
                        onSetSwitchTab($(o),_val);
                        $(document.body).trigger('rightside.onTabSwitch', {
                            'data' : _val
                        });
                    }
                });
            }
        }
    };

    //点击用户存储默认设置到用偏好设置里
    var onSetRightPreferenceInfo = function(uid) {
        var zIndex = $($(tabSwitchNav).find('li')[0]).attr('id');
        var _boo = true;
        if(uid) {
            for(var i = 0;i < switchPreferenceLibrary.length;i++) {
                var _tmp = switchPreferenceLibrary[i];
                if(_tmp['uid'] == uid) {
                    _boo = false;
                    return;
                }
            }
            if(_boo) {
                var obj = {
                    uid : uid,
                    item : {
                        zIndex : zIndex,//默认选中第一个
                        'profileuser' : '',
                        'messagesuser' : '',
                        'homeuser' : '',
                        'clientSystem' : ''
                    }
                };
                switchPreferenceLibrary.push(obj);
            }
        }
    };
    var setUid = function() {
        for(var i = 0;i < switchPreferenceLibrary.length;i++) {
            if(tapLastUserData.uid == switchPreferenceLibrary[i]['uid']) {
                var val = $(tabSwitchBody).find('.js-tab-pane#homeuser .js-searchBot input').val();
                switchPreferenceLibrary[i]['item']['homeuser'] = val;
            }
        }
    };
    //输入框失去焦点
    var onGetSearch = function(evn) {

        if(evn.keyCode == 13) {
            setUid();
        }
    };
    var onGetSearch1 = function() {
        setUid();
    };
    var initData = function(data,userData) {
        config.isShowBg = false;
        //初始化用户数据 -- 客户资料
        profileuser($('.js-tab-pane#profileuser'),core,userData);
        //初始化用户自定义配置
        client(node,core,userData);
        //获取用户偏好设置
        onSetRightPreferenceInfo(userData.data.uid);
        getPreferenceInfo(userData.data.uid);
        tapLastUserData = userData.data;
        //隐藏用户资料背景
        $(node).find('.js-panel-body').removeClass('showBg');
    };
    //隐藏用户资料
    var onHideProfileInfo = function() {
        config.isShowBg = true;
        //是否显示用户资料模块背景图片
        $(node).find('.js-panel-body').addClass('showBg').find('.js-tab-pane#profileuser').html('');
    };
    var parseDOM = function() {
        tabSwitchNav = $(node).find('.js-panel-body .js-nav-tabs');
        tabSwitchBody = $(node).find('.js-panel-body .js-tab-content');
        $(node).find('.js-panel-body').addClass('showBg');
        tabInput = $(tabSwitchBody).find('.js-tab-pane#homeuser .js-searchBot');
    };

    var bindListener = function() {
        $(window).on('core.onload',onloadHandler);
        $(document.body).on('leftside.onselected',initData);
        $(document.body).on('leftside.onhide',onHideProfileInfo);
        $(tabSwitchNav).on('click','.js-menu',setPreferenceInfo);
        $(tabInput).delegate('input','keyup',onGetSearch);
        $(tabInput).delegate('input','blur',onGetSearch1);
    };

    var initPlugsin = function() {
        messageUser(node,core,config);
        homeuser(node,core,config);
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugsin();
    };
    $(document.body).on("core.onload", function(evt) {
        init();
    });
}

module.exports = RightSide;
