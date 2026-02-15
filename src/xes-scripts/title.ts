export async function injectTitle() {
    await new Promise((resolve) => {
        setTimeout(resolve, 500);
    });
    let TitlePrefix = "";
    let TitleName = document.title;
    let OriginalTitleSetter = Object.getOwnPropertyDescriptor(Document.prototype, "title").set;

    Object.defineProperty(document, "title", {
        set: function (val) {
            TitleName = val.toString();
            OriginalTitleSetter.call(document, TitlePrefix + TitleName);
        }.bind(this),
        get: function () {
            return TitleName;
        }.bind(this),
        configurable: true,
    });

    setInterval(
        async function () {
            try {
                fetch("https://code.xueersi.com/api/messages/overview", {
                    headers: {
                        accept: "application/json, text/plain, */*",
                    },
                    method: "GET",
                })
                    .then(async (resp) => {
                        return await resp.json();
                    })
                    .then((data) => {
                        let msgList: {
                            category: number;
                            text: string;
                            count: number;
                        }[] = data.data;
                        TitlePrefix = "";
                        for (let i in [2, 0, 3, 4, 1]) {
                            if (msgList[i].count !== 0) {
                                TitlePrefix = `[${msgList[i].count.toString()}条${msgList[i].text}消息]`;
                                break;
                            }
                        }
                        document.title = TitleName;
                    });
            } catch {}
        }.bind(this),
        20_000,
    );
}
