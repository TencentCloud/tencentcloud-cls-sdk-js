import { cls } from '../../vendor/compiled'


export class LogGroup {
    /**
     * loggroup
     */
    public mLogs: cls.LogGroup;

    constructor() {
        this.mLogs = new cls.LogGroup();
    }

    /**
     * get log group file name
     * @returns 
     */
     public getFilename(): string {
		return this.mLogs.filename || "";
	}

    /**
     * set log group file name
     * @param filename 
     */
	public setFilename(filename: string): void {
		this.mLogs.filename = filename;
	}

    /**
     * Get log source
     * @returns string
     */
    public getSource(): string {
		return this.mLogs.source || "";
	}

	/**
	 * Set log source
	 * @param source log source
	 */
	public setSource(source: string): void {
		this.mLogs.source = source;
	}

    /**
     * 增加日志
     * @param log 
     */
    public addLogs(log: LogItem) {
        this.mLogs.logs.push(log.getLog())
    }

    /**
     * encode
     * @returns Uint8Array
     */
    public encode(): Uint8Array {
        let list = new cls.LogGroupList();
        list.logGroupList.push(this.mLogs)
        return cls.LogGroupList.encode(list).finish();
    }

    /**
     * decode
     * @param buffer 
     * @returns  {[key: string]: any}
     */
    public decode(buffer: Uint8Array): {[key: string]: any} {
        return cls.LogGroupList.decode(buffer).toJSON()
    }

    /**
     * encode
     * @param buffer 
     * @returns  string | null 
     */
    public verify(buffer: Uint8Array): string | null {
        return cls.LogGroupList.verify(buffer)
    }

}


export class LogItem {
    public mContents: cls.Log;
    public logLength: number;

    constructor() {
        this.mContents = new cls.Log();
    }

    /**
     * 日志字段
     * @param content 
     */
    public pushBack(content: Content) {
        this.mContents.contents.push(content.getContent())
    }

    /**
     * 日志时间
     * @param time 
     */
    public setTime(time: number) {
        this.mContents.time = time
    }

    /**
     * 获取日志
     * @returns cls.Log
     */
    public getLog(): cls.Log {
        return this.mContents;
    }

    public setLength(length: number) {
        this.logLength = length;
    }

    public getLength(): number {
        return this.logLength;
    }

}


export class Content {
    /**
     * pb log content
     */
    public content: cls.Log.Content;

    constructor(key: string, value: string) {
        this.content = new cls.Log.Content({ key, value });
    }

    /**
     * 获取content
     * @returns cls.Log.Content
     */
    public getContent(): cls.Log.Content {
        return this.content;
    }
}