import { LogGroup } from "../common/cls_log";
import { Request } from "./request";

export class PutLogsRequest extends Request{
    private  topic: string;
	private  source: string;
	private  logItems: LogGroup;

    constructor(topic: string, logItems: LogGroup) {
        super();
        this.topic = topic;
        this.logItems = logItems;
    }

    /**
     * get log group file name
     * @returns 
     */
    public getFilename(): string {
		return this.logItems.getFilename();
	}

    /**
     * set log group file name
     * @param filename 
     */
	public setFilename(filename: string): void {
		this.logItems.setFilename(filename);
	}

    /**
     * 获取topic
     * @returns string
     */
    public getTopic(): string {
		return this.topic;
	}

    /**
     * 设置topic
     * @param topic 
     */
    public setTopic(topic: string): void {
		this.topic = topic;
	}

    /**
     * Get log source
     * @returns string
     */
    public getSource(): string {
		return this.source;
	}

	/**
	 * Set log source
	 * @param source log source
	 */
	public setSource(source: string): void {
		this.source = source;
	}

    /**
     * Get all the log data
     * @returns 
     */
    public getLogItems(): LogGroup {
		return this.logItems;
	}

    /**
     * Set the log data , shallow copy is used to set the log data
     * @param logItems 
     */
    public setlogItems(logItems: LogGroup): void {
		this.logItems = logItems;
	}

    /**
     * json encode 
     * @returns string
     */
    public encodeLogItems(): string {
        return JSON.stringify(this.logItems)
    }
    
}