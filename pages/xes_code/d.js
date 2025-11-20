// https://static0.xesimg.com/talcode/assets/home/d.js
// 同时内容也会在tampermonkey脚本中


window.XESChat_script = true

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
(async function () {
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
})();

// 零宽字符编解码
/*
XESChat零宽字符编码
XesChat => Xe, C ==(Atomic number of ...)=> 54, 12 ==(Binary of ...)=> 11 01 10, 11 00
==(...th element of ZERO_WIDTH_MAP)=> "\u2060\u200C\u200D", "\u2060\u200B"
 */
(async function () {
    const md5ZeroWidthEncoder = {
        ZERO_WIDTH_MAP : {
          '00': '\u200B', // zwsp
          '01': '\u200C', // zwnj
          '10': '\u200D', // zwj
          '11': '\u2060'  // wj
        },
        REVERSE_ZERO_WIDTH_MAP : {
          '\u200B': '00',
          '\u200C': '01',
          '\u200D': '10',
          '\u2060': '11'
        },
        ZERO_WIDTH_RE: /(?<=\u2060\u200C\u200D)[\u200B\u200C\u200D\u2060]{64}(?=\u2060\u200B)/, // 在字符串中匹配
        ZERO_WIDTH_RE_WHOLE: /(?<=^\u2060\u200C\u200D)[\u200B\u200C\u200D\u2060]{64}(?=\u2060\u200B$)/, // 匹配整个字符串(长度为69)
        ZERO_WIDTH_STR_PREFIX: "\u2060\u200C\u200D",
        ZERO_WIDTH_STR_SUFFIX: "\u2060\u200B",

        /**
         * 将MD5 hex字符串转换为零宽字符字符串
         * @param {string} md5Hex - MD5 hex字符串 (32个字符)
         * @returns {string} 零宽字符字符串
         * @author DeepSeek-R1, unybhgfd
         */
        toZeroWidth(md5Hex) {
          // 验证输入格式
          if (!/^[a-f0-9]{32}$/i.test(md5Hex)) {
            throw new Error('Invalid MD5 hex string format');
          }

          // 将hex转换为二进制字符串
          let binary = '';
          for (let i = 0; i < md5Hex.length; i++) {
            const hexChar = md5Hex[i];
            const binaryChar = parseInt(hexChar, 16).toString(2).padStart(4, '0');
            binary += binaryChar;
          }

          // 将二进制转换为零宽字符
          let zeroWidthStr = '';
          for (let i = 0; i < binary.length; i += 2) {
            const bits = binary.substring(i, i + 2);
            zeroWidthStr += this.ZERO_WIDTH_MAP[bits];
          }

          return this.ZERO_WIDTH_STR_PREFIX + zeroWidthStr + this.ZERO_WIDTH_STR_SUFFIX;
        },

        /**
         * 将零宽字符字符串转换回MD5 hex字符串
         * @param {string} zeroWidthStr - 零宽字符字符串
         * @returns {string} MD5 hex字符串
         * @author DeepSeek-R1, unybhgfd
         */
        toMd5HexStr(zeroWidthStr) {
          // 验证输入格式
          if (!this.ZERO_WIDTH_RE_WHOLE.test(zeroWidthStr)) {
            throw new Error('Invalid zero-width characters');
          }

          // 将零宽字符转换回二进制
          let binary = '';
          for (let i = 0; i < zeroWidthStr.length; i++) {
            const zeroWidthChar = zeroWidthStr[i];
            binary += this.REVERSE_ZERO_WIDTH_MAP[zeroWidthChar];
          }

          // 将二进制转换回hex
          let md5Hex = '';
          for (let i = 0; i < binary.length; i += 4) {
            const bits = binary.substring(i, i + 4);
            const hexChar = parseInt(bits, 2).toString(16);
            md5Hex += hexChar;
          }

          return md5Hex;
        }
    };
    setInterval(async function () {
        let nodeList;
        try {
            nodeList = document.querySelector("div.compare-comment").querySelectorAll(".comtent-area");
        } catch { return; }
        nodeList.forEach((element) => {
            if (element.children[0].childNodes[0].nodeType === Node.TEXT_NODE) {
                let content = element.children[0].childNodes[0].textContent;
                // TODO(unybhgfd): 解码并显示
            }
        });
        // TODO(unybhgfd): "div.comment-con > div.top-comment-box.comment-box" 元素添加XESChat的隐藏信息输入框
    }, 1000);
})()
