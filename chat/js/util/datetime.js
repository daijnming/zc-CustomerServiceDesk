/**
 * @author Treagzhao
 */
var that = {};

var numberFormat = function(num) {
    return num >= 10 ? num + "" : "0" + num;
};
var getTime = function(date) {
    if(Object.prototype.toString.call(date).indexOf("Date") < 0) {
        throw 'param error';
    }
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var arr = [numberFormat(hour),numberFormat(minute),numberFormat(second)];
    return arr.join(":");
};

that.getTime = getTime;
module.exports = that;
