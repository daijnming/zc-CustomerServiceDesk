/**
 * @author Treagzhao
 */
function toTop($listOuter,$item,callback) {
    var $nextItem,
        $firstItem;
    var length = $listOuter.find(".js-detalBar").length;
    var index = $item.index(),
        height = $item.outerHeight();
    var DURATION = 300;
    var checkArgs = function() {
        return $item.index() !== 0;
    };

    var parseDOM = function() {
        $firstItem = $listOuter.find(".js-detalBar").eq(0);
        $nextItem = $listOuter.find(".js-detalBar").eq(index + 1);
    };

    var start = function() {
        $firstItem.animate({
            'marginTop' : height
        },DURATION);
        $item.animate({
            'top' : 0
        },DURATION, function() {
            $item.insertBefore($firstItem).find(".js-upLeftGroup").addClass("hide");
            $listOuter.css({
                'paddingBottom' : 0
            });
            $item.css({
                'position' : '',
                'top' : 0
            });
            $nextItem.css({
                'marginTop' : 0
            });
            $firstItem.css({
                'marginTop' : 0
            }).find(".js-upLeftGroup").removeClass("hide");
            callback && callback();
        });
        $nextItem.animate({
            'marginTop' : 0
        },DURATION);
    };

    var initPosition = function() {
        var pos = $item.position();
        $item.css({
            'position' : 'absolute',
            'top' : pos.top
        });
        $nextItem.css({
            'marginTop' : height
        });
        if(index == length - 1) {
            //最后一项
            $listOuter.css({
                'paddingBottom' : height
            });
        }
    };

    var init = function() {
        if(!checkArgs()) {
            throw 'the first node could not be top';
        }
        parseDOM();
        initPosition();
        start();
    };

    init();
};

module.exports = toTop;
