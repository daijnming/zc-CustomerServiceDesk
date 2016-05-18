(function(node) {
    var core = require('./core/core.js')(window);
    var LeftSide = require('./leftside/index.js');
    var RightSide = require('./rightside/main.js');
    var TextArea = require('./textarea/index.js');
    var ChatList = require('./chatlist/index.js');
    var ScrollContent = require('./scrollcontent/index.js');
    var Promise = require('./util/promise.js');
    var Modal = require('./util/modal/dialog.js');
    var fileLoader = require('./util/load.js')();
    var TOOLBARHEIGHT = 50;
    var parseDOM = function() {
    };

    var initPlugins = function() {
        var height = ($(window).outerHeight()) - TOOLBARHEIGHT;
        $("#main-container").height(height);
        $("#chatlist").height(height);
        $("#left-navigation").height(height);
        LeftSide($("section#left-navigation")[0],core,window);
        RightSide($('.rightBox')[0],core,window);
        TextArea($('.js-TextArea'),core,window);
        ChatList($('#chatlist'),core,window);
        ScrollContent($('#chatlist'),core,window);
    };
    var bindListener = function() {
        $(window).on("resize", function(e) {
            var height = ($(window).outerHeight()) - TOOLBARHEIGHT;
            $("#main-container").height(height);
            $("#chatlist").height(height);
            $("#left-navigation").height(height);
        });
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();

})(document.body);
