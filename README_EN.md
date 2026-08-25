# CLS JavaScript SDK

English | [简体中文](./README.md)

Tencent Cloud CLS Log Upload SDK for Node.js.

## Installation

```bash
npm i tencentcloud-cls-sdk-js
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| endpoint | string | Yes | Regional domain of the target log topic, e.g. `ap-guangzhou.cls.tencentcs.com`. See [Available Regions](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D) |
| secretId | string | No (either secretId/secretKey or uin) | Access Key ID, [get here](https://console.cloud.tencent.com/cam/capi) |
| secretKey | string | No (either secretId/secretKey or uin) | Access Key Secret, [get here](https://console.cloud.tencent.com/cam/capi) |
| uin | string | No (either secretId/secretKey or uin) | Weak auth (password-free) account Uin, digits-only string. See "Weak Auth" section below |
| sourceIp | string | Yes | Source IP address |
| retry_times | number | Yes | Retry count |
| secretToken | string | No | Temporary credential token |
| user_agent | string | No | Custom User-Agent, appended after the default UA |

### Note

Please refer to the **API Log Upload** tab in [Available Regions](https://cloud.tencent.com/document/product/614/18940#.E5.9F.9F.E5.90.8D) for the correct endpoint domain.

## Example (Strong Auth with AK/SK)

```typescript
import { AsyncClient, LogItem, Content, LogGroup, PutLogsRequest } from 'tencentcloud-cls-sdk-js';

let topicID = "your-topic-id"

let client = new AsyncClient({
    endpoint: "ap-guangzhou.cls.tencentcs.com",
    secretId: "[secretId]",
    secretKey: "[secretKey]",
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

---

## Weak Auth (Password-Free) Upload

### **Prerequisites (Important)**

> **The target log topic must have "Anonymous Upload -> API/SDK Log Upload" enabled in the console, otherwise HTTP 401 will always be returned.**

### Configuration Example

```typescript
import { AsyncClient, LogItem, Content, LogGroup, PutLogsRequest } from 'tencentcloud-cls-sdk-js';

let topicID = "your-topic-id"

let client = new AsyncClient({
    endpoint: "ap-guangzhou.cls.tencentcs.com",
    // Weak auth: only uin is needed, no secretId/secretKey required
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

### Auth Mode Decision Rules

The SDK **implicitly infers** the auth mode based on credential configuration — no explicit switch is needed:

| secretId/secretKey | uin | Behavior |
|-------------------|-----|----------|
| Both provided | Not set | Strong auth (unchanged) |
| Both provided | Set | **Strong auth, uin silently ignored** |
| Missing/empty | Set and valid | **Weak auth (password-free)** |
| Missing/empty | Not set | Throws error at construction: "missing credentials" |
| Missing/empty | Non-digit string | Throws error at construction: "InvalidUin" |

> **AK/SK takes priority**: When both secretId/secretKey and uin are provided, strong auth is always used and uin is ignored.

### Constraints

- `uin` must be a **digits-only string** — no letters, negative signs, or spaces allowed.
- `ResetSecretToken()` in weak auth mode will print a warning and be ignored without changing the auth mode.
- Weak auth is **only applicable to log upload** (`PutLogs`).

### Security Notice

> **Weak auth is equivalent to anonymous write** — it does not verify the caller's identity. Anyone who knows the `uin` + `topic_id` can write logs to that topic.
>
> - Requests can be forged or replayed.
> - Recommended only for use in trusted internal networks.
> - For sensitive workloads, use Cloud API credentials (secretId/secretKey) for strong authentication.

### Scope Limitation

Weak auth is only supported for the log upload endpoint `/structuredlog`.

---

## Features

- Deflate compression enabled by default (reduces network transfer size)
- Weak auth (password-free) upload support
- Custom User-Agent support
- Request timeout protection (default 60s)
- No retry on 401/404/413 configuration errors
