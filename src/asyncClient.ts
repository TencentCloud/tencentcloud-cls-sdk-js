import { AsyncClientOptions } from './models';
import  TencentCloudClsSDKException from './exception'
import { CONST_CONTENT_LENGTH, CONST_CONTENT_TYPE, CONST_HOST, CONST_PROTO_BUF, CONST_MAX_PUT_SIZE, TOPIC_ID, CONST_HTTP_METHOD_POST, UPLOAD_LOG_RESOURCE_URI, CONST_AUTHORIZATION, HEADER_AUTH_MODE, HEADER_UIN, AUTH_MODE_WEAK, INVALID_UIN, SDK_USER_AGENT, HTTP_SEND_TIME_OUT, CONST_GZIP_ENCODING, CONST_X_SLS_COMPRESSTYPE } from './common/constants';
import { PutLogsRequest } from './request/putLogsRequest';
import { signature } from "./common/sign";
import * as axios from "axios"
import * as zlib from "zlib"
import { Response } from './response/response';

export class AsyncClient {
    /**
     * httpType http type
     */
    private httpType: string;
    /**
     * HostName hostname
     */
    private hostName: string;
    /**
     * 腾讯云账户secretId
     */
    private secretId: string;
    /**
     * 腾讯云账户secretKey
     */
    private secretKey: string;
    /**
     * sourceIp 来源ip
     */
    private sourceIp: string;
    /**
     * retry_times 上传失败重试次数
     */
    private retry_times: number;

    private secretToken: string;

    /**
     * 弱鉴权（免密）账号 ID，与 secretId/secretKey 二选一填写。
     * 两者同时填写时以 secretId/secretKey 为准（走强鉴权），uin 被忽略。
     */
    private uin: string;


    constructor(options: AsyncClientOptions) { 
        // 参数校验
        if (options == null || options == undefined) {
            throw new TencentCloudClsSDKException("AsyncClientOptions invalid")
        }

        if (options.endpoint == null || options.endpoint == undefined || options.endpoint.length == 0) {
            throw new TencentCloudClsSDKException("options endpoint can not be empty")
        }

        if (options.sourceIp == null || options.sourceIp == undefined || options.sourceIp.length == 0) {
            throw new TencentCloudClsSDKException("options sourceIp can not be empty")
        }

        // 凭证赋值（允许为空，由 isWeakAuth 判定）
        this.secretId = options.secretId || "";
        this.secretKey = options.secretKey || "";
        this.uin = options.uin || "";
        this.secretToken = options.secretToken || "";

        // 鉴权模式决策表校验（构造期）
        if (this.isWeakAuth()) {
            if (this.uin.length === 0) {
                throw new TencentCloudClsSDKException(
                    "options secretId or secretKey can not be empty, or set uin to use weak authorization"
                )
            }
            if (!/^\d+$/.test(this.uin)) {
                throw new TencentCloudClsSDKException(
                    `${INVALID_UIN}: uin must be a digits-only string`
                )
            }
        }

        this.retry_times = options.retry_times;
        if (options.retry_times == 0 || options.retry_times == undefined || options.retry_times == null) {
            this.retry_times = 5;
        }

        if (options.endpoint.startsWith("http://")) {
            this.hostName = options.endpoint.substring(7);
            this.httpType = "http://";
        } else if (options.endpoint.startsWith("https://")) {
            this.hostName = options.endpoint.substring(8);
            this.httpType = "https://";
        } else {
            this.hostName = options.endpoint;
            this.httpType = "http://";
        }
        
        while (this.hostName.endsWith("/")) {
            this.hostName = this.hostName.substring(0, this.hostName.length - 1);
        }

        this.sourceIp = options.sourceIp;
    }

    /**
     * 判定是否弱鉴权模式。
     * isWeakAuth() = (SecretID 为空) OR (SecretKEY 为空)
     * 注意是 OR 而非 AND：只要 AK/SK 不齐全就归为弱鉴权候选。
     */
    public isWeakAuth(): boolean {
        return this.secretId.length === 0 || this.secretKey.length === 0;
    }

    /**
     * ResetSecretToken
     * 弱鉴权下调用会打 warn 并直接返回（no-op），不改动凭证。
     */
    public ResetSecretToken(secretId: string, secretKey: string, secretToken: string) {
        // 判定必须在赋值之前
        if (this.isWeakAuth()) {
            console.warn(`[CLS SDK] ResetSecretToken ignored in weak auth mode, uin=${this.uin}`);
            return;
        }

        if (secretId.length == 0 || secretKey.length == 0 || secretToken.length == 0) {
            throw new TencentCloudClsSDKException("invalid param. param cannot be empty");
        }

        this.secretToken = secretToken;
        this.secretId    = secretId;
        this.secretKey   = secretKey;
    }

    /**
     * PutLogs
     * @param request 
     * @returns 
     */
    public async PutLogs(request: PutLogsRequest): Promise<any> {
        let logBytes = request.getLogGroupBytes(this.sourceIp);
        if (logBytes.length > CONST_MAX_PUT_SIZE) {
            throw new TencentCloudClsSDKException(`InvalidLogSize. logItems' size exceeds maximum limitation : ${CONST_MAX_PUT_SIZE} bytes, logBytes=${logBytes.length}, topic=${request.getTopic()}`);
        }
      
        let urlParameter = request.getAllParams();
        request.setParam(TOPIC_ID, request.getTopic());

        for (let retryTimes = 0; retryTimes < this.retry_times; retryTimes++) { 
            try {
                // 每次重试都重新构建 headParameter，避免上次残留的头污染签名
                let headParameter = this.getCommonHeadPara(CONST_PROTO_BUF);
                let res = await this.sendLogs(CONST_HTTP_METHOD_POST, UPLOAD_LOG_RESOURCE_URI, urlParameter, headParameter, logBytes, request.getTopic());
                let putLogResponse = new Response();
                putLogResponse.setAllHeaders(res.headers);
                putLogResponse.setHttpStatusCode(res.status);
                if (putLogResponse.getHttpStatusCode() == 200) {
                    return putLogResponse;
                }
                // 401/404 不重试（配置类错误，重试无意义）
                if (putLogResponse.getHttpStatusCode() == 401 || putLogResponse.getHttpStatusCode() == 404) {
                    throw new TencentCloudClsSDKException(
                        `send log failed with HTTP ${putLogResponse.getHttpStatusCode()}. topic=${request.getTopic()}`
                    );
                }
                if (retryTimes + 1 >= this.retry_times) { 
                    throw new TencentCloudClsSDKException("send log failed and exceed retry times");
                }
            } catch (error) {
                // SDK 自身抛出的异常直接透传，不再重试
                if (error instanceof TencentCloudClsSDKException) {
                    throw error;
                }
                // axios 错误：401/404/413 不重试
                if (error.response && (error.response.status == 413 || error.response.status == 401 || error.response.status == 404)) {
                    let putLogResponse = new Response();
                    putLogResponse.setAllHeaders(error.response.headers);
                    putLogResponse.setHttpStatusCode(error.response.status);
                    if (error.response.status == 401) {
                        throw new TencentCloudClsSDKException(
                            `send log failed with HTTP 401. topic=${request.getTopic()}. response: ${JSON.stringify(error.response.data)}`
                        );
                    }
                    return putLogResponse;
                }
                if (retryTimes + 1 >= this.retry_times) { 
                    let putLogResponse = new Response();
                    if (error.response) {
                        putLogResponse.setAllHeaders(error.response.headers);
                        putLogResponse.setHttpStatusCode(error.response.status);
                    }
                    throw new TencentCloudClsSDKException(`send log failed and exceed retry times. error: ${error.message}`);
                }   
            }
        }        
    }


    /**
     * sendLogs
     * @param method  Http Method
     * @param resourceUri 
     * @param urlParameter 
     * @param headParameter 
     * @param body 
     * @returns 
     */
    private async sendLogs(method: string, resourceUri: string, urlParameter: Map<string, string>, headParameter: Map<string, string>, body: Uint8Array, topic: string): Promise<any> {
        // deflate 压缩
        let compressedBody: Buffer = zlib.deflateRawSync(Buffer.from(body));

        headParameter.set(CONST_CONTENT_LENGTH, compressedBody.length.toString());

        let headers: {[key: string]: string} = {};

        if (this.isWeakAuth()) {
            // 弱鉴权：只带明文身份头，不做签名
            headParameter.set(HEADER_AUTH_MODE, AUTH_MODE_WEAK);
            headParameter.set(HEADER_UIN, this.uin);

            headParameter.forEach((value, key) => {
                headers[key] = value;
            });
            // 确认不发 Authorization / X-Cls-Token
        } else {
            // 强鉴权：计算签名（原逻辑）
            let signature_str: string = signature(this.secretId, this.secretKey, method, resourceUri, urlParameter, headParameter, 300000);
            headParameter.set(CONST_AUTHORIZATION, signature_str);

            headParameter.forEach((value, key) => {
                headers[key] = value;
            });

            if (this.secretToken.length > 0) {
                headers["X-Cls-Token"] = this.secretToken;
            }
        }

        // User-Agent
        headers["User-Agent"] = SDK_USER_AGENT;
        // 压缩类型
        headers[CONST_X_SLS_COMPRESSTYPE] = CONST_GZIP_ENCODING;

        return axios.default({
            url: this.httpType + this.hostName + resourceUri + "?" + TOPIC_ID + "=" + encodeURIComponent(topic),
            method: "post",
            data: compressedBody,
            headers,
            timeout: HTTP_SEND_TIME_OUT,
        });
    }

    /**
     * GetCommonHeadPara 
     * 获取common headers
     * @returns Map<string, string>
     */
    private getCommonHeadPara(contentType: string): Map<string, string>{
        let headParameter: Map<string, string> = new Map();
        headParameter.set(CONST_CONTENT_LENGTH, "0");
        headParameter.set(CONST_CONTENT_TYPE, contentType);
        headParameter.set(CONST_HOST, this.hostName);
        return headParameter;
    }
}
