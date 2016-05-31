/**
 * @author Treagzhao
 */
function Dialog(spec) {
    var template = require('./template.js');
    var $layer,
        $outer;
    var _self = this;
    var conf = $.extend({
        "okText" : "确定",
        "title" : "提示",
        'inner' : false,
        "OK" : function() {

        }
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
            conf.cancel && conf.cancel(_self);
            hide();
        });
        $outer.delegate(".js-ok-btn",'click', function(e) {
            hide();
            conf.OK && conf.OK(_self);
        });
    };

    var getOuter = function() {
        return $outer[0];
    };

    var show = function() {
        bindListener();
        $layer.append($outer);
        $(document.body).append($layer);
        $layer.find(".fade.in").animate({
            'opacity' : 1
        },300);
    };

    var init = function() {
        initDOM();
    };

    init();

    this.getOuter = getOuter;
    this.setInner = setInner;
    this.show = show;
    this.hide = hide;
}

module.exports = Dialog;
