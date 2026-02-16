import { getUserInfo } from "./user-info.ts";

const projectParams = {
    assets: {
        assets: [],
        cdns: ["https://static0.xesimg.com", "https://livefile.xesimg.com"],
        cursorsMap: { cb4b6868f9335d740486ea3b5cf928f0: { row: 0, column: 0 } },
        hide_filelist: false,
    },
    code_complete: 1,
    id: null, // null | number
    lang: "cpp",
    original_id: 1,
    planid: null,
    problem_desc: null,
    problemid: null,
    projectid: null, // null | number
    removed: 0,
    type: "",
    user_id: 8510061,
    version: "cpp",
    // name: string
    // xml: string
    // user_id?: number
};

export type ProjectData = {
    stat: number;
    data: {
        // 作品内容 (即代码)
        xml: string;

        user_id: string;
        topic_id: string;

        //作品名称
        name: string;
    };
};

export type CommentOrReply = {
    id: number;
    topic_id: string;

    // 发布者用户id
    user_id: string;

    reply_user_id: string;

    // 内容
    content: string;

    // 回复数
    replies: number;

    //是否被学而思管理删除
    removed: 0 | 1;

    // 评论/回复 的创建时间, 格式为: "YYYY-MM-DD hh:mm:ss"
    created_at: string;

    // 自己有无删除的权限
    can_delete: boolean;

    // 该回复所在的评论id, 若是评论则为0
    parent_id: number;

    // 该回复的目标评论(或回复)id, 若是评论则为0
    target_id: number;
};

export type ReplyList = {
    // 正常时是1
    status: number;
    data: {
        // stringify的number, 从1开始计数
        page: string;

        per_page: string;
        data: Array<CommentOrReply>;
        total: number;
    };
};

/**
 * 查看作品
 */
export const viewProject = new (class {
    cacheId = "";
    cacheData: ProjectData = <ProjectData>{};

    /**
     * @param id 目标作品id, 为数字0是清空缓存
     */
    async viewProject(id: string | number) {
        if (id === 0) {
            this.cacheId = "0";
        }
        id = id.toString();
        if (id === this.cacheId) {
            return this.cacheData;
        }
        let response: ProjectData = await (
            await fetch(`https://code.xueersi.com/api/compilers/v2/${id}?id=${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
        ).json();
        if (response["stat"] !== 1) {
            throw new Error("无法获取作品数据");
        }
        this.cacheId = id;
        this.cacheData = response;
        return response;
    }
})().viewProject;

/**
 * 创建作品
 * @param name 作品名
 * @param code 作品代码
 * @returns 作品id
 */
export async function createProject(name: string, code: string): Promise<string> {
    const response = await fetch("https://code.xueersi.com/api/compilers/save", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...projectParams,
            name: name,
            xml: code,
        }),
    });
    let resp_data = await response.json();
    if (resp_data["msg"] !== "\u64cd\u4f5c\u6210\u529f") {
        throw new Error("无法创建作品");
    }
    return resp_data["data"]["id"].toString();
}

/**
 * 修改作品
 * @param id 目标作品id
 * @param name 新的作品名
 * @param code 新的作品代码
 */
export async function updateProject(id: number, name: string, code: string) {
    const response = await fetch("https://code.xueersi.com/api/compilers/save", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ...projectParams,
            id,
            name,
            projectid: id,
            user_id: parseInt((await getUserInfo()).id),
            xml: code,
        }),
    });
    let resp_data = await response.json();
    if (resp_data["status"] !== 1) {
        throw new Error("无法修改作品");
    }
    await viewProject(0);
}

export async function deleteProject(id: string | number) {
    const response = await fetch("https://code.xueersi.com/api/compilers/" + id.toString() + "/delete", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
        }),
    });
    let resp_data = await response.json();
    if (resp_data["status"] !== 1) {
        throw new Error("无法删除作品");
    }
}

export async function searchOwnProject(name: string): Promise<null | number> {
    let resp_search = await fetch(
        "https://code.xueersi.com/api/compilers/my?published=all&type=normal&page=1&per_page=10000",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    let projects = await resp_search.json();
    console.assert(projects["status"] === 1);
    let search_result: null | number = null;
    let p, i;
    for (i = 0; i < projects["data"]["data"].length; i++) {
        p = projects["data"]["data"][i];
        if (p["name"] === name) {
            search_result = p["id"];
        }
    }
    return search_result;
}

async function getCommentOrReplyList(
    topicId: string,
    parentId: number,
    page: number | string,
    perPage: number | string,
) {
    const response = await fetch(
        `https://code.xueersi.com/api/comments?appid=1001108&topic_id=${topicId}` +
            `&parent_id=${parentId.toString()}&order_type=&page=${page.toString()}&per_page=${perPage.toString()}`,
        {
            method: "GET",
            cache: "no-cache",
            redirect: "error",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    let resp_data = await response.json();
    if (resp_data["status"] !== 1) {
        throw resp_data;
    }
    return resp_data;
}

async function sendCommentOrReply(topicId: string, targetId: number, content: string): Promise<number> {
    const response = await fetch("https://code.xueersi.com/api/comments/submit", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            appid: 1001108,
            topic_id: topicId,
            target_id: targetId,
            content: content,
        }),
    });
    let resp_data = await response.json();
    if (resp_data["status"] !== 1) {
        throw new Error("无法发送评论/回复");
    }
    return resp_data["data"]["id"];
}

/**
 * 获取评论列表
 * @param projectData
 * @param page 从1开始计数
 * @param perPage
 */
export async function getCommentList(projectData: ProjectData, page: number | string, perPage: number | string) {
    return await getCommentOrReplyList(projectData.data.topic_id, 0, page, perPage);
}

/**
 * 获取回复列表
 * @param projectData
 * @param commentId
 * @param page 从1开始计数
 * @param perPage
 */
export async function getReplyList(
    projectData: ProjectData,
    commentId: number | string,
    page: number | string,
    perPage: number | string,
) {
    return await getCommentOrReplyList(projectData.data.topic_id, commentId, page, perPage);
}

/**
 * 发送评论
 */
export async function sendComment(projectData: ProjectData, content: string): Promise<number> {
    return await sendCommentOrReply(projectData.data.topic_id, 0, content);
}

export async function sendReply(
    projectData: ProjectData,
    commentId: number | string,
    content: string,
): Promise<number> {
    return await sendCommentOrReply(projectData.data.topic_id, commentId, content);
}

export async function deleteCommentOrReply(projectData: ProjectData, targetId: number) {
    const response = await fetch("https://code.xueersi.com/api/comments/delete", {
        method: "POST",
        cache: "no-cache",
        redirect: "error",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            appid: 1001108,
            topic_id: projData.data.topic_id,
            id: targetId,
        }),
    });
    let resp_data = await response.json();
    if (resp_data["status"] !== 1) {
        throw new Error("无法删除评论/回复");
    }
}
