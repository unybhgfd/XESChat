// node导出js: npx browserify -r bigi -s bigi -p esmify > bigi.min.js
function cookieToJson(){
    let cookie_text = document.cookie;
    let arr = [];
    let text_to_split = cookie_text.split(";");
    for(let i in text_to_split) {
        let tmp = text_to_split[i].split("=");
        arr.push('"'+tmp.shift().trim()+'":"'+tmp.join(":").trim()+'"')
    }
    let res ='{\n'+arr.join(",\n")+'\n}';
    return JSON.parse(res);
}

const COOKIE = cookieToJson();

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms)
    })
}

// localStorage(LS)和sessionStorage(SS)所有的键(idx)
const idxLS_XES_SEC_KEY_WIF = "xesChatSecKeyWIF"
const idxLS_XES_PUBKEY_HEX = "xesChatPubKey"
const idxLS_XES_PUBKEY_PROJ_ID = "xesChatPubKeyProjId"
const idxName_secKeyProjName = "[XESChat]已安全加密的个人信息"
const idxName_pubKeyProjName = "[XESChat]XES chat身份验证信息"
const idxSS_XES_USER_INFO_JSON_STRING = "xesUserInfoJsonString"
const idxOther_userAvatarXOssProcessParam = "image/resize,m_fill,w_160,h_160,limit_0/format,webp"
/**
 * @type {null | {
 *     create_time: string,
 *     id: string,
 *     realname: string,
 *     tal_id: string,
 *     uid: string, // 很可能与id不同
 *     xes_encrypt_uid: string
 * }}
 */
let USERINFO = null
// https://www.fanfiction.net/s/13619519/1/%E5%98%8E%E9%BE%99DS-%E7%B3%96%E8%A6%81%E7%BB%99%E4%B9%96%E5%AD%A9%E5%AD%90

if (sessionStorage.getItem(idxSS_XES_USER_INFO_JSON_STRING) !== null) {
    USERINFO = JSON.parse(sessionStorage.getItem(idxSS_XES_USER_INFO_JSON_STRING))
} else {
    (async function() {
        try {
            const response = await fetch("https://code.xueersi.com/api/user/info", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            const _userinfo = await response.json();
            console.assert(_userinfo["stat"] === 1, "API 返回状态错误");

            USERINFO = _userinfo["data"];
            sessionStorage.setItem(idxSS_XES_USER_INFO_JSON_STRING, JSON.stringify(USERINFO));

        } catch (err) {
            console.error("加载用户数据失败:", err);
        }
    })();
}

if (window.location.pathname !== "/ide/code/1" &&  (
    localStorage.getItem(idxLS_XES_SEC_KEY_WIF) === null
    || localStorage.getItem(idxLS_XES_PUBKEY_HEX) === null
    || localStorage.getItem(idxLS_XES_PUBKEY_PROJ_ID) === null
)) {
    // TODO: release时把下面那行代码的双斜杠删掉
    // window.location.href = "/ide/code/1?xes_chat=true"
}
