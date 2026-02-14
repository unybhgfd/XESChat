import { doInject } from "./xes-scripts/xes-script.ts"
import { injectionConfig } from "./injection-config.ts";
import { createApp } from 'vue';
import App from './App.vue';

const host = window.location.host
const path = window.location.pathname
const search = window.location.search

// 判断当前URL是否在映射中
if (
    (injectionConfig.pathMap?.[host]?.[path])
    && (!injectionConfig.needQuery[host]?.[path] || search.includes('xes_chat=true'))
) {
    startApp()
} else {
    // 不匹配任何路径，但需要执行原针对 code.xueersi.com 的额外逻辑
    if (window.origin === 'https://code.xueersi.com') {
        doInject()
    }
}

function startApp() {
    if (path === "/xes_chat") {
        document.open()
        document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>XESChat</title>
            </head>
            <body>
                body
            </body>
        </html>
        `)
        document.close()
    }
}