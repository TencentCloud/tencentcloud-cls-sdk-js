export interface AsyncClientOptions {
    endpoint: string;
    secretId?: string;
    secretKey?: string;
    sourceIp: string;
    retry_times: number;
    compress?: boolean;
    secretToken?: string;
    /**
     * 弱鉴权（免密）账号 ID，与 secretId/secretKey 二选一填写。
     * 两者同时填写时以 secretId/secretKey 为准（走强鉴权），uin 被忽略。
     * 必须为纯数字字符串。
     */
    uin?: string;
}
