// https://static0.xesimg.com/talcode/assets/home/d.js
// 同时内容也会在tampermonkey脚本中


setInterval(async function () {
    try {
        let elemA = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[2].childNodes[0];
        if (elemA.innerText === "社区公约") {
            let elemB = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[4].childNodes[0];
            if (elemB.innerText === "帮助中心") {
                elemA.innerText = "社区公约 | 帮助中心";
                elemB.innerText = "XES chat";
                elemB.href = "https://code.xueersi.com/xes%20chat";
            }
        }
    } catch (e) {}
}, 500);
