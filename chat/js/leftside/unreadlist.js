/**
 * @author Treagzhao
 */
var that = {};

var push = function(uid,item) {
    if(!that[uid]) {
        that[uid] = [];
    }
    that[uid].push(item);
};

var remove = function(uid) {
    delete that[uid];
};
var getList = function(uid) {
    return that[uid];
};

that.push = push;
that.remove = remove;
that.getList = getList;
module.exports = that;
