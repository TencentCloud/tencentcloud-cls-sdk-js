/**
 * cls log
 */

interface LogData {
  time: number;
  contents?: { [key: string]: string };
}
interface LogGroupData {
  logs: LogData[];
  source?: string;
}

export class Log {
  private time: number;
  private contents: { [key: string]: string } = {};
  private size = 3; // 3 = 大括号+逗号 {},
  private requestCount = 0; // 请求次数

  /**
   * 初始化log
   * @param time 当前日志时间
   */
  constructor(time: number) {
    this.setTime(time);
  }

  /**
   * 设置日志时间
   * @param time 日志时间
   */
  public setTime(time: number) {
    this.time = time;
    this.size += time.toString().length + 4; // 4 = 冒号+双引号+逗号 "time":123456789,
  }

  /**
   * 获取日志时间
   * @returns number
   */
  public getTime(): number {
    return this.time;
  }

  /**
   * 增加日志字段， key/value 必须都是字符串
   * @param key string
   * @param value string
   */
  public addContent(key: string, value: string) {
    this.contents[key] = value;
    this.size += key.length + value.length + 6; // 6 = 冒号+双引号+逗号 "key":"value",
  }

  /**
   * 获取日志大小
   */
  public getSize() {
    return this.size;
  }
  /**
   * 获取日志内容
   */
  public getContents() {
    return this.contents;
  }
  /**
   * 获取日志内容键值数量
   */
  public getContentKeyCount() {
    return Object.keys(this.contents).length;
  }

  public toLogData(): LogData {
    return {
      time: this.getTime(),
      contents: this.getContents(),
    };
  }

  public getRequestCount() {
    return this.requestCount;
  }

  public requestCountPlusOne() {
    this.requestCount += 1;
  }
}

export class LogGroup {
  /**
   * source 来源ip
   */
  private source: string;
  private contextflow: string;
  private filename: string;
  private logs: Log[] = [];
  constructor(source: string, filename?: string, contextflow?: string) {
    this.source = source;
    if (filename != null && filename != undefined) {
      this.filename = '';
    }
    if (contextflow != null && contextflow != undefined) {
      this.contextflow = '';
    }
  }

  public setSource(source: string) {
    this.source = source;
  }

  public getSource(): string {
    return this.source;
  }

  public setContextFlow() {
    this.contextflow = this.contextflow;
  }

  public getContextFlow(): string {
    return this.contextflow;
  }

  public setFilename(filename: string) {
    this.filename = filename;
  }

  public getFilename(): string {
    return this.filename;
  }

  public setLogs(logs: Log[]) {
    this.logs = logs;
  }

  public getLogs(): Log[] {
    return this.logs;
  }

  public addLog(log: Log) {
    this.logs.push(log);
  }

  public toString() {
    return JSON.stringify(this.toLogGroupData());
  }

  public toLogGroupData(): LogGroupData {
    const data: LogGroupData = {
      logs: this.logs.filter((log) => log.getContentKeyCount() > 0).map((log) => log.toLogData()),
    };
    if (this.source) {
      data.source = this.source;
    }
    return data;
  }
}
