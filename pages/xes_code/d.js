(async function () {
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
                    elemB.href = "https://code.xueersi.com/xes_chat";
                }
            }
        } catch (e) {}
    }, 500);

    // 未读消息提醒
    await new Promise(resolve => {
        setTimeout(resolve, 500)
    })
    let TitlePrefix = "";
    let TitleName = document.title;
    let OriginalTitleSetter = Object.getOwnPropertyDescriptor(Document.prototype, "title").set;

    Object.defineProperty(document, "title", {
        set: function(val) {
            TitleName = val.toString();
            OriginalTitleSetter.call(
                document,
                TitlePrefix + TitleName
            )
        }.bind(this),
        get: function() {
            return TitleName;
        }.bind(this),
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
                TitlePrefix = ""
                for (let i in [2, 0, 3, 4, 1]) {
                    if (msgList[i].count !== 0) {
                        TitlePrefix = `[${msgList[i].count.toString()}条${msgList[i].text}消息]`;
                        break;
                    }
                }
                document.title = TitleName;
            });
        } catch {}
    }.bind(this), 20_000);
}())
