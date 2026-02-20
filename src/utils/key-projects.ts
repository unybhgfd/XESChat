import {LocalStorageKeys} from "./storage-keys.ts"
import {AESDecrypt, AESEncrypt} from "./cryptography.ts";

export namespace KeyProjectNames {
    export const privateName = "[XESChat]已安全加密的个人信息";
    export const publicName = "[XESChat]XES chat身份验证信息";
}

async function getKey(raw: string, fieldName: string, aesKey: string, aesIterations=1_000_000) {
    return await AESDecrypt(
        (<RegExpMatchArray>raw.match(
            new RegExp(`^${fieldName}=*`, "m")
        ))[0].slice(fieldName.length+1),
        aesKey, aesIterations
    )
}

async function setKey(raw: string, fieldName: string, aesKey: string, content: string, aesIterations=1_000_000) {
    return raw.replace(
        new RegExp(`^${fieldName}=*`, "m"),
        fieldName+"="+await AESEncrypt(content, aesKey, aesIterations)
    )
}
