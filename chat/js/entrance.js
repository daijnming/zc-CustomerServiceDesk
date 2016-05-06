(function(node) {
	var core = require('./Core/core.js')(window);
	var LeftSide = require('./leftside/index.js');
	var RightSide = require('./rightside/index.js');
	var Promise = require('./util/promise.js');
	var Modal = require('./util/modal/dialog.js');
	var dialog = new Modal();
	dialog.show();
	var parseDOM = function() {
	};

    var parseDOM = function() {
    };

	var initPlugins = function() {
		var height = ($(window).outerHeight());
		$("#main-container").height($(window).outerHeight());
		$("#chatlist").height(height);
		LeftSide($("section#left-navigation")[0],core,window);
		RightSide($('.rightBox'),core,window);
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
