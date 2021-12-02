import { LogGroup } from "../common/log";
import { Request } from "./request";
// import {CONST_PROTO_BUF} from "../common/constants"

export class PutLogsRequest extends Request{
    private  mTopic: string;
	private  mSource: string;
	private  mlogItems: LogGroup;
	// private  mContentType: string = CONST_PROTO_BUF;

    constructor(topic: string, logItems: LogGroup) {
        super();
        this.mTopic = topic;
        this.mlogItems = logItems;
    }

    /**
     * get log group file name
     * @returns 
     */
    public getFilename(): string {
		return this.mlogItems.getFilename();
	}

    /**
     * set log group file name
     * @param filename 
     */
	public setFilename(filename: string): void {
		this.mlogItems.setFilename(filename);
	}

    /**
     * 获取topic
     * @returns string
     */
    public getTopic(): string {
		return this.mTopic;
	}

    /**
     * 设置topic
     * @param topic 
     */
    public setTopic(topic: string): void {
		this.mTopic = topic;
	}

    /**
     * Get log source
     * @returns string
     */
    public getSource(): string {
		return this.mSource;
	}

	/**
	 * Set log source
	 * @param source log source
	 */
	public setSource(source: string): void {
		this.mSource = source;
	}

    /**
     * Get all the log data
     * @returns 
     */
    public getLogItems(): LogGroup {
		return this.mlogItems;
	}

    /**
     * Set the log data , shallow copy is used to set the log data
     * @param logItems 
     */
    public setlogItems(logItems: LogGroup): void {
		this.mlogItems = logItems;
	}

    /**
     * pb build
     * @returns Uint8Array
     */
    public getLogGroupBytes(source: string): Uint8Array {
        this.mlogItems.setSource(source)
        return this.mlogItems.encode()
    }

}