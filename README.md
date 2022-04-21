## CLS JavaScript SDK

腾讯云CLS日志上传SDK, 支持nodejs
## Configuration

| Config Name   | Default | Type            | Required | Description                                                  |
| ------------- | ------- | --------------- | -------- | ------------------------------------------------------------ |
| secretId     |         | string          | true     | Your access key to CLS                                       |
| secretKey  |         | string          | true     | Your secret to access CLS                                    |
| endpoint      |         | string          | true     | Your CLS endpoint, e.g. ap-guangzhou.cls.tencentcs.com |
| sourceIp      |         | string          | true     | 本机ip                                        |
| retry_times      |         | integer          | true     | 重试次数                                      |


## CLS Host

**本项目使用 日志服务 API 2017**


https://cloud.tencent.com/document/product/614/18940


## Example

```
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
let request = new PutLogsRequest("[Topic_ID]", loggroup);
let data = await client.PutLogs(request);
console.log(data)
```

## Features

- 支持lz4压缩上传
