import { doInject } from "./xes-scripts/xes-script.ts"
import { injectionConfig } from "./injection-config.ts";
import { createApp } from 'vue';
import App from './example.vue';
import { createVuetify } from "vuetify";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const host = window.location.host
const path = window.location.pathname
const search = window.location.search

if (
    (injectionConfig.pathMap?.[host]?.[path])
    && (!injectionConfig.needQuery[host]?.[path] || search.includes('xes_chat=true'))
) {
    startApp()
} else {
    if (window.origin === 'https://code.xueersi.com') {
        doInject()
    }
}

function startApp() {
    if (path === "/xes_chat") {
        document.open()
        document.write(`
        <!DOCTYPE html>
        <html lang="zh-cmn-Hans-CN">
            <head>
                <meta charset="UTF-8">
                <title>XESChat</title>
            </head>
            <body>
            </body>
        </html>
        `)
        document.close()
        createApp(App).use(createVuetify(
            {components, directives}
        )).mount(
            (() => {
                const app = document.createElement('div');
                document.body.append(app);
                return app;
            })(),
        );
        import('@mdi/font/css/materialdesignicons.css');
        import('vuetify/dist/vuetify.min.css');
    }
}