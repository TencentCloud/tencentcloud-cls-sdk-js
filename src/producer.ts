import {ProducerOptions, Credential} from './models';
import {TencentCloudClsSDKException} from './exception'
import {
    CONST_CONTENT_LENGTH,
    CONST_CONTENT_TYPE,
    CONST_HOST,
    CONST_PROTO_BUF,
    CONST_MAX_PUT_SIZE,
    TOPIC_ID,
    CONST_HTTP_METHOD_POST,
    UPLOAD_LOG_RESOURCE_URI,
    CONST_AUTHORIZATION,
    HTTP_SEND_TIME_OUT, CONST_GZIP_ENCODING
} from './common/constants';
import {signature} from "./common/sign";
import * as axios from "axios"
import {LogGroup, LogItem} from "./common/log";

var zlib = require('zlib');

export class Producer {
    private topic: string;
    private httpType: string;
    private hostName: string;
    private credential: Credential;
    private sendTimeout: number = HTTP_SEND_TIME_OUT;
    private sourceIp: string = "";
    private time: number = 2;
    private count: number = 1000;
    private mem: any;
    private dataHasSend: boolean = true;
    private maxMemLogCount: number = 10000;
    private onSendLogsError?: (res: any) => void;

    constructor(options: ProducerOptions) {
        // 参数校验
        if (options == null) {
            throw new TencentCloudClsSDKException(-1, "options invalid")
        }
        // 校验域名
        if (options.endpoint == null) {
            throw new TencentCloudClsSDKException(-1, "options endpoint can not be empty")
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
        // 校验鉴权信息
        if (options.credential == null) {
            throw new TencentCloudClsSDKException(-1, "credential must be a valid credential")
        }
        if (options.credential.secretId == null || options.credential.secretId.length == 0) {
            throw new TencentCloudClsSDKException(-1, "credential secretId can not be empty")
        }
        if (options.credential.secretKey == null || options.credential.secretKey.length == 0) {
            throw new TencentCloudClsSDKException(-1, "credential secretKey can not be empty")
        }
        this.credential = options.credential;
        // 校验topic是否存在
        if (options.topic_id == null || options.topic_id.length == 0) {
            throw new TencentCloudClsSDKException(-1, "topic_id must be empty")
        }
        this.topic = options.topic_id
        // 校验发送超时时间
        if (options.sendTimeout == null || options.sendTimeout <= 0) {
            this.sendTimeout = HTTP_SEND_TIME_OUT;
        } else {
            this.sendTimeout = options.sendTimeout;
        }
        // 校验异步聚合
        if (options.count != null && options.count > 0) {
            this.count = options.count;
        }
        if (options.time != null && options.time > 0) {
            this.time = options.time;
        }
        if (options.maxMemLogCount != null && options.maxMemLogCount > 0) {
            this.maxMemLogCount = options.maxMemLogCount;
        }
        if (options.sourceIp != null && options.sourceIp.length > 0) {
            this.sourceIp = options.sourceIp;
        }
        // 异步发送回掉函数
        if (options.onSendLogsError != null) {
            this.onSendLogsError = options.onSendLogsError;
        }

        // 内存队列
        this.mem = {
            mdata: [],
            getLength: function () {
                return this.mdata.length;
            },
            add: function (data: any) {
                this.mdata.push(data);
            },
            clear: function (count: any) {
                this.mdata.splice(0, count);
            },
        }
        this.batchInterval();
    }

    public resetSecretToken(credential: Credential): void {
        if (credential == null) {
            throw new TencentCloudClsSDKException(-1, "credential must be a valid credential")
        }
        if (credential.secretId == null || credential.secretId.length == 0) {
            throw new TencentCloudClsSDKException(-1, "credential secretId can not be empty")
        }
        if (credential.secretKey == null || credential.secretKey.length == 0) {
            throw new TencentCloudClsSDKException(-1, "credential secretKey can not be empty")
        }
        this.credential = credential
    }

    private batchInterval() {
        let i = this;
        // 启动数据发送定时任务（支持失败重试机制）
        (function startSendScheduler() {
            setTimeout(async function () {
                    await i.batchSend(); // 执行批量发送
                    startSendScheduler(); // 递归调用自身，实现循环
                },
                i.time * 1000);
        })();
    }

    private async batchSend() {
        try {
            if (this.dataHasSend && this.mem.mdata.length > 0) {
                const memoryData = this.mem.mdata;
                let dataToSend: LogItem[] = memoryData.length >= this.count ? memoryData.slice(0, this.count) : memoryData.slice(0, memoryData.length);
                this.dataHasSend = false
                let logGroup = new LogGroup()
                logGroup.setSource(this.sourceIp)
                let dataSendLengthSize = 0
                let dataSendLengthCount = 0
                let headParameter = this.getCommonHeadPara(CONST_PROTO_BUF)
                let urlParameter = this.getCommonUrlPara()
                for (let i = 0; i < memoryData.length; i++) {
                    let log = dataToSend[i]
                    if (dataSendLengthSize >= 3 * 1024 * 1024) {
                        break
                    }
                    dataSendLengthCount += 1;
                    if (log == undefined) {
                        continue
                    }
                    logGroup.addLogs(log)
                }
                let message = await this.putLogs(urlParameter, headParameter, logGroup.encode())
                if (message.status == 200 || message.status == 401 || message.status == 413 || message.status == 403 || message.status == 400) {
                    this.mem.clear(dataSendLengthCount)
                }
                if (this.onSendLogsError != null) {
                    this.onSendLogsError(message)
                }
                this.dataHasSend = true;
            }
        } catch (e) {
            this.dataHasSend = true;
            console.log(e)
        }
    }

    private calcLogLength(log: LogItem): number {
        let l = log.getLog().time.toString().length
        for (let i = 0; i < log.getLog().contents.length; i++) {
            let key = log.getLog().contents[i].key
            let value = log.getLog().contents[i].value
            if (key === null || key === undefined) {
                throw new TencentCloudClsSDKException(-1, "content key must be empty")
            }
            if (value === null || value === undefined) {
                throw new TencentCloudClsSDKException(-1, "content key must be empty")
            }
            l += key.length + value.length
        }
        return l
    }


    public async send(log: LogItem) {
        if (this.mem.getLength() >= this.maxMemLogCount) {
            this.mem.mdata.shift()
        }
        let len = this.calcLogLength(log)
        if (len <= 0 || len > 1048576) {
            throw new TencentCloudClsSDKException(-1, "InvalidLogSize. logItem invalid log size")
        }
        log.setLength(len)
        this.mem.add(log)
        if (this.mem.getLength() >= this.count) {
            await this.batchSend()
        }
    }

    public async sendImmediate(logs: LogItem[]): Promise<ClsMessage> {
        let logGroup = new LogGroup()
        logGroup.setSource(this.sourceIp);
        for (let i = 0; i < logs.length; i++) {
            logGroup.addLogs(logs[i])
        }
        let body = logGroup.encode()
        if (body.length > CONST_MAX_PUT_SIZE) {
            throw new TencentCloudClsSDKException(-1, `InvalidLogSize. logItems' size exceeds maximum limitation : ${CONST_MAX_PUT_SIZE} bytes, logBytes=${body.length}, topic=${this.topic}`);
        }
        let message = await this.putLogs(this.getCommonUrlPara(), this.getCommonHeadPara(CONST_PROTO_BUF), body)
        if (message.status != 200) {
            throw new TencentCloudClsSDKException(message.status, message.message, message.requestId)
        }
        return message
    }

    /**
     * PutLogs
     * @returns
     * @param urlParameter
     * @param headParameter
     * @param body
     */
    private async putLogs(urlParameter: Map<string, string>, headParameter: Map<string, string>, body: Uint8Array): Promise<ClsMessage> {
        let message: ClsMessage = {status: 0, message: "", requestId: ""};
        try {

            let response = await this.sendLogs(CONST_HTTP_METHOD_POST, UPLOAD_LOG_RESOURCE_URI, urlParameter, headParameter, zlib.deflateRawSync(body))
            if (response) {
                message.status = response.status;
                message.message = response.data;
                message.requestId = response.headers["x-cls-requestid"];
            } else {
                message.status = 0;
                message.message = "internal error";
            }
        } catch (error) {
            if (error.response) {
                message.status = error.response.status;
                message.requestId = error.response.headers["x-cls-requestid"];
                if (error.response.data != null && error.response.data.errorcode != null && error.response.data.errormessage != null) {
                    message.message = JSON.stringify(error.response.data)
                } else {
                    message.message = "internal error";
                }
            } else {
                message.status = 0;
                message.message = error.toString();
            }
        }
        return message
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
    private async sendLogs(method: string, resourceUri: string, urlParameter: Map<string, string>, headParameter: Map<string, string>, body: Uint8Array): Promise<any> {
        headParameter.set(CONST_CONTENT_LENGTH, body.length.toString());
        let signature_str: string = signature(
            this.credential.secretId,
            this.credential.secretKey,
            method, resourceUri, urlParameter, headParameter, 3000000);
        headParameter.set(CONST_AUTHORIZATION, signature_str);
        let headers: { [key: string]: string } = {};
        headParameter.forEach((value, key) => {
            headers[key] = value;
        });
        if (this.credential.token != null && this.credential.token.length > 0) {
            headers["X-Cls-Token"] = this.credential.token;
        }
        headers["x-cls-compress-type"] = CONST_GZIP_ENCODING
        headers[CONST_HOST] = this.hostName
        return axios.default({
            url: this.httpType + this.hostName + resourceUri + "?" + TOPIC_ID + "=" + this.topic,
            method: "post",
            data: body,
            timeout: this.sendTimeout * 1000,
            headers,
        });
    }

    /**
     * GetCommonHeadPara
     * 获取common headers
     * @returns Map<string, string>
     */
    private getCommonHeadPara(contentType: string): Map<string, string> {
        let headParameter: Map<string, string> = new Map();
        headParameter.set(CONST_CONTENT_TYPE, contentType);
        return headParameter;
    }

    /**
     * GetCommonHeadPara
     * 获取common headers
     * @returns Map<string, string>
     */
    private getCommonUrlPara(): Map<string, string> {
        let headParameter: Map<string, string> = new Map();
        headParameter.set(TOPIC_ID, this.topic);
        return headParameter;
    }
}


/**
 * Credential information class
 */
export interface ClsMessage {
    status: number;
    requestId: string;
    message: string;
}

