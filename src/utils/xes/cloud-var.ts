export class CloudVar {
    private messages: Set<string>;
    private socket: WebSocket;
    public userId: string;
    public projectId: string;
    public maxMessage: number;
    public onNewMessage: (message: string) => void;
    public onMessageMaxExceeded: () => void;

    public constructor(
        projectId: string,
        onNewMessage: (message: string) => void = () => {},
        onMessageMaxExceed: () => void = () => {},
        userId = "1",
        maxMessage = 1000,
    ) {
        this.userId = userId;
        this.projectId = projectId;
        this.maxMessage = maxMessage;
        this.onNewMessage = onNewMessage;
        this.onMessageMaxExceeded = onMessageMaxExceed;
        this.messages = new Set([]);
        this.socket = new WebSocket("wss://api.xueersi.com/codecloudvariable/ws:80");

        this.socket.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            if (data.method === "set" && !this.messages.has(data.name)) {
                this.onNewMessage(data.name.slice(2));
            }
            this.messages.add(data.name);
            if (this.messages.size > this.maxMessage) {
                this.onMessageMaxExceeded();
                this.stop();
            }
        };
    }

    public async waitUntilReady() {
        while (this.socket.readyState !== WebSocket.OPEN) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    public refresh() {
        this.socket.send(JSON.stringify({ method: "handshake", user: this.userId, project_id: this.projectId }));
    }

    public createVar(varName: string) {
        this.socket.send(
            JSON.stringify({
                method: "create",
                user: this.userId,
                project_id: this.projectId,
                name: "\u2601 " + varName,
                value: "0",
            }),
        );
        this.socket.send(
            JSON.stringify({
                method: "set",
                user: this.userId,
                project_id: this.projectId,
                name: "\u2601 " + varName,
                value: "1",
            }),
        );
    }

    public stop() {
        this.socket.close();
        this.messages.clear();
    }
}
