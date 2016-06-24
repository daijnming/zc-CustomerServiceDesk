/**
 * @author Treagzhao
 */
var that = {};
var cache = [];
var push = function(arr) {
    for(var i = 0,
        len = arr.length;i < len;i++) {
        var item = arr[i];
        cache[item.msgId] = 1;
    }
};

var has = function(msgId) {
    return !!cache[msgId];
};

that.push = push;
that.has = has;

module.exports = that;
