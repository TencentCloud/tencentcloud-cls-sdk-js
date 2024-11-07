export interface AsyncClientOptions {
    endpoint: string;
    secretId: string;
    secretKey: string;
    sourceIp: string;
    retry_times: number;
    compress?: boolean;
    secretToken?: string;
}
