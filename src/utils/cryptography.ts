import { Buffer } from "node:buffer";

// TODO: 测试是否可用

/**
 * aes-gcm加密字符串
 * @param word 明文
 * @param key 密码
 * @param iterations PBKDF2的循环次数
 * @constructor
 */
export async function AESEncrypt(word: string, key: string, iterations = 1_000_000) {
    let enc = new TextEncoder();
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    let salt = window.crypto.getRandomValues(new Uint8Array(16));
    let encrypted = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
            tagLength: 128,
        },
        await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations,
                hash: "SHA-256",
            },
            await window.crypto.subtle.importKey("raw", enc.encode(key), "PBKDF2", false, ["deriveKey"]),
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"],
        ),
        enc.encode(word),
    );
    encrypted = Buffer.concat([iv, salt, new Uint8Array(encrypted)]).buffer;
    return btoa(new TextDecoder().decode(new Uint8Array(encrypted)));
}

/**
 * aes-gcm解密字符串
 * @param word 密文
 * @param key 密码
 * @param iterations aes-gcm解密字符串
 * @constructor
 */
export async function AESDecrypt(word: string, key: string, iterations = 1_000_000) {
    let array = Buffer.from(word, "base64");
    let iv = array.subarray(0, 12);
    let salt = array.subarray(12, 16 + 12);
    let encrypted = array.subarray(16 + 12);
    let dec = new TextDecoder();
    let enc = new TextEncoder();
    let decrypted = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv,
            tagLength: 128,
        },
        await window.crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt,
                iterations,
                hash: "SHA-256",
            },
            await window.crypto.subtle.importKey("raw", enc.encode(key), "PBKDF2", false, ["deriveKey"]),
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"],
        ),
        encrypted,
    );
    return dec.decode(decrypted);
}
