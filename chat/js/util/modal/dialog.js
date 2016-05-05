/**
 * @author Treagzhao
 */
function Dialog(spec) {
    var template = require('./template.js');
    var $layer,
        $outer;
    var conf = $.extend({
        "okText" : "确定",
        "title" : "提示"
    },spec);
    var initDOM = function() {
        $layer = $(template.zcShadowLayer);
        var _html = doT.template(template.zcModalOuter)(conf);
        $outer = $(_html);
    };

    var setInner = function(elm) {
        $outer.find(".modal-body").append($(elm));
    };
    var hide = function() {
        $layer.find(".fade.in").animate({
            'opacity' : 0
        },300, function() {
            setTimeout(function() {
                $layer.remove();
            },100);
        });
    };

    var bindListener = function() {
        $layer.on("click",hide);
        $outer.on("click", function(evt) {
            evt.stopPropagation();
        });
        $outer.delegate(".bootbox-close-button",'click',hide);
        $outer.delegate(".js-cancel-btn","click", function(e) {
            conf.cancel && conf.cancel();
            hide();
        });
    };
    var show = function() {
        initDOM();
        bindListener();
        $layer.append($outer);
        $(document.body).append($layer);
        $layer.find(".fade.in").animate({
            'opacity' : 1
        },300);
    };

    this.setInner = setInner;
    this.show = show;
    this.hide = hide;
}

module.exports = Dialog;
