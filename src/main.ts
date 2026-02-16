import {Component, createApp} from "vue";
import {createVuetify} from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { doInject } from "./injections/xes-script.ts";
import { injectionNeedQuery } from "./injections/injection-config.ts";

const host = window.location.host;
const path = window.location.pathname;
const search = window.location.search;

const pageComponents = import.meta.glob('./pages/**/*.vue');

if (
    pageComponents[`./pages/${host}${path}.vue`] &&
    (!injectionNeedQuery[host]?.[path] || search.includes("xes_chat=true"))
) {
    // 符合规则, 替换目标页面
    startApp().then()
} else {
    if (window.origin === "https://code.xueersi.com") {
        // 运行注入, 不修改整个页面
        doInject();
    }
}

async function startApp() {
    window.stop();
    document.head.innerHTML = `
        <meta charset="UTF-8">
        <title>XESChat</title>
    `;
    document.body.innerHTML = "";

    const loader = pageComponents[`./pages/${host}${path}.vue`]
    const module: any = await loader();
    const App: Component = module.default;

    const element = document.createElement("div");
    document.body.append(element);
    createApp(App).use(createVuetify({components, directives})).mount(element);

    import("@mdi/font/css/materialdesignicons.css");
    import("vuetify/dist/vuetify.min.css");
}
