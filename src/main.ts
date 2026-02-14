import { doInject } from "./xes-scripts/xes-script.ts"
import { injectionConfig } from "./injection-config.ts";
import { createApp } from 'vue';
import App from './App.vue';

const host = window.location.host
const path = window.location.pathname
const search = window.location.search

// 判断当前URL是否在映射中
if (
    (host in injectionConfig.pathMap && path in injectionConfig.pathMap[host])
    && (injectionConfig.needQuery[host]?.[path] && !search.includes('xes_chat=true'))
) {
    startApp()
} else {
    // 不匹配任何路径，但需要执行原针对 code.xueersi.com 的额外逻辑
    if (window.origin === 'https://code.xueersi.com') {
        doInject()
    }
}

function startApp() {
    console.log('startApp')
    if (path === "/xes_chat") {
        document.open()
        // TODO: 把App放进去
        document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>XESChat</title>
            </head>
            </body>
        </html>
        `)
        const app = document.createElement('div');
        document.body.append(app);
        document.close()
    }
}