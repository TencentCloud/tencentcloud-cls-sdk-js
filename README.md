## CLS JavaScript SDK

腾讯云CLS日志上传SDK

## Install
```
npm i tencentcloud-cls-sdk-js-mini
```

## Configuration

| Config Name   | Default | Type            | Required | Description                                                  |
| ------------- | ------- | --------------- | -------- | ------------------------------------------------------------ |
| endpoint      |         | string          | true     | Your CLS endpoint, e.g. ap-guangzhou.cls.tencentcs.com |
| retry_times      |         | integer          | true     | 重试次数                                      |


## CLS Host

**本项目使用 日志服务 API 2017**


https://cloud.tencent.com/document/product/614/18940

## Example

```
import {Log, LogGroup, AsyncClient, PutLogsRequest} from 'tencentcloud-cls-sdk-js-mini'

let client = new AsyncClient({
    endpoint: "ap-guangzhou.cls.tencentcs.com",
    retry_times: 10,
});

let logGroup = new LogGroup([IP Address])
logGroup.setSource(【IP Address】)

let log = new Log(Date.now())
log.addContent("hello", "hello world中文")
log.addContent("world", "你好，我来自深圳|hello world2")
logGroup.addLog(log)

let request = new PutLogsRequest("【topicID】", logGroup);
let data = await client.PutLogs(request)

```

## Features

- 支持lz4压缩上传
