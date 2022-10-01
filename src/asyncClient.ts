import { AsyncClientOptions } from './models';
import  TencentCloudClsSDKException from './exception'
import { CONST_CONTENT_LENGTH, CONST_CONTENT_TYPE, CONST_HOST, CONST_JSON, CONST_MAX_PUT_SIZE, TOPIC_ID, UPLOAD_LOG_RESOURCE_URI} from './common/constants';
import { PutLogsRequest } from './request/putLogsRequest';
import * as axios from "axios"
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
     * retry_times 上传失败重试次数
     */
    private retry_times: number;

    constructor(options: AsyncClientOptions) { 
        // 参数校验
        if (options == null || options == undefined) {
            throw new TencentCloudClsSDKException("AsyncClientOptions invalid")
        }

        if (options.endpoint == null || options.endpoint == undefined || options.endpoint.length == 0) {
            throw new TencentCloudClsSDKException("options endpoint can not be empty")
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
    }

    /**
     * PutLogs
     * @param request 
     * @returns 
     */
    public async PutLogs(request: PutLogsRequest): Promise<any> {
        let logBytes = request.encodeLogItems();
        if (logBytes.length > CONST_MAX_PUT_SIZE) {
            throw new TencentCloudClsSDKException(`InvalidLogSize. logItems' size exceeds maximum limitation : ${CONST_MAX_PUT_SIZE} bytes, logBytes=${logBytes.length}, topic=${request.getTopic()}`);
        }
      
        let headParameter = this.getCommonHeadPara(CONST_JSON);
        request.setParam(TOPIC_ID, request.getTopic());
      
        for (let retryTimes = 0; retryTimes < this.retry_times; retryTimes++) { 
            try {
                let res = await this.sendLogs(UPLOAD_LOG_RESOURCE_URI, headParameter, logBytes, request.getTopic());
                let putLogRequest = new Response();
                putLogRequest.setAllHeaders(res.headers);
                putLogRequest.setHttpStatusCode(res.status);
                if (putLogRequest.getHttpStatusCode()==200) {
                    return putLogRequest;
                }
                if (retryTimes+1 >= this.retry_times) { 
                    throw new TencentCloudClsSDKException("send log failed and exceed retry times");
                }
            } catch (error) {
                let requestId = ""
                if (error.response &&error.response.headers) {
                    requestId = error.response.headers['x-cls-requestid'];
                }

                if (error.response && error.response.status==413) {
                    let putLogRequest = new Response();
                    putLogRequest.setAllHeaders(error.response.headers);
                    putLogRequest.setHttpStatusCode(error.response.status);
                    
                    if (error.response.data.errorcode != null && error.response.data.errorcode!= undefined) {
                        putLogRequest.setErrorCode(error.response.data.errorcode);
                    }

                    if (error.response.data.errormessage != null && error.response.data.errormessage!= undefined) {
                        putLogRequest.setErrorMessage(error.response.data.errormessage);
                    }

                    return putLogRequest;
                }
                if (retryTimes+1 >= this.retry_times) {
                    let putLogRequest = new Response();
                    if (error.response) {
                        putLogRequest.setAllHeaders(error.response.headers);
                        putLogRequest.setHttpStatusCode(error.response.status);
                        if (error.response.data.errorcode != null && error.response.data.errorcode!= undefined) {
                            putLogRequest.setErrorCode(error.response.data.errorcode);
                        }
    
                        if (error.response.data.errormessage != null && error.response.data.errormessage!= undefined) {
                            putLogRequest.setErrorMessage(error.response.data.errormessage);
                        }
                    }
                    throw new TencentCloudClsSDKException(`send log failed and exceed retry times. reason: ${JSON.stringify(putLogRequest)},  error: ${error.message}.`, requestId);
                }   
            }
        }        
    }
    
    /**
     * sendLogs
     * @param resourceUri 
     * @param headParameter 
     * @param body 
     * @returns 
     */
    private async sendLogs(resourceUri: string, headParameter: Map<string, string>, body: string, topic: string): Promise<any> {
        let data = new TextEncoder().encode(body)
        headParameter.set(CONST_CONTENT_LENGTH, data.length.toString());;
        let headers: {[key: string]: string} = {};
        headParameter.forEach((value , key) =>{
            headers[key] = value;
        });
        return axios.default({
            url: this.httpType+this.hostName+resourceUri+"?"+TOPIC_ID+"="+topic,
            method: "post",
            data: data,
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

