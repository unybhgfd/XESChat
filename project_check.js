/**
 * requires: buffer.min.js, config.js, xes_project_api.js
 */


/**
 * 根据公钥作品的projData获得公钥
 * @param projData {ProjData} 公钥作品的projData
 * @returns {string}
 */
function xesPubKeyProjectGetKey(projData) {
    return projData["data"]["xml"].match(/PUBKEY=[A-Za-z0-9+\/]+={0,2}\n/)[0].slice(7, -1)
}

/**
 * 设置公钥作品的公钥
 * @param pubKeyHex hex形式的公钥
 * @returns {Promise<void>}
 */
async function xesPubKeyProjSetPubKey(pubKeyHex) {
    await xesCppProjSave(
        parseInt(localStorage.getItem(idxLS_XES_PUBKEY_PROJ_ID)),
        idxName_secKeyProjName,
        (
            await xesProjectView(
                localStorage.getItem(idxLS_XES_PUBKEY_PROJ_ID)
            )
        )["data"]["xml"].replace(
            /PUBKEY=[A-Za-z0-9+\/]+={0,2}\n/,
            "PUBKEY="
                +pubKeyHex
                +"\n"
        )
    )
}

/**
 * 将hex字符串转为UInt8Array, 用于ECPair导入公钥
 * 如: ECPair.ECPair.fromPublicKey(hexToUint8Array(pubKeyHexString))
 * @param {string} hexString
 * @returns {Uint8Array}
 */
function hexToUint8Array(hexString) {
    return new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

/**
 * 设置公钥作品的options
 * @param optionsString options, string类型
 * @returns {Promise<void>}
 */
async function xesPubKeyProjSetOptionByString(optionsString) {
    await xesCppProjSave(
        parseInt(localStorage.getItem(idxLS_XES_PUBKEY_PROJ_ID)),
        idxName_pubKeyProjName,
        (await xesProjectView(localStorage.getItem(idxLS_XES_PUBKEY_PROJ_ID)))["data"]["xml"].replace(
            /OPTIONS=[^\n]{2,}/,
            "OPTIONS="+await AESEncrypt(optionsString, "xesChat.userInfoJsonData",) // 防止傻逼乱改, 故加密
        )
    )
}

/**
 * 获取公钥作品的options
 * @param projId {string | number} 公钥作品id
 * @returns {Promise<string>} options, string类型
 */
async function xesPubKeyProjGetOptionString(projId) {
    return await AESDecrypt(
        (
            await xesProjectView(projId)
        )["data"]["xml"].match(
            /OPTIONS=[^\n]{2,}/
        )[0].slice(8),
        "xesChat.userInfoJsonData",
    )
}

/**
 * 新建公钥作品
 * @param pubKeyHex hex形式的公钥
 * @returns {Promise<string>} 作品id
 */
async function xesPubKeyProjCreate(pubKeyHex) {
    return await xesCppProjCreate(
        idxName_pubKeyProjName,
        "这个作品你可以打开、运行, 但请不要修改这些文本或是重命名这个作品\n否则你的聊天账号将被认为是非法的\n"
            +"也请不要发布这个作品\n这个作品被别人访问并不会泄露你账号中的任何信息\n你如果不小心把这些信息修改了可以重新生成\n\n\n"
            +"PUBKEY="+pubKeyHex
            +"\nOPTIONS="+await AESEncrypt("{}", "xesChat.userInfoJsonData")
            +"\n"
    )
}

/**
 * aes-gcm加密字符串, 默认迭代100万次, 10万次很快, 100万次平衡, 1000万次安全. 返回一个合法的base64字符串
 * @param word {string} 明文
 * @param key {string} 密码
 * @param iterations {number} PBKDF2的循环次数。 *在保持应用程序可接受性能水平的前提下，使用尽可能多的迭代次数。*——MDN
 * @returns {Promise<string>} 密文
 */
async function AESEncrypt(word, key, iterations=100_00_00) {
    let enc = new TextEncoder()
    let iv = window.crypto.getRandomValues(new Uint8Array(12))
    let salt = window.crypto.getRandomValues(new Uint8Array(16))
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
            tagLength: 128
        },
        await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations,
                hash: "SHA-256"
            },
            await window.crypto.subtle.importKey(
                "raw",
                enc.encode(key),
                "PBKDF2",
                false,
                ["deriveKey"]
            ),
            {name: "AES-GCM", length: 256},
            true,
            ["encrypt", "decrypt"]
        ),
        enc.encode(word)
    )
    encrypted = buffer.Buffer.concat([iv, salt, new Uint8Array(encrypted)])
    return btoa(String.fromCharCode.apply(null, encrypted))
}

/**
 * aes-gcm解密字符串
 * @param word {string} 密文
 * @param key {string} 密码
 * @param iterations {number} PBKDF2的循环次数.
 * @returns {Promise<string>} 明文
 * @throws {DOMException} InvalidAccessError: 解密失败
 */
async function AESDecrypt(word, key, iterations= 100_00_00) {
    /** @type Uint8Array */
    let array = buffer.Buffer.from(word, 'base64')
    let iv = array.slice(0, 12)
    let salt = array.slice(12, 16+12)
    let encrypted = array.slice(16+12)
    let dec = new TextDecoder()
    let enc = new TextEncoder()
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
            tagLength: 128
        },
        await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations,
                hash: "SHA-256"
            },
            await window.crypto.subtle.importKey(
                "raw",
                enc.encode(key),
                "PBKDF2",
                false,
                ["deriveKey"]
            ),
            {name: "AES-GCM", length: 256},
            true,
            ["encrypt", "decrypt"]
        ),
        encrypted
    )
    return dec.decode(decrypted)
}

/**
 * 根据localStorage中的私钥wif生成加密后的wif
 * @returns {Promise<string>}
 */
async function genWifAesHex() {
    return await AESEncrypt(
        localStorage.getItem(idxLS_XES_SEC_KEY_WIF),
        USERINFO["tal_id"]
            +USERINFO["create_time"]
            +USERINFO["uid"]
            +USERINFO["xes_encrypt_uid"],
        1000_00_00
    )
}

/**
 * 解密wif
 * @param {string} wifAesHex
 * @returns {Promise<string>} wif
 */
async function wifAesHexDecrypt(wifAesHex) {
    return await AESDecrypt(
        wifAesHex,
        USERINFO["tal_id"]
            +USERINFO["create_time"]
            +USERINFO["uid"]
            +USERINFO["xes_encrypt_uid"],
        1000_00_00
    )
}

/**
 * 新建私钥作品
 * @param {string} wifAesHex
 * @returns {Promise<string>}
 */
async function xesSecKeyProjCreate(wifAesHex) {
    return xesCppProjCreate(
        idxName_secKeyProjName,
        "这是你用于在其他设备登录的信息，已经经过了加密，但是也请不要发布、重命名或是修改这个作品\n\n\n"
            +"SECKEY_ENCRYPTED="+wifAesHex
            +"\n"
    )
}

/**
 * 获取加密的wif
 * @param {ProjData} projData
 * @returns {string} WifAesHex
 */
function xesSecKeyProjectGetWifAesHex(projData) {
    return projData["data"]["xml"].match(/SECKEY_ENCRYPTED=[A-Za-z0-9+\/]+={0,2}\n/)[0].slice(17, -1)
}

/**
 * 更新私钥作品的私钥. wif从localStorage读取
 * @param {number} secKeyProjId
 * @returns {Promise<void>}
 */
async function xesSecKeyProjSetWif(secKeyProjId) {
    await xesCppProjSave(secKeyProjId, idxName_secKeyProjName, (
        await xesProjectView(secKeyProjId))["data"]["xml"].replace(
            /SECKEY_ENCRYPTED=[A-Za-z0-9+\/]+={0,2}\n/,
            "SECKEY_ENCRYPTED="
                +await genWifAesHex()
                +"\n"
        )
    )
}
