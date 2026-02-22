import { Component, createApp } from "vue";
import { createVuetify } from "vuetify/framework";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { doInject } from "./injections/xes-script.ts";
import { injectionNeedQuery } from "./injections/injection-config.ts";

const host = window.location.host;
const path = window.location.pathname;
const search = window.location.search;

const pageComponents = import.meta.glob("./pages/**/*.vue");

if (
    pageComponents[`./pages/${host}${path === "/" ? "/(index)" : path}.vue`] &&
    (!injectionNeedQuery[host]?.[path] || search.includes("xes_chat=true"))
) {
    // 符合规则, 替换目标页面
    startApp().then();
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
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>XESChat</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/vuetify@3.11.8/dist/vuetify.min.css">
    `;
    document.body.innerHTML = "";

    const loader = pageComponents[`./pages/${host}${path === "/" ? "/(index)" : path}.vue`];
    const module: any = await loader();
    const App: Component = module.default;

    const element = document.createElement("div");
    document.body.append(element);
    createApp(App).use(createVuetify({ components, directives })).mount(element);
}
