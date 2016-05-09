/**
 *
 * @author Treagzhao
 */

function Item(data,core,outer) {
    var node,
        $node;
    var global = core.getGlobal();
    var baseUrl = global.baseUrl;
    var loadFile = require('../util/load.js')();
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
        $.ajax({
            'url' : '/chat/admin/leave.action',
            'data' : {
                'cid' : data.cid,
                'uid' : global.id,
                'userid' : data .uid
            },
            'type' : 'post',
            'dataType' : "json"
        }).success(function(ret) {
            console.log(ret);
        });
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
