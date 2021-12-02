export class Response {
    private  httpStatusCode: number = 0;
    private  mHeaders:{[key: string]: any} = {};

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
     * 获取http status code
     * @returns number
     */
    public getHttpStatusCode(): number {
		return this.httpStatusCode;
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