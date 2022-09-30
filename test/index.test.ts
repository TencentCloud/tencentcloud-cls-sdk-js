// import * as mocha from 'mocha';
import {LogItem, Content, LogGroup, AsyncClient} from '../src/index'
import { PutLogsRequest } from '../src/request/putLogsRequest';

describe('send log test', () => {
    it('test send logs' , async () => {
        let client = new AsyncClient({
            endpoint: "ap-guangzhou.cls.tencentcs.com",
            sourceIp: "127.0.0.1",
            retry_times: 2,
            compress: true,
        });

        let item = new LogItem()
        item.pushBack(new Content("__CONTENT__", "你好，我来自深圳|hello world"))
        item.setTime(Math.floor(Date.now()/1000))

        let loggroup = new LogGroup()
        loggroup.addLogs(item)
        let request = new PutLogsRequest("123456", loggroup);
        await client.PutLogs(request);
    });
});