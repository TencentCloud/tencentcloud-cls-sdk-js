## CLS JavaScript SDK

腾讯云CLS日志上传SDK, 支持nodejs

## 安装指令
```
npm i tencentcloud-cls-sdk-js
```

## 参数描述

| 参数名 | 类型     | 必填 | Description                                                  |
| ------------- | --------------- | -------- | ------------------------------------------------------------ |
| secretId    | string          | 是 | 访问密钥ID， 点击[这里](https://console.cloud.tencent.com/cam/capi)获取 |
| secretKey  | string          | 是    | 访问密钥KEY， 点击[这里](https://console.cloud.tencent.com/cam/capi)获取 |
| endpoint      | string          | 是  | 访问目标日志主题所在地域的域名, e.g. ap-guangzhou.cls.tencentcs.com，详情请参见[可用地域](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D) |
| sourceIp      | string          | 否   | 源IP地址              |
| retry_times      | integer          | 是    | 重试次数                                      |
| topic_id      | string          | 是    | 目标CLS日志服务日志主题ID                                  |

### 注意： 

endpoint填写请参考[可用地域](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D)中 **API上传日志** Tab中的域名![image-20230403191435319](https://github.com/TencentCloud/tencentcloud-cls-sdk-js/blob/main/demo.png)


## 请求样例

```

// CLS日志服务日志主题ID； 必填参数
let topicID = "xxxx"

let client = new AsyncClient({
						// 目标日志主题所在地域域名； 必填参数
            endpoint: "ap-guangzhou.cls.tencentcs.com",
            // 访问密钥ID； 必填参数
            secretId: "[secretId]", 
            // 访问密钥KEY； 必填参数
            secretKey: "[secretKey]",
            // 源IP地址： 选填参数， 为空则自动填充本机IP
            sourceIp: "127.0.0.1",
            // 重试次数： 必填参数， 为空则自动填充本机IP
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
