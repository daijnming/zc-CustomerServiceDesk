/**
 * @author Treagzhao
 */
function HeartBeat(core) {
    var global = core.getGlobal();
    var count = 0;
    var TEN_SECOND = 10 * 1000;
    var send = function() {
        $.ajax({
            'url' : '/chat/admin/msgt.action',
            'type' : 'post',
            'data' : {
                'pid' : global.pid,
		'token':+new Date(),
                'uid' : global.id
            },
            'dataType' : 'json'
        }).success(function() {
            setTimeout(send,TEN_SECOND);
        }).fail(function(ret) {
            count++;
            if(count >= 6) {
                $(document.body).trigger("emergency.netclose");
            } else {
                setTimeout(send,TEN_SECOND);
            }
        });
    };

    this.start = function() {
        send();
    };
};

module.exports = HeartBeat;
