/**
 * requires: spark-md5.min.js
 */


/** 简单的字符串uploader, 无需跨域 */
class XesOssMsgUploader {
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
}