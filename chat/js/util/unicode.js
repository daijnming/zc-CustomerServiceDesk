/**
 * @author Treagzhao
 */

var that = {};

that.parse = function(a) {
    a = a.replace(/\\/g,"%");
    return unescape(a);
};

that.stringify = function(d) {
    var c = [],
        a = d.length;
    for(var b = 0;b < a;++b) {
        c[b] = ("00" + d.charCodeAt(b).toString(16)).slice(-4);
    }
    return d ? "\\u" + c.join("\\u") : "";
};

module.exports = that;
