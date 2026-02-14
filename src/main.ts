import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 原映射表
const pathMap: Record<string, Record<string, string>> = {
    'code.xueersi.com': {
        '/xes_chat': '5ea1ded1b0c012216070732f1ecace3d.html',
        '/ide/code/1': 'd4c2324dda3b244b2e29f2b69498eb13.html',
        '/xes_chat/uploader_api': '38b50f25415e32f4e81cfd1ace10390f.html',
        '/xes_chat/chat': 'c528df1a15f54058412595c7810c53aa.html',
        '/xes_chat/pan/upload': 'bb2dab3602fb9b4c0092204e3b3948b4.html',
    },
    'xueersifile.oss-cn-beijing.aliyuncs.com': {
        '/': '155fbbb0128564f0e5e053f95990e627.html',
    },
    'static0.xesimg.com': {
        '/talcode/assets/home/d.js': '547da420ca21b2c9fdf1cf31bf2d9669.js',
    },
}

const needQuery: Record<string, Record<string, boolean>> = {
    'code.xueersi.com': { '/ide/code/1': true },
    'xueersifile.oss-cn-beijing.aliyuncs.com': { '/': true },
    'static0.xesimg.com': {},
}

const host = window.location.host
const path = window.location.pathname
const search = window.location.search

// 判断当前URL是否在映射中
if (host in pathMap && path in pathMap[host]) {
    // 检查是否需要查询参数
    if (needQuery[host]?.[path] && !search.includes('xes_chat=true')) {
        // 不满足条件：不启动应用，但仍可能执行原额外逻辑（如下）
    } else {
        // 启动应用
        startApp()
    }
} else {
    // 不匹配任何路径，但需要执行原针对 code.xueersi.com 的额外逻辑
    if (window.origin === 'https://code.xueersi.com') {
        // 将原脚本省略部分的代码搬到这里
        // 例如：初始化某些功能、监听事件等
    }
}

function startApp() {
    // 由于脚本运行在 document-start，我们可以安全地清除原文档并写入新框架
    document.open()
    document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>XESChat</title>
      </head>
      <body>
        <div id="app"></div>
      </body>
    </html>
  `)
    document.close()

    // 创建Vue应用并挂载
    const app = createApp(App)
    app.use(router)
    app.mount('#app')

    // 初始化路由，跳转到当前路径（保留查询参数）
    router.push(window.location.pathname + window.location.search)
}