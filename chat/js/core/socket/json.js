function polling(global) {
    var eventCache = {};
    var unicode = require('../../util/unicode.js');
    var success = true;
    var defaultParams = {
        answer : "",
        answerType : "",
        cid : "",
        docId : "",
        pid : "",
        questionId : "",
        uid : ""
    };
    var $body;
    var DURATION = 2000;

    var on = function(evt,cbk) {
        eventCache[evt] = cbk;
    };

    /**
     *将图片消息的a标签去掉
     * @param {Object} data
     */
    var imageMessageFilter = function(data) {
        var $div = $("<div></div>");
        $div.html(data.answer);
        if($div.find("img.webchat_img_upload").length > 0) {
            var $img = $div.find("img.webchat_img_upload");
            var parent = $img.parent()[0];
            if(parent && parent.tagName.toLowerCase() == 'a') {
                $img.removeClass("upNowImg").removeClass("uploadedFile");
                var content = $img.parent().html();
                return content.replace('>','/>');
            } else {
                return data.answer;
            }
        } else {
            return data.answer;
        }
    };

    var onsend = function(evt,data,count) {
        var count = count || 0;
        var content = imageMessageFilter(data);
        $.ajax({
            'url' : '/chat/admin/send1.action',
            'dataType' : 'json',
            'type' : "post",
            'data' : $.extend(defaultParams, {
                'answer' : content,
                'cid' : data.cid,
                'uid' : global.id,
                'token' : +new Date()
            })
        }).success(function(res) {
            setTimeout(function() {
                $body.trigger("core.sendresult",[{
                    'token' : data.date,
                    'type' : "success",
                    'uid' : data.uid
                }]);
            },10);

        }).fail(function() {
            if(count == 3) {
                setTimeout(function() {
                    $body.trigger("core.sendresult",[{
                        'token' : data.date,
                        'type' : "fail",
                        'uid' : data.uid
                    }]);
                },10);
            } else {
                setTimeout(function() {
                    onsend(evt,data,count + 1);
                },1000);
            }
        });
    };

    var onDirectSend = function(evt,ret,count) {
        var count = count || 0;
        if(ret.data.status == 1) {
            $.ajax({
                'url' : '/chat/admin/send1.action',
                'dataType' : 'json',
                'type' : "post",
                'data' : $.extend(defaultParams, {
                    'answer' : ret.data.msg,
                    'docId' : ret.data.docid || '',
                    'answerType' : ret.data.docid && ret.data.docid.length ? ret.data.docid : '',
                    'cid' : ret.data.cid,
                    'uid' : global.id
                })
            }).success(function() {
                setTimeout(function() {
                    $body.trigger("core.sendresult",[{
                        'token' : data.date,
                        'type' : "success",
                        'uid' : data.uid
                    }]);
                },10);
            }).fail(function() {
                if(count == 3) {
                    setTimeout(function() {
                        $body.trigger("core.sendresult",[{
                            'token' : data.date,
                            'type' : "fail",
                            'uid' : data.uid
                        }]);
                    },10);
                } else {
                    setTimeout(function() {
                        onDirectSend(evt,ret,count + 1);
                    },1000);
                }
            });
        }
    };

    var bindListener = function() {
        $body.on("textarea.send",onsend);
        $body.on("rightside.onChatSmartReply",onDirectSend);
    };

    var messageAdapter = function(ret) {
        var arr = [];
        if(!ret)
            return arr;
        for(var i = 0;i < ret.length;i++) {
            var obj = null;
            if( typeof ret[i] === 'string') {
                obj = JSON.parse(ret[i]);
            } else {
                obj = ret[i];
            }
            arr.push(obj);
        }
        return arr;
    };

    var start = function() {
        $.ajax({
            'url' : '/chat/admin/msg.action',
            'dataType' : "json",
            'type' : "POST",
            'data' : {
                'puid' : global.puid,
                'uid' : global.id,
                'token' : +new Date()
            }
        }).success(function(ret) {
            // console.log(ret);
            if(!ret || ret.length == 0) {
                return;
            }
            var arr = messageAdapter(ret);
            eventCache['receive'] && eventCache['receive'](arr);
            DURATION = 2000;
        }).fail(function(ret,err) {
            DURATION = 10 * 1000;
        });
        setTimeout(start,DURATION);
    };

    var parseDOM = function() {
        $body = $(document.body);
    };

    var init = function() {
        parseDOM();
        bindListener();
    };

    init();

    this.on = on;
    this.start = start;
}

module.exports = polling;
