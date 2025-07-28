/**
 * requires: project_check.js
 */

/**
 * @typedef {object} UserInfoJson
 @property {string} userName
 @property {string} userAvatarFileName
 @property {string} userGender
 @property {string} userDesc
 */

/**
 * 设置公钥作品中的用户信息
 * @param {UserInfoJson} options
 * @returns {Promise<void>}
 */
async function xesPubKeyProjSetOption(
    options
) {
    await xesPubKeyProjSetOptionByString(JSON.stringify(options))
}

/** @type {[
 *     { // 下限
 *         userName: number
 *         userAvatarFileName: number
 *         userGender: number
 *         userDesc: number
 *     }, { // 上限
 *         userName: number
 *         userAvatarFileName: number
 *         userGender: number
 *         userDesc: number
 *     }
 * ]}
 * */
const xesPubKeyProjOptionsLengthLimit = [
    {
        userName: 1,
        userAvatarFileName: 36,
        userGender: 0,
        userDesc: 0,
    }, {
        userName: 10,
        userAvatarFileName: 37,
        userGender: 4,
        userDesc: 4000,
    }
]

/**
 * @param projId
 * @returns {Promise<null | UserInfoJson>}
 */
async function xesPubKeyProjGetOption(projId) {
    try {
        let data = JSON.parse(await xesPubKeyProjGetOptionString(projId))
        if (
            data["userName"].length <= xesPubKeyProjOptionsLengthLimit[1]["userName"]
            && data["userName"].length >= xesPubKeyProjOptionsLengthLimit[0]["userName"]
            && data["userAvatarFileName"].length <= xesPubKeyProjOptionsLengthLimit[1]["userAvatarFileName"]
            && data["userAvatarFileName"].length >= xesPubKeyProjOptionsLengthLimit[0]["userAvatarFileName"]
            && data["userGender"].length <= xesPubKeyProjOptionsLengthLimit[1]["userGender"]
            && data["userGender"].length >= xesPubKeyProjOptionsLengthLimit[0]["userGender"]
            && data["userDesc"].length <= xesPubKeyProjOptionsLengthLimit[1]["userDesc"]
            && data["userDesc"].length >= xesPubKeyProjOptionsLengthLimit[0]["userDesc"]
        ) {
            return data
        }
        return null
    } catch (e) {
        console.log("公钥作品非法. id: ", projId)
        return null;
    }
}

/** @type UserInfoJson */
const defaultUserInfo = {
    userName: "用户昵称",
    userAvatarFileName: "355ca5ebf40e81d10331293f6419adb3.jpg",
    userGender: "不愿透露",
    userDesc: "可能就是一个默认的用户简介吧"
}

/** @type UserInfoJson */
const userInfoTextMap = {
    userName: "用户昵称",
    userAvatarFileName: "用户头像文件名",
    userGender: "用户性别",
    userDesc: "用户个人介绍"
}
