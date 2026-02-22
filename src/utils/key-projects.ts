import { LocalStorageKeys } from "./storage-keys.ts";
import { AESDecrypt, AESEncrypt } from "./cryptography.ts";
import { createProject } from "./xes/project.ts";

export namespace KeyProjects {
    export const privateName = "[XESChat]已安全加密的个人信息";
    export const publicName = "[XESChat]XES chat身份验证信息";

    // TODO: 怎么优雅地限制各字段长度?
    export type Profile = {
        name: string;
        avatarOssFileName: string;
        description: string;
    };
    export const defaultProfile: Profile = {
        name: "用户昵称",
        avatarOssFileName: "f1c6285504d79da5880dfbc4b80f18f3.png",
        description: "XESChat权威的默认个人简介",
    };
}

function getKey(raw: string, fieldName: string) {
    return (<RegExpMatchArray>raw.match(new RegExp(`^${fieldName}=.*`, "m")))[0].slice(fieldName.length + 1);
}

function setKey(raw: string, fieldName: string, content: string) {
    return raw.replace(new RegExp(`^${fieldName}=.*`, "m"), fieldName + "=" + content);
}

function unicodeToBase64(raw: string) {
    const bytes = new TextEncoder().encode(raw);
    return btoa(Array.from(bytes, (b) => String.fromCodePoint(b)).join(""));
}

function base84ToUnicode(data: string) {
    const bytes = Uint8Array.from(atob(data), (b) => <number>b.codePointAt(0));
    return new TextDecoder().decode(bytes);
}

export const publicProject = new (class {
    createNewToString(publicKeyHex: string) {
        // TODO: FIXME: BUG: HACK: 无法访问未发布的作品, 等郭歌回答
        let content = "请不要修改或发布这个作品, 别乱搞哈" + "\nVERSION=2" + "\nPUBKEY=" + "\nPROFILE=";
        content = setKey(content, "PUBKEY", publicKeyHex);
        content = setKey(content, "PROFILE", JSON.stringify(KeyProjects.defaultProfile));
        return content;
    }
})();
