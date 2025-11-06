// https://static0.xesimg.com/talcode/assets/home/d.js
// 同时内容也会在tampermonkey脚本中


// 修改菜单
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

// 未读消息提醒
await new Promise(resolve => {
    setTimeout(resolve, 1000)
})
window.XESChat_msgListenerTitlePrefix = "";
window.XESChat_msgListenerTitleName = document.title | "学而思编程-学而思网校-受益一生的能力";
window.XESChat_msgListenerOriginalTitleSetter = Object.getOwnPropertyDescriptor(Document.prototype, "title").set;

Object.defineProperty(document, "title", {
    set: function(val) {
        window.XESChat_msgListenerTitleName = val.toString();
        window.XESChat_msgListenerOriginalTitleSetter.call(
            document,
            window.XESChat_msgListenerTitlePrefix + window.XESChat_msgListenerTitleName
        )
    },
    get: function() {
        return window.XESChat_msgListenerTitleName;
    },
    configurable: true
});

window.XESChat_msgListenerIntervalId = setInterval(async function () {
    try {
        fetch("https://code.xueersi.com/api/messages/overview", {
            "headers": {
                "accept": "application/json, text/plain, */*",
            },
            "method": "GET",
        }).then(async (resp) => {
            return await resp.json();
        }).then((data) => {
            /**
             * @type {{
             *     category: number,
             *     text: string,
             *     count: number
             * }[]}
             */
            let msgList = data.data;
            window.XESChat_msgListenerTitlePrefix = ""
            for (let i in [2, 0, 3, 4, 1]) {
                if (msgList[i].count !== 0) {
                    window.XESChat_msgListenerTitlePrefix = `[${msgList[i].count.toString()}条${msgList[i].text}消息]`;
                    break;
                }
            }
            document.title = window.XESChat_msgListenerTitleName;
        });
    } catch {}
}, 10_000);
