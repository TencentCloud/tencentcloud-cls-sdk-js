import {Log, LogGroup} from "./common/cls_log";
import {WebTrackerOptions} from "./models/options";
import {TencentCloudClsSDKException} from "./exception"

const nativeFetch = require('@system.fetch')
// const storage = require("@system.storage")

import {TOPIC_ID} from "./common/constants";

export class WebTracker {
    private time: number;
    private count: number;
    private url: string;
    private opt: WebTrackerOptions;
    private mem: any;
    private dataHasSend: boolean = true;
    private maxMemLogCount: number = 500;
    // private syncStorage: boolean = false;
    // private dataHasChange: boolean = false;

    constructor(opt: WebTrackerOptions) {
        this.time = 10;
        this.count = 100;
        if (opt.time != null && opt.time > 0) {
            this.time = opt.time;
        }
        if (opt.count != null && opt.count > 0) {
            this.count = opt.count;
        }
        if (opt.host.startsWith("http://") || opt.host.startsWith("https://")) {
            this.url = opt.host + "/tracklog";
        } else {
            this.url = "https://" + opt.host + "/tracklog";
        }
        this.opt = opt;
        // 内存数据队列（用于批量发送）
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
        if (this.opt.maxMemLogCount != null && this.opt.maxMemLogCount > 0) {
            this.maxMemLogCount = this.opt.maxMemLogCount;
        }
        this.batchInterval();
    }

    private platformSend(logs: Log[]) {
        let source = "";
        if (this.opt.source != undefined) {
            source = this.opt.source;
        }
        let onError = this.opt.onPutlogsError
        let logGroup = new LogGroup(source);
        logGroup.setLogs(logs);

        nativeFetch.fetch({
            url: this.url + "?" + TOPIC_ID + "=" + this.opt.topicId,
            method: 'POST',
            data: JSON.stringify(logGroup),
            success: function (res: any) {
                if (res.code != 200 && onError != undefined) {
                    onError(res);
                }
            },
            fail: function (data: any, code: any) {
                if (onError != undefined) {
                    onError({data: data, code: code});
                }
            },
        })
    }

    private batchInterval() {
        let i = this;
        // 启动数据发送定时任务（支持失败重试机制）
        (function startSendScheduler() {
            setTimeout(function () {
                    i.batchSend(); // 执行批量发送
                    startSendScheduler(); // 递归调用自身，实现循环
                },
                i.time * 1000);
        })();

        // 启动数据写入定时任务（固定间隔）
        // (function startWriteScheduler() {
        //     setTimeout(function() {
        //             i.batchWrite(); // 执行批量写入
        //             startWriteScheduler(); // 递归调用自身，实现循环
        //         },
        //         500) // 固定500毫秒间隔
        // })();
    }

    // private batchWrite() {
    //     if (this.syncStorage && this.dataHasChange) {
    //         let t = this;
    //         storage.set({
    //             key: "cls_sdk_prepare_data",
    //             value: this.mem.mdata,
    //             success: function () {
    //                 t.dataHasChange = !1
    //             }
    //         })
    //     }
    // }

    private batchSend() {
        try {
            if (this.dataHasSend && this.mem.mdata.length > 0) {
                this.dataHasSend = false;
                let source = "";
                if (this.opt.source != undefined) {
                    source = this.opt.source;
                }
                let logGroup = new LogGroup(source);
                let dataSendLengthSize = 0
                let dataSendLengthCount = 0
                let dataLength = this.mem.mdata.length;
                for (let i = 0; i < dataLength; i++) {
                    let log: Log = this.mem.mdata[i]
                    if (dataSendLengthSize >= 3 * 1024 * 1024 || i > this.count - 1) {
                        break
                    }
                    dataSendLengthCount += 1;
                    if (log == undefined) {
                        continue
                    }
                    dataSendLengthSize += log.getLength();
                    logGroup.addLog(log)
                }
                let onError = this.opt.onPutlogsError
                let i = this;
                nativeFetch.fetch({
                    url: this.url + "?" + TOPIC_ID + "=" + this.opt.topicId,
                    method: 'POST',
                    data: JSON.stringify(logGroup),
                    success: function (res: any) {
                        i.dataHasSend = true;
                        if (res.code != 200 && onError != undefined) {
                            onError(res);
                        }
                        if (res.code == 200 || res.code == 401 || res.code == 413 || res.code == 403 || res.code == 400) {
                            i.mem.clear(dataSendLengthCount)
                            // i.dataHasChange = true
                            // i.batchWrite()
                        }
                    },
                    fail: function (data: any, code: any) {
                        i.dataHasSend = true;
                        if (onError != undefined) {
                            onError({data: data, code: code});
                        }
                    },
                })
            }
        } catch (e) {
            this.dataHasSend = true;
            console.error(e);
        }
    }

    private calcLogLength(log: Log): number {
        let l = log.getTime().toString().length
        let contents = log.getContents()
        for (const [key, value] of Object.entries(contents)) {
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

    public send(log: Log) {
        if (this.mem.getLength() >= this.maxMemLogCount) {
            this.mem.mdata.shift()
        }
        let len = this.calcLogLength(log)
        if (len <= 0 || len > 1048576) {
            throw new TencentCloudClsSDKException(-1, "InvalidLogSize. logItem invalid log size")
        }
        log.setLength(len)
        this.mem.add(log)
        if (this.mem.getLength() >= this.count && this.dataHasSend) {
            this.batchSend()
        }
    }

    public sendImmediate(log: Log) {
        let logs = [];
        logs.push(log);
        let len = this.calcLogLength(log)
        if (len <= 0 || len > 1048576) {
            throw new TencentCloudClsSDKException(-1, "InvalidLogSize. logItem invalid log size")
        }
        log.setLength(len)
        this.platformSend(logs)
    }

    public getOpts(): WebTrackerOptions {
        return this.opt;
    }
}
