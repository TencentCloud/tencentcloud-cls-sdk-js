## CLS JavaScript SDK

腾讯云CLS日志上传SDK, 支持nodejs

## Install
```
npm i tencentcloud-cls-sdk-js
```

## Configuration

| Config Name   | Default | Type            | Required | Description                                                  |
| ------------- | ------- | --------------- | -------- | ------------------------------------------------------------ |
| secretId     |         | string          | true     | Your access key to CLS                                       |
| secretKey  |         | string          | true     | Your secret to access CLS                                    |
| endpoint      |         | string          | true     | Your CLS endpoint, e.g. ap-guangzhou.cls.tencentcs.com |
| sourceIp      |         | string          | true     | 本机ip                                        |
| retry_times      |         | integer          | true     | 重试次数                                      |
| topic_id      |         | string          | true     | 日志服务对应topic_id                                      |


## CLS Host

**本项目使用 日志服务 API 2017**


https://cloud.tencent.com/document/product/614/18940


## Example

```

// 日志服务对应topic_id； 必填参数
let topicID = "xxxx"

let client = new AsyncClient({
            endpoint: "ap-guangzhou.cls.tencentcs.com",
            secretId: "[secretId]", 
            secretKey: "[secretKey]",
            sourceIp: "127.0.0.1",
            retry_times: 10,
        });

let item = new LogItem()
item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world2"))
item.setTime(Math.floor(Date.now()/1000))

let loggroup = new LogGroup()
loggroup.addLogs(item)
let request = new PutLogsRequest(topicID, loggroup);
let data = await client.PutLogs(request);
console.log(data)
```

## Features

- 支持lz4压缩上传
