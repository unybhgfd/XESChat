import { doInject } from "./xes-scripts/xes-script.ts";
import { injectionConfig } from "./injections/injection-config.ts";
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

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

function startApp() {
    // example
    if (path === "/xes_chat") {
        window.stop();
        document.head.innerHTML = `
            <meta charset="UTF-8">
            <title>XESChat</title>
        `;
        document.body.innerHTML = "";
        createApp(injectionConfig.pathMap[host][path])
            .use(createVuetify({ components, directives }))
            .mount(
                (() => {
                    const app = document.createElement("div");
                    document.body.append(app);
                    return app;
                })(),
            );
        import("@mdi/font/css/materialdesignicons.css");
        import("vuetify/dist/vuetify.min.css");
    }
}
