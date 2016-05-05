function Core(window) {
	var that = {};
	var token = '';
	var queryParam;
	var polling = require('./socket/json.js');
	var Promise = require('../util/promise.js');
	var socket;
	var global = {};

	var basicInfoHandler = function(value,promise) {
		token = value.token || window.sessionStorage.getItem('temp-id');
		promise.resolve({});
	};

	/**
	 * 将url里面query字符串转换成对象
	 */
	var getQueryParam = function() {
		var href = location.href;
		var queryString = href.substring(href.lastIndexOf("?") + 1);
		if(queryString.lastIndexOf("#") >= 0) {
			queryString = queryString.substring(0,queryString.lastIndexOf("#"));
		}
		var list = queryString.split("&");
		var param = {};
		for(var i = 0;i < list.length;i++) {
			var item = list[i];
			var key = item.substring(0,item.indexOf("="));
			var value = item.substring(item.indexOf("=") + 1);
			if(/^-?(\d+)(\.\d+)?$/.test(value)) {
				param[key] = Number(value);
			} else if(value === 'true') {
				param[key] = true;
			} else if(value === 'false') {
				param[key] = false;
			} else {
				param[key] = value;
			}
		}
		return param;
	};

	var getMessage = function() {
		socket.start();
	};

	var initBasicInfo = function() {
		Promise.when(function() {
			var promise = new Promise();
			$.ajax({
				'url' : 'getEnvironment',
				'data' : {
				},
				'dataType' : 'json'
			}).success(function(ret) {
				promise.resolve({
					'token' : ret.token
				});
			}).fail(function(ret) {
				promise.reject({
					'token' : null
				});
			});
			return promise;
		}).then(basicInfoHandler,basicInfoHandler).then(function(value,promise) {
			$.ajax({
				'url' : '/chat/admin/connect.action',
				'dataType' : 'json',
				'type' : 'get',
				'data' : {
					'uid' : queryParam.id,
					'way' : 1,
					'st' : queryParam.st || 1,
					'lt' : queryParam.lt || new Date().getTime(),
					'token' : token
				}
			}).done(function(ret) {
				if(ret.status == 1) {
					for(var el in ret) {
						global[el] = ret[el];
					}
					$(".js-loading-layer").hide();
					promise.resolve(ret);
				}else if(ret.status == -2){
					alert('登录失败');
					window.close();
				}
			});
		}).then(function(value,promise) {
			$(document.body).trigger("core.onload",[global]);
			getMessage();
		});
	};

	var getGlobal = function() {
		return global;
	};

	var parseDOM = function() {
	};

	var bindListener = function() {
	};

	var socketFactory = function() {
		if(window.WebSocket && false) {

		} else {
			socket = new polling(global);
		}

		socket.on("receive", function(value) {
			$(document.body).trigger('core.receive',value);
		});
	};

	var initPlugins = function() {
		queryParam = getQueryParam();
		for(var el in queryParam) {
			global[el] = queryParam[el];
		}
		initBasicInfo();
		socketFactory();
	};

	var init = function() {
		parseDOM();
		bindListener();
		initPlugins();
	};

	init();

	that.getQueryParam = getQueryParam;
	that.getGlobal = getGlobal;
	return that;
}

module.exports = Core;
