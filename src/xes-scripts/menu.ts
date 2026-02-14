export async function injectMenu() {
    setInterval(() => {
        try {
            let elemA: HTMLAnchorElement = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[2].childNodes[0];
            if (elemA.innerText === "社区公约") {
                let elemB: HTMLAnchorElement = document.getElementsByClassName("user_icon_dropdown")[0].childNodes[4].childNodes[0];
                if (elemB.innerText === "帮助中心") {
                    elemB.innerText = "XES chat";
                    elemB.href = "https://code.xueersi.com/xes_chat";
                }
            }
        } catch (e) {}
    }, 1000)
}