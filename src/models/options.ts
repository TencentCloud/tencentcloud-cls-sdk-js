export interface AsyncClientOptions {
    endpoint: string;
    sourceIp: string;
    retry_times: number;
    compress?: boolean;
}
