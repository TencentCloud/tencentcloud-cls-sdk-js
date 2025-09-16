# Tencent Cloud CLS JavaScript SDK for browser

腾讯云CLS日志上传 Javascript SDK 2.0

本分支只适用于浏览器端使用，不支持小程序、NodeJS等其他环境。

## 前提条件

必须对日志主题“开通匿名上传”功能。

详见[操作步骤1](https://cloud.tencent.com/document/product/614/86669#c918ea38-6411-46ca-8f79-bcf883c216d3)

## 安装
```
npm i tencentcloud-cls-sdk-js-web
```

## 配置

| Config Name     | Default | Type    | Required | Description                                                                                                       |
|-----------------|---------|---------|----------|-------------------------------------------------------------------------------------------------------------------|
| host            |         | string  | true     | 日志服务域名，参考[文档](https://cloud.tencent.com/document/product/614/18940#2c1f02ac-ac14-4978-be0a-ea0543b48565)中“日志上传”域名 |
| topicId         |         | string  | true     | 日志主题ID                                                                                                            |
| time            | 10      | integer | false    | 发送时间阈值，单位秒，默认10秒                                                                                                  |
| count           | 10      | integer | false    | 发送条数阈值，默认10条                                                                                                      |
| maxRequestCount | 10      | integer | false    | 最大请求次数（包括失败重试请求），默认10次                                                                                            |
| showConsoleError| true    | boolean | false    | 是否打印控制台错误信息，默认打印                                                                                                            |
| source          |         | string  | false    | 日志来源IP                                                                                                            |


## 示例

```
import { Log, WebTrackerBrowser } from 'tencentcloud-cls-sdk-js-web';

let clsTracker = new WebTrackerBrowser({
  host: 'https://ap-guangzhou.cls.tencentcs.com',
  topicId: 'YOUR_TOPIC_ID',
});

const log = new Log(Date.now());
log.addContent('hello', 'hello world中文');

clsTracker.send(log);
```

## API

**send()**

说明:  单条数据上传。

参数：Log 类型

示例：

```javascript
const log = new Log(Date.now());
log.addContent('hello', 'hello world中文');

clsTracker.send(log);
```

**sendImmediate()**

说明:  单条数据立即上传，time 和 count 参数此时配置不生效。

参数：Log 类型

示例：

```javascript
const log = new Log(Date.now());
log.addContent('hello', 'hello world中文');

clsTracker.sendImmediate(log);
```

**sendBatchLogs()**

说明:  批量数据上传。

参数：Array<Log> 类型

示例：

```javascript
const log1 = new Log(Date.now());
log1.addContent('name', 'log1');
log1.addContent('value', 1);
const log2 = new Log(Date.now());
log2.addContent('name', 'log2');
log2.addContent('value', 2);

clsTracker.sendBatchLogs([log1, log2]);
```

**sendBatchLogsImmediate()**

说明:  批量数据上传，time 和 count 参数此时配置不生效。

参数：Array<Log> 类型

示例：

```javascript
const log1 = new Log(Date.now());
log1.addContent('name', 'log1');
log1.addContent('value', 1);
const log2 = new Log(Date.now());
log2.addContent('name', 'log2');
log2.addContent('value', 2);

clsTracker.sendBatchLogsImmediate([log1, log2]);
```

## 常见问题

Q: 为什么上报请求失败

A: 
1. 检查初始化配置的 host 域名所在地域 与 topicId 是否匹配
2. 如果确认host和topicId参数正确，且开发者工具出现如下图所示的 CORS 相关报错，请参考 [前提条件](#前提条件) 操作。
![CORS error](https://main.qcloudimg.com/raw/fd13ef5cd916f0d717f374590906a86f.png)


