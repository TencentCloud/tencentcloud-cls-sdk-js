export class Request {
    private mParams: Map<string, string> = new Map();

    /**
     * Get the value of given key in the request
     * @param key 
     * @returns string
     */
    public getParam(key: string): string {
		if (this.mParams.has(key)) {
			return this.mParams.get(key) || "";
		} 
        return "";
	}

    /**
     * Set a key/value pair into the request
     * @param key 
     * @param value 
     */
    public setParam(key: string, value: string): void {
		if (value == null) {
			this.mParams.set(key, "");
		} else {
			this.mParams.set(key, value);
		}
	}

    /**
     * Get all the parameter in the request
     * @returns Map<string, string>
     */
    public getAllParams(): Map<string, string> {
		return this.mParams;
	}
}