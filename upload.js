class XesOssMsgUploader {
    // 25時
    #knd; #mfy; #ena; #mzk

    #filename
    constructor() {
        this.#filename = "xesChatMessage" + Date.now().toString() + "_" + COOKIE["stu_id"] + "_"
    }

    async #getParams(md5) {
        let xhr = new XMLHttpRequest()
        xhr.open("GET", "https://code.xueersi.com/api/assets/v2/get_tss_upload_params"
                                    + "?scene=offline_python_assets"
                                    + `&md5=${md5}&filename=${this.#filename + Date.now().toString()
                                                              + ".xeschatmsg"}`)
        xhr.send()
        while (xhr.readyState !== XMLHttpRequest.DONE) {await wait(100)}
        return JSON.parse(xhr.responseText)
    }

    async uploadString(content) {
        let params = (await this.#getParams(SparkMD5.hash(content)))["data"]
        params["headers"]["Content-Type"] = "application/octet-stream"
        let uploadSucceed = false
        await fetch(params["host"], {
            method: 'PUT',
            body: content,
            headers: params["headers"]
        })
            // .then(response => response.json())
            .then(data => {
                console.log(data)
                console.log(params["url"])
                uploadSucceed = true
            })
            .catch(error => {
                console.error("上传失败", error)
                params["url"] = "err"
                uploadSucceed = true
            });
        while (!uploadSucceed) {wait(100)}
        return params["url"]
    }

    async uploadMsg() {
        let 消息数据结构 = {
            prevMsg: { // 上一条消息
                // 文件名: https://static0.xesimg.com/programme/python_assets/fae0b27c451c728867a567e8c1bb4e53.xeschatmsg
                "fileName": "fae0b27c451c728867a567e8c1bb4e53",

                "size": 114514, // 校验, md5是文件名, 已经校验过, 只需要校验文件大小(字节)
            },
            time: 1748759678822, // 发送时间 (时间戳
            content: '你好', // 消息内容, 暂时不支持At人的消息
            user: 30883073, // 消息发送者
            ...
        }
        // TODO
    }
}