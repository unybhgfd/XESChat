export function randomFilename(): string {
    const hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
    let s = [];
    for (let i = 0; i < 9; i++) {
        s[i] = hexDigits[Math.floor(Math.random() * 0x10)];
    }
    s[4] = ".";
    return s.join("") + "_" + Date.now().toString();
}
