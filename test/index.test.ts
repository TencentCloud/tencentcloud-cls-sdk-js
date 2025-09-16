// import * as mocha from 'mocha';
import * as chai from 'chai';

import {LogItem, Content, LogGroup, Producer, TencentCloudClsSDKException} from '../src/index'
import {signature} from '../src/common/sign';

const expect = chai.expect;
describe('send log test', () => {
    it.skip('test build pb content', () => {
        let item = new LogItem()
        item.pushBack(new Content("hello", "world"))
        item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world"))
        item.setTime(1635509064)

        let loggroup = new LogGroup()
        loggroup.addLogs(item)

        let message = loggroup.encode()
        let decode_str = loggroup.decode(message);
        expect(JSON.stringify(decode_str)).to.equal('{"logGroupList":[{"logs":[{"time":"1635509064","contents":[{"key":"hello","value":"world"},{"key":"__CONTENT__","value":"你好，我来自深圳|hello world"}]}]}]}')

        let verify_str = loggroup.verify(message);
        expect(verify_str).to.equal(null)
    });

    it.skip('test sign', () => {
        let params: Map<string, string> = new Map()
        let headers: Map<string, string> = new Map()
        params.set('logset_id', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        headers.set('Host', 'ap-shanghai.cls.myqcloud.com')
        headers.set('User-Agent', 'AuthSDK')
        signature('SecretIdExample_XXXXXXXXXXXXXXXXXXXXX', 'SecretKeyExample_XXXXXXXXXXXXXXXX', 'GET', '/logset', params, headers, 300);
    });

    it('test send logs', async () => {
        let client = new Producer({
            endpoint: "ap-xian-ec.cls.tencentyun.com",
            topic_id: "dbb3d9f9-47fc-46f5-a0ee-",
            credential: {
                secretId: "**",
                secretKey: "**",
                token: ""
            },
        });
        let items: LogItem[] = []
        let item = new LogItem()
        item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world"))
        item.setTime(Math.floor(Date.now() / 1000))
        items.push(item)
        try {
            let message = await client.sendImmediate(items);
            console.log(message)
        } catch (error) {
            if (error instanceof TencentCloudClsSDKException) {
                console.log(error.toString())
            }
        }
    });
});