/**
 * requires: 无
 */


/**
 * 学而思云变量
 * 已删除不安全的方法
 */
class XesWsCloudVar {
    /**
     * @callback XesWsCloudVarCallback
     * @param {{
     *     method: "ack",
     *     name: string,
     *     reply: "OK"
     * } | {
     *     method: "set",
     *     project_id: string,
     *     name: string,
     *     value: number
     * }} event
     */

    /**
     * constructor
     * @param user_id {string}
     * @param project_id
     * @param onmessage {XesWsCloudVarCallback} 接收到消息时的回调函数
     */
    constructor(user_id = "1", project_id = "2", onmessage = function(event) {}) {
        this.user_id = user_id;
        this.project_id = project_id;
        this.socket = new WebSocket("wss://api.xueersi.com/codecloudvariable/ws:80")
        this.onmessageCallback = onmessage
        this.socket.onmessage = function(event) {
            let obj = JSON.parse(event.data);
            func1(obj)
        }
        let func2 = function func3(data) {
            this.onmessageCallback(data);
        }
        let func1 = func2.bind(this) // https://blog.csdn.net/princek123/article/details/83584208
    }

    /**
     * 初始化, 但也可以用来更新所有云变量, 回调函数可能会收到method为"set"的多个消息
     * @returns {Promise<void>}
     */
    async initialize() {
        while (this.socket.readyState !== WebSocket.OPEN) {
            await wait(100)
        }
        this.socket.send(JSON.stringify(
            {"method": "handshake", "user": this.user_id, "project_id": this.project_id}
        ));
    }

    /**
     * 新建云变量
     * @param {string} var_name
     */
    createVar(var_name) {
        this.socket.send(JSON.stringify(
            {
                "method": "create", "user": this.user_id, "project_id": this.project_id,
                "name": "\u2601 " + var_name, "value": 0
            }
        ))
        this.socket.send(JSON.stringify(
            {
                "method": "set", "user": this.user_id, "project_id": this.project_id,
                "name": "\u2601 " + var_name, "value": 1
            }
        ))
    }
}
