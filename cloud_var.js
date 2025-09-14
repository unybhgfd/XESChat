/**
 * requires: xes_cloud_var_api.js
 */


class CloudVar {
    #cvApi;

    /**
     * NOTE: 默认不会获取之前的消息，需要调用refresh()
     * @param {string} userId
     * @param {string} projectId
     * @param {number} msgMax
     * @param {(string) => *} onNewMsg
     * @param {() => *} onMsgMaxExceed
     */
    constructor(
        userId="1",
        projectId="2",
        msgMax=1000,
        onNewMsg=function() {},
        onMsgMaxExceed=function() {},
    ) {
        this.userId = userId
        this.projectId = projectId
        this.msgMax = msgMax
        this.onNewMsg = onNewMsg
        this.onMsgMaxExceed = onMsgMaxExceed
        /** @type {Set<string>} */
        this.msgs = new Set([])
        this.#cvApi = new XesWsCloudVar(userId, projectId, function (event) {
            if (event.method === "set" && !this.msgs.has(event.name)) {
                this.onNewMsg(event.name.slice(2))
            }
            this.msgs.add(event.name)
            if (this.msgs.size > this.msgMax) {
                this.onMsgMaxExceed()
                this.stop()
            }
        }.bind(this))
    }

    /**
     * 获取新消息
     * @returns {Promise<void>}
     */
    async refresh() {
        await this.#cvApi.initialize()
    }

    /**
     * 添加新消息
     * @param {string} msg
     * @returns {Promise<void>}
     */
    async sendMsg(msg) {
        await this.#cvApi.createVar(msg)
    }

    /**
     * 停止
     */
    stop() {
        this.#cvApi.socket.close()
    }
}
