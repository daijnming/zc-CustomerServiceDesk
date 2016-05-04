function polling(global) {
	var eventCache = {};
	var on = function(evt,cbk) {
		eventCache[evt] = cbk;
	};

	var messageAdapter = function(ret) {
		var arr = [];
		for(var i = 0;i < ret.length;i++) {
			var obj = JSON.parse(ret[i]);
			console.log(obj);
			arr.push(obj);
		}
		return arr;
	};

	var start = function() {
		$.ajax({
			'url' : '/chat/admin/msg.action',
			'dataType' : "json",
			'type' : "get",
			'data' : {
				'puid' : global.puid,
				'uid' : global.id
			}
		}).success(function(ret) {
			var arr = messageAdapter(ret);
			eventCache['receive'] && eventCache['receive'](arr);
		}).fail(function(ret,err) {
		});
		setTimeout(start,2000);
	};

	this.on = on;
	this.start = start;
}

module.exports = polling;
