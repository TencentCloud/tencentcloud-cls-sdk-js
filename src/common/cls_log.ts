/**
 * cls log 
 */
export class Log {
    private time: number;
    private contents: {[key: string]: string} = {};

    /**
     * 初始化log
     * @param time 当前日志时间
     */
    constructor(time: number) { 
        this.time = time
    }

    /**
     * 设置日志时间
     * @param time 日志时间
     */
    public setTime(time: number) {
        this.time = time;
    }

    /**
     * 获取日志时间
     * @returns number
     */
    public getTime(): number {
        return this.time;
    }

    /**
     * 增加日志字段， key/value 必须都是字符串
     * @param key string
     * @param value string
     */
    public addContent(key:string, value: string) {
        this.contents[key] = value;
    }
}

export class LogGroup { 
    /**
     * source 来源ip
     */
    private source: string;
    private contextflow: string;
    private filename: string;
    private logs: Log[];
    constructor(source: string, filename?: string, contextflow?: string) { 
        this.source = source
        if (filename!=null && filename!=undefined) {
            this.filename = ""
        }
        if (contextflow!=null && contextflow!=undefined) {
            this.contextflow = ""
        }
    }

    public setSource(source: string) {
        this.source = source;
    }

    public getSource(): string {
        return this.source;
    }

    public setContextFlow() {
        this.contextflow = this.contextflow;
    }

    public getContextFlow(): string {
        return this.contextflow;
    }

    public setFilename(filename: string) {
        this.filename = filename;
    }

    public getFilename(): string {
        return this.filename;
    }

    public setLogs(logs: Log[]) {
        this.logs = logs;
    }

    public getLogs(): Log[] {
        return this.logs;
    }

}

