function LeftSide(node,core,window){

	
	var parseDOM = function(){

	};

	var onloadHandler = function(evt,data){
			console.log(data);
			$(node).find("img.js-my-logo").attr("src",data.face);
			$(node).find(".js-customer-service").html(data.name);
	};

	var bindLitener = function(){
		$(document.body).on("core.onload",onloadHandler);
	};

	var initPlugsin = function(){

	};

	var init = function(){
			parseDOM();
			bindLitener();
			initPlugsin();
	};

	init();

};


module.exports = LeftSide;
