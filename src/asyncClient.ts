import { AsyncClientOptions } from './models';
import  TencentCloudClsSDKException from './exception'
import { CONST_CONTENT_LENGTH, CONST_CONTENT_TYPE, CONST_HOST, CONST_JSON, CONST_PROTO_BUF, CONST_MAX_PUT_SIZE, TOPIC_ID, SORT, CONST_HTTP_METHOD_POST, UPLOAD_LOG_RESOURCE_URI, CONST_AUTHORIZATION, TOPIC_IDS, START_TIME, END_TIME, LOGSET_ID, LIMIT, CONTEXT,  CONST_HTTP_METHOD_GET, QUERY_STRING, HEADER_AUTH_MODE, HEADER_UIN, AUTH_MODE_WEAK, INVALID_UIN, SDK_USER_AGENT } from './common/constants';
import { PutLogsRequest } from './request/putLogsRequest';
import { signature } from "./common/sign";
import * as axios from "axios"
import { Response } from './response/response';
import { SearchLogRequest } from './request/searchResquest';

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
      
        let headParameter = this.getCommonHeadPara(CONST_PROTO_BUF);
        request.setParam(TOPIC_ID, request.getTopic());
        let urlParameter = request.getAllParams();

        for (let retryTimes = 0; retryTimes < this.retry_times; retryTimes++) { 
            try {
                let res = await this.sendLogs(CONST_HTTP_METHOD_POST, UPLOAD_LOG_RESOURCE_URI, urlParameter, headParameter, logBytes, request.getTopic());
                let putLogRequest = new Response();
                putLogRequest.setAllHeaders(res.headers);
                putLogRequest.setHttpStatusCode(res.status);
                if (putLogRequest.getHttpStatusCode()==200) {
                    return putLogRequest;
                }
                // 401 不重试（配置类错误，重试无意义）
                if (putLogRequest.getHttpStatusCode() == 401) {
                    throw new TencentCloudClsSDKException(
                        `send log failed with HTTP 401. topic=${request.getTopic()}`
                    );
                }
                if (retryTimes+1 >= this.retry_times) { 
                    throw new TencentCloudClsSDKException("send log failed and exceed retry times");
                }
            } catch (error) {
                // 401/413 不重试
                if (error.response && (error.response.status == 413 || error.response.status == 401)) {
                    let putLogRequest = new Response();
                    putLogRequest.setAllHeaders(error.response.headers);
                    putLogRequest.setHttpStatusCode(error.response.status);
                    if (error.response.status == 401) {
                        throw new TencentCloudClsSDKException(
                            `send log failed with HTTP 401. topic=${request.getTopic()}. response: ${JSON.stringify(error.response.data)}`
                        );
                    }
                    return putLogRequest;
                }
                if (retryTimes+1 >= this.retry_times) { 
                    let putLogRequest = new Response();
                    if (error.response) {
                        putLogRequest.setAllHeaders(error.response.headers);
                        putLogRequest.setHttpStatusCode(error.response.status);
                    }
                    throw new TencentCloudClsSDKException(`send log failed and exceed retry times. error: ${error.message}. request: ${JSON.stringify(putLogRequest)}`);
                }   
            }
        }        
    }


    /**
     * SearchLog
     */    
    public async SearchLog(request: SearchLogRequest): Promise<any> {
        if (request.LogsetId == null || request.LogsetId == undefined || request.LogsetId.length == 0) {
            throw new TencentCloudClsSDKException("logset_id can not be empty")
        }

        if (request.TopicId == null || request.TopicId == undefined || request.TopicId.length == 0) {
            throw new TencentCloudClsSDKException("topic_id can not be empty")
        }

        if (request.StartTime == null || request.StartTime == undefined || request.StartTime.length == 0) {
            throw new TencentCloudClsSDKException("start_time can not be empty")
        }

        if (request.EndTime == null || request.EndTime == undefined || request.EndTime.length == 0) {
            throw new TencentCloudClsSDKException("end_time can not be empty")
        }

        if (request.Limit == null || request.Limit == undefined || request.Limit.length == 0 || parseInt(request.Limit, 10) > 100) {
            throw new TencentCloudClsSDKException("sort parameter is invalid")
        }

        if (request.Sort != "asc" && request.Sort != "desc" ) {
            throw new TencentCloudClsSDKException("sort parameter is invalid")
        }

        // SearchLog 仅支持强鉴权
        if (this.isWeakAuth()) {
            throw new TencentCloudClsSDKException("SearchLog requires SecretID and SecretKey (weak auth is not supported for log consumption)")
        }

        let urlParameter = request.getAllParams();
        urlParameter.set(TOPIC_IDS, request.TopicId);
        urlParameter.set(LOGSET_ID, request.LogsetId);
        urlParameter.set(START_TIME, request.StartTime);
        urlParameter.set(END_TIME, request.EndTime);
        urlParameter.set(LIMIT, request.Limit);
        urlParameter.set(QUERY_STRING, request.QueryString)
        if (request.Context != null && request.Context != undefined && request.Context.length > 0) {
            urlParameter.set(CONTEXT, request.Context);
        }
        urlParameter.set(SORT, request.Sort);

        let headParameter = this.getCommonHeadPara(CONST_JSON);
        headParameter.delete(CONST_CONTENT_LENGTH)
        let signature_str: string = signature(this.secretId, this.secretKey, CONST_HTTP_METHOD_GET, "/searchlog", new Map(), headParameter, 300000);
        headParameter.set(CONST_AUTHORIZATION, signature_str);

        let headers: {[key: string]: string} = {};
        headParameter.forEach((value , key) =>{
            headers[key] = value;
        });
        
        if (this.secretToken.length > 0) {
            headers["X-Cls-Token"] = this.secretToken;
        }

        let uri = ""
        urlParameter.forEach((value , key) =>{
            uri+= key+"="+encodeURIComponent(value)+"&";
        });
        uri = uri.substring(0, uri.length-1)
    
        return axios.default({
            url: this.httpType+this.hostName+"/searchlog"+"?"+uri,
            method: "get",
            headers,
        });
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
        headParameter.set(CONST_CONTENT_LENGTH, body.length.toString());

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

        return axios.default({
            url: this.httpType+this.hostName+resourceUri+"?"+TOPIC_ID+"="+topic,
            method: "post",
            data: body,
            headers,
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
