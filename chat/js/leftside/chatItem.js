/**
 *
 * @author Treagzhao
 */

function Item(data,core,outer) {
    var node,
        $node;
    var global = core.getGlobal();
    var loadFile = require('../util/load.js');
    this.token = +new Date();

    var shake = function($elm) {
        var time = 10;
        for(var i = 0;i < 2;i++) {
            $elm.animate({
                'left' : 10
            });
        }
    };
    var onOffLine = function() {
        $node.find(".js-icon").addClass("offline");
        var $statusText = $node.find(".js-status");
        $statusText.css({
            'display' : 'inline-block'
        }).html('[离线]');
        shake($statusText);
    };
    var onRemove = function() {
        $node.animate({
            'height' : 0
        },300, function() {
            $node.remove();
        });
    };

    var initNode = function() {
        var elm = $(outer).find('li[data-cid="' + data.cid + '"]');
        if(elm.length > 0) {
            node = elm[0];
        } else {
            loadFile.load(global.baseUrl + "views/leftside/chatlist.html").then(function(value) {

            });
        }
        $node = $(node);
    };

    var parseDOM = function() {
        initNode();
    };
    var init = function() {
        parseDOM();
    };

    init();

    this.onRemove = onRemove;
    this.onOffLine = onOffLine;
};

module.exports = Item;
