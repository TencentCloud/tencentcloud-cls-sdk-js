export interface ProducerOptions {
    /**
     * The cls service topic id (e.g. "xxxx-xxxx-xxxx-xxxx")
     * @type {string}
     */
    topic_id: string;

    /**
     * The cls service topic region endpoint URL (e.g. "ap-guangzhou.cls.tencentcs.com")
     * @type {string}
     */
    endpoint: string;
    /**
     * @param {Credential} credential Authentication information
     */
    credential: Credential;
    /**
     * client ip
     */
    sourceIp?: string;
    /**
     * Request timeout in seconds, default 60s
     * @type {number}
     * Optional
     */
    sendTimeout?: number;
    /**
     * 发送时间阈值, default 2s
     * @type {number}
     * Optional
     */
    time?: number;
    /**
     * 发送条数阈值, default 1000
     * @type {number}
     * Optional
     */
    count?: number;
    /**
     * 上传回调
     * @type {function}
     * Optional
     */
    onSendLogsError?: (res: any) => void;
    /**
     * 最大内存存储的数据长度, default 10000
     * @type {number}
     * Optional
     */
    maxMemLogCount?: number;
}

/**
 * Credential information class
 */
export interface Credential {
    /**
     * Tencent Cloud account secretId and secretKey
     */
    secretId: string
    /**
     * Tencent Cloud account secretKey
     */
    secretKey: string
    /**
     * Tencent Cloud account token
     * Optional, mutually exclusive with secretId
     */
    token?: string
}

