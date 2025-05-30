## CLS JavaScript SDK

腾讯云CLS日志上传SDK

## Install
```
npm i tencentcloud-cls-sdk-quickapp
```

## Configuration

| Property         | Type                  | Description                              | Default |
|------------------|-----------------------|------------------------------------------|---------|
| host             | string                | -                                        | -       |
| topicId          | string                | 日志主题                                 | -       |
| time             | number (optional)     | 发送时间阈值                             | 10s     |
| count            | number (optional)     | 发送条数阈值                             | 10      |
| source           | string (optional)     | 日志来源                                 | -       |
| onPutlogsError   | function (optional)   | 上传异常回调                             | -       |


## CLS Host


endpoint填写请参考[可用地域](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D)中 **API上传日志** Tab中的域名![image-20230403191435319](https://github.com/TencentCloud/tencentcloud-cls-sdk-js/blob/main/demo.png)


## Example

```
import {Log, WebTracker, WebTrackerOptions} from 'tencentcloud-cls-sdk-quickapp'

 let clsTracker = new WebTracker({
      host: "[域名: http://ap-guangzhou-open.cls.tencentcs.com"],
      topicId: "【topicId】",
      time: 10,
      count: 20,
      source: "127.0.0.1",
  })
  let log = new Log(Date.now())
  log.addContent("hello", "hello world中文")
  log.addContent("world", "你好，我来自深圳|hello world2")
  clsTracker.send(log)   
```

## Function

```
单条日志上传: send(log: Log): void;
单条日志立即上传（time和count参数不生效）:  sendImmediate(log: Log): void;
批量日志上传:  sendBatchLogs(logs: Log[]): void;
批量日志立即上传: sendBatchLogsImmediate(logs: Log[]): void;
```

## Features

- 支持lz4压缩上传
