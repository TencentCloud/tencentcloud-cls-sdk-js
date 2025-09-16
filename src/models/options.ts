export interface WebTrackerOptions {
  host: string; // 日志服务域名，参考文档中“API上传日志域名” https://cloud.tencent.com/document/product/614/18940#2c1f02ac-ac14-4978-be0a-ea0543b48565
  topicId: string; // 日志主题ID
  time?: number; // 发送时间阈值，单位秒，默认10秒
  count?: number; // 发送条数阈值，默认10条
  maxRequestCount?: number; // 最大请求次数，默认10次
  showConsoleError?: boolean; // 是否打印控制台错误信息，默认打印
  source?: string; // 日志来源IP
}
