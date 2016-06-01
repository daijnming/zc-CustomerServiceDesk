/**
 * @author Treagzhao
 */
function Toast(core,spec) {
    var global = core.getGlobal();
    var $outer;
    var width = 500;
    var timer;
    var conf = $.extend({
        'icon' : 'alert',
        'text' : "（空）",
        "" : ""
    },spec);
    var url = {
        'alert' : global.scriptPath + 'img/replyResendActive.png'
    };

    var show = function() {
        var img = url[conf.icon];
        var template = '<div class="zc-toast">' + '<img src="' + img + '" />' + '<span>' + conf.text + '</span>' + '<button class="">×' + '</button>' + '</div>';
        $outer = $(template);
        var outerWidth = $(window).outerWidth();
        var left = (outerWidth - width) / 2;
        $outer.css({
            'left' : left > 0 ? left : 0
        });
        $(document.body).append($outer);
        $outer.find("button").on("click", function() {
            clearTimeout(timer);
            hide();
        });
    };

    var hide = function() {
        $outer.remove();
    };

    show();
    timer = setTimeout(hide,3000);
    this.show = show;
};

module.exports = Toast;
