// ==UserScript==
// @name         XESChat
// @namespace    http://tampermonkey.net/
// @version      2025-05-31
// @description  XES chat必不可少的路由脚本
// @author       dyz
// @match        https://code.xueersi.com/*
// @match        https://xueersifile.oss-cn-beijing.aliyuncs.com/*
// @icon         https://static0.xesimg.com/talcode/assets/logo.ico
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// ==/UserScript==

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const path_map = {
    "https://code.xueersi.com": {
        "/xes%20chat": "https://livefile.xesimg.com/programme/python_assets/b8a926d403cccc43da7c7083cea745aa.html",
        "/xes%20chat/upload%20test": "https://livefile.xesimg.com/programme/python_assets/dfbcdfe15f53f7454a7c5f47c30de7de.html",
        "/ide/code/1": "https://livefile.xesimg.com/programme/python_assets/984f3389399dcd3bdf042e393f117d3d.html",
        "/xes%20chat/uploader": "https://livefile.xesimg.com/programme/python_assets/fb74f6b9599f51471559bd12642c8ac2.html",
    },
    "https://xueersifile.oss-cn-beijing.aliyuncs.com": {
        "/": "https://livefile.xesimg.com/programme/python_assets/e03b2de68558fac614bf3078e892cfe7.html",
    }
};

await (async function() {
    'use strict';

    if (
        window.location.pathname in path_map[window.origin] && (
            window.location.search === "?xes_chat=true"
            || window.location.pathname.includes("xes%20chat")
        )
    ) {
        // window.stop()
        let resp = await fetch(path_map[window.origin][window.location.pathname], {
            method: "GET",
            cache: "force-cache",
        })
        document.write(await resp.text())
    } else if (window.origin === "https://code.xueersi.com") {
        setInterval(function () {
            try {
                let elemA = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[2].childNodes[0]
                if (elemA.innerText === "社区公约") {
                    let elemB = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[4].childNodes[0]
                    if (elemB.innerText === "帮助中心") {
                        elemA.innerText = "社区公约 | 帮助中心"
                        elemB.innerText = "XES chat"
                        elemB.href = "https://code.xueersi.com/xes%20chat"
                    }
                }
            } catch (e) {}
        }, 1000)
    }
})();
