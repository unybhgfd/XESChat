import axios from "axios"

export const oss_url = "https://livefile.xesimg.com/programme/python_assets/"
type OssParamData = {
    data: {
        headers: Record<string, string>, // 上传时使用的header
        host: string, // 上传时使用的url
        url: string, // 下载时的url, 格式是oss_url+文件名
    },
    status: 1 | number // 1则是操作成功
}

async function getUploadParam(md5: string, fileName: string): Promise<OssParamData> {
    const response = await fetch(
        "https://code.xueersi.com/api/assets/get_oss_upload_params" +
        "?scene=offline_python_assets" +
        "&md5=" +
        md5 +
        "&filename=" +
        encodeURIComponent("C:\\Users\\fuckXes\\Downloads\\" + fileName),
        {
            method: "GET",
            cache: "no-cache",
            headers: {
                Authorization: "e7e380401dc9a31fce2117a60c99ba04",
            },
        },
    );
    return await response.json();
}

namespace windowMessageTypes {
}
