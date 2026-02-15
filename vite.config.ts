import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import monkey, { cdn, MonkeyUserScript } from "vite-plugin-monkey";
import { hostNames } from "./src/injection-config.ts";

let userscriptConfig: MonkeyUserScript = {
    name: "XESChat",
    version: "2026-2-14",
    author: "unybhgfd",
    icon: "https://static0.xesimg.com/talcode/assets/logo.ico",
    namespace: "npm/vite-plugin-monkey",
    match: hostNames.map((s) => `https://${s}/*`),
    noframes: false,
    "run-at": "document-start",
};

export default defineConfig({
    plugins: [
        vue(),
        monkey({
            entry: "src/main.ts",
            userscript: userscriptConfig,
            build: {
                fileName: "xes-chat.user.js",
                externalGlobals: {
                    vue: cdn.jsdelivr("Vue", "dist/vue.global.prod.js"),
                    vuetify: cdn.jsdelivr("Vuetify", "dist/vuetify.min.js"),
                },
            },
        }),
    ],
});
