<script setup lang="ts">
(() => {
    // TODO: 这太屎了
    // 传入[file, ossParam["data"], uuid]
    // WARNING: 不检查传入参数的合法性
    window.addEventListener("load", () => console.log("uploader (inner)"));
    window.addEventListener(
        "message",
        async function (event) {
            if (event.origin !== "https://code.xueersi.com") return;
            if (typeof event.data !== "object") return;
            try {
                let file: File = event.data[0];
                let params = event.data[1];
                let uuid: string = event.data[2];
                let response = await fetch(params["host"], {
                    headers: params["headers"],
                    body: file,
                    method: "PUT",
                });
                let url = params["url"];
                if (url.slice(0, 52) !== "https://livefile.xesimg.com/programme/python_assets/" || !response["ok"]) {
                    console.error("上传失败", response);
                    event.source?.postMessage(
                        { XESChat: true, error: response },
                        { targetOrigin: "https://code.xueersi.com" },
                    );
                } else {
                    event.source?.postMessage(
                        {
                            filename: url.slice(52),
                            XESChat: true,
                            uuid,
                        },
                        { targetOrigin: "https://code.xueersi.com" },
                    );
                }
            } catch (e) {
                console.error("上传失败", e);
                event.source?.postMessage({ XESChat: true, error: e }, { targetOrigin: "https://code.xueersi.com" });
            }
        },
        false,
    );

    window.parent.postMessage({ ready: true, XESChat: true }, { targetOrigin: "https://code.xueersi.com" });
})();
</script>

<template>uploader (inner)</template>
