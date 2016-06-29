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
                'token' : +new Date(),
                'uid' : global.id
            },
            'dataType' : 'json'
        }).success(function(ret) {
            if(ret.ustatus == 0) {
                //客服已离线
                $(document.body).trigger("emergency.netclose");
            }
        }).fail(function(ret) {
            count++;
            if(count >= 6) {
                $(document.body).trigger("emergency.netclose");
            }
        });
    };

    this.start = function() {
        setInterval(send,TEN_SECOND);
    };
};

module.exports = HeartBeat;
