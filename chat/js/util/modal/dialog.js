/**
 * @author Treagzhao
 */
function Dialog() {
	var template = require('./template.js');
	var layer = $(template.zcShadowLayer);
	var show = function() {
		$(document.body).append(layer);
		console.log("aaaa");
	};
	this.show = show;
}

module.exports = Dialog;
