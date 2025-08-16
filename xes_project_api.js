/**
 * requires: TODO
 */


/**
 * @typedef {Object} ProjData 学而思C++作品data
 * @property {Number} stat 正常情况下为1
 * @property {Number} status 正常情况下为1
 * @property {String} msg
 * @property {object} data 里面的xml是
 *   @config {string} data.xml 作品内容(即代码)
 *   @config {string} data.user_id
 *   @config {string} data.topic_id
 */

/**
 * 查看cpp作品
 * @param projId {string | number} 作品id
 * @returns {Promise<ProjData>} projData
 */
async function xesProjectView(projId) {
    let resp = await (
        await fetch(
            "https://code.xueersi.com/api/compilers/v2/"
            +projId.toString()
            +"?id="+projId.toString(),
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            }
        )
    ).json()
    if (resp["stat"] !== 1) {
        throw resp
    }
    return resp
}

/**
 * 新建cpp作品
 * @param projName 作品名称
 * @param projXml 作品代码
 * @returns {Promise<string>} 作品id
 */
async function xesCppProjCreate(projName, projXml) {
    const response = await fetch("https://code.xueersi.com/api/compilers/save", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "assets": {
                "assets": [],
                "cdns": ["https://static0.xesimg.com", "https://livefile.xesimg.com"],
                "cursorsMap": {"cb4b6868f9335d740486ea3b5cf928f0": {"row": 0, "column": 0}},
                "hide_filelist": false
            },
            "code_complete": 1,
            "id": null,
            "lang": "cpp",
            "name": projName,
            "original_id": 1,
            "planid": null,
            "problem_desc": null,
            "problemid": null,
            "projectid": null,
            "removed": 0,
            "type": "",
            "user_id": 8510061,
            "version": "cpp",
            "xml": projXml
        }),
    })
    let resp_data = await response.json()
    if (resp_data["msg"] !== "\u64cd\u4f5c\u6210\u529f") {
        throw resp_data
    }
    return (resp_data["data"]["id"]).toString()
}

/**
 * 修改cpp作品
 * @param {number} projId 作品id
 * @param {string} projName 作品名
 * @param {string} projXml 作品代码
 * @return {Promise<void>}
 */
async function xesCppProjSave(projId, projName, projXml) {
    const response = await fetch("https://code.xueersi.com/api/compilers/save", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "assets": {
                "assets": [],
                "cdns": ["https://static0.xesimg.com", "https://livefile.xesimg.com"],
                "cursorsMap": {"cb4b6868f9335d740486ea3b5cf928f0": {"row": 0, "column": 0}},
                "hide_filelist": false
            },
            "code_complete": 1,
            "id": projId,
            "lang": "cpp",
            "name": projName,
            "original_id": 1,
            "planid": null,
            "problemid": null,
            "projectid": projId,
            "removed": 0,
            "type": "",
            "user_id": parseInt(USERINFO["id"]),
            "version": "cpp",
            "xml": projXml
        }),
    })
    let resp_data = await response.json()
    if (resp_data["status"] !== 1) {
        throw resp_data
    }
}

/**
 * 删除cpp作品
 * @param {number} projId 作品id
 * @returns {Promise<void>}
 */
async function xesCppProjDel(projId) {
    const response = await fetch(
        "https://code.xueersi.com/api/compilers/"+projId.toString()+"/delete",
        {
            method: "POST",
            cache: "no-cache",
            redirect: "error",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": projId
            }),
        }
    )
    let resp_data = await response.json()
    if (resp_data["status"] !== 1) {
        throw resp_data
    }
}

/**
 * 搜索自己的所有cpp作品. 返回最晚的作品名称完全相同的作品的id
 * @param projName 作品名称
 * @returns {Promise<number | null>} 作品id, 没搜索到则是null
 */
async function xesCppProjSearchOwnByName(projName) {
    // 搜索私钥作品
    let resp_search = await fetch(
        "https://code.xueersi.com/api/compilers/my?published=all&type=normal&page=1&per_page=10000",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        }
    ).catch((err) => {
        console.error(err)
    })

    let projects = await resp_search.json()
    console.assert(projects["status"] === 1)
    /** @type {null | number} */
    let search_result = null
    let p, i
    for (i = 0; i < projects["data"]["data"].length; i++) {
        p = projects["data"]["data"][i]
        if (p["name"] === projName) {
            search_result = p["id"]
        }
    }
    return search_result;
}

/**
 * @typedef XesCppProjCommentOrReplyData
 * @param {number} id 评论/回复 id
 * @param {string} topic_id
 * @param {0 | number} parent_id 该回复所在的评论id, 若是评论则为0
 * @param {0 | number} target_id 该回复的目标评论(或回复)id, 若是评论则为0
 * @param {string} user_id 评论/回复 的发布者用户id
 * @param {string} reply_user_id TODO: 这是干嘛的
 * @param {string} content 评论/回复 内容
 * @param {number} replies 回复数
 * @param {0 | 1} removed 是否被学而思管理删除
 * @param {string} created_at 评论/回复 的创建时间, 格式为: "YYYY-MM-DD hh:mm:ss"
 * @param {boolean} can_delete 有无删除的权限
 */

/**
 * @typedef XesCppProjCommentReplyListData
 * 评论列表
 * @property {string} msg
 * @property {number} status 正常情况下为1
 * @property {Object} data
 *   @config {string} data.page string化的number, 从1开始计数
 *   @config {string} data.per_page string化的number
 *   @config {XesCppProjCommentOrReplyData[]} data.data
 *   @config {number} data.total 总数
 */

/**
 * 获取 评论/回复 列表
 * @private
 */
async function _xesCppProjCommentReplyListApi(topicId, parentId, page, perPage) {
    const response = await fetch(
        `https://code.xueersi.com/api/comments?appid=1001108&topic_id=${topicId}`
            +`&parent_id=${parentId.toString()}&order_type=&page=${page.toString()}&per_page=${perPage.toString()}`,
        {
            method: "GET",
            cache: "no-cache",
            redirect: "error",
            headers: {
                "Content-Type": "application/json"
            },
        }
    )
    let resp_data = await response.json()
    if (resp_data["status"] !== 1) {
        throw resp_data
    }
    return resp_data
}

/**
 * 获取评论列表
 * @param {ProjData} projData
 * @param {number | string} page 从1开始计数
 * @param {number | string} perPage
 * @returns {Promise<XesCppProjCommentReplyListData>}
 */
async function xesCppProjGetCommentList(projData, page, perPage) {
    return await _xesCppProjCommentReplyListApi(projData.data.topic_id, 0, page, perPage)
}

/**
 * 获取回复列表
 * @param projData
 * @param {number | string} commentId XesCppProjCommentOrReplyData的id属性
 * @param page 从1开始计数
 * @param perPage
 * @returns {Promise<XesCppProjCommentReplyListData>}
 */
async function xesCppProjGetReplyList(projData, commentId, page, perPage) {
    return await _xesCppProjCommentReplyListApi(projData.data.topic_id, commentId, page, perPage)
}

/**
 * @param {string} topidId
 * @param {number} targetId
 * @param {string} content
 * @returns {Promise<number>}
 * @private
 */
async function _xesCppProjSendCommentReplyApi(topidId, targetId, content) {
    const response = await fetch(
        "https://code.xueersi.com/api/comments/submit",
        {
            method: "POST",
            cache: "no-cache",
            redirect: "error",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "appid": 1001108,
                "topic_id": topidId,
                "target_id": targetId,
                "content": content
            }),
        }
    )
    let resp_data = await response.json()
    if (resp_data["status"] !== 1) {
        throw resp_data
    }
    return resp_data["data"]["id"]
}

/**
 * 发送评论
 * @param {ProjData} projData
 * @param {string} content 评论内容
 * @returns {Promise<number>} 评论id
 */
async function xesCppProjSendComment(projData, content) {
    return await _xesCppProjSendCommentReplyApi(projData.data.topic_id, 0, content)
}

/**
 * 发送回复
 * @param {ProjData} projData
 * @param {number} commentId
 * @param {string} content
 * @returns {Promise<number>}
 */
async function xesCppProjSendReply(projData, commentId, content) {
    return await _xesCppProjSendCommentReplyApi(projData.data.topic_id, commentId, content)
}
