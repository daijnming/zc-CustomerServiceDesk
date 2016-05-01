(function(node) {
	var core = require('./Core/core.js')();
	var LeftSide = require('./leftside/index.js');
	var Promise = require('./util/promise.js');
	var parseDOM = function() {
	};

	var bindListener = function() {
	};

	var initPlugins = function() {
		LeftSide($("section#left-navigation")[0],core,window);
	};

	var init = function() {
		parseDOM();
		bindListener();
		initPlugins();
	};

	init();

})(document.body);
