/**
 * @author Treagzhao
 */
var TYPE_EMOTION = 0,
    TYPE_IMAGE = 1,
    TYPE_TEXT = 2,
    AUDIO = 3,
    RICH_TEXT = 4;
var normalMessageAdapter = function(value) {
    var content = value.content || value.answer;
    var reg = /src=['"](.*?)['"]/;
    if(content.indexOf("<img") >= 0) {
        if(content.indexOf("webchat_img_face") >= 0) {
            value.message_type = TYPE_EMOTION;
            value.desc = '[表情]';
        } else if(content.indexOf("webchat_img_upload") >= 0) {
            value.message_type = TYPE_IMAGE;
            value.desc = '[图片]';
        } else if(content.indexOf("<a")) {
            console.log("富文本");
            value.message_type = RICH_TEXT;
            value.desc = '[富文本]';
        }
        if(reg.test(content)) {
            value.url = RegExp.$1;
        }
    } else if(content.indexOf("<audio") >= 0) {
        value.message_type = AUDIO;
        value.desc = '[语音]';
    } else if(content.indexOf("<a") >= 0) {
        console.log("富文本");
        value.message_type = RICH_TEXT;
        value.desc = '[富文本]';
    } else {
        value.message_type = TYPE_TEXT;
        value.desc = content;
    }
};

module.exports = normalMessageAdapter;
