/**
 * @author Treagzhao
 */
function WebSocket(global) {
    var websocket;
    var on = function() {
    };

    var start = function() {
        websocket = new window.WebSocket(global.socketBase);
        websocket.onopen = function() {
            alert();
        };
        websocket.onerror = function() {
            console.log("err")
        };
    };
    this.on = on;
    this.start = start;
}

module.exports = WebSocket;
