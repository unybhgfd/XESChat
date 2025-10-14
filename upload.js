/**
 * requires: spark-md5.min.js
 */


/** 简单的字符串uploader, 无需跨域 */
class XesOssMsgUploader {
    constructor() {}

    /**
     * 生成随机文件名, 应该立即使用
     * @returns {string}
     */
    static getFilename() {
        const hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz"
        let s = []
        for (let i = 0; i < 9; i++) {
            s[i] = hexDigits[Math.floor(Math.random() * 0x10)]
        }
        s[4] = "."
        return s.join('') + "_" + Date.now().toString()
    }

    async #getParams(md5) {
        let resp = await fetch("https://code.xueersi.com/api/assets/v2/get_tss_upload_params"
            + "?scene=offline_python_assets"
            + `&md5=${md5}&filename=${XesOssMsgUploader.getFilename()}`);
        return await resp.json();
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
        while (!uploadSucceed) {await wait(100)}
        return params["url"]
    }
}