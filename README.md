## CLS JavaScript SDK

腾讯云CLS日志上传SDK, 支持nodejs

## 安装指令
```
npm i tencentcloud-cls-sdk-js
```

## 参数描述

| 参数名 | 类型     | 必填 | Description                                                  |
| ------------- | --------------- | -------- | ------------------------------------------------------------ |
| secretId    | string          | 否（与 uin 二选一） | 访问密钥ID，密钥信息获取请前往[密钥获取](https://console.cloud.tencent.com/cam/capi)。并请确保密钥关联的账号具有相应的[SDK上传日志权限](https://cloud.tencent.com/document/product/614/68374#.E4.BD.BF.E7.94.A8-api-.E4.B8.8A.E4.BC.A0.E6.95.B0.E6.8D.AE) |
| secretKey  | string          | 否（与 uin 二选一）    | 访问密钥KEY，密钥信息获取请前往[密钥获取](https://console.cloud.tencent.com/cam/capi)。并请确保密钥关联的账号具有相应的[SDK上传日志权限](https://cloud.tencent.com/document/product/614/68374#.E4.BD.BF.E7.94.A8-api-.E4.B8.8A.E4.BC.A0.E6.95.B0.E6.8D.AE) |
| uin         | string          | 否（与 secretId/secretKey 二选一） | 弱鉴权（免密）账号 Uin，纯数字字符串。详见下方「弱鉴权（免密）上报」章节 |
| endpoint      | string          | 是  | 访问目标日志主题所在地域的域名, e.g. ap-guangzhou.cls.tencentcs.com，详情请参见[可用地域](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D) |
| sourceIp      | string          | 否   | 源IP地址              |
| retry_times      | integer          | 是    | 重试次数                                      |
| topic_id      | string          | 是    | 目标CLS日志服务日志主题ID                                  |

### 注意： 

endpoint填写请参考[可用地域](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D)中 **API上传日志** Tab中的域名![image-20230403191435319](https://github.com/TencentCloud/tencentcloud-cls-sdk-js/blob/main/demo.png)


## 请求样例（强鉴权 AK/SK）

```typescript
import { AsyncClient, LogItem, Content, LogGroup, PutLogsRequest } from 'tencentcloud-cls-sdk-js';

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
    // 重试次数： 必填参数
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

---

## 弱鉴权（免密）上报

### **前置条件（重要）**

> **目标日志主题必须在控制台开启「匿名上传 → API/SDK 上传日志」，否则一律返回 HTTP 401。**

### 配置示例

```typescript
import { AsyncClient, LogItem, Content, LogGroup, PutLogsRequest } from 'tencentcloud-cls-sdk-js';

let topicID = "your-topic-id"

let client = new AsyncClient({
    endpoint: "ap-guangzhou.cls.tencentcs.com",
    // 弱鉴权：只需填 uin，无需 secretId/secretKey
    uin: "100012345678",
    sourceIp: "127.0.0.1",
    retry_times: 10,
});

let item = new LogItem()
item.pushBack(new Content("__CONTENT__", "hello world"))
item.setTime(Math.floor(Date.now()/1000))

let loggroup = new LogGroup()
loggroup.addLogs(item)
let request = new PutLogsRequest(topicID, loggroup);
let data = await client.PutLogs(request);
console.log(data)
```

### 鉴权模式判定规则

SDK 通过凭证填写情况**隐式推断**鉴权模式，无需额外开关：

| secretId/secretKey | uin | 行为 |
|-------------------|-----|------|
| 齐全 | 未填 | 强鉴权（现状不变） |
| 齐全 | 已填 | **强鉴权，uin 被静默忽略** |
| 不齐/未填 | 已填且合法 | **弱鉴权（免密）** |
| 不齐/未填 | 未填 | 构造期报错「缺少密钥」 |
| 不齐/未填 | 非纯数字 | 构造期报错「InvalidUin」 |

> **AK/SK 优先**：secretId/secretKey 与 uin 同时填写时，始终以 secretId/secretKey 为准走强鉴权，uin 被忽略。

### 约束说明

- `uin` 必须为**纯数字字符串**，不允许包含字母、负号、空格等。
- `ResetSecretToken()` 在弱鉴权模式下调用会打印 warn 日志并被忽略，不会改变鉴权模式。
- 弱鉴权**仅适用于日志上传**（`PutLogs`），`SearchLog` 等读接口仍需 secretId/secretKey。

### 安全提示

> **弱鉴权等同匿名写入**，不校验身份真实性。任何知道 `uin` + `topic_id` 的人都能向该主题写入日志。
> 
> - 请求可被伪造、可被重放。
> - 建议仅在可信内网环境使用。
> - 敏感业务请使用云 API 密钥（secretId/secretKey）进行强鉴权。

### 范围限制

弱鉴权仅用于日志上传接口 `/structuredlog`，日志消费（SearchLog 等）仍需 AK/SK。

---

## Features

- 支持 deflate 压缩上传（默认开启，减少网络传输体积）
- 支持弱鉴权（免密）上报
- 请求超时保护（默认 60s）
- 401/404/413 等配置类错误不重试
