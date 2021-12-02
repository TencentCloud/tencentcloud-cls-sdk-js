## CLS JavaScript SDK

腾讯云CLS日志上传SDK, 支持nodejs和browser.

## Configuration

| Config Name   | Default | Type            | Required | Description                                                  |
| ------------- | ------- | --------------- | -------- | ------------------------------------------------------------ |
| secretId     |         | string          | true     | Your access key to CLS                                       |
| secretKey  |         | string          | true     | Your secret to access CLS                                    |
| endpoint      |         | string          | true     | Your CLS endpoint, e.g. ap-guangzhou.cls.tencentcs.com |
| sourceIp      |         | string          | true     | 本机ip                                        |
| retry_times      |         | integer          | true     | 重试次数                                      |


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |


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