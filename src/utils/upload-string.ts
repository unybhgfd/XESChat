import { randomFilename } from "./random-filename.ts";
import SparkMD5 from "spark-md5";

export const xesOssStringUploader = {
    OSS_URL: "https://static0.xesimg.com/programme/python_assets/",

    async _getParams(md5: string, filename: string) {
        let resp = await fetch(
            "https://code.xueersi.com/api/assets/v2/get_tss_upload_params" +
                "?scene=offline_python_assets" +
                `&md5=${md5}&filename=${filename}`,
        );
        return await resp.json();
    },

    /**
     * @param content 文件内容
     * @param filename 文件名
     * @param hashOnly 若为true, 返回值为md5 hex string而非文件名
     * @returns 文件名或md5
     */
    async uploadString(content: string, filename: string = randomFilename(), hashOnly = false): Promise<string> {
        let md5 = SparkMD5.hash(content);
        let params = (await this._getParams(md5, filename))["data"];
        console.assert(params["url"].startsWith(this.OSS_URL));
        params["headers"]["Content-Type"] = "application/octet-stream";
        await fetch(params["host"], {
            method: "PUT",
            body: content,
            headers: params["headers"],
        });
        if (hashOnly) return md5;
        return params["url"].slice(51); // this.OSS_URL.length === 51
    },
};
