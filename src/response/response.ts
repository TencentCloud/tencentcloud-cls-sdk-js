export class Response {
  private  httpStatusCode: number = 0;
  private  mHeaders:{[key: string]: any} = {};
  private  errorCode: string = "";
  private  errorMessage: string = "";

  /**
    * 获取指定key的header
   * @param key 
    * @returns Array[]
    */
  public getHeader(key: string): any[] {
    return this.mHeaders[key] ?  this.mHeaders[key] : []
	}

  /**
    * 设置http status code
    * @param code 
    */
  public setHttpStatusCode(code: number): void {
		this.httpStatusCode = code;
	}

  /**
    * 设置 error code
    * @param code 
    */
   public setErrorCode(code: string): void {
		this.errorCode = code;
	}

  /**
  * 设置 setErrorMessage
  * @param errMessage
  */
  public setErrorMessage(errMessage: string): void {
    this.errorMessage = errMessage;
  }

  /**
    * 获取http status code
    * @returns number
    */
  public getHttpStatusCode(): number {
		return this.httpStatusCode;
	}

  /**
    * 获取http status code
    * @returns number
    */
   public getErrorCode(): string {
		return this.errorCode;
	}

  /**
    * 获取http status code
    * @returns number
    */
   public getErrorMessage(): string {
		return this.errorMessage;
	}

  /**
    * 设置header
    * @param headers 
    */
  public setAllHeaders(headers: {[key: string]: any}): void {
		this.mHeaders = headers
	}

  /**
    * set header
    * @returns 
    */
  public getAllHeaders(): {[key: string]: any} {
		return this.mHeaders;
	}
}