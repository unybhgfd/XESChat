import { SessionStorageKeys } from "../storage-keys.ts";

export async function getUserInfo(): Promise<{
    create_time: string;
    id: string;
    realname: string;
    tal_id: string;
    uid: string; // 很可能与id不同
    xes_encrypt_uid: string;
}> {
    if (sessionStorage.getItem(SessionStorageKeys.xesUserInfo) === null) {
        const response = await fetch("https://code.xueersi.com/api/user/info", {
            method: "GET",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.assert(data["stat"] === 1, "API 返回状态错误");

        sessionStorage.setItem(SessionStorageKeys.xesUserInfo, data["data"]);
        return data["data"];
    } else {
        return JSON.parse(<string>sessionStorage.getItem(SessionStorageKeys.xesUserInfo));
    }
}
