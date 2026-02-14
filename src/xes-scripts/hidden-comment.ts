import {md5ZeroWidthEncoder, xeschatZeroWidthEncrypter} from "../utils/zero-width.ts";

export async function injectHiddenComments() {
    setInterval(async function () {
        try {
            // 显示
            let nodeList = document.querySelector("div.compare-comment").querySelectorAll(".comtent-area");

            for (let element of nodeList) {
                if (element.nodeName === "DIV") element = element.children[0];
                let content: string = element.innerText;
                if (md5ZeroWidthEncoder.ZERO_WIDTH_RE.test(content)) {
                    let hiddenContent = await xeschatZeroWidthEncrypter.getHiddenStr(content);
                    // 删除所有特定格式的零宽字符
                    element.innerText = content.replace(md5ZeroWidthEncoder.ZERO_WIDTH_RE_MORE_ALL, "");
                    let elem = document.createElement("code");
                    elem.innerText = hiddenContent;
                    element.insertAdjacentElement("afterend", elem);
                }
            }

            // 添加隐藏信息输入框
            if (document.getElementById("xeschat-hidden-msg") === null) {
                // TODO: 两个元素的style怪怪的
                // TODO: 回复的输入框记得也加上
                let elem = document.createElement("div");
                elem.innerHTML = `
                            <textarea
                             placeholder="在这输入需要隐藏的内容"
                             style="resize: none; border: none; width: 100% !important; height: 100%;"
                             id="xeschat-hidden-msg-textarea"
                             cols="80"></textarea>
                        `;
                elem.style.height = "6em";
                elem.className = "xes-textarea";
                elem.id = "xeschat-hidden-msg";
                document.querySelector("div.comment-con > div.top-comment-box.comment-box")
                    .appendChild(elem);

                elem = document.createElement("div");
                elem.className = "submit-btn";
                elem.innerText = "插入隐藏内容";
                elem.style = window.getComputedStyle(
                    document.querySelector("div.comment-con div.submit-btn"));
                elem.addEventListener("click", async () => {
                    /** @type {HTMLTextAreaElement} */
                    let textAreaElement: HTMLTextAreaElement = document.querySelector("#comment-box")
                    textAreaElement.value = await xeschatZeroWidthEncrypter.encode(
                        document.querySelector("#xeschat-hidden-msg-textarea").value
                    ) + textAreaElement.value;
                    textAreaElement.dispatchEvent(new Event("input"))
                });
                document.querySelector("div.comment-con > div.top-comment-box.comment-box")
                    .appendChild(elem);
            }
        } catch {}
    }.bind(this), 500);
}