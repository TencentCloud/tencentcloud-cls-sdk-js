import axios, { AxiosResponse, RawAxiosRequestHeaders } from 'axios';

import { Log, LogGroup } from './common/cls_log';
import {
  CONST_CONTENT_TYPE,
  CONST_TEXT_PLAIN,
  HTTP_SEND_TIME_OUT,
  MAX_BEACON_REQUEST_IN_PROGRESS,
  MAX_BODY_SIZE,
  MAX_BODY_SIZE_ON_HIDE,
  MAX_LOG_COUNT_PER_GROUP,
  TOPIC_ID,
  UPLOAD_LOG_RESOURCE_URI,
} from './common/constants';
import TencentCloudClsSDKException from './exception';
import { WebTrackerOptions } from './models/options';
import { Response } from './response/response';
import { createTimeout } from './utils';

export class WebTrackerBrowser {
  private timer: number | null; // 定时器
  private time: number; // 发送时间阈值，默认10s
  private count: number; // 发送条数阈值，默认10条
  private maxRequestCount: number; // 最大请求次数，默认10次
  private url: string; // 请求地址
  private topicId: string; // 日志主题ID
  private opt: WebTrackerOptions; // 传入配置
  private arr: Log[]; // 内存数据队列（用于批量发送）
  private showConsoleError: boolean; // 是否打印控制台错误信息，默认打印
  private beaconRequestNumber: number; // sendBeacon / keepalive 请求数

  constructor(opt: WebTrackerOptions) {
    this.time = 10;
    this.count = 10;
    this.maxRequestCount = 10;
    this.arr = [];
    this.showConsoleError = true;
    if (opt.time != null) {
      this.time = opt.time;
    }
    if (opt.count != null) {
      this.count = opt.count;
    }
    if (opt.maxRequestCount != null) {
      this.maxRequestCount = opt.maxRequestCount;
    }
    if (opt.showConsoleError != null) {
      this.showConsoleError = opt.showConsoleError;
    }
    if (!opt.host) {
      throw new TencentCloudClsSDKException('options host can not be empty');
    }
    if (!opt.topicId) {
      throw new TencentCloudClsSDKException('options topicId can not be empty');
    }
    if (opt.host.startsWith('http://') || opt.host.startsWith('https://')) {
      this.url = `${opt.host}${UPLOAD_LOG_RESOURCE_URI}`;
    } else {
      this.url = `https://${opt.host}${UPLOAD_LOG_RESOURCE_URI}`;
    }
    this.opt = opt;
    this.topicId = opt.topicId;
    this.beaconRequestNumber = 0;

    this.onHide();
  }

  public send(log: Log) {
    this.arr.push(log);
    this.sendInner();
  }

  public sendImmediate(log: Log) {
    this.arr.push(log);
    this.sendImmediateInner();
  }

  public sendBatchLogs(logs: Log[]) {
    this.arr.push(...logs);
    this.sendInner();
  }

  public sendBatchLogsImmediate(logs: Log[]) {
    this.arr.push(...logs);
    this.sendImmediateInner();
  }

  private onHide() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.sendImmediateInner(true);
      }
    });
    // pagehide 兜底，覆盖不支持 visibilitychange 的浏览器
    document.addEventListener('pagehide', () => {
      this.sendImmediateInner(true);
    });
    // beforeunload 兜底，覆盖不支持 pagehide 的浏览器
    document.addEventListener('beforeunload', () => {
      this.sendImmediateInner(true);
    });
    // unload 兜底，覆盖不支持 beforeunload 的浏览器
    document.addEventListener('unload', () => {
      this.sendImmediateInner(true);
    });
  }

  private sendImmediateInner(hide = false) {
    if (this.arr && this.arr.length > 0) {
      this.platformSend(hide);
      if (this.timer != null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      // this.arr = [];
    }
  }

  private sendInner() {
    if (this.timer) {
      if (this.arr.length >= this.count) {
        clearTimeout(this.timer);
        this.timer = null;
        this.sendImmediateInner();
      }
    } else {
      if (this.arr.length >= this.count || this.time <= 0) {
        this.sendImmediateInner();
      } else {
        this.timer = window.setTimeout(() => {
          this.sendImmediateInner();
        }, this.time * 1e3);
      }
    }
  }

  private platformSend(hide = false) {
    while (this.arr.length > 0) {
      // 如果为隐藏场景，则最大body size 为 32768(sendBeacon/keepalive)，否则为 3MB
      const maxBodySize =
        hide &&
        // 限制并发 beacon / keepalive 请求数，避免待发送 body 大小过大导致浏览器底层报错
        this.beaconRequestNumber < MAX_BEACON_REQUEST_IN_PROGRESS
          ? MAX_BODY_SIZE_ON_HIDE
          : MAX_BODY_SIZE;
      let size = 0;
      let logCount = 0;
      for (const log of this.arr) {
        // 至少加入一条日志；从第二条日志开始粗略判断是否超过最大body size
        if (logCount === 0 || (logCount < MAX_LOG_COUNT_PER_GROUP && size + log.getSize() <= maxBodySize)) {
          logCount += 1;
          size += log.getSize();
        } else {
          break;
        }
      }
      const logs = this.arr.splice(0, logCount);

      let source = '';
      if (this.opt.source != null) {
        source = this.opt.source;
      }
      const logGroup = new LogGroup(source);
      logGroup.setLogs(logs);

      const keepalive =
        hide &&
        size <= MAX_BODY_SIZE_ON_HIDE &&
        // 限制并发 beacon / keepalive 请求数，避免待发送 body 大小过大导致浏览器底层报错
        this.beaconRequestNumber < MAX_BEACON_REQUEST_IN_PROGRESS;
      if (keepalive) {
        this.beaconRequestNumber += 1;
      }

      this.logGroupRequest(logGroup, keepalive);
    }
  }

  private logGroupRequest(logGroup: LogGroup, keepalive = false) {
    this.request(logGroup.toString(), keepalive)
      .then((res) => {
        if (res === true) {
          return;
        }

        if (
          !(res.status === 200 || res.status === 400 || res.status === 401 || res.status === 403 || res.status === 413)
        ) {
          // 不是不需要重试的状态码，重试
          this.logGroupRetry(logGroup);
        }

        if (res.status !== 200) {
          if (this.showConsoleError && typeof window?.console?.error === 'function') {
            const requestId = res?.headers['x-cls-requestid'];
            const response = new Response();
            response.setAllHeaders(res.headers);
            response.setHttpStatusCode(res.status);
            response.setErrorCode(res.statusText);
            response.setErrorMessage(res.data);
            const error = new TencentCloudClsSDKException(
              `Failed to send logs to CLS. Detail ${JSON.stringify(response)}.`,
              requestId,
            );
            window.console.error(error);
          }
        }
      })
      .catch((e) => {
        if (this.showConsoleError && typeof window?.console?.error === 'function') {
          let requestId = '';
          if (e?.response?.headers) {
            requestId = e.response.headers['x-cls-requestid'];
          }

          const response = new Response();
          if (e.response) {
            response.setAllHeaders(e.response.headers);
            response.setHttpStatusCode(e.response.status);
            if (e.response.data.errorcode != null) {
              response.setErrorCode(e.response.data.errorcode);
            }

            if (e.response.data.errormessage != null) {
              response.setErrorMessage(e.response.data.errormessage);
            }
          } else {
            response.setErrorCode(e.code);
            response.setErrorMessage(e.message);
            window.console.error(
              'Failed to send logs to CLS. If you see error related to "CORS" above, please make sure you have enabled "Anonymous write" for your CLS Topic! See "Step 1" on doc https://cloud.tencent.com/document/product/614/86669.',
            );
          }
          const error = new TencentCloudClsSDKException(
            `Failed to send logs to CLS. Detail: ${JSON.stringify(response)}, Error: ${e.message}.`,
            requestId,
          );
          window.console.error(error);
        }

        if (
          !(
            e?.response?.status === 200 ||
            e?.response?.status === 400 ||
            e?.response?.status === 401 ||
            e?.response?.status === 403 ||
            e?.response?.status === 413
          )
        ) {
          // 不是不需要重试的状态码，重试
          this.logGroupRetry(logGroup);
        }
      });
  }

  // 重新加入 arr 队列，并重新设置定时器
  private logGroupRetry(logGroup: LogGroup) {
    const logs = logGroup.getLogs();
    logs.forEach((log) => {
      log.requestCountPlusOne();
    });

    const logsToRetry = logs.filter((log) => log.getRequestCount() < this.maxRequestCount);
    if (logsToRetry.length) {
      this.arr.push(...logsToRetry);

      if (!this.timer) {
        const logsMaxRequestCount = logsToRetry.reduce(
          (previousValue, currentValue) => Math.max(previousValue, currentValue.getRequestCount()),
          0,
        );
        this.timer = window.setTimeout(
          () => {
            this.sendImmediateInner();
          },
          // 如无定时器，按照退避算法延长延时时间
          Math.max(this.time * 1e3, createTimeout(logsMaxRequestCount, 5 * 60 * 1000)),
        );
      }
    }
  }

  /**
   * request
   * @param body
   * @param hide
   * @returns
   */
  private async request(body: string, keepalive = false): Promise<AxiosResponse | true> {
    // 暂不支持 sendBeacon
    /* if (
      hide &&
      !fetch &&
      !Object.prototype.hasOwnProperty.call(Request?.prototype || {}, 'keepalive') &&
      navigator?.sendBeacon
    ) {
      // hide 场景，如果不支持 fetch keepalive, 优先使用 sendBeacon 发送日志，兼容性更好
      const blob = new Blob([body], {
        type: CONST_JSON,
      });
      const url = `${this.url}?${TOPIC_ID}=${encodeURIComponent(this.topicId)}`;
      const beaconRes = navigator.sendBeacon(url, blob);
      if (!beaconRes) {
        throw new TencentCloudClsSDKException(`Failed to send logs to CLS. Detail: navigator.sendBeacon failed.`);
      }
      return true;
    } */

    return axios
      .post(this.url, body, {
        adapter: ['fetch', 'xhr', 'http'],
        headers: this.getCommonHeaders(CONST_TEXT_PLAIN),
        params: {
          [TOPIC_ID]: this.topicId,
        },
        timeout: HTTP_SEND_TIME_OUT,
        fetchOptions: {
          keepalive,
        },
      })
      .then((res) => {
        if (keepalive) {
          this.beaconRequestNumber -= 1;
        }
        return res;
      })
      .catch((e) => {
        if (keepalive) {
          this.beaconRequestNumber -= 1;
        }
        throw e;
      });
  }

  /**
   * getCommonHeaders
   * 获取common headers
   * @returns RawAxiosRequestHeaders
   */
  private getCommonHeaders(contentType: string): RawAxiosRequestHeaders {
    const headers: RawAxiosRequestHeaders = {};
    headers[CONST_CONTENT_TYPE] = contentType;
    return headers;
  }
}
