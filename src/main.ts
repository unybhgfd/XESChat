import {createApp} from "vue";
import {createVuetify} from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { doInject } from "./injections/xes-script.ts";
import { injectionConfig } from "./injections/injection-config.ts";

const host = window.location.host;
const path = window.location.pathname;
const search = window.location.search;

if (
    injectionConfig.pathMap?.[host]?.[path] &&
    (!injectionConfig.needQuery[host]?.[path] || search.includes("xes_chat=true"))
) {
    // 符合规则, 替换目标页面
    startApp();
} else {
    if (window.origin === "https://code.xueersi.com") {
        doInject();
    }
}

import App0 from "./pages/code.xueersi.com/xes_chat.vue"
import App1 from "./pages/code.xueersi.com/ide/code/1.need_query.vue"
function startApp() {
    // example
    if (path === "/xes_chat") {
        window.stop();
        document.head.innerHTML = `
            <meta charset="UTF-8">
            <title>XESChat</title>
        `;
        document.body.innerHTML = "";

        const element = document.createElement("div");
        document.body.append(element);

        switch (host) {
            case "code.xueersi.com":
                switch (path) {
                    case "/xes_chat": createApp(App0).use(createVuetify({components, directives})).mount(element); break;
                    case "/ide/code/1": createApp(App1).use(createVuetify({components, directives})).mount(element); break;
                    // TODO
                }
                break;

            case "xueersifile.oss-cn-beijing.aliyuncs.com":
                break;
        }

        import("@mdi/font/css/materialdesignicons.css");
        import("vuetify/dist/vuetify.min.css");
    }
}
