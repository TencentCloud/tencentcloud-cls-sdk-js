import {Log, LogGroup} from "./common/cls_log";
import {WebTrackerOptions} from "./models/options";
const requesttask = require("@system.requesttask")
import {TOPIC_ID} from "./common/constants";

export class WebTracker {
    private timer: any;
    private time: number;
    private count: number;
    private logs: Log[];
    private url: string;
    private opt: WebTrackerOptions;

    constructor(opt: WebTrackerOptions) {
        this.timer = null;
        this.time = 10;
        this.count = 10;
        this.logs = [];
        if (opt.time != null) {
            this.time = opt.time;
        }
        if (opt.count != null) {
            this.count = opt.count;
        }
        if (opt.host.startsWith("http://") || opt.host.startsWith("https://")) {
            this.url = opt.host + "/tracklog";
        } else {
            this.url = "https://" + opt.host + "/tracklog";
        }
        this.opt = opt;
    }

    private sendInner() {
        if (this.timer != null) {
            if (this.logs.length >= this.count) {
                clearTimeout(this.timer);
                this.timer = null;
                this.sendImmediateInner();
            }
        } else {
            const that = this;
            if (this.logs.length >= this.count || this.time <= 0) {
                this.sendImmediateInner();
            } else {
                this.timer = setTimeout(function () {
                    that.sendImmediateInner();
                }, this.time * 1e3);
            }
        }
    }

    public send(log: Log) {
        this.logs.push(log);
        this.sendInner();
    }

    private platformSend() {
        let source="";
        if (this.opt.source != undefined) {
            source = this.opt.source;
        }
        let onError = this.opt.onPutlogsError
        let logGroup = new LogGroup(source);
        logGroup.setLogs(this.logs);
         requesttask.request({
            url: this.url +"?"+TOPIC_ID+"="+this.opt.topicId,
            method: 'POST',
            data: JSON.stringify(logGroup),
            success: function(res: any) {
                if (res.statusCode != 200 && onError!= undefined) {
                    onError(res);
                }
            },
            fail: function(data: any, code: any) {
                if (onError!= undefined) {
                    onError({data: data, code: code});
                }
            },
        })
    }

    public sendImmediateInner() {
        if (this.logs && this.logs.length > 0) {
            this.platformSend();
            // 处理真实发送
            if (this.timer != null) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            this.logs = [];
        }
    }

    public sendImmediate(log: Log) {
        this.logs.push(log);
        this.sendImmediateInner();
    }

    public sendBatchLogs(logs: Log[]) {
        this.logs.push(...logs);
        this.sendInner();
    }

    public sendBatchLogsImmediate(logs: Log[]) {
        this.logs.push(...logs);
        this.sendImmediateInner();
    }

    public getOpts(): WebTrackerOptions {
        return this.opt;
    }
}
