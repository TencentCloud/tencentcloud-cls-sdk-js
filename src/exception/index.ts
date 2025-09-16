/**
 * @inner
 */
export class TencentCloudClsSDKException extends Error {
  requestId: string
  status: number

  constructor(status:number, message: string, requestId = "") {
    super(message)
    this.status = status
    this.requestId = requestId || ""
    this.name = 'TencentCloudClsSDKException';
    Object.setPrototypeOf(this, TencentCloudClsSDKException.prototype);
    // 保持堆栈跟踪
    Error.captureStackTrace(this, this.constructor);
  }

  getMessage(): string {
    return this.message
  }

  getRequestId(): string {
    return this.requestId
  }

  toString(): string {
    return (
      "[TencentCloudSDKException]" +
      "message:" +
      this.getMessage() +
      "  requestId:" +
      this.getRequestId() +
          "status:" + this.status
    )
  }

  toLocaleString(): string {
    return (
      "[TencentCloudSDKException]" +
      "message:" +
      this.message +
      "  requestId:" +
      this.requestId
    )
  }

}

