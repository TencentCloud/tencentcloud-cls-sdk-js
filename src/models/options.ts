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
    /**
     * 自定义 User-Agent，若不填则使用默认值 cls-js-sdk-<version>。
     * 若填写，将追加到默认 UA 之后，格式为 "cls-js-sdk-<version> <custom>"。
     */
    user_agent?: string;
}
