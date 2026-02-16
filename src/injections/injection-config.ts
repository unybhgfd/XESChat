export let hostNames = ["code.xueersi.com", "xueersifile.oss-cn-beijing.aliyuncs.com"];

export let injectionNeedQuery: Record<string, Record<string, boolean>> = {
    "code.xueersi.com": {
        "/ide/code/1": true,
    },
    "xueersifile.oss-cn-beijing.aliyuncs.com": {
        "/": true,
    },
};
