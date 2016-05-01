(function(node) {
	var core = require('./Core/core.js')();
	console.log(core);
	var Promise = require('./util/promise.js');
	var parseDOM = function() {
	};

	var bindListener = function() {
	};

	var initPlugins = function() {

	};

	var init = function() {
		parseDOM();
		bindListener();
		initPlugins();
	};

	init();

})(document.body);
