/**
 * @author Treagzhao
 */
function Transfer(core) {
    var Dialog = require('../util/modal/dialog.js');
    var _self = this;
    var global = core.getGlobal();
    var loadFile = require('../util/load.js')();
    var sortType,
        sortKey;
    Dialog.call(this, {
        'title' : '转接给新的客服',
        'footer' : false,
        'width' : 855
    });

    var getDefaultParam = function() {
        if(window.localStorage) {
            sortType = (window.localStorage.sortType);
            sortKey = window.localStorage.sortKey;
        }
    };
    var parseDOM = function() {
    };

    var bindListener = function() {
    };

    var initPlugins = function() {
        _self.show();
        getDefaultParam();
    };

    var init = function() {
        parseDOM();
        bindListener();
        initPlugins();
    };

    init();
};

module.exports = Transfer;
