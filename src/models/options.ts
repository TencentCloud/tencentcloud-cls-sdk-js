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

    platform: string;
    platform_request: any;
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
}