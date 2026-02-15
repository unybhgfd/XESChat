export let hostNames = ["code.xueersi.com", "xueersifile.oss-cn-beijing.aliyuncs.com", "static0.xesimg.com"];

export let injectionConfig: {
    needQuery: Record<string, Record<string, boolean>>;
    pathMap: Record<string, Record<string, string>>;
} = {
    needQuery: {
        "code.xueersi.com": {
            "/ide/code/1": true,
        },
        "xueersifile.oss-cn-beijing.aliyuncs.com": {
            "/": true,
        },
        "static0.xesimg.com": {},
    },
    pathMap: {
        "code.xueersi.com": {
            "/xes_chat": "5ea1ded1b0c012216070732f1ecace3d.html",
            "/ide/code/1": "d4c2324dda3b244b2e29f2b69498eb13.html",
            "/xes_chat/uploader_api": "38b50f25415e32f4e81cfd1ace10390f.html",
            "/xes_chat/chat": "c528df1a15f54058412595c7810c53aa.html",
            "/xes_chat/pan/upload": "bb2dab3602fb9b4c0092204e3b3948b4.html",
        },
        "xueersifile.oss-cn-beijing.aliyuncs.com": {
            "/": "155fbbb0128564f0e5e053f95990e627.html",
        },
        "static0.xesimg.com": {
            "/talcode/assets/home/d.js": "547da420ca21b2c9fdf1cf31bf2d9669.js",
        },
    },
};
