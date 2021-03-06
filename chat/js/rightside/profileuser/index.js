/*
 * @author denzel.gou
 */

var initail = false;

var ProfileUser = function(node,core,userData) {
  // console.log(userData);
    //TODO
    var global = core.getGlobal();
    //全局对象
    var data = userData,
        config = {},
        regExUserInfo = [],//保存用户验证信息
        focusValue = '';
    //移入鼠标前保存
    //加载模版
    var loadFile = require('../../util/load.js')();
    var Promise = require('../../util/promise.js');
    var App = require('../../util/app.js');

    //TODO 处理对话页显示  此处只是页面显示 不影响页面重构 不需要使用模版
    var onVisitHandle = function(url,title) {
        if(!url && !title)
            return '-';
        var regexUrl = /^(https?)/;
        if(url) {
            if(!url.match(regexUrl))
                url = 'http://' + url;
        }
        if(url && !title) {
            return '<a target="_black"  class="js-aChat aChat" style="font-size:14px; color:#0d81c0;" href="' + url + '" title="' + url + '">' + url + '</a>';
        }
        if(!url && title) {
            return title;
        }
        return '<a target="_black" class="js-aChat aChat" style="font-size:14px;color:#0d81c0;" href="' + url + '" title="' + title + '">' + title + '</a>';
    };
    //初始化页面
    var initUserInfo = function() {
        var promise = new Promise();
        //有数据再添加dom
        if(data) {
            //客户资料背景清除
            $(node).html('').parents('.js-panel-body').removeClass('showBg');
            $(node).html('').parents('.js-panel-body .js-tab-profilebg').addClass('hide');
            loadFile.load(global.baseUrl + 'views/rightside/profileUser.html').then(function(value) {
                //组装对话页
                data.userData["visit"] = onVisitHandle(data.userData['visitUrl'],data.userData['visitTitle']);
                if( typeof data.userData['params'] === 'string') {
                    data.userData['params'] = $.parseJSON($('<div>' + data.userData['params'] + '</div>').html());
                }
                // console.log(data.userData['params']);
                var _html = doT.template(value)({
                    'item' : data
                });
                $(node).html(_html);
                //显示性别
                $(node).find('#sex').val(data.userData['sex']);
                promise.resolve();
            });
        }
        return promise;
    };
    //保存客户资料字段值
    var onTextSaveData = function(val,elm) {
        var uid = $(elm).attr("data-uid");
        var oUrl = '/chat/admin/modify_userinfo.action',
            sendData = {},
            type = $(elm).attr('otype'),
            reviceData = {};
        //通知左侧用户列表
        sendData.uid = uid;
        sendData.sender = config.url_id;
        if(type)
            sendData[type] = val;
        $.ajax({
            type : 'post',
            url : oUrl,
            data : sendData,
            dataType : 'json',
            success : function(data) {
                //去掉两端空格显示
                $(elm).val(val);

                reviceData.status = true;
                reviceData.uid = uid;
                //如果编辑的是姓名字段 则要传值给左侧栏显示
                if($(elm).hasClass('userNameDyy')) {
                    reviceData.name = val;
                    reviceData.update=1;
                } else {
                    reviceData.name = '';
                    reviceData.update=0;
                }
                // console.log(sendData);
                $(document.body).trigger('rightside.onProfileUserInfo',[{
                    'data' : reviceData
                }]);
            }
        });
    };
    var onTextBlurRegex = function() {
        var $this = $(this);
        if($this) {
            var val = $this.val().trim().replace(/[ ]/g,'');
            var _cur = regExUserInfo[$this.attr('otype')];
            // (function(_cur,val,$this){
            var _isRegexPass = true,//是否通过规则验证
                _isSubmit = false;
            //是否通过验证提交用户资料字段
            //判断值是否有改变 没改变就不提接口
            if(focusValue == val) {
                _isSubmit = false;
            } else {
                //正则匹配
                for(var i = 0;i < _cur.length;i++) {
                    var item = _cur[i];
                    if(!item.regex.test(val)) {
                        _isRegexPass = false;
                        //加警告框
                        $this.addClass('warm');
                        //重新赋值
                        $this.val(focusValue);
                        var $span = $this.siblings('.js-tip');
                        $span.find('.js-alerticon').text(item.alert);
                        var top = $this.offset().top - 68;
                        var left = 63;
                        $span.css({
                            left : left + 'px',
                            top : top + 'px'
                        }).addClass('show').on('click', function() {
                            $(this).removeClass('show');
                            $this.removeClass('warm');
                        });
                        break;
                    }
                }
            }
            if(_isRegexPass) {
                $this.siblings('.js-tip').removeClass('show').find('.js-alerticon').text('');
                $this.removeClass('warm');
                _isSubmit = true;
            }
            //保存 提接口
            if(_isSubmit) {
                onTextSaveData(val,$this);
            }
            // })(_cur,val,$this);
        }
    };
    var onTextFocusRegex = function() {
        focusValue = $(this).val();
        //全选
        $(this).select();
    };
    var onSelected = function() {
        var val = $(this).find('option:selected').val();
        onTextSaveData(val,$(this)[0]);
    };
    //对话页 url显示
    var onSessionUrl = function() {
        var ruler = $('.aChat');
        if(ruler.length > 0) {
            var chatWarpW = $('.js-chatWarp').width();
            var aChatW = $('.js-aChat').text($('.js-aChat').text())[0].offsetWidth;
            if(aChatW >= chatWarpW) {
                $('.js-chatWarpi').addClass('show');
            } else {
                $('.js-chatWarpi').removeClass('show');
            }
        }
    };
    //日期控件
    var onDatePicker = function() {
        $(node).find('#dp').datepicker().on('changeDate', function(ev) {
            var _date = ev.date;
            var _y,
                _m,
                _d;
            _y = _date.getFullYear();
            _m = _date.getMonth() + 1 < 10 ? '0' + (Number(_date.getMonth()) + 1) : _date.getMonth() + 1;
            _d = _date.getDate() < 10 ? '0' + _date.getDate() : _date.getDate();
            var _bir = _y + '-' + _m + '-' + _d;
            onTextSaveData(_bir,$(this)[0]);
        });
    };
    var bindLitener = function() {
        //	 $(node).on('blur','.js-userTnp',onTextBlurRegex);
        //	 $(node).on('focus','.js-userTnp',onTextFocusRegex);
        if(initail)
            return;
        $(node).delegate('.js-userTnp','blur',onTextBlurRegex);
        $(node).delegate('.js-userTnp','focus',onTextFocusRegex);
        $(node).delegate('.js-sex','change',onSelected);
        initail = true;
    };
    var initPlugsin = function() {
        onSessionUrl();
        onDatePicker();
    };
    var initConfig = function() {
        config.uid = data.data.uid;
        //用户id
        config.url_id = global.id;
        //url地址栏id
        regExUserInfo = {
            uname : [{
                'regex' : /\S/,
                alert : '格式错误，不允许为空'
            },{
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            },{
                'regex' : /^.{0,100}$/,
                'alert' : '最大输入100字符，请重新输入'
            }],
            realname : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            },{
                'regex' : /^.{0,32}$/,
                'alert' : '最大输入32字符，请重新输入'
            }],
            tel : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[0-9\-#*]*$/,
                'alert' : '只允许数字、“#”、“*”、“-”'
            },{
                'regex' : /(^[0-9\-#*]{8,30}$)|(^[0-9\-#*]{0}$)/,
                'alert' : '输入8-30字符，请重新输入'
            }],
            birthday : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[1-2][0-9]{3}\-(([0-2]{1}[0-9]{1})|(3[0-1]{1}))(\-([0-2]{1}[0-9]{1})|(3[0-1]{1}))$/,
                'alert' : '只允许数字、“-”'
            }],
            email : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '只允许字母、数字或下划线'
            },{
                'regex' : /^([a-zA-Z0-9]+([-_\.][a-zA-Z0-9]+)*(?:@(?!-))(?:(?:[a-zA-Z0-9]*)(?:[a-zA-Z0-9](?!-))(?:\.(?!-)))+[a-zA-Z0-9]{2,})$/,
                'alert' : '格式错误，请重新输入'
            },
            // {'regex':/(^[a-zA-Z0-9]{1,15}([-_\.][a-zA-Z0-9]{1,5})*(?:@(?!-))(?:(?:[a-zA-Z0-9]{0,10})(?:[a-zA-Z0-9](?!-))(?:\.(?!-))){1,10}[a-zA-Z0-9]{2,10}$)|(^[0-9]{0}$)/,'alert':'最大输入40字符，请重新输入'}
            {
                'regex' : /(^[-_\.a-zA-Z0-9]{1,16}(?:@(?!-))(?:(?:[a-zA-Z0-9]{0,10})(?:[a-zA-Z0-9](?!-))(?:\.(?!-))){1,2}[a-zA-Z0-9]{1,7}$)|(^[0-9]{0}$)/,
                'alert' : '最大输入40字符，请重新输入'
            }],
            qq : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            },{
                'regex' : /(^[1-9][0-9]{4,29}$)|(^[0-9]{0}$)/,
                'alert' : '输入5-30位数字，请重新输入'
            }],
            weixin : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            }],
            weibo : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            },{
                'regex' : /(^.{4,24}$)|(^[0-9]{0}$)/,
                'alert' : '输入4-24位字符，请重新输入'
            }],
            remark : [
            // {'regex':/\S/,alert:'格式错误，不允许为空'},
            {
                'regex' : /^[^<>//]*$/,
                'alert' : '格式错误，请重新输入'
            },{
                'regex' : /^.{0,200}$/,
                'alert' : '最大输入200字符，请重新输入'
            }]
        };
    };
    initUserInfo().then(function() {
        init();
    });
    var init = function() {
        initConfig();
        bindLitener();
        initPlugsin();
    };
};
module.exports = ProfileUser;
