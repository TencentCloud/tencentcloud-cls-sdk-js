export interface AsyncClientOptions {
    endpoint: string;
    retry_times: number;
}

export interface WebTrackerOptions {
    host: string;
    /**
     * 日志主题
     */
    topicId: string;
    /**
     * 发送时间阈值, default 10s
     */
    time?: number;
    /**
     * 发送条数阈值, default 10
     */
    count?: number;
    /**
     * 日志来源
     */
    source?: string;

    /**
     * 上传异常回调
     */
    onPutlogsError?: (res: any) => void;

    maxMemoryItems?: number;
    persistInterval?: number;
    sendTimeout?: number;
    maxSendItems?: number;
    retryBaseTimeout?: number;
}