export let hostNames = ["code.xueersi.com", "xueersifile.oss-cn-beijing.aliyuncs.com"];

export let injectionConfig: {
    needQuery: Record<string, Record<string, boolean>>;
    pathMap: Record<string, Record<string, string>>;
} = {
    needQuery: {
        "code.xueersi.com": {
            // "/ide/code/1": true,
        },
        "xueersifile.oss-cn-beijing.aliyuncs.com": {
            // "/": true,
        },
    },
    pathMap: {
        "code.xueersi.com": {
            "/xes_chat": "../pages/code.xueersi.com/xes_chat.vue",
            "/ide/code/1": "../pages/code.xueersi.com/ide/code/1.need_query.vue",
            "/xes_chat/uploader_api": "../pages/code.xueersi.com/xes_chat/uploader_api.vue",
            "/xes_chat/chat": "../pages/code.xueersi.com/xes_chat/chat.vue",
            "/xes_chat/pan/upload": "../pages/code.xueersi.com/xes_chat/pan/upload.vue",
        },
        "xueersifile.oss-cn-beijing.aliyuncs.com": {
            "/": "../pages/xueersifile.oss-cn-beijing.aliyuncs.com/.need_query.vue",
        },
    },
};
