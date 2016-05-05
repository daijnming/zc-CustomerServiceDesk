(function(node) {
	var core = require('./Core/core.js')(window);
	var LeftSide = require('./leftside/index.js');
	var Promise = require('./util/promise.js');
	var parseDOM = function() {
	};

	var bindListener = function() {
		$(window).on("resize", function(e) {
			var height = ($(window).outerHeight());
			$("#main-container").height($(window).outerHeight());
			$("#chatlist").height(height);
		});
	};

	var initPlugins = function() {
		var height = ($(window).outerHeight());
		$("#main-container").height($(window).outerHeight());
		$("#chatlist").height(height);
		LeftSide($("section#left-navigation")[0],core,window);
	};

	var init = function() {
		parseDOM();
		bindListener();
		initPlugins();
	};

	init();

})(document.body);
