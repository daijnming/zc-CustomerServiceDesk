(function(node) {
    var core = require('./Core/core.js')(window);
    var LeftSide = require('./leftside/index.js');
    var RightSide = require('./rightside/main.js');
    var TextArea = require('./textarea/index.js');
    var ChatList = require('./chatlist/index.js');
    var Promise = require('./util/promise.js');
    var Modal = require('./util/modal/dialog.js');
    var fileLoader = require('./util/load.js')();
    var parseDOM = function() {
    };

    var initPlugins = function() {
        var height = ($(window).outerHeight());
        $("#main-container").height($(window).outerHeight());
        $("#chatlist").height(height);
        LeftSide($("section#left-navigation")[0],core,window);
        RightSide($('.rightBox')[0],core,window);
        TextArea($('.TextArea')[0],core,window);
        ChatList($('#chatlist'), core, window);
    };
    var bindListener = function() {
        $(window).on("resize", function(e) {
            var height = ($(window).outerHeight());
            $("#main-container").height($(window).outerHeight());
            $("#chatlist").height(height);
        });
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();

})(document.body);
