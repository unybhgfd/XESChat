import { xesOssStringUploader } from "./upload-string.ts";

export const md5ZeroWidthEncoder = {
    ZERO_WIDTH_MAP: {
        "00": "\u200B", // zwsp
        "01": "\u200C", // zwnj
        "10": "\u200D", // zwj
        "11": "\u2060", // wj
    },
    REVERSE_ZERO_WIDTH_MAP: {
        "\u200B": "00",
        "\u200C": "01",
        "\u200D": "10",
        "\u2060": "11",
    },

    // 在字符串中匹配, 忽略prefix和suffix
    ZERO_WIDTH_RE: /(?<=\u2060\u200C\u200D)[\u200B\u200C\u200D\u2060]{64}(?=\u200C\u200D)/,
    // 匹配包含prefix和suffix的整个字符串(长度为69)
    ZERO_WIDTH_RE_WHOLE: /(?<=^\u2060\u200C\u200D)[\u200B\u200C\u200D\u2060]{64}(?=\u200C\u200D$)/,
    // 在字符串中匹配, 包含prefix和suffix
    ZERO_WIDTH_RE_MORE: /\u2060\u200C\u200D[\u200B\u200C\u200D\u2060]{64}\u200C\u200D/,
    ZERO_WIDTH_RE_MORE_ALL: /\u2060\u200C\u200D[\u200B\u200C\u200D\u2060]{64}\u200C\u200D/g,

    /*
    XesChat => Xe, C ==(Atomic number of ...)=> 54, 6 ==(Binary of ...)=>
        11 01 10, 01 10 ==(...th element of ZERO_WIDTH_MAP)=> "\u2060\u200C\u200D", "\u200C\u200D"
     */
    ZERO_WIDTH_STR_PREFIX: "\u2060\u200C\u200D",
    ZERO_WIDTH_STR_SUFFIX: "\u200C\u200D",

    /**
     * 将MD5 hex字符串转换为零宽字符字符串
     * @param md5Hex - MD5 hex字符串 (32个字符)
     * @returns 零宽字符字符串
     */
    toZeroWidth(md5Hex: string): string {
        // 验证输入格式
        if (!/^[a-f0-9]{32}$/i.test(md5Hex)) {
            throw new Error("Invalid MD5 hex string format");
        }

        // 将hex转换为二进制字符串
        let binary = "";
        for (let i = 0; i < md5Hex.length; i++) {
            const hexChar = md5Hex[i];
            const binaryChar = parseInt(hexChar, 16).toString(2).padStart(4, "0");
            binary += binaryChar;
        }

        // 将二进制转换为零宽字符
        let zeroWidthStr = "";
        for (let i = 0; i < binary.length; i += 2) {
            const bits = binary.substring(i, i + 2);
            zeroWidthStr += this.ZERO_WIDTH_MAP[bits];
        }

        return this.ZERO_WIDTH_STR_PREFIX + zeroWidthStr + this.ZERO_WIDTH_STR_SUFFIX;
    },

    /**
     * 将零宽字符字符串转换回MD5 hex字符串
     * @param zeroWidthStr - 零宽字符字符串
     * @returns MD5 hex字符串
     * @author DeepSeek-R1, unybhgfd
     */
    toMd5HexStr(zeroWidthStr: string): string {
        // 验证输入格式
        let idxStart = 3; // this.ZERO_WIDTH_STR_PREFIX.length, 这样能同时处理带prefix+suffix和不带的
        if (!this.ZERO_WIDTH_RE_WHOLE.test(zeroWidthStr)) {
            idxStart = 0;
        }

        // 将零宽字符转换回二进制
        let binary = "";
        for (let i = idxStart; i < idxStart + 64; i++) {
            const zeroWidthChar = zeroWidthStr[i];
            binary += this.REVERSE_ZERO_WIDTH_MAP[zeroWidthChar];
        }

        // 将二进制转换回hex
        let md5Hex = "";
        for (let i = 0; i < binary.length; i += 4) {
            const bits = binary.substring(i, i + 4);
            const hexChar = parseInt(bits, 2).toString(16);
            md5Hex += hexChar;
        }

        return md5Hex;
    },
};

export const xeschatZeroWidthEncrypter = {
    /**
     * @param str 可能带隐写信息的字符串
     * @returns 结果, str不含隐写信息则报错
     */
    async getHiddenStr(str: string): Promise<string> {
        let idx = str.match(md5ZeroWidthEncoder.ZERO_WIDTH_RE_MORE).index;
        str = str.slice(idx, idx + 69);
        return await (
            await fetch(xesOssStringUploader.OSS_URL + md5ZeroWidthEncoder.toMd5HexStr(str) + ".XESChatCommentMsg")
        ).text();
    },

    /**
     * 将信息编码成零宽
     */
    async encode(str: string) {
        return md5ZeroWidthEncoder.toZeroWidth(
            await xesOssStringUploader.uploadString(str, ".XESChatCommentMsg", true),
        );
    },
};
