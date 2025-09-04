// import * as mocha from 'mocha';
import * as chai from 'chai';

import {LogItem, Content, LogGroup, AsyncClient} from '../src/index'
import { signature } from '../src/common/sign';

 
const expect = chai.expect;
describe('send log test', () => {
    it.skip('test build pb content' , () => {
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

    it.skip('test sign' ,  () => {
        let params: Map<string, string> = new Map()
        let headers: Map<string, string> = new Map()
        params.set('logset_id', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
        headers.set('Host','ap-shanghai.cls.myqcloud.com')
        headers.set('User-Agent', 'AuthSDK')
        signature('SecretIdExample_XXXXXXXXXXXXXXXXXXXXX', 'SecretKeyExample_XXXXXXXXXXXXXXXX', 'GET', '/logset', params,headers, 300);
    });

    it('test send logs' ,async () => {
        let client = new AsyncClient({
            endpoint: "ap-guangzhou-open.cls.tencentcs.com",
            topic_id: "--",
            credential: {secretId:"--", secretKey:"--", token:""},
        });
        let items: LogItem[] = []
        let item = new LogItem()
        item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world"))
        item.setTime(Math.floor(Date.now()/1000))
        items.push(item)
        try {
            await client.sendImmediate(items);
        } catch(err) {
            console.log(err.toString())
        }
    });
});