/**
 * @author Treagzhao
 */
function HeartBeat() {
    var count = 0;
    var TEN_SECOND = 10 * 1000;
    var send = function() {
        $.ajax({
            'url' : '/chat/admin/msgt.action',
            'type' : 'post',
            'data' : {},
            'dataType' : 'json'
        }).success(function() {
            setTimeout(send,1000,TEN_SECOND);
        }).fail(function(ret) {
            count++;
            if(count >= 6) {
                $(document.body).trigger("emergency.netclose");
            } else {
                setTimeout(send,1000,TEN_SECOND);
            }
        });
    };

    this.start = function() {
    };
};

module.exports = HeartBeat;
